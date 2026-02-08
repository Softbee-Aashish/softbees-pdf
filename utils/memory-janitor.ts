/**
 * Memory Janitor
 * A singleton utility to manage browser memory, track Object URLs, and enforce garbage collection
 */

class MemoryJanitorService {
    private urlRegistry: Set<string> = new Set();
    private maxUrls: number = 5;

    /**
     * Register a new Object URL to be tracked.
     * If the registry exceeds the limit, the oldest URL is revoked.
     */
    public registerUrl(url: string): void {
        this.urlRegistry.add(url);
        this.cleanupOldUrls();
    }

    /**
     * Explicitly revoke a specific URL
     */
    public revokeUrl(url: string): void {
        if (this.urlRegistry.has(url)) {
            URL.revokeObjectURL(url);
            this.urlRegistry.delete(url);
        }
    }

    /**
     * Trigger a global cleanup of all registered URLs.
     * Useful when leaving a page or resetting a tool.
     */
    public flushAll(): void {
        this.urlRegistry.forEach((url) => {
            URL.revokeObjectURL(url);
        });
        this.urlRegistry.clear();
        console.log('[MemoryJanitor] All URLs flushed.');
    }

    /**
     * Internal method to keep registry size in check
     */
    private cleanupOldUrls(): void {
        if (this.urlRegistry.size > this.maxUrls) {
            // Get the first (oldest) item
            const oldestUrl = this.urlRegistry.values().next().value;
            if (oldestUrl) {
                URL.revokeObjectURL(oldestUrl);
                this.urlRegistry.delete(oldestUrl);
                console.log('[MemoryJanitor] Auto-revoked old URL to save memory.');
            }
        }
    }

    /**
     * Explicitly destroy PDF.js worker instance if passed
     * @param pdfWorker - The worker instance from pdfjs-dist
     */
    public async destroyWorker(pdfWorker: any): Promise<void> {
        if (pdfWorker && typeof pdfWorker.destroy === 'function') {
            await pdfWorker.destroy();
            console.log('[MemoryJanitor] PDF Worker destroyed.');
        }
    }
}

export const MemoryJanitor = new MemoryJanitorService();
