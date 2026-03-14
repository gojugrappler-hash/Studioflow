'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { EmailMessage, EmailTemplate } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useEmail() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchEmails = useCallback(async (search?: string, status?: string): Promise<EmailMessage[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('emails')
      .select('*, contact:contacts(id, first_name, last_name, email)')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`subject.ilike.%${search}%,to_email.ilike.%${search}%,to_name.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as EmailMessage[];
  }, [orgId, supabase]);

  const sendEmail = useCallback(async (email: Partial<EmailMessage>): Promise<EmailMessage> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('emails')
      .insert({ ...email, org_id: orgId, status: 'sent', sent_at: new Date().toISOString() })
      .select('*, contact:contacts(id, first_name, last_name, email)')
      .single();
    if (error) throw error;
    return data as EmailMessage;
  }, [orgId, supabase]);

  const saveDraft = useCallback(async (email: Partial<EmailMessage>): Promise<EmailMessage> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('emails')
      .insert({ ...email, org_id: orgId, status: 'draft' })
      .select('*, contact:contacts(id, first_name, last_name, email)')
      .single();
    if (error) throw error;
    return data as EmailMessage;
  }, [orgId, supabase]);

  const deleteEmail = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('emails')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const fetchTemplates = useCallback(async (): Promise<EmailTemplate[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('org_id', orgId)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('usage_count', { ascending: false });
    if (error) throw error;
    return (data || []) as EmailTemplate[];
  }, [orgId, supabase]);

  const createTemplate = useCallback(async (template: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('email_templates')
      .insert({ ...template, org_id: orgId })
      .select()
      .single();
    if (error) throw error;
    return data as EmailTemplate;
  }, [orgId, supabase]);

  return { fetchEmails, sendEmail, saveDraft, deleteEmail, fetchTemplates, createTemplate };
}
