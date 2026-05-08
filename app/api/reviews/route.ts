import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { venueId, rating, comment, userId } = await req.json();

    if (!venueId || !rating || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      // Mock creating user if not exist for prototype purposes
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `mockuser_${userId}@test.com`,
          name: 'Mock User',
        }
      });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        venueId,
        userId
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
