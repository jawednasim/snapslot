const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // 1. Create a mock owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@snapslot.com' },
    update: {},
    create: {
      email: 'owner@snapslot.com',
      name: 'Test Owner',
      role: 'OWNER',
    },
  });

  // 2. Create venues
  const venue1 = await prisma.venue.create({
    data: {
      name: 'Elite Sports Arena',
      description: 'Premium sports arena for multiple sports',
      location: 'New Delhi, Sector 5',
      price: 1200,
      category: 'TURF',
      imageUrl: 'https://picsum.photos/seed/elite/800/600',
      status: 'APPROVED',
      ownerId: owner.id,
      reviews: {
        create: {
          rating: 5,
          userId: owner.id,
          comment: 'Great turf!'
        }
      }
    }
  });

  const venue2 = await prisma.venue.create({
    data: {
      name: 'Greenfields Cricket Ground',
      description: 'Well-maintained cricket ground',
      location: 'Mumbai, West End',
      price: 2500,
      category: 'CRICKET',
      imageUrl: 'https://picsum.photos/seed/cricket/800/600',
      status: 'APPROVED',
      ownerId: owner.id,
      reviews: {
        create: {
          rating: 4,
          userId: owner.id,
          comment: 'Perfect for weekend matches'
        }
      }
    }
  });

  const venue3 = await prisma.venue.create({
    data: {
      name: 'Neon Football Turf',
      description: 'State of the art 5v5 football turf',
      location: 'Bangalore, Tech Park',
      price: 1500,
      category: 'TURF',
      imageUrl: 'https://picsum.photos/seed/football/800/600',
      status: 'APPROVED',
      ownerId: owner.id,
      reviews: {
        create: {
          rating: 5,
          userId: owner.id,
          comment: 'Amazing lights and grass'
        }
      }
    }
  });

  console.log('Seeding complete. Created venues:', [venue1.name, venue2.name, venue3.name]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
