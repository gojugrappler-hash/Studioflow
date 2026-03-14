'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Note, EntityType } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useNotes() {
  const orgId = useAuthStore((s) => s.orgId);
  const userId = useAuthStore((s) => s.userId);
  const supabase = getSupabase();

  const fetchNotes = useCallback(async (entityType: EntityType, entityId: string): Promise<Note[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('org_id', orgId)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .is('deleted_at', null)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Note[];
  }, [orgId, supabase]);

  const createNote = useCallback(async (note: {
    entity_type: EntityType;
    entity_id: string;
    title: string;
    content: string;
  }): Promise<Note> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('notes')
      .insert({ ...note, org_id: orgId, created_by: userId })
      .select('*')
      .single();
    if (error) throw error;
    return data as Note;
  }, [orgId, userId, supabase]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>): Promise<Note> => {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Note;
  }, [supabase]);

  const deleteNote = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const togglePin = useCallback(async (id: string, isPinned: boolean): Promise<Note> => {
    const { data, error } = await supabase
      .from('notes')
      .update({ is_pinned: !isPinned })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Note;
  }, [supabase]);

  return { fetchNotes, createNote, updateNote, deleteNote, togglePin };
}
