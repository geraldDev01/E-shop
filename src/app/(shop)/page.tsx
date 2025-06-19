import { ProductList } from '@/components/products/ProductList'
import imageTest from '@/assets/image.png'
import Image from 'next/image'

export default function ShopPage() {
  return (
    <div className="px-0 sm:px-0 lg:px-0 py-0 bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center bg-gradient-to-r from-[#fff7f0] to-[#f7f7fa] mb-10 overflow-hidden">
        <Image
          src={imageTest}
          alt="Shop Banner"
          fill
          className="object-cover object-center opacity-80"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 text-center w-full flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Descubre tu Estilo
          </h1>
          <p className="text-lg md:text-xl text-white mb-6 drop-shadow">
            Las mejores prendas, precios irresistibles y envíos rápidos
          </p>
          <a
            href="#products"
            className="inline-block bg-[#d64d04] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-orange-600 transition"
          >
            Ver Productos
          </a>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <section className="container mx-auto px-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#fff3ea] transition">Camisas</button>
          <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#fff3ea] transition">Pantalones</button>
          <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#fff3ea] transition">Abrigos</button>
          <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#fff3ea] transition">Ver Todo</button>
        </div>
        <div>
          <select className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 focus:outline-none">
            <option value="newest">Más recientes</option>
            <option value="price-asc">Precio: Menor a mayor</option>
            <option value="price-desc">Precio: Mayor a menor</option>
            <option value="name">Nombre</option>
          </select>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="container mx-auto px-4">
        <ProductList />
      </section>
    </div>
  )
}
