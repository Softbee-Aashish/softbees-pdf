'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Upload, FileText, CheckCircle, Loader2, Download, AlertCircle, X } from 'lucide-react';
import { formatBytes } from '@/utils/formatters';
import { downloadFile } from '@/utils/file-helpers';
// Metadata moved to page.tsx

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'compressing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  // Results
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [downloadName, setDownloadName] = useState('');

  // Inputs
  const [targetSize, setTargetSize] = useState<string>('');
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('MB');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. File Handling
  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setDownloadName(selectedFile.name.replace(/\.pdf$/i, ''));
    setStatus('idle');
    setCompressedBlob(null);
    setProgress(0);
    setTargetSize('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // 2. Compression Logic
  const handleCompress = async () => {
    if (!file || !targetSize) return;

    setStatus('compressing');
    setProgress(0);
    setStatusMessage("Starting compression...");

    try {
      // Dynamic import
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

      const blob = new Blob([result.data as any], { type: 'application/pdf' });
      setCompressedBlob(blob);
      setCompressedSize(result.finalSize);
      setStatus('success');
      setProgress(100);

    } catch (error: any) {
      console.error("Compression failed:", error);
      setStatus('error');
      setStatusMessage(error.message || "Compression failed.");
    }
  };

  // 3. Download Logic
  const handleDownload = () => {
    if (!compressedBlob) return;
    const cleanName = downloadName.replace(/[^\w\s-]/g, '');
    downloadFile(compressedBlob, `${cleanName}_softbees.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setCompressedBlob(null);
    setStatus('idle');
    setTargetSize('');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-[#111F35]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">PDF Compressor</h1>
          <p className="text-[#111F35]/60">Fast, secure, and free. Compress PDFs to your exact target size.</p>
        </div>

        {/* State 1: Upload (Empty) */}
        {!file && (
          <div
            className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer outline-none focus:ring-4 focus:ring-[#F63049]/20 ${isDragging ? 'border-[#F63049] bg-[#FFF0F3]' : 'border-[#8A244B]/30 hover:border-[#F63049] bg-white'
              }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload PDF file"
          >
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="w-20 h-20 bg-[#FFF0F3] rounded-full flex items-center justify-center mx-auto mb-6 text-[#F63049]">
              <Upload className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Drop PDF here to Compress</h3>
            <span className="inline-block px-6 py-3 bg-[#F63049] text-white font-bold rounded-xl mt-4 hover:bg-[#D02752] transition-colors shadow-lg shadow-[#F63049]/20">
              Select PDF File
            </span>
          </div>
        )}

        {/* State 2: Configuration & Processing */}
        {file && status !== 'success' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FFF0F3] rounded-xl flex items-center justify-center text-[#F63049]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111F35] truncate max-w-[200px]">{file.name}</h3>
                  <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button onClick={handleReset} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{statusMessage}</span>
              </div>
            )}

            {status === 'compressing' ? (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-[#F63049] animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#111F35] mb-2">Compressing...</h3>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="h-full bg-[#F63049] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-500 text-sm">{statusMessage}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#111F35] mb-2 uppercase tracking-wide">
                    Target Size
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={targetSize}
                      onChange={(e) => setTargetSize(e.target.value)}
                      placeholder="e.g. 2"
                      className="flex-1 px-4 py-3 text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-[#F63049] outline-none transition-colors"
                      autoFocus
                    />
                    <select
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value as 'KB' | 'MB')}
                      className="px-4 py-3 text-lg font-bold border-2 border-gray-200 rounded-xl bg-gray-50 cursor-pointer outline-none focus:border-[#F63049]"
                    >
                      <option value="MB">MB</option>
                      <option value="KB">KB</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the desired file size. We'll try our best to reach it.
                  </p>
                </div>

                <button
                  onClick={handleCompress}
                  disabled={!targetSize}
                  className="w-full py-4 bg-[#F63049] text-white text-xl font-bold rounded-xl hover:bg-[#D02752] transition-transform hover:scale-[1.01] shadow-xl shadow-[#F63049]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Compress PDF
                </button>
              </div>
            )}
          </div>
        )}

        {/* State 3: Success */}
        {status === 'success' && file && compressedBlob && (
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-[#111F35] mb-2">Success!</h2>
            <div className="flex items-center justify-center gap-2 mb-8 text-lg">
              <span className="text-gray-400 line-through">{formatBytes(file.size)}</span>
              <span className="text-gray-300">→</span>
              <span className="text-[#F63049] font-bold">{formatBytes(compressedSize)}</span>
              <span className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded-full ml-2">
                -{((1 - compressedSize / file.size) * 100).toFixed(0)}%
              </span>
            </div>

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
              onClick={handleReset}
              className="text-gray-400 hover:text-[#F63049] text-sm font-medium transition-colors"
            >
              Compress another file
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
