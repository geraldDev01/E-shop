'use client'
import Link from 'next/link'
import { IoHomeOutline } from 'react-icons/io5'
import './not-found.css'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c0b38] to-[#161469]">
      <div className="text-center px-4">
        {/* Animated 404 */}
        <h1 className="text-[150px] sm:text-[200px] font-bold leading-tight animate-[pulse_2s_ease-in-out_infinite] bg-gradient-to-r from-[#d64d04] to-[#ff7c30] bg-clip-text text-transparent">
          404
        </h1>

        {/* Error Messages */}
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#ff9e6a]">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-[#ffaf87] max-w-md mx-auto">
            Parece que te has perdido en el espacio. La página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Back to Home Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-[#d64d04] text-white px-6 py-3 rounded-full
            transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#d64d04]/20 
            hover:bg-[#ff7c30]"
        >
          <IoHomeOutline className="text-xl" />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  )
} 