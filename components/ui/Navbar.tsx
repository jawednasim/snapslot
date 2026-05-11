'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, MapPin, CalendarDays, User, Menu, ChevronDown, Check, LogOut, LogIn, Heart } from 'lucide-react';
import { GlassPane } from '@/components/ui/GlassPane';
import { SearchBar } from '@/components/ui/SearchBar';

const LOCATIONS = ['New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune'];

export function Navbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocation = searchParams.get('location') || 'New Delhi';
  const { data: session } = useSession();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSelect = (loc: string) => {
    setIsLocationOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('location', loc);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <nav className="fixed top-0 w-full z-50 p-2 md:p-4 mt-2 hover:mt-0 md:mt-0 transition-all">
      <GlassPane className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between rounded-full bg-[#0B0F1A]/80 md:bg-white/[0.03]">
        <div className={`flex items-center gap-3 transition-all duration-300 ${isSearchExpanded ? 'w-0 opacity-0 overflow-hidden shrink-0' : 'opacity-100'} md:w-auto md:opacity-100 md:overflow-visible`}>
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-white text-base md:text-lg">S</span>
            </div>
            <span className="font-display font-bold text-lg md:text-xl tracking-tight hidden sm:block">SnapSlot</span>
          </Link>

          <div className="relative" ref={locationRef}>
            <button 
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-xs md:text-sm font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate max-w-[70px] sm:max-w-none">{currentLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </button>

            {isLocationOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 z-50">
                <GlassPane className="py-2 flex flex-col gap-1 shadow-2xl">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => handleLocationSelect(loc)}
                      className={`px-4 py-2 text-sm text-left flex items-center justify-between hover:bg-white/10 transition-colors ${currentLocation === loc ? 'text-white font-medium' : 'text-gray-400'}`}
                    >
                      {loc}
                      {currentLocation === loc && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  ))}
                </GlassPane>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className={`flex flex-1 justify-end transition-all duration-300 ${isSearchExpanded ? 'mx-0' : 'mx-2 md:mx-8'} md:mx-8`}>
          <SearchBar onExpandChange={setIsSearchExpanded} />
        </div>

        <div className={`flex items-center gap-2 md:gap-4 shrink-0 transition-all duration-300 ${isSearchExpanded ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'} md:w-auto md:opacity-100 md:overflow-visible`}>
          <Link href="/owner/onboarding" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors hidden md:block">
            List Your Venue
          </Link>
          <Link href="/admin" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors hidden md:block">
            Dashboard
          </Link>
          {session ? (
            <div className="flex items-center gap-2">
                <Link href="/profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
                <button onClick={() => signOut()} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>
          ) : (
            <button onClick={() => signIn()} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:block">Login</span>
            </button>
          )}
        </div>
      </GlassPane>
    </nav>
  );
}
