'use client';

import { useEffect, useState } from 'react';
import { AdConfig, adsConfig } from './config';

interface AdComponentProps {
    position: AdConfig['position'];
    className?: string;
}

export default function AdComponent({ position, className = '' }: AdComponentProps) {
    const [adCode, setAdCode] = useState<string>('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        let configToUse: AdConfig[] = [];

        // 1. Try to get overrides from localStorage
        const savedConfig = localStorage.getItem('adsConfig');
        if (savedConfig) {
            configToUse = JSON.parse(savedConfig);
        }

        // 2. Find the ad for this position from localStorage
        let ad = configToUse.find(a => a.position === position);

        // 3. Fallback: If not in local storage, use the hardcoded default from config.ts
        if (!ad) {
            ad = adsConfig.find(a => a.position === position);
        }

        if (ad && ad.adCode && ad.enabled) {
            setAdCode(ad.adCode);
        }
    }, [position]);

    if (!isClient) return null;

    if (!adCode) {
        // Show placeholder while loading or if no ad configured
        return (
            <div className={`bg-gray-100 border border-gray-300 rounded flex items-center justify-center ${className}`} style={{ minHeight: '90px' }}>
                <span className="text-gray-500 text-sm font-mono">Ad Space: {position}</span>
            </div>
        );
    }

    // Safely render AdSense code
    return (
        <div
            className={`ad-container ${className}`}
            dangerouslySetInnerHTML={{ __html: adCode }}
        />
    );
}
