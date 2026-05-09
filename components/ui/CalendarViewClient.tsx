'use client';

import { useState } from 'react';
import { GlassPane } from './GlassPane';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function CalendarViewClient({ venueId, initialBookings }: { venueId: string, initialBookings: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startDate = startOfWeek(startOfMonth(currentDate));
    const endDate = endOfWeek(endOfMonth(currentDate));

    const dateFormat = "d";
    const rows = [];
    
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        // Find existing bookings for this day
        // Group by day for simple visual
        const dayBookings = initialBookings.filter(b => isSameDay(new Date(b.slot.startTime), cloneDay));
        const totalBookings = dayBookings.length;

        // Keep it realistic without mock randomness to pass purity rules
        const total = totalBookings;

        days.push(
            <div
                className={cn(
                    "min-h-[100px] border border-white/5 p-2 transition-all hover:bg-white/5 flex flex-col",
                    !isSameMonth(day, currentDate) ? "opacity-30" : "opacity-100",
                    isSameDay(day, new Date()) ? "bg-blue-500/10 border-blue-500/30" : "bg-white/[0.02]"
                )}
                key={day.toString()}
            >
                <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                        "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                        isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-gray-300"
                    )}>
                        {formattedDate}
                    </span>
                </div>
                
                {/* Bookings Indication */}
                <div className="flex-1 space-y-1 overflow-y-auto scrollbar-none">
                    {total > 0 && Array.from({length: Math.min(total, 3)}).map((_, idx) => (
                        <div key={idx} className="text-[10px] px-1.5 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/30 truncate">
                            Booked Slot
                        </div>
                    ))}
                    {total > 3 && (
                        <div className="text-[10px] px-1.5 py-1 text-gray-500">
                            +{total - 3} more
                        </div>
                    )}
                    {total === 0 && day > new Date() && (
                        <div className="text-[10px] px-1.5 py-1 text-green-400">
                            Fully Available
                        </div>
                    )}
                </div>
            </div>
        );
        day = addDays(day, 1);
        }
        rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
            {days}
        </div>
        );
        days = [];
    }

    return (
        <GlassPane className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-display font-bold text-2xl">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button onClick={nextMonth} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-black/20">
                {rows}
            </div>

            <div className="mt-8 flex gap-4 text-sm justify-center items-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />
                    <span className="text-gray-400">Booked Slot</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/5 border border-white/10" />
                    <span className="text-gray-400">Available</span>
                </div>
            </div>
        </GlassPane>
    );
}
