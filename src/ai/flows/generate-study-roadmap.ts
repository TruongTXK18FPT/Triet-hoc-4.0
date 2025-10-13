'use server';

/**
 * @fileOverview A study roadmap generation AI agent.
 *
 * - generateStudyRoadmap - A function that handles the study roadmap generation process.
 * - GenerateStudyRoadmapInput - The input type for the generateStudyRoadmap function.
 * - GenerateStudyRoadmapOutput - The return type for the generateStudyRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const prompt = ai.definePrompt({
  name: 'generateStudyRoadmapPrompt',
  input: {schema: GenerateStudyRoadmapInputSchema},
  output: {schema: GenerateStudyRoadmapOutputSchema},
  prompt: `You are an expert in Marxism-Leninism and an experienced educator. Your task is to generate a personalized study roadmap for a student based on their current knowledge level and learning goals.

Knowledge Level: {{{knowledgeLevel}}}
Learning Goals: {{{learningGoals}}}

Generate a clear, concise, and effective study roadmap with the most important learning goals listed first. The roadmap should include specific topics and resources the student should study to achieve their goals. The roadmap should have between 5 and 10 topics. Return only the roadmap topics as a list.
`,
});

const generateStudyRoadmapFlow = ai.defineFlow(
  {
    name: 'generateStudyRoadmapFlow',
    inputSchema: GenerateStudyRoadmapInputSchema,
    outputSchema: GenerateStudyRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
