'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import ScanningPreview from '@/components/Converter/ScanningPreview';
import RenameWordModal from '@/components/Converter/RenameWordModal';
import { useWordConverter } from '@/hooks/useWordConverter';
import {
    FileText,
    ArrowLeft,
    UploadCloud,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ClientWordPage() {
    const [file, setFile] = useState<File | null>(null);
    const [showRename, setShowRename] = useState(false);

    const {
        convert,
        isProcessing,
        progress,
        status,
        hasResult,
        download
    } = useWordConverter();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please select a valid PDF file.');
            return;
        }
        setFile(selectedFile);

        // Auto-start conversion
        await convert(selectedFile);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col items-center py-12 px-4">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-[#111F35] mb-4">
                            PDF to Word Professional
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Convert PDFs to editable Word documents using our structural reconstruction engine. No text boxes or broken layouts.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
                        {/* State 1: Upload */}
                        {!file && (
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#1E40AF] hover:bg-blue-50/30 transition-all cursor-pointer group"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                />
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <FileText className="w-10 h-10 text-[#1E40AF] transition-colors" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#111F35] mb-2">
                                    Select PDF file
                                </h2>
                                <p className="text-gray-500 mb-6">
                                    or drop PDF here
                                </p>
                                <span className="inline-flex items-center justify-center px-8 py-3 bg-[#1E40AF] text-white font-bold rounded-lg hover:bg-[#1e3a8a] transition-colors shadow-md shadow-[#1E40AF]/20">
                                    Choose File
                                </span>
                            </div>
                        )}

                        {/* State 2: Processing (Scanning) */}
                        {file && isProcessing && (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <ScanningPreview
                                    isProcessing={isProcessing}
                                    status={status}
                                    progress={progress}
                                />
                            </div>
                        )}

                        {/* State 3: Result (Download) */}
                        {file && hasResult && !isProcessing && (
                            <div className="text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-[#111F35] mb-2">
                                    Ready for Download
                                </h2>
                                <p className="text-gray-500 mb-8">
                                    Your document has been structurally rebuilt.
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
                                        className="px-8 py-3 bg-[#1E40AF] text-white font-bold rounded-lg hover:bg-[#1e3a8a] transition-transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-5 h-5" /> Download Word Doc
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RenameWordModal
                isOpen={showRename}
                onClose={() => setShowRename(false)}
                onDownload={download}
            />
        </div>
    );
}
