'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Product } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useProducts() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchProducts = useCallback(async (activeOnly = false): Promise<Product[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('products')
      .select('*')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Product[];
  }, [orgId, supabase]);

  const createProduct = useCallback(async (product: Partial<Product>): Promise<Product> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, org_id: orgId })
      .select('*')
      .single();
    if (error) throw error;
    return data as Product;
  }, [orgId, supabase]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Product;
  }, [supabase]);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  return { fetchProducts, createProduct, updateProduct, deleteProduct };
}
