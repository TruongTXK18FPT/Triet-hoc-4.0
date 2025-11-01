import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const updateSchema = z.object({
  year: z.union([z.string(), z.number()]).transform((val) => parseInt(String(val))).optional(),
  title: z.string().min(3).optional(),
  summary: z.string().min(10).optional(),
  description: z.string().min(10).optional(), // Alias for summary
  sourceUrl: z.string().url().optional().or(z.literal('')).optional(),
  order: z.number().optional(),
});

function checkAdmin(session: any) {
  return session?.user?.email === 'admin@mln131.com' || session?.user?.role === 'ADMIN';
}

// GET - Lấy một timeline event
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!checkAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const event = await prisma.timelineEvent.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Timeline event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: event.id,
      year: event.year.toString(),
      title: event.title,
      description: event.summary,
      sourceUrl: event.sourceUrl,
      order: event.order,
    });
  } catch (error) {
    console.error('Error fetching timeline event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline event' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật timeline event
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!checkAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    // Transform description to summary if provided
    if (body.description && !body.summary) {
      body.summary = body.description;
    }

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (parsed.data.year !== undefined) updateData.year = parsed.data.year;
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.summary !== undefined) updateData.summary = parsed.data.summary;
    if (parsed.data.sourceUrl !== undefined) {
      updateData.sourceUrl = parsed.data.sourceUrl || null;
    }
    if (parsed.data.order !== undefined) updateData.order = parsed.data.order;

    const event = await prisma.timelineEvent.update({
      where: { id },
      data: updateData,
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
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Timeline event not found' },
        { status: 404 }
      );
    }
    console.error('Error updating timeline event:', error);
    return NextResponse.json(
      { error: 'Failed to update timeline event' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa timeline event
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!checkAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.timelineEvent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Timeline event not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting timeline event:', error);
    return NextResponse.json(
      { error: 'Failed to delete timeline event' },
      { status: 500 }
    );
  }
}

