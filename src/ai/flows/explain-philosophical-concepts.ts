'use server';

/**
 * @fileOverview Explains complex philosophical concepts in a simple, easy-to-understand manner.
 *
 * - explainConcept - A function that handles the explanation of philosophical concepts.
 * - ExplainConceptInput - The input type for the explainConcept function.
 * - ExplainConceptOutput - The return type for the explainConcept function.
 */

import {ai} from '@/ai/genkit';
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
  return explainConceptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainConceptPrompt',
  input: {schema: ExplainConceptInputSchema},
  output: {schema: ExplainConceptOutputSchema},
  prompt: `Bạn là một chuyên gia triết học, giỏi diễn giải các khái niệm phức tạp theo cách đơn giản, dễ tiếp cận.

  Hãy giải thích khái niệm triết học sau đây theo cách dễ hiểu đối với sinh viên đại học. Sử dụng ngôn ngữ tự nhiên, rõ ràng, ví dụ minh họa khi cần. Trả lời HOÀN TOÀN BẰNG TIẾNG VIỆT.

  Khái niệm: {{{concept}}}`,
});

const explainConceptFlow = ai.defineFlow(
  {
    name: 'explainConceptFlow',
    inputSchema: ExplainConceptInputSchema,
    outputSchema: ExplainConceptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
