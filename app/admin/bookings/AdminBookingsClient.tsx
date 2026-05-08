'use client';

import { useState } from 'react';
import { updateBookingStatus } from '../actions';

export function AdminBookingsClient({ bookings }: { bookings: any[] }) {
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [dateFilter, setDateFilter] = useState('');

    const filteredBookings = bookings.filter(b => {
        if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
        if (dateFilter) {
            const bookingDate = new Date(b.slot.startTime).toISOString().split('T')[0];
            if (bookingDate !== dateFilter) return false;
        }
        return true;
    });

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        await updateBookingStatus(bookingId, newStatus);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Filter by Status:</label>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white min-w-[150px]"
                    >
                        <option className="bg-gray-900 text-white" value="ALL">All Statuses</option>
                        <option className="bg-gray-900 text-white" value="PENDING">PENDING</option>
                        <option className="bg-gray-900 text-white" value="CONFIRMED">CONFIRMED</option>
                        <option className="bg-gray-900 text-white" value="CANCELLED">CANCELLED</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Filter by Date:</label>
                    <input 
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
                <div className="flex items-end">
                    {dateFilter && (
                        <button 
                            onClick={() => setDateFilter('')}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded text-sm text-gray-400 transition-colors"
                        >
                            Clear Date
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-white/5">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">User</th>
                            <th className="px-4 py-3">Venue</th>
                            <th className="px-4 py-3">Slot Time</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3 rounded-r-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    No bookings match your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((b) => (
                                <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-4 text-gray-300">
                                        <div className="font-medium text-gray-200">{b.user?.name || 'Anonymous'}</div>
                                        <div className="text-xs text-gray-500">{b.user?.email}</div>
                                    </td>
                                    <td className="px-4 py-4 font-medium text-gray-200">
                                        {b.venue?.name}
                                    </td>
                                    <td className="px-4 py-4 text-gray-400">
                                        <div>{new Date(b.slot.startTime).toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(b.slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(b.slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-medium text-gray-200">
                                        ₹{b.total}
                                    </td>
                                    <td className="px-4 py-4">
                                        <select 
                                            value={b.status} 
                                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                                        >
                                            <option className="bg-gray-900 text-white" value="PENDING">PENDING</option>
                                            <option className="bg-gray-900 text-white" value="CONFIRMED">CONFIRMED</option>
                                            <option className="bg-gray-900 text-white" value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
