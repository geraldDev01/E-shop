'use client'
import { use, useState } from 'react';
import { initialData } from "@/seed/seed-data";
import { notFound } from "next/navigation";
import { IoCheckmarkCircleOutline, IoCartOutline } from "react-icons/io5";

// Import all components from the barrel file
import {
  ProductSlideshow,
  SizeSelector,
  QuantitySelector,
  // PayPalButton 
} from "@/components/products";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const product = initialData.products.find(product => product.slug === slug);

  // Add state for size and quantity
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);

  if (!product) {
    notFound();
  }

  // Handler for size change
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false); // Clear error when size is selected
  };

  // Handler for quantity change
  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, Math.min(value, product.inStock)));
  };

  // Handler for adding to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }

    // Here you would add the logic to add to cart
    console.log({
      // productId: product.id,
      size: selectedSize,
      quantity,
      name: product.title,
      price: product.price,
    });
  };

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">
        <ProductSlideshow
          images={product.images}
          title={product.title}
        />
      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5">
        <h1 className="text-xl font-bold">{product.title}</h1>
        <p className="text-lg mb-5">${product.price.toFixed(2)}</p>

        {/* Selector de Tallas */}
        <div className="mb-5">
          <h3 className="font-bold mb-4">Tallas Disponibles</h3>
          <SizeSelector
            selectedSize={selectedSize}
            availableSizes={product.sizes}
            onSizeChange={handleSizeChange}
          />
          {showSizeError && (
            <p className="text-red-500 text-sm mt-2">
              * Por favor seleccione una talla
            </p>
          )}
        </div>

        {/* Selector de Cantidad */}
        <div className="mb-5">
          <h3 className="font-bold mb-4">Cantidad</h3>
          <QuantitySelector
            quantity={quantity}
            maxQuantity={product.inStock}
            onQuantityChange={handleQuantityChange}
          />
        </div>

        {/* Botón Agregar al Carrito */}
        {product.inStock > 0 ? (
          <button
            className="btn-primary mb-5 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={product.inStock === 0}
            onClick={handleAddToCart}
          >
            <IoCartOutline size={20} />
            Agregar al Carrito
          </button>
        ) : (
          <button
            className="btn-primary mb-5 w-full opacity-50 cursor-not-allowed"
            disabled
          >
            <span>No Disponible</span>
          </button>
        )}

        <div className="flex items-center mt-5 mb-3">
          <IoCheckmarkCircleOutline 
            className={`mr-2 text-xl ${
              product.inStock > 0 ? 'text-green-500' : 'text-red-500'
            }`} 
          />
          <span className="text-sm">
            {product.inStock > 0
              ? `${product.inStock} unidades disponibles`
              : 'Temporalmente agotado'
            }
          </span>
        </div>

        {/* Descripción */}
        <h3 className="font-bold mb-2">Descripción</h3>
        <p className="mb-5">{product.description}</p>

      
      </div>
    </div>
  );
}
