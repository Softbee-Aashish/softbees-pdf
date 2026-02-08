'use client';

import { Plus } from 'lucide-react';

interface InsertionHandleProps {
    onClick: () => void;
}

export default function InsertionHandle({ onClick }: InsertionHandleProps) {
    return (
        <div className="h-full w-4 mx-[-8px] flex items-center justify-center group z-10 relative cursor-pointer" onClick={onClick}>
            {/* The line */}
            <div className="h-full w-0.5 bg-transparent group-hover:bg-[#F63049] transition-colors duration-200 relative">
                {/* The button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#F63049] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110">
                    <Plus className="w-4 h-4 font-bold" />
                </div>
            </div>
        </div>
    );
}
