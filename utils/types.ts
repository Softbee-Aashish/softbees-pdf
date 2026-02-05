/**
 * TypeScript Type Definitions for PDF Compression System
 */

export type ProcessingState = 'idle' | 'uploading' | 'processing' | 'ready' | 'error' | 'downloading';

export interface CompressionProgress {
    currentPage: number;
    totalPages: number;
    percentage: number;
    status: string;
}

export interface CompressionResult {
    blob: Blob;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    quality: number;
}

export interface CompressionOptions {
    targetSizeKB: number;
    onProgress?: (progress: CompressionProgress) => void;
    maxIterations?: number;
    minQuality?: number;
    maxQuality?: number;
}

// Worker Message Types
export interface WorkerMessage {
    type: 'start' | 'progress' | 'complete' | 'error';
    payload?: any;
}

export interface WorkerStartMessage extends WorkerMessage {
    type: 'start';
    payload: {
        fileArrayBuffer: ArrayBuffer;
        fileName: string;
        targetSizeKB: number;
        options?: Partial<CompressionOptions>;
    };
}

export interface WorkerProgressMessage extends WorkerMessage {
    type: 'progress';
    payload: CompressionProgress;
}

export interface WorkerCompleteMessage extends WorkerMessage {
    type: 'complete';
    payload: {
        blobArrayBuffer: ArrayBuffer;
        result: Omit<CompressionResult, 'blob'>;
    };
}

export interface WorkerErrorMessage extends WorkerMessage {
    type: 'error';
    payload: {
        message: string;
        stack?: string;
    };
}

export type WorkerMessageType =
    | WorkerStartMessage
    | WorkerProgressMessage
    | WorkerCompleteMessage
    | WorkerErrorMessage;
