import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Update study time
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { minutes } = body;

    if (!minutes || minutes < 0) {
      return NextResponse.json({ error: 'Invalid minutes' }, { status: 400 });
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

    // Update total study time
    await (prisma as any).userProfile.update({
      where: { id: profile.id },
      data: {
        totalStudyTime: {
          increment: minutes,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating study time:', error);
    return NextResponse.json(
      { error: error?.message || 'Update thất bại' },
      { status: 500 }
    );
  }
}

// Get study time
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
      return NextResponse.json({ totalStudyTime: 0 });
    }

    const profile = (user as any).profile;
    return NextResponse.json({ totalStudyTime: profile.totalStudyTime || 0 });
  } catch (error: any) {
    console.error('Error getting study time:', error);
    return NextResponse.json({ totalStudyTime: 0 }, { status: 500 });
  }
}

