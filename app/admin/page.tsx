import { Navbar } from '@/components/ui/Navbar';
import { GlassPane } from '@/components/ui/GlassPane';
import { prisma } from '@/lib/prisma';
import { Activity, Users, MapPin, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { AdminDashboardAnalytics } from './AdminDashboardAnalytics';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const totalBookings = await prisma.booking.count();
    const totalRevenueResult = await prisma.booking.aggregate({
        _sum: { total: true },
        where: { status: 'CONFIRMED' }
    });
    const totalRevenue = totalRevenueResult._sum.total || 0;
    
    const activeVenues = await prisma.venue.count({ where: { status: 'APPROVED' } });
    const totalUsers = await prisma.user.count();

    const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true, venue: true, slot: true }
    });

    // Group bookings by date for trends chart
    const allBookings = await prisma.booking.findMany({
        where: { status: 'CONFIRMED' },
        orderBy: { createdAt: 'asc' }
    });

    const bookingTrendsMap = allBookings.reduce((acc, booking) => {
        const dateStr = new Date(booking.createdAt).toISOString().split('T')[0];
        if (!acc[dateStr]) acc[dateStr] = { date: dateStr, revenue: 0, count: 0 };
        acc[dateStr].revenue += booking.total;
        acc[dateStr].count += 1;
        return acc;
    }, {} as Record<string, { date: string, revenue: number, count: number }>);
    
    // Convert to array and take last 7 days
    const bookingTrends = Object.values(bookingTrendsMap).slice(-7);

    const venuesByCategoryRaw = await prisma.venue.groupBy({
        by: ['category'],
        _count: { id: true }
    });

    const stats = {
        bookings: totalBookings,
        revenue: `₹${totalRevenue}`,
        activeVenues: activeVenues,
        users: totalUsers
    };

    return (
        <>
            {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: 'Total Bookings', value: stats.bookings, icon: Activity, color: 'blue' },
                        { title: 'Confirmed Revenue', value: stats.revenue, icon: DollarSign, color: 'green' },
                        { title: 'Active Venues', value: stats.activeVenues, icon: MapPin, color: 'purple' },
                        { title: 'Total Users', value: stats.users, icon: Users, color: 'orange' },
                    ].map((stat, i) => (
                        <GlassPane key={i} className="p-6 pb-8 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <h3 className="text-gray-400 mb-1 text-sm">{stat.title}</h3>
                            <h2 className="text-3xl font-display font-bold">{stat.value}</h2>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-blue-500/50 transition-all"></div>
                        </GlassPane>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Bookings Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <GlassPane className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display font-bold text-lg">Recent Bookings</h3>
                                <Link href="/admin/bookings" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-white/5">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">User</th>
                                            <th className="px-4 py-3">Venue</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3 rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map((booking, i) => (
                                            <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-4 font-medium text-gray-200">{booking.user?.name || booking.user?.email}</td>
                                                <td className="px-4 py-4 text-gray-400">{booking.venue?.name}</td>
                                                <td className="px-4 py-4 text-gray-400">{new Date(booking.slot?.startTime).toLocaleString()}</td>
                                                <td className="px-4 py-4 font-medium">₹{booking.total}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                                                        booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                                        booking.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {recentBookings.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">No bookings found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </GlassPane>

                        <AdminDashboardAnalytics categoryData={venuesByCategoryRaw} trendsData={bookingTrends} />
                    </div>

                    {/* AI Insights Panel */}
                    <div className="lg:col-span-1">
                        <GlassPane className="p-6 relative overflow-hidden h-full border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <TrendingUp className="w-32 h-32 text-purple-400" />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500">
                                        <Activity className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI Insights</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                                        <h4 className="text-sm font-semibold mb-1 text-gray-200">System Ready</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            As more usage data comes in, intelligent revenue insights and scheduling recommendations will populate here automatically.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                                        <h4 className="text-sm font-semibold mb-1 text-gray-200">Categories Check</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            {venuesByCategoryRaw.length ? `You have venues across ${venuesByCategoryRaw.length} categories.` : "No venues created yet. Encourage owners to list their venues."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </GlassPane>
                    </div>
                </div>
        </>
    );
}
