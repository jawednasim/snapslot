import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const userId = (session.user as any).id;
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: { venue: true }
        });

        return NextResponse.json(favorites);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const userId = (session.user as any).id;
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { venueId } = body;

        if (!venueId) {
            return NextResponse.json({ error: 'Missing venueId' }, { status: 400 });
        }

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_venueId: { userId, venueId }
            }
        });

        if (existing) {
            await prisma.favorite.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ favorited: false });
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    venueId
                }
            });
            return NextResponse.json({ favorited: true });
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
