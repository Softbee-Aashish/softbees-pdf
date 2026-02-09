'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useConverterStore } from '@/store/converterStore';
import FileGrid from '@/components/Converter/FileGrid';
import RenameDialog from '@/components/Converter/RenameDialog';
import { generatePDFFromImages } from '@/utils/image-converter';
import { downloadFile } from '@/utils/file-helpers';
import {
    Upload,
    Trash2,
    FileImage,
    ArrowLeft,
    Loader2,
    Settings,
    Download
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Metadata moved to page.tsx

export default function JpgToPdfPage() {
    const {
        files,
        addFiles,
        removeFile,
        reset,
        setConversionType,
        status,
        setStatus
    } = useConverterStore();

    const [isDragging, setIsDragging] = useState(false);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [convertedPdf, setConvertedPdf] = useState<Blob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize store type
    useEffect(() => {
        setConversionType('img-to-pdf');
        return () => reset(); // Cleanup on unmount
    }, []);

    const handleFiles = async (fileList: FileList | null) => {
        if (!fileList) return;

        const validFiles = Array.from(fileList).filter(f =>
            f.type.startsWith('image/')
        );

        if (validFiles.length > 0) {
            const toastId = toast.loading('Processing images...');
            try {
                await addFiles(validFiles);
                toast.success(`Added ${validFiles.length} images`, { id: toastId });
            } catch (error) {
                toast.error('Failed to load images', { id: toastId });
            }
        } else {
            toast.error('Please select valid image files (JPG, PNG, WebP)');
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
        const toastId = toast.loading('Generating PDF...');

        try {
            const pdfBytes = await generatePDFFromImages(files);
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            setConvertedPdf(blob);
            setStatus('success');
            toast.dismiss(toastId);
            setIsRenameOpen(true);
        } catch (error: any) {
            console.error(error);
            setStatus('error', error.message);
            toast.error('Conversion failed', { id: toastId });
        }
    };

    const handleDownload = (fileName: string) => {
        if (!convertedPdf) return;

        downloadFile(convertedPdf, `${fileName}_softbees.pdf`);

        toast.success('PDF downloaded successfully!');
        setConvertedPdf(null); // Reset after download if needed, or keep for multiple downloads
    };

    // Empty State
    if (files.length === 0) {
        return (
            <div className="min-h-screen bg-white font-sans text-[#111F35]">
                <Navbar />

                <main className="max-w-5xl mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold mb-4">Image to PDF Converter</h1>
                        <p className="text-[#111F35]/60">Convert JPG, PNG, and WebP images to PDF. Drag and drop to reorder.</p>
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
                        aria-label="Upload images to convert"
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        <div className="w-20 h-20 bg-[#FFF0F3] rounded-full flex items-center justify-center mx-auto mb-6 text-[#F63049]">
                            <FileImage className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Drop Images here</h3>
                        <span className="inline-block px-6 py-3 bg-[#F63049] text-white font-bold rounded-xl mt-4 hover:bg-[#D02752] transition-colors shadow-lg shadow-[#F63049]/20">
                            Select Images
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
                        {files.length} Images
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash2 className="w-4 h-4" /> Clear All
                    </button>

                    <div className="w-px h-6 bg-white/20 mx-2" />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-white/30 text-white rounded-lg text-sm font-bold hover:bg-white/10 transition flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" /> Add Images
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                        />
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
                                <Settings className="w-4 h-4" /> Convert to PDF
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto">
                    <FileGrid />
                </div>
            </main>

            <RenameDialog
                isOpen={isRenameOpen}
                onClose={() => setIsRenameOpen(false)}
                onDownload={handleDownload}
                title="Save PDF"
                defaultName="converted_images"
            />
        </div>
    );
}
