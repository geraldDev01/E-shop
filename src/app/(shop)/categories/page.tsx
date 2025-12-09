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
    'Camisas': <IoShirtOutline className="w-16 h-16 text-[#d64d04]" />,
    'Zapatos': <IoFootstepsOutline className="w-16 h-16 text-[#d64d04]" />,
    'Gorras': <IoBaseballOutline className="w-16 h-16 text-[#d64d04]" />,
    'Pantalon': <IoShirtOutline className="w-16 h-16 text-[#d64d04]" />,
  }
  return icons[description]
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
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
      </div>
    )
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Nuestras Categorías
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explora nuestra amplia selección de productos organizados por categorías
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Link 
            href={`/?categoryId=${category.id}`} 
            key={category.id}
            className="group block"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative overflow-hidden card rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#d64d04]/30 h-full">
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-100/0 group-hover:from-orange-50/50 group-hover:to-orange-100/50 transition-all duration-500 z-0" />
              
              <div className="relative z-10 flex flex-col items-center justify-between gap-6 p-8 min-h-[280px]">
                {/* Icon Container */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    {getCategoryIcon(category.description)}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#d64d04] transition-colors">
                    {category.description}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Explora nuestra colección de {category.description.toLowerCase()}
                  </p>
                </div>
                
                {/* CTA Button */}
                <button
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d64d04] to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group-hover:from-[#d64d04] group-hover:to-orange-500"
                  tabIndex={-1}
                >
                  Ver productos 
                  <IoArrowForwardOutline className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}