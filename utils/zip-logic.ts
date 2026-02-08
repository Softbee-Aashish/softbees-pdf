import JSZip from 'jszip';
import { ConverterFile } from '@/store/converterStore';

export async function generateZipFromImages(files: ConverterFile[], baseName: string): Promise<Blob> {
    const zip = new JSZip();
    const folder = zip.folder(baseName) || zip;

    // Helper to get blob from dataURL
    const dataURLtoBlob = async (dataurl: string) => {
        const res = await fetch(dataurl);
        return await res.blob();
    };

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const blob = await dataURLtoBlob(file.previewUrl);

        // Naming pattern: softbee{index}.jpg
        // User requested: Name as 'softbee[PageNumber].jpg'. Example: softbee1.jpg, softbee2.jpg.
        const fileName = `softbee${i + 1}.jpg`;

        folder.file(fileName, blob);
    }

    return await zip.generateAsync({ type: 'blob' });
}
