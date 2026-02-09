import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from 'tesseract.js';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface TextItem {
    str: string;
    dir: string;
    width: number;
    height: number;
    transform: number[];
    fontName: string;
    hasEOL: boolean;
}

interface PageData {
    lines: { y: number; text: string; x: number; fontSize: number; isBold: boolean }[];
    tables: any[]; // Placeholder for table structures
}

export async function convertPDFToWord(file: File, onProgress: (status: string, progress: number) => void): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;

    const docChildren: any[] = [];

    for (let i = 1; i <= totalPages; i++) {
        onProgress('Analyzing Page Structure...', (i / totalPages) * 40);

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const operatorList = await page.getOperatorList();

        // 1. Structural Analysis: Group items by Y coordinate (Lines)
        const lineMap = new Map<number, { text: string; x: number; fontSize: number; isBold: boolean }[]>();

        // Basic font analysis (simplified)
        const styles = textContent.styles;

        for (const item of textContent.items as TextItem[]) {
            // Round Y to group approximate lines (tolerance of 2-3 units)
            const y = Math.round(item.transform[5]);
            const x = item.transform[4];
            // Approximation of font size from transform matrix (first element often scales x)
            const fontSize = Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1]);

            // Check bold (hacky, looking at font name)
            const fontObj = styles[item.fontName];
            const isBold = fontObj?.fontFamily?.toLowerCase().includes('bold') || false;

            if (!lineMap.has(y)) {
                lineMap.set(y, []);
            }
            lineMap.get(y)?.push({ text: item.str, x, fontSize, isBold });
        }

        // 2. OCR Fallback (If page is empty of text)
        if (textContent.items.length === 0) {
            onProgress('Deep Scan (OCR) Active...', (i / totalPages) * 60);
            const canvas = document.createElement('canvas');
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                await page.render({ canvasContext: ctx, viewport, canvas }).promise;
                const worker = await createWorker('eng');
                const { data: { text } } = await worker.recognize(canvas);
                await worker.terminate();

                // Add OCR text as a simple paragraph
                docChildren.push(
                    new Paragraph({
                        children: [new TextRun(text)],
                        spacing: { after: 200 } // Add some spacing
                    })
                );
                continue; // Skip structural reconstruction for this page
            }
        }

        // 3. Sort lines Top to Bottom (PDF Y is usually bottom-up, need to check viewport)
        // PDF Start 0,0 is usually Bottom-Left. Docx is Top-Left.
        // We sort descending Y for PDF (Top of page has higher Y)
        const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);

        // 4. Reconstruct Paragraphs
        for (const y of sortedY) {
            const lineItems = lineMap.get(y)?.sort((a, b) => a.x - b.x); // Sort Left to Right
            if (!lineItems) continue;

            const lineText = lineItems.map(item => item.text).join(' ');
            const isBold = lineItems.some(item => item.isBold); // If any part is bold, bold the line (simplification)
            const fontSize = lineItems[0].fontSize;

            // Heading Detection (Simple heuristic: large font)
            const isHeading = fontSize > 14;

            docChildren.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: lineText,
                            bold: isBold || isHeading, // Bold headings
                            size: isHeading ? 32 : 24, // 24 = 12pt
                        }),
                    ],
                    heading: isHeading ? "Heading1" : undefined,
                    spacing: { after: 120 } // Slight spacing between lines
                })
            );
        }

        // Page Break after each page (except last)
        if (i < totalPages) {
            docChildren.push(new Paragraph({ children: [new TextRun({ break: 1 })] })); // Simple break for now, docx PageBreak is better
        }
    }

    onProgress('Building Word Document...', 90);

    // Create Word Document
    const doc = new Document({
        creator: "Soft Bees PDF Pro",
        description: "Reconstructed by Soft Bees Structural Engine",
        sections: [
            {
                properties: {},
                children: docChildren,
            },
        ],
    });

    onProgress('Finalizing...', 100);

    // Pack to Blob
    return await Packer.toBlob(doc);
}
