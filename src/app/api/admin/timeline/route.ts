import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const schema = z.object({
  year: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== 'admin@mln131.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { year, title, description } = parsed.data;

  const maxOrder = await prisma.timelineEvent.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  await prisma.timelineEvent.create({
    data: {
      year: parseInt(year),
      title,
      summary: description,
      order: (maxOrder?.order || 0) + 1,
    },
  });

  return NextResponse.json({ success: true });
}
