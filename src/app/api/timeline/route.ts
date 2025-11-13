import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Public API để lấy timeline events (không cần authentication)
export async function GET() {
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

