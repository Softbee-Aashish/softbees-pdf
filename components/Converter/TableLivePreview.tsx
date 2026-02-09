'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileSpreadsheet, Loader2 } from 'lucide-react';

interface TableLivePreviewProps {
    status: string;
    progress: number;
}

export default function TableLivePreview({ status, progress }: TableLivePreviewProps) {
    // Simulate rows being "found"
    const [rows, setRows] = useState<number[]>([]);

    useEffect(() => {
        if (progress > 0 && progress < 100) {
            const interval = setInterval(() => {
                setRows(prev => [...prev.slice(-8), Math.random()]); // Keep list short
            }, 300);
            return () => clearInterval(interval);
        }
    }, [progress]);

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Header simulating Excel UI */}
            <div className="bg-[#1D6F42] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileSpreadsheet className="text-white w-5 h-5" />
                    <span className="text-white font-semibold text-sm">Reviewing Financial Data...</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex gap-4 text-xs text-gray-600">
                <span className="font-bold">Home</span>
                <span>Insert</span>
                <span>Data</span>
                <span>Review</span>
                <span className="text-[#1D6F42] font-semibold ml-auto">{status}</span>
            </div>

            {/* Grid Area */}
            <div className="p-0 overflow-hidden relative h-64 bg-white">
                {/* Grid Overlay */}
                <div className="absolute inset-0 z-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '40px 24px' }}>
                </div>

                {/* Simulated Data Injection */}
                <div className="relative z-10 p-4 font-mono text-xs">
                    <div className="flex border-b border-gray-200 pb-1 mb-2 font-bold text-gray-500">
                        <div className="w-10">#</div>
                        <div className="w-24">Date</div>
                        <div className="flex-1">Description</div>
                        <div className="w-24 text-right">Debit</div>
                        <div className="w-24 text-right">Credit</div>
                        <div className="w-24 text-right">Balance</div>
                    </div>

                    {rows.map((_, i) => (
                        <div key={i} className="flex border-b border-gray-100 py-2 animate-in slide-in-from-left duration-300">
                            <div className="w-10 text-gray-400">{i + 1}</div>
                            <div className="w-24 text-gray-600">12-Jun-24</div>
                            <div className="flex-1 text-gray-800 truncate">TRANSFER REF #{Math.floor(Math.random() * 100000)}</div>
                            <div className="w-24 text-right text-gray-500">{Math.random() > 0.5 ? '-' : '$' + (Math.random() * 100).toFixed(2)}</div>
                            <div className="w-24 text-right text-[#1D6F42] font-bold">{Math.random() > 0.5 ? '$' + (Math.random() * 5000).toFixed(2) : '-'}</div>
                            <div className="w-24 text-right text-gray-800 font-bold">$12,450.00</div>
                        </div>
                    ))}
                </div>

                {/* Scanning Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#1D6F42] shadow-[0_0_15px_#1D6F42] animate-scan-vertical"></div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 flex justify-between items-center text-xs text-gray-500 border-t border-gray-200">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Structural Analysis</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Gutter Detection</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Semantic Mapping</span>
                </div>
                <div className="font-bold text-[#1D6F42]">{Math.round(progress)}%</div>
            </div>
        </div>
    );
}
