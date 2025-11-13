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

// Schema validation cho update
const updateGameSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").optional(),
  description: z.string().optional(),
  keyword: z.string().min(1, "Keyword không được để trống").optional(),
  theme: z.string().optional(),
  isPublic: z.boolean().optional(),
  questions: z
    .array(
      z.object({
        id: z.string().optional(), // ID của question hiện tại (nếu có)
        order: z.number().int().min(1).max(20),
        question: z.string().min(1, "Câu hỏi không được để trống"),
        answer: z.string().min(1, "Đáp án không được để trống"),
        explanation: z.string().optional(),
        keywordCharIndex: z.number().int().min(0),
        keywordColumn: z.number().int().min(0).optional(),
      })
    )
    .min(1, "Cần ít nhất 1 câu hỏi")
    .max(20, "Tối đa 20 câu hỏi")
    .optional(),
});

// GET: Lấy chi tiết game
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const game = await prisma.crosswordGame.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Không tìm thấy game" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền truy cập
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email === "admin@mln131.com";
    const isOwner =
      session?.user?.email && game.createdBy.email === session.user.email;

    if (!game.isPublic && !isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error fetching crossword game:", error);
    return NextResponse.json(
      { error: "Không thể lấy thông tin game" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật game (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Bạn cần đăng nhập" }, { status: 401 });
    }

    if (session.user.email !== "admin@mln131.com") {
      return NextResponse.json(
        { error: "Chỉ admin mới có thể cập nhật game" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateGameSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const game = await prisma.crosswordGame.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Không tìm thấy game" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.description !== undefined)
      updateData.description = parsed.data.description;
    if (parsed.data.keyword !== undefined)
      updateData.keyword = parsed.data.keyword;
    if (parsed.data.theme !== undefined) updateData.theme = parsed.data.theme;
    if (parsed.data.isPublic !== undefined)
      updateData.isPublic = parsed.data.isPublic;

    // Nếu có questions mới, cập nhật
    if (parsed.data.questions) {
      // Tính toán keywordColumn tự động nếu chưa có
      const questionsWithKeywordColumn = parsed.data.questions.map((q) => ({
        ...q,
        keywordColumn:
          q.keywordColumn ||
          calculateOptimalKeywordColumn(parsed.data.questions),
      }));

      // Xóa tất cả questions cũ
      await prisma.crosswordQuestion.deleteMany({
        where: { gameId: id },
      });

      // Tạo questions mới
      updateData.questions = {
        create: questionsWithKeywordColumn.map((q) => ({
          order: q.order,
          question: q.question,
          answer: q.answer,
          explanation: q.explanation,
          keywordCharIndex: q.keywordCharIndex,
          keywordColumn: q.keywordColumn,
        })),
      };
    }

    const updatedGame = await prisma.crosswordGame.update({
      where: { id },
      data: updateData,
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("Error updating crossword game:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật game" },
      { status: 500 }
    );
  }
}

// DELETE: Xóa game (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Bạn cần đăng nhập" }, { status: 401 });
    }

    if (session.user.email !== "admin@mln131.com") {
      return NextResponse.json(
        { error: "Chỉ admin mới có thể xóa game" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const game = await prisma.crosswordGame.findUnique({
      where: { id },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Không tìm thấy game" },
        { status: 404 }
      );
    }

    // Xóa game (questions sẽ tự động xóa do cascade)
    await prisma.crosswordGame.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Đã xóa game thành công" });
  } catch (error) {
    console.error("Error deleting crossword game:", error);
    return NextResponse.json({ error: "Không thể xóa game" }, { status: 500 });
  }
}
