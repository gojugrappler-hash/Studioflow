'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Contact } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useContacts() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchContacts = useCallback(async (search?: string): Promise<Contact[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('contacts')
      .select('*, company:companies(id, name)')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Contact[];
  }, [orgId, supabase]);

  const createContact = useCallback(async (contact: Partial<Contact>): Promise<Contact> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('contacts')
      .insert({ ...contact, org_id: orgId })
      .select('*, company:companies(id, name)')
      .single();
    if (error) throw error;
    return data as Contact;
  }, [orgId, supabase]);

  const updateContact = useCallback(async (id: string, updates: Partial<Contact>): Promise<Contact> => {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select('*, company:companies(id, name)')
      .single();
    if (error) throw error;
    return data as Contact;
  }, [supabase]);

  const deleteContact = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('contacts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  return { fetchContacts, createContact, updateContact, deleteContact };
}
