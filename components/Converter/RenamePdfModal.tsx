import React, { useState } from 'react';
import { Download, X, FileCheck } from 'lucide-react';

interface RenamePdfModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDownload: (baseName: string) => void;
}

export default function RenamePdfModal({ isOpen, onClose, onDownload }: RenamePdfModalProps) {
    const [baseName, setBaseName] = useState('softbees_document');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111F35]/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200 border-t-4 border-[#F63049]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#111F35] transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="w-12 h-12 bg-[#FFF0F3] rounded-full flex items-center justify-center mb-4 text-[#F63049]">
                    <FileCheck className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-bold text-[#111F35] mb-2">
                    PDF Ready!
                </h3>

                <p className="text-gray-500 mb-6 text-sm">
                    Your Word document has been converted to a high-fidelity PDF with structural mapping preserved.
                </p>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        PDF Filename
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={baseName}
                            onChange={(e) => setBaseName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F63049] outline-none font-medium pr-40 text-[#111F35]"
                            placeholder="Enter filename..."
                            autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none select-none bg-gray-50 px-2 py-1 rounded">
                            _softbees.pdf
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        onDownload(baseName || 'softbees_document');
                        onClose();
                    }}
                    className="w-full py-4 bg-[#F63049] text-white font-bold rounded-xl hover:bg-[#D02752] transition-transform hover:scale-[1.02] shadow-lg shadow-[#F63049]/20 flex items-center justify-center gap-2"
                >
                    <Download className="w-5 h-5" />
                    Download PDF
                </button>
            </div>
        </div>
    );
}
