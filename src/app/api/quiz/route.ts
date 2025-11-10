import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createQuizSchema = z.object({
  title: z.string().min(5, 'Tiêu đề cần có ít nhất 5 ký tự.'),
  description: z.string().min(10, 'Mô tả cần có ít nhất 10 ký tự.'),
  isPublic: z.boolean().default(true),
  questions: z.array(
    z.object({
      prompt: z.string().min(10, 'Câu hỏi cần có ít nhất 10 ký tự.'),
      options: z.array(z.string()).min(2).max(6),
      answer: z.number().int().min(0).optional(),
      answers: z.array(z.number().int().min(0)).optional(),
    })
  ).min(1, 'Quiz cần có ít nhất 1 câu hỏi.'),
}).refine((data) => {
  // Ensure each question has either answer or answers
  return data.questions.every(q => q.answer !== undefined || (q.answers && q.answers.length > 0));
}, {
  message: 'Mỗi câu hỏi phải có ít nhất một đáp án đúng',
  path: ['questions'],
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = createQuizSchema.parse(body);

    const quiz = await prisma.quiz.create({
      data: {
        title: validatedData.title,
        authorId: user.id,
        isPublic: validatedData.isPublic,
        questions: {
          create: validatedData.questions.map((q) => ({
            prompt: q.prompt,
            options: q.options,
            // Use first answer as the main answer field
            answer: q.answers && q.answers.length > 0 ? q.answers[0] : (q.answer ?? 0),
            // Store all correct answers as JSON if multiple answers provided
            answers: q.answers && q.answers.length > 0 ? q.answers : null,
          })),
        },
      },
      include: {
        questions: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, quiz }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authorId = searchParams.get('authorId');
    const isPublic = searchParams.get('isPublic');

    const where: any = {};
    
    if (authorId) {
      where.authorId = authorId;
    } else if (isPublic === 'true') {
      where.isPublic = true;
    }

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        questions: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ quizzes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
