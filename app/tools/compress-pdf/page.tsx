/**
 * Main Page - Central Card Layout
 * Single-focused compression interface
 */

'use client';

import Navbar from '@/components/Navbar';
import CompressionCard from '@/components/CompressionCard';
import AdComponent from '@/lib/ads/AdComponent';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111F35] mb-4">
              PDF Compressor
            </h1>
            <p className="text-lg text-[#111F35]/60 font-medium">
              Fast, secure, and free. Compress PDFs to your exact target size.
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <AdComponent position="inline" />
          </div>

          <CompressionCard />
        </div>
      </main>
    </div>
  );
}
