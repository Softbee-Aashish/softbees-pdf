'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdComponent from '@/lib/ads/AdComponent';
import Link from 'next/link';
import { ArrowRight, Layers, Minimize2, Grid } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow w-full">
                {/* Full Width Hero Section */}
                <div className="bg-[#111F35] py-24 px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                        Essential PDF Tools
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                        Fast, Secure, Client-Side. Your files never leave your browser.
                    </p>
                </div>

                {/* Tools Grid Section */}
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Compress Card */}
                        <Link href="/tools/compress-pdf" className="group" aria-label="Go to Compress PDF tool">
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:border-[#F63049] border border-transparent transition-all duration-300 h-full flex flex-col items-start">
                                <div className="bg-[#FFF0F3] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Minimize2 className="w-8 h-8 text-[#F63049]" aria-hidden="true" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    Compress PDF
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Reduce file size while optimizing for maximal quality. Perfect for uploads and emails.
                                </p>
                                <div className="flex items-center text-[#F63049] font-bold mt-auto" aria-hidden="true">
                                    Start Compressing <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Merge Card */}
                        <Link href="/tools/merge" className="group" aria-label="Go to Merge PDF tool">
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:border-[#F63049] border border-transparent transition-all duration-300 h-full flex flex-col items-start">
                                <div className="bg-[#FFF0F3] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Layers className="w-8 h-8 text-[#F63049]" aria-hidden="true" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    Merge PDF
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Combine multiple PDFs into one unified document. Drag and drop to reorder pages.
                                </p>
                                <div className="flex items-center text-[#F63049] font-bold mt-auto" aria-hidden="true">
                                    Start Merging <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Organize Card */}
                        <Link href="/tools/organize-pdf" className="group" aria-label="Go to Organize PDF tool">
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:border-[#F63049] border border-transparent transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden">

                                <div className="bg-[#FFF0F3] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Grid className="w-8 h-8 text-[#F63049]" aria-hidden="true" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    Organize PDF
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Rearrange pages, rotate, delete, or merge multiple files into one organized document.
                                </p>
                                <div className="flex items-center text-[#F63049] font-bold mt-auto" aria-hidden="true">
                                    Start Organizing <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Image to PDF Card */}
                        <Link href="/tools/jpg-to-pdf" className="group" aria-label="Go to Image to PDF tool">
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:border-[#F63049] border border-transparent transition-all duration-300 h-full flex flex-col items-start">
                                <div className="bg-[#FFF0F3] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-[#F63049]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    Image to PDF
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Convert JPG, PNG, and WebP images to PDF. Exact resolution, no stretching.
                                </p>
                                <div className="flex items-center text-[#F63049] font-bold mt-auto" aria-hidden="true">
                                    Convert Images <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* PDF to JPG Card */}
                        <Link href="/tools/pdf-to-jpg" className="group" aria-label="Go to PDF to JPG tool">
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:border-[#F63049] border border-transparent transition-all duration-300 h-full flex flex-col items-start">
                                <div className="bg-[#FFF0F3] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-[#F63049]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <path d="m9 15 2 2 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    PDF to JPG
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Extract high-quality images from PDF pages. Download as ZIP.
                                </p>
                                <div className="flex items-center text-[#F63049] font-bold mt-auto" aria-hidden="true">
                                    Convert PDF <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Edit PDF Card */}


                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
