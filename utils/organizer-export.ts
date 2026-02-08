import { PDFDocument, degrees, PageSizes } from 'pdf-lib';
import { PageObject } from '@/store/organizerStore';

export async function exportOrganizedPDF(
    pages: PageObject[],
    fileRegistry: Map<string, ArrayBuffer>
): Promise<Uint8Array> {
    // 1. Create new document
    const newDoc = await PDFDocument.create();

    // Set metadata
    newDoc.setTitle('Organized with Soft Bees PDF');
    newDoc.setCreator('Soft Bees PDF Tools');
    newDoc.setProducer('Soft Bees PDF Tools');

    // Cache loaded PDF documents
    const loadedDocs = new Map<string, PDFDocument>();

    const getSourceDoc = async (fileId: string): Promise<PDFDocument | null> => {
        if (loadedDocs.has(fileId)) return loadedDocs.get(fileId)!;

        const arrayBuffer = fileRegistry.get(fileId);
        if (!arrayBuffer) return null;

        try {
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            loadedDocs.set(fileId, pdfDoc);
            return pdfDoc;
        } catch (e) {
            console.error(`Failed to load PDF for fileId ${fileId}`, e);
            return null;
        }
    };

    // 2. Iterate through pages
    const visiblePages = pages.filter(p => !p.isDeleted);

    if (visiblePages.length === 0) {
        throw new Error("No pages to export");
    }

    for (const pageObj of visiblePages) {
        if (pageObj.type === 'blank') {
            const page = newDoc.addPage(PageSizes.A4);
            if (pageObj.rotation !== 0) {
                page.setRotation(degrees(pageObj.rotation));
            }
        } else {
            const sourceDoc = await getSourceDoc(pageObj.fileId);
            if (!sourceDoc) continue;

            const [copiedPage] = await newDoc.copyPages(sourceDoc, [pageObj.originalIndex]);

            // Apply rotation (additive to original)
            const existingRotation = copiedPage.getRotation().angle;
            const finalRotation = (existingRotation + pageObj.rotation) % 360;
            copiedPage.setRotation(degrees(finalRotation));

            newDoc.addPage(copiedPage);
        }
    }

    // 3. Save
    const pdfBytes = await newDoc.save();
    return pdfBytes;
}
