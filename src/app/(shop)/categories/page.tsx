'use client'
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { getCategories } from '@/api/categories'
import Link from 'next/link'
import { 
  IoShirtOutline, 
  IoFootstepsOutline,
  IoBaseballOutline,
  IoStorefrontOutline 
} from 'react-icons/io5'

interface Category {
  id: number;
  description: string;
}

// Map category names to icons
const getCategoryIcon = (description: string): ReactElement => {
  const icons: { [key: string]: ReactElement } = {
    'Camisa': <IoShirtOutline className="w-8 h-8" />,
    'Zapatos': <IoFootstepsOutline className="w-8 h-8" />,
    'Gorras': <IoBaseballOutline className="w-8 h-8" />,
    'Pantalon': <IoShirtOutline className="w-8 h-8" />,
  }
  return icons[description] || <IoStorefrontOutline className="w-8 h-8" />
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Categorías</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            href={`/category/${category.id}`} 
            key={category.id}
            className="group"
          >
            <div className="relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#d64d04] transform origin-left scale-x-0 transition-transform group-hover:scale-x-100"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[#d64d04] transition-transform group-hover:scale-110">
                    {getCategoryIcon(category.description)}
                  </div>
                  <div className="bg-[#d64d04] bg-opacity-10 rounded-full px-3 py-1">
                    <span className="text-sm text-white font-medium">
                      Ver productos
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#d64d04] transition-colors">
                  {category.description}
                </h2>
                <p className="mt-2 text-gray-600 text-sm">
                  Explora nuestra colección de {category.description.toLowerCase()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}