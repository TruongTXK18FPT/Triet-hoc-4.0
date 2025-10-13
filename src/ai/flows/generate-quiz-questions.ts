'use server';

/**
 * @fileOverview Generates quiz questions based on a given topic.
 *
 * - generateQuizQuestions: AI flow to create quiz questions.
 * - GenerateQuizQuestionsInput: Input type for the flow.
 * - GenerateQuizQuestionsOutput: Output type for the flow.
 */

import { ai } from '@/ai/genkit';
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
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: { schema: GenerateQuizQuestionsInputSchema },
  output: { schema: GenerateQuizQuestionsOutputSchema },
  prompt: `You are an expert in Marxist-Leninist philosophy and an experienced educator. Your task is to generate a set of 5 multiple-choice quiz questions about the given topic.

Each question must have exactly 4 options.
One of the options must be the correct answer.
The questions should be clear, concise, and suitable for a university student.
Ensure the questions cover different aspects of the topic.

Topic: {{{topic}}}
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
