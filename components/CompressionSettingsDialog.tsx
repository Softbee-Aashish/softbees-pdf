/**
 * Compression Settings Dialog
 * Allows user to set target file size before compression
 */

'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CompressionSettingsDialogProps {
    isOpen: boolean;
    fileName: string;
    onClose: () => void;
    onConfirm: (targetSize: number, unit: 'KB' | 'MB') => void;
}

export default function CompressionSettingsDialog({
    isOpen,
    fileName,
    onClose,
    onConfirm,
}: CompressionSettingsDialogProps) {
    const [targetSize, setTargetSize] = useState('200');
    const [unit, setUnit] = useState<'KB' | 'MB'>('KB');

    useEffect(() => {
        if (isOpen) {
            setTargetSize('200');
            setUnit('KB');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        const size = parseInt(targetSize);
        if (isNaN(size) || size <= 0) {
            alert('Please enter a valid target size');
            return;
        }
        onConfirm(size, unit);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-dark">Compression Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* File Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Compressing:</p>
                    <p className="font-medium text-dark truncate">{fileName}</p>
                </div>

                {/* Target Size Input */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-dark mb-2">
                        Target File Size
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={targetSize}
                            onChange={(e) => setTargetSize(e.target.value)}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="e.g., 200"
                            min="1"
                        />
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value as 'KB' | 'MB')}
                            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                        >
                            <option value="KB">KB</option>
                            <option value="MB">MB</option>
                        </select>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        The tool will compress your PDF to approximately this size
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                    >
                        Start Compression
                    </button>
                </div>
            </div>
        </div>
    );
}
