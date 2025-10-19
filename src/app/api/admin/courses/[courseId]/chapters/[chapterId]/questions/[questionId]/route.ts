import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PUT /api/admin/courses/[courseId]/chapters/[chapterId]/questions/[questionId] - Cập nhật question
export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      courseId: string;
      chapterId: string;
      questionId: string;
    }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { courseId, chapterId, questionId } = await params;
    const body = await request.json();
    const { question, options, correctIndex, explanation, order } = body;

    const questionRecord = await prisma.chapterQuestion.update({
      where: {
        id: questionId,
        chapterId: chapterId,
      },
      data: {
        question,
        options,
        correctIndex,
        explanation,
        order: order !== undefined ? order : undefined,
      },
    });

    return NextResponse.json(questionRecord);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/courses/[courseId]/chapters/[chapterId]/questions/[questionId] - Xóa question
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      courseId: string;
      chapterId: string;
      questionId: string;
    }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { courseId, chapterId, questionId } = await params;

    await prisma.chapterQuestion.delete({
      where: {
        id: questionId,
        chapterId: chapterId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
