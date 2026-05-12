import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { venueId, date, timeSlot, userId } = await req.json();

    if (!venueId || !date || !timeSlot || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if slot is already confirmed
    const existing = await prisma.booking.findFirst({
      where: {
        venueId,
        date: new Date(date),
        timeSlot,
        status: "CONFIRMED"
      }
    });

    if (existing) {
      return NextResponse.json({ error: "This slot is already booked" }, { status: 400 });
    }

    // Create a pending booking
    const booking = await prisma.booking.create({
      data: {
        venueId,
        date: new Date(date),
        timeSlot,
        userId,
        status: "PENDING",
        amount: 25.0
      }
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      amount: booking.amount
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
