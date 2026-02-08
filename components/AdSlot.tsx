import React from 'react';

interface AdSlotProps {
    slotId?: string; // Google AdSense Data Slot ID
    format?: 'auto' | 'fluid' | 'rectangle';
    className?: string;
    label?: string; // "Advertisement" label
}

const AdSlot: React.FC<AdSlotProps> = ({
    slotId = '1234567890', // Default placeholder, replace with real env var or prop
    format = 'auto',
    className = '',
    label = 'Advertisement'
}) => {
    return (
        <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
            {label && (
                <span className="text-[10px] text-gray-300 uppercase tracking-widest mb-1">
                    {label}
                </span>
            )}

            {/* Ad Container */}
            <div className="w-full bg-gray-100/50 rounded-lg overflow-hidden min-h-[100px] flex items-center justify-center border border-gray-100 border-dashed">
                {/* Actual Ad Code Would Go Here */}
                {/* For now, a visual placeholder for layout auditing */}
                <div className="text-gray-300 text-xs font-mono p-4 text-center">
                    Ad Space ({format})
                    <br />
                    Slot: {slotId}
                </div>
            </div>
        </div>
    );
};

export default AdSlot;
