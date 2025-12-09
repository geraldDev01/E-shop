'use client'
import { ProductList } from '@/components/products/ProductList'
import imageTest from '@/assets/image.png'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { getCategories } from '@/api/categories'

interface Category {
  id: number;
  description: string;
}

function ShopContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryId)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      const result = await getCategories()
      if (result.success) {
        setCategories(result.categories)
      }
      setLoadingCategories(false)
    }
    loadCategories()
  }, [])

  return (
    <div className="px-0 sm:px-0 lg:px-0 py-0 min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 mb-10 overflow-hidden">
        <Image
          src={imageTest}
          alt="Shop Banner"
          fill
          className="object-cover object-center opacity-60"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10" />
        <div className="relative z-20 text-center w-full flex flex-col items-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-2xl">
            Descubre tu Estilo
          </h1>
          <p className="text-lg md:text-xl text-white/95 mb-6 drop-shadow-lg max-w-2xl">
            Las mejores prendas, precios irresistibles y envíos rápidos
          </p>
          <a
            href="#products"
            className="inline-block bg-[#d64d04] text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:bg-orange-600 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Ver Productos
          </a>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <section className="container mx-auto px-0 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Category Filter Bar */}
        <div className="relative w-full md:w-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#ffe6d4] scrollbar-track-transparent px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg sticky top-0 z-20 border border-gray-200/50">
            <button
              className={`px-5 py-2 rounded-full border font-semibold transition-all duration-200 whitespace-nowrap ${!activeCategory ? 'bg-[#d64d04] text-white border-[#d64d04] shadow-lg scale-105' : 'bg-white border-gray-200 text-gray-700 hover:bg-[#fff3ea]'}`}
              onClick={() => {
                setActiveCategory(null)
                router.push('/')
              }}
            >
              Ver Todo
            </button>
            {loadingCategories ? (
              <span className="text-gray-400 px-4 py-2">Cargando...</span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`px-5 py-2 rounded-full border font-semibold transition-all duration-200 whitespace-nowrap ${activeCategory === String(cat.id) ? 'bg-[#d64d04] text-white border-[#d64d04] shadow-lg scale-105' : 'bg-white border-gray-200 text-gray-700 hover:bg-[#fff3ea]'}`}
                  onClick={() => {
                    setActiveCategory(String(cat.id))
                    router.push(`/?categoryId=${cat.id}`)
                  }}
                >
                  {cat.description}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="px-4 md:px-0 mt-4 md:mt-0">
          <div className="relative">
            <select
              className="appearance-none w-full px-6 py-3 rounded-full border-2 border-gray-200 bg-white text-gray-900 text-lg font-medium shadow-sm focus:border-[#d64d04] focus:ring-2 focus:ring-[#ffe6d4] transition-all pr-10"
              style={{ minWidth: '240px' }}
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: Menor a mayor</option>
              <option value="price-desc">Precio: Mayor a menor</option>
              <option value="name">Nombre</option>
            </select>
            {/* Custom arrow icon */}
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="container mx-auto px-4">
        <ProductList categoryId={activeCategory} />
      </section>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  )
}
