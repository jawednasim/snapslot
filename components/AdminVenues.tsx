"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Check, X } from "lucide-react";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

type Venue = {
  id: string;
  name: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  createdAt?: any;
};

export function AdminVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const q = query(collection(db, "venues"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbVenues = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Venue[];
      setVenues(dbVenues);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "venues");
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "venues", id), {
        status: "APPROVED",
        rejectionReason: null
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `venues/${id}`);
    }
  };

  const openRejectModal = (venue: Venue) => {
    setSelectedVenue(venue);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedVenue) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      await updateDoc(doc(db, "venues", selectedVenue.id), {
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      });
      setRejectModalOpen(false);
      setSelectedVenue(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `venues/${selectedVenue.id}`);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading venues...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {venues.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No venues found</td>
            </tr>
          ) : (
            venues.map((venue) => (
              <tr key={venue.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{venue.name || "Unnamed Venue"}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{venue.description}</div>
                  {venue.status === "REJECTED" && venue.rejectionReason && (
                    <div className="text-xs text-red-500 mt-1">Reason: {venue.rejectionReason}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${venue.status === "APPROVED" ? "bg-green-100 text-green-800" : 
                      venue.status === "REJECTED" ? "bg-red-100 text-red-800" : 
                      "bg-yellow-100 text-yellow-800"}`}>
                    {venue.status || "PENDING"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {venue.status !== "APPROVED" && (
                    <button
                      onClick={() => handleApprove(venue.id)}
                      className="text-green-600 hover:text-green-900 mx-2 p-1 bg-green-50 rounded-full inline-flex items-center"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {venue.status !== "REJECTED" && (
                    <button
                      onClick={() => openRejectModal(venue)}
                      className="text-red-600 hover:text-red-900 mx-2 p-1 bg-red-50 rounded-full inline-flex items-center"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Reject Venue</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting <strong>{selectedVenue?.name}</strong>.
            </p>
            <textarea
              className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="E.g., Incomplete information, does not meet criteria..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
