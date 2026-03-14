'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Form, FormSubmission } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useForms() {
  const orgId = useAuthStore((s) => s.orgId);
  const userId = useAuthStore((s) => s.userId);
  const supabase = getSupabase();

  const fetchForms = useCallback(async (): Promise<Form[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Form[];
  }, [orgId, supabase]);

  const fetchForm = useCallback(async (id: string): Promise<Form | null> => {
    if (!orgId) return null;
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .eq('org_id', orgId)
      .single();
    if (error) { console.error(error); return null; }
    return data as Form;
  }, [orgId, supabase]);

  const createForm = useCallback(async (form: Partial<Form>): Promise<Form> => {
    if (!orgId) throw new Error('No org');
    const slug = (form.name || 'form').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data, error } = await supabase
      .from('forms')
      .insert({ ...form, org_id: orgId, slug, created_by: userId })
      .select('*')
      .single();
    if (error) throw error;
    return data as Form;
  }, [orgId, userId, supabase]);

  const updateForm = useCallback(async (id: string, updates: Partial<Form>): Promise<Form> => {
    const { data, error } = await supabase
      .from('forms')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Form;
  }, [supabase]);

  const deleteForm = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('forms')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const fetchSubmissions = useCallback(async (formId: string): Promise<FormSubmission[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*, contact:contacts(id, first_name, last_name, email)')
      .eq('form_id', formId)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as FormSubmission[];
  }, [orgId, supabase]);

  return { fetchForms, fetchForm, createForm, updateForm, deleteForm, fetchSubmissions };
}
