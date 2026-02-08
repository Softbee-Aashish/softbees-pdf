import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ - Soft Bees PDF Pro',
    description: 'Common questions about PDF compression, merging, and security.',
};

export default function FAQPage() {
    return (
        <>
            <h1 className="text-3xl font-extrabold mb-6 text-[#111F35]">Frequently Asked Questions</h1>
            <p className="text-gray-600 mb-8">
                Everything you need to know about how Soft Bees works under the hood.
            </p>

            <div className="space-y-8">
                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-xl font-bold text-[#111F35] mb-3">Q: Is it really free? Where's the catch?</h3>
                    <p className="text-gray-600">
                        A: Yes, it is 100% free. There is no catch. Because we don't have expensive servers to maintain (since your computer does the work), our costs are very low. We simply use a few ads to keep the lights on.
                    </p>
                </div>

                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-xl font-bold text-[#111F35] mb-3">Q: Will my files lose quality when compressing?</h3>
                    <p className="text-gray-600">
                        A: Think of it like packing a suitcase. We don't throw away your clothes (data); we just fold them better. However, if you choose extreme compression (like 50KB for a 10MB file), we might have to lower the resolution of images, similar to using a slightly smaller suitcase.
                    </p>
                </div>

                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-xl font-bold text-[#111F35] mb-3">Q: Why does my browser get slow with large files?</h3>
                    <p className="text-gray-600">
                        A: Since Soft Bees runs inside your browser, it shares memory with your other tabs. If you try to merge 500 files while watching a 4K video in another tab, your browser might get "tired". Closing other tabs usually fixes this!
                    </p>
                </div>

                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-xl font-bold text-[#111F35] mb-3">Q: Can I use Soft Bees offline?</h3>
                    <p className="text-gray-600">
                        A: Absolutely! Once the website is loaded, you can disconnect your Wi-Fi and the tools will work perfectly. This is the ultimate proof that we don't steal your data.
                    </p>
                </div>
            </div>
        </>
    );
}
