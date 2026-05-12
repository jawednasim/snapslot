import { Navbar } from '@/components/ui/Navbar';
import { VenueCard } from '@/components/ui/VenueCard';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/');
    }

    const userId = (session.user as any).id;
    const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: { venue: { include: { reviews: true } } },
        orderBy: { createdAt: 'desc' }
    });

    const venues = favorites.map(f => f.venue);

    return (
        <main className="min-h-screen pt-24 pb-12 font-sans">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display text-3xl font-bold mb-8">My Favorite Venues</h1>

                {venues.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-400 text-center py-12">
                        <p>You have not added any venues to your favorites yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
