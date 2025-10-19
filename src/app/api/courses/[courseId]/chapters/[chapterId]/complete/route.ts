import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Kiểm tra chapter có tồn tại không
    const chapter = await prisma.chapter.findFirst({
      where: {
        id: chapterId,
        courseId: courseId,
        course: {
          isPublished: true,
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Tạo hoặc cập nhật CourseProgress
    const courseProgressId = `${session.user.id}_${courseId}`;

    await prisma.courseProgress.upsert({
      where: {
        id: courseProgressId,
      },
      create: {
        id: courseProgressId,
        userId: session.user.id,
        courseId: courseId,
        completedPercent: 0,
        lastAccessedAt: new Date(),
      },
      update: {
        lastAccessedAt: new Date(),
      },
    });

    // Tạo hoặc cập nhật ChapterProgress
    await prisma.chapterProgress.upsert({
      where: {
        courseProgressId_chapterId: {
          courseProgressId: courseProgressId,
          chapterId: chapterId,
        },
      },
      create: {
        id: `${courseProgressId}_${chapterId}`,
        courseProgressId: courseProgressId,
        chapterId: chapterId,
        videoWatched: true,
        quizCompleted: true,
        completedAt: new Date(),
      },
      update: {
        videoWatched: true,
        quizCompleted: true,
        completedAt: new Date(),
      },
    });

    // Tính lại completedPercent
    const totalChapters = await prisma.chapter.count({
      where: {
        courseId: courseId,
      },
    });

    const completedChapters = await prisma.chapterProgress.count({
      where: {
        courseProgressId: courseProgressId,
        quizCompleted: true,
      },
    });

    const newCompletedPercent = Math.round(
      (completedChapters / totalChapters) * 100
    );

    await prisma.courseProgress.update({
      where: {
        id: courseProgressId,
      },
      data: {
        completedPercent: newCompletedPercent,
      },
    });

    return NextResponse.json({
      success: true,
      completedPercent: newCompletedPercent,
    });
  } catch (error) {
    console.error("Error completing chapter:", error);
    return NextResponse.json(
      { error: "Failed to complete chapter" },
      { status: 500 }
    );
  }
}
