import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini, getSystemPrompt } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const { type, context, parameters } = await req.json();

    if (!type || !context) {
      return NextResponse.json(
        { data: null, error: { message: 'type and context are required', code: 'MISSING_PARAM' } },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { data: null, error: { message: 'Gemini API not configured', code: 'AI_NOT_CONFIGURED' } },
        { status: 503 }
      );
    }

    const validTypes = ['email', 'caption', 'score', 'suggestion'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { data: null, error: { message: 'Invalid type. Must be: ' + validTypes.join(', '), code: 'INVALID_TYPE' } },
        { status: 400 }
      );
    }

    // Build prompt based on type
    let prompt = context;
    if (type === 'email' && parameters) {
      prompt = `Write an email to ${parameters.recipientName || 'the recipient'} about: ${context}. Subject: ${parameters.subject || 'No subject'}. Tone: ${parameters.tone || 'professional'}.`;
    } else if (type === 'caption' && parameters) {
      prompt = `Write a social media caption for ${parameters.platform || 'social media'} about: ${context}. Tone: ${parameters.tone || 'engaging'}.`;
    } else if (type === 'score') {
      prompt = `Analyze this contact data and provide a lead score: ${context}. Return JSON with: score (0-100), factors (array), recommendation.`;
    }

    const result = await generateWithGemini({
      prompt,
      systemInstruction: getSystemPrompt(type),
      maxTokens: type === 'score' ? 512 : 1024,
      temperature: type === 'score' ? 0.3 : 0.7,
    });

    return NextResponse.json({
      data: { content: result.content, tokens_used: result.tokens_used },
      error: null,
    });
  } catch (err) {
    console.error('AI generate error:', err);
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json(
      { data: null, error: { message, code: 'INTERNAL' } },
      { status: 500 }
    );
  }
}
