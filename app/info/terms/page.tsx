import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - Soft Bees PDF Pro',
    description: 'Usage terms and conditions for Soft Bees PDF tools.',
};

export default function TermsPage() {
    return (
        <>
            <h1 className="text-3xl font-extrabold mb-6 text-[#111F35]">Terms of Service</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">1. Acceptance of Terms</h2>
                <p className="mb-4">
                    By accessing and using Soft Bees PDF Pro, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">2. Service "As Is"</h2>
                <p className="mb-4">
                    Soft Bees provides its tools on an "as is" and "as available" basis. While we strive for perfection, we do not guarantee that the service will be uninterrupted, timely, or error-free.
                </p>
                <p className="mb-4">
                    Since processing happens on your device, performance depends on your hardware capabilities. We are not liable for any data loss caused by browser crashes or hardware limitations.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">3. User Conduct</h2>
                <p className="mb-4">
                    You agree not to use the service to process illegal content. Since we do not see your files, the responsibility for the content you process lies solely with you.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">4. Intellectual Property</h2>
                <p className="mb-4">
                    The interface, design, and code of Soft Bees are the intellectual property of Soft Bees. However, the documents you process remain 100% yours. We claim no ownership over your files.
                </p>
            </section>
        </>
    );
}
