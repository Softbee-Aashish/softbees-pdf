import { PDFCompressionEngine } from './pdf-engine';

export class BatchPDFProcessor {
    private maxConcurrent = 1; // Strict sequential processing for safety
    private memoryThreshold = 500 * 1024 * 1024; // 500MB

    async processBatch(
        files: Array<{ file: File; targetSize: string; unit: 'MB' | 'KB' }>,
        onFileProgress: (index: number, progress: number, message: string) => void,
        onBatchComplete: (results: Array<{ fileName: string; url: string; finalSize: number; originalSize: number }>) => void
    ) {
        const results = [];

        for (let i = 0; i < files.length; i++) {
            const { file, targetSize, unit } = files[i];

            // Check memory before processing each file
            if (!this.checkMemory()) {
                onFileProgress(i, 0, "Waiting for memory to clear...");
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            try {
                const engine = new PDFCompressionEngine();

                onFileProgress(i, 0, "Starting...");

                const result = await engine.compressPDF(
                    file,
                    targetSize,
                    unit,
                    (progress, message) => {
                        onFileProgress(i, progress, message);
                    }
                );

                const blob = new Blob([result.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                results.push({
                    fileName: file.name,
                    url,
                    finalSize: result.finalSize,
                    originalSize: file.size
                });

                // Force garbage collection
                await this.cleanup();

            } catch (error) {
                console.error(`Failed to compress ${file.name}:`, error);
                onFileProgress(i, 0, `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                // Continue with next file
            }
        }

        onBatchComplete(results);
    }

    private checkMemory(): boolean {
        // @ts-ignore - Performance.memory is Chrome-only
        if (window.performance && (window.performance as any).memory) {
            // @ts-ignore
            const usedMB = (window.performance as any).memory.usedJSHeapSize / (1024 * 1024);
            return usedMB < this.memoryThreshold;
        }
        return true; // Assume OK if not measurable
    }

    private async cleanup(): Promise<void> {
        // Suggest GC by allocating and clearing a noticeable chunk (heuristic)
        // Real GC is not exposed to JS, but pausing helps.
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
