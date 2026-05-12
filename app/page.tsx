import { Navbar } from '@/components/ui/Navbar';
import { VenueCard } from '@/components/ui/VenueCard';
import { GlassPane } from '@/components/ui/GlassPane';
import { prisma } from '@/lib/prisma';
import { Trophy, CalendarCheck, TrendingUp } from 'lucide-react';
import { HeroCarousel } from '@/components/ui/HeroCarousel';
import Link from 'next/link';

import { HomeFilters } from '@/components/ui/HomeFilters';

// Force dynamic since Next.js custom server might cache page
import { Venue } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category as string | undefined;
  const minPrice = resolvedParams.minPrice ? parseInt(resolvedParams.minPrice as string) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseInt(resolvedParams.maxPrice as string) : undefined;
  const location = resolvedParams.location as string | undefined;

  // Try to fetch venues, if DB is empty we should see none or mock 
  let venues: (import('@prisma/client').Venue & { reviews?: { rating: number }[] })[] = [];
  try {
    venues = await prisma.venue.findMany({
      where: {
        ...(category && category !== 'ALL' && { category }),
        ...(location && { location: { contains: location } }),
        ...(minPrice || maxPrice ? { 
          price: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {})
          }
        } : {}),
        status: { in: ['APPROVED', 'PENDING'] }
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: true
      }
    });
  } catch (err) {
    console.error("DB not seeded yet", err);
  }

  // Fallback to mock data if empty (for prototype visual)
  if (venues.length === 0) {
    venues = [
      { id: '1', name: 'Elite Sports Arena', location: 'New Delhi, Sector 5', price: 1200, category: 'TURF', imageUrl: 'https://picsum.photos/seed/elite/800/600', description: '', status: 'APPROVED', ownerId: '1', createdAt: new Date(), updatedAt: new Date(), rejectionReason: null, reviews: [{rating: 4.8}] as any[] } as any,
      { id: '2', name: 'Greenfields Cricket Ground', location: 'Mumbai, West End', price: 2500, category: 'CRICKET', imageUrl: 'https://picsum.photos/seed/cricket/800/600', description: '', status: 'APPROVED', ownerId: '1', createdAt: new Date(), updatedAt: new Date(), rejectionReason: null, reviews: [{rating: 4.2}] as any[] } as any,
      { id: '3', name: 'Neon Football Turf', location: 'Bangalore, Tech Park', price: 1500, category: 'TURF', imageUrl: 'https://picsum.photos/seed/football/800/600', description: '', status: 'APPROVED', ownerId: '1', createdAt: new Date(), updatedAt: new Date(), rejectionReason: null, reviews: [{rating: 5.0}] as any[] } as any,
    ];
    
    // In-memory filter for mock data
    if (category && category !== 'ALL') venues = venues.filter(v => v.category === category);
    if (location) venues = venues.filter(v => v.location.toLowerCase().includes(location.toLowerCase()));
    if (minPrice) venues = venues.filter(v => v.price >= minPrice);
    if (maxPrice) venues = venues.filter(v => v.price <= maxPrice);
  }

  return (
    <main className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-12 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full relative z-10 flex flex-col items-center pt-4 md:pt-8 pb-12 md:pb-24 overflow-hidden">
        {/* Modern glowing background effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] sm:w-full max-w-4xl h-[300px] md:h-[400px] bg-blue-500/20 md:bg-blue-500/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-[1400px] px-3 sm:px-4 md:px-8 mx-auto relative z-20">
          <HeroCarousel />
        </div>

        {/* Filters */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-8 md:mt-12 relative z-30">
          <HomeFilters />
        </div>
      </section>

      {/* Featured Venues */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Featured Venues</h2>
          <button className="text-blue-400 hover:text-blue-300 font-medium text-xs md:text-sm transition-colors uppercase tracking-wider">
            View All →
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      {/* Stats/AI Insights Promo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <GlassPane className="p-6 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-blue-500/20 blur-[80px] md:blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-purple-500/20 blur-[80px] md:blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center text-center lg:text-left">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">
                Powered by Intelligent Insights
              </h2>
              <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8 max-w-md mx-auto lg:mx-0">
                For venue owners, our AI analyzes booking patterns to suggest optimum pricing and predict high-demand slots, maximizing your revenue.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Link href="/owner/onboarding" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-sm md:text-base transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  List Your Venue
                </Link>
                <button className="bg-white/10 hover:bg-white/15 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-colors border border-white/10">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <GlassPane className="p-5 md:p-6 bg-white/[0.02] border-white/5">
                <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-1">Top Tier Network</h3>
                <p className="text-xs md:text-sm text-gray-400">Over 500+ premium venues onboarded entirely vetted.</p>
              </GlassPane>
              <GlassPane className="p-5 md:p-6 bg-white/[0.02] border-white/5 sm:translate-y-6">
                <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <CalendarCheck className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-1">Real-time Sync</h3>
                <p className="text-xs md:text-sm text-gray-400">Zero double bookings. Instant slot locking algorithm.</p>
              </GlassPane>
            </div>
          </div>
        </GlassPane>
      </section>
    </main>
  );
}
