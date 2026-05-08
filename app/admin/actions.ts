'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, role: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateVenueStatus(venueId: string, status: string, rejectionReason?: string) {
    try {
        await prisma.venue.update({
            where: { id: venueId },
            data: { status, rejectionReason },
        });
        revalidatePath('/admin/venues');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateBookingStatus(bookingId: string, status: string) {
    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status },
        });
        revalidatePath('/admin/bookings');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
export async function bulkUpdateVenueStatus(venueIds: string[], status: string, rejectionReason?: string) {
    try {
        await prisma.venue.updateMany({
            where: { id: { in: venueIds } },
            data: { status, rejectionReason },
        });
        revalidatePath('/admin/venues');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
