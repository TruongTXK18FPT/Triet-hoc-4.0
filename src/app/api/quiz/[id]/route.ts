import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateQuizSchema = z.object({
  title: z.string().min(5, 'Tiêu đề cần có ít nhất 5 ký tự.').optional(),
  isPublic: z.boolean().optional(),
  questions: z.array(
    z.object({
      id: z.string().optional(), // For existing questions
      prompt: z.string().min(10, 'Câu hỏi cần có ít nhất 10 ký tự.'),
      options: z.array(z.string().min(1, 'Lựa chọn không được để trống.')).min(2, 'Cần có ít nhất 2 lựa chọn.').max(6, 'Tối đa 6 lựa chọn.'),
      answer: z.number().int().min(0).optional(),
      answers: z.array(z.number().int().min(0)).min(1, 'Mỗi câu hỏi phải có ít nhất một đáp án đúng.').optional(),
    })
  ).min(1, 'Quiz cần có ít nhất 1 câu hỏi.').optional(),
}).refine((data) => {
  // Ensure each question has either answer or answers
  if (data.questions) {
    return data.questions.every(q => 
      (q.answer !== undefined && q.answer >= 0) || 
      (q.answers && q.answers.length > 0)
    );
  }
  return true;
}, {
  message: 'Mỗi câu hỏi phải có ít nhất một đáp án đúng',
  path: ['questions'],
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({ quiz }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    
    // Check if quiz exists and belongs to user
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!existingQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (existingQuiz.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateQuizSchema.parse(body);

    // Update quiz
    const updateData: any = {};
    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
    }
    if (validatedData.isPublic !== undefined) {
      updateData.isPublic = validatedData.isPublic;
    }

    // Handle questions update
    if (validatedData.questions !== undefined) {
      // Delete all existing questions
      await prisma.question.deleteMany({
        where: { quizId: id },
      });

      // Create new questions
      updateData.questions = {
        create: validatedData.questions.map((q) => ({
          prompt: q.prompt,
          options: q.options,
          answer: q.answers && q.answers.length > 0 ? q.answers[0] : (q.answer ?? 0),
          answers: q.answers && q.answers.length > 0 ? q.answers : null,
        })),
      };
    }

    const quiz = await prisma.quiz.update({
      where: { id },
      data: updateData,
      include: {
        questions: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, quiz }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    
    // Check if quiz exists and belongs to user
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!existingQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (existingQuiz.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.quiz.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
