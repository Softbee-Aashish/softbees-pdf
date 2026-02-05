/**
 * Example PDF Compressor Component
 * Demonstrates how to use the compression engine with UI
 */

'use client';

import { useState } from 'react';
import { usePDFCompression } from '@/utils/usePDFCompression';
import { downloadBlob, formatFileSize, isPDF, generateCompressedFilename } from '@/utils/file-helpers';

export default function PDFCompressor() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [targetSize, setTargetSize] = useState<string>('200');
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [outputFilename, setOutputFilename] = useState('');

    const { state, progress, result, error, processedBlob, compress, reset } = usePDFCompression();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && isPDF(file)) {
            setSelectedFile(file);
            setOutputFilename(generateCompressedFilename(file.name));
        } else {
            alert('Please select a valid PDF file');
        }
    };

    const handleCompress = async () => {
        if (!selectedFile) return;

        const targetKB = parseInt(targetSize);
        if (isNaN(targetKB) || targetKB <= 0) {
            alert('Please enter a valid target size');
            return;
        }

        await compress(selectedFile, targetKB);
        setShowRenameModal(true);
    };

    const handleDownload = () => {
        if (!processedBlob) return;
        downloadBlob(processedBlob, outputFilename);
        setShowRenameModal(false);
        reset();
        setSelectedFile(null);
    };

    const handleReset = () => {
        reset();
        setSelectedFile(null);
        setShowRenameModal(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">SOFTBEES PDF Compressor</h1>

            {/* File Upload */}
            <div className="mb-6">
                <label className="block mb-2 font-semibold">Select PDF File</label>
                <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    disabled={state === 'processing'}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
                />
                {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                )}
            </div>

            {/* Target Size Input */}
            <div className="mb-6">
                <label className="block mb-2 font-semibold">Target Size (KB)</label>
                <input
                    type="number"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    disabled={state === 'processing'}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 200"
                />
            </div>

            {/* Compress Button */}
            <button
                onClick={handleCompress}
                disabled={!selectedFile || state === 'processing'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
                {state === 'processing' ? 'Compressing...' : 'Compress PDF'}
            </button>

            {/* Progress Display */}
            {progress && state === 'processing' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold">{progress.status}</span>
                        <span>{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                        ></div>
                    </div>
                    {progress.totalPages > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                            Page {progress.currentPage} of {progress.totalPages}
                        </p>
                    )}
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-semibold">Error:</p>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={handleReset}
                        className="mt-2 text-sm text-red-700 underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Result Display */}
            {result && state === 'ready' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-bold text-green-800 mb-2">Compression Complete! ✓</h3>
                    <div className="space-y-1 text-sm text-gray-700">
                        <p>Original Size: <strong>{formatFileSize(result.originalSize)}</strong></p>
                        <p>Compressed Size: <strong>{formatFileSize(result.compressedSize)}</strong></p>
                        <p>Compression Ratio: <strong>{result.compressionRatio.toFixed(2)}x</strong></p>
                        <p>Quality Used: <strong>{Math.round(result.quality * 100)}%</strong></p>
                    </div>
                </div>
            )}

            {/* Rename Modal */}
            {showRenameModal && processedBlob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Download Compressed PDF</h2>
                        <label className="block mb-2 font-semibold">File Name</label>
                        <input
                            type="text"
                            value={outputFilename}
                            onChange={(e) => setOutputFilename(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                            placeholder="Enter filename"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleDownload}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Download
                            </button>
                            <button
                                onClick={() => setShowRenameModal(false)}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
