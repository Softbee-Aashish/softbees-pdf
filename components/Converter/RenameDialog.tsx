import { useState } from 'react';
import { X, Download, FileText } from 'lucide-react';

interface RenameDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onDownload: (name: string) => void;
    title?: string;
    defaultName?: string;
}

export default function RenameDialog({
    isOpen,
    onClose,
    onDownload,
    title = 'Save your file',
    defaultName = 'document'
}: RenameDialogProps) {
    const [fileName, setFileName] = useState(defaultName);

    if (!isOpen) return null;

    const handleDownload = () => {
        if (!fileName.trim()) return;
        onDownload(fileName);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-[#111F35] px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#F63049]" />
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter File Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F63049] focus:ring-4 focus:ring-[#F63049]/10 outline-none transition-all text-lg font-medium text-[#111F35]"
                            placeholder="e.g. vacation-photos"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">
                            _softbees
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 ml-1">
                        We'll add _softbees suffix automatically.
                    </p>

                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex-1 px-4 py-3 bg-[#F63049] text-white font-bold rounded-xl hover:bg-[#D02752] transition-colors shadow-lg hover:shadow-xl shadow-[#F63049]/20 flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
