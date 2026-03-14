'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Campaign, CampaignContact, CampaignStatus } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useCampaigns() {
  const orgId = useAuthStore((s) => s.orgId);
  const userId = useAuthStore((s) => s.userId);
  const supabase = getSupabase();

  const fetchCampaigns = useCallback(async (statusFilter?: CampaignStatus): Promise<Campaign[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('campaigns')
      .select('*, campaign_contacts(count)')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (statusFilter) query = query.eq('status', statusFilter);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((c: Record<string, unknown>) => ({
      ...c,
      contact_count: Array.isArray(c.campaign_contacts) && c.campaign_contacts[0]
        ? (c.campaign_contacts[0] as Record<string, number>).count
        : 0,
    })) as Campaign[];
  }, [orgId, supabase]);

  const fetchCampaign = useCallback(async (id: string): Promise<Campaign | null> => {
    if (!orgId) return null;
    const { data, error } = await supabase
      .from('campaigns')
      .select('*, contacts:campaign_contacts(*, contact:contacts(id, first_name, last_name, email))')
      .eq('id', id)
      .eq('org_id', orgId)
      .single();
    if (error) { console.error(error); return null; }
    return data as Campaign;
  }, [orgId, supabase]);

  const createCampaign = useCallback(async (campaign: Partial<Campaign>): Promise<Campaign> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('campaigns')
      .insert({ ...campaign, org_id: orgId, created_by: userId })
      .select('*')
      .single();
    if (error) throw error;
    return data as Campaign;
  }, [orgId, userId, supabase]);

  const updateCampaign = useCallback(async (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Campaign;
  }, [supabase]);

  const deleteCampaign = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('campaigns')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const enrollContacts = useCallback(async (campaignId: string, contactIds: string[]): Promise<void> => {
    if (!orgId) throw new Error('No org');
    const rows = contactIds.map((contactId) => ({
      campaign_id: campaignId,
      contact_id: contactId,
      org_id: orgId,
    }));
    const { error } = await supabase
      .from('campaign_contacts')
      .upsert(rows, { onConflict: 'campaign_id,contact_id' });
    if (error) throw error;
  }, [orgId, supabase]);

  const removeCampaignContact = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('campaign_contacts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  return { fetchCampaigns, fetchCampaign, createCampaign, updateCampaign, deleteCampaign, enrollContacts, removeCampaignContact };
}
