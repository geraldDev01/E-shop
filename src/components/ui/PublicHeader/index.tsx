'use client';

import Link from 'next/link';

export const PublicHeader = () => {
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
      </nav>
    </header>
  );
};