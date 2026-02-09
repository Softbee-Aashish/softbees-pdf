'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { useOrganizerStore } from '@/store/organizerStore'; // FIXED IMPORT
import OrganizerGrid from '@/components/Organizer/OrganizerGrid';
import { exportOrganizedPDF } from '@/utils/organizer-export';
import { downloadFile } from '@/utils/file-helpers';
import {
    Upload,
    RotateCw,
    RotateCcw,
    Trash2,
    Save,
    Loader2,
    ArrowLeft,
    FilePlus2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Metadata moved to page.tsx

export default function OrganizerPage() {
    const {
        pages,
        fileRegistry,
        documentName,
        addFiles,
        rotatePage,
        rotateAll,
        deletePage,
        insertBlankPage,
        reorderPages,
        reset,
        isProcessing,
        error
    } = useOrganizerStore(); // FIXED HOOK USAGE

    const [isSaving, setIsSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const visiblePages = pages.filter(p => !p.isDeleted);

    // File Handling
    const handleFiles = async (fileList: FileList | null) => {
        if (!fileList) return;

        // Convert FileList to array
        const filesArray = Array.from(fileList).filter(f => f.type === 'application/pdf');

        if (filesArray.length > 0) {
            const toastId = toast.loading('Loading files...');
            try {
                await addFiles(filesArray);
                toast.success(`Successfully added ${filesArray.length} file(s)`, { id: toastId });
            } catch (err: any) {
                toast.error(err.message || 'Failed to add files', { id: toastId });
            }
        } else {
            toast.error('Please select valid PDF files.');
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        await handleFiles(e.dataTransfer.files);
    };

    // Export Handling
    const handleSave = async () => {
        if (visiblePages.length === 0) return;
        setIsSaving(true);
        const toastId = toast.loading('Generating PDF...');

        try {
            const fileName = documentName || 'organized_document';
            const pdfBytes = await exportOrganizedPDF(pages, fileRegistry);

            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            downloadFile(blob, `${fileName}_softbees.pdf`);

            toast.success('PDF saved successfully!', { id: toastId });
        } catch (error: any) {
            console.error('Export failed:', error);
            toast.error(`Failed to save PDF: ${error.message}`, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    // Check global loading state
    const isLoading = isProcessing || isSaving;

    // Empty State
    if (pages.length === 0 && !isLoading) {
        return (
            <div className="min-h-screen bg-white font-sans text-[#111F35]">
                <Navbar />

                <main className="max-w-5xl mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold mb-4">Organize PDF</h1>
                        <p className="text-[#111F35]/60">Rearrange, rotate, and delete pages. Merge multiple files into one.</p>
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
                        aria-label="Upload PDF files to organize"
                    >
                        <input
                            type="file"
                            multiple
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        <div className="w-20 h-20 bg-[#FFF0F3] rounded-full flex items-center justify-center mx-auto mb-6 text-[#F63049]">
                            <Upload className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Drop PDFs here to Organize</h3>
                        <span className="inline-block px-6 py-3 bg-[#F63049] text-white font-bold rounded-xl mt-4 hover:bg-[#D02752] transition-colors shadow-lg shadow-[#F63049]/20">
                            Select PDF Files
                        </span>
                    </div>

                    {error && (
                        <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium">
                            Error: {error}
                        </div>
                    )}
                </main>
            </div>
        );
    }

    // Active State
    return (
        <div className="h-screen w-screen flex flex-col bg-[#F3F4F6] overflow-hidden">
            {/* Header */}
            <header className="h-16 w-full bg-[#111F35] flex items-center justify-between px-6 shadow-lg shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <span className="text-white font-bold text-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
                        {visiblePages.length} Pages
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => rotateAll('ccw')}
                        className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <RotateCcw className="w-4 h-4" /> Rotate All
                    </button>
                    <button
                        onClick={() => rotateAll('cw')}
                        className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <RotateCw className="w-4 h-4" /> Rotate All
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-2" />
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash2 className="w-4 h-4" /> Clear All
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-white/30 text-white rounded-lg text-sm font-bold hover:bg-white/10 transition flex items-center gap-2"
                    >
                        <FilePlus2 className="w-4 h-4" /> Add PDF
                        <input
                            type="file"
                            multiple
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-6 py-2 bg-[#F63049] text-white rounded-lg text-sm font-bold hover:bg-[#D02752] transition flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                {isLoading && visiblePages.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
                        <Loader2 className="w-12 h-12 text-[#111F35] animate-spin" />
                        <div className="absolute mt-20 text-[#111F35] font-medium">Processing...</div>
                    </div>
                )}

                <OrganizerGrid
                    pages={pages}
                    onRotate={rotatePage}
                    onDelete={deletePage}
                    onInsert={insertBlankPage}
                    onReorder={reorderPages}
                />
            </main>
        </div>
    );
}
