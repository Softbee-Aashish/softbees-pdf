import { useEffect } from 'react';
import { MemoryJanitor } from '@/utils/memory-janitor';

/**
 * useMemorySafety Hook
 * Automatically flushes registered Object URLs when the component unmounts.
 * Best used in Page components or heavy isolated widgets.
 */
export function useMemorySafety() {
    useEffect(() => {
        // Mount logic (optional logging)
        // console.log('[MemorySafe] Component mounted.');

        return () => {
            // Unmount logic: Flush everything tracked by the Janitor
            MemoryJanitor.flushAll();
            // console.log('[MemorySafe] Component unmounted. Memory flushed.');
        };
    }, []);

    return {
        registerUrl: (url: string) => MemoryJanitor.registerUrl(url),
        revokeUrl: (url: string) => MemoryJanitor.revokeUrl(url),
    };
}
