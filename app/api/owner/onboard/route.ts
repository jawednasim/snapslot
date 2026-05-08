import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        // Ensure user is an OWNER. Since we don't have auth, just use a dummy owner id or create one.
        // Let's create a new owner user or fetch a default one to simulate auth.
        let owner = await prisma.user.findFirst({ where: { role: 'OWNER' } });
        if (!owner) {
            owner = await prisma.user.create({
                data: {
                    email: body.email || 'owner' + Math.random() + '@example.com',
                    name: body.ownerName,
                    role: 'OWNER'
                }
            });
        }
        
        // Upsert Owner Profile
        await prisma.ownerProfile.upsert({
            where: { userId: owner.id },
            update: {
                phone: body.phone,
                alternatePhone: body.alternatePhone,
                bankHolderName: body.bankHolderName,
                accountNumber: body.accountNumber,
                ifscCode: body.ifscCode,
                upiId: body.upiId,
            },
            create: {
                userId: owner.id,
                phone: body.phone,
                alternatePhone: body.alternatePhone,
                bankHolderName: body.bankHolderName,
                accountNumber: body.accountNumber,
                ifscCode: body.ifscCode,
                upiId: body.upiId,
            }
        });

        // Create Venue
        const venue = await prisma.venue.create({
            data: {
                ownerId: owner.id,
                name: body.venueName,
                description: body.description || '',
                category: body.category || 'TURF',
                location: body.address || '',
                city: body.city || '',
                state: body.state || '',
                pincode: body.pincode || '',
                price: parseFloat(body.price) || 1000,
                imageUrl: body.coverImage || '',
                gallery: JSON.stringify(body.gallery || []),
                size: body.size || '',
                surface: body.surface || '',
                sports: JSON.stringify(body.sports || []),
                facilities: JSON.stringify(body.facilities || {}),
                openTime: body.openTime || '06:00',
                closeTime: body.closeTime || '23:00',
                status: 'PENDING'
            }
        });

        return NextResponse.json({ success: true, venueId: venue.id });
    } catch (error) {
        console.error('Failed to submit onboarding:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
