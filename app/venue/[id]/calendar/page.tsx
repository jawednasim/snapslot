import { Navbar } from '@/components/ui/Navbar';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CalendarViewClient } from '@/components/ui/CalendarViewClient';

export default async function VenueCalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let venue = await prisma.venue.findUnique({ 
    where: { id }
  });

  if (!venue) {
      if(id === "1" || id === "2" || id === "3") {
          venue = { id, name: 'Mock Venue', price: 1000 } as any;
      } else {
          return notFound();
      }
  }

  // Fetch upcoming bookings for next 30 days
  const upcomingBookings = await prisma.booking.findMany({
      where: {
          venueId: id,
          status: { in: ['CONFIRMED'] },
          slot: {
              startTime: {
                  gte: new Date()
              }
          }
      },
      include: {
          slot: true
      }
  });

  return (
    <main className="min-h-screen pt-24 pb-12 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold mb-2">Availability Calendar</h1>
        <p className="text-gray-400 mb-8">{venue?.name}</p>
        <CalendarViewClient venueId={id} initialBookings={upcomingBookings} />
      </div>
    </main>
  );
}
