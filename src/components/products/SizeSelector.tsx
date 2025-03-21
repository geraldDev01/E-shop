'use client'

import { ValidSizes } from "@/interfaces";

interface Props {
  selectedSize: string;
  availableSizes: string[];
  onSizeChange: (size: string) => void;
}

export const SizeSelector = ({ selectedSize, availableSizes, onSizeChange }: Props) => {
  return (
    <div className="flex gap-2">
      {availableSizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeChange(size)}
          className={`hover:underline text-lg w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all
            ${selectedSize === size 
              ? 'border-[#d64d04] bg-[#d64d04] text-white' 
              : 'border-gray-300 hover:border-[#d64d04]'
            }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}; 