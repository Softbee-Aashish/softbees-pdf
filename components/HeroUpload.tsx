/**
 * Hero Upload Section
 * UNLIMITED FILES - NO LIMITS
 * Strict Palette: Red Buttons, Navy Text, Wine Borders
 */
'use client';

import { Upload, FileText, Shield, Zap, CheckCircle } from 'lucide-react';
import { useCallback } from 'react';

interface HeroUploadProps {
    onFilesSelected: (files: File[]) => void;
}

export default function HeroUpload({ onFilesSelected }: HeroUploadProps) {
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
        if (pdfFiles.length > 0) onFilesSelected(pdfFiles);
    }, [onFilesSelected]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const pdfFiles = files.filter(f => f.type === 'application/pdf');
        if (pdfFiles.length > 0) onFilesSelected(pdfFiles);
    }, [onFilesSelected]);

    return (
        <div className="flex flex-col items-center pt-16 pb-20 px-4 bg-white">
            {/* Headlines - Navy Blue #111F35 */}
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#111F35] mb-6 text-center leading-tight">
                Compress PDF Files <span className="text-[#F63049]">Instantly</span>
            </h1>
            <p className="text-xl text-[#111F35]/70 mb-12 text-center max-w-2xl font-medium">
                Fast, secure, and processing entirely in your browser.
                <br />
                No server uploads. No file limits.
            </p>

            {/* Dropzone - Wine Border #8A244B */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="w-full max-w-4xl"
            >
                <label
                    className="flex flex-col items-center justify-center w-full h-80 
                     border-4 border-dashed border-[#8A244B]/30 rounded-3xl 
                     bg-gray-50 hover:bg-[#F63049]/5 hover:border-[#F63049] 
                     cursor-pointer transition-all duration-300 group"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-5 bg-white rounded-full shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-12 h-12 text-[#F63049]" />
                        </div>
                        <p className="mb-3 text-2xl font-bold text-[#111F35]">
                            Drop your PDF files here
                        </p>
                        <p className="text-lg text-[#111F35]/60 font-medium">
                            or click to browse local files
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf,application/pdf"
                        multiple
                        onChange={handleFileSelect}
                    />
                </label>
            </div>

            {/* Button Fallback (redundant but requested often) */}
            <button
                onClick={() => document.querySelector('input[type="file"]')?.dispatchEvent(new MouseEvent('click'))}
                className="mt-10 px-10 py-5 bg-[#F63049] hover:bg-[#D02752] text-white 
                   text-xl font-bold rounded-full shadow-xl hover:shadow-2xl 
                   transition-all transform hover:-translate-y-1 flex items-center gap-3"
            >
                <FileText className="w-6 h-6" />
                Select PDF Files
            </button>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 text-center max-w-5xl">
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-[#F63049]/10 rounded-2xl mb-4">
                        <Shield className="w-8 h-8 text-[#F63049]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111F35]">100% Private</h3>
                    <p className="text-[#111F35]/70">Files never leave your device</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-[#F63049]/10 rounded-2xl mb-4">
                        <Zap className="w-8 h-8 text-[#F63049]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111F35]">Lightning Fast</h3>
                    <p className="text-[#111F35]/70">Powered by WebAssembly</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-[#F63049]/10 rounded-2xl mb-4">
                        <CheckCircle className="w-8 h-8 text-[#F63049]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111F35]">No Limits</h3>
                    <p className="text-[#111F35]/70">Process unlimited files</p>
                </div>
            </div>
        </div>
    );
}
