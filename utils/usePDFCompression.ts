/**
 * React Hook for PDF Compression
 * Provides easy integration with React components
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type {
    ProcessingState,
    CompressionProgress,
    CompressionResult,
    WorkerMessageType,
} from './types';

export interface UsePDFCompressionReturn {
    // State
    state: ProcessingState;
    progress: CompressionProgress | null;
    result: CompressionResult | null;
    error: string | null;
    processedBlob: Blob | null;

    // Actions
    compress: (file: File, targetSizeKB: number) => Promise<CompressionResult>;
    reset: () => void;
    cancel: () => void;
}

export function usePDFCompression(): UsePDFCompressionReturn {
    const [state, setState] = useState<ProcessingState>('idle');
    const [progress, setProgress] = useState<CompressionProgress | null>(null);
    const [result, setResult] = useState<CompressionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);

    const workerRef = useRef<Worker | null>(null);

    const reset = useCallback(() => {
        setState('idle');
        setProgress(null);
        setResult(null);
        setError(null);
        setProcessedBlob(null);

        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }, []);

    const cancel = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
        reset();
    }, [reset]);

    const compress = useCallback(async (file: File, targetSizeKB: number): Promise<CompressionResult> => {
        return new Promise((resolve, reject) => {
            try {
                // Reset previous state
                setError(null);
                setProgress(null);
                setResult(null);
                setProcessedBlob(null);
                setState('processing');

                // Create Web Worker
                const worker = new Worker(
                    new URL('./pdf-worker.ts', import.meta.url),
                    { type: 'module' }
                );
                workerRef.current = worker;

                // Set up message handler
                worker.onmessage = (e: MessageEvent<WorkerMessageType>) => {
                    const { type, payload } = e.data;

                    switch (type) {
                        case 'progress':
                            setProgress(payload);
                            break;

                        case 'complete': {
                            const { blobArrayBuffer, result: compressionResult } = payload;
                            const blob = new Blob([blobArrayBuffer], { type: 'application/pdf' });

                            setProcessedBlob(blob);
                            const finalResult = {
                                ...compressionResult,
                                blob,
                            };
                            setResult(finalResult);
                            setState('ready');
                            setProgress({
                                currentPage: compressionResult.originalSize,
                                totalPages: compressionResult.compressedSize,
                                percentage: 100,
                                status: 'Complete!',
                            });

                            worker.terminate();
                            workerRef.current = null;
                            resolve(finalResult); // Resolve the promise with the result
                            break;
                        }

                        case 'error':
                            const errorMsg = payload.message;
                            setError(errorMsg);
                            setState('error');
                            worker.terminate();
                            workerRef.current = null;
                            reject(new Error(errorMsg));
                            break;
                    }
                };

                worker.onerror = (e) => {
                    const errorMsg = e.message || 'Worker error occurred';
                    setError(errorMsg);
                    setState('error');
                    worker.terminate();
                    workerRef.current = null;
                    reject(new Error(errorMsg));
                };

                // Send compression task to worker
                file.arrayBuffer().then(fileArrayBuffer => {
                    worker.postMessage({
                        type: 'start',
                        payload: {
                            fileArrayBuffer,
                            fileName: file.name,
                            targetSizeKB,
                        },
                    }, [fileArrayBuffer]);
                }).catch(err => {
                    reject(err);
                });

            } catch (err: any) {
                const errorMsg = err.message || 'An error occurred';
                setError(errorMsg);
                setState('error');

                if (workerRef.current) {
                    workerRef.current.terminate();
                    workerRef.current = null;
                }
                reject(new Error(errorMsg));
            }
        });
    }, []);

    return {
        state,
        progress,
        result,
        error,
        processedBlob,
        compress,
        reset,
        cancel,
    };
}
