import { useState } from 'react';
import { convertPDFToExcel } from '@/utils/excel-reconstructor';
import { downloadFile } from '@/utils/file-helpers';
import { toast } from 'sonner';

export function useExcelConverter() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Idle');
    const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);

    const handleConversion = async (file: File) => {
        setIsProcessing(true);
        setStatus('Initializing Engine...');
        setProgress(0);
        setGeneratedBlob(null);

        try {
            const blob = await convertPDFToExcel(file, (status, progress) => {
                setStatus(status);
                setProgress(progress);
            });

            setGeneratedBlob(blob);
            setStatus('Ready');
            toast.success('Financial Data Extracted Successfully!');
            return true;
        } catch (error: any) {
            console.error('Excel Conversion failed:', error);
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
        downloadFile(generatedBlob, `${baseName}_softbees.xlsx`);
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
