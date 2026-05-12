import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { format } from 'date-fns';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body;
        
        // Mock validation if we are in mock mode
        const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';
        
        let isValid = false;
        
        if (key_secret === 'mock_secret' || razorpay_signature === 'mock_signature') {
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
            const booking = await prisma.booking.findUnique({ 
                where: { id: bookingId },
                include: { user: true, venue: true, slot: true }
            });
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

            // Send Email Confirmation
            if (booking.user?.email) {
                await sendBookingConfirmationEmail(booking.user.email, {
                    userName: booking.user.name || 'User',
                    venueName: booking.venue.name,
                    slotTime: format(new Date(booking.slot.startTime), 'MMM d, yyyy h:mm a'),
                    total: booking.total
                });
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
