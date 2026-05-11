'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const CATEGORIES = ['ALL', 'TURF', 'CRICKET', 'FOOTBALL', 'BADMINTON', 'EVENTS', 'SNOOKER'];
const SPORTS = ['Football', 'Cricket', 'Badminton', 'Volleyball', 'Tennis'];
const FACILITIES = ['Parking', 'Flood Lights', 'Washroom', 'Drinking Water', 'Seating Area', 'Changing Room'];

export function HomeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialMinRating = searchParams.get('minRating') || '';
  const initialSport = searchParams.get('sport') || '';
  const initialFacility = searchParams.get('facility') || '';

  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [sport, setSport] = useState(initialSport);
  const [facility, setFacility] = useState(initialFacility);

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

    if (sport) {
      params.set('sport', sport);
    } else {
      params.delete('sport');
    }

    if (facility) {
      params.set('facility', facility);
    } else {
      params.delete('facility');
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  }, [category, minPrice, maxPrice, minRating, sport, facility, router, searchParams]);

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

      {/* Advanced Filters Container */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-4xl px-4">
        {/* Price Range */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.03] border border-white/10 rounded-full px-3 sm:px-4 py-2">
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
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-3 py-2">
          <span className="text-xs sm:text-sm text-gray-400">Min Rating:</span>
          <select 
            value={minRating} 
            onChange={(e) => setMinRating(e.target.value)}
            className="bg-transparent text-white text-xs sm:text-sm outline-none cursor-pointer appearance-none px-1"
          >
            <option value="" className="bg-[#0B0F1A]">Any</option>
            <option value="3" className="bg-[#0B0F1A]">3+ Stars</option>
            <option value="4" className="bg-[#0B0F1A]">4+ Stars</option>
            <option value="4.5" className="bg-[#0B0F1A]">4.5+ Stars</option>
          </select>
        </div>

        {/* Sports */}
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-3 py-2">
          <span className="text-xs sm:text-sm text-gray-400">Sport:</span>
          <select 
            value={sport} 
            onChange={(e) => setSport(e.target.value)}
            className="bg-transparent text-white text-xs sm:text-sm outline-none cursor-pointer appearance-none px-1"
          >
            <option value="" className="bg-[#0B0F1A]">Any Sport</option>
            {SPORTS.map(s => <option key={s} value={s} className="bg-[#0B0F1A]">{s}</option>)}
          </select>
        </div>

        {/* Facilities */}
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-3 py-2">
          <span className="text-xs sm:text-sm text-gray-400">Amenity:</span>
          <select 
            value={facility} 
            onChange={(e) => setFacility(e.target.value)}
            className="bg-transparent text-white text-xs sm:text-sm outline-none cursor-pointer appearance-none px-1"
          >
            <option value="" className="bg-[#0B0F1A]">Any Amenity</option>
            {FACILITIES.map(f => <option key={f} value={f} className="bg-[#0B0F1A]">{f}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
