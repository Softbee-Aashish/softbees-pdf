import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-100 bg-white py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    {/* Simple Bee Icon */}
                    <div className="w-8 h-8 bg-[#F63049] rounded-lg flex items-center justify-center text-white font-bold">
                        SB
                    </div>
                    <span className="text-[#111F35] font-bold text-xl">SOFT BEES</span>
                </div>

                <p className="text-[#111F35]/60 text-sm mb-6">
                    Fast, secure, and client-side PDF tools. Your files never leave your browser.
                </p>

                <div className="inline-block px-6 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[#111F35] font-medium text-sm">
                        Have questions? Contact us at:
                        <a href="mailto:softbee@outlook.in" className="block text-[#F63049] font-bold mt-1 hover:underline">
                            softbee@outlook.in
                        </a>
                    </p>
                </div>

                <p className="text-gray-400 text-xs mt-8">
                    © {new Date().getFullYear()} Soft Bees. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
