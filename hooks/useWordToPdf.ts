import { useState } from 'react';
import { convertWordToPDF } from '@/utils/word-to-pdf-engine';
import { downloadFile } from '@/utils/file-helpers';
import { toast } from 'sonner';

export function useWordToPdf() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Idle');
    const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);

    const handleConversion = async (file: File) => {
        setIsProcessing(true);
        setStatus('Reading Document...');
        setProgress(0);
        setGeneratedBlob(null);

        try {
            const blob = await convertWordToPDF(file, {
                onProgress: (status, progress) => {
                    setStatus(status);
                    setProgress(progress);
                }
            });

            setGeneratedBlob(blob);
            setStatus('Ready');
            toast.success('Document converted to Professional PDF!');
            return true;
        } catch (error: any) {
            console.error('Conversion failed:', error);
            setStatus('Error');
            toast.error(error.message || 'Failed to convert Word file');
            setGeneratedBlob(null);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const triggerDownload = (baseName: string) => {
        if (!generatedBlob) return;
        downloadFile(generatedBlob, `${baseName}_softbees.pdf`);
    };

    return {
        isProcessing,
        status,
        progress,
        hasResult: !!generatedBlob,
        convert: handleConversion,
        download: triggerDownload
    };
}
