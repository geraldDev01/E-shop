'use client'
import { useEffect, useState } from 'react';
import { Product } from '@/api/products';
import { ProductCard } from './ProductCard';
import { getProducts } from '@/api/products';

interface ProductListProps {
  categoryId?: string | null;
}

export const ProductList = ({ categoryId }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const result = await getProducts();
      if (result.success) {
        setProducts(result.products);
      }
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const filteredProducts = categoryId
    ? products.filter(product => String(product.id_clasificaion) === String(categoryId))
    : products;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}; 