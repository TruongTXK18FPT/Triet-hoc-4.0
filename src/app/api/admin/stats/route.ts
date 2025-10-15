import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();
  if (session?.user?.email !== 'admin@mln131.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [totalUsers, totalPosts, totalQuizzes, totalRoadmaps, pendingPosts] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.quiz.count(),
    prisma.roadmap.count(),
    prisma.post.count({ where: { status: 'PENDING' } }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalPosts,
    totalQuizzes,
    totalRoadmaps,
    pendingPosts,
  });
}
