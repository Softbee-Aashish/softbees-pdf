import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

interface SplitResult {
    blob: Blob;
    filename: string;
    isZip: boolean;
}

/**
 * Parses a range string (e.g., "1-5", "3", "7-9") into an array of 0-based page indices.
 * @param rangeString User input range string
 * @param totalPages Total pages in the PDF
 * @returns Array of unique, sorted 0-based page indices
 */
export function parsePageRange(rangeString: string, totalPages: number): number[] {
    const pages = new Set<number>();
    const parts = rangeString.split(',').map(p => p.trim());

    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(num => parseInt(num));
            if (!isNaN(start) && !isNaN(end)) {
                // Ensure valid range within bounds
                const s = Math.max(1, Math.min(start, totalPages));
                const e = Math.min(totalPages, Math.max(start, end));

                for (let i = s; i <= e; i++) {
                    pages.add(i - 1); // Convert to 0-based index
                }
            }
        } else {
            const page = parseInt(part);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                pages.add(page - 1); // Convert to 0-based index
            }
        }
    }

    return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Splits a PDF into multiple documents based on ranges.
 * If multiple ranges are provided, returns a ZIP file.
 * If a single range is provided, returns a single PDF.
 * 
 * Memory Safety:
 * - Processes ranges sequentially to avoid RAM spikes.
 * - Explicitly manages document lifecycle.
 */
export async function splitPDF(
    file: File,
    ranges: string[],
    baseName: string = 'softbees_split',
    onProgress?: (progress: number) => void
): Promise<SplitResult> {
    const arrayBuffer = await file.arrayBuffer();
    // Load source doc efficiently
    const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    // Helper to generate a single PDF blob from a range
    const generateRangePDF = async (range: string): Promise<{ blob: Blob, filename: string }> => {
        const pageIndices = parsePageRange(range, totalPages);

        if (pageIndices.length === 0) {
            throw new Error(`Invalid range: ${range}`);
        }

        // Create a new independent document (Memory Janitor: New instance per range)
        const newDoc = await PDFDocument.create();

        // Soft Bees Metadata
        newDoc.setProducer('Soft Bees PDF Pro');
        newDoc.setCreator('Soft Bees PDF Tools');

        // Copy pages (Handles overlapping ranges automatically by copying)
        const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);

        for (const page of copiedPages) {
            newDoc.addPage(page);
        }

        const pdfBytes = await newDoc.save();
        const arrayBuffer = pdfBytes.slice().buffer;
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

        return {
            blob,
            filename: `${baseName}_range_${range.replace(/\s/g, '')}_softbees.pdf`
        };
    };

    // Case 1: Single Range
    if (ranges.length === 1) {
        onProgress?.(50);
        const result = await generateRangePDF(ranges[0]);
        onProgress?.(100);
        return { ...result, isZip: false };
    }

    // Case 2: Multiple Ranges -> ZIP
    const zip = new JSZip();
    let completed = 0;

    // Process sequentially for memory safety (Batch Processing)
    for (const range of ranges) {
        try {
            const { blob, filename } = await generateRangePDF(range);
            zip.file(filename, blob);

            // Explicitly revoke blob URL if we created one (not needed here as we passed blob directly to zip, 
            // but good practice if we were using createObjectURL)

            completed++;
            if (onProgress) {
                onProgress(Math.round((completed / ranges.length) * 80)); // 80% for generation
            }
        } catch (e) {
            console.warn(`Skipping invalid range: ${range}`);
        }
    }

    // Final Bake
    const zipContent = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 } // Balance speed/size
    }, (metadata) => {
        if (onProgress) {
            onProgress(80 + (metadata.percent * 0.2)); // Remaining 20% for zipping
        }
    });

    return {
        blob: zipContent,
        filename: `${baseName}_softbees.zip`,
        isZip: true
    };
}
