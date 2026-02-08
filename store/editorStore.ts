import { create } from 'zustand';

export interface SVGPage {
    id: string;
    pageNumber: number;
    svgContent: string;
    width: number;
    height: number;
    edited: boolean;
}

export interface EditorState {
    // Pages
    pages: SVGPage[];
    currentPage: number;

    // Selection
    selectedElements: string[];

    // View
    zoom: number;
    panX: number;
    panY: number;

    // Tools
    activeTool: 'select' | 'text' | 'hand' | 'eraser';

    // History
    history: any[];
    historyIndex: number;

    // File
    fileName: string;
    isEdited: boolean;

    // Actions
    setPages: (pages: SVGPage[]) => void;
    setCurrentPage: (page: number) => void;
    addPage: (page: SVGPage) => void;
    deletePage: (pageId: string) => void;
    reorderPages: (from: number, to: number) => void;

    setSelectedElements: (ids: string[]) => void;
    clearSelection: () => void;

    setZoom: (zoom: number) => void;
    setPan: (x: number, y: number) => void;

    setActiveTool: (tool: 'select' | 'text' | 'hand' | 'eraser') => void;

    markEdited: () => void;

    undo: () => void;
    redo: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    // Initial state
    pages: [],
    currentPage: 0,
    selectedElements: [],
    zoom: 100,
    panX: 0,
    panY: 0,
    activeTool: 'select',
    history: [],
    historyIndex: -1,
    fileName: 'Untitled.pdf',
    isEdited: false,

    // Actions
    setPages: (pages) => set({ pages }),
    setCurrentPage: (page) => set({ currentPage: page }),

    addPage: (page) => set((state) => ({
        pages: [...state.pages, page],
        isEdited: true
    })),

    deletePage: (pageId) => set((state) => ({
        pages: state.pages.filter(p => p.id !== pageId),
        isEdited: true
    })),

    reorderPages: (from, to) => set((state) => {
        const newPages = [...state.pages];
        const [removed] = newPages.splice(from, 1);
        newPages.splice(to, 0, removed);
        return { pages: newPages, isEdited: true };
    }),

    setSelectedElements: (ids) => set({ selectedElements: ids }),
    clearSelection: () => set({ selectedElements: [] }),

    setZoom: (zoom) => set({ zoom: Math.max(10, Math.min(500, zoom)) }),
    setPan: (x, y) => set({ panX: x, panY: y }),

    setActiveTool: (tool) => set({ activeTool: tool }),

    markEdited: () => set({ isEdited: true }),

    undo: () => set((state) => {
        if (state.historyIndex > 0) {
            return { historyIndex: state.historyIndex - 1 };
        }
        return state;
    }),

    redo: () => set((state) => {
        if (state.historyIndex < state.history.length - 1) {
            return { historyIndex: state.historyIndex + 1 };
        }
        return state;
    }),
}));
