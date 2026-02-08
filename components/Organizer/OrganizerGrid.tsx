'use client';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation,
    DragEndEvent,
    DragStartEvent
} from '@dnd-kit/core';
import {
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { useState } from 'react';
import PageCard from './PageCard';
import { PageObject } from '@/store/organizerStore';
import InsertionHandle from './InsertionHandle';

interface OrganizerGridProps {
    pages: PageObject[];
    onRotate: (id: string, direction: 'cw' | 'ccw') => void;
    onDelete: (id: string) => void;
    onInsert: (afterId: string | null) => void;
    onReorder: (activeId: string, overId: string) => void;
}

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export default function OrganizerGrid({ pages, onRotate, onDelete, onInsert, onReorder }: OrganizerGridProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            onReorder(active.id as string, over.id as string);
        }

        setActiveId(null);
    };

    const visiblePages = pages.filter(p => !p.isDeleted);
    const activePage = visiblePages.find(p => p.id === activeId);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="w-full">
                <SortableContext
                    items={visiblePages.map(p => p.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 p-10 pb-32 w-full justify-items-center">
                        {visiblePages.map((page, index) => (
                            <div key={page.id} className="relative group/wrapper">
                                <PageCard
                                    page={page}
                                    index={index}
                                    pageNumber={index + 1}
                                    onRotate={onRotate}
                                    onDelete={onDelete}
                                />

                                {/* Right-side Insertion Handle */}
                                <div className="absolute -right-5 top-0 bottom-0 w-4 flex items-center justify-center z-10 pointer-events-auto">
                                    <InsertionHandle onClick={() => onInsert(page.id)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activePage ? (
                        <div className="scale-105">
                            <PageCard
                                page={activePage}
                                index={0}
                                pageNumber={0}
                                onRotate={() => { }}
                                onDelete={() => { }}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}
