'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Activity, EntityType } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useActivities() {
  const orgId = useAuthStore((s) => s.orgId);
  const userId = useAuthStore((s) => s.userId);
  const supabase = getSupabase();

  const fetchActivities = useCallback(async (entityType: EntityType, entityId: string): Promise<Activity[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('org_id', orgId)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Activity[];
  }, [orgId, supabase]);

  const logActivity = useCallback(async (activity: {
    entity_type: EntityType;
    entity_id: string;
    activity_type: string;
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<Activity> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('activities')
      .insert({
        ...activity,
        org_id: orgId,
        performed_by: userId,
      })
      .select('*')
      .single();
    if (error) throw error;
    return data as Activity;
  }, [orgId, userId, supabase]);

  return { fetchActivities, logActivity };
}
