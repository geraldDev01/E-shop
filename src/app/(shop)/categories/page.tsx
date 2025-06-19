'use client'
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { getCategories } from '@/api/categories'
import Link from 'next/link'
import { 
  IoShirtOutline, 
  IoFootstepsOutline,
  IoBaseballOutline,
  IoStorefrontOutline,
  IoArrowForwardOutline
} from 'react-icons/io5'

interface Category {
  id: number;
  description: string;
}

// Map category names to icons (larger for new design)
const getCategoryIcon = (description: string): ReactElement => {
  const icons: { [key: string]: ReactElement } = {
    'Camisa': <IoShirtOutline className="w-14 h-14 text-[#d64d04]" />,
    'Zapatos': <IoFootstepsOutline className="w-14 h-14 text-[#d64d04]" />,
    'Gorras': <IoBaseballOutline className="w-14 h-14 text-[#d64d04]" />,
    'Pantalon': <IoShirtOutline className="w-14 h-14 text-[#d64d04]" />,
  }
  return icons[description] || <IoStorefrontOutline className="w-14 h-14 text-[#d64d04]" />
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      const result = await getCategories()
      if (result.success) {
        setCategories(result.categories)
      }
      setIsLoading(false)
    }

    loadCategories()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
    </div>
  }

  if (!categories.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <IoStorefrontOutline className="w-24 h-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No hay categorías disponibles
          </h2>
          <p className="text-gray-600 max-w-md mb-6">
            En este momento no hay categorías para mostrar. Por favor, vuelve más tarde.
          </p>
          <Link 
            href="/"
            className="btn-primary inline-flex items-center gap-2"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Categorías</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Link 
            href={`/?categoryId=${category.id}`} 
            key={category.id}
            className="group"
          >
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-[#d64d04]/40">
              <div className="flex flex-col items-center justify-between gap-4 p-8">
                <div className="transition-transform group-hover:scale-110">
                  {getCategoryIcon(category.description)}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 group-hover:text-[#d64d04] transition-colors text-center">
                  {category.description}
                </h2>
                <p className="text-gray-600 text-center text-base min-h-[40px]">
                  Explora nuestra colección de {category.description.toLowerCase()}
                </p>
                <button
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#d64d04] text-white font-semibold shadow hover:bg-orange-600 transition text-base group-hover:scale-105"
                  tabIndex={-1}
                >
                  Ver productos <IoArrowForwardOutline className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}