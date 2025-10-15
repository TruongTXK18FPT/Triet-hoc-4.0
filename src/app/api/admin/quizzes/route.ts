import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== 'admin@mln131.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      questions: { select: { id: true } },
    },
  });

  return NextResponse.json(quizzes);
}
