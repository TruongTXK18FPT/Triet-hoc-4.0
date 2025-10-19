import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/admin/courses/[courseId] - Lấy thông tin course
export async function GET(
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

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
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
            CourseProgress: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/courses/[courseId] - Cập nhật course
export async function PUT(
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
    const { title, description, coverUrl, isPublished, order } = body;

    const course = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        title,
        description,
        coverUrl,
        isPublished,
        order: order !== undefined ? order : undefined,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/courses/[courseId] - Xóa course
export async function DELETE(
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

    // Xóa course (cascade delete chapters và questions)
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
