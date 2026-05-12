import { Navbar } from '@/components/ui/Navbar';
import { GlassPane } from '@/components/ui/GlassPane';
import { Plus, List, Settings, Edit3, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function OwnerDashboard() {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    let whereClause = {};
    if (userId) {
        whereClause = { ownerId: userId };
    }

    const venues = await prisma.venue.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: { bookings: { include: { slot: true } } }
    });

    let totalRevenue = 0;
    let totalBookings = 0;
    let upcomingReservations = 0;
    const now = new Date();

    venues.forEach(venue => {
        venue.bookings.forEach(booking => {
            if (booking.status === 'CONFIRMED') {
                totalRevenue += booking.total;
            }
            totalBookings++;
            if (booking.slot.startTime > now && booking.status !== 'CANCELLED') {
                upcomingReservations++;
            }
        });
    });

    return (
        <main className="min-h-screen pt-24 pb-12 font-sans">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-bold">Owner Dashboard</h1>
                        <p className="text-gray-400 text-sm mt-1">Manage your turf listings and view performance.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/owner/onboarding" className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] w-max">
                            <Plus className="w-4 h-4" />
                            Add New Venue
                        </Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <GlassPane className="p-5 border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <CreditCard className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Revenue</p>
                                <h3 className="text-xl font-bold font-display">₹{totalRevenue.toLocaleString()}</h3>
                            </div>
                        </div>
                    </GlassPane>
                    <GlassPane className="p-5 border-l-4 border-l-indigo-500">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bookings</p>
                                <h3 className="text-xl font-bold font-display">{totalBookings}</h3>
                            </div>
                        </div>
                    </GlassPane>
                    <GlassPane className="p-5 border-l-4 border-l-purple-500">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Upcoming</p>
                                <h3 className="text-xl font-bold font-display">{upcomingReservations}</h3>
                            </div>
                        </div>
                    </GlassPane>
                    <GlassPane className="p-5 border-l-4 border-l-green-500">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <List className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Listings</p>
                                <h3 className="text-xl font-bold font-display">{venues.length}</h3>
                            </div>
                        </div>
                    </GlassPane>
                </div>

                {/* Quick Links / Actions */}
                <div className="mb-10">
                    <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-blue-500" />
                        Quick Management
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <Link href="/owner/bookings" className="bg-white/5 border border-white/10 hover:bg-white/10 p-4 rounded-2xl transition-all group flex flex-col items-center text-center">
                            <Calendar className="w-6 h-6 mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold">All Bookings</span>
                        </Link>
                        <Link href="/owner/pricing" className="bg-white/5 border border-white/10 hover:bg-white/10 p-4 rounded-2xl transition-all group flex flex-col items-center text-center">
                            <CreditCard className="w-6 h-6 mb-2 text-indigo-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold">Pricing Plans</span>
                        </Link>
                        <Link href="/owner/slots" className="bg-white/5 border border-white/10 hover:bg-white/10 p-4 rounded-2xl transition-all group flex flex-col items-center text-center">
                            <List className="w-6 h-6 mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold">Slot Manager</span>
                        </Link>
                        <Link href="/owner/reviews" className="bg-white/5 border border-white/10 hover:bg-white/10 p-4 rounded-2xl transition-all group flex flex-col items-center text-center">
                            <Edit3 className="w-6 h-6 mb-2 text-green-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold">User Reviews</span>
                        </Link>
                        <Link href="/owner/analytics" className="bg-white/5 border border-white/10 hover:bg-white/10 p-4 rounded-2xl transition-all group flex flex-col items-center text-center">
                            <TrendingUp className="w-6 h-6 mb-2 text-yellow-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold">Analytics</span>
                        </Link>
                        <Link href="/owner/profile" className="bg-white/5 border border-white/10 hover:bg-white/10 p-4 rounded-2xl transition-all group flex flex-col items-center text-center">
                            <Settings className="w-6 h-6 mb-2 text-gray-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold">Settings</span>
                        </Link>
                    </div>
                </div>
                
                <h2 className="font-display text-2xl font-bold mb-6">My Venues</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map((venue) => {
                        const revenue = venue.bookings.filter(b => b.status === 'CONFIRMED').reduce((acc, curr) => acc + curr.total, 0);
                        const numBookings = venue.bookings.length;

                        return (
                            <GlassPane key={venue.id} className="overflow-hidden group">
                                <div className="relative h-40 w-full">
                                    <Image src={venue.imageUrl || `https://picsum.photos/seed/${venue.id}/800/600`} alt={venue.name} fill className="object-cover" referrerPolicy="no-referrer" />
                                    <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                            venue.status === 'APPROVED' ? 'bg-green-500/80 text-white' : 
                                            venue.status === 'REJECTED' ? 'bg-red-500/80 text-white' :
                                            'bg-yellow-500/80 text-white'
                                        }`}>
                                            {venue.status}
                                        </span>
                                        {venue.status === 'REJECTED' && venue.rejectionReason && (
                                            <span className="bg-black/80 px-2 py-0.5 rounded text-[10px] text-red-300 max-w-[150px] truncate" title={venue.rejectionReason}>
                                                Reason: {venue.rejectionReason}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-5">
                                    <h3 className="font-display font-medium text-lg mb-4">{venue.name}</h3>
                                    
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total Rev</p>
                                            <p className="font-semibold text-blue-400">₹{revenue}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Bookings</p>
                                            <p className="font-semibold">{numBookings}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm text-gray-300 font-medium transition-colors flex items-center justify-center gap-1.5">
                                            <List className="w-4 h-4" />
                                            Slots
                                        </button>
                                        <button className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm text-gray-300 font-medium transition-colors flex items-center justify-center gap-1.5">
                                            <Edit3 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button className="w-10 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm text-gray-300 font-medium transition-colors flex items-center justify-center">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </GlassPane>
                        );
                    })}

                    <Link href="/owner/onboarding">
                        <GlassPane className="flex flex-col items-center justify-center h-full min-h-[352px] border-dashed border-2 border-white/10 hover:border-blue-500/30 hover:bg-white/[0.02] cursor-pointer transition-all group">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="font-medium text-gray-300">Create New Listing</h3>
                            <p className="text-xs text-gray-500 mt-1 text-center max-w-[200px]">Unlock new revenue streams by listing your sports venue.</p>
                        </GlassPane>
                    </Link>
                </div>
            </div>
        </main>
    );
}
