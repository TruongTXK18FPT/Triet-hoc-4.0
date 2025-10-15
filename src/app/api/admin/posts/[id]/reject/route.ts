import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (session?.user?.email !== 'admin@mln131.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  await prisma.post.update({
    where: { id },
    data: {
      status: 'REJECTED',
    },
  });

  return NextResponse.json({ success: true });
}
