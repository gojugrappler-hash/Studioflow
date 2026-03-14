'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { SocialAccount, SocialPlatform } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useSocialAccounts() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchAccounts = useCallback(async (): Promise<SocialAccount[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('platform', { ascending: true });
    if (error) throw error;
    return (data || []) as SocialAccount[];
  }, [orgId, supabase]);

  const connectAccount = useCallback(async (platform: SocialPlatform, accountData: Partial<SocialAccount>): Promise<SocialAccount> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('social_accounts')
      .insert({
        ...accountData,
        org_id: orgId,
        platform,
        is_connected: true,
      })
      .select('*')
      .single();
    if (error) throw error;
    return data as SocialAccount;
  }, [orgId, supabase]);

  const updateAccount = useCallback(async (id: string, updates: Partial<SocialAccount>): Promise<SocialAccount> => {
    const { data, error } = await supabase
      .from('social_accounts')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as SocialAccount;
  }, [supabase]);

  const disconnectAccount = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('social_accounts')
      .update({ is_connected: false, access_token: null, refresh_token: null })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const deleteAccount = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('social_accounts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  return { fetchAccounts, connectAccount, updateAccount, disconnectAccount, deleteAccount };
}
