'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { SocialPost, PostStatus, SocialPlatform } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export interface PostFilters {
  status?: PostStatus;
  platform?: SocialPlatform;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useSocialPosts() {
  const orgId = useAuthStore((s) => s.orgId);
  const userId = useAuthStore((s) => s.userId);
  const supabase = getSupabase();

  const fetchPosts = useCallback(async (filters?: PostFilters): Promise<SocialPost[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('social_posts')
      .select('*, social_account:social_accounts(id, platform, account_name, account_handle)')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('scheduled_for', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.platform) query = query.eq('platform', filters.platform);
    if (filters?.search) query = query.ilike('content', `%${filters.search}%`);
    if (filters?.dateFrom) query = query.gte('scheduled_for', filters.dateFrom);
    if (filters?.dateTo) query = query.lte('scheduled_for', filters.dateTo);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as SocialPost[];
  }, [orgId, supabase]);

  const createPost = useCallback(async (post: Partial<SocialPost>): Promise<SocialPost> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('social_posts')
      .insert({
        ...post,
        org_id: orgId,
        created_by: userId,
      })
      .select('*')
      .single();
    if (error) throw error;
    return data as SocialPost;
  }, [orgId, userId, supabase]);

  const updatePost = useCallback(async (id: string, updates: Partial<SocialPost>): Promise<SocialPost> => {
    const { data, error } = await supabase
      .from('social_posts')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as SocialPost;
  }, [supabase]);

  const deletePost = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('social_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const schedulePost = useCallback(async (id: string, scheduledFor: string): Promise<SocialPost> => {
    const { data, error } = await supabase
      .from('social_posts')
      .update({ scheduled_for: scheduledFor, status: 'scheduled' as PostStatus })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as SocialPost;
  }, [supabase]);

  const publishPost = useCallback(async (id: string): Promise<SocialPost> => {
    const { data, error } = await supabase
      .from('social_posts')
      .update({ status: 'published' as PostStatus, published_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as SocialPost;
  }, [supabase]);

  return { fetchPosts, createPost, updatePost, deletePost, schedulePost, publishPost };
}
