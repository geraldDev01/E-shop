import { SeedProduct } from '@/interfaces'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  product: SeedProduct
}

export const ProductCard = ({ product }: Props) => {
  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          {/* Main Image */}
          <Image
            src={product.images[0]}
            alt={product.title}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Stock Badge */}
          {product.inStock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              Agotado
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1">
          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </p>

            {/* Sizes */}
            <div className="flex gap-1">
              {product.sizes.slice(0, 3).map((size) => (
                <span
                  key={size}
                  className="text-xs px-1.5 py-0.5 bg-gray-100 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                  +{product.sizes.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Gender Tag */}
          <span className="inline-block text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
            {product.gender}
          </span>
        </div>
      </Link>
    </div>
  )
} 