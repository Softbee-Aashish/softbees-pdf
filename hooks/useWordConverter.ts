import { useState } from 'react';
import { convertPDFToWord } from '@/utils/word-reconstructor';
import { downloadFile } from '@/utils/file-helpers';
import { toast } from 'sonner';

export function useWordConverter() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Idle');
    const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);

    const handleConversion = async (file: File) => {
        setIsProcessing(true);
        setStatus('Initializing...');
        setProgress(0);
        setGeneratedBlob(null);

        try {
            const blob = await convertPDFToWord(file, (msg, pct) => {
                setStatus(msg);
                setProgress(pct);
            });

            setGeneratedBlob(blob);
            setStatus('Ready');
            toast.success('Document rebuilt successfully!');
            return true;
        } catch (error: any) {
            console.error('Conversion failed:', error);
            setStatus('Error');
            toast.error(error.message || 'Failed to convert PDF');
            setGeneratedBlob(null);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const triggerDownload = (baseName: string) => {
        if (!generatedBlob) return;
        downloadFile(generatedBlob, `${baseName}_softbees.docx`);
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
