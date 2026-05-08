'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { GlassPane } from './GlassPane';

export function LeaveReview({ venueId }: { venueId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId, rating, comment, userId: '1' }) // Mock userId 1
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit review");
      }
    } catch (e) {
      alert("Error submitting review");
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <GlassPane className="p-6 mt-8 text-center border-green-500/30">
        <h3 className="text-xl font-display font-bold text-green-400 mb-2">Thank you!</h3>
        <p className="text-gray-300">Your review has been successfully submitted.</p>
      </GlassPane>
    );
  }

  return (
    <GlassPane className="p-6 mt-8">
      <h3 className="font-display text-xl font-bold mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Rating</label>
          <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setRating(idx)}
                onMouseEnter={() => setHoverRating(idx)}
                className="focus:outline-none"
              >
                <Star 
                  className={`w-8 h-8 transition-colors ${
                    idx <= (hoverRating || rating) 
                      ? "text-yellow-500 fill-yellow-500" 
                      : "text-gray-600"
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors min-h-[100px]"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </GlassPane>
  );
}
