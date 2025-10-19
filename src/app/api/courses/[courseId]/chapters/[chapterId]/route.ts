import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params;
    const session = await getServerSession(authOptions);

    // Lấy chi tiết chapter với questions
    const chapter = await prisma.chapter.findFirst({
      where: {
        id: chapterId,
        courseId: courseId,
        course: {
          isPublished: true,
        },
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
        course: {
          select: {
            id: true,
            title: true,
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
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Nếu user đã đăng nhập, lấy progress của chapter này
    let chapterProgress = null;
    if (session?.user?.id) {
      chapterProgress = await prisma.chapterProgress.findUnique({
        where: {
          courseProgressId_chapterId: {
            courseProgressId: `${session.user.id}_${courseId}`,
            chapterId: chapterId,
          },
        },
      });
    }

    return NextResponse.json({
      chapter,
      chapterProgress,
    });
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapter" },
      { status: 500 }
    );
  }
}
