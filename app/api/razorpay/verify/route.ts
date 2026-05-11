import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body;
        
        // Mock validation if we are in mock mode
        const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';
        
        let isValid = false;
        
        if (key_secret === 'mock_secret') {
             // We're mocking the transaction for preview
             isValid = true;
        } else {
             const shasum = crypto.createHmac('sha256', key_secret);
             shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
             const digest = shasum.digest('hex');
             
             if (digest === razorpay_signature) {
                 isValid = true;
             }
        }

        if (isValid) {
            // Transaction is successful
            
            // Get booking to find the slot
            const booking = await prisma.booking.findUnique({ where: { id: bookingId }});
            if (!booking) {
                 return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
            }

            // Confirm payment
            await prisma.payment.updateMany({
                where: { bookingId: booking.id },
                data: {
                    status: 'SUCCESS',
                    razorpayId: razorpay_payment_id || `mock_payment_${Date.now()}`
                }
            });

            // Confirm booking
            await prisma.booking.update({
                where: { id: booking.id },
                data: { status: 'CONFIRMED' }
            });

            // Mark slot as BOOKED
            await prisma.slot.update({
                where: { id: booking.slotId },
                data: { status: 'BOOKED', isLocked: false }
            });

            // Send booking confirmation email
            const fullBooking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { user: true, venue: true, slot: true }
            });

            if (fullBooking?.user?.email) {
                const { sendBookingConfirmation } = await import('@/lib/mail');
                await sendBookingConfirmation(
                    fullBooking.user.email,
                    {
                        userName: fullBooking.user.name || 'User',
                        venueName: fullBooking.venue.name,
                        location: fullBooking.venue.location,
                        date: new Date(fullBooking.slot.startTime).toLocaleDateString(),
                        time: `${new Date(fullBooking.slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(fullBooking.slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
                        amount: fullBooking.total,
                        bookingId: fullBooking.id
                    }
                );
            }

            return NextResponse.json({ success: true, message: 'Payment verified successfully' });
        } else {
            // Failed signature validation
            await prisma.payment.updateMany({
                where: { bookingId: bookingId },
                data: { status: 'FAILED' }
            });
            await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CANCELLED' }
            });
            
            return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
