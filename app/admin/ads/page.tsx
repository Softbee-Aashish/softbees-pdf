'use client';

import { useState, useEffect } from 'react';
import { adsConfig, updateAdCode, loadSavedConfig } from '@/lib/ads/config';

export default function AdsAdminPage() {
    // Force client-side hydration for config
    const [configs, setConfigs] = useState(adsConfig);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadSavedConfig();
        setConfigs([...adsConfig]); // Create a new array to trigger re-render
    }, []);

    const handleCodeChange = (position: string, code: string) => {
        updateAdCode(position, code);
        // updateAdCode modifies the exported array in place, so we trigger re-render
        setConfigs([...adsConfig]);
        setSaved(false);
    };

    const saveAll = () => {
        localStorage.setItem('adsConfig', JSON.stringify(adsConfig));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#111F35]">AdSense Manager</h1>
                <a href="/" className="px-4 py-2 bg-[#111F35] text-white rounded-lg hover:bg-black transition">Back to Tool</a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
                <p className="text-gray-600 mb-4">
                    <strong>Instructions:</strong> Paste your Google AdSense code snippets below for each position.
                    The system will automatically inject them into the corresponding slots on the main page.
                </p>
            </div>

            {configs.map((ad, index) => (
                <div key={ad.position} className="mb-6 p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold capitalize text-[#111F35]">
                                {ad.position.replace('-', ' ')} Ad
                            </h3>
                            <span className="text-sm text-gray-500 font-mono">
                                Recommended Size: {ad.size.width} × {ad.size.height}
                            </span>
                        </div>

                        <label className="flex items-center cursor-pointer">
                            <span className="mr-2 text-sm font-bold text-gray-700">{ad.enabled ? 'Enabled' : 'Disabled'}</span>
                            <input
                                type="checkbox"
                                checked={ad.enabled}
                                onChange={(e) => {
                                    adsConfig[index].enabled = e.target.checked;
                                    setConfigs([...adsConfig]);
                                }}
                                className="w-5 h-5 text-[#F63049] rounded focus:ring-[#F63049]"
                            />
                        </label>
                    </div>

                    <textarea
                        value={ad.adCode}
                        onChange={(e) => handleCodeChange(ad.position, e.target.value)}
                        placeholder={`Paste <script>...</script> code for ${ad.position} ad here...`}
                        className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-xs bg-gray-50 focus:bg-white focus:border-[#F63049] outline-none transition-colors resize-y"
                        spellCheck={false}
                    />

                    <div className="mt-2 text-xs text-gray-400 text-right">
                        {ad.adCode.length} chars
                    </div>
                </div>
            ))}

            <div className="sticky bottom-6 mt-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="text-sm text-gray-500">
                    Changes are saved to your browser's Local Storage.
                </div>

                <div className="flex items-center gap-4">
                    {saved && (
                        <span className="text-green-600 font-bold animate-pulse">✓ Saved successfully!</span>
                    )}
                    <button
                        onClick={saveAll}
                        className="px-8 py-3 bg-[#F63049] text-white font-bold rounded-xl hover:bg-[#D02752] transition-transform hover:scale-105 shadow-md"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
