"use client"
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  IoCartOutline, 
  IoMenuOutline, 
  IoCloseOutline, 
  IoLogOutOutline, 
  IoPersonOutline,
  IoHomeOutline,
  IoGridOutline,
  IoChevronDownOutline
} from 'react-icons/io5'
import { useAuth } from '@/context/auth/AuthContext'
import { useCart } from '@/context/cart/CartContext'

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:text-gray-600 transition-colors"
      >
        <div className="w-8 h-8 bg-[#d64d04] rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {user?.profile?.full_name.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <span className="hidden md:block">{user?.profile?.full_name || 'Usuario'}</span>
        <IoChevronDownOutline className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-fade-in">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#d64d04] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <IoPersonOutline className="w-5 h-5" />
            <span>Mi Perfil</span>
          </Link>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#d64d04] transition-colors"
          >
            <IoLogOutOutline className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const { cartItemsCount } = useCart()

  const navLinks = [
    { href: "/", label: "Inicio", icon: IoHomeOutline },
    { href: "/categories", label: "Categorías", icon: IoGridOutline },
  ];

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href}
              href={href} 
              className="flex items-center gap-2 hover:text-[#d64d04] transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
          
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link 
              href="/auth/login" 
              className="flex items-center gap-2 hover:text-[#d64d04] transition-colors"
            >
              <IoPersonOutline className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </Link>
          )}

          <Link href="/cart">
            <div className="relative">
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-[#d64d04] rounded-full">
                {parseInt(cartItemsCount)}
              </span>
              <IoCartOutline className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart">
            <div className="relative">
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-[#d64d04] rounded-full">
                {parseInt(cartItemsCount)}
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

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 py-3 space-y-4">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href}
              href={href} 
              className="flex items-center gap-2 hover:text-[#d64d04] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link 
                href="/profile" 
                className="flex items-center gap-2 hover:text-[#d64d04] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <IoPersonOutline className="w-5 h-5" />
                <span>Mi Perfil</span>
              </Link>
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 hover:text-[#d64d04] transition-colors w-full"
              >
                <IoLogOutOutline className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <Link 
              href="/auth/login" 
              className="flex items-center gap-2 hover:text-[#d64d04] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <IoPersonOutline className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar