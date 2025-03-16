import { SeedProduct } from '@/interfaces'
import { ProductCard } from './ProductCard'

interface Props {
  products: SeedProduct[]
}

export const ProductList = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
      {
        products.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))
      }
    </div>
  )
} 