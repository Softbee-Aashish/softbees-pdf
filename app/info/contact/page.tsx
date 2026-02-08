'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = `Contact Request from ${formData.name}`;
        const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
        window.location.href = `mailto:softbee@outlook.in?subject=${encodeURIComponent(subject)}&body=${body}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    return (
        <>
            <h1 className="text-3xl font-extrabold mb-6 text-[#111F35]">Contact Us</h1>
            <p className="text-gray-600 mb-8">
                Have a feature request, found a bug, or just want to say hi? We'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-[#111F35] mb-2">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F63049] focus:border-transparent outline-none transition-all"
                        placeholder="Your Name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-[#111F35] mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F63049] focus:border-transparent outline-none transition-all"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-bold text-[#111F35] mb-2">Message</label>
                    <textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F63049] focus:border-transparent outline-none transition-all"
                        placeholder="How can we help?"
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#111F35] text-white font-bold py-4 rounded-xl hover:bg-black transition-colors shadow-lg"
                >
                    Send Message
                </button>
            </form>
        </>
    );
}
