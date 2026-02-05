# SOFTBEES PDF Compressor - Implementation Guide

## 🎨 Design System

### Color Palette
All colors are configured in `tailwind.config.ts`:

```typescript
primary:      #F63049  // Bright Red - Main buttons, highlights, icons
primary-hover: #D02752  // Deep Pink - Hover states, active elements  
accent:       #8A244B  // Wine - Borders, secondary elements, badges
dark:         #111F35  // Navy Blue - Navbar, headings, text
```

### Usage Examples
```tsx
<button className="bg-primary hover:bg-primary-hover">Compress</button>
<div className="border-accent text-dark">Content</div>
```

## 📐 Architecture Overview

```
User Interaction Flow:
1. Hero Upload → Select PDF files
2. File Table → View and configure files  
3. Settings Dialog → Set target size (e.g., 200KB)
4. Compression → Backend processes in Web Worker
5. Rename Dialog → Customize filename
6. Download → Save compressed PDF
```

## 🔌 Wiring: UI ↔ Backend Logic

### The Connection Points

**From UI to Backend:**
```typescript
// In CompressorPage.tsx
import { usePDFCompression } from '@/utils/usePDFCompression';

const { compress, progress, processedBlob, result } = usePDFCompression();

// When user clicks "Start Compression":
const handleCompress = async (fileId: string) => {
  const fileItem = files.find(f => f.id === fileId);
  const targetKB = fileItem.targetUnit === 'MB' 
    ? fileItem.targetSize * 1024 
    : fileItem.targetSize;

  // THIS IS THE CRITICAL CONNECTION:
  // Pass user's target size to the compression engine
  await compress(fileItem.file, targetKB);
};
```

**Backend Processing:**
```typescript
// usePDFCompression.ts → pdf-worker.ts → pdf-engine.ts
Worker receives:  { file, targetSizeKB }
Engine computes:  optimal JPEG quality for target size
Returns:          compressed PDF blob
```

### Target Size Workflow

**Step 1:** User opens Compression Settings Dialog
```tsx
<CompressionSettingsDialog
  onConfirm={(targetSize, unit) => {
    // Store in file state
    setFiles(prev => prev.map(f => 
      f.id === currentFileId 
        ? { ...f, targetSize, targetUnit: unit }
        : f
    ));
  }}
/>
```

**Step 2:** User clicks "Compress" in File Table
```tsx
onClick={() => onCompress(fileId)}
// ↓ triggers handleCompress()
```

**Step 3:** CompressorPage converts to KB and calls backend
```typescript
const targetKB = fileItem.targetUnit === 'MB' 
  ? fileItem.targetSize * 1024   // Convert MB to KB
  : fileItem.targetSize;          // Already in KB

await compress(fileItem.file, targetKB);  // ← TO BACKEND
```

**Step 4:** Backend calculates compression ratio
```typescript
// In pdf-worker.ts
const compressionRatio = originalSizeBytes / (targetKB * 1024);
let imageQuality = calculateInitialQuality(compressionRatio);
// → Starts iterative compression
```

## 📁 Component Breakdown

### 1. Navbar (`components/Navbar.tsx`)
- **Purpose**: Brand identity and navigation
- **Colors**: 
  - Background: `bg-dark` (#111F35)
  - Logo text: White with `text-primary` icon
  - Links: Hover to `text-primary`

### 2. Hero Upload (`components/HeroUpload.tsx`)
- **Purpose**: Initial file selection with drag-drop
- **Colors**:
  - Dropzone border: `border-accent` (#8A244B)
  - Upload icon: `text-primary` (#F63049)
  - CTA button: `bg-primary hover:bg-primary-hover`
- **Functionality**: 
  - Accepts up to 3 PDF files
  - Validates file types
  - Triggers `onFilesSelected(files[])`

### 3. File Table (`components/FileTable.tsx`)
- **Purpose**: Workspace showing all selected files
- **Columns**:
  - File Name (with icon)
  - Original Size
  - Target Size (badge)
  - Status (progress bar for compression)
  - Actions (Settings, Compress, Download, Remove)
- **Colors**:
  - Icons: `text-primary`
  - Target size badge: `bg-accent/10 text-accent`
  - Progress bar: `bg-primary`
  - Action buttons: `bg-primary hover:bg-primary-hover`

### 4. Compression Settings Dialog (`components/CompressionSettingsDialog.tsx`)
- **Purpose**: User inputs target file size
- **Fields**:
  - Number input (e.g., 200)
  - Unit selector (KB/MB dropdown)
- **Flow**:
  ```
  User inputs → onConfirm(size, unit) → Stored in file state → Used in compression
  ```
- **Colors**:
  - Input focus: `border-primary`
  - Confirm button: `bg-primary hover:bg-primary-hover`

### 5. Rename Download Dialog (`components/RenameDownloadDialog.tsx`)
- **Purpose**: Show compression results and rename file
- **Features**:
  - Compression statistics (original vs compressed)
  - Savings percentage (green highlight)
  - Filename input (pre-filled with "-compressed" suffix)
- **Colors**:
  - Success icon: Green background
  - Stats card: Gradient from `primary` to `accent`
  - Download button: `bg-primary hover:bg-primary-hover`

### 6. Main Page (`app/page.tsx`)
- **Purpose**: Orchestrates all components and state
- **State Management**:
  ```typescript
  files: FileItem[]           // All uploaded files
  settingsDialogOpen: boolean // Settings modal visibility
  renameDialogOpen: boolean   // Rename modal visibility
  currentFileId: string       // Which file is being processed
  ```
- **Backend Integration**:
  - Uses `usePDFCompression()` hook
  - Monitors `progress` to update file progress bars
  - Receives `processedBlob` when complete
  - Opens rename dialog automatically

## 🎯 Key Integration Points

### Progress Tracking
```typescript
// Real-time progress updates during compression
if (progress && currentFileId) {
  setFiles(prev => prev.map(f => 
    f.id === currentFileId 
      ? { ...f, progress: progress.percentage }  // Update progress bar
      : f
  ));
}
```

### Completion Handling
```typescript
// After compression finishes
setFiles(prev => prev.map(f => 
  f.id === fileId 
    ? { 
        ...f, 
        status: 'complete', 
        compressedBlob: processedBlob  // Store result
      }
    : f
));

setRenameDialogOpen(true);  // Show rename dialog
```

### Download Execution
```typescript
const handleDownload = (fileId: string, customName?: string) => {
  const fileItem = files.find(f => f.id === fileId);
  downloadBlob(fileItem.compressedBlob, customName);  // ← From file-helpers.ts
};
```

## 🚀 Running the Application

### Development
```bash
npm run dev
```
Visit: `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 🧪 Testing the Complete Flow

1. **Upload**: Drag-drop or select a PDF file
2. **Configure**: Click Settings gear → Enter "200 KB"
3. **Compress**: Click "Compress" button
4. **Monitor**: Watch real-time progress bar
5. **Review**: See compression stats in rename dialog
6. **Download**: Customize filename → Click "Download Now"

## 🎨 Design Highlights

- **SOFTBEES Red** (`#F63049`) used for all primary actions
- **Deep Pink** (`#D02752`) creates satisfying hover feedback
- **Wine** (`#8A244B`) provides subtle contrast for borders
- **Navy Blue** (`#111F35`) gives professional, high-contrast text

## 📝 State Flow Diagram

```
User Upload
    ↓
[ files: FileItem[] ]  ← State in CompressorPage
    ↓
User clicks Settings
    ↓
CompressionSettingsDialog.onConfirm(targetSize, unit)
    ↓
Update file.targetSize in state
    ↓
User clicks Compress
    ↓
handleCompress(fileId)
    ├─ Get targetSize from file state
    ├─ Convert to KB
    ├─ Call compress(file, targetKB)  ← TO BACKEND
    └─ Set status: 'compressing'
        ↓
Backend Processing (Web Worker)
    ├─ Progress updates → Update UI progress bars
    └─ Complete → processedBlob
        ↓
Update file.compressedBlob in state
Set status: 'complete'
Open RenameDownloadDialog
    ↓
User confirms download
    ↓
downloadBlob(blob, customName)  ← FROM file-helpers.ts
    ↓
✅ Complete!
```

## 🔧 Customization Guide

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#YOUR_COLOR',
    hover: '#YOUR_HOVER_COLOR',
  },
  accent: '#YOUR_ACCENT',
  dark: '#YOUR_DARK',
}
```

### Adjust Max Files
Edit `CompressorPage.tsx`:
```tsx
<HeroUpload maxFiles={5} />  // Change from 3 to 5
```

### Modify Compression Algorithm
Edit `utils/pdf-engine.ts`:
```typescript
calculateInitialQuality(compressionRatio, minQuality, maxQuality) {
  // Adjust quality thresholds here
}
```

---

**Built with ❤️ by SOFTBEES**
