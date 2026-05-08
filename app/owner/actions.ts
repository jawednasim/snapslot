'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function createVenue(data: { name: string, description: string, location: string, price: number, category: string, imageUrl: string, ownerIds: string[] }) {
    const session = await getServerSession(authOptions);
    
    let ownerId = session?.user ? (session.user as any).id : null;
    
    if (!ownerId) {
        let owner = await prisma.user.findFirst({ where: { role: 'OWNER' } });
        if (!owner) {
            owner = await prisma.user.findFirst();
        }
        if (!owner) {
            owner = await prisma.user.create({
                data: {
                    email: 'dummyowner@example.com',
                    name: 'Dummy Owner',
                    role: 'OWNER'
                }
            });
        }
        ownerId = owner.id;
    }

    try {
        await prisma.venue.create({
            data: {
                name: data.name,
                description: data.description,
                location: data.location,
                price: Number(data.price),
                category: data.category,
                imageUrl: data.imageUrl,
                ownerId: ownerId,
                status: 'PENDING'
            }
        });

        revalidatePath('/owner');
        revalidatePath('/admin/venues');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
