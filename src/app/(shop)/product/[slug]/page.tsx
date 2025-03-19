'use client'
import { use } from 'react';
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

  if (!product) {
    notFound();
  }

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
            selectedSize={product.sizes[0]}
            availableSizes={product.sizes}
          />
        </div>

        {/* Selector de Cantidad */}
        <div className="mb-5">
          <h3 className="font-bold mb-4">Cantidad</h3>
          <QuantitySelector
            quantity={2}
            maxQuantity={product.inStock}
            onQuantityChange={() => { }}
          />
        </div>

        {/* Botón Agregar al Carrito */}
        
        {product.inStock > 0 &&

          <button
            className="btn-primary mb-5"
            disabled={product.inStock === 0}
          >
            <IoCartOutline size={20} />
            Agregar al Carrito
          </button>
        }
                <div className="flex items-center mt-5 mb-3">
          <IoCheckmarkCircleOutline className="text-green-500 mr-2 text-xl" />
          <span className="text-sm">
            {product.inStock > 0
              ? 'Disponible para envío inmediato'
              : 'Temporalmente agotado'
            }
          </span>
        </div>

        {/* Descripción */}
        <h3 className="font-bold mb-2">Descripción</h3>
        <p className="mb-5">{product.description}</p>

        {/* Características del Producto */}
        {/* <div className="mb-5">
          <h3 className="font-bold mb-2">Características</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Género: <span className="capitalize">{
              product.gender === 'men' ? 'Hombre' :
                product.gender === 'women' ? 'Mujer' :
                  product.gender === 'kid' ? 'Niño' : 'Unisex'
            }</span></li>
            <li>Tipo: <span className="capitalize">{
              product.type === 'shirt' ? 'Camiseta' :
                product.type === 'pants' ? 'Pantalón' :
                  product.type === 'shoes' ? 'Calzado' : 'Accesorio'
            }</span></li>
            <li>Disponibles: {product.inStock} unidades</li>
          </ul>
        </div> */}

        {/* PayPal Button */}
        {/* <div className="mt-5 mb-2">
          <h3 className="font-bold mb-2">Pagar con PayPal</h3>
          <PayPalButton 
            amount={product.price}
            onSuccess={() => {
              console.log('Pago realizado con éxito');
            }}
          />
        </div> */}

        {/* Información Adicional */}


        {/* Etiquetas */}
        {/* <div className="mt-5">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
