import { prisma } from '@/lib/prisma';
import { GlassPane } from '@/components/ui/GlassPane';
import { AdminBookingsClient } from './AdminBookingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
    const bookings = await prisma.booking.findMany({
        include: { 
            user: true, 
            venue: true,
            slot: true 
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <GlassPane className="p-6">
            <h2 className="font-display font-bold text-xl mb-6">All Bookings</h2>
            <AdminBookingsClient bookings={bookings} />
        </GlassPane>
    );
}
