'use client'

import { useState } from 'react';
import Image from 'next/image';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

interface Props {
  images: string[];
  title: string;
}

export const ProductSlideshow = ({ images, title }: Props) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage(current => 
      current === images.length - 1 ? 0 : current + 1
    );
  };

  const previousImage = () => {
    setCurrentImage(current => 
      current === 0 ? images.length - 1 : current - 1
    );
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3] relative overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[currentImage]}
          alt={`${title} - ${currentImage + 1}`}
          className="object-cover object-center transition-opacity duration-300"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={currentImage === 0}
        />

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button 
            onClick={previousImage}
            className="p-2 rounded-full bg-white/70 hover:bg-white/90 transition-colors shadow-md"
            aria-label="Previous image"
          >
            <IoChevronBackOutline size={24} />
          </button>
          <button 
            onClick={nextImage}
            className="p-2 rounded-full bg-white/70 hover:bg-white/90 transition-colors shadow-md"
            aria-label="Next image"
          >
            <IoChevronForwardOutline size={24} />
          </button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-white/70 px-2 py-1 rounded-md text-sm">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrentImage(index)}
            className={`
              aspect-square relative rounded-lg overflow-hidden cursor-pointer
              transition-all duration-200
              ${currentImage === index 
                ? 'ring-2 ring-primary-950 opacity-100' 
                : 'opacity-60 hover:opacity-100'}
            `}
          >
            <Image
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              className="object-cover object-center"
              fill
              sizes="(max-width: 768px) 25vw, 15vw"
            />
          </div>
        ))}
      </div>

      {/* Touch Swipe Area for Mobile */}
      <div 
        className="absolute inset-0 md:hidden"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          const startX = touch.clientX;
          
          const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const diff = startX - touch.clientX;
            
            if (Math.abs(diff) > 50) { // minimum swipe distance
              if (diff > 0) {
                nextImage();
              } else {
                previousImage();
              }
              document.removeEventListener('touchmove', handleTouchMove);
            }
          };
          
          document.addEventListener('touchmove', handleTouchMove, { once: true });
        }}
      />

      {/* Keyboard Navigation */}
      <div 
        className="hidden"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') previousImage();
          if (e.key === 'ArrowRight') nextImage();
        }}
      />
    </div>
  );
}; 