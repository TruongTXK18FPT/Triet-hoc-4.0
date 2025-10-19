import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/admin/courses - Lấy tất cả courses (bao gồm draft)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const courses = await prisma.course.findMany({
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
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/admin/courses - Tạo course mới
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, coverUrl, isPublished } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Lấy order tiếp theo
    const lastCourse = await prisma.course.findFirst({
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = (lastCourse?.order || 0) + 1;

    const course = await prisma.course.create({
      data: {
        title,
        description: description || "",
        coverUrl: coverUrl || null,
        isPublished: isPublished || false,
        order: newOrder,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
