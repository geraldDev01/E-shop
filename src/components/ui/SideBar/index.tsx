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
  IoMailOutline,
  IoChevronDownOutline
} from 'react-icons/io5'
import { useAuth } from '@/context/auth/AuthContext'
import { useCart } from '@/context/cart/CartContext'


const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const { cartItemsCount } = useCart()

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: IoHomeOutline },
    { href: "/admin/users", label: "Usuarios", icon: IoGridOutline },
    { href: "/admin/customers", label: "Clientes", icon: IoMailOutline },
    { href: "/admin/inventory/categories", label: "Categorias", icon: IoHomeOutline },
    { href: "/admin/inventory/presentations", label: "Presentaciones", icon: IoGridOutline },
    { href: "/admin/inventory", label: "Productos", icon: IoGridOutline },
    { href: "/admin/orders", label: "Historial Ordenes", icon: IoHomeOutline },
    { href: "/admin/departments", label: "Departamentos", icon: IoGridOutline },
    { href: "/admin/fees", label: "Tarifas", icon: IoGridOutline },

  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-lg font-bold">Inventario</div>
      <nav className="flex-1">
        <ul>

          {
            navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="block p-4 hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))
          }

 
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar