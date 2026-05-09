'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Booking {
  id: string;
  slot: { startTime: string | Date, endTime: string | Date };
  venue?: { name: string };
  status: string;
}

export function CalendarView({ bookings }: { bookings: Booking[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  // Calculate day to start the grid
  const startDayOfWeek = startDate.getDay();
  const leadingBlanks = Array.from({ length: startDayOfWeek });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-white w-full max-w-4xl mx-auto overflow-hidden shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-display font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-xs text-gray-500 uppercase font-bold tracking-wider">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
            key={currentDate.toString()}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 gap-1 md:gap-2 auto-rows-fr"
        >
          {leadingBlanks.map((_, i) => (
            <div key={`blank-${i}`} className="p-2 min-h-[60px] md:min-h-[80px]" />
          ))}
          {days.map(day => {
            const dayBookings = bookings.filter(b => isSameDay(new Date(b.slot.startTime), day));
            return (
              <div 
                key={day.toString()} 
                className={cn(
                    "p-1 md:p-2 border rounded-xl flex flex-col min-h-[60px] md:min-h-[80px] transition-all",
                    isToday(day) ? "border-blue-500 bg-blue-500/10" : "border-white/5 bg-white/[0.02]",
                    !isSameMonth(day, currentDate) ? "opacity-50" : "opacity-100"
                )}
              >
                <div className="text-right">
                  <span className={cn(
                    "text-xs md:text-sm font-medium w-6 h-6 inline-flex items-center justify-center rounded-full leading-none",
                    isToday(day) ? "bg-blue-600 text-white" : "text-gray-300"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-1 flex-1 overflow-y-auto w-full no-scrollbar">
                    {dayBookings.map(booking => (
                        <div 
                            key={booking.id} 
                            className={cn(
                                "text-[9px] md:text-xs rounded px-1.5 py-1 truncate leading-tight w-full shadow-sm max-w-[100%]",
                                booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            )}
                            title={booking.venue?.name ? `${booking.venue.name} - ${format(new Date(booking.slot.startTime), 'h:mm a')}` : format(new Date(booking.slot.startTime), 'h:mm a')}
                        >
                            <span className="font-semibold">{format(new Date(booking.slot.startTime), 'h:mm a')}</span>
                            {booking.venue?.name && <span className="block truncate opacity-80 mt-0.5">{booking.venue.name}</span>}
                        </div>
                    ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
