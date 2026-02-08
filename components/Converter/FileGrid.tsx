import { useConverterStore } from '@/store/converterStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, RotateCw } from 'lucide-react';

interface FileCardProps {
    file: any;
    index: number;
    onRemove: (id: string) => void;
    onRotate: (id: string) => void;
}

const FileCard = ({ file, index, onRemove, onRotate }: FileCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: file.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative aspect-[3/4] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            {...attributes}
            {...listeners}
        >
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10 backdrop-blur-sm">
                {index + 1}
            </div>

            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(file.id); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRotate(file.id); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute bottom-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-20 backdrop-blur-sm"
            >
                <RotateCw className="w-3.5 h-3.5" />
            </button>

            <div className="w-full h-full p-4 flex items-center justify-center bg-gray-50">
                <img
                    src={file.previewUrl}
                    alt="preview"
                    className="w-full h-full object-contain transition-transform duration-300 pointer-events-none select-none"
                    style={{ transform: `rotate(${file.rotation}deg)` }}
                />
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t border-gray-100 p-2 text-xs text-center truncate px-2 font-medium text-gray-600">
                {file.originalName}
            </div>
        </div>
    );
};

export default function FileGrid() {
    const { files, reorderFiles, removeFile, rotateFile } = useConverterStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            reorderFiles(active.id as string, over?.id as string);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={files.map(f => f.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full pb-20">
                    {files.map((file, index) => (
                        <FileCard
                            key={file.id}
                            file={file}
                            index={index}
                            onRemove={removeFile}
                            onRotate={rotateFile}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
