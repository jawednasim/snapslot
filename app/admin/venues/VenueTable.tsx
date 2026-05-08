'use client';

import { useState, useMemo } from 'react';
import { VenueStatusDropdown } from './VenueStatusDropdown';
import { bulkUpdateVenueStatus } from '../actions';
import { CheckSquare, Square, Check, X, ArrowUpDown } from 'lucide-react';

export function VenueTable({ venues }: { venues: any[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === venues.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(venues.map(v => v.id));
        }
    };

    const handleBulkApprove = async () => {
        if (!selectedIds.length) return;
        setIsUpdating(true);
        await bulkUpdateVenueStatus(selectedIds, 'APPROVED');
        setSelectedIds([]);
        setIsUpdating(false);
    };

    const handleBulkReject = async () => {
        if (!selectedIds.length) return;
        setRejectModalOpen(true);
    };

    const confirmReject = async () => {
        setIsUpdating(true);
        await bulkUpdateVenueStatus(selectedIds, 'REJECTED', rejectionReason);
        setRejectModalOpen(false);
        setRejectionReason('');
        setSelectedIds([]);
        setIsUpdating(false);
    };

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedVenues = useMemo(() => {
        let sortableVenues = [...venues];
        if (sortConfig !== null) {
            sortableVenues.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                if (sortConfig.key === 'ownerName') {
                    aValue = a.owner?.name?.toLowerCase() || '';
                    bValue = b.owner?.name?.toLowerCase() || '';
                } else if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableVenues;
    }, [venues, sortConfig]);

    const renderSortIcon = (columnKey: string) => {
        if (sortConfig?.key === columnKey) {
            return sortConfig.direction === 'asc' 
                ? <ArrowUpDown className="w-3 h-3 ml-1 inline-block opacity-100 text-blue-400 rotate-180" />
                : <ArrowUpDown className="w-3 h-3 ml-1 inline-block opacity-100 text-blue-400" />;
        }
        return <ArrowUpDown className="w-3 h-3 ml-1 inline-block opacity-50" />;
    };

    return (
        <div>
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-4 mb-4 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                    <span className="text-sm font-medium text-blue-400">{selectedIds.length} selected</span>
                    <button 
                        onClick={handleBulkApprove} 
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full hover:bg-green-500/30 transition-colors"
                    >
                        <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button 
                        onClick={handleBulkReject} 
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full hover:bg-red-500/30 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" /> Reject
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-white/5">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg w-12">
                                <button onClick={toggleSelectAll} className="text-gray-400 hover:text-white">
                                    {selectedIds.length === venues.length && venues.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                </button>
                            </th>
                            <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('name')}>
                                Venue {renderSortIcon('name')}
                            </th>
                            <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('category')}>
                                Category {renderSortIcon('category')}
                            </th>
                            <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('ownerName')}>
                                Owner {renderSortIcon('ownerName')}
                            </th>
                            <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('price')}>
                                Price {renderSortIcon('price')}
                            </th>
                            <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors rounded-r-lg" onClick={() => requestSort('status')}>
                                Status {renderSortIcon('status')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedVenues.map((v) => (
                            <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-4 py-4">
                                    <button onClick={() => toggleSelect(v.id)} className="text-gray-400 hover:text-white">
                                        {selectedIds.includes(v.id) ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4" />}
                                    </button>
                                </td>
                                <td className="px-4 py-4 font-medium text-gray-200">
                                    {v.name}
                                    <div className="text-xs text-gray-500 mt-1">{v.location}</div>
                                </td>
                                <td className="px-4 py-4 text-gray-400">{v.category}</td>
                                <td className="px-4 py-4 text-gray-400">
                                    {v.owner?.name || 'Anonymous'}
                                    <div className="text-xs text-gray-500 mt-1">{v.owner?.email}</div>
                                </td>
                                <td className="px-4 py-4 font-medium">₹{v.price}/hr</td>
                                <td className="px-4 py-4">
                                    <div className="relative group inline-block">
                                        <VenueStatusDropdown venue={v} />
                                        {v.status === 'REJECTED' && v.rejectionReason && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                                                <div className="bg-gray-800 text-xs text-white p-2.5 rounded-lg shadow-xl border border-white/10 relative">
                                                    <span className="font-semibold text-red-400 block mb-1">Rejection Reason</span>
                                                    <span className="text-gray-300">{v.rejectionReason}</span>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md p-6">
                        <h3 className="font-display text-xl font-bold mb-4">Reject Venues</h3>
                        <p className="text-sm text-gray-400 mb-4">Please provide a reason for rejecting the selected venues. This will be visible to the venue owners.</p>
                        <textarea 
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 mb-4 h-32 resize-none text-white"
                            placeholder="Enter rejection reason..."
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setRejectModalOpen(false)}
                                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmReject}
                                disabled={isUpdating || !rejectionReason.trim()}
                                className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? 'Rejecting...' : 'Reject Venues'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
