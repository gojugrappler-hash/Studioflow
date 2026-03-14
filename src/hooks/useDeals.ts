'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Deal, Pipeline, PipelineStage } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function usePipeline() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchPipeline = useCallback(async (): Promise<Pipeline | null> => {
    if (!orgId) return null;
    const { data, error } = await supabase
      .from('pipelines')
      .select('*, stages:pipeline_stages(*)')
      .eq('org_id', orgId)
      .eq('is_default', true)
      .single();
    if (error) { console.error(error); return null; }
    if (data && data.stages) {
      data.stages.sort((a: PipelineStage, b: PipelineStage) => a.position - b.position);
    }
    return data as Pipeline;
  }, [orgId, supabase]);

  return { fetchPipeline };
}

export function useDeals() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchDeals = useCallback(async (pipelineId: string): Promise<Deal[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('deals')
      .select('*, contact:contacts(id, first_name, last_name), stage:pipeline_stages(id, name, color)')
      .eq('org_id', orgId)
      .eq('pipeline_id', pipelineId)
      .is('deleted_at', null)
      .order('position', { ascending: true });
    if (error) throw error;
    return (data || []) as Deal[];
  }, [orgId, supabase]);

  const createDeal = useCallback(async (deal: Partial<Deal>): Promise<Deal> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('deals')
      .insert({ ...deal, org_id: orgId })
      .select('*, contact:contacts(id, first_name, last_name), stage:pipeline_stages(id, name, color)')
      .single();
    if (error) throw error;
    return data as Deal;
  }, [orgId, supabase]);

  const updateDeal = useCallback(async (id: string, updates: Partial<Deal>): Promise<Deal> => {
    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select('*, contact:contacts(id, first_name, last_name), stage:pipeline_stages(id, name, color)')
      .single();
    if (error) throw error;
    return data as Deal;
  }, [supabase]);

  const deleteDeal = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('deals')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  return { fetchDeals, createDeal, updateDeal, deleteDeal };
}
