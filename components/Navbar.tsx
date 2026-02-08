/**
 * SOFTBEES Navbar
 * Strict adherence to palette: Navy Blue #111F35 background
 */
'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full bg-white text-[#111F35] shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-[#111F35] font-bold text-xl hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-[#F63049] rounded-lg flex items-center justify-center text-white">
                            <span className="text-sm">SB</span>
                        </div>
                        <span>SOFT BEES</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-[#111F35] hover:text-[#F63049] font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="/tools/compress-pdf" className="text-[#111F35] hover:text-[#F63049] font-medium transition-colors">
                            Compress
                        </Link>
                        <Link href="/tools/merge" className="text-[#111F35] hover:text-[#F63049] font-medium transition-colors">
                            Merge
                        </Link>

                        <Link href="/tools/organize-pdf" className="text-[#111F35] hover:text-[#F63049] font-medium transition-colors">
                            Organize
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
