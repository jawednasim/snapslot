'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const CATEGORIES = ['ALL', 'TURF', 'CRICKET', 'FOOTBALL', 'BADMINTON', 'EVENTS', 'SNOOKER'];
const SPORTS = ['Football', 'Cricket', 'Badminton', 'Tennis', 'Squash', 'Snooker', 'Table Tennis'];
const AMENITIES = ['Parking', 'Washroom', 'Changing Room', 'Flood Lights', 'Water', 'CCTV'];

export function HomeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialMinRating = searchParams.get('minRating') || '';
  const initialSport = searchParams.get('sport') || '';
  const initialAmenity = searchParams.get('amenity') || '';

  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [sport, setSport] = useState(initialSport);
  const [amenity, setAmenity] = useState(initialAmenity);

  useEffect(() => {
    // Only update if changed by user interactions
    const params = new URLSearchParams(searchParams.toString());
    
    if (category && category !== 'ALL') {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    if (minRating) params.set('minRating', minRating);
    else params.delete('minRating');

    if (sport) params.set('sport', sport);
    else params.delete('sport');

    if (amenity) params.set('amenity', amenity);
    else params.delete('amenity');

    router.push(`/?${params.toString()}`, { scroll: false });
  }, [category, minPrice, maxPrice, minRating, sport, amenity, router, searchParams]);

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

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-4xl px-4">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-3 py-2">
            <input 
              type="number" 
              placeholder="Min ₹" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-16 bg-transparent border-b border-white/20 focus:border-blue-500 outline-none text-xs text-center px-1 placeholder:text-gray-600"
            />
            <span className="text-gray-500 text-xs">-</span>
            <input 
              type="number" 
              placeholder="Max ₹" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-16 bg-transparent border-b border-white/20 focus:border-blue-500 outline-none text-xs text-center px-1 placeholder:text-gray-600"
            />
          </div>

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-full px-3 py-2 outline-none text-xs text-gray-300 focus:border-blue-500 [&>option]:text-black"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>

          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-full px-3 py-2 outline-none text-xs text-gray-300 focus:border-blue-500 [&>option]:text-black"
          >
            <option value="">All Sports</option>
            {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={amenity}
            onChange={(e) => setAmenity(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-full px-3 py-2 outline-none text-xs text-gray-300 focus:border-blue-500 [&>option]:text-black"
          >
            <option value="">All Amenities</option>
            {AMENITIES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
      </div>
    </div>
  );
}
