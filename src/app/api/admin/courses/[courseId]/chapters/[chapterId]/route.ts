import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/admin/courses/[courseId]/chapters/[chapterId] - Lấy thông tin chapter
export async function GET(
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

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            correctIndex: true,
            explanation: true,
            order: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapter" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/courses/[courseId]/chapters/[chapterId] - Cập nhật chapter
export async function PUT(
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
    const { title, description, videoUrl, youtubeUrl, order } = body;

    const chapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        title,
        description,
        videoUrl,
        youtubeUrl,
        order: order !== undefined ? order : undefined,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Error updating chapter:", error);
    return NextResponse.json(
      { error: "Failed to update chapter" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/courses/[courseId]/chapters/[chapterId] - Xóa chapter
export async function DELETE(
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

    // Xóa chapter (cascade delete questions)
    await prisma.chapter.delete({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return NextResponse.json(
      { error: "Failed to delete chapter" },
      { status: 500 }
    );
  }
}
