'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdComponent from '@/lib/ads/AdComponent';
import Link from 'next/link';
import { ArrowRight, Layers, Minimize2 } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-[#111F35] mb-6">
                            Essential PDF Tools
                        </h1>
                        <p className="text-xl text-[#111F35]/70 max-w-2xl mx-auto">
                            Fast, secure, and 100% client-side. Your files never leave your browser.
                            No limits, no watermarks.
                        </p>
                    </div>

                    {/* Ad Slot */}
                    <div className="mb-12 flex justify-center">
                        <AdComponent position="top" />
                        {/* Using top ad config for main banner position */}
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

                        {/* Compress Card */}
                        <Link href="/tools/compress-pdf" className="group">
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#F63049]/10 h-full flex flex-col items-start translate-y-0 hover:-translate-y-1">
                                <div className="bg-[#FFF0F3] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Minimize2 className="w-8 h-8 text-[#F63049]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    Compress PDF
                                </h3>
                                <p className="text-[#111F35]/60 mb-6 flex-grow">
                                    Reduce file size while optimizing for maximal quality.
                                    Perfect for uploads and emails.
                                </p>
                                <div className="flex items-center text-[#F63049] font-bold">
                                    Start Compressing <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Merge Card */}
                        <Link href="/tools/merge" className="group">
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#F63049]/10 h-full flex flex-col items-start translate-y-0 hover:-translate-y-1">
                                <div className="bg-[#FFF0F3] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Layers className="w-8 h-8 text-[#F63049]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    Merge PDF
                                </h3>
                                <p className="text-[#111F35]/60 mb-6 flex-grow">
                                    Combine multiple PDFs into one unified document.
                                    Drag and drop to reorder pages.
                                </p>
                                <div className="flex items-center text-[#F63049] font-bold">
                                    Start Merging <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Placeholder for future tools */}
                        <div className="bg-gray-100 rounded-2xl p-8 border border-dashed border-gray-200 h-full flex flex-col items-center justify-center text-center opacity-60">
                            <p className="text-[#111F35]/40 font-bold mb-2">More Tools Coming Soon</p>
                            <p className="text-xs text-[#111F35]/30">Check back later!</p>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
