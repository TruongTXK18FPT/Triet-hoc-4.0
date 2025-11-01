import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateQuizQuestions } from "@/ai/flows/generate-quiz-questions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can generate questions
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    console.log("[AI Question Generator] Generating questions for topic:", topic);

    // Call AI flow to generate questions
    const result = await generateQuizQuestions({ topic });

    console.log(
      "[AI Question Generator] Generated",
      result.questions?.length || 0,
      "questions"
    );

    return NextResponse.json({
      success: true,
      questions: result.questions || [],
    });
  } catch (error: any) {
    console.error("[AI Question Generator Error]:", error);
    
    // Extract error message
    const errorMessage = error?.message || error?.toString() || "Failed to generate questions";
    
    // Check if it's a timeout or quota error
    const isTimeoutError = errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT');
    const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');
    
    // Provide user-friendly error message
    let userMessage = "Không thể tạo câu hỏi lúc này. ";
    if (isTimeoutError) {
      userMessage += "API đang phản hồi chậm. Vui lòng thử lại sau vài phút.";
    } else if (isQuotaError) {
      userMessage += "Đã đạt giới hạn sử dụng AI. Vui lòng thử lại sau.";
    } else {
      userMessage += "Vui lòng thử lại sau.";
    }
    
    return NextResponse.json(
      {
        error: userMessage,
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
