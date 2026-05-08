import { prisma } from '@/lib/prisma';
import { GlassPane } from '@/components/ui/GlassPane';
import { VenueTable } from './VenueTable';

export const dynamic = 'force-dynamic';

export default async function AdminVenuesPage() {
    const venues = await prisma.venue.findMany({
        include: { owner: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <GlassPane className="p-6">
            <h2 className="font-display font-bold text-xl mb-6">Venue Management</h2>
            <VenueTable venues={venues} />
        </GlassPane>
    );
}
