'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Automation, AutomationStep, AutomationLog } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useAutomations() {
  const orgId = useAuthStore((s) => s.orgId);
  const userId = useAuthStore((s) => s.userId);
  const supabase = getSupabase();

  const fetchAutomations = useCallback(async (activeOnly?: boolean): Promise<Automation[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('automations')
      .select('*')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (activeOnly !== undefined) query = query.eq('is_active', activeOnly);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Automation[];
  }, [orgId, supabase]);

  const fetchAutomation = useCallback(async (id: string): Promise<Automation | null> => {
    if (!orgId) return null;
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('id', id)
      .eq('org_id', orgId)
      .single();
    if (error) { console.error(error); return null; }
    return data as Automation;
  }, [orgId, supabase]);

  const createAutomation = useCallback(async (automation: Partial<Automation>): Promise<Automation> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('automations')
      .insert({ ...automation, org_id: orgId, created_by: userId })
      .select('*')
      .single();
    if (error) throw error;
    return data as Automation;
  }, [orgId, userId, supabase]);

  const updateAutomation = useCallback(async (id: string, updates: Partial<Automation>): Promise<Automation> => {
    const { data, error } = await supabase
      .from('automations')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Automation;
  }, [supabase]);

  const deleteAutomation = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('automations')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const toggleAutomation = useCallback(async (id: string, isActive: boolean): Promise<Automation> => {
    return updateAutomation(id, { is_active: isActive } as Partial<Automation>);
  }, [updateAutomation]);

  // Steps
  const fetchSteps = useCallback(async (automationId: string): Promise<AutomationStep[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('automation_steps')
      .select('*')
      .eq('automation_id', automationId)
      .eq('org_id', orgId)
      .order('position', { ascending: true });
    if (error) throw error;
    return (data || []) as AutomationStep[];
  }, [orgId, supabase]);

  const upsertStep = useCallback(async (step: Partial<AutomationStep>): Promise<AutomationStep> => {
    if (!orgId) throw new Error('No org');
    const payload = { ...step, org_id: orgId };
    const { data, error } = await supabase
      .from('automation_steps')
      .upsert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return data as AutomationStep;
  }, [orgId, supabase]);

  const deleteStep = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase.from('automation_steps').delete().eq('id', id);
    if (error) throw error;
  }, [supabase]);

  // Logs
  const fetchLogs = useCallback(async (automationId: string, limit = 20): Promise<AutomationLog[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('automation_logs')
      .select('*')
      .eq('automation_id', automationId)
      .eq('org_id', orgId)
      .order('started_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as AutomationLog[];
  }, [orgId, supabase]);

  return {
    fetchAutomations, fetchAutomation, createAutomation, updateAutomation,
    deleteAutomation, toggleAutomation, fetchSteps, upsertStep, deleteStep, fetchLogs,
  };
}
