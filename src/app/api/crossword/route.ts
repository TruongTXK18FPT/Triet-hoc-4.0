import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

// Helper function để tính toán keywordColumn tối ưu
function calculateOptimalKeywordColumn(questions: any[]): number {
  if (questions.length === 0) return 5;

  const maxAnswerLength = Math.max(...questions.map((q) => q.answer.length));
  const gridWidth = Math.max(maxAnswerLength, 15);

  const columnCounts = Array(gridWidth).fill(0);

  questions.forEach((q) => {
    const possibleColumns = [];
    for (let col = 0; col < gridWidth; col++) {
      const startPos = col - q.keywordCharIndex;
      if (startPos >= 0 && startPos + q.answer.length <= gridWidth) {
        possibleColumns.push(col);
      }
    }
    possibleColumns.forEach((col) => columnCounts[col]++);
  });

  const maxCount = Math.max(...columnCounts);
  const optimalColumn = columnCounts.indexOf(maxCount);

  return optimalColumn >= 0 ? optimalColumn : Math.floor(gridWidth / 2);
}

// Schema validation
const createGameSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional(),
  keyword: z.string().min(1, "Keyword không được để trống"),
  theme: z.string().optional(),
  isPublic: z.boolean().default(false),
  questions: z
    .array(
      z.object({
        order: z.number().int().min(1).max(20),
        question: z.string().min(1, "Câu hỏi không được để trống"),
        answer: z.string().min(1, "Đáp án không được để trống"),
        explanation: z.string().optional(),
        keywordCharIndex: z.number().int().min(0),
        keywordColumn: z.number().int().min(0).optional(),
      })
    )
    .min(1, "Cần ít nhất 1 câu hỏi")
    .max(20, "Tối đa 20 câu hỏi"),
});

// GET: Lấy danh sách games
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get("public") === "true";

    let whereClause: any = {};

    if (isPublic) {
      whereClause.isPublic = true;
    } else if (session?.user?.email === "admin@mln131.com") {
      // Admin có thể xem tất cả
      whereClause = {};
    } else if (session?.user?.email) {
      // User chỉ xem games của mình
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) {
        whereClause.createdById = user.id;
      }
    } else {
      // Chưa đăng nhập chỉ xem public
      whereClause.isPublic = true;
    }

    const games = await prisma.crosswordGame.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
        questions: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching crossword games:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách games" },
      { status: 500 }
    );
  }
}

// POST: Tạo game mới (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Bạn cần đăng nhập" }, { status: 401 });
    }

    if (session.user.email !== "admin@mln131.com") {
      return NextResponse.json(
        { error: "Chỉ admin mới có thể tạo game" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createGameSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, keyword, theme, isPublic, questions } =
      parsed.data;

    // Tìm user admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy user" },
        { status: 404 }
      );
    }

    // Tính toán keywordColumn tự động nếu chưa có
    const questionsWithKeywordColumn = questions.map((q) => ({
      ...q,
      keywordColumn:
        q.keywordColumn || calculateOptimalKeywordColumn(questions),
    }));

    // Tạo game với questions
    const game = await prisma.crosswordGame.create({
      data: {
        title,
        description,
        keyword,
        theme,
        isPublic,
        createdById: user.id,
        questions: {
          create: questionsWithKeywordColumn.map((q) => ({
            order: q.order,
            question: q.question,
            answer: q.answer,
            explanation: q.explanation,
            keywordCharIndex: q.keywordCharIndex,
            keywordColumn: q.keywordColumn,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("Error creating crossword game:", error);
    return NextResponse.json({ error: "Không thể tạo game" }, { status: 500 });
  }
}
