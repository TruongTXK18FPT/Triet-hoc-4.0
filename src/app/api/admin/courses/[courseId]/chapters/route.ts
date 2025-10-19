import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST /api/admin/courses/[courseId]/chapters - Tạo chapter mới
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { courseId } = await params;
    const body = await request.json();
    const { title, description, youtubeUrl, order } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Kiểm tra course có tồn tại không
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Sử dụng order từ form, nếu không có thì tính toán
    let finalOrder = order;
    if (!finalOrder) {
      const lastChapter = await prisma.chapter.findFirst({
        where: {
          courseId: courseId,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });
      finalOrder = (lastChapter?.order || 0) + 1;
    }

    const chapter = await prisma.chapter.create({
      data: {
        courseId: courseId,
        title,
        description: description || null,
        youtubeUrl: youtubeUrl || null,
        order: finalOrder,
      },
    });

    console.log("Created chapter:", chapter);
    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { error: "Failed to create chapter" },
      { status: 500 }
    );
  }
}
