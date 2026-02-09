import React from 'react';
import { Loader2, CheckCircle2, ScanLine } from 'lucide-react';

interface ScanningPreviewProps {
    isProcessing: boolean;
    status: string;
    progress: number; // 0 to 100
}

export default function ScanningPreview({ isProcessing, status, progress }: ScanningPreviewProps) {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Scanner Viewport */}
            <div className="relative w-full aspect-[16/9] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

                {/* Simulated Document Layer */}
                <div className="absolute inset-0 p-8 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')]">
                    {/* Placeholder Lines to look like a doc */}
                    <div className="h-4 bg-gray-300 w-3/4 mb-4 rounded"></div>
                    <div className="h-4 bg-gray-300 w-full mb-4 rounded"></div>
                    <div className="h-4 bg-gray-300 w-5/6 mb-4 rounded"></div>
                    <div className="h-32 bg-gray-200 w-full mb-4 rounded mt-8"></div>
                    <div className="h-4 bg-gray-300 w-1/2 mb-4 rounded"></div>
                </div>

                {/* The Scanning Red Line */}
                {isProcessing && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#F63049] shadow-[0_0_15px_#F63049] animate-[scan_3s_ease-in-out_infinite] z-10 opacity-80" />
                )}

                {/* Overlay Status */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-20">
                    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                        {isProcessing ? (
                            <div className="relative">
                                <ScanLine className="w-12 h-12 text-[#F63049] animate-pulse" />
                                <div className="absolute inset-0 border-t-2 border-[#F63049] rounded-full animate-spin opacity-50"></div>
                            </div>
                        ) : (
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        )}

                        <div className="text-center">
                            <h3 className="text-xl font-bold text-[#111F35] mb-1">
                                {status}
                            </h3>
                            <p className="text-gray-500 text-sm font-medium">
                                {Math.round(progress)}% Complete
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#F63049] transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps Checklist */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full px-4">
                {[
                    { label: "Analyze Structure", done: progress > 10 },
                    { label: "Map Coordinates", done: progress > 40 },
                    { label: "Identify Fonts", done: progress > 70 },
                    { label: "Build .docx", done: progress > 90 }
                ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        {step.done ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                        )}
                        <span className={`text-sm font-bold ${step.done ? 'text-[#111F35]' : 'text-gray-400'}`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
