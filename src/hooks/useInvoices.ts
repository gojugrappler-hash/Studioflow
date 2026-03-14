'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface InvoiceFilters {
  status?: InvoiceStatus;
  contactId?: string;
  dealId?: string;
}

export function useInvoices() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchInvoices = useCallback(async (filters?: InvoiceFilters): Promise<Invoice[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('invoices')
      .select('*, contact:contacts(id, first_name, last_name, email)')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.contactId) {
      query = query.eq('contact_id', filters.contactId);
    }
    if (filters?.dealId) {
      query = query.eq('deal_id', filters.dealId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Invoice[];
  }, [orgId, supabase]);

  const fetchInvoice = useCallback(async (id: string): Promise<Invoice | null> => {
    if (!orgId) return null;
    const { data, error } = await supabase
      .from('invoices')
      .select('*, contact:contacts(id, first_name, last_name, email, phone), items:invoice_items(*, product:products(id, name)), payments(*)')
      .eq('id', id)
      .eq('org_id', orgId)
      .single();
    if (error) { console.error(error); return null; }
    if (data && data.items) {
      (data.items as InvoiceItem[]).sort((a: InvoiceItem, b: InvoiceItem) => a.sort_order - b.sort_order);
    }
    return data as Invoice;
  }, [orgId, supabase]);

  const createInvoice = useCallback(async (
    invoice: Partial<Invoice>,
    items: Partial<InvoiceItem>[]
  ): Promise<Invoice> => {
    if (!orgId) throw new Error('No org');

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity || 1) * (item.unit_price || 0)), 0);
    const taxRate = invoice.tax_rate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const discountAmount = invoice.discount_amount || 0;
    const total = subtotal + taxAmount - discountAmount;

    const { data: inv, error: invError } = await supabase
      .from('invoices')
      .insert({
        ...invoice,
        org_id: orgId,
        invoice_number: invoice.invoice_number || '',
        subtotal,
        tax_amount: taxAmount,
        total,
      })
      .select('*')
      .single();
    if (invError) throw invError;

    // Insert line items
    if (items.length > 0) {
      const itemRows = items.map((item, idx) => ({
        invoice_id: (inv as Invoice).id,
        org_id: orgId,
        product_id: item.product_id || null,
        description: item.description || '',
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        total: (item.quantity || 1) * (item.unit_price || 0),
        sort_order: idx,
      }));
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemRows);
      if (itemsError) throw itemsError;
    }

    return inv as Invoice;
  }, [orgId, supabase]);

  const updateInvoice = useCallback(async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select('*, contact:contacts(id, first_name, last_name, email)')
      .single();
    if (error) throw error;
    return data as Invoice;
  }, [supabase]);

  const deleteInvoice = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('invoices')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const sendInvoice = useCallback(async (id: string): Promise<Invoice> => {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status: 'sent' as InvoiceStatus, sent_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, contact:contacts(id, first_name, last_name, email)')
      .single();
    if (error) throw error;
    return data as Invoice;
  }, [supabase]);

  const recordPayment = useCallback(async (invoiceId: string, payment: {
    amount: number;
    method: string;
    reference_number?: string;
    notes?: string;
  }): Promise<void> => {
    if (!orgId) throw new Error('No org');
    const { error: payError } = await supabase
      .from('payments')
      .insert({
        org_id: orgId,
        invoice_id: invoiceId,
        amount: payment.amount,
        method: payment.method,
        reference_number: payment.reference_number || null,
        notes: payment.notes || null,
        paid_at: new Date().toISOString(),
      });
    if (payError) throw payError;

    // Update invoice status to paid
    const { error: invError } = await supabase
      .from('invoices')
      .update({ status: 'paid' as InvoiceStatus, paid_at: new Date().toISOString() })
      .eq('id', invoiceId);
    if (invError) throw invError;
  }, [orgId, supabase]);

  return { fetchInvoices, fetchInvoice, createInvoice, updateInvoice, deleteInvoice, sendInvoice, recordPayment };
}
