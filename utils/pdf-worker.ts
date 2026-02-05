/**
 * Web Worker for Background PDF Compression
 * Runs heavy processing in a separate thread to prevent UI freezing
 */

// Import types (will be stripped in worker context)
import type { WorkerMessageType, WorkerStartMessage } from './types';

// This runs in the Worker thread context
self.onmessage = async (e: MessageEvent<WorkerStartMessage>) => {
    const { fileArrayBuffer, fileName, targetSizeKB, options = {} } = e.data.payload;

    try {
        // Dynamically import heavy libraries in worker context
        const pdfjsLib = await import('pdfjs-dist');
        const jsPDF = (await import('jspdf')).jsPDF;

        // Configure worker path
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        // Send initial progress
        self.postMessage({
            type: 'progress',
            payload: {
                currentPage: 0,
                totalPages: 0,
                percentage: 0,
                status: 'Initializing...',
            },
        });

        // Load PDF document
        const pdfDoc = await pdfjsLib.getDocument({ data: fileArrayBuffer }).promise;
        const numPages = pdfDoc.numPages;
        const originalSizeBytes = fileArrayBuffer.byteLength;
        const targetSizeBytes = targetSizeKB * 1024;

        self.postMessage({
            type: 'progress',
            payload: {
                currentPage: 0,
                totalPages: numPages,
                percentage: 5,
                status: `Loaded ${numPages} pages`,
            },
        });

        // Calculate compression ratio and initial quality
        const compressionRatio = originalSizeBytes / targetSizeBytes;
        let imageQuality = calculateInitialQuality(compressionRatio);

        self.postMessage({
            type: 'progress',
            payload: {
                currentPage: 0,
                totalPages: numPages,
                percentage: 10,
                status: `Target compression: ${compressionRatio.toFixed(1)}x`,
            },
        });

        // Iterative compression
        const maxIterations = options.maxIterations || 3;
        const minQuality = options.minQuality || 0.1;
        let finalBlob: Blob | null = null;
        let iteration = 0;
        let currentQuality = imageQuality;

        while (iteration < maxIterations) {
            iteration++;

            self.postMessage({
                type: 'progress',
                payload: {
                    currentPage: 0,
                    totalPages: numPages,
                    percentage: 15,
                    status: `Attempt ${iteration}/${maxIterations} (Quality: ${Math.round(currentQuality * 100)}%)`,
                },
            });

            // Process all pages
            const compressedImages: string[] = [];
            const pageDimensions: Array<{ width: number; height: number }> = [];

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 });

                // Create OffscreenCanvas for Worker context
                const canvas = new OffscreenCanvas(viewport.width, viewport.height);
                const context = canvas.getContext('2d');
                if (!context) {
                    throw new Error('Could not get canvas context');
                }

                // Render page to OffscreenCanvas
                await page.render({
                    canvasContext: context as any,
                    viewport: viewport,
                    canvas: canvas as any,
                }).promise;

                // Store dimensions
                pageDimensions.push({
                    width: viewport.width,
                    height: viewport.height,
                });

                // Convert to JPEG blob
                const blob = await canvas.convertToBlob({
                    type: 'image/jpeg',
                    quality: currentQuality,
                });

                // Convert blob to base64 for jsPDF
                const arrayBuffer = await blob.arrayBuffer();
                const base64 = bufferToBase64(arrayBuffer);
                const jpegDataURL = `data:image/jpeg;base64,${base64}`;
                compressedImages.push(jpegDataURL);

                // Send progress
                self.postMessage({
                    type: 'progress',
                    payload: {
                        currentPage: pageNum,
                        totalPages: numPages,
                        percentage: 15 + Math.round((pageNum / numPages) * 65),
                        status: `Processing page ${pageNum}/${numPages}...`,
                    },
                });
            }

            // Rebuild PDF
            self.postMessage({
                type: 'progress',
                payload: {
                    currentPage: numPages,
                    totalPages: numPages,
                    percentage: 85,
                    status: 'Rebuilding PDF...',
                },
            });

            const firstPage = pageDimensions[0];
            const pdf = new jsPDF({
                orientation: firstPage.width > firstPage.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [firstPage.width, firstPage.height],
                compress: true,
            });

            compressedImages.forEach((imgData, index) => {
                if (index > 0) {
                    const dims = pageDimensions[index];
                    pdf.addPage([dims.width, dims.height], dims.width > dims.height ? 'l' : 'p');
                }

                const dims = pageDimensions[index];
                pdf.addImage(imgData, 'JPEG', 0, 0, dims.width, dims.height, undefined, 'FAST');
            });

            finalBlob = pdf.output('blob');

            // Check size
            const achievedSize = finalBlob.size;
            const tolerance = targetSizeBytes * 1.05;

            self.postMessage({
                type: 'progress',
                payload: {
                    currentPage: numPages,
                    totalPages: numPages,
                    percentage: 90,
                    status: `Achieved ${(achievedSize / 1024).toFixed(0)}KB (Target: ${targetSizeKB}KB)`,
                },
            });

            // If within tolerance or last iteration, break
            if (achievedSize <= tolerance || iteration >= maxIterations) {
                break;
            }

            // Adjust quality
            const sizeRatio = achievedSize / targetSizeBytes;
            if (sizeRatio > 1.2) {
                currentQuality = Math.max(minQuality, currentQuality * 0.7);
            } else {
                currentQuality = Math.max(minQuality, currentQuality * 0.85);
            }
        }

        if (!finalBlob) {
            throw new Error('Compression failed');
        }

        // Convert blob to ArrayBuffer for transfer
        const resultArrayBuffer = await finalBlob.arrayBuffer();

        // Send completion message with transferred ArrayBuffer
        self.postMessage(
            {
                type: 'complete',
                payload: {
                    blobArrayBuffer: resultArrayBuffer,
                    result: {
                        originalSize: originalSizeBytes,
                        compressedSize: finalBlob.size,
                        compressionRatio: originalSizeBytes / finalBlob.size,
                        quality: currentQuality,
                    },
                },
            } as any,
            [resultArrayBuffer] as any
        );

    } catch (error: any) {
        // Send error message
        self.postMessage({
            type: 'error',
            payload: {
                message: error.message || 'Unknown error occurred',
                stack: error.stack,
            },
        });
    }
};

/**
 * Calculate initial quality based on compression ratio
 */
function calculateInitialQuality(compressionRatio: number): number {
    if (compressionRatio > 10) return 0.3;
    if (compressionRatio > 5) return 0.5;
    if (compressionRatio > 2) return 0.7;
    if (compressionRatio > 1.2) return 0.85;
    return 0.95;
}

/**
 * Convert ArrayBuffer to Base64
 */
function bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
