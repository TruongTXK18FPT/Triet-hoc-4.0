/**
 * @fileOverview AI Fallback Helper
 * Provides a unified fallback mechanism for AI API calls:
 * Gemma 3 27B -> Mistral -> Gemini 2.5 Flash -> Gemini 2.0 Flash
 */

export interface AICallOptions {
  promptText: string;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call AI with automatic fallback on rate limits or failures
 * Tries in order: Gemma 3 27B -> Mistral -> Gemini 2.5 Flash -> Gemini 2.0 Flash
 */
export async function callAIWithFallback(options: AICallOptions): Promise<string> {
  const { promptText, systemPrompt, temperature = 0.4, maxTokens = 2048 } = options;
  const mistralKey = process.env.MISTRAL_API_KEY;
  const geminiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
  
  const errors: string[] = [];
  
  // Try 1: Gemma 3 27B (via Google AI)
  if (geminiKey) {
    try {
      console.log('[AI Fallback] Trying Gemma 3 27B...');
      return await callGeminiAPIWithModel({
        promptText,
        systemPrompt,
        apiKey: geminiKey,
        temperature,
        maxTokens,
        model: 'gemma-3-27b-it',
      });
    } catch (error: any) {
      const errorMsg = `Gemma 3 27B: ${error.message}`;
      errors.push(errorMsg);
      console.error(`[AI Fallback] ${errorMsg}`);
      
      // Check if it's a quota/rate limit error
      const isRateLimit = 
        error.message.includes('429') || 
        error.message.includes('quota') ||
        error.message.includes('RESOURCE_EXHAUSTED') ||
        error.message.includes('service_tier_capacity_exceeded');
      
      if (!isRateLimit) {
        // If not a quota error, continue to next model
        console.log('[AI Fallback] Gemma 3 27B failed, trying Mistral...');
      } else {
        console.log('[AI Fallback] Gemma 3 27B quota exceeded, trying Mistral...');
      }
    }
  }
  
  // Try 2: Mistral Large
  if (mistralKey) {
    try {
      console.log('[AI Fallback] Trying Mistral Large...');
      return await callMistralAPI({
        promptText,
        systemPrompt,
        model: 'mistral-large-latest',
        apiKey: mistralKey,
        temperature,
        maxTokens,
      });
    } catch (error: any) {
      const errorMsg = `Mistral Large: ${error.message}`;
      errors.push(errorMsg);
      console.error(`[AI Fallback] ${errorMsg}`);
      
      // Check if it's a rate limit error (429 or service tier exceeded)
      const isRateLimit = 
        error.message.includes('429') || 
        error.message.includes('service_tier_capacity_exceeded') ||
        error.message.includes('Service tier capacity exceeded');
      
      if (isRateLimit) {
        console.log('[AI Fallback] Rate limit exceeded, trying Mistral Small...');
        
        // Try 2b: Mistral Small (if Large fails with rate limit)
        try {
          return await callMistralAPI({
            promptText,
            systemPrompt,
            model: 'mistral-small-latest',
            apiKey: mistralKey,
            temperature,
            maxTokens,
          });
        } catch (smallError: any) {
          const smallErrorMsg = `Mistral Small: ${smallError.message}`;
          errors.push(smallErrorMsg);
          console.error(`[AI Fallback] ${smallErrorMsg}`);
          // Continue to Gemini fallback
        }
      }
    }
  }
  
  // Try 3: Fallback to Gemini 2.5 Flash
  if (geminiKey) {
    console.log('[AI Fallback] Falling back to Gemini 2.5 Flash...');
    try {
      return await callGeminiAPIWithModel({
        promptText,
        systemPrompt,
        apiKey: geminiKey,
        temperature,
        maxTokens,
        model: 'gemini-2.5-flash',
      });
    } catch (gemini25Error: any) {
      const gemini25ErrorMsg = `Gemini 2.5 Flash: ${gemini25Error.message}`;
      errors.push(gemini25ErrorMsg);
      console.error(`[AI Fallback] ${gemini25ErrorMsg}`);
      
      // Check if it's a quota error
      const isQuotaError = 
        gemini25Error?.message?.includes('quota') ||
        gemini25Error?.message?.includes('429') ||
        gemini25Error?.message?.includes('RESOURCE_EXHAUSTED');
      
      if (isQuotaError) {
        console.log('[AI Fallback] Gemini 2.5 Flash quota exceeded, trying Gemini 2.0 Flash...');
        
        // Try 4: Final fallback to Gemini 2.0 Flash
        try {
          return await callGeminiAPIWithModel({
            promptText,
            systemPrompt,
            apiKey: geminiKey,
            temperature,
            maxTokens,
            model: 'gemini-2.0-flash-exp',
          });
        } catch (gemini20Error: any) {
          const gemini20ErrorMsg = `Gemini 2.0 Flash: ${gemini20Error.message}`;
          errors.push(gemini20ErrorMsg);
          console.error(`[AI Fallback] ${gemini20ErrorMsg}`);
        }
      }
    }
  }
  
  // All attempts failed
  throw new Error(
    `Tất cả AI services đều không khả dụng. Vui lòng thử lại sau.\n\nChi tiết lỗi:\n${errors.join('\n')}`
  );
}

interface MistralAPIOptions {
  promptText: string;
  systemPrompt: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}

/**
 * Call Mistral API with specific model
 */
async function callMistralAPI(options: MistralAPIOptions): Promise<string> {
  const { promptText, systemPrompt, model, apiKey, temperature, maxTokens } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 30 second timeout
  
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptText },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`${response.status} ${detail}`);
    }
    
    const data = await response.json() as any;
    const text: string = data?.choices?.[0]?.message?.content ?? '';
    
    if (!text) {
      throw new Error('API returned empty response');
    }
    
    console.log(`[AI Fallback] ${model} succeeded`);
    return text;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('API timeout after 30s');
    }
    throw error;
  }
}

interface GeminiAPIOptions {
  promptText: string;
  systemPrompt: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}


interface GeminiAPIWithModelOptions extends GeminiAPIOptions {
  model: string;
}

/**
 * Call Gemini API with specific model
 */
async function callGeminiAPIWithModel(options: GeminiAPIWithModelOptions): Promise<string> {
  const { promptText, systemPrompt, apiKey, temperature, maxTokens, model } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${promptText}`
            }]
          }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          }
        }),
        signal: controller.signal,
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`${response.status} ${detail}`);
    }
    
    const data = await response.json() as any;
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    
    if (!text) {
      throw new Error('API returned empty response');
    }
    
    console.log(`[AI Fallback] ${model} succeeded`);
    return text;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('API timeout after 30s');
    }
    throw error;
  }
}
