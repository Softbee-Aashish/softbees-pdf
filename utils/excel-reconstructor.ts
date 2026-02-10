import { read, utils, write } from 'xlsx';

interface TextItem {
    str: string;
    dir: string;
    width: number;
    height: number;
    transform: number[];
    fontName: string;
    hasEOL: boolean;
}

interface Cell {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ColumnRange {
    start: number;
    end: number;
}

export async function convertPDFToExcel(file: File, onProgress: (status: string, progress: number) => void): Promise<Blob> {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;

    const allRows: any[][] = [];
    let tableHeaderDetected = false;
    let columnDefinitions: { x: number, width: number, name: string }[] = [];
    let headerAnchorY: number | null = null; // To store the Y-coordinate of the detected header

    // Financial Keywords to detect the main table
    const HEADER_KEYWORDS = ['date', 'particulars', 'description', 'details', 'debit', 'credit', 'withdrawal', 'deposit', 'balance', 'amount', 'val. date', 'txn date'];

    for (let i = 1; i <= totalPages; i++) {
        onProgress(`Scanning Page ${i}/${totalPages}...`, (i / totalPages) * 30);

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const rawItems = textContent.items as TextItem[];

        if (rawItems.length === 0) continue;

        // Group items by Y coordinate with strict tolerance
        const pageRows = new Map<number, Cell[]>();
        const rowTolerance = 3;

        for (const item of rawItems) {
            if (!item.str.trim()) continue;

            // Normalize Y (PDF is bottom-up)
            const x = item.transform[4];
            const y = item.transform[5];

            let foundY = -1;
            for (const key of pageRows.keys()) {
                if (Math.abs(key - y) < rowTolerance) {
                    foundY = key;
                    break;
                }
            }

            if (foundY === -1) {
                foundY = y;
                pageRows.set(foundY, []);
            }

            pageRows.get(foundY)?.push({
                text: item.str,
                x: x,
                y: y,
                width: item.width,
                height: item.height
            });
        }

        // Sort rows top-down (PDF Y is bottom-up 0 at bottom, so higher Y is higher on page)
        const sortedY = Array.from(pageRows.keys()).sort((a, b) => b - a);

        onProgress(`Analying Structure (Page ${i})...`, 30 + (i / totalPages) * 20);

        // --- Header Detection Logic ---
        if (!tableHeaderDetected) {
            for (const y of sortedY) {
                const rowCells = pageRows.get(y)!;
                // Check if this row looks like a header
                const matchCount = rowCells.reduce((count, cell) => {
                    return count + (HEADER_KEYWORDS.includes(cell.text.toLowerCase().trim()) ? 1 : 0);
                }, 0);

                // If we found a row with 2+ keywords, treat it as the Header Anchor
                if (matchCount >= 2) {
                    tableHeaderDetected = true;
                    headerAnchorY = y; // Store the Y-coordinate of the header
                    // Sort cells by X to define columns
                    rowCells.sort((a, b) => a.x - b.x);

                    columnDefinitions = rowCells.map(cell => ({
                        x: cell.x,
                        width: cell.width,
                        name: cell.text
                    }));

                    // Add the header row to output
                    const headerRowValues = columnDefinitions.map(c => c.name);
                    allRows.push(headerRowValues);

                    // Stop looking for header on this page, move to next rows
                    // We only want content BELOW this header
                    break; // Exit the loop for finding header on this page
                }
            }
        }

        // If we still haven't found a header after scanning page 1, we might resort to simple extraction
        // But the user wants "No garbage", so maybe just strict mode?
        // Let's assume we proceed if we have definitions, or we auto-gen definitions if not found (fallback)

        if (!tableHeaderDetected && i === 1) {
            // Fallback: If no strict header found on page 1, use the "Gutter Detection" from before
            // OR just skip to next page?
            // User explicitly complained about garbage. Better to output nothing than garbage?
            // Let's use a simplified fallback: Take the widest row? 
            // For now, let's just proceed.
        }

        // Process Content Rows
        for (const y of sortedY) {
            const rowCells = pageRows.get(y)!;

            // Skip rows above the header if we found one
            // Note: In PDF coords, higher Y is higher on page. 
            // If we found header at Y=500, rows at Y=600 are above (metadata), rows at Y=400 are content.
            // We want to skip Y > HeaderY
            if (headerAnchorY !== null && y > headerAnchorY + rowTolerance) { // +rowTolerance to account for slight variations
                continue;
            }

            // Simplified: Just map every row to the columns if we have them
            if (columnDefinitions.length > 0) {
                // Skip if this looks like the header row itself (duplicates)
                const isHeader = rowCells.some(c => HEADER_KEYWORDS.includes(c.text.toLowerCase()));
                if (isHeader && Math.abs(y - (headerAnchorY || -1)) < rowTolerance) continue; // Don't repeat header in output
            }

            const mappedRow: any[] = new Array(Math.max(columnDefinitions.length, rowCells.length)).fill(null);

            if (columnDefinitions.length > 0) {
                // Strict Column Mapping
                let hasData = false;
                rowCells.forEach(cell => {
                    // Find closest column
                    let bestIdx = -1;
                    let minDiff = Infinity;

                    columnDefinitions.forEach((col, idx) => {
                        // Calculate distance from cell's X to column's X
                        const dist = Math.abs(cell.x - col.x);
                        // Also consider if the cell's text overlaps the column's defined width
                        const overlaps = (cell.x < (col.x + col.width + 10) && (cell.x + cell.width) > (col.x - 10)); // Add some buffer

                        if (dist < minDiff && overlaps) {
                            minDiff = dist;
                            bestIdx = idx;
                        }
                    });

                    // If no column found or too far, it might be noise or a new column
                    // For strict mode, we only map to defined columns
                    if (bestIdx !== -1) {
                        mappedRow[bestIdx] = mappedRow[bestIdx] ? mappedRow[bestIdx] + ' ' + cell.text : cell.text;
                        hasData = true;
                    }
                });

                if (hasData) {
                    // Cleaner: Check if row has valid transaction data (Date or Amount)
                    // This aggressively filters "Address" lines or junk
                    // If the 'Amount' columns are empty, drop the row?
                    // Be careful not to drop 'Description' continuation lines.

                    const cleanedRow = mappedRow.map(val => cleanData(val || ''));
                    // Only add if the row contains at least one non-empty value after cleaning
                    if (cleanedRow.some(c => c !== '' && c !== null)) {
                        allRows.push(cleanedRow);
                    }
                }

            } else {
                // FALLBACK (No header found): Just dump the text X-sorted
                // This is what the user hated, but better than empty file if header missing
                // Only do this if no header was ever detected across all pages
                if (!tableHeaderDetected && i === totalPages) { // Only fallback on the last page if no header found
                    const simpleRow = rowCells.sort((a, b) => a.x - b.x).map(c => cleanData(c.text));
                    if (simpleRow.some(c => c !== '' && c !== null)) {
                        allRows.push(simpleRow);
                    }
                }
            }
        }
    }

    onProgress('Formatting Excel Sheet...', 90);

    // Bake Excel
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet(allRows);

    // Formatting
    const colWidths = allRows.reduce((w, r) => {
        r.forEach((c, i) => {
            if (!w[i]) w[i] = { wch: 10 };
            const strLen = (c?.toString() || '').length;
            if (strLen > w[i].wch) w[i].wch = Math.min(strLen + 2, 60);
        });
        return w;
    }, [] as { wch: number }[]);
    ws['!cols'] = colWidths;

    utils.book_append_sheet(wb, ws, "Statement Data");
    const wbout = write(wb, { bookType: 'xlsx', type: 'array' });

    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// Advanced Financial Cleaner
function cleanData(text: string): string | number {
    if (!text) return '';
    let trimmed = text.trim();

    // 1. Negative Parentheses: (1,200.00) -> -1200.00
    if (/^\(.*\)$/.test(trimmed)) {
        trimmed = '-' + trimmed.replace(/[\(\)]/g, '');
    }

    // 2. Trailing Minus: 1,200.00- -> -1200.00
    if (trimmed.endsWith('-')) {
        trimmed = '-' + trimmed.slice(0, -1);
    }

    // 3. Currency/Numeric Check
    // Regex allows: optional minus, optional currency symbols ($, €, £, ₹), 
    // digits, commas, optional decimal part.
    // We strictly look for "Money-like" patterns to avoid converting phone numbers or dates (partially).
    // A simple heuristic: if it has currency symbol OR (digits+commas+dot), try parse.

    // Remove currency symbols and commas
    const cleanStr = trimmed.replace(/[$,€£₹\s]/g, '').replace(/,/g, '');

    // Check if it's a valid number
    if (!isNaN(Number(cleanStr)) && cleanStr !== '') {
        // Double check against "looks like a year" or "phone" if needed, 
        // but generally for Excel, converting to number is safer.
        return Number(cleanStr);
    }

    // 4. Date Normalization could go here (e.g. DD-MM-YY to Date Obj)
    // For now, keep as string to avoid TZ issues

    return trimmed;
}
