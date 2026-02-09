import React from 'react';
import { Trash2, Plus } from 'lucide-react';

interface RangeInputGroupProps {
    ranges: string[];
    setRanges: (ranges: string[]) => void;
    totalPageCount: number;
}

export default function RangeInputGroup({ ranges, setRanges, totalPageCount }: RangeInputGroupProps) {

    const updateRange = (index: number, val: string) => {
        const newRanges = [...ranges];
        newRanges[index] = val;
        setRanges(newRanges);
    };

    const addRange = () => {
        if (ranges.length < 4) {
            setRanges([...ranges, '']);
        }
    };

    const removeRange = (index: number) => {
        const newRanges = ranges.filter((_, i) => i !== index);
        setRanges(newRanges);
    };

    return (
        <div className="space-y-4">
            {ranges.map((range, index) => (
                <div key={index} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-bold text-[#111F35]">
                        <span>Range {index + 1}</span>
                        {ranges.length > 1 && (
                            <button
                                onClick={() => removeRange(index)}
                                className="text-red-400 hover:text-[#F63049] transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        value={range}
                        onChange={(e) => updateRange(index, e.target.value)}
                        placeholder="e.g. 1-5"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F63049] outline-none transition-colors font-medium text-[#111F35]"
                    />
                    <p className="text-xs text-gray-400">
                        Enter page numbers (e.g., 1-3, 5). Max: {totalPageCount}
                    </p>
                </div>
            ))}

            {ranges.length < 4 && (
                <button
                    onClick={addRange}
                    className="w-full py-3 border-2 border-dashed border-[#111F35]/20 text-[#111F35] font-bold rounded-xl hover:border-[#111F35] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Another Range
                </button>
            )}
        </div>
    );
}
