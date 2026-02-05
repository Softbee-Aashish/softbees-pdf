export interface AdConfig {
    position: 'top' | 'bottom' | 'sidebar-left' | 'sidebar-right' | 'inline';
    enabled: boolean;
    adCode: string; // You'll paste AdSense code here
    size: { width: string; height: string };
}

// User provided Ad Code (Name: PDF_Tool_Ad, Slot: 3780389219) - For Sidebars/Inline
const SIDEBAR_INLINE_AD_CODE = `<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2044774047242628"
     data-ad-slot="3780389219"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

// User provided Ad Code (Name: pdf_tool_top & bottom, Slot: 2275735852)
const TOP_BOTTOM_AD_CODE = `<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="autorelaxed"
     data-ad-client="ca-pub-2044774047242628"
     data-ad-slot="2275735852"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

export const adsConfig: AdConfig[] = [
    {
        position: 'top',
        enabled: true,
        adCode: TOP_BOTTOM_AD_CODE,
        size: { width: '728px', height: '90px' }
    },
    {
        position: 'sidebar-left',
        enabled: true,
        adCode: SIDEBAR_INLINE_AD_CODE,
        size: { width: '160px', height: '600px' }
    },
    {
        position: 'sidebar-right',
        enabled: true,
        adCode: SIDEBAR_INLINE_AD_CODE,
        size: { width: '160px', height: '600px' }
    },
    {
        position: 'bottom',
        enabled: true,
        adCode: TOP_BOTTOM_AD_CODE,
        size: { width: '728px', height: '90px' }
    },
    {
        position: 'inline',
        enabled: true,
        adCode: SIDEBAR_INLINE_AD_CODE,
        size: { width: '300px', height: '250px' }
    }
];

// Helper function to update ad codes
export function updateAdCode(position: string, newCode: string): void {
    const adIndex = adsConfig.findIndex(ad => ad.position === position);
    if (adIndex !== -1) {
        adsConfig[adIndex].adCode = newCode;
        // Save to localStorage for persistence
        if (typeof window !== 'undefined') {
            localStorage.setItem('adsConfig', JSON.stringify(adsConfig));
        }
    }
}

// Load saved config from localStorage
export function loadSavedConfig(): void {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('adsConfig');
        if (saved) {
            const parsed = JSON.parse(saved);
            parsed.forEach((savedAd: AdConfig, index: number) => {
                // Only update if prompt structure matches
                if (adsConfig[index] && adsConfig[index].position === savedAd.position) {
                    adsConfig[index].adCode = savedAd.adCode;
                    adsConfig[index].enabled = savedAd.enabled;
                }
            });
        }
    }
}
