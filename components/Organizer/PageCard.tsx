'use client';

import { PageObject } from '@/store/organizerStore';
import { RotateCw, RotateCcw, X, GripHorizontal, FileText } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import Image from 'next/image';

interface PageCardProps {
    page: PageObject;
    index: number;
    onRotate: (id: string, direction: 'cw' | 'ccw') => void;
    onDelete: (id: string) => void;
    pageNumber: number; // Display number (1-based index in current order)
}

export default function PageCard({ page, index, onRotate, onDelete, pageNumber }: PageCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: page.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : 1,
    };

    // If blank page
    if (page.type === 'blank') {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="relative group bg-white aspect-[1/1.414] shadow-md border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#F63049] transition-all"
            >
                <div className="absolute top-[-10px] left-[-10px] bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold shadow-sm z-10">
                    {pageNumber}
                </div>

                <span className="text-gray-400 text-sm font-medium">Blank Page</span>

                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
                    className="absolute top-2 right-2 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group bg-white p-2 rounded-lg shadow-md border-2 border-transparent hover:border-[#F63049] transition-all duration-200 select-none"
        >
            {/* Page Badge */}
            <div className="absolute top-[-10px] left-[-10px] bg-[#111F35] text-white px-2 py-1 rounded text-xs font-bold shadow-sm z-10">
                {pageNumber}
            </div>

            {/* Drag Handle (Entire card is handle via listeners, but maybe visual cue) 
                Actually listeners are on the root div, so dragging anywhere works.
            */}

            {/* Delete Action */}
            <div className="absolute top-[-8px] right-[-8px] z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
                    className="p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-transform"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Canvas Preview */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded relative border border-gray-100 bg-gray-50">
                {page.thumbnail ? (
                    <img
                        src={page.thumbnail}
                        alt={`Page ${pageNumber}`}
                        className="object-contain transition-transform duration-300 origin-center"
                        style={{
                            transform: `rotate(${page.rotation}deg) scale(${page.rotation % 180 !== 0 ? 0.7 : 1})`,
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}
                        draggable={false} // Prevent native drag
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-300">
                        <FileText className="w-8 h-8 mb-2" />
                        <span className="text-xs">Loading...</span>
                    </div>
                )}
            </div>

            {/* Rotation Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointers-events-none">
                <button
                    onClick={(e) => { e.stopPropagation(); onRotate(page.id, 'ccw'); }}
                    className="p-2 bg-white/90 backdrop-blur-sm text-[#111F35] rounded-full shadow-md hover:bg-[#F63049] hover:text-white transition-colors border border-gray-200"
                    title="Rotate Left"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onRotate(page.id, 'cw'); }}
                    className="p-2 bg-white/90 backdrop-blur-sm text-[#111F35] rounded-full shadow-md hover:bg-[#F63049] hover:text-white transition-colors border border-gray-200"
                    title="Rotate Right"
                >
                    <RotateCw className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
