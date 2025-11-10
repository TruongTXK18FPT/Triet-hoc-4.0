'use server';

/**
 * @fileOverview Generates quiz questions based on a given topic.
 *
 * - generateQuizQuestions: AI flow to create quiz questions.
 * - GenerateQuizQuestionsInput: Input type for the flow.
 * - GenerateQuizQuestionsOutput: Output type for the flow.
 */

import { ai, aiFallback } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic to generate quiz questions for. For example: "The Dialectical Materialism of Karl Marx"'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const QuizQuestionSchema = z.object({
    questionText: z.string().describe("The text of the multiple-choice question."),
    options: z.array(z.string()).describe("An array of 4 possible answers for the question."),
    correctOptionIndex: z.number().describe("The 0-based index of the correct answer in the 'options' array."),
});

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('An array of 5 generated quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  // Add timeout wrapper (60 seconds)
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('API timeout after 60s')), 60000);
  });

  try {
    // Race between flow execution and timeout
    const result = await Promise.race([
      generateQuizQuestionsFlow(input),
      timeoutPromise,
    ]);
    return result;
  } catch (error: any) {
    const errorMessage = error?.message || error?.toString() || '';
    const isQuotaError = 
      errorMessage.includes('quota') ||
      errorMessage.includes('429') ||
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      error?.code === 'RESOURCE_EXHAUSTED' ||
      error?.statusCode === 429;
    
    const isTimeoutError = 
      errorMessage.includes('timeout') ||
      errorMessage.includes('TIMEOUT') ||
      errorMessage.includes('timed out');
    
    // Fallback to Gemini 2.0 Flash on quota error or timeout
    if (isQuotaError || isTimeoutError) {
      console.warn(`⚠️ Quiz generation failed (${isQuotaError ? 'quota' : 'timeout'}), falling back to Gemini 2.0 Flash...`);
      try {
        const { output } = await promptFallback(input);
        if (!output?.questions?.length) {
          throw new Error('Fallback returned empty result');
        }
        return output;
      } catch (fallbackError: any) {
        console.error('❌ Quiz generation fallback failed:', fallbackError);
        throw new Error(
          `Không thể tạo câu hỏi lúc này. Vui lòng thử lại sau.\n\nNguyên nhân: ${isTimeoutError ? 'Timeout' : 'Quota exceeded'}`
        );
      }
    }
    
    // For other errors, throw with more context
    console.error('❌ Quiz generation error:', error);
    throw new Error(
      `Lỗi khi tạo câu hỏi: ${errorMessage || 'Unknown error'}. Vui lòng thử lại sau.`
    );
  }
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: { schema: GenerateQuizQuestionsInputSchema },
  output: { schema: GenerateQuizQuestionsOutputSchema },
  prompt: `Bạn là một giáo viên đại học chuyên môn cao và là chuyên gia về triết học Mác-Lênin.
Nhiệm vụ của bạn là tạo **5 câu hỏi trắc nghiệm** về chủ đề sau:

Chủ đề: {{{topic}}}

Mỗi câu hỏi phải:
- Được viết **hoàn toàn bằng tiếng Việt**.
- Rõ ràng, ngắn gọn, và chính xác về mặt khái niệm.
- Có chính xác **4 lựa chọn trả lời (A, B, C, D)**.
- Chỉ có **một câu trả lời đúng duy nhất**, được ghi rõ là "Đáp án đúng: ".
- Độ dài của các lựa chọn phải **ngang nhau và không quá chênh lệch**.
- **KHÔNG được có 2 lựa chọn nào giống nhau hoặc trùng lặp nội dung**.
- Các đáp án sai phải hợp lý và đánh lừa được người học (distractors tốt).
- Bao gồm **các khía cạnh khác nhau** của chủ đề (ví dụ: định nghĩa chính, nhân vật lịch sử, bối cảnh lịch sử, nguyên lý cơ bản, và ứng dụng).
- Sử dụng **tones học thuật**, nhưng đảm bảo dễ hiểu cho sinh viên đại học.

Định dạng đầu ra **chính xác** như sau:

Q1. [Nội dung câu hỏi]
A. [Lựa chọn 1]
B. [Lựa chọn 2]
C. [Lựa chọn 3]
D. [Lựa chọn 4]
**Đáp án đúng:** [Chữ cái] – [Giải thích tại sao câu trả lời này đúng trong 1–2 câu]

(lặp lại cho Q2–Q5)

Đảm bảo:
- Tất cả nội dung đều bằng tiếng Việt.
- Không có sự trùng lặp giữa các câu hỏi hoặc đáp án.
- Mỗi câu hỏi có một chủ đề khác nhau.
- Độ dài của các lựa chọn tương tự nhau (tránh chọn câu trả lời dài nhất vì nó dễ nhận ra).
- Nội dung chính xác, phù hợp với lý thuyết Mác-Lênin.
`,
});

// Fallback prompt for quiz generation
const promptFallback = aiFallback.definePrompt({
  name: 'generateQuizQuestionsPromptFallback',
  input: { schema: GenerateQuizQuestionsInputSchema },
  output: { schema: GenerateQuizQuestionsOutputSchema },
  prompt: `Bạn là một giáo viên đại học chuyên môn cao và là chuyên gia về triết học Mác-Lênin.
Nhiệm vụ của bạn là tạo **5 câu hỏi trắc nghiệm** về chủ đề sau:

Chủ đề: {{{topic}}}

Mỗi câu hỏi phải:
- Được viết **hoàn toàn bằng tiếng Việt**.
- Rõ ràng, ngắn gọn, và chính xác về mặt khái niệm.
- Có chính xác **4 lựa chọn trả lời (A, B, C, D)**.
- Chỉ có **một câu trả lời đúng duy nhất**, được ghi rõ là "Đáp án đúng: ".
- Độ dài của các lựa chọn phải **ngang nhau và không quá chênh lệch**.
- **KHÔNG được có 2 lựa chọn nào giống nhau hoặc trùng lặp nội dung**.
- Các đáp án sai phải hợp lý và đánh lừa được người học (distractors tốt).
- Bao gồm **các khía cạnh khác nhau** của chủ đề (ví dụ: định nghĩa chính, nhân vật lịch sử, bối cảnh lịch sử, nguyên lý cơ bản, và ứng dụng).
- Sử dụng **tones học thuật**, nhưng đảm bảo dễ hiểu cho sinh viên đại học.

Định dạng đầu ra **chính xác** như sau:

Q1. [Nội dung câu hỏi]
A. [Lựa chọn 1]
B. [Lựa chọn 2]
C. [Lựa chọn 3]
D. [Lựa chọn 4]
**Đáp án đúng:** [Chữ cái] – [Giải thích tại sao câu trả lời này đúng trong 1–2 câu]

(lặp lại cho Q2–Q5)

Đảm bảo:
- Tất cả nội dung đều bằng tiếng Việt.
- Không có sự trùng lặp giữa các câu hỏi hoặc đáp án.
- Mỗi câu hỏi có một chủ đề khác nhau.
- Độ dài của các lựa chọn tương tự nhau (tránh chọn câu trả lời dài nhất vì nó dễ nhận ra).
- Nội dung chính xác, phù hợp với lý thuyết Mác-Lênin.
`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
