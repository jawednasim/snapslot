import { Navbar } from '@/components/ui/Navbar';
import { GlassPane } from '@/components/ui/GlassPane';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { User as UserIcon, Ticket, Heart, Settings, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      bookings: {
        include: { venue: true, slot: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      favorites: {
        include: { venue: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <main className="min-h-screen pt-24 pb-12 font-sans bg-[#0B0F1A]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold mb-8 text-white">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Column */}
          <div className="lg:col-span-1 space-y-6">
            <GlassPane className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user.name || 'User'}</h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Bookings</span>
                  <span className="font-medium text-white">{user.bookings.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Saved Venues</span>
                  <span className="font-medium text-white">{user.favorites.length}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Account Settings
                </h3>
                <form action={async (formData) => {
                  'use server';
                  const name = formData.get('name');
                  if (name && typeof name === 'string') {
                    await prisma.user.update({
                      where: { id: user.id },
                      data: { name }
                    });
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Display Name</label>
                    <input 
                      type="text" 
                      name="name"
                      defaultValue={user.name || ''} 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                    Update Profile
                  </button>
                </form>
              </div>
            </GlassPane>
          </div>

          {/* Activity Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Recent Bookings Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-blue-400" />
                  Recent Bookings
                </h2>
                <Link href="/bookings" className="text-sm text-blue-400 hover:underline">View All</Link>
              </div>
              
              {user.bookings.length === 0 ? (
                <GlassPane className="p-8 text-center">
                  <p className="text-gray-400">You haven't made any bookings yet.</p>
                  <Link href="/" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">Explore Venues</Link>
                </GlassPane>
              ) : (
                <div className="grid gap-3">
                  {user.bookings.map((booking) => (
                    <GlassPane key={booking.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div>
                        <Link href={`/venue/${booking.venueId}`} className="font-semibold text-white hover:text-blue-400 transition-colors">
                          {booking.venue.name}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.venue.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(booking.slot.startTime), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">₹{booking.total}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${booking.status === 'CONFIRMED' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {booking.status}
                        </div>
                      </div>
                    </GlassPane>
                  ))}
                </div>
              )}
            </section>

            {/* Favorites Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Saved Venues
                </h2>
                <Link href="/favorites" className="text-sm text-blue-400 hover:underline">View All</Link>
              </div>
              
              {user.favorites.length === 0 ? (
                <GlassPane className="p-8 text-center flex flex-col items-center">
                  <Heart className="w-8 h-8 text-gray-600 mb-3" />
                  <p className="text-gray-400">No saved venues yet.</p>
                </GlassPane>
              ) : (
                <div className="grid gap-3">
                  {user.favorites.map((fav) => (
                    <GlassPane key={fav.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-white/10 overflow-hidden relative shrink-0">
                          {fav.venue.imageUrl && (
                            <img src={fav.venue.imageUrl} alt={fav.venue.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <Link href={`/venue/${fav.venueId}`} className="font-semibold text-white hover:text-blue-400 transition-colors">
                            {fav.venue.name}
                          </Link>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                            <MapPin className="w-3 h-3" /> {fav.venue.location}
                          </div>
                        </div>
                      </div>
                    </GlassPane>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
