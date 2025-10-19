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

    // Lấy chi tiết course với chapters
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        chapters: {
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Nếu user đã đăng nhập, lấy progress
    let userProgress = null;
    if (session?.user?.id) {
      const courseProgress = await prisma.courseProgress.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: courseId,
          },
        },
        include: {
          ChapterProgress: {
            select: {
              chapterId: true,
              quizCompleted: true,
            },
          },
        },
      });

      if (courseProgress) {
        const totalChapters = course._count.chapters;
        const completedChapters = courseProgress.ChapterProgress.filter(
          (cp) => cp.quizCompleted
        ).map((cp) => cp.chapterId);

        // Ưu tiên sử dụng completedPercent từ database, nếu không có thì tính toán
        const completedPercent =
          courseProgress.completedPercent ||
          (totalChapters > 0
            ? Math.round((completedChapters.length / totalChapters) * 100)
            : 0);

        userProgress = {
          completedPercent,
          completedChapters,
          totalChapters,
          lastAccessedAt: courseProgress.lastAccessedAt,
        };
      }
    }

    return NextResponse.json({
      course,
      userProgress,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
