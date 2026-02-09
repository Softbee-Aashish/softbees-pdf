'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import RenamePdfModal from '@/components/Converter/RenamePdfModal';
import { useWordToPdf } from '@/hooks/useWordToPdf';
import {
    FileText,
    ArrowLeft,
    UploadCloud,
    CheckCircle2,
    FileCheck
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ClientWordToPdfPage() {
    const [file, setFile] = useState<File | null>(null);
    const [showRename, setShowRename] = useState(false);

    const {
        convert,
        isProcessing,
        progress,
        status,
        hasResult,
        download
    } = useWordToPdf();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (selectedFile: File) => {
        if (!selectedFile.name.endsWith('.docx')) {
            toast.error('Please select a valid Word (.docx) file.');
            return;
        }
        setFile(selectedFile);

        // Auto-start conversion
        await convert(selectedFile);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            handleFile(droppedFile);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col items-center py-12 px-4">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-[#111F35] mb-4">
                            Word to PDF Pro
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Convert Word documents to high-fidelity, vector-based PDFs using our structural mapping engine.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
                        {/* State 1: Upload */}
                        {!file && (
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#0D9488] hover:bg-teal-50/30 transition-all cursor-pointer group"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    accept=".docx"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                />
                                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <FileText className="w-10 h-10 text-[#0D9488] transition-colors" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#111F35] mb-2">
                                    Select Word file
                                </h2>
                                <p className="text-gray-500 mb-6">
                                    or drop .docx here
                                </p>
                                <span className="inline-flex items-center justify-center px-8 py-3 bg-[#0D9488] text-white font-bold rounded-lg hover:bg-[#0f766e] transition-colors shadow-md shadow-[#0D9488]/20">
                                    Choose Document
                                </span>
                            </div>
                        )}

                        {/* State 2: Processing */}
                        {file && isProcessing && (
                            <div className="text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-24 h-24 mx-auto mb-8 relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin"></div>
                                    <FileText className="w-10 h-10 text-[#111F35] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>

                                <h2 className="text-2xl font-bold text-[#111F35] mb-2">
                                    {status}
                                </h2>
                                <p className="text-gray-500 mb-8 font-medium">
                                    {Math.round(progress)}% Complete
                                </p>

                                {/* Progress Bar */}
                                <div className="w-full max-w-md mx-auto h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#0D9488] transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* State 3: Result (Download) */}
                        {file && hasResult && !isProcessing && (
                            <div className="text-center animate-in fade-in zoom-in duration-300 pt-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-[#111F35] mb-2">
                                    Conversion Successful
                                </h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    Structural mapping complete. Your document is ready as a vector-based PDF.
                                </p>

                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button
                                        onClick={() => setFile(null)}
                                        className="px-6 py-3 text-gray-600 font-bold hover:text-[#111F35] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Convert Another
                                    </button>
                                    <button
                                        onClick={() => setShowRename(true)}
                                        className="px-8 py-3 bg-[#0D9488] text-white font-bold rounded-lg hover:bg-[#0f766e] transition-transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <FileCheck className="w-5 h-5" /> Download PDF
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RenamePdfModal
                isOpen={showRename}
                onClose={() => setShowRename(false)}
                onDownload={download}
            />
        </div>
    );
}
