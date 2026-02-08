import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdSenseScript from '@/lib/ads/adsense-script';
import AdComponent from '@/lib/ads/AdComponent';

import { constructMetadata } from '@/utils/metadata-map';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = constructMetadata('home');

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* Main Content Wrapper - 100% Width, Flex Column */}
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
