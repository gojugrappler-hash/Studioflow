'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Company } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useCompanies() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchCompanies = useCallback(async (search?: string): Promise<Company[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('companies')
      .select('*')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Company[];
  }, [orgId, supabase]);

  const createCompany = useCallback(async (company: Partial<Company>): Promise<Company> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('companies')
      .insert({ ...company, org_id: orgId })
      .select()
      .single();
    if (error) throw error;
    return data as Company;
  }, [orgId, supabase]);

  const updateCompany = useCallback(async (id: string, updates: Partial<Company>): Promise<Company> => {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Company;
  }, [supabase]);

  const deleteCompany = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('companies')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  return { fetchCompanies, createCompany, updateCompany, deleteCompany };
}
