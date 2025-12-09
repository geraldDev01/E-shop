import Link from 'next/link'
import { Product } from '@/api/products'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

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

  const totalStock = getTotalStock()
  const isInStock = totalStock > 0

  return (
    <Link 
      href={`/product/${product.id}`}
      className="group cursor-pointer block"
    >
      <div className="card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-[#d64d04]/20">
        {/* Image Container with Overlay */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <ImageWithFallback
            src={product.img_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Stock Badge */}
          {!isInStock && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Agotado
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {product.clasification}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#d64d04] transition-colors line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          
          <div className="flex justify-between items-end pt-2 border-t border-gray-200">
            <div>
              <p className="font-extrabold text-2xl text-[#d64d04]">
                ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                isInStock 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {isInStock ? `${totalStock} disponibles` : 'Sin stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 