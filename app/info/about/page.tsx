import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - Soft Bees PDF Pro',
    description: 'The story behind Soft Bees: Bringing professional, private PDF tools to everyone for free.',
};

export default function AboutPage() {
    return (
        <>
            <h1 className="text-3xl font-extrabold mb-6 text-[#111F35]">About Soft Bees</h1>

            <p className="lead text-xl text-gray-600 mb-8 italic">
                "Why should you have to upload your private bank statement to a server just to compress it?"
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">Our Mission</h2>
                <p className="mb-4">
                    Soft Bees was born from a frustration with modern web tools. We noticed two things:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Most "free" tools force you to upload your sensitive data to their servers.</li>
                    <li>They impose arbitrary limits (e.g., "Max 50MB") to save their own server costs.</li>
                </ol>
                <p>
                    We decided to build something different. By leveraging cutting-edge <strong>WebAssembly</strong> and <strong>Modern Browser APIs</strong>, we brought the power of desktop software directly to your browser tab.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#F63049]">The Technology</h2>
                <p className="mb-4">
                    Soft Bees runs entirely on your device. When you "upload" a file, it never leaves your computer. It moves from your hard drive to your browser's memory. This architecture allows us to offer:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Zero Privacy Risk:</strong> No server hacking can leak your files because we don't have them.</li>
                    <li><strong>Unlimited Size:</strong> If your computer has the RAM, we can process it.</li>
                    <li><strong>Blazing Speed:</strong> No upload/download waiting times.</li>
                </ul>
            </section>
        </>
    );
}
