import { Navbar } from '@/components/ui/Navbar';
import { GlassPane } from '@/components/ui/GlassPane';
import { SlotBookingClient } from '@/components/ui/SlotBookingClient';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { MapPin, Star, Users, Wind, ShieldCheck, Car, CalendarCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import FavoriteButton from '@/components/ui/FavoriteButton';

import { LeaveReview } from '@/components/ui/LeaveReview';

export default async function VenueDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as any).id : null;

  let venue = await prisma.venue.findUnique({ 
    where: { id },
    include: { reviews: { include: { user: true }, orderBy: { createdAt: 'desc' } } }
  });
  
  // Mock data fallback
  if (!venue) {
      if(id === "1" || id === "2" || id === "3") {
          venue = {
              id: id,
              name: id === "1" ? 'Elite Sports Arena' : id === "2" ? 'Greenfields Cricket Ground' : 'Neon Football Turf',
              location: 'Downtown, Sector 5',
              price: 1200 + parseInt(id) * 300,
              category: 'TURF',
              imageUrl: `https://picsum.photos/seed/turf${id}/1920/1080`,
              description: 'Experience premium quality artificial grass imported directly from Europe. Perfectly maintained and floodlit for night games.',
              status: 'APPROVED',
              ownerId: '1',
              createdAt: new Date(),
              updatedAt: new Date(),
              rejectionReason: null,
              reviews: [{id: "r1", rating: 4.8}, {id: "r2", rating: 5}] as any[]
          } as any
      } else {
        notFound();
      }
  }

  let initialFavorited = false;
  if (userId && venue) {
      const fav = await prisma.favorite.findUnique({
          where: { userId_venueId: { userId, venueId: venue.id } }
      });
      initialFavorited = !!fav;
  }

  const safeVenue = venue as any;
  const avgRating = safeVenue.reviews && safeVenue.reviews.length > 0 
    ? (safeVenue.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / safeVenue.reviews.length).toFixed(1)
    : "4.8";
  const numReviews = safeVenue.reviews ? safeVenue.reviews.length : 124;

  return (
    <main className="min-h-screen pt-20 pb-12">
      <Navbar />
      
      {/* Hero Image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] xl:h-[60vh] mt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
            <Image 
                src={safeVenue.imageUrl || "https://picsum.photos/seed/turf/1920/1080"} 
                alt={safeVenue.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-black/40 to-transparent" />
            <div className="absolute top-6 right-6 z-20 shadow-lg group">
                <FavoriteButton venueId={safeVenue.id} initialFavorited={initialFavorited} className="scale-125 hover:scale-150 transition-transform" />
            </div>
            
            <div className="absolute bottom-8 left-8 right-8">
                <span className="bg-blue-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 inline-block shadow-lg">
                    {safeVenue.category}
                </span>
                <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                    {safeVenue.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>{safeVenue.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{avgRating}</span>
                        <span className="text-gray-400">({numReviews} reviews)</span>
                    </div>
                </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Details */}
        <div className="lg:col-span-2 space-y-8">
            <section>
                <h2 className="font-display text-2xl font-bold mb-4">About the Venue</h2>
                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                    {safeVenue.description || "A world-class sports facility providing top-tier synthetic turf, perfect for 5v5 and 7v7 football matches, box cricket, and general fitness training. Complete with high-intensity LED floodlights for night matches."}
                </p>

                <h3 className="font-display text-xl font-bold mb-3">Venue Configuration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Surface Type</span>
                        <span className="font-medium text-white">{safeVenue.surfaceType || 'Premium Synthetic Turf'}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Sports Supported</span>
                        <span className="font-medium text-white">{safeVenue.supportedSports ? (typeof safeVenue.supportedSports === 'string' ? safeVenue.supportedSports : JSON.parse(safeVenue.supportedSports).join(', ')) : 'Football (5v5, 7v7), Cricket'}</span>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="font-display text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(() => {
                        let facilities: string[] = [];
                        if (safeVenue.facilities) {
                            try {
                                const parsed = JSON.parse(safeVenue.facilities);
                                facilities = Object.keys(parsed).filter(k => parsed[k]);
                            } catch (e) {
                                facilities = [];
                            }
                        }
                        if (facilities.length === 0) {
                            facilities = ["Spectator Area", "First Aid Kit", "Free Parking", "Washrooms"];
                        }
                        return facilities.map((facility, i) => {
                            let Icon = ShieldCheck;
                            if (facility.toLowerCase().includes('parking')) Icon = Car;
                            if (facility.toLowerCase().includes('washroom')) Icon = Wind;
                            if (facility.toLowerCase().includes('spectator') || facility.toLowerCase().includes('seating')) Icon = Users;
                            return (
                                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <Icon className="w-6 h-6 text-blue-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-300">{facility}</span>
                                </div>
                            );
                        });
                    })()}
                </div>
            </section>
        </div>

        {/* Right Col - Rules maybe */}
        <div className="lg:col-span-1 space-y-6">
            <GlassPane className="p-6">
                <h3 className="font-display text-xl font-bold mb-4">Venue Rules</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex gap-2"><span className="text-blue-400">•</span> Non-marking shoes mandatory.</li>
                    <li className="flex gap-2"><span className="text-blue-400">•</span> Arrive 15 mins before your slot.</li>
                    <li className="flex gap-2"><span className="text-blue-400">•</span> Outside food/drinks not allowed on turf.</li>
                    <li className="flex gap-2"><span className="text-blue-400">•</span> Smoking strictly prohibited.</li>
                </ul>
            </GlassPane>

            <GlassPane className="p-6 border-orange-500/20 bg-orange-500/5">
                <h3 className="font-display text-xl font-bold mb-4 text-orange-400">Cancellation Policy</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex gap-2"><span className="text-orange-400">1.</span> Free cancellation up to 24 hours before the booked slot time.</li>
                    <li className="flex gap-2"><span className="text-orange-400">2.</span> 50% refund for cancellations made between 12 to 24 hours prior.</li>
                    <li className="flex gap-2"><span className="text-orange-400">3.</span> No refund for cancellations within 12 hours of the booking.</li>
                </ul>
            </GlassPane>
        </div>
      </div>

      {/* Booking Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 font-sans" id="booking-section">
        <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold">Book a Slot</h2>
            <a href={`/venue/${safeVenue.id}/calendar`} className="flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-colors">
                <CalendarCheck className="w-4 h-4 mr-2" /> View Full Calendar
            </a>
        </div>
        <SlotBookingClient venueId={safeVenue.id} venuePrice={safeVenue.price} />
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 font-sans">
        <h2 className="font-display text-3xl font-bold mb-8">Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                {safeVenue.reviews && safeVenue.reviews.length > 0 ? (
                    safeVenue.reviews.map((review: any) => (
                        <GlassPane key={review.id} className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-200">{review.user?.name || 'Anonymous User'}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-500' : 'text-gray-600'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                            )}
                        </GlassPane>
                    ))
                ) : (
                    <div className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</div>
                )}
            </div>
            <div>
                <LeaveReview venueId={safeVenue.id} />
            </div>
        </div>
      </div>

    </main>
  );
}
