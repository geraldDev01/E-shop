"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { IoCartOutline } from 'react-icons/io5'
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm shadow-[#d64e044e] border-b border-[#d64d04]">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="font-medium">
                    <Link href="/">
                        <h1 className="text-xl sm:text-2xl">
                            <strong className='text-[#d64d04]'>MOMBA</strong> - SHOP
                        </h1>
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="hover:text-gray-600">
                        Inicio
                    </Link>
                    <Link href="/category" className="hover:text-gray-600">
                        Categorías
                    </Link>
                    <Link href="/contact" className="hover:text-gray-600">
                        Contactenos
                    </Link>
                    <Link href="/cart">
                        <div className="relative">
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-[#d64d04] rounded-full">
                                3
                            </span>
                            <IoCartOutline className="w-6 h-6" />
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-4 md:hidden">
                    <Link href="/cart">
                        <div className="relative">
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-[#d64d04] rounded-full">
                                3
                            </span>
                            <IoCartOutline className="w-6 h-6" />
                        </div>
                    </Link>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-600"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen 
                            ? <IoCloseOutline className="w-7 h-7" />
                            : <IoMenuOutline className="w-7 h-7" />
                        }
                    </button>
                </div>
            </nav>
            <div 
                className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
            >
                <div className="px-4 py-3 space-y-4">
                    <Link 
                        href="/" 
                        className="block hover:text-gray-600"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Inicio
                    </Link>
                    <Link 
                        href="/category" 
                        className="block hover:text-gray-600"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Categorías
                    </Link>
        
                    <Link 
                        href="/contact" 
                        className="block hover:text-gray-600"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contactenos
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Navbar