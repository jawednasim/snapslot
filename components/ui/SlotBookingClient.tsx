'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';
import { GlassPane } from '@/components/ui/GlassPane';
import { format, addDays, startOfToday } from 'date-fns';
import { Check, Clock, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Slot {
  id: string;
  startTime: string | Date;
  status: 'AVAILABLE' | 'BOOKED' | 'LOCKED';
  lockedBy?: string | null;
}

export function SlotBookingClient({ venueId, venuePrice }: { venueId: string, venuePrice: number }) {
  const socket = useSocket(venueId);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Mock slots for the prototype
  const [slots, setSlots] = useState<Slot[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.email || 'guest';

  useEffect(() => {
    // Generate mock slots for the selected date
    const generatedSlots = [];
    const baseDate = selectedDate;
    for (let i = 8; i <= 22; i++) {
        const d = new Date(baseDate);
        d.setHours(i, 0, 0, 0);
        
        // Randomly set some as booked
        const isBooked = Math.random() > 0.8;
        
        generatedSlots.push({
            id: `slot_${format(d, 'yyyyMMdd_HH')}`,
            startTime: d,
            status: isBooked ? 'BOOKED' : 'AVAILABLE'
        });
    }
    const finalSlots = generatedSlots;
    setTimeout(() => {
       setSlots(finalSlots as any);
       setSelectedSlot(null);
    }, 0);
  }, [selectedDate]);

  useEffect(() => {
    if (!socket) return;
    
    const onSlotLocked = ({ slotId, userId: lockerId }: any) => {
        if (lockerId === userId) return;
        setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'LOCKED', lockedBy: lockerId } : s));
    };

    const onSlotUnlocked = ({ slotId }: any) => {
        setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'AVAILABLE', lockedBy: null } : s));
    };

    const onSlotBooked = ({ slotId }: any) => {
        setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'BOOKED', lockedBy: null } : s));
        if (selectedSlot === slotId) {
            setSelectedSlot(null);
            alert("This slot was just booked by someone else!");
        }
    };

    socket.on('slotLocked', onSlotLocked);
    socket.on('slotUnlocked', onSlotUnlocked);
    socket.on('slotBooked', onSlotBooked);

    return () => {
        socket.off('slotLocked', onSlotLocked);
        socket.off('slotUnlocked', onSlotUnlocked);
        socket.off('slotBooked', onSlotBooked);
    };
  }, [socket, selectedSlot, userId]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (selectedSlot) {
      // 5 minutes timeout = 300000 ms
      timeoutId = setTimeout(() => {
        alert("Your slot selection timed out due to inactivity. It is now unlocked.");
        socket?.emit('unlockSlot', { venueId, slotId: selectedSlot });
        setSelectedSlot(null);
      }, 300000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedSlot, socket, venueId]);

  const handleSlotClick = (slot: Slot) => {
      if (slot.status === 'BOOKED' || (slot.status === 'LOCKED' && slot.lockedBy !== userId)) return;
      
      // If unselecting
      if (selectedSlot === slot.id) {
          setSelectedSlot(null);
          socket?.emit('unlockSlot', { venueId, slotId: slot.id });
          return;
      }

      // If selecting a new one, unlock old one
      if (selectedSlot) {
          socket?.emit('unlockSlot', { venueId, slotId: selectedSlot });
      }

      setSelectedSlot(slot.id);
      socket?.emit('lockSlot', { venueId, slotId: slot.id, userId });
  };

  const handleBookClick = () => {
      if (!selectedSlot) return;
      setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
      if (!selectedSlot) return;
      setShowConfirmModal(false);
      try {
          const res = await fetch('/api/razorpay/order', {
              method: 'POST',
              body: JSON.stringify({ slotId: selectedSlot, venueId, total: venuePrice + 50 })
          });
          const data = await res.json();
          
          if (!data.success) {
              alert('Failed to initialize checkout: ' + data.error);
              return;
          }

          if ((window as any).Razorpay) {
              const options = {
                  key: 'rzp_test_mock_key', // This would be your public key
                  amount: data.order.amount,
                  currency: "INR",
                  name: "SnapSlot",
                  description: "Venue Booking",
                  order_id: data.order.id,
                  handler: async function (response: any) {
                      const verifyRes = await fetch('/api/razorpay/verify', {
                          method: 'POST',
                          body: JSON.stringify({
                              razorpay_order_id: response.razorpay_order_id,
                              razorpay_payment_id: response.razorpay_payment_id,
                              razorpay_signature: response.razorpay_signature,
                              bookingId: data.bookingId
                          })
                      });
                      const verifyData = await verifyRes.json();
                      if (verifyData.success) {
                          socket?.emit('bookSlot', { venueId, slotId: selectedSlot, bookingData: { userId } });
                          setSelectedSlot(null);
                          alert('Booking Confirmed!');
                      } else {
                          alert('Payment Verification Failed!');
                      }
                  },
                  theme: {
                      color: "#3B82F6"
                  }
              };
              const rzp1 = new (window as any).Razorpay(options);
              rzp1.open();
          } else {
              // Fallback if Razorpay script is not loaded
              setTimeout(() => {
                  socket?.emit('bookSlot', { venueId, slotId: selectedSlot, bookingData: { userId } });
                  setSelectedSlot(null);
                  alert('Booking Confirmed! (Simulated payment since Razorpay SDK is unavailable)');
              }, 1000);
          }
      } catch (e) {
          console.error(e);
          alert('An error occurred during booking');
      }
  };

  const dates = Array.from({ length: 7 }).map((_, i) => addDays(startOfToday(), i));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            {/* Date Selector */}
            <GlassPane className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="w-5 h-5 text-blue-400" />
                    <h3 className="font-display text-xl font-bold">Select Date</h3>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {dates.map((date) => {
                        const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                        return (
                            <button
                                key={date.toString()}
                                onClick={() => setSelectedDate(date)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[70px] py-3 rounded-2xl border transition-all flex-shrink-0",
                                    isSelected 
                                    ? "bg-blue-600 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                )}
                            >
                                <span className="text-xs text-gray-400">{format(date, 'MMM')}</span>
                                <span className={cn("text-xl font-bold font-display mt-0.5", isSelected ? "text-white" : "text-gray-200")}>{format(date, 'd')}</span>
                                <span className="text-xs mt-1 font-medium">{format(date, 'EEE')}</span>
                            </button>
                        );
                    })}
                </div>
            </GlassPane>

            {/* Slot Grid */}
            <GlassPane className="p-6 min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <h3 className="font-display text-xl font-bold">Available Slots</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-white/10 border border-white/20" /> Available</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" /> Selected</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" /> Booked</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    <AnimatePresence>
                        {slots.map(slot => {
                            const isSelected = selectedSlot === slot.id;
                            const isBooked = slot.status === 'BOOKED';
                            const isLocked = slot.status === 'LOCKED' && slot.lockedBy !== userId;
                            
                            return (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={slot.id}
                                    disabled={isBooked || isLocked}
                                    onClick={() => handleSlotClick(slot)}
                                    className={cn(
                                        "py-3 rounded-xl border text-sm font-medium transition-all relative overflow-hidden flex flex-col items-center justify-center",
                                        isSelected 
                                            ? "bg-blue-600 border-blue-500 text-white" 
                                            : isBooked || isLocked
                                            ? "bg-red-500/10 border-red-500/20 text-red-500/50 cursor-not-allowed hidden sm:flex" 
                                            : "bg-white/5 border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-gray-300"
                                    )}
                                >
                                    {isSelected && <Check className="absolute top-1 right-1 w-3 h-3 text-white" />}
                                    <span>{format(new Date(slot.startTime), 'h:mm a')}</span>
                                    {isLocked && !isSelected && <span className="text-[9px] mt-1 text-orange-400">Locking...</span>}
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </GlassPane>
        </div>

        {/* Checkout Summary */}
        <div className="lg:col-span-1">
            <GlassPane className="p-6 sticky top-24">
                <h3 className="font-display text-xl font-bold border-b border-white/10 pb-4 mb-4">Booking Summary</h3>
                
                {selectedSlot ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Date</span>
                            <span className="font-medium">{format(selectedDate, 'dd MMM yyyy')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                            <span className="text-gray-400">Time</span>
                            <span className="font-medium text-blue-400">
                                {format(slots.find(s => s.id === selectedSlot)?.startTime as Date, 'h:mm a')}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm pt-2">
                            <span className="text-gray-400">Court Fee (1 hr)</span>
                            <span>₹{venuePrice}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Convenience Tech Fee</span>
                            <span>₹50</span>
                        </div>
                        
                        <div className="flex justify-between items-center font-bold text-lg pt-4 border-t border-white/10">
                            <span>Total Payable</span>
                            <span className="text-blue-400">₹{venuePrice + 50}</span>
                        </div>

                        <button 
                            onClick={handleBookClick}
                            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:scale-[1.02]"
                        >
                            Pay & Book Now
                        </button>
                    </motion.div>
                ) : (
                    <div className="py-8 text-center text-gray-500 flex flex-col items-center">
                        <Clock className="w-10 h-10 mb-3 opacity-20" />
                        <p>Select an available slot to view summary and proceed.</p>
                    </div>
                )}
            </GlassPane>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
            {showConfirmModal && selectedSlot && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-[#0B0F1A] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
                    >
                        <h3 className="font-display text-2xl font-bold mb-6">Confirm Booking</h3>
                        
                        <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                <span className="text-gray-400">Date</span>
                                <span className="font-medium text-white">{format(selectedDate, 'dd MMM yyyy')}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                <span className="text-gray-400">Time</span>
                                <span className="font-medium text-white">{format(slots.find(s => s.id === selectedSlot)?.startTime as Date, 'h:mm a')}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg pt-1">
                                <span>Total Price</span>
                                <span className="text-blue-400">₹{venuePrice + 50}</span>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-sm text-orange-200">
                            <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before the slot. 50% refund between 24-12 hours. No refund within 12 hours of the booking.
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-3 px-4 rounded-full border border-white/10 font-bold hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmBooking}
                                className="flex-1 py-3 px-4 rounded-full bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
