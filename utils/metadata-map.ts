import type { Metadata } from 'next';

type ToolMetadata = {
    title: string;
    description: string;
    keywords: string[];
};

export const metadataMap: Record<string, ToolMetadata> = {
    home: {
        title: 'Soft Bees - Free Online PDF Tools | Compress, Merge, Convert',
        description: 'Fast, secure, and client-side PDF tools. Compress, merge, organize, and convert PDFs directly in your browser without uploading files.',
        keywords: ['pdf tools', 'free pdf editor', 'private pdf compressor', 'merge pdf', 'client-side pdf', 'pdf to image', 'image to pdf'],
    },
    compress: {
        title: 'Compress PDF Online | Reduce PDF Size Free - Soft Bees',
        description: 'Compress PDF files locally in your browser. Optimize PDF quality and reduce file size without server uploads. Secure and fast.',
        keywords: ['compress pdf', 'reduce pdf size', 'online pdf compressor', 'optimize pdf', 'free pdf compression'],
    },
    merge: {
        title: 'Merge PDF - Combine PDF Files Online Free - Soft Bees',
        description: 'Combine multiple PDFs into one document. Drag and drop reordering. 100% client-side merging for maximum privacy.',
        keywords: ['merge pdf', 'combine pdfs', 'pdf joiner', 'merge pdf online', 'client-side pdf merge'],
    },
    organize: {
        title: 'Organize PDF - Rearrange, Rotate & Delete Pages - Soft Bees',
        description: 'Organize PDF pages easily. Rotate, delete, or reorder pages in your PDF documents. No file uploads required.',
        keywords: ['organize pdf', 'reorder pdf pages', 'rotate pdf', 'delete pdf pages', 'pdf organizer online'],
    },
    'jpg-to-pdf': {
        title: 'Image to PDF Converter | JPG, PNG to PDF - Soft Bees',
        description: 'Convert images (JPG, PNG, WebP) to PDF. Maintains exact image resolution without stretching. Fast and private conversion.',
        keywords: ['jpg to pdf', 'image to pdf', 'png to pdf', 'convert image to pdf', 'photos to pdf'],
    },
    'pdf-to-jpg': {
        title: 'PDF to Image Converter | Extract High-Quality JPGs - Soft Bees',
        description: 'Convert PDF pages to high-quality JPG images. Extract all pages and download as a ZIP file. 100% browser-based.',
        keywords: ['pdf to jpg', 'pdf to image', 'extract pdf images', 'convert pdf to photos', 'pdf to zip'],
    },
    'split-pdf': {
        title: 'Split PDF Online | Extract Pages from PDF - Soft Bees',
        description: 'Extract pages from your PDF or split it into multiple files. Range selection and ZIP download available. Secure and fast.',
        keywords: ['split pdf', 'extract pdf pages', 'pdf separator', 'cut pdf pages', 'online pdf splitter'],
    },
    'pdf-to-word': {
        title: 'PDF to Word Consultant | Convert to DOCX - Soft Bees',
        description: 'Convert PDF to editable Word documents. Maintains formatting, tables, and quality. Structural reconstruction engine.',
        keywords: ['pdf to word', 'pdf to docx', 'convert pdf to word', 'editable word document', 'pdf converter'],
    },
    'word-to-pdf': {
        title: 'Word to PDF Pro | Convert DOCX to Vector PDF - Soft Bees',
        description: 'Convert Word documents to high-quality PDF. Preserves layouts, tables, and fonts. 100% client-side conversion.',
        keywords: ['word to pdf', 'docx to pdf', 'convert word to pdf', 'doc to pdf', 'online pdf converter'],
    },
    'pdf-to-excel': {
        title: 'PDF to Excel Financial | Convert Bank Statements to XLSX - Soft Bees',
        description: 'Convert Bank Statements and Invoices to Formula-Ready Excel. Structural Gutter Detection & Financial Semantic Mapping.',
        keywords: ['pdf to excel', 'convert pdf to excel', 'bank statement converter', 'pdf to xlsx', 'financial data extraction'],
    },
};

export function constructMetadata(toolKey: keyof typeof metadataMap): Metadata {
    const meta = metadataMap[toolKey];
    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        openGraph: {
            title: meta.title,
            description: meta.description,
            type: 'website',
            siteName: 'Soft Bees PDF Tools',
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.title,
            description: meta.description,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}
