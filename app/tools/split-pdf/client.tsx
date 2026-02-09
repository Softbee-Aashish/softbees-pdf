'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import RangeInputGroup from '@/components/Splitter/RangeInputGroup';
import RenameModal from '@/components/Splitter/RenameModal';
import { useSplitterAction } from '@/hooks/useSplitterAction';
import { extractImagesFromPDF } from '@/utils/pdf-extractor'; // Reusing for thumbnails
import {
    Upload,
    FileText,
    ArrowLeft,
    Link as LinkIcon,
    Scissors,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ClientSplitPage() {
    // PDF State
    const [file, setFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [thumbnails, setThumbnails] = useState<string[]>([]);

    // Split Configuration
    const [ranges, setRanges] = useState<string[]>(['']);
    const [isRenameOpen, setIsRenameOpen] = useState(false);

    // Logic Hook
    const { isProcessing, handleSplit } = useSplitterAction();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. File Upload Handler
    const handleFile = async (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please select a valid PDF file.');
            return;
        }

        const toastId = toast.loading('Loading PDF...');
        setFile(selectedFile);

        try {
            // Generate Thumbnails for Left Pane
            // Note: reusing extractImagesFromPDF logic which returns base64 images per page
            const pages = await extractImagesFromPDF(selectedFile);
            setThumbnails(pages.map(p => p.previewUrl));
            setPageCount(pages.length);

            toast.success(`Loaded ${pages.length} pages`, { id: toastId });
        } catch (error) {
            console.error('Thumbnail generation failed:', error);
            toast.error('Failed to load PDF preview', { id: toastId });
            setFile(null); // Reset on failure
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const onDownloadRequest = (baseName: string) => {
        if (!file) return;
        handleSplit({ file, ranges, baseName });
    };

    // Helper: Check if a page is included in any range (Digital Highlighter)
    const isPageSelected = (pageIndex: number) => {
        // pageIndex is 0-based from map, but user inputs 1-based
        const pageNum = pageIndex + 1;

        return ranges.some(range => {
            if (!range) return false;
            // Simple check: is strictly 'X' or within 'X-Y'
            const parts = range.split('-').map(p => parseInt(p.trim()));
            if (parts.length === 1) return parts[0] === pageNum;
            if (parts.length === 2) return pageNum >= parts[0] && pageNum <= parts[1];
            return false;
        });
    };

    // Initial State: Upload
    if (!file) {
        return (
            <div className="min-h-screen bg-white font-sans text-[#111F35]">
                <Navbar />

                <main className="max-w-5xl mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold mb-4">Split PDF Files</h1>
                        <p className="text-[#111F35]/60">
                            Extract specific pages or split your document into multiple files.
                            Secure, client-side processing.
                        </p>
                    </div>

                    <div
                        className="border-2 border-dashed border-blue-200 rounded-3xl p-16 text-center hover:border-[#3B82F6] hover:bg-blue-50/30 transition-all cursor-pointer"
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
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#3B82F6]">
                            <Scissors className="w-10 h-10 -rotate-90" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Drop PDF here to Split</h3>
                        <span className="inline-block px-6 py-3 bg-[#3B82F6] text-white font-bold rounded-xl mt-4 hover:bg-[#2563EB] transition-transform hover:scale-105 shadow-lg shadow-[#3B82F6]/20">
                            Select PDF File
                        </span>
                    </div>
                </main>
            </div>
        );
    }

    // Active State: Dual Pane Layout
    return (
        <div className="h-screen w-screen flex flex-col bg-[#F3F4F6] overflow-hidden">
            {/* Header */}
            <header className="h-16 w-full bg-[#111F35] flex items-center justify-between px-6 shadow-lg shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <span className="text-white font-bold text-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
                        {pageCount} Pages Loaded
                    </span>
                </div>
                <div className="text-gray-400 text-sm font-medium">
                    Soft Bees PDF Splitter
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Pane: Visual Preview */}
                <div className="flex-1 bg-gray-100 p-8 overflow-y-auto custom-scrollbar border-r border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {thumbnails.map((src, idx) => {
                            const isSelected = isPageSelected(idx);
                            return (
                                <div
                                    key={idx}
                                    className={`relative rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${isSelected
                                        ? 'ring-4 ring-[#3B82F6] scale-105 shadow-xl z-10'
                                        : 'ring-1 ring-gray-200 opacity-80 hover:opacity-100 hover:scale-[1.02]'
                                        }`}
                                >
                                    {/* Page Number Badge */}
                                    <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold shadow-sm ${isSelected ? 'bg-[#3B82F6] text-white' : 'bg-[#111F35] text-white'
                                        }`}>
                                        Pg {idx + 1}
                                    </div>

                                    <img
                                        src={src}
                                        alt={`Page ${idx + 1}`}
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Pane: Controls */}
                <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-20">
                    <div className="p-8 flex-1 overflow-y-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#111F35] mb-2">Split Configuration</h2>
                            <p className="text-gray-500 text-sm">
                                Enter the page ranges you wish to extract (e.g., 1-5). Each range will become a separate file.
                            </p>
                        </div>

                        <RangeInputGroup
                            ranges={ranges}
                            setRanges={setRanges}
                            totalPageCount={pageCount}
                        />
                    </div>

                    <div className="p-8 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={() => setIsRenameOpen(true)}
                            disabled={isProcessing || ranges.some(r => !r.trim())} // Simple validation
                            className="w-full py-4 bg-[#3B82F6] text-white text-xl font-bold rounded-xl hover:bg-[#2563EB] transition-transform hover:scale-[1.01] shadow-xl shadow-[#3B82F6]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <Scissors className="w-5 h-5 -rotate-90" /> Split PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <RenameModal
                isOpen={isRenameOpen}
                onClose={() => setIsRenameOpen(false)}
                onDownload={onDownloadRequest}
                rangeCount={ranges.length}
            />
        </div>
    );
}
