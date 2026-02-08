import * as pdfjsLib from 'pdfjs-dist';

// Singleton to ensure worker is configured only once and correctly
let isConfigured = false;

export function configureWorker() {
    if (typeof window !== 'undefined' && !isConfigured) {
        // Set the worker source to the local file in public directory
        // We provide both .mjs and .js in public to be safe, but pointing to .min.js
        // matches the common default expectation if config fails.
        // However, we want to force it.
        // Let's try pointing to the one we just created.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        isConfigured = true;
        console.log('✅ PDF Worker configured globally to /pdf.worker.min.js');
    }
}
