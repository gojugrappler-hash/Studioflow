'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Appointment, Availability } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useCalendar() {
  const orgId = useAuthStore((s) => s.orgId);
  const supabase = getSupabase();

  const fetchAppointments = useCallback(async (startDate?: string, endDate?: string): Promise<Appointment[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('appointments')
      .select('*, contact:contacts(id, first_name, last_name, email, phone)')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('start_time', { ascending: true });

    if (startDate) query = query.gte('start_time', startDate);
    if (endDate) query = query.lte('start_time', endDate);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Appointment[];
  }, [orgId, supabase]);

  const createAppointment = useCallback(async (apt: Partial<Appointment>): Promise<Appointment> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('appointments')
      .insert({ ...apt, org_id: orgId })
      .select('*, contact:contacts(id, first_name, last_name, email, phone)')
      .single();
    if (error) throw error;
    return data as Appointment;
  }, [orgId, supabase]);

  const updateAppointment = useCallback(async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('appointments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, contact:contacts(id, first_name, last_name, email, phone)')
      .single();
    if (error) throw error;
    return data as Appointment;
  }, [supabase]);

  const deleteAppointment = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('appointments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  const fetchAvailability = useCallback(async (): Promise<Availability[]> => {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('org_id', orgId)
      .order('day_of_week');
    if (error) throw error;
    return (data || []) as Availability[];
  }, [orgId, supabase]);

  const updateAvailability = useCallback(async (id: string, updates: Partial<Availability>): Promise<Availability> => {
    const { data, error } = await supabase
      .from('availability')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Availability;
  }, [supabase]);

  return { fetchAppointments, createAppointment, updateAppointment, deleteAppointment, fetchAvailability, updateAvailability };
}
