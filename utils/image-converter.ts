import { PDFDocument, PageSizes } from 'pdf-lib';
import { ConverterFile } from '@/store/converterStore';

export async function generatePDFFromImages(files: ConverterFile[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.setCreator('Soft Bees PDF Tools');
    pdfDoc.setProducer('Soft Bees PDF Tools');

    for (const fileObj of files) {
        if (!fileObj.previewUrl) continue;

        let image;
        const arrayBuffer = await fetch(fileObj.previewUrl).then(res => res.arrayBuffer());

        // Detect image type (basic check)
        const isPng = fileObj.file?.type === 'image/png';
        const isJpg = fileObj.file?.type === 'image/jpeg' || fileObj.file?.type === 'image/jpg';

        try {
            if (isPng) {
                image = await pdfDoc.embedPng(arrayBuffer);
            } else {
                // Fallback to JPG for others, pdf-lib supports JPG primarily
                image = await pdfDoc.embedJpg(arrayBuffer);
            }
        } catch (e) {
            console.warn(`Failed to embed image ${fileObj.originalName}, trying as JPG fallback`, e);
            try {
                image = await pdfDoc.embedJpg(arrayBuffer);
            } catch (err) {
                console.error(`Skipping image ${fileObj.originalName}: Format not supported`, err);
                continue;
            }
        }

        // Create page with exact image dimensions
        const page = pdfDoc.addPage([image.width, image.height]);

        // Draw image at full size
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        });

        // Apply rotation if needed
        if (fileObj.rotation !== 0) {
            page.setRotation(degrees(fileObj.rotation));
        }
    }

    return await pdfDoc.save();
}

function degrees(deg: number) {
    // pdf-lib degrees helper
    return { angle: deg, toString: () => `${deg}deg` } as any;
}
