import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Lấy progress của user trong course
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
      include: {
        ChapterProgress: {
          include: {
            Chapter: {
              select: {
                id: true,
                title: true,
                order: true,
              },
            },
          },
        },
      },
    });

    if (!courseProgress) {
      return NextResponse.json({
        completedPercent: 0,
        completedChapters: [],
        totalChapters: 0,
      });
    }

    // Lấy tổng số chapters
    const totalChapters = await prisma.chapter.count({
      where: {
        courseId: courseId,
      },
    });

    // Lấy danh sách chapters đã hoàn thành
    const completedChapters = courseProgress.ChapterProgress.filter(
      (cp) => cp.quizCompleted
    ).map((cp) => cp.Chapter.id);

    return NextResponse.json({
      completedPercent: courseProgress.completedPercent,
      completedChapters,
      totalChapters,
      lastAccessedAt: courseProgress.lastAccessedAt,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch course progress" },
      { status: 500 }
    );
  }
}
