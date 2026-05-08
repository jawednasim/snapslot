'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FEATURED_ITEMS = [
  {
    id: '1',
    title: 'The Grand Football Arena',
    location: 'Downtown City Center',
    price: '₹2000/hr',
    image: 'https://picsum.photos/seed/hero1/1920/1080',
    tag: 'Trending',
  },
  {
    id: '2',
    title: 'Premium Box Cricket',
    location: 'West End Tech Park',
    price: '₹1500/hr',
    image: 'https://picsum.photos/seed/hero2/1920/1080',
    tag: 'New',
  },
  {
    id: '3',
    title: 'Olympic Badminton Court',
    location: 'Sector 42 Sports Complex',
    price: '₹800/hr',
    image: 'https://picsum.photos/seed/hero3/1920/1080',
    tag: 'Popular',
  }
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % FEATURED_ITEMS.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + FEATURED_ITEMS.length) % FEATURED_ITEMS.length);

  return (
    <div className="relative w-full aspect-[3/4] sm:aspect-auto sm:h-[60vh] sm:min-h-[500px] lg:min-h-[600px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group shadow-2xl border border-white/10">
      
      {/* Title Text Overlay */}
      <div className="absolute top-8 sm:top-12 md:top-16 inset-x-0 z-20 flex flex-col items-center text-center px-4 pointer-events-none">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-3 sm:mb-4 md:mb-6 leading-[1.15] md:leading-[1.1] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          Elevate Your Game.<br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Book Instantly.</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-lg text-gray-200 max-w-2xl mx-auto font-medium px-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hidden sm:block">
          Discover and book the finest turfs, cricket grounds, and premium event spaces. Real-time availability at your fingertips.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 bg-[#0B0F1A]"
        >
          <Image 
            src={FEATURED_ITEMS[currentIndex].image} 
            alt={FEATURED_ITEMS[currentIndex].title}
            fill
            className="object-cover opacity-80 mix-blend-screen"
            referrerPolicy="no-referrer"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[rgba(11,15,26,0.5)] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A] via-[rgba(11,15,26,0.4)] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F1A]/80 via-transparent to-transparent hidden md:block" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8 z-10">
            <div className="flex-1 max-w-3xl text-left">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full mb-4 text-white border border-white/20 shadow-lg"
              >
                {FEATURED_ITEMS[currentIndex].tag}
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-[1.1]"
              >
                {FEATURED_ITEMS[currentIndex].title}
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-3 text-sm font-medium"
              >
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-gray-200 shadow-md">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {FEATURED_ITEMS[currentIndex].location}
                </span>
                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
                <span className="flex items-center bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30 font-bold tracking-wide">
                  {FEATURED_ITEMS[currentIndex].price}
                </span>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full md:w-auto shrink-0"
            >
              <Link 
                href={`/venue/${FEATURED_ITEMS[currentIndex].id}`}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 font-bold py-4 px-10 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <CalendarIcon className="w-5 h-5" />
                Book Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {FEATURED_ITEMS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentIndex === idx ? 'bg-blue-500 w-8' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
