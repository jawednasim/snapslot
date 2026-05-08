import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { GlassPane } from '@/components/ui/GlassPane';
import { Venue } from '@prisma/client';
import FavoriteButton from './FavoriteButton';

export function VenueCard({ venue }: { venue: Venue & { reviews?: { rating: number }[] } }) {
  const avgRating = venue.reviews && venue.reviews.length > 0 
    ? (venue.reviews.reduce((acc, r) => acc + r.rating, 0) / venue.reviews.length).toFixed(1)
    : "4.8"; // Default fallback if no reviews
  
  return (
    <Link href={`/venue/${venue.id}`}>
      <GlassPane className="group overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] relative">
        <div className="absolute top-4 right-4 z-20">
            <FavoriteButton venueId={venue.id} />
        </div>
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={venue.imageUrl || "https://picsum.photos/seed/turf/800/600"} 
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-black/50 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 text-white shadow-lg">
              {venue.category}
            </span>
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 shadow-lg">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-semibold">{avgRating}</span>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">{venue.name}</h3>
          
          <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{venue.location}</span>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Starting from</span>
              <span className="font-semibold text-blue-400">₹{venue.price}/hr</span>
            </div>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </GlassPane>
    </Link>
  );
}
