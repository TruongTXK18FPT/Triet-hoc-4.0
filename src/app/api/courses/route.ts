import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        chapters: {
          select: {
            id: true,
            title: true,
            order: true,
          },
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
      orderBy: {
        order: "asc",
      },
    });

    // Nếu user đã đăng nhập, lấy progress cho tất cả courses
    let userProgressMap = {};
    if (session?.user?.id) {
      const userProgresses = await prisma.courseProgress.findMany({
        where: {
          userId: session.user.id,
          courseId: {
            in: courses.map((c) => c.id),
          },
        },
        include: {
          ChapterProgress: {
            where: {
              quizCompleted: true,
            },
            select: {
              chapterId: true,
            },
          },
        },
      });

      // Tính % progress cho mỗi course
      userProgressMap = {};
      for (const progress of userProgresses) {
        const totalChapters =
          courses.find((c) => c.id === progress.courseId)?._count.chapters || 0;
        const completedChapters = progress.ChapterProgress.map(
          (cp) => cp.chapterId
        );
        const completedPercent =
          totalChapters > 0
            ? Math.round((completedChapters.length / totalChapters) * 100)
            : 0;

        userProgressMap[progress.courseId] = {
          completedPercent,
          completedChapters,
          totalChapters,
          lastAccessedAt: progress.lastAccessedAt,
        };
      }
    }

    return NextResponse.json({
      courses,
      userProgress: userProgressMap,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
