import { PDFDocument } from 'pdf-lib';

/**
 * Client-Side PDF Merge Engine
 * Uses pdf-lib to merge multiple PDF files into a single document.
 * 
 * @param files Array of File objects to merge
 * @returns Promise<Blob> The merged PDF as a Blob
 */
export async function mergePDFs(files: File[]): Promise<Blob> {
    // 1. Create a new empty PDFDocument
    // Using PDFDocument.create() creates a fresh document
    const mergedPdf = await PDFDocument.create();

    // 2. Loop through input files
    for (const file of files) {
        // a. Load the file as an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // b. Load the PDF document
        const pdf = await PDFDocument.load(arrayBuffer);

        // c. Copy all pages [0...n]
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        // d. Add copied pages to the new document
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // 3. Save the new document
    const mergedPdfBytes = await mergedPdf.save();

    // 4. Return as Blob
    return new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
}
