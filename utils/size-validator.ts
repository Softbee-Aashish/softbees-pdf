export class SizeValidator {
    /**
     * CRITICAL: Check if compression is actually needed
     * Returns true only if currentSize > targetSize
     */
    static shouldCompress(currentSizeBytes: number, targetSizeBytes: number): {
        shouldCompress: boolean;
        reason: string;
        action: 'skip' | 'compress' | 'error';
    } {
        // Convert bytes to MB for display
        const currentMB = (currentSizeBytes / (1024 * 1024)).toFixed(2);
        const targetMB = (targetSizeBytes / (1024 * 1024)).toFixed(2);

        // Case 1: Already at or below target - NO COMPRESSION
        if (currentSizeBytes <= targetSizeBytes) {
            return {
                shouldCompress: false,
                reason: `File is already ${currentMB}MB (target: ${targetMB}MB). No compression needed.`,
                action: 'skip'
            };
        }

        // Case 2: Impossible target (<10% of original)
        const minPossibleSize = currentSizeBytes * 0.1; // Can't compress below 10%
        if (targetSizeBytes < minPossibleSize) {
            return {
                shouldCompress: false,
                reason: `Cannot compress ${currentMB}MB file to ${targetMB}MB without severe quality loss. Minimum: ${(minPossibleSize / (1024 * 1024)).toFixed(2)}MB`,
                action: 'error'
            };
        }

        // Case 3: Valid compression needed
        const requiredRatio = targetSizeBytes / currentSizeBytes;
        return {
            shouldCompress: true,
            reason: `Compressing from ${currentMB}MB to ${targetMB}MB (${(requiredRatio * 100).toFixed(0)}% target)`,
            action: 'compress'
        };
    }

    /**
     * Convert user input to bytes
     */
    static parseSizeInput(input: string, unit: 'MB' | 'KB'): number {
        const value = parseFloat(input);
        if (unit === 'MB') {
            return value * 1024 * 1024;
        } else {
            return value * 1024;
        }
    }
}
