/**
 * Rename & Download Dialog
 * Appears after 2s loading delay on download click.
 * Features: PDF Icon, Rename Input, Enforced Suffix Logic
 */
'use client';

import { FileText, Download, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatFileSize } from '@/utils/file-helpers';

interface RenameDownloadDialogProps {
    isOpen: boolean;
    originalFileName: string;
    originalSize: number;
    compressedSize: number;
    onClose: () => void;
    onDownload: (newFileName: string) => void;
}

export default function RenameDownloadDialog({
    isOpen,
    originalFileName,
    originalSize,
    compressedSize,
    onClose,
    onDownload
}: RenameDownloadDialogProps) {
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (isOpen && originalFileName) {
            setFileName(originalFileName.replace('.pdf', ''));
        }
    }, [isOpen, originalFileName]);

    const handleDownload = () => {
        onDownload(fileName);
    };

    if (!isOpen) return null;

    const savings = originalSize > 0
        ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
        : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 m-4 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#F63049]/10 rounded-xl">
                            <FileText className="w-8 h-8 text-[#F63049]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#111F35]">Ready to Save</h3>
                            <p className="text-sm text-[#111F35]/60 font-medium">Your file is compressed!</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Stats Card */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-[#111F35]/60">Original</span>
                        <span className="text-sm font-bold text-[#111F35]/60 line-through">
                            {formatFileSize(originalSize)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-[#111F35]">Compressed</span>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-extrabold text-[#F63049]">
                                {formatFileSize(compressedSize)}
                            </span>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                -{savings}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Rename Input */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-[#111F35] mb-2 uppercase tracking-wide">
                        Filename
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="w-full px-4 py-3 pr-32 border-2 border-[#111F35]/10 rounded-xl font-bold text-[#111F35] focus:border-[#F63049] outline-none"
                            autoFocus
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111F35]/40 font-bold pointer-events-none select-none text-sm">
                            _softbees_pdf.pdf
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleDownload}
                    className="w-full py-4 bg-[#F63049] hover:bg-[#D02752] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg transform hover:-translate-y-0.5"
                >
                    <Download className="w-6 h-6" />
                    Download PDF
                </button>

            </div>
        </div>
    );
}
