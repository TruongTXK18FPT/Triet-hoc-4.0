import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roadmap, knowledgeLevel, learningGoals } = await req.json();

    if (!roadmap) {
      return NextResponse.json({ error: 'Missing roadmap data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse roadmap content into items
    const lines = roadmap.split('\n').filter((l: string) => l.trim());
    const items = lines.map((line: string, index: number) => {
      const match = line.match(/^\d+\)\s*(.+?)(?:\s*—\s*(.+?))?(?:\s*—\s*(.+?))?$/);
      if (match) {
        const [, title, desc, links] = match;
        const linkArray = (links || '')
          .split(/[;,|]/)
          .map((s: string) => s.trim())
          .filter(Boolean);
        return {
          order: index,
          title: title?.trim() || line,
          description: desc?.trim() || null,
          links: linkArray.length > 0 ? linkArray : null,
        };
      }
      return {
        order: index,
        title: line,
        description: null,
        links: null,
      };
    });

    // Create roadmap entry with items
    const savedRoadmap = await prisma.roadmap.create({
      data: {
        userId: user.id,
        title: `Lộ trình ${knowledgeLevel || 'học tập'}`,
        description: learningGoals || null,
        items: {
          create: items,
        },
      },
    });

    return NextResponse.json({ success: true, id: savedRoadmap.id });
  } catch (error) {
    console.error('Error saving roadmap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
