'use server';

/**
 * @fileOverview A study roadmap generation AI agent.
 *
 * - generateStudyRoadmap - A function that handles the study roadmap generation process.
 * - GenerateStudyRoadmapInput - The input type for the generateStudyRoadmap function.
 * - GenerateStudyRoadmapOutput - The return type for the generateStudyRoadmap function.
 */

import {ai, aiFallback} from '@/ai/genkit';
import 'dotenv/config';
import {z} from 'genkit';
import { callAIWithFallback } from '@/ai/fallback-helper';

const GenerateStudyRoadmapInputSchema = z.object({
  knowledgeLevel: z
    .string()
    .describe("The student's current knowledge level (e.g., 'beginner', 'intermediate', 'advanced')."),
  learningGoals: z
    .string()
    .describe('The specific learning goals of the student (e.g., understand key concepts, pass an exam).'),
});
export type GenerateStudyRoadmapInput = z.infer<typeof GenerateStudyRoadmapInputSchema>;

const GenerateStudyRoadmapOutputSchema = z.object({
  roadmap: z.string().describe('The generated study roadmap. A list of topics to study'),
});
export type GenerateStudyRoadmapOutput = z.infer<typeof GenerateStudyRoadmapOutputSchema>;

export async function generateStudyRoadmap(input: GenerateStudyRoadmapInput): Promise<GenerateStudyRoadmapOutput> {
  return generateStudyRoadmapFlow(input);
}

const generateStudyRoadmapFlow = ai.defineFlow(
  {
    name: 'generateStudyRoadmapFlow',
    inputSchema: GenerateStudyRoadmapInputSchema,
    outputSchema: GenerateStudyRoadmapOutputSchema,
  },
  async input => {
    const systemPrompt = 'Bạn là chuyên gia về Chủ nghĩa Mác–Lênin và là nhà giáo có kinh nghiệm. Luôn trả lời bằng tiếng Việt, văn phong mạch lạc, sắp xếp theo mục dễ đọc.';
    
    const promptText = `Hãy tạo LỘ TRÌNH HỌC TRIẾT MÁC–LÊNIN cá nhân hoá (5–10 mục) theo cấu trúc sau, trả về bằng văn bản thuần mỗi mục trên một dòng:
1) [Tiêu đề ngắn gọn] — [Mô tả 1–2 câu] — [3 gợi ý tài liệu/link tham khảo nếu có]

Thông tin người học:
- Trình độ hiện tại: ${input.knowledgeLevel}
- Mục tiêu học tập: ${input.learningGoals}

Yêu cầu:
- Trình bày dạng danh sách đánh số 1..n, mỗi mục một dòng.
- Chủ đề gợi ý thuộc: phép biện chứng duy vật, duy vật lịch sử, kinh tế chính trị Mác–Lênin, CNXH khoa học, tư tưởng Hồ Chí Minh (liên hệ Việt Nam).
- Gợi ý link ưu tiên: nguồn mở, bài giảng, thư viện, tác phẩm kinh điển (nếu không có link cụ thể thì ghi "(gợi ý: tìm đọc tác phẩm …)").`;
    
    const roadmap = await callAIWithFallback({
      promptText,
      systemPrompt,
      temperature: 0.4,
      maxTokens: 2048,
    });
    
    return { roadmap };
  }
);
