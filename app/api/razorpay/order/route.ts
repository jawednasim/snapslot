import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slotId, venueId, total } = body;
        
        const session = await getServerSession(authOptions);

        // In a real application, Razorpay keys should come from environment variables.
        // If they are missing, we can simulate the order creation or throw an error.
        const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key';
        const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';

        // Check if the slot is still available before payment
        const slot = await prisma.slot.findUnique({ where: { id: slotId } });
        if (!slot || slot.status === 'BOOKED') {
            return NextResponse.json({ success: false, error: 'Slot is no longer available' }, { status: 400 });
        }

        // Just creating a mock order response if the environment variable is missing so it doesn't crash on preview
        let order;
        if (key_id === 'rzp_test_mock_key') {
             order = { id: `order_mock_${Date.now()}`, amount: total * 100, currency: "INR" };
        } else {
            const razorpay = new Razorpay({ key_id, key_secret });
            order = await razorpay.orders.create({
                amount: total * 100, // amount in smallest currency unit
                currency: "INR",
                receipt: `receipt_${slotId}_${Date.now()}`
            });
        }

        let userId = session?.user ? (session.user as any).id : null;

        // Create a PENDING booking in our database
        // Need to simulate user id for now if no auth.
        if (!userId) {
            let user = await prisma.user.findFirst();
            if (!user) {
                user = await prisma.user.create({ data: { email: 'guest@example.com', name: 'Guest', role: 'USER' } });
            }
            userId = user.id;
        }

        const booking = await prisma.booking.create({
            data: {
                userId: userId,
                venueId,
                slotId,
                total,
                status: 'PENDING'
            }
        });

        // Create PENDING payment
        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                amount: total,
                status: 'PENDING'
            }
        });

        return NextResponse.json({ success: true, order, bookingId: booking.id });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
