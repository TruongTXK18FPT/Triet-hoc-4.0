import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== 'admin@mln131.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Get post to award XP to author
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // Update post status
  await prisma.post.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Award XP to author for publishing blog
  try {
    // Get or create user profile
    let profile = await (prisma as any).userProfile.findUnique({
      where: { userId: post.authorId },
    });

    if (!profile) {
      profile = await (prisma as any).userProfile.create({
        data: { userId: post.authorId },
      });
    }

    // Award XP for blog published
    const xpEarned = 300; // BLOG_PUBLISHED from XP_REWARDS
    const newXp = profile.experience + xpEarned;
    
    // Calculate new level and rank
    const { calculateLevel, calculateRank } = await import('@/lib/gamification');
    const newLevel = calculateLevel(newXp);
    const newRank = calculateRank(newXp);

    // Update profile
    await (prisma as any).userProfile.update({
      where: { id: profile.id },
      data: {
        experience: newXp,
        level: newLevel,
        rank: newRank,
        blogsCreated: { increment: 1 },
      },
    });

    // Create activity log
    await (prisma as any).userActivity.create({
      data: {
        userId: profile.id,
        type: 'BLOG_PUBLISHED',
        description: `Xuất bản bài viết: ${post.title}`,
        xpEarned,
      },
    });

    console.log(`✅ Awarded ${xpEarned} XP to user ${post.authorId} for publishing blog`);
  } catch (error) {
    console.error('Failed to award XP for blog publish:', error);
    // Don't fail the approval if XP award fails
  }

  return NextResponse.json({ success: true });
}
