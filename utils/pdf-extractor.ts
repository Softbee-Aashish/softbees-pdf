import { ConverterFile } from '@/store/converterStore';

export async function extractImagesFromPDF(file: File): Promise<ConverterFile[]> {
    // Dynamic import to avoid SSR issues with pdfjs-dist (which uses browser APIs like DOMMatrix)
    const pdfjsLib = await import('pdfjs-dist');

    // Initialize PDF.js worker
    if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const pages: ConverterFile[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        // Render at 2x scale for better quality
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport: viewport
        } as any).promise;

        // Convert key to blob for storage efficiency if needed, but dataUrl is easier for preview
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        // Canvas cleanup
        canvas.width = 0;
        canvas.height = 0;

        pages.push({
            id: Math.random().toString(36).substring(7),
            previewUrl: dataUrl,
            originalName: `${file.name.replace(/\.pdf$/i, '')}_page_${i}`,
            type: 'image', // Treated as image for the grid
            rotation: 0
        });
    }

    // Cleanup PDF task
    await loadingTask.destroy();

    return pages;
}
