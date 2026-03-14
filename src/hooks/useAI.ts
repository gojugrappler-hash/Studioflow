'use client';

import { useCallback } from 'react';
import type { AIGenerateType } from '@/types/database';

export function useAI() {
  const generateContent = useCallback(async (
    type: AIGenerateType,
    context: string,
    parameters?: Record<string, unknown>
  ): Promise<{ content: string; tokens_used: number }> => {
    const res = await fetch('/api/v1/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, context, parameters }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json.data;
  }, []);

  const generateEmail = useCallback(async (
    recipientName: string,
    subject: string,
    tone: string,
    context: string
  ) => {
    return generateContent('email', context, { recipientName, subject, tone });
  }, [generateContent]);

  const generateCaption = useCallback(async (
    platform: string,
    topic: string,
    tone: string
  ) => {
    return generateContent('caption', topic, { platform, tone });
  }, [generateContent]);

  const scoreLeads = useCallback(async (contactContext: string) => {
    return generateContent('score', contactContext);
  }, [generateContent]);

  const getSuggestions = useCallback(async (context: string) => {
    return generateContent('suggestion', context);
  }, [generateContent]);

  return { generateContent, generateEmail, generateCaption, scoreLeads, getSuggestions };
}
