import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(venueId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to the socket server
    const socketio = io({
      path: '/socket.io', // default Next.js custom server path
    });

    setTimeout(() => {
      setSocket(socketio);
    }, 0);

    socketio.on('connect', () => {
      console.log('Socket connected:', socketio.id);
      socketio.emit('joinVenue', venueId);
    });

    return () => {
      socketio.emit('leaveVenue', venueId);
      socketio.disconnect();
    };
  }, [venueId]);

  return socket;
}
