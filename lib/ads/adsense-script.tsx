'use client';

import { useEffect } from 'react';

export default function AdSenseScript() {
    useEffect(() => {
        // Add AdSense script to page
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2044774047242628';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        }
    }, []);

    return null; // This component doesn't render anything
}
