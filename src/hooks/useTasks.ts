'use client';

import { useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/authStore';
import type { Task, TaskStatus, TaskPriority } from '@/types/database';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export function useTasks() {
  const orgId = useAuthStore((s) => s.orgId);
  const userId = useAuthStore((s) => s.userId);
  const supabase = getSupabase();

  const fetchTasks = useCallback(async (filters?: TaskFilters): Promise<Task[]> => {
    if (!orgId) return [];
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('priority', { ascending: true })
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Task[];
  }, [orgId, supabase]);

  const createTask = useCallback(async (task: Partial<Task>): Promise<Task> => {
    if (!orgId) throw new Error('No org');
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        org_id: orgId,
        created_by: userId,
        assigned_to: task.assigned_to || userId,
      })
      .select('*')
      .single();
    if (error) throw error;
    return data as Task;
  }, [orgId, userId, supabase]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Task;
  }, [supabase]);

  const toggleTaskStatus = useCallback(async (task: Task): Promise<Task> => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    };
    const newStatus = nextStatus[task.status];
    const updates: Partial<Task> = {
      status: newStatus,
      completed_at: newStatus === 'done' ? new Date().toISOString() : null,
    };
    return updateTask(task.id, updates);
  }, [updateTask]);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }, [supabase]);

  return { fetchTasks, createTask, updateTask, toggleTaskStatus, deleteTask };
}
