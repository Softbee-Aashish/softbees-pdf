/**
 * File Table Workspace
 * Layout: Full Width, High Contrast
 * Features: Batch Settings, Inline Controls, Smooth Loading
 */
'use client';

import { Download, Trash2, FileText, ArrowRight, Settings2, CheckSquare, Square } from 'lucide-react';
import { formatFileSize } from '@/utils/file-helpers';
import { useState } from 'react';

export interface FileItem {
    id: string;
    file: File;
    targetSize?: number;
    targetUnit?: 'KB' | 'MB';
    status: 'pending' | 'compressing' | 'complete' | 'error';
    progress?: number;
    compressedBlob?: Blob;
    error?: string;
}

interface FileTableProps {
    files: FileItem[];
    onCompress: (fileId: string) => void;
    onDownload: (fileId: string) => void;
    onRemove: (fileId: string) => void;
    onTargetUpdate: (fileId: string, size: number, unit: 'KB' | 'MB') => void;
    onApplyToAll: (size: number, unit: 'KB' | 'MB') => void;
}

export default function FileTable({
    files,
    onCompress,
    onDownload,
    onRemove,
    onTargetUpdate,
    onApplyToAll,
}: FileTableProps) {
    const [applyAll, setApplyAll] = useState(false);

    const handleFirstFileUpdate = (size: number, unit: 'KB' | 'MB') => {
        // Always update the first file
        if (files.length > 0) {
            onTargetUpdate(files[0].id, size, unit);

            // If batch mode is on, update everyone else too
            if (applyAll) {
                onApplyToAll(size, unit);
            }
        }
    };

    const toggleApplyAll = () => {
        const newState = !applyAll;
        setApplyAll(newState);
        // If turning on, immediately sync all to first file
        if (newState && files.length > 0) {
            const first = files[0];
            if (first.targetSize && first.targetUnit) {
                onApplyToAll(first.targetSize, first.targetUnit);
            }
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            {/* Header with Batch Option */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-[#111F35]">Your Workspace</h2>
                    <p className="text-[#111F35]/60 font-medium mt-1">{files.length} active files</p>
                </div>

                {files.length > 1 && (
                    <button
                        onClick={toggleApplyAll}
                        className="flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer border border-[#111F35]/10"
                    >
                        {applyAll ? (
                            <CheckSquare className="w-6 h-6 text-[#F63049]" />
                        ) : (
                            <Square className="w-6 h-6 text-[#111F35]/40" />
                        )}
                        <span className="font-bold text-[#111F35]">
                            Apply first file settings to all
                        </span>
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {files.map((file, index) => {
                    const isFirst = index === 0;

                    return (
                        <div
                            key={file.id}
                            className="bg-white rounded-2xl border-2 border-[#111F35]/10 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row items-center gap-6"
                        >
                            {/* File Info Section - Stretches */}
                            <div className="flex-1 flex items-center gap-4 w-full">
                                <div className="p-4 bg-[#F63049]/10 rounded-2xl shrink-0">
                                    <FileText className="w-8 h-8 text-[#F63049]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-bold text-[#111F35] truncate" title={file.file.name}>
                                        {file.file.name}
                                    </h3>
                                    <p className="text-[#111F35] font-bold mt-1 text-sm">
                                        Original: {formatFileSize(file.file.size)}
                                    </p>
                                </div>
                            </div>

                            {/* Controls Section - Wide & Stretched */}
                            <div className="flex-1 w-full flex items-center justify-end gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-[300px]">

                                {/* STATUS: PENDING */}
                                {file.status === 'pending' && (
                                    <>
                                        <div className="flex-1 flex items-center gap-2 mr-2">
                                            <span className="text-sm font-bold text-[#111F35] uppercase mr-2 hidden xl:inline shrink-0">Target Size:</span>
                                            <div className="flex-1 flex items-center bg-white rounded-lg border-2 border-[#111F35]/10 overflow-hidden focus-within:border-[#F63049] h-12 shadow-sm">
                                                <input
                                                    type="number"
                                                    value={file.targetSize || ''}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 0;
                                                        if (isFirst) {
                                                            handleFirstFileUpdate(val, file.targetUnit || 'KB');
                                                        } else {
                                                            onTargetUpdate(file.id, val, file.targetUnit || 'KB');
                                                        }
                                                    }}
                                                    className="w-full px-4 text-xl font-bold text-[#111F35] outline-none text-center bg-transparent min-w-[80px]"
                                                    placeholder="Size"
                                                />
                                                <div className="w-[2px] h-8 bg-gray-100"></div>
                                                <select
                                                    value={file.targetUnit || 'KB'}
                                                    onChange={(e) => {
                                                        const unit = e.target.value as 'KB' | 'MB';
                                                        if (isFirst) {
                                                            handleFirstFileUpdate(file.targetSize || 1024, unit);
                                                        } else {
                                                            onTargetUpdate(file.id, file.targetSize || 1024, unit);
                                                        }
                                                    }}
                                                    className="px-4 py-2 font-bold text-[#111F35] bg-transparent outline-none cursor-pointer hover:bg-gray-50 h-full"
                                                >
                                                    <option value="KB">KB</option>
                                                    <option value="MB">MB</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => onCompress(file.id)}
                                            className="h-12 px-8 bg-[#F63049] hover:bg-[#D02752] text-white font-bold text-lg rounded-lg shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
                                        >
                                            Compress
                                        </button>
                                    </>
                                )}

                                {/* STATUS: COMPRESSING - Smooth Animation */}
                                {file.status === 'compressing' && (
                                    <div className="w-full md:w-80 flex flex-col gap-2 px-2">
                                        <div className="flex justify-between items-center text-xs font-bold text-[#111F35]">
                                            <span className="text-[#F63049] animate-pulse">Processing...</span>
                                            <span>{Math.round(file.progress || 0)}%</span>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#F63049] to-[#D02752] transition-all duration-300 ease-out"
                                                style={{ width: `${Math.max(5, file.progress || 0)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STATUS: COMPLETE - Download Button */}
                                {file.status === 'complete' && (
                                    <div className="flex items-center gap-3">
                                        <div className="text-right mr-2 hidden md:block">
                                            <span className="block text-xs font-bold text-green-600 uppercase tracking-wider">Done ✓</span>
                                            <span className="text-xs font-bold text-[#111F35] opacity-60">
                                                {formatFileSize(file.compressedBlob?.size || 0)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => onDownload(file.id)}
                                            className="h-12 px-6 bg-[#111F35] hover:bg-black text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download
                                        </button>
                                    </div>
                                )}

                                {/* STATUS: ERROR */}
                                {file.status === 'error' && (
                                    <div className="flex items-center gap-3 text-red-600 mr-4">
                                        <span className="font-bold">Error</span>
                                    </div>
                                )}

                                {/* Remove Button */}
                                <button
                                    onClick={() => onRemove(file.id)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                    title="Remove file"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
