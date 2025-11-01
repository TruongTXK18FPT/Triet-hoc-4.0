import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { calculateLevel, calculateRank, XP_REWARDS } from '@/lib/gamification';

// Get or create user profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: {
          include: {
            badges: {
              include: {
                badge: true,
              },
              orderBy: {
                earnedAt: 'desc',
              },
            },
            activities: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 20,
            },
          },
        },
      },
    } as any);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create profile if doesn't exist
    if (!(user as any).profile) {
      // Count user's actual data
      const [blogsCount, quizzesCount, coursesCount] = await Promise.all([
        prisma.post.count({ where: { authorId: user.id, status: 'PUBLISHED' } }),
        prisma.quiz.count({ where: { authorId: user.id } }),
        (prisma as any).courseProgress.count({ 
          where: { userId: user.id, completedPercent: 100 } 
        }),
      ]);

      const profile = await (prisma as any).userProfile.create({
        data: {
          userId: user.id,
          blogsCreated: blogsCount,
          quizzesCompleted: quizzesCount,
          coursesCompleted: coursesCount,
        },
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
          activities: true,
        },
      });

      return NextResponse.json({ profile }, { status: 200 });
    }

    // Sync stats with actual data
    const [blogsCount, quizzesCount, coursesCount] = await Promise.all([
      prisma.post.count({ where: { authorId: user.id, status: 'PUBLISHED' } }),
      prisma.quiz.count({ where: { authorId: user.id } }),
      (prisma as any).courseProgress.count({ 
        where: { userId: user.id, completedPercent: 100 } 
      }),
    ]);

    // Update profile with real counts
    const updatedProfile = await (prisma as any).userProfile.update({
      where: { id: (user as any).profile.id },
      data: {
        blogsCreated: blogsCount,
        quizzesCompleted: quizzesCount,
        coursesCompleted: coursesCount,
      },
      include: {
        badges: {
          include: {
            badge: true,
          },
          orderBy: {
            earnedAt: 'desc',
          },
        },
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
      },
    });

    // Add user info to profile response
    const profileWithUser = {
      ...updatedProfile,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    };

    return NextResponse.json({ profile: profileWithUser }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Award XP to user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { activityType, metadata } = body;

    if (!activityType || !(activityType in XP_REWARDS)) {
      return NextResponse.json({ error: 'Invalid activity type' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true } as any,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create profile if doesn't exist
    let profile = (user as any).profile;
    if (!profile) {
      profile = await (prisma as any).userProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    const xpEarned = XP_REWARDS[activityType as keyof typeof XP_REWARDS];
    const newXp = profile.experience + xpEarned;
    const newLevel = calculateLevel(newXp);
    const newRank = calculateRank(newXp);

    // Update profile stats
    const updateData: any = {
      experience: newXp,
      level: newLevel,
      rank: newRank,
    };

    if (activityType === 'COURSE_COMPLETED') {
      updateData.coursesCompleted = { increment: 1 };
    } else if (activityType === 'QUIZ_COMPLETED') {
      updateData.quizzesCompleted = { increment: 1 };
    } else if (activityType === 'BLOG_PUBLISHED') {
      updateData.blogsCreated = { increment: 1 };
    }

    // Update profile and create activity
    const [updatedProfile] = await prisma.$transaction([
      (prisma as any).userProfile.update({
        where: { id: profile.id },
        data: updateData,
        include: {
          badges: {
            include: {
              badge: true,
            },
          },
        },
      }),
      (prisma as any).userActivity.create({
        data: {
          userId: profile.id,
          type: activityType,
          description: getActivityDescription(activityType, metadata),
          xpEarned,
          metadata: metadata || {},
        },
      }),
    ]);

    // Check for badge achievements
    const newBadges = await checkBadgeAchievements(updatedProfile);

    return NextResponse.json({
      profile: updatedProfile,
      xpEarned,
      levelUp: newLevel > profile.level,
      newBadges,
    }, { status: 200 });
  } catch (error) {
    console.error('Error awarding XP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getActivityDescription(type: string, metadata: any): string {
  switch (type) {
    case 'COURSE_STARTED':
      return `Bắt đầu khóa học${metadata?.title ? `: ${metadata.title}` : ''}`;
    case 'COURSE_COMPLETED':
      return `Hoàn thành khóa học${metadata?.title ? `: ${metadata.title}` : ''}`;
    case 'CHAPTER_COMPLETED':
      return `Hoàn thành chương${metadata?.title ? `: ${metadata.title}` : ''}`;
    case 'QUIZ_COMPLETED':
      return `Hoàn thành quiz${metadata?.title ? `: ${metadata.title}` : ''}`;
    case 'QUIZ_PERFECT_SCORE':
      return `Đạt điểm tuyệt đối trong quiz${metadata?.title ? `: ${metadata.title}` : ''}`;
    case 'BLOG_CREATED':
      return `Tạo bài viết${metadata?.title ? `: ${metadata.title}` : ''}`;
    case 'BLOG_PUBLISHED':
      return `Xuất bản bài viết${metadata?.title ? `: ${metadata.title}` : ''}`;
    case 'COMMENT_POSTED':
      return 'Đăng bình luận';
    case 'STUDY_STREAK':
      return `Học ${metadata?.days || 1} ngày liên tiếp`;
    case 'DAILY_LOGIN':
      return 'Đăng nhập hàng ngày';
    default:
      return 'Hoạt động';
  }
}

async function checkBadgeAchievements(profile: any): Promise<any[]> {
  const newBadges = [];
  
  // Get all badges
  const allBadges = await (prisma as any).badge.findMany();
  const userBadgeCodes = profile.badges.map((ub: any) => ub.badge.code);
  
  // Check each badge
  for (const badge of allBadges) {
    if (userBadgeCodes.includes(badge.code)) continue;
    
    let earned = false;
    
    switch (badge.code) {
      case 'first_step':
        earned = profile.coursesCompleted >= 1;
        break;
      case 'philosophy_novice':
        earned = profile.coursesCompleted >= 3;
        break;
      case 'future_philosopher':
        earned = profile.level >= 10;
        break;
      case 'quiz_master':
        earned = profile.quizzesCompleted >= 10;
        break;
      case 'quiz_creator':
        const createdQuizzes = await prisma.quiz.count({
          where: { authorId: profile.userId },
        });
        earned = createdQuizzes >= 5;
        break;
      case 'first_blog':
        earned = profile.blogsCreated >= 1;
        break;
      case 'prolific_writer':
        earned = profile.blogsCreated >= 10;
        break;
    }
    
    if (earned) {
      await (prisma as any).userBadge.create({
        data: {
          userId: profile.id,
          badgeId: badge.id,
        },
      });
      newBadges.push(badge);
    }
  }
  
  return newBadges;
}
