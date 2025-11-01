import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const createSchema = z.object({
  year: z.union([z.string(), z.number()]).transform((val) => Number.parseInt(String(val))),
  title: z.string().min(3),
  description: z.string().min(10),
  sourceUrl: z.string().url().optional().or(z.literal('')),
});

const updateSchema = z.object({
  year: z.union([z.string(), z.number()]).transform((val) => Number.parseInt(String(val))).optional(),
  title: z.string().min(3).optional(),
  summary: z.string().min(10).optional(),
  description: z.string().min(10).optional(), // Alias for summary
  sourceUrl: z.string().url().optional().or(z.literal('')).optional(),
  order: z.number().optional(),
});

function checkAdmin(session: any) {
  return session?.user?.email === 'admin@mln131.com' || session?.user?.role === 'ADMIN';
}

// GET - Lấy tất cả timeline events
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!checkAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await prisma.timelineEvent.findMany({
      orderBy: [
        { year: 'asc' },
        { order: 'asc' },
      ],
    });

    // Transform to match TimelineEvent type
    const transformed = events.map((event) => ({
      id: event.id,
      year: event.year.toString(),
      title: event.title,
      description: event.summary,
      sourceUrl: event.sourceUrl,
      order: event.order,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline events' },
      { status: 500 }
    );
  }
}

// POST - Tạo timeline event mới
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!checkAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { year, title, description, sourceUrl } = parsed.data;

    const maxOrder = await prisma.timelineEvent.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const event = await prisma.timelineEvent.create({
      data: {
        year,
        title,
        summary: description,
        sourceUrl: sourceUrl || null,
        order: (maxOrder?.order || 0) + 1,
      },
    });

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        year: event.year.toString(),
        title: event.title,
        description: event.summary,
        sourceUrl: event.sourceUrl,
        order: event.order,
      },
    });
  } catch (error) {
    console.error('Error creating timeline event:', error);
    return NextResponse.json(
      { error: 'Failed to create timeline event' },
      { status: 500 }
    );
  }
}
