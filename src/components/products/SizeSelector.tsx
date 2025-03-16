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
            hover:bg-gray-100 text-center rounded-md min-w-12 px-3 py-2
            ${selectedSize === size 
              ? 'bg-primary-950 text-white hover:bg-primary-900' 
              : 'bg-gray-50'}
          `}
        >
          {size}
        </button>
      ))}
    </div>
  );
}; 