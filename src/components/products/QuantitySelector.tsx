'use client'

interface Props {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, maxQuantity, onQuantityChange }: Props) => {

  const onValueChange = (value: number) => {
    if (value < 1) return;
    if (value > maxQuantity) return;
    onQuantityChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        className="btn-secondary px-3"
        onClick={() => onValueChange(quantity - 1)}
        disabled={quantity <= 1}
      >
        -
      </button>

      <span className="w-20 text-center">
        {quantity}
      </span>

      <button 
        className="btn-secondary px-3"
        onClick={() => onValueChange(quantity + 1)}
        disabled={quantity >= maxQuantity}
      >
        +
      </button>

      {/* Max quantity indicator */}
      <span className="text-xs text-gray-500 ml-2">
        (Máx: {maxQuantity})
      </span>
    </div>
  );
}; 