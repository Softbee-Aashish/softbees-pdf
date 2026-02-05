/**
 * Central Compression Card - Pi7 Style Layout
 * Updated with Robust Engine Integration
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { FileText, Download, CheckCircle, Loader2, Upload, AlertCircle } from 'lucide-react';
import { formatBytes } from '@/utils/formatters';
import type { PDFCompressionEngine } from '@/utils/pdf-engine';

type CardState = 'idle' | 'file_selected' | 'compressing' | 'success' | 'error';

export default function CompressionCard() {
    const [state, setState] = useState<CardState>('idle');
    const [file, setFile] = useState<File | null>(null);

    // Compression Inputs
    const [targetSize, setTargetSize] = useState<string>('');
    const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('MB');

    // Results
    const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
    const [compressedSize, setCompressedSize] = useState<number>(0);
    const [renamedFilename, setRenamedFilename] = useState<string>('');

    // Status
    const [progress, setProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState<string>('');

    // PROGRESS GUARD: Ensure monotonic progress (never goes backwards)
    const [safeProgress, setSafeProgress] = useState(0);
    useEffect(() => {
        if (progress > safeProgress) {
            setSafeProgress(progress);
        } else if (progress === 0) {
            setSafeProgress(0); // Reset allowed on start
        }
    }, [progress]);

    // Handle file select
    const handleFileSelect = useCallback((selectedFile: File) => {
        setFile(selectedFile);
        setState('file_selected');
        setRenamedFilename(selectedFile.name.replace('.pdf', ''));
        setSafeProgress(0);
        setProgress(0);
        // Pre-fill a suggestion? No, keep empty as per "user requirement is strictly followed"
        setTargetSize('');
    }, []);

    const handleCompress = useCallback(async () => {
        if (!file || !targetSize) return;

        setState('compressing');
        setSafeProgress(0);
        setProgress(0);
        setStatusMessage("Starting compression...");

        try {
            // Dynamic import to avoid SSR issues and scope errors
            const { PDFCompressionEngine } = await import('@/utils/pdf-engine');
            const engine = new PDFCompressionEngine();
            const result = await engine.compressPDF(
                file,
                targetSize,
                targetUnit,
                (prog, msg) => {
                    setProgress(prog);
                    setStatusMessage(msg);
                }
            );

            // Result Handling
            const blob = new Blob([result.data as any], { type: 'application/pdf' });
            setCompressedBlob(blob);
            setCompressedSize(result.finalSize);
            setStatusMessage(result.message || "Done!");
            setSafeProgress(100);
            setState('success');

        } catch (err: any) {
            console.error("Compression failed:", err);
            setState('error');
            setStatusMessage(err.message || "An unexpected error occurred.");
        }

    }, [file, targetSize, targetUnit]);

    // Handle download with Size Check
    const handleDownload = useCallback(() => {
        if (!compressedBlob || !file) return;

        const originalMB = file.size / (1024 * 1024);
        const finalMB = compressedSize / (1024 * 1024);

        // Strict Verification Alert
        if (finalMB >= originalMB) {
            alert(`Note: The file could not be compressed further without quality loss. Downloading original size.`);
        }

        const filename = `${renamedFilename}_softbees.pdf`;

        // Create download link
        const url = URL.createObjectURL(compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    }, [compressedBlob, compressedSize, file, renamedFilename]);

    // Reset
    const handleReset = useCallback(() => {
        setFile(null);
        setCompressedBlob(null);
        setTargetSize('');
        setState('idle');
        setSafeProgress(0);
        setProgress(0);
    }, []);

    // Drag & Drop
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') handleFileSelect(droppedFile);
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-12">
            <div
                className={`border-2 border-dashed ${state === 'error' ? 'border-red-500 bg-red-50' : 'border-[#8A244B] bg-[#F63049]/5'} rounded-2xl p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center transition-colors`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {/* IDLE */}
                {state === 'idle' && (
                    <div className="text-center">
                        <div className="mb-6">
                            <Upload className="w-24 h-24 text-[#F63049] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-[#111F35] mb-2">Drop your PDF here</h2>
                            <p className="text-[#111F35]/60 font-medium">or click to browse</p>
                        </div>
                        <input type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" id="file-input" />
                        <label htmlFor="file-input" className="px-8 py-4 bg-[#F63049] hover:bg-[#D02752] text-white font-bold rounded-xl cursor-pointer inline-block shadow-lg transition-transform hover:scale-105">
                            Choose PDF File
                        </label>
                    </div>
                )}

                {/* FILE SELECTED */}
                {state === 'file_selected' && file && (
                    <div className="w-full max-w-md animate-fade-in-up">
                        <div className="text-center mb-8">
                            <div className="inline-block p-6 bg-white rounded-2xl shadow-md mb-4">
                                <FileText className="w-16 h-16 text-[#F63049]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#111F35] mb-2 truncate">{file.name}</h3>
                            <div className="inline-block px-3 py-1 bg-[#111F35] text-white text-sm font-bold rounded-full">
                                Original: {formatBytes(file.size)}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#111F35] mb-2 uppercase tracking-wide">
                                Target Size (Required)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={targetSize}
                                    onChange={(e) => setTargetSize(e.target.value)}
                                    placeholder="e.g. 5"
                                    autoFocus
                                    min="0.1"
                                    step="0.1"
                                    className="flex-1 px-4 py-3 text-2xl font-bold text-[#111F35] border-2 border-[#111F35]/10 rounded-xl outline-none focus:border-[#F63049] text-center"
                                />
                                <select
                                    value={targetUnit}
                                    onChange={(e) => setTargetUnit(e.target.value as 'KB' | 'MB')}
                                    className="px-4 py-3 text-xl font-bold text-[#111F35] border-2 border-[#111F35]/10 rounded-xl outline-none bg-white cursor-pointer"
                                >
                                    <option value="MB">MB</option>
                                    <option value="KB">KB</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleCompress}
                            disabled={!targetSize}
                            className="w-full py-4 bg-[#F63049] hover:bg-[#D02752] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl shadow-lg transition-all"
                        >
                            Resize PDF Now
                        </button>
                        <button onClick={handleReset} className="w-full mt-3 py-2 text-[#111F35]/60 hover:text-[#111F35] text-sm transition-colors">
                            Cancel
                        </button>
                    </div>
                )}

                {/* COMPRESSING */}
                {state === 'compressing' && (
                    <div className="w-full max-w-md text-center">
                        <Loader2 className="w-16 h-16 text-[#F63049] mx-auto mb-4 animate-spin" />
                        <h3 className="text-xl font-bold text-[#111F35] mb-4">Compressing...</h3>

                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2 relative">
                            <div
                                className="h-full bg-gradient-to-r from-[#F63049] to-[#D02752] transition-all duration-500 ease-out"
                                style={{ width: `${safeProgress}%` }}
                            />
                        </div>
                        <p className="text-sm font-medium text-[#111F35]/60 mt-2">{statusMessage}</p>
                    </div>
                )}

                {/* SUCCESS */}
                {state === 'success' && file && (
                    <div className="w-full max-w-md animate-fade-in-up">
                        <div className="text-center mb-8">
                            <div className="inline-block relative p-6 bg-white rounded-2xl shadow-md mb-4">
                                <FileText className="w-16 h-16 text-[#F63049]" />
                                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-green-600 mb-2">Success!</h3>
                            <p className="text-[#111F35] text-lg">
                                Now <span className="font-bold text-[#F63049]">{formatBytes(compressedSize)}</span>
                            </p>

                            {/* Size Delta */}
                            {compressedSize < file.size ? (
                                <p className="text-sm text-green-600 font-bold mt-1">
                                    Saved {formatBytes(file.size - compressedSize)} ({((1 - compressedSize / file.size) * 100).toFixed(0)}%)
                                </p>
                            ) : (
                                <p className="text-sm text-orange-500 font-bold mt-1">
                                    0% smaller (Already optimized)
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#111F35] mb-2">Rename File (Optional):</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={renamedFilename}
                                    onChange={(e) => setRenamedFilename(e.target.value)}
                                    className="w-full px-4 py-3 pr-32 border-2 border-[#111F35]/10 rounded-xl font-bold text-[#111F35] focus:border-[#F63049] outline-none"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111F35]/40 font-bold text-sm pointer-events-none">_softbees.pdf</div>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full py-4 bg-[#111F35] hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mb-4"
                        >
                            <Download className="w-6 h-6" />
                            Download PDF
                        </button>

                        <button onClick={handleReset} className="w-full py-2 text-[#F63049] hover:text-[#D02752] font-bold text-sm transition-colors">
                            Compress Another File →
                        </button>
                    </div>
                )}

                {/* ERROR */}
                {state === 'error' && (
                    <div className="text-center max-w-md">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-red-600 mb-2">Compression Error</h3>
                        <p className="text-[#111F35] mb-6">{statusMessage}</p>
                        <button onClick={handleReset} className="px-8 py-3 bg-[#111F35] text-white rounded-xl font-bold">Try Again</button>
                    </div>
                )}

            </div>
        </div>
    );
}
