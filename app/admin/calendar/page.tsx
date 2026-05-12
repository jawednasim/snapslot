import { GlassPane } from '@/components/ui/GlassPane';
import { prisma } from '@/lib/prisma';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarPage() {
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 1 });
    
    // Create an array of 7 days
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

    const bookings = await prisma.booking.findMany({
        where: {
            slot: {
                startTime: {
                    gte: startDate,
                    lte: addDays(startDate, 7)
                }
            }
        },
        include: {
            slot: true,
            venue: true,
            user: true
        }
    });

    return (
        <GlassPane className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <CalendarIcon className="w-8 h-8 text-blue-500" />
                <h2 className="font-display font-bold text-2xl">Weekly Calendar Overview</h2>
            </div>
            
            <div className="grid grid-cols-7 gap-4">
                {weekDays.map(date => {
                    const dayBookings = bookings.filter(b => format(new Date(b.slot.startTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
                    
                    return (
                        <div key={date.toString()} className={`min-h-[400px] border rounded-xl overflow-hidden ${format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
                            <div className={`p-3 border-b text-center font-bold ${format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : 'bg-white/5 border-white/10 text-gray-300'}`}>
                                <div className="text-xs uppercase tracking-wider">{format(date, 'EEE')}</div>
                                <div className="text-xl">{format(date, 'd')}</div>
                            </div>
                            
                            <div className="p-2 space-y-2 max-h-[350px] overflow-y-auto scrollbar-none">
                                {dayBookings.length === 0 ? (
                                    <div className="text-xs text-gray-500 text-center py-4">No bookings</div>
                                ) : (
                                    dayBookings.map(booking => (
                                        <div key={booking.id} className="bg-white/5 border border-white/10 p-2 rounded-lg text-xs hover:bg-white/10 transition-colors">
                                            <div className="font-bold text-blue-400 mb-1">{format(new Date(booking.slot.startTime), 'HH:mm')}</div>
                                            <div className="font-medium text-gray-200 truncate">{booking.venue.name}</div>
                                            <div className="text-gray-400 truncate mt-1">User: {booking.user?.name || 'Guest'}</div>
                                            <div className={`mt-1 font-bold text-[9px] uppercase ${booking.status === 'CONFIRMED' ? 'text-green-400' : booking.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {booking.status}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassPane>
    );
}
