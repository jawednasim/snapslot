'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Settings2, X, Star as StarIcon } from 'lucide-react';
import Link from 'next/link';
import { Venue } from '@prisma/client';
import { GlassPane } from './GlassPane';

export function SearchBar({ onExpandChange }: { onExpandChange?: (expanded: boolean) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Venue[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filters
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number | ''>('');
  const [filterMinRating, setFilterMinRating] = useState<number | ''>('');
  const [filterSports, setFilterSports] = useState<string[]>([]);
  const [filterAmenities, setFilterAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const SPORTS_LIST = ['Football', 'Cricket', 'Badminton', 'Tennis', 'Snooker', 'Table Tennis'];
  const AMENITIES_LIST = ['Parking', 'Washroom', 'Changing Room', 'Locker', 'Water', 'CCTV'];

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSport = (sport: string) => {
    setFilterSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]);
  };

  const toggleAmenity = (amenity: string) => {
    setFilterAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  const filteredResults = results.filter(v => {
      // Basic Filters
      if (filterLocation && !v.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;
      if (filterCategory && v.category !== filterCategory) return false;
      if (filterMaxPrice && v.price > Number(filterMaxPrice)) return false;
      
      // Minimum Rating
      if (filterMinRating !== '') {
          const ratingNum = Number(filterMinRating);
          let avgRating = 0;
          const reviews = (v as any).reviews || [];
          if (reviews.length > 0) {
              avgRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
          }
          if (avgRating < ratingNum && avgRating !== 0) return false;
          if (avgRating === 0 && ratingNum > 0) return false;
      }

      // Sports Supported (Match any if selected)
      if (filterSports.length > 0) {
          if (!v.sports) return false;
          const vSports = v.sports.toLowerCase();
          const matches = filterSports.some(s => vSports.includes(s.toLowerCase()));
          if (!matches) return false;
      }

      // Amenities (Match all if selected)
      if (filterAmenities.length > 0) {
          if (!v.facilities) return false;
          const vFacs = v.facilities.toLowerCase();
          const matches = filterAmenities.every(a => vFacs.includes(a.toLowerCase()));
          if (!matches) return false;
      }

      return true;
  });

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search failed", err);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!query) setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  return (
    <div className={`relative transition-all duration-300 ease-in-out flex justify-end ${isExpanded ? 'w-full max-w-md' : 'w-8 md:w-full md:max-w-md'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsExpanded(true);
          inputRef.current?.focus();
        }}
        className={`absolute left-0 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center z-10 transition-colors ${
          isExpanded ? 'text-gray-400 pointer-events-none' : 'text-white md:text-gray-400'
        }`}
      >
        <Search className="w-4 h-4 md:w-4 md:h-4" />
      </button>

      <input 
        ref={inputRef}
        type="text" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setIsExpanded(true);
        }}
        placeholder="Search venues..." 
        className={`w-full bg-white/5 border border-white/10 rounded-full py-1.5 md:py-2 pl-9 md:pl-10 pr-3 md:pr-4 text-xs md:text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-500 text-white
          ${isExpanded ? 'opacity-100 w-full' : 'opacity-0 md:opacity-100 cursor-pointer md:cursor-text w-0 p-0 md:w-full md:p-1.5 border-transparent md:border-white/10 bg-transparent md:bg-white/5'}
        `}
      />

      {isOpen && (results.length > 0 || query) && (
        <div className="absolute top-full mt-2 w-full z-50">
          <GlassPane className="py-2 flex flex-col max-h-96 overflow-hidden">
            <div className="px-3 pb-3 border-b border-white/10 mb-2 flex flex-col gap-3">
                <div className="flex items-center justify-between pl-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Settings2 className="w-3 h-3 text-blue-500" />
                        Refine Search
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Location" 
                            value={filterLocation}
                            onChange={e => setFilterLocation(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/50"
                        />
                    </div>
                    <select 
                        value={filterCategory} 
                        onChange={e => setFilterCategory(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/50 [&>option]:text-black"
                    >
                        <option value="">All Categories</option>
                        <option value="TURF">Turf</option>
                        <option value="CRICKET">Cricket</option>
                        <option value="FOOTBALL">Football</option>
                        <option value="BADMINTON">Badminton</option>
                        <option value="EVENTS">Events</option>
                        <option value="SNOOKER">Snooker</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <input 
                        type="number" 
                        placeholder="Max Price (₹)" 
                        value={filterMaxPrice}
                        onChange={e => setFilterMaxPrice(e.target.value ? Number(e.target.value) : '')}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/50"
                    />
                    <div className="relative">
                        <StarIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-yellow-500" />
                        <select 
                            value={filterMinRating} 
                            onChange={e => setFilterMinRating(e.target.value ? Number(e.target.value) : '')}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/50 [&>option]:text-black"
                        >
                            <option value="">Any Rating</option>
                            <option value="4">4+ Stars</option>
                            <option value="3">3+ Stars</option>
                            <option value="2">2+ Stars</option>
                        </select>
                    </div>
                </div>

                {/* Sports Pills */}
                <div>
                   <p className="text-[9px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Sports Supported</p>
                   <div className="flex flex-wrap gap-1.5">
                       {SPORTS_LIST.map(sport => (
                           <button 
                                key={sport}
                                onClick={() => toggleSport(sport)}
                                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${filterSports.includes(sport) ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                           >
                               {sport}
                           </button>
                       ))}
                   </div>
                </div>

                {/* Amenities Pills */}
                <div>
                   <p className="text-[9px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Amenities</p>
                   <div className="flex flex-wrap gap-1.5">
                       {AMENITIES_LIST.map(amenity => (
                           <button 
                                key={amenity}
                                onClick={() => toggleAmenity(amenity)}
                                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${filterAmenities.includes(amenity) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                           >
                               {amenity}
                           </button>
                       ))}
                   </div>
                </div>
            </div>

            <div className="overflow-y-auto flex-1">
                {filteredResults.length > 0 ? filteredResults.map((venue) => (
                  <Link 
                    key={venue.id} 
                    href={`/venue/${venue.id}`}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 hover:bg-white/10 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-200">{venue.name}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{venue.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">
                      {venue.category}
                    </span>
                  </Link>
                )) : (
                  <div className="py-4 px-4 text-center text-sm text-gray-400">
                    No venues found.
                  </div>
                )}
            </div>
          </GlassPane>
        </div>
      )}
    </div>
  );
}
