import { ProductList } from '@/components/products/ProductList'
import { initialData } from '@/seed/seed-data'

export default function ShopPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Todos los Productos</h1>
      
      <ProductList products={initialData.products} />
    </div>
  )
}
