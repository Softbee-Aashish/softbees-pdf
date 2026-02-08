import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function InfoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-[#111F35]">
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-slate max-w-none">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
