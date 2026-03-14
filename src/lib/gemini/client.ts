// Gemini API client wrapper
// Uses Google Generative AI SDK pattern - configured via GEMINI_API_KEY env var

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiRequest {
  model?: string;
  prompt: string;
  systemInstruction?: string;
  maxTokens?: number;
  temperature?: number;
}

interface GeminiResponse {
  content: string;
  tokens_used: number;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are a professional email writer for creative professionals (tattoo artists, photographers). Write compelling, friendly, professional emails. Keep them concise and personal. Output only the email body, no subject line unless asked.`,
  caption: `You are a social media expert for creative professionals. Write engaging captions optimized for the specified platform. Use relevant hashtags. Keep the tone authentic and creative. Match platform conventions (e.g., shorter for X/Twitter, longer for LinkedIn).`,
  score: `You are a lead scoring analyst for a CRM. Analyze the provided contact data and return a JSON object with: score (0-100), factors (array of {factor, impact, description}), and recommendation (string). Base scoring on engagement, completeness of profile, recency of activity, and deal potential.`,
  suggestion: `You are a CRM assistant for creative professionals. Provide actionable, concise suggestions based on the provided context. Focus on next best actions, follow-up reminders, and business optimization tips.`,
};

export async function generateWithGemini(request: GeminiRequest): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const model = request.model || 'gemini-2.0-flash';
  const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ parts: [{ text: request.prompt }] }],
    systemInstruction: request.systemInstruction
      ? { parts: [{ text: request.systemInstruction }] }
      : undefined,
    generationConfig: {
      maxOutputTokens: request.maxTokens || 1024,
      temperature: request.temperature || 0.7,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const json = await res.json();
  const content = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const tokens = json.usageMetadata?.totalTokenCount || 0;

  return { content, tokens_used: tokens };
}

export function getSystemPrompt(type: string): string {
  return SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.suggestion;
}
