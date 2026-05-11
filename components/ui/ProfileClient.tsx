'use client';

import { useState } from 'react';
import { GlassPane } from '@/components/ui/GlassPane';
import { User, Ticket, Heart, Settings, MapPin, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { updateProfile } from '@/app/profile/actions';

export function ProfileClient({ 
    user, 
    bookings, 
    favorites 
}: { 
    user: any, 
    bookings: any[], 
    favorites: any[] 
}) {
    const [activeTab, setActiveTab] = useState<'info'|'bookings'|'favorites'>('bookings');
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.ownerProfile?.phone || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile({ name, phone });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            setMessage('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const upcomingBookings = bookings.filter(b => new Date(b.slot.startTime) > new Date());
    const pastBookings = bookings.filter(b => new Date(b.slot.startTime) <= new Date());

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <GlassPane className="p-4 flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'bookings' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-gray-300'}`}
                    >
                        <Ticket className="w-5 h-5" />
                        <span className="font-medium">My Bookings</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('favorites')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'favorites' ? 'bg-rose-500/20 text-rose-400' : 'hover:bg-white/5 text-gray-300'}`}
                    >
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Favorites</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'info' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'}`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Account Info</span>
                    </button>
                </GlassPane>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {activeTab === 'info' && (
                    <GlassPane className="p-6 md:p-8">
                        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                            <User className="text-gray-400" />
                            Personal Information
                        </h2>
                        {message && (
                            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleSave} className="space-y-6 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email (Read Only)</label>
                                <input 
                                    type="text" 
                                    value={user?.email || 'guest@example.com'} 
                                    disabled 
                                    className="w-full bg-[#0f172a] border border-white/5 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </GlassPane>
                )}

                {activeTab === 'bookings' && (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-white">Upcoming Bookings</h2>
                            {upcomingBookings.length === 0 ? (
                                <GlassPane className="p-8 text-center text-gray-400 border-dashed">
                                    No upcoming bookings. Time to get back on the field!
                                </GlassPane>
                            ) : (
                                <div className="grid gap-4">
                                {upcomingBookings.map((booking: any) => (
                                    <GlassPane key={booking.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border-l-4 border-l-blue-500">
                                        <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden relative flex-shrink-0">
                                            <Image src={booking.venue.imageUrl || 'https://picsum.photos/seed/turf/400'} alt={booking.venue.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg text-white">
                                                    <Link href={`/venue/${booking.venueId}`} className="hover:text-blue-400 transition-colors">{booking.venue.name}</Link>
                                                </h3>
                                                <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-400 flex flex-col gap-1 mb-3">
                                                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {booking.venue.location}</span>
                                                <span className="flex items-center gap-1.5 text-gray-300">
                                                    <Clock className="w-3.5 h-3.5 text-blue-400"/> 
                                                    {new Date(booking.slot.startTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </GlassPane>
                                ))}
                                </div>
                            )}
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-gray-400">Past Bookings</h2>
                            {pastBookings.length === 0 ? (
                                <p className="text-gray-500">No past bookings found.</p>
                            ) : (
                                <div className="grid gap-4 opacity-70">
                                {pastBookings.map((booking: any) => (
                                    <GlassPane key={booking.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                        <div className="w-full sm:w-24 h-16 rounded-lg overflow-hidden relative flex-shrink-0 grayscale">
                                            <Image src={booking.venue.imageUrl || 'https://picsum.photos/seed/turf/400'} alt={booking.venue.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="font-semibold text-gray-300">
                                                <Link href={`/venue/${booking.venueId}`}>{booking.venue.name}</Link>
                                            </h3>
                                            <span className="text-sm text-gray-500 mt-1">
                                                {new Date(booking.slot.startTime).toLocaleDateString()} • ₹{booking.total}
                                            </span>
                                        </div>
                                    </GlassPane>
                                ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'favorites' && (
                    <div>
                        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                            <Heart className="text-rose-500" />
                            Saved Venues
                        </h2>
                        {favorites.length === 0 ? (
                            <GlassPane className="p-8 text-center text-gray-400 border-dashed">
                                You haven&apos;t saved any venues yet.
                            </GlassPane>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {favorites.map((venue: any) => (
                                    <GlassPane key={venue.id} className="overflow-hidden group flex flex-col">
                                        <div className="h-40 relative">
                                            <Image src={venue.imageUrl || 'https://picsum.photos/seed/venue/400'} alt={venue.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur rounded-full text-rose-500">
                                                <Heart className="w-4 h-4 fill-current" />
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg mb-1">{venue.name}</h3>
                                            <p className="text-sm text-gray-400 flex items-center gap-1 mb-3">
                                                <MapPin className="w-3.5 h-3.5" /> {venue.location}
                                            </p>
                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="font-semibold text-blue-400">₹{venue.price}<span className="text-xs text-gray-500 font-normal">/hr</span></span>
                                                <Link href={`/venue/${venue.id}`} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </GlassPane>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
