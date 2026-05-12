import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: dev && process.env.NODE_ENV !== 'test' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    // Let Next.js handle the request
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const activeLocks = new Map();

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    socket.on('joinVenue', (venueId) => {
      socket.join(`venue_${venueId}`);
      console.log(`Socket ${socket.id} joined venue_${venueId}`);
    });

    socket.on('leaveVenue', (venueId) => {
      socket.leave(`venue_${venueId}`);
    });

    // Handle slot locking (optimistic locking)
    socket.on('lockSlot', ({ venueId, slotId, userId }) => {
      const lockKey = `${venueId}_${slotId}`;
      
      // Clear existing timeout if any
      if (activeLocks.has(lockKey)) {
        clearTimeout(activeLocks.get(lockKey).timeoutId);
      }

      // Auto-unlock after 5 mins (300000 ms)
      const timeoutId = setTimeout(() => {
         io.to(`venue_${venueId}`).emit('slotUnlocked', { slotId });
         activeLocks.delete(lockKey);
      }, 300000);

      activeLocks.set(lockKey, { userId, timeoutId });

      // Broadcast to others in the venue room that it's temporarily locked
      socket.to(`venue_${venueId}`).emit('slotLocked', { slotId, userId });
    });

    socket.on('unlockSlot', ({ venueId, slotId }) => {
      const lockKey = `${venueId}_${slotId}`;
      if (activeLocks.has(lockKey)) {
        clearTimeout(activeLocks.get(lockKey).timeoutId);
        activeLocks.delete(lockKey);
      }
      socket.to(`venue_${venueId}`).emit('slotUnlocked', { slotId });
    });

    socket.on('bookSlot', ({ venueId, slotId, bookingData }) => {
      const lockKey = `${venueId}_${slotId}`;
      if (activeLocks.has(lockKey)) {
        clearTimeout(activeLocks.get(lockKey).timeoutId);
        activeLocks.delete(lockKey);
      }
      // In reality, you'd save this to Prisma first, then emit
      io.to(`venue_${venueId}`).emit('slotBooked', { slotId, bookingData });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch(err => {
  console.error("Error starting server:", err);
});
