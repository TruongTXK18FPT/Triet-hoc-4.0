import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST /api/admin/courses/[courseId]/chapters/[chapterId]/questions - Thêm question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { courseId, chapterId } = await params;
    const body = await request.json();
    const { question, options, correctIndex, explanation } = body;

    if (!question || !options || correctIndex === undefined) {
      return NextResponse.json(
        { error: "Question, options, and correctIndex are required" },
        { status: 400 }
      );
    }

    // Kiểm tra chapter có tồn tại không
    const chapter = await prisma.chapter.findFirst({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Lấy order tiếp theo
    const lastQuestion = await prisma.chapterQuestion.findFirst({
      where: {
        chapterId: chapterId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = (lastQuestion?.order || 0) + 1;

    const questionRecord = await prisma.chapterQuestion.create({
      data: {
        chapterId: chapterId,
        question,
        options,
        correctIndex,
        explanation: explanation || null,
        order: newOrder,
      },
    });

    return NextResponse.json(questionRecord);
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
