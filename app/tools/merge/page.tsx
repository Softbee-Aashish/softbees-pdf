'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import AdComponent from '@/lib/ads/AdComponent';
import { mergePDFs } from '@/utils/merge-engine';
import { Upload, X, ArrowUp, ArrowDown, FileText, CheckCircle, Loader2, Download } from 'lucide-react';
import { formatBytes } from '@/utils/formatters';

interface MergeFile {
    id: string;
    file: File;
    name: string;
    size: number;
}

export default function MergePage() {
    const [files, setFiles] = useState<MergeFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
    const [downloadName, setDownloadName] = useState('softbees-merged');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Upload Handling
    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;
        const addedFiles: MergeFile[] = Array.from(newFiles)
            .filter(f => f.type === 'application/pdf')
            .map(f => ({
                id: Math.random().toString(36).substring(7),
                file: f,
                name: f.name,
                size: f.size
            }));
        setFiles(prev => [...prev, ...addedFiles]);
        setMergedBlob(null); // Reset merge if new files added
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    // 2. Arrange Handling
    const moveFile = (index: number, direction: -1 | 1) => {
        const newFiles = [...files];
        const temp = newFiles[index];
        newFiles[index] = newFiles[index + direction];
        newFiles[index + direction] = temp;
        setFiles(newFiles);
        setMergedBlob(null);
    };

    const removeFile = (id: string) => {
        setFiles(files.filter(f => f.id !== id));
        setMergedBlob(null);
    };

    // 3. Merge Logic
    const handleMerge = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);

        try {
            const rawFiles = files.map(f => f.file);
            const blob = await mergePDFs(rawFiles);
            setMergedBlob(blob);

            // Set default name from first file (remove extension)
            if (rawFiles.length > 0) {
                const firstFileName = rawFiles[0].name.replace(/\.pdf$/i, '');
                setDownloadName(firstFileName);
            }
        } catch (error) {
            console.error("Merge failed", error);
            alert("Failed to merge PDFs. One of the files might be corrupted.");
        } finally {
            setIsProcessing(false);
        }
    };

    // 4. Download
    const handleDownload = () => {
        if (!mergedBlob) return;
        const url = URL.createObjectURL(mergedBlob);
        const link = document.createElement('a');
        link.href = url;
        // Enforce mandatory suffix
        const cleanName = downloadName.replace(/[^\w\s-]/g, ''); // Basic sanitization
        link.download = `${cleanName}_softbees.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-[#111F35]">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold mb-4">Merge PDF Files</h1>
                    <p className="text-[#111F35]/60">Combine multiple PDFs into one unified document in seconds.</p>
                </div>

                <div className="mb-8 flex justify-center">
                    <AdComponent position="inline" />
                </div>

                {/* State 1: Upload (Empty State) */}
                {files.length === 0 && (
                    <div
                        className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer ${isDragging ? 'border-[#F63049] bg-[#FFF0F3]' : 'border-[#8A244B]/30 hover:border-[#F63049] bg-white'
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
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
                        <h3 className="text-2xl font-bold mb-2">Drop PDFs here to Merge</h3>
                        <span className="inline-block px-6 py-3 bg-[#F63049] text-white font-bold rounded-xl mt-4 hover:bg-[#D02752] transition-colors shadow-lg shadow-[#F63049]/20">
                            Select PDF Files
                        </span>
                    </div>
                )}

                {/* State 2 & 3: Arrange & Processing */}
                {files.length > 0 && !mergedBlob && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Arrange Files ({files.length})</h2>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[#F63049] font-bold text-sm hover:underline flex items-center"
                            >
                                + Add more files
                            </button>
                            <input
                                type="file"
                                multiple
                                accept=".pdf"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </div>

                        <div className="space-y-3 mb-8">
                            {files.map((file, idx) => (
                                <div key={file.id} className="flex items-center bg-gray-50 border border-gray-200 p-4 rounded-xl group hover:border-[#F63049]/30 transition-colors">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#F63049] shadow-sm mr-4">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-grow min-w-0 mr-4">
                                        <p className="font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => moveFile(idx, -1)}
                                            disabled={idx === 0}
                                            className="p-2 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-colors text-gray-600"
                                        >
                                            <ArrowUp className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => moveFile(idx, 1)}
                                            disabled={idx === files.length - 1}
                                            className="p-2 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-colors text-gray-600"
                                        >
                                            <ArrowDown className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => removeFile(file.id)}
                                            className="p-2 hover:bg-[#FFF0F3] text-gray-400 hover:text-[#F63049] rounded-lg transition-colors ml-2"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isProcessing ? (
                            <div className="text-center py-8">
                                <Loader2 className="w-12 h-12 text-[#111F35] animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-[#111F35]">Merging PDFs...</h3>
                                <p className="text-gray-500">Magic at work!</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleMerge}
                                disabled={files.length < 2}
                                className="w-full py-4 bg-[#F63049] text-white text-xl font-bold rounded-xl hover:bg-[#D02752] transition-transform hover:scale-[1.01] shadow-xl shadow-[#F63049]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                MERGE PDF
                            </button>
                        )}
                    </div>
                )}

                {/* State 4: Success */}
                {mergedBlob && (
                    <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-12 text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#111F35] mb-4">PDFs Merged Successfully!</h2>
                        <p className="text-gray-500 mb-8">Your documents have been combined without uploading to any server.</p>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
                            <div className="relative w-full sm:w-auto">
                                <input
                                    type="text"
                                    value={downloadName}
                                    onChange={(e) => setDownloadName(e.target.value)}
                                    className="w-full sm:w-64 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#111F35] focus:border-transparent outline-none font-medium text-center sm:text-left pr-32"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none bg-white pl-2">
                                    _softbees.pdf
                                </span>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="w-full sm:w-auto px-8 py-3 bg-[#111F35] text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Download className="w-5 h-5" /> Download
                            </button>
                        </div>

                        <button
                            onClick={() => { setFiles([]); setMergedBlob(null); }}
                            className="text-gray-400 hover:text-[#F63049] text-sm font-medium transition-colors"
                        >
                            Merge more files
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}
