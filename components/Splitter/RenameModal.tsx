import React, { useState } from 'react';
import { Download, X } from 'lucide-react';

interface RenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDownload: (baseName: string) => void;
    rangeCount: number;
}

export default function RenameModal({ isOpen, onClose, onDownload, rangeCount }: RenameModalProps) {
    const [baseName, setBaseName] = useState('softbees_split');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#111F35] transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <h3 className="text-2xl font-bold text-[#111F35] mb-2">
                    {rangeCount > 1 ? 'Download ZIP Archive' : 'Download Split PDF'}
                </h3>

                <p className="text-gray-500 mb-6 text-sm">
                    {rangeCount > 1
                        ? 'Multiple ranges detected. Your files will be zipped together.'
                        : 'Your custom range is ready for download.'}
                </p>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {rangeCount > 1 ? 'Archive Name' : 'File Name'}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={baseName}
                            onChange={(e) => setBaseName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F63049] outline-none font-medium pr-32"
                            placeholder="Enter filename..."
                            autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none select-none">
                            {rangeCount > 1 ? '_softbees.zip' : '_softbees.pdf'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        onDownload(baseName || 'softbees_split');
                        onClose();
                    }}
                    className="w-full py-3 bg-[#F63049] text-white font-bold rounded-xl hover:bg-[#D02752] transition-transform hover:scale-[1.02] shadow-lg shadow-[#F63049]/20 flex items-center justify-center gap-2"
                >
                    <Download className="w-5 h-5" />
                    {rangeCount > 1 ? 'Download ZIP' : 'Download PDF'}
                </button>
            </div>
        </div>
    );
}
