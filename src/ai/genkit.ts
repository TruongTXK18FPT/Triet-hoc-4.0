import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { getGeminiModel, GEMINI_MODELS } from './model-fallback';

// Primary AI instance with Gemini 2.5 Flash
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
    }),
  ],
  model: getGeminiModel(), // Use helper to select model with fallback support
});

// Fallback AI instance with Gemini 2.0 Flash (for quota errors)
export const aiFallback = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
    }),
  ],
  model: GEMINI_MODELS.FALLBACK,
});


