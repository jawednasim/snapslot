import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "CONFIRMED") {
      return NextResponse.json({ error: "Booking already confirmed" }, { status: 400 });
    }

    // Check again to avoid race conditions
    const existingConfirmed = await prisma.booking.findFirst({
      where: {
        venueId: booking.venueId,
        date: booking.date,
        timeSlot: booking.timeSlot,
        status: "CONFIRMED"
      }
    });

    if (existingConfirmed) {
      return NextResponse.json({ error: "Slot filled by another user" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" }
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
