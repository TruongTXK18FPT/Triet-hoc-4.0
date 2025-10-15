import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });
  if (!post || post.status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });
  }
  return NextResponse.json(post);
}


