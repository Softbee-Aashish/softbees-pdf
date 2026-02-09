import { useState } from 'react';
import { splitPDF, parsePageRange } from '@/utils/split-engine';
import { downloadFile } from '@/utils/file-helpers';
import { toast } from 'sonner';

interface UseSplitterParams {
    file: File | null;
    ranges: string[];
    baseName: string;
}

export function useSplitterAction() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const validateRanges = (ranges: string[], totalPages: number): boolean => {
        // Must have at least one range
        if (ranges.length === 0) return false;

        // All ranges must contain strict "X-Y" or "X" pattern matching actual page count
        return ranges.every(range => {
            if (!range.trim()) return false;

            const indices = parsePageRange(range, totalPages);
            // Range is valid if it produces page indices and all indices are within bounds (handled by parser)
            return indices.length > 0;
        });
    };

    const handleSplit = async ({ file, ranges, baseName }: UseSplitterParams) => {
        if (!file) return;

        setIsProcessing(true);
        setProgress(0);
        const toastId = toast.loading('Calculating split points...');

        try {
            const { blob, filename } = await splitPDF(
                file,
                ranges,
                baseName,
                (p) => {
                    setProgress(p);
                    if (p < 100) {
                        toast.loading(`Processing... ${Math.round(p)}%`, { id: toastId });
                    }
                }
            );

            // Trigger Download
            downloadFile(blob, filename);

            toast.success('Your files have been split successfully!', { id: toastId });
        } catch (error: any) {
            console.error('Split failed:', error);
            toast.error(error.message || 'Failed to split PDF', { id: toastId });
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    return {
        isProcessing,
        progress,
        validateRanges,
        handleSplit
    };
}
