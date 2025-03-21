interface Size {
  presentation_id: number;
  presentation_description: string;
  quantity: string;
}

interface Props {
  sizes: Size[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export const SizeSelector = ({ sizes, selectedSize, onSizeChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const stock = parseInt(size.quantity);
        return (
          <button
            key={size.presentation_id}
            onClick={() => onSizeChange(size.presentation_description)}
            disabled={stock === 0}
            className={`
              w-12 h-12 rounded-full border-2 flex items-center justify-center
              transition-all text-center
              ${stock === 0 
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : selectedSize === size.presentation_description
                  ? 'border-[#d64d04] bg-[#d64d04] text-white'
                  : 'border-gray-300 hover:border-[#d64d04]'
              }
            `}
          >
            <span className="text-sm font-medium">
              {size.presentation_description}
            </span>
          </button>
        );
      })}
    </div>
  );
};