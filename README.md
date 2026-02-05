# SOFTBEES PDF - Serverless PDF Compressor

## 🚀 Overview

A **100% client-side PDF compression tool** that runs entirely in the browser. No uploads, no servers, no privacy concerns. Uses intelligent target-size compression to achieve exact file sizes.

## ✨ Key Features

- **🔒 100% Private**: All processing happens in your browser
- **⚡ Instant**: No upload/download delays
- **🎯 Target Size Compression**: Specify exact output size (e.g., "Make this 200KB")
- **🧠 Intelligent Quality Adjustment**: Automatically finds optimal compression
- **⚙️ Non-Blocking**: Uses Web Workers to prevent UI freezing
- **📊 Real-time Progress**: Live page-by-page progress tracking

## 🛠️ Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **pdf-lib** - PDF manipulation
- **jspdf** - PDF reconstruction
- **pdfjs-dist** - PDF parsing and rendering
- **Web Workers** - Background processing
- **OffscreenCanvas** - High-performance rendering

## 📂 Project Structure

```
softbees-pdf/
├── utils/
│   ├── pdf-engine.ts         # Core compression logic
│   ├── pdf-worker.ts          # Web Worker implementation
│   ├── file-helpers.ts        # Download/rename utilities
│   ├── usePDFCompression.ts   # React hook
│   └── types.ts               # TypeScript definitions
├── components/
│   └── PDFCompressor.tsx      # Example component
├── public/
│   └── pdf.worker.min.mjs     # pdfjs-dist worker
└── app/
    └── page.tsx               # Main page
```

## 🔧 How It Works

### The Compression Algorithm

1. **Parse PDF**: Load and analyze the original PDF
2. **Calculate Ratio**: Compare original size vs target size
3. **Render Pages**: Convert each page to high-res Canvas
4. **JPEG Conversion**: Convert Canvas to JPEG with calculated quality
5. **Size Check**: Verify output size matches target
6. **Iterate**: Adjust quality if needed (max 3 iterations)
7. **Rebuild**: Reconstruct PDF with compressed images

### Smart Quality Calculation

```typescript
Compression Ratio → Initial Quality
10x+ reduction    → 30% quality (aggressive)
5x-10x reduction  → 50% quality (moderate)
2x-5x reduction   → 70% quality (light)
<2x reduction     → 85% quality (minimal)
```

## 📖 Usage

### Basic Usage with Hook

```typescript
import { usePDFCompression } from '@/utils/usePDFCompression';
import { downloadBlob } from '@/utils/file-helpers';

function MyComponent() {
  const { compress, processedBlob, progress, state } = usePDFCompression();

  const handleCompress = async (file: File) => {
    await compress(file, 200); // Target: 200KB
    
    if (processedBlob) {
      downloadBlob(processedBlob, 'compressed.pdf');
    }
  };

  return (
    <div>
      {progress && <p>{progress.status} - {progress.percentage}%</p>}
      <button onClick={() => handleCompress(myFile)}>Compress</button>
    </div>
  );
}
```

### Direct Engine Usage (Advanced)

```typescript
import { compressPDF } from '@/utils/pdf-engine';

const result = await compressPDF(file, {
  targetSizeKB: 200,
  onProgress: (progress) => {
    console.log(`${progress.percentage}% - ${progress.status}`);
  },
  maxIterations: 3,
  minQuality: 0.1,
  maxQuality: 0.95,
});

console.log(`Compressed from ${result.originalSize} to ${result.compressedSize}`);
console.log(`Compression ratio: ${result.compressionRatio}x`);
```

## 🎨 Component API

### `usePDFCompression` Hook

**Returns:**
```typescript
{
  state: 'idle' | 'processing' | 'ready' | 'error'
  progress: CompressionProgress | null
  result: CompressionResult | null
  error: string | null
  processedBlob: Blob | null
  compress: (file: File, targetSizeKB: number) => Promise<void>
  reset: () => void
  cancel: () => void
}
```

### File Helpers

```typescript
// Download with custom name
downloadBlob(blob, 'my-compressed-file.pdf');

// Format file sizes
formatFileSize(1024000); // "1000.00 KB"

// Validate PDF
isPDF(file); // true/false

// Generate compressed filename
generateCompressedFilename('document.pdf'); // "document_compressed"
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## ⚙️ Configuration

### Next.js Config

Already configured in `next.config.ts`:
- Web Worker support
- .mjs file handling for pdfjs-dist
- Proper MIME types for worker files

### Customization

Adjust compression parameters in your component:

```typescript
const { compress } = usePDFCompression();

// More aggressive compression
compress(file, 100, {
  maxIterations: 5,    // More attempts
  minQuality: 0.05,    // Lower minimum
});
```

## 🧪 Testing Recommendations

1. **Small PDFs (<1MB)**: Quick validation
2. **Medium PDFs (5-10MB)**: Typical use case
3. **Large PDFs (50MB+)**: Stress testing
4. **Multi-page documents**: Progress tracking
5. **Image-heavy PDFs**: Compression effectiveness

## 🔒 Privacy & Security

- **No server uploads**: Files never leave your device
- **No tracking**: Zero analytics or monitoring
- **No storage**: Files processed in memory only
- **No network requests**: Fully offline capable

## 📊 Performance

- **Memory efficient**: Processes page-by-page
- **Non-blocking**: Uses Web Workers
- **Progress tracking**: Real-time updates
- **Cancellable**: Can stop mid-process

## 🎯 Use Cases

- Email attachments (reduce to <5MB)
- Web uploads (meet size limits)
- Mobile sharing (reduce bandwidth)
- Document archiving (save storage)
- Portfolio optimization (faster loading)

## 🤝 Contributing

This is a commercial project for SOFTBEES. Contact the development team for contribution guidelines.

## 📄 License

Proprietary - SOFTBEES © 2026

---

**Built with ❤️ by SOFTBEES**
