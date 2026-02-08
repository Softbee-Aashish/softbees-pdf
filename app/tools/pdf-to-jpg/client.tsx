'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AdComponent from '@/lib/ads/AdComponent';
import { useConverterStore } from '@/store/converterStore';
import FileGrid from '@/components/Converter/FileGrid';
import RenameDialog from '@/components/Converter/RenameDialog';
import { extractImagesFromPDF } from '@/utils/pdf-extractor';
import { generateZipFromImages } from '@/utils/zip-logic';
import { downloadFile } from '@/utils/file-helpers';
import {
    Upload,
    Trash2,
    FileText,
    ArrowLeft,
    Loader2,
    Settings,
    Download
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
// Metadata moved to page.tsx

export default function PdfToJpgPage() {
    const {
        files,
        addPages,
        reset,
        setConversionType,
        status,
        setStatus
    } = useConverterStore();

    const [isDragging, setIsDragging] = useState(false);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [convertedZip, setConvertedZip] = useState<Blob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize store type
    useEffect(() => {
        setConversionType('pdf-to-img');
        return () => reset(); // Cleanup on unmount
    }, []);

    const handleFiles = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        const file = fileList[0];
        if (file.type !== 'application/pdf') {
            toast.error('Please select a valid PDF file');
            return;
        }

        setStatus('processing');
        const toastId = toast.loading('Extracting pages from PDF...');

        try {
            const extractedPages = await extractImagesFromPDF(file);
            addPages(extractedPages);
            toast.success(`Extracted ${extractedPages.length} pages`, { id: toastId });
            setStatus('success');
        } catch (error: any) {
            console.error(error);
            setStatus('error', error.message);
            toast.error('Failed to extract pages', { id: toastId });
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        await handleFiles(e.dataTransfer.files);
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        setStatus('processing');
        const toastId = toast.loading('Creating ZIP archive...');

        try {
            // We need a base name, let's derive it or use generic
            const baseName = files[0].originalName.split('_page_')[0] || 'document';
            const zipBlob = await generateZipFromImages(files, baseName);

            setConvertedZip(zipBlob);
            setStatus('success');
            toast.dismiss(toastId);
            setIsRenameOpen(true);
        } catch (error: any) {
            console.error(error);
            setStatus('error', error.message);
            toast.error('ZIP creation failed', { id: toastId });
        }
    };

    const handleDownload = (fileName: string) => {
        if (!convertedZip) return;

        downloadFile(convertedZip, `${fileName}_softbees.zip`);

        toast.success('ZIP downloaded successfully!');
        setConvertedZip(null);
    };

    // Empty State
    if (files.length === 0 && status !== 'processing') {
        return (
            <div className="min-h-screen bg-white font-sans text-[#111F35]">
                <Navbar />

                <main className="max-w-5xl mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold mb-4">PDF to Image Converter</h1>
                        <p className="text-[#111F35]/60">Extract high-quality images from PDF pages. Download as ZIP.</p>
                    </div>

                    <div className="mb-8 flex justify-center">
                        <AdComponent position="inline" />
                    </div>

                    <div
                        className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer outline-none focus:ring-4 focus:ring-[#F63049]/20 ${isDragging ? 'border-[#F63049] bg-[#FFF0F3]' : 'border-[#8A244B]/30 hover:border-[#F63049] bg-white'
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                fileInputRef.current?.click();
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label="Upload PDF to convert to images"
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        <div className="w-20 h-20 bg-[#FFF0F3] rounded-full flex items-center justify-center mx-auto mb-6 text-[#F63049]">
                            <FileText className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Drop PDF here</h3>
                        <span className="inline-block px-6 py-3 bg-[#F63049] text-white font-bold rounded-xl mt-4 hover:bg-[#D02752] transition-colors shadow-lg shadow-[#F63049]/20">
                            Select PDF File
                        </span>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-[#F3F4F6] overflow-hidden">
            {/* Header */}
            <header className="h-16 w-full bg-[#111F35] flex items-center justify-between px-6 shadow-lg shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <span className="text-white font-bold text-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
                        {files.length} Pages Extracted
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash2 className="w-4 h-4" /> Clear All
                    </button>

                    <button
                        onClick={handleConvert}
                        disabled={status === 'processing'}
                        className="px-6 py-2 bg-[#F63049] text-white rounded-lg text-sm font-bold hover:bg-[#D02752] transition flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'processing' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <Settings className="w-4 h-4" /> Convert to JPG (ZIP)
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {status === 'processing' && files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="w-12 h-12 text-[#F63049] animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Extracting pages from PDF...</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        <FileGrid />
                    </div>
                )}
            </main>

            <RenameDialog
                isOpen={isRenameOpen}
                onClose={() => setIsRenameOpen(false)}
                onDownload={handleDownload}
                title="Save Images ZIP"
                defaultName="extracted_images"
            />
        </div>
    );
}
