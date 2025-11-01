import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_BADGES } from '@/lib/gamification';

// Get all badges
export async function GET(req: NextRequest) {
  try {
    const badges = await (prisma as any).badge.findMany({
      orderBy: {
        category: 'asc',
      },
    });

    return NextResponse.json({ badges }, { status: 200 });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Seed initial badges (admin only - run once)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { secret } = body;
    
    // Temporary: Allow without secret, or check if provided
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized - Invalid secret' }, { status: 401 });
    }

    const createdBadges = [];
    
    for (const badgeData of INITIAL_BADGES) {
      const existing = await (prisma as any).badge.findUnique({
        where: { code: badgeData.code },
      });

      if (!existing) {
        const badge = await (prisma as any).badge.create({
          data: {
            code: badgeData.code,
            name: badgeData.name,
            description: badgeData.description,
            icon: badgeData.icon,
            category: badgeData.category as any,
            requirement: badgeData.requirement,
            xpReward: badgeData.xpReward,
          },
        });
        createdBadges.push(badge);
      }
    }

    return NextResponse.json({
      message: `Created ${createdBadges.length} badges`,
      badges: createdBadges,
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding badges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
