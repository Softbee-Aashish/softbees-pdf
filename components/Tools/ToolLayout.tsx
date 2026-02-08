'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ToolLayoutProps {
    children: React.ReactNode;
}

export default function ToolLayout({ children }: ToolLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Full Width Navbar */}
            <Navbar />

            {/* Main Content Area - Center Focused, No Sidebars */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-start">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#F63049]">
                    {children}
                </div>
            </main>

            {/* Full Width Footer */}
            <Footer />
        </div>
    );
}
