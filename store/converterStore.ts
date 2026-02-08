import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';

export type ConversionType = 'img-to-pdf' | 'pdf-to-img';

export interface ConverterFile {
    id: string;
    file?: File; // optional because PDF pages extracted might not be File objects initially
    previewUrl: string;
    originalName: string;
    type: 'image' | 'pdf-page';
    rotation: 0 | 90 | 180 | 270;
}

interface ConverterState {
    files: ConverterFile[];
    status: 'idle' | 'processing' | 'success' | 'error';
    conversionType: ConversionType;
    error: string | null;

    // Actions
    setConversionType: (type: ConversionType) => void;
    addFiles: (files: File[]) => Promise<void>;
    addPages: (pages: ConverterFile[]) => void; // For PDF to Image flow
    removeFile: (id: string) => void;
    reorderFiles: (activeId: string, overId: string) => void;
    rotateFile: (id: string) => void;
    setStatus: (status: 'idle' | 'processing' | 'success' | 'error', error?: string) => void;
    reset: () => void;
}

export const useConverterStore = create<ConverterState>((set, get) => ({
    files: [],
    status: 'idle',
    conversionType: 'img-to-pdf',
    error: null,

    setConversionType: (type) => set({ conversionType: type, files: [], status: 'idle', error: null }),

    addFiles: async (newFiles) => {
        const currentFiles = get().files;

        const processFile = (file: File): Promise<ConverterFile> => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({
                        id: Math.random().toString(36).substring(7),
                        file,
                        previewUrl: e.target?.result as string,
                        originalName: file.name,
                        type: 'image',
                        rotation: 0
                    });
                };
                reader.readAsDataURL(file);
            });
        };

        const processed = await Promise.all(newFiles.map(processFile));
        set({ files: [...currentFiles, ...processed] });
    },

    addPages: (pages) => {
        set((state) => ({ files: [...state.files, ...pages] }));
    },

    removeFile: (id) => {
        set((state) => ({ files: state.files.filter(f => f.id !== id) }));
    },

    reorderFiles: (activeId, overId) => {
        set((state) => {
            const oldIndex = state.files.findIndex(f => f.id === activeId);
            const newIndex = state.files.findIndex(f => f.id === overId);
            return { files: arrayMove(state.files, oldIndex, newIndex) };
        });
    },

    rotateFile: (id) => {
        set((state) => ({
            files: state.files.map(f =>
                f.id === id ? { ...f, rotation: (f.rotation + 90) % 360 as 0 | 90 | 180 | 270 } : f
            )
        }));
    },

    setStatus: (status, error) => set({ status, error: error || null }),

    reset: () => set({ files: [], status: 'idle', error: null })
}));
