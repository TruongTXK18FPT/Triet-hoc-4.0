import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get leaderboard
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'xp'; // xp, courses, quizzes, blogs
    const limit = parseInt(searchParams.get('limit') || '100');

    let orderBy: any = {};
    
    switch (type) {
      case 'xp':
        orderBy = { experience: 'desc' };
        break;
      case 'courses':
        orderBy = { coursesCompleted: 'desc' };
        break;
      case 'quizzes':
        orderBy = { quizzesCompleted: 'desc' };
        break;
      case 'blogs':
        orderBy = { blogsCreated: 'desc' };
        break;
      case 'time':
        orderBy = { totalStudyTime: 'desc' };
        break;
      default:
        orderBy = { experience: 'desc' };
    }

    const profiles = await (prisma as any).userProfile.findMany({
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        badges: {
          include: {
            badge: true,
          },
        },
      },
    });

    return NextResponse.json({ leaderboard: profiles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
