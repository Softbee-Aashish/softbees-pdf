import type { Metadata } from "next";
import Script from "next/script";
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
        <Script
          src="https://quge5.com/88/tag.min.js"
          data-zone="209500"
          data-cfasync="false"
          async // Using boolean attribute correctly
          strategy="afterInteractive"
        />

        {/* Monetag Onclick Script - Zone 10586300 */}
        <Script id="monetag-onclick" strategy="afterInteractive">
          {`
            (function(s){s.dataset.zone='10586300',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
          `}
        </Script>

        {/* Main Content Wrapper - 100% Width, Flex Column */}
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
