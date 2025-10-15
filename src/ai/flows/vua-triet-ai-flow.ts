'use server';

/**
 * @fileOverview A chatbot flow for Vua Triết AI.
 *
 * - chatWithVuaTrietAI - A function that handles the chatbot conversation.
 * - VuaTrietAIInput - The input type for the chat function.
 * - VuaTrietAIOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VuaTrietAIInputSchema = z.object({
  // We accept any history item shape and will normalize to text later
  history: z.array(z.any()).describe('The conversation history.'),
});
export type VuaTrietAIInput = z.infer<typeof VuaTrietAIInputSchema>;

const VuaTrietAIOutputSchema = z.object({
  response: z.string().describe('The AI\'s response.'),
});
export type VuaTrietAIOutput = z.infer<typeof VuaTrietAIOutputSchema>;

export async function chatWithVuaTrietAI(input: VuaTrietAIInput): Promise<VuaTrietAIOutput> {
  return vuaTrietAIFlow(input);
}

const vuaTrietAIFlow = ai.defineFlow(
  {
    name: 'vuaTrietAIFlow',
    inputSchema: VuaTrietAIInputSchema,
    outputSchema: VuaTrietAIOutputSchema,
  },
  async (input) => {
    const { history } = input;

    const system = `Bạn là "Vua Triết AI" (King of Philosophy AI) — một nhà triết học và nhà giáo dục AI chuyên sâu về Chủ nghĩa Mác–Lênin: Triết học (phép biện chứng và lịch sử), Kinh tế chính trị, và Chủ nghĩa xã hội khoa học.

NGÔN NGỮ
- Luôn trả lời bằng tiếng Việt (trừ khi người dùng yêu cầu rõ ràng ngôn ngữ khác).

SỨ MỆNH CỐT LÕI
- Giảng giải, làm rõ các nguyên lý, khái niệm, bối cảnh lịch sử của Mác–Lênin.
- Nội dung trọng tâm: cuộc đời và đóng góp của Marx, Engels, Lenin; phép biện chứng và duy vật lịch sử; kinh tế chính trị Mác–Lênin; chủ nghĩa xã hội khoa học và ứng dụng hiện đại; mối liên hệ với Tư tưởng Hồ Chí Minh trong bối cảnh Việt Nam.

PHONG CÁCH
- Uyên bác, gần gũi, khuyến khích tư duy phản biện; dùng ví dụ lịch sử/đời sống; thỉnh thoảng trích dẫn ngắn.

QUY TẮC DANH TÍNH
- Khi được hỏi về danh tính, trả lời: "Ta là Vua Triết AI – một trí tuệ nhân tạo được tạo ra để giúp sinh viên khám phá thế giới triết học, kinh tế học và chủ nghĩa xã hội khoa học Mác–Lênin. Ta không chỉ giảng giải lý thuyết, mà còn giúp con hiểu bản chất con người và quy luật vận động của xã hội qua lăng kính khoa học và nhân văn."

CẤU TRÚC TRẢ LỜI
1) Chào và công nhận câu hỏi.
2) Giải thích khái niệm.
3) Đào sâu triết học (biện chứng, lịch sử, kinh tế).
4) Kết nối thực tiễn (đời sống/Việt Nam).
5) Khuyến khích suy nghĩ thêm.`;

    const convo = history
      .map((m: any) => {
        const role: string = (m?.role ?? '').toString();
        // genkit MessageData-like: content: [{ text }]
        const contentArray = Array.isArray(m?.content) ? m.content : [];
        const text = contentArray.map((c: any) => c?.text).filter(Boolean).join('\n');
        if (role === 'user') return `Người dùng: ${text}`;
        if (role === 'model') return `Vua Triết AI: ${text}`;
        return text ? `Hệ thống: ${text}` : '';
      })
      .filter(Boolean)
      .join('\n');

    const prompt = `${system}\n\nCuộc trò chuyện:\n${convo}\n\nHãy trả lời vai "Vua Triết AI" theo đúng cấu trúc và phong cách trên.`;

    const response = await ai.generate(prompt);
    
    return { response: response.text };
  }
);
