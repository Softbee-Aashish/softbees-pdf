'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

                        {/* Split PDF Card */}
                        <Link href="/tools/split-pdf" className="group" aria-label="Go to Split PDF tool">
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:border-[#F63049] border border-transparent transition-all duration-300 h-full flex flex-col items-start">
                                <div className="bg-[#FFF0F3] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg
                                        className="w-8 h-8 text-[#F63049]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <circle cx="6" cy="6" r="3" />
                                        <path d="M8.12 8.12 12 12" />
                                        <path d="M20 4 8.12 15.88" />
                                        <circle cx="6" cy="18" r="3" />
                                        <path d="M14.8 14.8 20 20" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    Split PDF
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Extract specific pages or ranges. Save as individual files or ZIP archive.
                                </p>
                                <div className="flex items-center text-[#F63049] font-bold mt-auto" aria-hidden="true">
                                    Start Splitting <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* PDF to Word Card */}
                        <Link href="/tools/pdf-to-word" className="group" aria-label="Go to PDF to Word tool">
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:border-[#111F35] border border-transparent transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden">
                                <div className="bg-[#E1F0FF] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg
                                        className="w-8 h-8 text-[#111F35]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <path d="M8 13h8" />
                                        <path d="M8 17h8" />
                                        <path d="M10 9h4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    PDF to Word
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Convert PDF to editable Word (.docx). Reconstructs tables and layout structurally.
                                </p>
                                <div className="flex items-center text-[#111F35] font-bold mt-auto group-hover:text-[#F63049] transition-colors" aria-hidden="true">
                                    Convert to Doc <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Word to PDF Card */}
                        <Link href="/tools/word-to-pdf" className="group" aria-label="Go to Word to PDF tool">
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:border-[#F63049] border border-transparent transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden">
                                <div className="bg-[#FFF0F3] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg
                                        className="w-8 h-8 text-[#F63049]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <path d="M12 18v-6" />
                                        <path d="M8 15l4-4 4 4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    Word to PDF
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Convert DOCX to Vector PDF. Preserves layouts, tables, and fonts structurally.
                                </p>
                                <div className="flex items-center text-[#111F35] font-bold mt-auto group-hover:text-[#F63049] transition-colors" aria-hidden="true">
                                    Convert to PDF <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>


                        {/* PDF to Excel Card */}
                        <Link href="/tools/pdf-to-excel" className="group" aria-label="Go to PDF to Excel tool">
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:border-[#F63049] border border-transparent transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden">
                                <div className="bg-[#E6F4EA] p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg
                                        className="w-8 h-8 text-[#1D6F42]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="8" y1="13" x2="16" y2="13" />
                                        <line x1="8" y1="17" x2="16" y2="17" />
                                        <line x1="10" y1="9" x2="10" y2="9" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#111F35] mb-3 group-hover:text-[#F63049] transition-colors">
                                    PDF to Excel
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Convert Bank Statements to Formula-Ready XLSX. Semantic & Spatial Mapping.
                                </p>
                                <div className="flex items-center text-[#111F35] font-bold mt-auto group-hover:text-[#F63049] transition-colors" aria-hidden="true">
                                    Extract Data <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Edit PDF Card */}


                    </div>
                </div >
            </main >

            <Footer />
        </div >
    );
}
