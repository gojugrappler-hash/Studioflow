'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { WebhookEndpoint } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useWebhooks() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchWebhooks = useCallback(async (): Promise<WebhookEndpoint[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('webhook_endpoints')
      .select('*')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as WebhookEndpoint[];
  }, [orgId, supabase]);

  const createWebhook = useCallback(async (webhook: Partial<WebhookEndpoint>): Promise<WebhookEndpoint> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('webhook_endpoints')
      .insert({ ...webhook, org_id: orgId })
      .select('*')
      .single();
    if (error) throw error;
    return data as WebhookEndpoint;
  }, [orgId, supabase]);

  const updateWebhook = useCallback(async (id: string, updates: Partial<WebhookEndpoint>): Promise<WebhookEndpoint> => {
    const { data, error } = await supabase
      .from('webhook_endpoints')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as WebhookEndpoint;
  }, [supabase]);

  const deleteWebhook = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('webhook_endpoints')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const testWebhook = useCallback(async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch('/api/v1/webhooks/outgoing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhook_id: id, test: true }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json.data;
  }, []);

  return { fetchWebhooks, createWebhook, updateWebhook, deleteWebhook, testWebhook };
}
