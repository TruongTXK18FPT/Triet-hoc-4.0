import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Hàm normalize keyword tiếng Việt để so sánh
function normalizeVietnameseKeyword(keyword: string): string {
  return (
    keyword
      .toLowerCase()
      .trim()
      // Loại bỏ tất cả dấu cách, dấu gạch ngang, dấu gạch dưới và ký tự đặc biệt
      .replace(
        /[\s\-_\.\,\;\:\!\?\(\)\[\]\{\}\|\/\\\@\#\$\%\^\&\*\+\=\~\`\'\"]+/g,
        ""
      )
      // Normalize các ký tự tiếng Việt có dấu
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
  );
}

// Schema validation
const checkKeywordSchema = z.object({
  keyword: z.string().min(1, "Keyword không được để trống"),
});

// POST: Kiểm tra keyword người dùng nhập
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const parsed = checkKeywordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { keyword } = parsed.data;

    const game = await prisma.crosswordGame.findUnique({
      where: { id },
      include: {
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

    // Kiểm tra keyword với normalize tiếng Việt
    const normalizedUserKeyword = normalizeVietnameseKeyword(keyword);
    const normalizedGameKeyword = normalizeVietnameseKeyword(game.keyword);
    const isCorrect = normalizedUserKeyword === normalizedGameKeyword;

    if (isCorrect) {
      return NextResponse.json({
        correct: true,
        message: "Chúc mừng! Bạn đã đoán đúng keyword!",
        keyword: game.keyword,
      });
    } else {
      return NextResponse.json({
        correct: false,
        message: "Keyword không đúng. Hãy thử lại!",
        hint: `Keyword có ${game.keyword.length} chữ cái`,
      });
    }
  } catch (error) {
    console.error("Error checking keyword:", error);
    return NextResponse.json(
      { error: "Không thể kiểm tra keyword" },
      { status: 500 }
    );
  }
}
