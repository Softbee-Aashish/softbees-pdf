'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import TableLivePreview from '@/components/Converter/TableLivePreview';
import RenamePdfModal from '@/components/Converter/RenamePdfModal'; // Reuse existing rename modal or create new
import { useExcelConverter } from '@/hooks/useExcelConverter';
import {
    FileSpreadsheet,
    UploadCloud,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Reusing RenameModal logic but we might want a specific Excel one later.
// For now, I'll use the RenamePdfModal but we'll adapt the message/icon via props if needed or just create a new one.
// Actually, let's create a RenameExcelModal to be clean or reuse RenamePdfModal if it's generic enough.
// The existing RenamePdfModal has specific "PDF Ready" text. I will create a RenameExcelModal inline or separately.
// For expediency, I will implement a local rename modal or just use the generic logic here.
import RenameModal from '@/components/Splitter/RenameModal'; // This one is generic enough? It has zip/pdf logic.
// Let's stick to creating a fresh RenameExcelModal for branding stringency.

import { X, Download, FileCheck } from 'lucide-react';

function RenameExcelModal({ isOpen, onClose, onDownload }: { isOpen: boolean; onClose: () => void; onDownload: (name: string) => void }) {
    const [baseName, setBaseName] = useState('softbees_financial');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111F35]/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border-t-4 border-[#1D6F42]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-[#111F35]"><X className="w-6 h-6" /></button>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4 text-[#1D6F42]">
                    <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#111F35] mb-2">Excel Ready!</h3>
                <p className="text-gray-500 mb-6 text-sm">Financial mapping complete. Numbers are formula-ready.</p>
                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Filename</label>
                    <div className="relative">
                        <input type="text" value={baseName} onChange={(e) => setBaseName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1D6F42] outline-none font-medium pr-40 text-[#111F35]" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold bg-gray-50 px-2 py-1 rounded">_softbees.xlsx</span>
                    </div>
                </div>
                <button onClick={() => { onDownload(baseName || 'softbees_financial'); onClose(); }} className="w-full py-4 bg-[#1D6F42] text-white font-bold rounded-xl hover:bg-[#145231] transition-transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" /> Download Excel
                </button>
            </div>
        </div>
    );
}

export default function ClientExcelPage() {
    const [file, setFile] = useState<File | null>(null);
    const [showRename, setShowRename] = useState(false);

    const {
        convert,
        isProcessing,
        progress,
        status,
        hasResult,
        download
    } = useExcelConverter();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please select a valid PDF file.');
            return;
        }
        setFile(selectedFile);
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
                            PDF to Excel Financial
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Transform Bank Statements and Invoices into clean, formula-ready Excel sheets.
                            <br /><span className="text-[#1D6F42] font-semibold">Semantic Mapping Engine</span> detects dates, credits, and debits automatically.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 transition-all">
                        {/* State 1: Upload */}
                        {!file && (
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#1D6F42] hover:bg-[#E6F4EA]/30 transition-all cursor-pointer group"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                                <div className="w-20 h-20 bg-[#E6F4EA] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <FileSpreadsheet className="w-10 h-10 text-[#1D6F42] transition-colors" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#111F35] mb-2">Select Financial PDF</h2>
                                <p className="text-gray-500 mb-6">Bank Statements, Invoices, or Receipts</p>
                                <span className="inline-flex items-center justify-center px-8 py-3 bg-[#1D6F42] text-white font-bold rounded-lg hover:bg-[#145231] transition-colors shadow-md shadow-[#1D6F42]/20">
                                    Analyze PDF
                                </span>
                            </div>
                        )}

                        {/* State 2: Processing (Live Table Preview) */}
                        {file && isProcessing && (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <TableLivePreview status={status} progress={progress} />
                            </div>
                        )}

                        {/* State 3: Result */}
                        {file && hasResult && !isProcessing && (
                            <div className="text-center animate-in fade-in zoom-in duration-300 pt-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-[#111F35] mb-2">Extraction Complete</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    Your data has been mapped to <span className="font-mono text-[#1D6F42]">.XLSX</span> with strict type enforcement.
                                </p>

                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button onClick={() => setFile(null)} className="px-6 py-3 text-gray-600 font-bold hover:text-[#111F35] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                        Convert Another
                                    </button>
                                    <button onClick={() => setShowRename(true)} className="px-8 py-3 bg-[#1D6F42] text-white font-bold rounded-lg hover:bg-[#145231] transition-transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2">
                                        <FileSpreadsheet className="w-5 h-5" /> Download Excel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RenameExcelModal isOpen={showRename} onClose={() => setShowRename(false)} onDownload={download} />
        </div>
    );
}
