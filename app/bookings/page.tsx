import { Navbar } from '@/components/ui/Navbar';
import { GlassPane } from '@/components/ui/GlassPane';
import { prisma } from '@/lib/prisma';
import { CalendarDays, Clock, MapPin, CheckCircle2, Ticket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  // In a real app we would get the user ID from auth context.
  // We'll mock fetching bookings. Since this is just a prototype, we'll try to find any existing real bookings.
  let bookings = await prisma.booking.findMany({
    include: {
      venue: true,
      slot: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (bookings.length === 0) {
    // Mock bookings if DB is empty
    bookings = [
      {
        id: '1',
        userId: '1',
        venueId: '1',
        slotId: '1',
        status: 'CONFIRMED',
        total: 1200,
        createdAt: new Date(),
        updatedAt: new Date(),
        venue: {
          name: 'Elite Sports Arena',
          location: 'Downtown, Sector 5',
          imageUrl: 'https://picsum.photos/seed/elite/800/600',
        },
        slot: {
          startTime: new Date(new Date().setHours(new Date().getHours() + 2)), // 2 hours from now
        }
      },
      {
        id: '2',
        userId: '1',
        venueId: '2',
        slotId: '2',
        status: 'CONFIRMED',
        total: 2500,
        createdAt: new Date(),
        updatedAt: new Date(),
        venue: {
          name: 'Greenfields Cricket Ground',
          location: 'West End',
          imageUrl: 'https://picsum.photos/seed/cricket/800/600',
        },
        slot: {
          startTime: new Date(new Date().setHours(new Date().getHours() - 24)), // 24 hours ago
        }
      }
    ] as any;
  }

  const upcomingBookings = bookings.filter(b => new Date(b.slot.startTime) > new Date());
  const pastBookings = bookings.filter(b => new Date(b.slot.startTime) <= new Date());

  return (
    <main className="min-h-screen pt-24 pb-12 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold mb-8 flex items-center gap-3">
          <Ticket className="w-8 h-8 text-blue-500" />
          My Bookings
        </h1>

        <div className="space-y-12">
          {/* Upcoming */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-indigo-400" />
              Upcoming
            </h2>
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-400">No upcoming bookings found.</p>
            ) : (
              <div className="grid gap-4">
                {upcomingBookings.map((booking: any) => (
                  <GlassPane key={booking.id} className="p-6 flex flex-col md:flex-row gap-6 border border-white/10 hover:border-blue-500/30 transition-colors">
                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden relative flex-shrink-0">
                      <Image src={booking.venue.imageUrl} alt={booking.venue.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-green-400 border border-green-400/20">
                        {booking.status}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-bold font-display mb-2 hover:text-blue-400 transition-colors">
                        <Link href={`/venue/${booking.venueId}`}>{booking.venue.name}</Link>
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{booking.venue.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{new Date(booking.slot.startTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="font-semibold text-gray-200">Total: ₹{booking.total}</span>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.venue.name + ' ' + booking.venue.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-sm font-medium rounded-lg transition-colors inline-block"
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </GlassPane>
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="w-6 h-6" />
              Past Bookings
            </h2>
            {pastBookings.length === 0 ? (
              <p className="text-gray-500">No past bookings found.</p>
            ) : (
              <div className="grid gap-4 opacity-75">
                {pastBookings.map((booking: any) => (
                  <GlassPane key={booking.id} className="p-6 flex flex-col md:flex-row gap-6 border border-white/5 bg-white/[0.01]">
                    <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden relative flex-shrink-0 grayscale">
                      <Image src={booking.venue.imageUrl} alt={booking.venue.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-lg font-bold font-display mb-1 text-gray-300">
                        <Link href={`/venue/${booking.venueId}`}>{booking.venue.name}</Link>
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {booking.venue.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(booking.slot.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">₹{booking.total}</span>
                        <Link href={`/venue/${booking.venueId}#booking-section`} className="text-sm text-blue-400 hover:text-blue-300 font-medium">Leave a Review</Link>
                      </div>
                    </div>
                  </GlassPane>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
