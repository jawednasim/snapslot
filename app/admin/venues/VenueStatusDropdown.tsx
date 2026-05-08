'use client';

import { useState } from 'react';
import { updateVenueStatus } from '../actions';

export function VenueStatusDropdown({ venue }: { venue: any }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (newStatus === 'REJECTED') {
            setRejectModalOpen(true);
        } else {
            setIsUpdating(true);
            await updateVenueStatus(venue.id, newStatus);
            setIsUpdating(false);
        }
    };

    const confirmReject = async () => {
        setIsUpdating(true);
        await updateVenueStatus(venue.id, 'REJECTED', rejectionReason);
        setRejectModalOpen(false);
        setRejectionReason('');
        setIsUpdating(false);
    };

    return (
        <>
            <div className="flex flex-col gap-1">
                <select 
                    value={venue.status} 
                    onChange={handleChange}
                    disabled={isUpdating}
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 w-full"
                >
                    <option className="bg-gray-900 text-white" value="PENDING">PENDING</option>
                    <option className="bg-gray-900 text-white" value="APPROVED">APPROVED</option>
                    <option className="bg-gray-900 text-white" value="REJECTED">REJECTED</option>
                </select>
                {venue.status === 'REJECTED' && venue.rejectionReason && (
                    <div className="text-[10px] text-red-400 mt-1 max-w-[150px] truncate" title={venue.rejectionReason}>
                        Reason: {venue.rejectionReason}
                    </div>
                )}
            </div>

            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md p-6">
                        <h3 className="font-display text-xl font-bold mb-4 text-white">Reject Venue</h3>
                        <p className="text-sm text-gray-400 mb-4">Reason for rejecting {venue.name}:</p>
                        <textarea 
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 mb-4 h-32 resize-none text-white"
                            placeholder="Enter rejection reason..."
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setRejectModalOpen(false)}
                                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/5 transition-colors text-white"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmReject}
                                disabled={isUpdating || !rejectionReason.trim()}
                                className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
