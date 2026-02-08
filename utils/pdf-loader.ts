import * as pdfjsLib from 'pdfjs-dist';

// Define the worker source
// We assume the worker file is in the public folder as 'pdf.worker.mjs' or similar
// For Next.js, we usually set the workerSrc to a CDN or a local public file.
// Since we are using standard pdfjs-dist, we can try to rely on the bundler or set it explicitly.
// For now, let's try setting it to a CDN version matching the installed version (5.4.624)
// Or use the one from node_modules if configured.
// A common pattern in Next.js is copying the worker to public.

/* eslint-disable @typescript-eslint/no-explicit-any */

if (typeof window !== 'undefined' && 'Worker' in window) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface PDFPageImage {
    pageNumber: number;
    imageData: string; // Data URL
    width: number;
    height: number;
}

export async function loadPDF(file: File): Promise<PDFPageImage[]> {
    const arrayBuffer = await file.arrayBuffer();

    // Load the document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const pages: PDFPageImage[] = [];

    // Iterate through all days
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        // Calculate scale to fit a reasonable thumbnail size (e.g., width 300px)
        const viewport = page.getViewport({ scale: 1 });
        const scale = 300 / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const context = canvas.getContext('2d');
        if (!context) continue;

        await page.render({
            canvasContext: context,
            viewport: scaledViewport
        } as any).promise;

        pages.push({
            pageNumber: i,
            imageData: canvas.toDataURL('image/jpeg', 0.8),
            width: viewport.width,
            height: viewport.height
        });

        // Cleanup
        canvas.width = 0;
        canvas.height = 0;
    }

    // Cleanup PDF task
    await loadingTask.destroy();

    return pages;
}
