/**
 * SOFTBEES Navbar
 * Strict adherence to palette: Navy Blue #111F35 background
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full bg-white text-[#111F35] shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="relative h-12 w-48">
                            <Image
                                src="/logo.png"
                                alt="Soft Bees Logo"
                                width={192} // 48 * 4 = 192px width for 12 * 4 = 48px height (4:1 ratio)
                                height={48}
                                priority
                                className="object-contain" // Tailwind utility for object-fit: contain
                            />
                        </div>
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
