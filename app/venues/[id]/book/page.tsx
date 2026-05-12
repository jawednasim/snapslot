"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth, app } from "@/lib/firebase";

export default function BookVenuePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "confirm" | "success">("idle");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const db = getFirestore(app);
        const venueDoc = await getDoc(doc(db, "venues", id));
        if (venueDoc.exists()) {
          setVenue({ id: venueDoc.id, ...venueDoc.data() });
        } else {
          setError("Venue not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVenue();
  }, [id]);

  const handleBook = async () => {
    if (!date || !timeSlot) {
      alert("Please select a date and time slot.");
      return;
    }
    setBookingStatus("loading");

    try {
      // Create order via API
      const response = await fetch("/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId: id,
          date,
          timeSlot,
          userId: auth.currentUser?.uid || "mock-user-123"
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create order");

      setOrderDetails(data);
      setBookingStatus("confirm");
    } catch (err: any) {
      alert(err.message);
      setBookingStatus("idle");
    }
  };

  const handleConfirmPayment = async () => {
    setBookingStatus("loading");
    try {
      // Confirm booking
      const response = await fetch("/api/bookings/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: orderDetails.bookingId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to confirm payment");

      setBookingStatus("success");
    } catch (err: any) {
      alert(err.message);
      setBookingStatus("confirm");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading venue...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (bookingStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your slot on {date} at {timeSlot} for {venue?.name} has been successfully booked.</p>
          <button
            onClick={() => router.push("/venues")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">{venue?.name}</h1>
          <p className="text-gray-500 mt-2">{venue?.description}</p>
        </div>

        {bookingStatus === "confirm" ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Payment</h2>
            <div className="bg-gray-50 border rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Venue</span>
                <span className="font-semibold">{venue?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold">{date}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Time Slot</span>
                <span className="font-semibold">{timeSlot}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>$25.00</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6 text-center">
              (This is a mock payment gateway step)
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setBookingStatus("idle")}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Pay & Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Select a Slot</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-3 gap-3">
                  {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-4 rounded-lg border text-sm font-medium transition ${
                        timeSlot === slot
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300 text-gray-700 hover:border-blue-500"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBook}
                disabled={bookingStatus === "loading"}
                className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {bookingStatus === "loading" ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
