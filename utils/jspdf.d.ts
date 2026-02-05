// Type declarations for jsPDF in worker context
declare module 'jspdf' {
    export class jsPDF {
        constructor(options?: any);
        addPage(format?: any, orientation?: string): void;
        addImage(
            imageData: string,
            format: string,
            x: number,
            y: number,
            width: number,
            height: number,
            alias?: string,
            compression?: string
        ): void;
        output(type: 'blob'): Blob;
        output(type: string): any;
    }
}
