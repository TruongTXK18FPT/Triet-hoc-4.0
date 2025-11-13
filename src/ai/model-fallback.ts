/**
 * @fileOverview Gemini model fallback helper
 * Provides fallback logic from gemini-2.5-flash to gemini-2.0-flash-exp when quota is exceeded
 */

export const GEMINI_MODELS = {
  PRIMARY: 'googleai/gemini-2.5-flash',
  FALLBACK: 'googleai/gemini-2.0-flash',
} as const;

/**
 * Determines which Gemini model to use with fallback logic
 * @returns The model string to use
 */
export function getGeminiModel(): string {
  // In production, you might want to track quota usage and switch automatically
  // For now, we'll use environment variable to control fallback
  const useFallback = process.env.USE_GEMINI_FALLBACK === 'true';
  
  return useFallback ? GEMINI_MODELS.FALLBACK : GEMINI_MODELS.PRIMARY;
}

/**
 * Execute a function with automatic model fallback on quota errors
 * @param fn Function to execute that takes a model parameter
 * @returns Result from the function
 */
export async function withModelFallback<T>(
  fn: (model: string) => Promise<T>
): Promise<T> {
  try {
    // Try primary model first
    return await fn(GEMINI_MODELS.PRIMARY);
  } catch (error: any) {
    // Check if error is quota-related
    const isQuotaError = 
      error?.message?.includes('quota') ||
      error?.message?.includes('429') ||
      error?.code === 'RESOURCE_EXHAUSTED' ||
      error?.statusCode === 429;
    
    if (isQuotaError) {
      console.warn('⚠️ Gemini 2.5 quota exceeded, falling back to 2.0 flash...');
      
      // Fallback to secondary model
      try {
        return await fn(GEMINI_MODELS.FALLBACK);
      } catch (fallbackError) {
        console.error('❌ Fallback model also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    // If not quota error, rethrow original error
    throw error;
  }
}
