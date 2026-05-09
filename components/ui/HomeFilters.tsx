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
  const initialMinRating = searchParams.get('minRating') || '';
  const initialSports = searchParams.get('sports') || '';
  const initialAmenities = searchParams.get('amenities') || '';

  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [sports, setSports] = useState(initialSports);
  const [amenities, setAmenities] = useState(initialAmenities);

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

    if (minRating) {
        params.set('minRating', minRating);
    } else {
        params.delete('minRating');
    }

    if (sports) {
        params.set('sports', sports);
    } else {
        params.delete('sports');
    }

    if (amenities) {
        params.set('amenities', amenities);
    } else {
        params.delete('amenities');
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  }, [category, minPrice, maxPrice, minRating, sports, amenities, router, searchParams]);

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

      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-4xl px-4">
        {/* Price Range */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.03] border border-white/10 rounded-full px-3 sm:px-4 py-2 flex-grow-0 shrink-0">
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

        {/* Min Rating */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.03] border border-white/10 rounded-full px-3 sm:px-4 py-2 shrink-0">
            <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Min Rating:</span>
            <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-gray-600"
            >
                <option className="text-black" value="">Any</option>
                <option className="text-black" value="3">3+ Stars</option>
                <option className="text-black" value="4">4+ Stars</option>
                <option className="text-black" value="4.5">4.5+ Stars</option>
            </select>
        </div>

        {/* Sports Supported */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.03] border border-white/10 rounded-full px-3 sm:px-4 py-2 flex-grow shrink max-w-[200px]">
            <input 
            type="text" 
            placeholder="Sport (e.g. Football)" 
            value={sports}
            onChange={(e) => setSports(e.target.value)}
            className="w-full bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-gray-600"
            />
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.03] border border-white/10 rounded-full px-3 sm:px-4 py-2 flex-grow shrink max-w-[200px]">
            <input 
            type="text" 
            placeholder="Amenity (e.g. Parking)" 
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            className="w-full bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-gray-600"
            />
        </div>
      </div>
    </div>
  );
}
