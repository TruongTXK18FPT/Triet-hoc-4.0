import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { calculateLevel, calculateRankFromLevel, XP_REWARDS } from '@/lib/gamification';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCheckIn = await (prisma as any).userActivity.findFirst({
      where: {
        userId: profile.id,
        type: 'DAILY_CHECKIN' as any,
        createdAt: {
          gte: today,
        },
      },
    });

    if (todayCheckIn) {
      return NextResponse.json(
        { 
          error: 'Bạn đã điểm danh hôm nay rồi!',
          alreadyCheckedIn: true,
          checkInTime: todayCheckIn.createdAt,
        },
        { status: 400 }
      );
    }

    // Award XP for check-in
    const xpEarned = XP_REWARDS.DAILY_CHECKIN;
    const newXp = profile.experience + xpEarned;
    const newLevel = calculateLevel(newXp);
    const newRank = calculateRankFromLevel(newLevel);

    // Update profile
    await (prisma as any).userProfile.update({
      where: { id: profile.id },
      data: {
        experience: newXp,
        level: newLevel,
        rank: newRank,
      },
    });

    // Create check-in activity
    await (prisma as any).userActivity.create({
      data: {
        userId: profile.id,
        type: 'DAILY_CHECKIN' as any,
        description: `Điểm danh hàng ngày - Nhận ${xpEarned} XP`,
        xpEarned,
      },
    });

    return NextResponse.json({
      success: true,
      xpEarned,
      newXp,
      newLevel,
      newRank,
      message: `Chúc mừng! Bạn đã nhận được ${xpEarned} XP!`,
    });
  } catch (error: any) {
    console.error('Error checking in:', error);
    return NextResponse.json(
      { error: error?.message || 'Điểm danh thất bại' },
      { status: 500 }
    );
  }
}

// Get check-in status for today
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true } as any,
    });

    if (!user || !(user as any).profile) {
      return NextResponse.json({ checkedIn: false });
    }

    const profile = (user as any).profile;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCheckIn = await (prisma as any).userActivity.findFirst({
      where: {
        userId: profile.id,
        type: 'DAILY_CHECKIN' as any,
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      checkedIn: !!todayCheckIn,
      checkInTime: todayCheckIn?.createdAt || null,
    });
  } catch (error: any) {
    console.error('Error getting check-in status:', error);
    return NextResponse.json({ checkedIn: false }, { status: 500 });
  }
}

