"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebase";
import Link from "next/link";

type Venue = {
  id: string;
  name: string;
  description: string;
  status: string;
};

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const db = getFirestore(app);
        const q = query(collection(db, "venues"), where("status", "==", "APPROVED"));
        const snapshot = await getDocs(q);
        const v = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Venue[];
        setVenues(v);
      } catch (err) {
        console.error(err);
        setError("Failed to load venues");
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading venues...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-8">Available Venues</h1>
        {venues.length === 0 ? (
          <p className="text-gray-500">No approved venues available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{venue.name || "Unnamed"}</h2>
                <p className="text-gray-500 mb-6 flex-grow">{venue.description || "No description provided."}</p>
                <Link
                  href={`/venues/${venue.id}/book`}
                  className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Book Slot
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
