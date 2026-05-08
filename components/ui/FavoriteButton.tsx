'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function FavoriteButton({ venueId, initialFavorited = false, className = '' }: { venueId: string, initialFavorited?: boolean, className?: string }) {
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session) return;
        // Check if favorited globally? No, for individual items better to check per list.
        // We'll trust initialFavorited but can fetch if needed.
    }, [session]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!session) {
            alert("Please login to add favorites.");
            return;
        }

        const prev = isFavorited;
        setIsFavorited(!prev);

        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ venueId })
            });
            const data = await res.json();
            if (res.ok) {
                setIsFavorited(data.favorited);
            } else {
                setIsFavorited(prev);
            }
        } catch (e) {
            console.error(e);
            setIsFavorited(prev);
        }
    };

    return (
        <button 
            onClick={toggleFavorite}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${isFavorited ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-black/20 text-white hover:bg-black/40'} ${className}`}
        >
            <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
    );
}
