import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      coverUrl: true,
      createdAt: true,
      publishedAt: true,
      author: { select: { id: true, name: true, image: true } },
    },
  });
  return NextResponse.json(posts);
}

const createSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(20),
  content: z.string().min(100),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  publish: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any) as any;
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Bạn cần đăng nhập' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, description, content, imageUrl, tags, publish } = parsed.data;
  const slugBase = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  // ensure unique slug
  let slug = slugBase;
  let index = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${index++}`;
  }

  const created = await prisma.post.create({
    data: {
      title,
      slug,
      content: `${description}\n\n${content}`,
      coverUrl: imageUrl,
      authorId: user.id,
      status: publish ? 'PENDING' : 'DRAFT', // Changed to PENDING for review
      publishedAt: null, // Will be set when admin approves
      tags: tags && tags.length ? {
        create: tags.map((t) => ({ 
          tag: { 
            connectOrCreate: { 
              where: { name: t }, 
              create: { name: t } 
            } 
          } 
        })),
      } : undefined,
    },
    select: { id: true, slug: true, status: true },
  });
  
  return NextResponse.json({ 
    ...created, 
    message: publish ? 'Bài viết đã được gửi để kiểm duyệt' : 'Bài viết đã được lưu nháp' 
  }, { status: 201 });
}


