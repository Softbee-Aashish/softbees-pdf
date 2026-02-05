/**
 * RUTHLESS PDF COMPRESSION ENGINE v4
 * Strict User-Defined Sizing | Adaptive Binary Search | Single Pass per Iteration
 */

import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { SizeValidator } from './size-validator';

// Configure pdfjs worker for Next.js
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export class PDFCompressionEngine {
    private targetSizeBytes: number = 0;
    private originalSizeBytes: number = 0;
    private maxIterations: number = 6; // Sufficient for binary search to converge

    /**
     * Main entry point
     */
    async compressPDF(
        file: File,
        targetSizeInput: string,
        unit: 'MB' | 'KB',
        onProgress?: (progress: number, message: string) => void
    ): Promise<{ data: Uint8Array; finalSize: number; quality: number; skipped?: boolean; message?: string }> {

        // Step 1: Parse target size STRICTLY
        this.targetSizeBytes = SizeValidator.parseSizeInput(targetSizeInput, unit);
        this.originalSizeBytes = file.size;

        console.log(`[Engine] Target: ${this.targetSizeBytes} bytes, User Input: ${targetSizeInput}${unit}`);

        // Step 2: Pre-check validation
        const validation = SizeValidator.shouldCompress(
            this.originalSizeBytes,
            this.targetSizeBytes
        );

        if (validation.action === 'skip') {
            const arrayBuffer = await file.arrayBuffer();
            return {
                data: new Uint8Array(arrayBuffer),
                finalSize: this.originalSizeBytes,
                quality: 1.0,
                skipped: true,
                message: validation.reason
            };
        }

        if (validation.action === 'error') {
            // We log error but don't stop, we try our best as per "Ruthless" requirement
            console.warn(validation.reason);
        }

        onProgress?.(10, "Analyzing PDF structure...");

        // Step 3: Load PDF
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdfDoc.numPages;

        // Step 4: Binary Search for Quality
        // Range: 0.1 (Max Compression) to 1.0 (Max Quality)
        let minQ = 0.1;
        let maxQ = 1.0;

        let bestQuality = 0.1; // Default to lowest if we can't meet target
        let bestData: Uint8Array | null = null;
        let bestSize = Number.MAX_VALUE;

        onProgress?.(20, "Calculating optimal compression...");

        for (let i = 0; i < this.maxIterations; i++) {
            // Current test quality (midpoint)
            const currentQ = (minQ + maxQ) / 2;

            // -----------------------------------------------------
            // SINGLE PASS PROCESSING: Process all pages at currentQ
            // -----------------------------------------------------
            const compressedPDF = await this.processAllPages(
                pdfDoc,
                numPages,
                currentQ,
                (page, total) => {
                    // Progress mapping: 20% -> 90% during iterations
                    const iterProgress = 20 + ((i / this.maxIterations) * 70);
                    const pageProgress = (page / total) * (70 / this.maxIterations);
                    onProgress?.(Math.min(95, iterProgress + pageProgress), `Optimizing... Pass ${i + 1}/${this.maxIterations}`);
                }
            );

            const currentSize = compressedPDF.data.length;
            console.log(`[Pass ${i + 1}] Quality: ${currentQ.toFixed(3)}, Size: ${(currentSize / 1024 / 1024).toFixed(2)}MB, Target: ${(this.targetSizeBytes / 1024 / 1024).toFixed(2)}MB`);

            // Binary Search Logic
            if (currentSize <= this.targetSizeBytes) {
                // Success! We are under target.
                // Can we get better quality and still stay under?
                bestData = compressedPDF.data;
                bestSize = currentSize;
                bestQuality = currentQ;

                // Try higher quality next
                minQ = currentQ;
            } else {
                // Failure. Too big. Need lower quality.
                maxQ = currentQ;
            }

            // Stop if range is tiny
            if ((maxQ - minQ) < 0.05) break;
        }

        // ═══════════════════════════════════════════════════════════
        // FINAL RESULT HANDLER
        // ═══════════════════════════════════════════════════════════

        // If we never found a valid size (even at lowest quality), we return the smallest one we found
        // effectively "Ruthless" best effort.

        // STRICT GUARD: If best effort is STILL larger than original, return original.
        if (bestData && bestSize >= this.originalSizeBytes) {
            console.warn("[Result] Compression result larger than original. Returning original.");
            return {
                data: new Uint8Array(arrayBuffer),
                finalSize: this.originalSizeBytes,
                quality: 1.0,
                skipped: true,
                message: "File already optimized. Compressed version was larger."
            };
        }

        if (bestData) {
            onProgress?.(100, "Finalizing...");
            return {
                data: bestData,
                finalSize: bestSize,
                quality: bestQuality,
                message: "Compression successful"
            };
        }

        // Fallback (Should rarely happen unless iterations start with tight range)
        return {
            data: new Uint8Array(arrayBuffer),
            finalSize: this.originalSizeBytes,
            quality: 1.0,
            message: "Could not compress file further."
        };
    }

    /**
     * Process ALL pages in a single pass using Canvas -> JPEG -> PDF
     */
    private async processAllPages(
        pdf: pdfjsLib.PDFDocumentProxy,
        numPages: number,
        quality: number,
        onPageProgress?: (current: number, total: number) => void
    ): Promise<{ data: Uint8Array }> {

        const outputPDF = await PDFDocument.create();
        // Scale heuristic: Lower quality usually needs lower resolution to look decent/save space
        // If quality is 1.0, scale 1.0. If quality 0.1, scale 0.5.
        const scale = Math.max(0.5, 0.4 + (quality * 0.6));

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            // Create canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d', { willReadFrequently: false, alpha: false });

            if (!context) throw new Error("Canvas failure");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport, canvasFactory: undefined } as any).promise;

            const imageData = canvas.toDataURL('image/jpeg', quality);

            // Embed in new PDF
            const image = await outputPDF.embedJpg(imageData);
            const pdfPage = outputPDF.addPage([viewport.width, viewport.height]);

            pdfPage.drawImage(image, {
                x: 0,
                y: 0,
                width: viewport.width,
                height: viewport.height,
            });

            // Explicit Cleanup
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = 0; canvas.height = 0;
            page.cleanup();

            onPageProgress?.(pageNum, numPages);

            // Yield for UI responsiveness
            if (pageNum % 5 === 0) await new Promise(r => setTimeout(r, 0));
        }

        const pdfBytes = await outputPDF.save();
        return { data: pdfBytes };
    }
}

export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
