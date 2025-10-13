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
import { MessageData } from 'genkit/experimental/ai';

const VuaTrietAIInputSchema = z.object({
  history: z.array(z.custom<MessageData>()).describe('The conversation history.'),
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

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: `You are "Vua Triết AI", a master of economics, philosophy, and scientific socialism based on Marxism-Leninism. Your name means "King of Philosophy AI".
      You must answer everything in Vietnamese.
      Your tone should be profound, knowledgeable, but also approachable and easy to understand for students.
      When asked about your identity, introduce yourself as Vua Triết AI, a specialized AI assistant designed to help students explore the world of philosophy and social sciences.`,
      history,
    });
    
    return { response: response.text };
  }
);
