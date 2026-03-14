'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Payment } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface PaymentStats {
  totalRevenue: number;
  totalPaid: number;
  recentPayments: Payment[];
}

export function usePayments() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchPayments = useCallback(async (invoiceId?: string): Promise<Payment[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('payments')
      .select('*, invoice:invoices(id, invoice_number, contact:contacts(id, first_name, last_name))')
      .eq('org_id', orgId)
      .order('paid_at', { ascending: false });
    if (invoiceId) {
      query = query.eq('invoice_id', invoiceId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Payment[];
  }, [orgId, supabase]);

  const fetchPaymentStats = useCallback(async (): Promise<PaymentStats> => {
    if (!orgId) return { totalRevenue: 0, totalPaid: 0, recentPayments: [] };
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('org_id', orgId)
      .order('paid_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    const allPayments = (payments || []) as Payment[];
    const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    return {
      totalRevenue: totalPaid,
      totalPaid,
      recentPayments: allPayments.slice(0, 5),
    };
  }, [orgId, supabase]);

  return { fetchPayments, fetchPaymentStats };
}
