'use client'

import { useMemo } from 'react'
import { IoPersonCircleOutline } from 'react-icons/io5'

interface AvatarProps {
  name?: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'navbar' | 'profile'
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-20 h-20 text-2xl',
  xl: 'w-28 h-28 text-3xl',
}

// Generate gradient colors based on name
const getGradientColors = (name: string): string => {
  const colors = [
    'from-orange-400 to-red-500',
    'from-blue-400 to-purple-500',
    'from-green-400 to-teal-500',
    'from-pink-400 to-rose-500',
    'from-indigo-400 to-blue-500',
    'from-yellow-400 to-orange-500',
    'from-cyan-400 to-blue-500',
    'from-violet-400 to-purple-500',
  ]
  
  // Use name to consistently pick a color
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

// Get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export const Avatar = ({
  name = 'Usuario',
  src,
  size = 'md',
  className = '',
  variant = 'navbar',
}: AvatarProps) => {
  const initials = useMemo(() => getInitials(name), [name])
  const gradient = useMemo(() => getGradientColors(name), [name])
  const sizeClass = sizeClasses[size]

  // For profile variant, use icon placeholder if no image
  if (variant === 'profile' && !src) {
    return (
      <div className={`${sizeClass} ${className} relative`}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-lg border-4 border-white">
          <IoPersonCircleOutline className="w-full h-full text-orange-400" />
        </div>
      </div>
    )
  }

  // For navbar variant or when we have an image, use gradient with initials
  if (!src || variant === 'navbar') {
    return (
      <div className={`${sizeClass} ${className} relative`}>
        <div
          className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold shadow-md`}
        >
          {initials}
        </div>
      </div>
    )
  }

  // If we have an image source, try to use it (with fallback)
  return (
    <div className={`${sizeClass} ${className} relative`}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
        {/* Image would go here if we implement image loading */}
        <div
          className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold`}
        >
          {initials}
        </div>
      </div>
    </div>
  )
}



