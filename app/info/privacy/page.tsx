import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - Soft Bees PDF Pro',
    description: 'Our commitment to your privacy. Learn how Soft Bees processes data entirely on your device.',
};

export default function PrivacyPage() {
    return (
        <>
            <h1 className="text-3xl font-extrabold mb-6 text-[#111F35]">Privacy Policy</h1>
            <p className="lead text-xl text-gray-600 mb-8">
                At Soft Bees, we believe your data belongs to you. That's why we built a "Serverless" PDF suite.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">1. No Server Storage</h2>
                <p className="mb-4">
                    Unlike other PDF tools, Soft Bees does <strong>NOT</strong> upload your files to any cloud server for processing.
                    All file manipulations (compression, merging, conversion) happen locally on your device using WebAssembly and HTML5 technologies.
                </p>
                <p>
                    Once you close the browser tab, your files are instantly cleared from your browser's memory. We have no copy of them.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">2. Data Collection</h2>
                <p className="mb-4">
                    We do not collect personal usage data, document contents, or file metadata.
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Files:</strong> Processed 100% Client-Side.</li>
                    <li><strong>Personal Info:</strong> No sign-up required, so we don't have your email.</li>
                    <li><strong>Cookies:</strong> We use minimal local storage to remember your preferences (like "Dark Mode" or last used tool).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">3. Advertising & Third Parties</h2>
                <p className="mb-4">
                    To keep this tool free, we display advertisements provided by Google AdSense and other partners.
                    These vendors may use cookies to serve ads based on your prior visits to this website or other websites.
                </p>
                <p>
                    You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="nofollow" className="text-[#F63049] underline">Google Ad Settings</a>.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">4. Contact Us</h2>
                <p>
                    If you have questions about this policy, please reach out via our <a href="/info/contact" className="text-[#F63049] underline">Contact Page</a>.
                </p>
            </section>

            <p className="text-sm text-gray-400 mt-12">Last Updated: February 2026</p>
        </>
    );
}
