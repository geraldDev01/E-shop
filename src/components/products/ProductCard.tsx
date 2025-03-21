import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/api/products'

interface Props {
  product: Product
}

export const ProductCard = ({ product }: Props) => {
  // Calculate total stock with safety check
  const getTotalStock = () => {
    if (!product.presentations || !Array.isArray(product.presentations)) {
      return 0;
    }
    return product.presentations.reduce((total, p) => 
      total + (parseInt(p.quantity) || 0), 0
    );
  };

  return (
    <Link 
      href={`/product/${product.id}`}
      className="group cursor-pointer"
    >
      <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-[3/4]">
          <Image
            src={product.img_url}
            alt={product.name}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-4">
          <span className="text-xs text-gray-500 mb-1 block">
            {product.clasification}
          </span>
          <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-[#d64d04] transition-colors">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg text-[#d64d04]">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <span className="text-sm text-gray-500">
              {getTotalStock()} disponibles
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
} 