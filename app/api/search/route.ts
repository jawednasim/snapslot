import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    if (!q) return NextResponse.json([]);
    
    // SQLite does not support mode: 'insensitive' via Prisma easily, so we use contains
    // Note: SQLite LIKE is case-insensitive by default for ASCII characters.
    const venues = await prisma.venue.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { location: { contains: q } },
          { category: { contains: q } }
        ],
        status: { in: ['APPROVED', 'PENDING'] } // Including pending temporarily to allow matching newly added
      },
      take: 6,
      include: {
        reviews: true
      }
    });

    return NextResponse.json(venues);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
