import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== 'admin@mln131.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get('status'); // 'PENDING', 'PUBLISHED', 'DRAFT', or null for all

  const where = status ? { status: status as any } : {};

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return NextResponse.json(posts);
}

// Delete post (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== 'admin@mln131.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = await req.json();

  if (!postId) {
    return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return NextResponse.json({ success: true });
}
