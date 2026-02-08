export const contentManifest = {
    home: {
        title: "Soft Bees: The Fastest, Private, Client-Side PDF Suite",
        description: "Soft Bees PDF Pro is a free, secure, and private PDF tool suite that runs entirely in your browser. No server uploads, no data leaks, just pure performance using your device's power.",
        keywords: ["Free PDF Editor No Signup", "Best PDF Compressor 100MB to 10MB", "Private PDF Tools", "Browser-based PDF Editor", "Client-side PDF Tools"],
        hero: {
            heading: "Your Files Never Leave Your Device",
            subheading: "Process PDFs with the speed of your own processor. 100% Private. 100% Free.",
        },
        sections: [
            {
                heading: "Why 'No Server' Matters",
                content: "In an age of data breaches, Soft Bees takes a radical approach: we don't want your data. By processing files locally using WebAssembly and modern browser APIs, we ensure that your sensitive documents—contracts, financial reports, personal IDs—never touch a cloud server. It's not just safer; it's faster because there's no upload or download time."
            }
        ]
    },
    tools: {
        "compress-pdf": {
            name: "PDF Compressor",
            h1: "Aggressive PDF Compressor - Shrink to Any Size",
            metaDescription: "Reduce PDF size by up to 90% without quality loss. Client-side compression means no upload limits. Compress 100MB to 10MB instantly.",
            keywords: ["Compress PDF to 200KB", "Reduce PDF size without losing quality", "PDF size reducer 90%", "Offline PDF Compressor"],
            description: "Our intelligent compression engine analyzes your PDF structure, removing redundant metadata and optimizing images to reach your target file size. Whether you need a 200KB file for an email attachment or a 2MB file for a portal upload, Soft Bees delivers exact results using your local hardware.",
            qa: [
                {
                    q: "How do I reach a specific size like 200KB?",
                    a: "Simply enter '0.2' in the target size box (selecting MB) or '200' (selecting KB). Our engine iteratively adjusts image quality and structural overhead to get as close to your target as mathematically possible."
                },
                {
                    q: "Why use Soft Bees over online compressors?",
                    a: "Most online tools have a 50MB or 100MB limit because server storage costs money. Soft Bees has NO limits because we use your computer's RAM. You can compress a 1GB blueprint if your device can handle it!"
                }
            ]
        },
        "merge-pdf": {
            name: "Merge PDF",
            h1: "Combine Multiple PDFs - Drag, Drop, Done",
            metaDescription: "Merge unlimited PDF files into one document. Reorder pages, remove duplicates, and save instantly. 100% Client-side privacy.",
            keywords: ["Merge PDF files free", "Combine PDF documents", "PDF joiner no upload", "Binder PDF online"],
            description: "Organize your scattered documents into a single, professional file. Our Merger tool allows you to treat separate PDF files like a deck of cards—shuffle them, remove the ones you don't need, and stack them into one neat package.",
            qa: [
                {
                    q: "Is there a limit on the number of files?",
                    a: "Technically, no. Since we run in your browser, the only limit is your device's memory. You can easily merge 20, 50, or even 100 files in one go."
                },
                {
                    q: "Are my files uploaded?",
                    a: "Never. The merging process happens right here in your browser tab. If you disconnect your internet, the tool will still work perfectly."
                }
            ]
        },
        "organize-pdf": {
            name: "Organize PDF",
            h1: "Rearrange, Rotate & delete PDF Pages",
            metaDescription: "Take full control of your PDF structure. Rotate pages, delete unnecessary ones, and reorder content with a visual grid editor.",
            keywords: ["Organize PDF pages", "Rotate PDF pages", "Delete pages from PDF", "Rearrange PDF online"],
            description: "Think of this as a light table for your digital documents. See every page as a thumbnail, rotate the ones that are sideways, delete the blank ones, and drag crucial pages to the start. Perfect for scanning cleanups.",
            qa: [
                {
                    q: "Can I rotate just one page?",
                    a: "Yes! Hover over any page thumbnail to see individual rotate buttons. You can also select multiple pages to rotate them all at once."
                },
                {
                    q: "Does this affect the quality?",
                    a: "No. We manipulate the PDF structure without re-encoding the content, maintaining the original crispness of your text and images."
                }
            ]
        },
        "jpg-to-pdf": {
            name: "Image to PDF",
            h1: "Convert Photos to PDF - Exact Resolution",
            metaDescription: "Convert JPG, PNG, and WebP images to a single PDF document. No stretching, no quality loss. Perfect for portfolios and receipts.",
            keywords: ["JPG to PDF converter", "Photos to PDF", "Image to PDF high quality", "Combine images to PDF"],
            description: "Turn your gallery into a document. Whether it's a pile of receipts for an expense report or high-res photos for a portfolio, Soft Bees ensures every pixel is preserved. We map your images 1:1 onto PDF pages.",
            qa: [
                {
                    q: "Will my images get blurry?",
                    a: "Not with Soft Bees. Unlike other tools that downscale to A4 size, we adapt the PDF page size to match your image dimensions exactly."
                },
                {
                    q: "Can I reorder the images?",
                    a: "Absolutely. Drag and drop your images in the grid before clicking convert to ensure they appear in the exact order you want."
                }
            ]
        },
        "pdf-to-jpg": {
            name: "PDF to Image",
            h1: "Extract High-Quality Images from PDF",
            metaDescription: "Turn PDF pages into separate JPG images. Download as a ZIP archive. High DPI extraction for maximum clarity.",
            keywords: ["PDF to JPG high resolution", "Extract images from PDF", "Convert PDF to PNG", "PDF to image converter"],
            description: "Sometimes you need a page as a picture. Our tool renders each PDF page at high resolution and converts it to a universally shareable image format. Great for sharing slides on social media.",
            qa: [
                {
                    q: "What resolution are the images?",
                    a: "We render at 2x standard screen resolution to ensure text remains sharp and readable, even when zoomed in."
                },
                {
                    q: "How do I download them?",
                    a: "We bundle all the converted images into a single ZIP file for easy downloading, keeping your downloads folder tidy."
                }
            ]
        },
        "edit-pdf": {
            name: "PDF Editor Pro",
            h1: "Professional PDF Text Editor - Edit Existing Text Online",
            metaDescription: "Edit existing text in your PDF files directly in the browser. Select, erase, and rewrite without Adobe Acrobat. Free and private.",
            keywords: ["Edit text in PDF online", "Modify PDF text without Adobe", "PDF text replacer", "Sign PDF online free"],
            description: "The holy grail of PDF tools. Soft Bees Pro Editor essentially turns your PDF into an editable document. Fix typos, update dates, or change names directly on the file.",
            qa: [
                {
                    q: "Can I edit existing text?",
                    a: "Yes, Soft Bees Pro Editor allows you to select, erase, and replace text using our Vector-SVG engine."
                },
                {
                    q: "Is my data safe?",
                    a: "Absolutely. We use client-side processing, meaning your PDF never leaves your browser."
                }
            ]
        }
    }
};
