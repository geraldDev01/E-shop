'use client'

import { ValidSizes } from "@/interfaces";

interface Props {
  selectedSize?: ValidSizes;
  availableSizes: ValidSizes[];
}

export const SizeSelector = ({ selectedSize, availableSizes }: Props) => {
  return (
    <div className="flex gap-2">
      {availableSizes.map((size) => (
        <button
          key={size}
          className={`
            text-center rounded-md min-w-12 px-3 py-2
            ${selectedSize === size 
              ? 'bg-[#d64d04] hover:bg-[#ff7c30]' 
              : 'bg-gray-50'}
          `}
        >
          {size}
        </button>
      ))}
    </div>
  );
}; 