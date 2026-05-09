'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: { name: string; phone?: string; }) {
  const session = await getServerSession(authOptions);
  let userId = session?.user ? (session.user as any).id : null;

  if (!userId) {
     // Mock fallback if not using true auth for testing
     const firstUser = await prisma.user.findFirst();
     userId = firstUser?.id;
  }

  if (!userId) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name
    }
  });
  
  if (data.phone) {
      await prisma.ownerProfile.upsert({
          where: { userId: userId },
          update: { phone: data.phone },
          create: { userId: userId, phone: data.phone }
      });
  }

  revalidatePath('/profile');
  return { success: true };
}
