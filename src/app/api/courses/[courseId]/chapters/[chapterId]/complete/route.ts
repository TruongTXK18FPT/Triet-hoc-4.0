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

    const wasCompleted = await prisma.courseProgress.findUnique({
      where: { id: courseProgressId },
      select: { completedPercent: true },
    });

    await prisma.courseProgress.update({
      where: {
        id: courseProgressId,
      },
      data: {
        completedPercent: newCompletedPercent,
      },
    });

    // Award XP for chapter completion
    try {
      const { calculateLevel, calculateRank } = await import('@/lib/gamification');
      
      // Get or create user profile
      let profile = await (prisma as any).userProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!profile) {
        profile = await (prisma as any).userProfile.create({
          data: { userId: session.user.id },
        });
      }

      // Award XP for chapter completion (50 XP)
      const chapterXp = 50;
      let newXp = profile.experience + chapterXp;
      
      // Create chapter activity
      await (prisma as any).userActivity.create({
        data: {
          userId: profile.id,
          type: 'CHAPTER_COMPLETED',
          description: `Hoàn thành chương: ${chapter.title}`,
          xpEarned: chapterXp,
        },
      });

      // Check if course is now completed (100%)
      const courseJustCompleted = wasCompleted && wasCompleted.completedPercent < 100 && newCompletedPercent === 100;
      
      if (courseJustCompleted) {
        // Award bonus XP for course completion (500 XP)
        const courseXp = 500;
        newXp += courseXp;

        // Get course info
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          select: { title: true },
        });

        // Create course completion activity
        await (prisma as any).userActivity.create({
          data: {
            userId: profile.id,
            type: 'COURSE_COMPLETED',
            description: `Hoàn thành khóa học: ${course?.title || 'Unknown'}`,
            xpEarned: courseXp,
          },
        });

        console.log(`🎉 User completed course! Awarded ${courseXp} bonus XP`);
      }

      // Calculate new level and rank
      const newLevel = calculateLevel(newXp);
      const newRank = calculateRank(newXp);

      // Update profile
      await (prisma as any).userProfile.update({
        where: { id: profile.id },
        data: {
          experience: newXp,
          level: newLevel,
          rank: newRank,
          ...(courseJustCompleted && { coursesCompleted: { increment: 1 } }),
        },
      });

      console.log(`✅ Awarded XP for chapter completion (total: ${courseJustCompleted ? chapterXp + 500 : chapterXp} XP)`);
    } catch (error) {
      console.error('Failed to award XP for chapter/course completion:', error);
      // Don't fail the completion if XP award fails
    }

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
