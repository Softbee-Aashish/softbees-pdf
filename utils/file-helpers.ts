/**
 * File Helper Utilities
 * Handles file downloads, renaming, and blob manipulation
 */

/**
 * Triggers a file download with custom filename
 * @param blob - The file blob to download
 * @param filename - The desired filename (with extension)
 */
export function downloadBlob(blob: Blob, filename: string): void {
    // Ensure filename has .pdf extension
    const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    // Create temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    a.style.display = 'none';

    // Trigger download
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Extract filename from File object without extension
 * @param file - The original file
 * @returns Filename without extension
 */
export function getFilenameWithoutExtension(file: File): string {
    const name = file.name;
    const lastDotIndex = name.lastIndexOf('.');

    if (lastDotIndex === -1) {
        return name;
    }

    return name.substring(0, lastDotIndex);
}

/**
 * Generate a default compressed filename
 * @param originalFilename - The original file name
 * @returns Suggested compressed filename
 */
export function generateCompressedFilename(originalFilename: string): string {
    const nameWithoutExt = getFilenameWithoutExtension({ name: originalFilename } as File);
    return `${nameWithoutExt}_compressed`;
}

/**
 * Validate file is a PDF
 * @param file - File to validate
 * @returns true if valid PDF
 */
export function isPDF(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Format file size for display
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Convert KB to bytes
 */
export function kbToBytes(kb: number): number {
    return kb * 1024;
}

/**
 * Convert bytes to KB
 */
export function bytesToKB(bytes: number): number {
    return bytes / 1024;
}

/**
 * Check if browser supports required features
 */
export function checkBrowserSupport(): {
    supported: boolean;
    missing: string[];
} {
    const missing: string[] = [];

    if (!window.FileReader) {
        missing.push('FileReader API');
    }

    if (!document.createElement('canvas').getContext) {
        missing.push('Canvas API');
    }

    if (!window.Worker) {
        missing.push('Web Workers');
    }

    if (!window.Blob) {
        missing.push('Blob API');
    }

    return {
        supported: missing.length === 0,
        missing,
    };
}
