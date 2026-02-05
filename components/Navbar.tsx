/**
 * SOFTBEES Navbar
 * Strict adherence to palette: Navy Blue #111F35 background
 */
'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full bg-[#111F35] text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                            <FileText className="w-8 h-8 text-[#F63049]" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            SOFT BEES
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-gray-300 hover:text-[#F63049] font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="#" className="text-gray-300 hover:text-[#F63049] font-medium transition-colors">
                            Tools
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
