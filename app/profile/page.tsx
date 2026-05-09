import { Navbar } from '@/components/ui/Navbar';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProfileClient } from '@/components/ui/ProfileClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  let userId = session?.user ? (session.user as any).id : null;

  // Mock fallback if we don't have a user session for prototype
  if (!userId) {
     const firstUser = await prisma.user.findFirst();
     userId = firstUser?.id;
  }

  if (!userId) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ownerProfile: true }
  });

  const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { venue: true, slot: true },
      orderBy: { createdAt: 'desc' }
  });

  const favoritesRaw = await prisma.favorite.findMany({
      where: { userId },
      include: { venue: true },
      orderBy: { createdAt: 'desc' }
  });

  const favorites = favoritesRaw.map(f => f.venue);

  return (
    <main className="min-h-screen pt-24 pb-12 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold mb-8">My Profile</h1>
        <ProfileClient user={user} bookings={bookings} favorites={favorites} />
      </div>
    </main>
  );
}
