'use server';

/**
 * @fileOverview Explains complex philosophical concepts in a simple, easy-to-understand manner.
 *
 * - explainConcept - A function that handles the explanation of philosophical concepts.
 * - ExplainConceptInput - The input type for the explainConcept function.
 * - ExplainConceptOutput - The return type for the explainConcept function.
 */

import {aiFallback} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainConceptInputSchema = z.object({
  concept: z.string().describe('The philosophical concept to explain.'),
});
export type ExplainConceptInput = z.infer<typeof ExplainConceptInputSchema>;

const ExplainConceptOutputSchema = z.object({
  explanation: z.string().describe('A simplified explanation of the philosophical concept.'),
});
export type ExplainConceptOutput = z.infer<typeof ExplainConceptOutputSchema>;

export async function explainConcept(input: ExplainConceptInput): Promise<ExplainConceptOutput> {
  // Only use Gemini 2.0 Flash for timeline explanations with token limit
  const { output } = await promptFallback(input);
  
  // Truncate output if too long to fit in dialog (max ~600 tokens ≈ 400 words)
  const maxLength = 2500; // ~400 words * ~6 chars/word
  let explanation = output?.explanation || '';
  
  if (explanation.length > maxLength) {
    // Find a good truncation point (end of sentence before limit)
    const truncated = explanation.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastNewline = truncated.lastIndexOf('\n');
    const truncatePoint = Math.max(lastPeriod, lastNewline);
    explanation = truncated.substring(0, truncatePoint > maxLength * 0.8 ? truncatePoint + 1 : maxLength) + '...';
  }
  
  return { explanation };
}

// Timeline explanation uses only Gemini 2.0 Flash (aiFallback) with limited tokens
const promptFallback = aiFallback.definePrompt({
  name: 'explainConceptPromptFallback',
  input: {schema: ExplainConceptInputSchema},
  output: {schema: ExplainConceptOutputSchema},
  prompt: `Bạn là một chuyên gia triết học, giỏi diễn giải các khái niệm phức tạp theo cách đơn giản, dễ tiếp cận.

  Hãy giải thích khái niệm triết học sau đây theo cách dễ hiểu đối với sinh viên đại học. Sử dụng ngôn ngữ tự nhiên, rõ ràng. Trả lời HOÀN TOÀN BẰNG TIẾNG VIỆT.

  QUAN TRỌNG: Giữ câu trả lời NGẮN GỌN, chỉ trong khoảng 250-350 từ (khoảng 2 đoạn văn). Tập trung vào các điểm chính, không mở rộng quá chi tiết. Câu trả lời sẽ hiển thị trong một dialog nhỏ nên phải thật súc tích.

  Định dạng câu trả lời:
  - Sử dụng **in đậm** cho các điểm quan trọng
  - Chia thành các phần ngắn: Khái niệm (1 đoạn), Ý nghĩa (1 đoạn)
  - Kết luận ngắn gọn 1 câu ở cuối
  
  Khái niệm: {{{concept}}}`,
});

