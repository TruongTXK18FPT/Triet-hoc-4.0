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
  prompt: `You are a university-level educator and expert in Marxist-Leninist philosophy.  
Your task is to create **5 multiple-choice questions** about the following topic:

Topic: {{{topic}}}

Each question must:
- Be clear, concise, and conceptually accurate.
- Have exactly **4 answer options (A, B, C, D)**.
- Include **only one correct answer**, clearly marked as "Correct Answer: ".
- Cover **different aspects** of the topic (e.g., key definitions, thinkers, historical context, core principles, and applications).
- Use **academic tone**, but ensure accessibility for university students.

Format your output **exactly** as follows:

Q1. [Question text]  
A. [Option 1]  
B. [Option 2]  
C. [Option 3]  
D. [Option 4]  
**Correct Answer:** [Letter] – [Explanation of why this answer is correct in 1–2 sentences]

(repeat for Q2–Q5)

Ensure all content is factual, aligned with Marxist-Leninist theory, and avoids repetition.
`,
});

// Fallback prompt for quiz generation
const promptFallback = aiFallback.definePrompt({
  name: 'generateQuizQuestionsPromptFallback',
  input: { schema: GenerateQuizQuestionsInputSchema },
  output: { schema: GenerateQuizQuestionsOutputSchema },
  prompt: `You are a university-level educator and expert in Marxist-Leninist philosophy.  
Your task is to create **5 multiple-choice questions** about the following topic:

Topic: {{{topic}}}

Each question must:
- Be clear, concise, and conceptually accurate.
- Have exactly **4 answer options (A, B, C, D)**.
- Include **only one correct answer**, clearly marked as "Correct Answer: ".
- Cover **different aspects** of the topic (e.g., key definitions, thinkers, historical context, core principles, and applications).
- Use **academic tone**, but ensure accessibility for university students.

Format your output **exactly** as follows:

Q1. [Question text]  
A. [Option 1]  
B. [Option 2]  
C. [Option 3]  
D. [Option 4]  
**Correct Answer:** [Letter] – [Explanation of why this answer is correct in 1–2 sentences]

(repeat for Q2–Q5)

Ensure all content is factual, aligned with Marxist-Leninist theory, and avoids repetition.
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
