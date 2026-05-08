'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const CATEGORIES = ['ALL', 'TURF', 'CRICKET', 'FOOTBALL', 'BADMINTON', 'EVENTS', 'SNOOKER'];

export function HomeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  useEffect(() => {
    // Only update if changed by user interactions
    const params = new URLSearchParams(searchParams.toString());
    
    if (category && category !== 'ALL') {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }

    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  }, [category, minPrice, maxPrice, router, searchParams]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Category Pills */}
      <div className="flex flex-nowrap md:flex-wrap overflow-x-auto w-full md:w-auto justify-start md:justify-center gap-2.5 pb-2 md:pb-0 px-4 sm:px-2 md:px-0 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat)}
            className={`snap-center whitespace-nowrap shrink-0 px-5 md:px-6 py-2 md:py-2.5 rounded-full border transition-all font-medium text-xs md:text-sm ${
              category === cat 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50 text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Price Range */}
      <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.03] border border-white/10 rounded-full px-3 sm:px-4 py-2 w-full md:w-auto justify-center mx-auto max-w-[300px]">
        <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap hidden sm:inline">Price Range (₹):</span>
        <span className="text-xs text-gray-400 sm:hidden">₹</span>
        <input 
          type="number" 
          placeholder="Min" 
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-16 sm:w-20 bg-transparent border-b border-white/20 focus:border-blue-500 outline-none text-xs sm:text-sm text-center px-1 placeholder:text-gray-600"
        />
        <span className="text-gray-500 px-1">-</span>
        <input 
          type="number" 
          placeholder="Max" 
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-16 sm:w-20 bg-transparent border-b border-white/20 focus:border-blue-500 outline-none text-xs sm:text-sm text-center px-1 placeholder:text-gray-600"
        />
      </div>
    </div>
  );
}
