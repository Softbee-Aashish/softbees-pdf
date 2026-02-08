import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';

// Using simple generator for now to avoid dependency issues if not installed
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export interface PageObject {
    id: string;
    fileId: string;
    originalIndex: number; // 0-based index from source PDF (pdf-lib uses 0-based)
    rotation: 0 | 90 | 180 | 270;
    type: 'pdf' | 'blank';
    isDeleted: boolean;
    thumbnail?: string; // Data URL for preview
}

interface OrganizerState {
    pages: PageObject[];
    fileRegistry: Map<string, ArrayBuffer>; // fileId -> Raw Data
    documentName: string; // Base name for export
    isProcessing: boolean;
    error: string | null;

    // Actions
    addFiles: (files: File[]) => Promise<void>;
    rotatePage: (id: string, direction: 'cw' | 'ccw') => void;
    rotateAll: (direction: 'cw' | 'ccw') => void;
    deletePage: (id: string) => void;
    restorePage: (id: string) => void;
    insertBlankPage: (afterId: string | null) => void; // null means at start? or index?
    reorderPages: (activeId: string, overId: string) => void;
    reset: () => void;

    // Helpers
    getPageCount: () => number;
}

export const useOrganizerStore = create<OrganizerState>((set, get) => ({
    pages: [],
    fileRegistry: new Map(),
    documentName: 'document',
    isProcessing: false,
    error: null,

    addFiles: async (files: File[]) => {
        set({ isProcessing: true, error: null });

        try {
            // Dynamic import for loader
            const { loadPDF } = await import('@/utils/pdf-loader');

            const newPages: PageObject[] = [];
            const newRegistryEntries: [string, ArrayBuffer][] = [];

            // Set document name from the first file if it's the first batch
            const currentName = get().documentName;
            if (currentName === 'document' && files.length > 0) {
                const originalName = files[0].name.replace(/\.pdf$/i, '');
                set({ documentName: originalName });
            }

            for (const file of files) {
                // validation
                if (file.size > 500 * 1024 * 1024) {
                    throw new Error(`File ${file.name} exceeds 500MB limit.`);
                }

                const fileId = generateId();
                const arrayBuffer = await file.arrayBuffer();
                newRegistryEntries.push([fileId, arrayBuffer]);

                // Load pages
                const pdfData = await loadPDF(file);

                pdfData.forEach((page) => {
                    newPages.push({
                        id: generateId(),
                        fileId: fileId,
                        originalIndex: page.pageNumber - 1, // Store as 0-based for pdf-lib
                        rotation: 0,
                        type: 'pdf',
                        isDeleted: false,
                        thumbnail: page.imageData
                    });
                });
            }

            set((state) => {
                const updatedRegistry = new Map(state.fileRegistry);
                newRegistryEntries.forEach(([k, v]) => updatedRegistry.set(k, v));

                return {
                    pages: [...state.pages, ...newPages],
                    fileRegistry: updatedRegistry,
                    isProcessing: false
                };
            });

        } catch (err: any) {
            console.error("Failed to add files:", err);
            set({ error: err.message || "Failed to load files", isProcessing: false });
        }
    },

    rotatePage: (id, direction) => {
        set((state) => ({
            pages: state.pages.map((p) => {
                if (p.id !== id) return p;

                const delta = direction === 'cw' ? 90 : -90;
                let newRot = (p.rotation + delta) % 360;
                if (newRot < 0) newRot += 360;

                return { ...p, rotation: newRot as 0 | 90 | 180 | 270 };
            })
        }));
    },

    rotateAll: (direction) => {
        set((state) => ({
            pages: state.pages.map((p) => {
                if (p.isDeleted || p.type === 'blank') return p; // Don't rotate deleted or blanks implicitly? 
                // Blanks can rotate, but usually visual only. Let's allowing rotating everything visible.

                const delta = direction === 'cw' ? 90 : -90;
                let newRot = (p.rotation + delta) % 360;
                if (newRot < 0) newRot += 360;

                return { ...p, rotation: newRot as 0 | 90 | 180 | 270 };
            })
        }));
    },

    deletePage: (id) => {
        set((state) => ({
            pages: state.pages.map(p => p.id === id ? { ...p, isDeleted: true } : p)
        }));
    },

    restorePage: (id) => {
        set((state) => ({
            pages: state.pages.map(p => p.id === id ? { ...p, isDeleted: false } : p)
        }));
    },

    insertBlankPage: (afterId) => {
        set((state) => {
            const index = afterId ? state.pages.findIndex(p => p.id === afterId) : -1;
            const newPage: PageObject = {
                id: generateId(),
                fileId: 'blank',
                originalIndex: -1,
                rotation: 0,
                type: 'blank',
                isDeleted: false
            };

            const newPages = [...state.pages];
            // Insert after the index
            newPages.splice(index + 1, 0, newPage);

            return { pages: newPages };
        });
    },

    reorderPages: (activeId, overId) => {
        set((state) => {
            const oldIndex = state.pages.findIndex(p => p.id === activeId);
            const newIndex = state.pages.findIndex(p => p.id === overId);

            if (oldIndex === -1 || newIndex === -1) return {};

            return {
                pages: arrayMove(state.pages, oldIndex, newIndex)
            };
        });
    },

    reset: () => {
        set({
            pages: [],
            fileRegistry: new Map(),
            documentName: 'document',
            error: null,
            isProcessing: false
        });
    },

    getPageCount: () => {
        const state = get();
        return state.pages.filter(p => !p.isDeleted).length;
    }
}));
