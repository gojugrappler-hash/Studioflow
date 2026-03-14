'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, Filter, Search } from 'lucide-react';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTasks, type TaskFilters } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import type { Task, TaskStatus, TaskPriority } from '@/types/database';

const statusOptions: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityOptions: { value: TaskPriority | ''; label: string }[] = [
  { value: '', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function TasksPage() {
  const { orgId, loading: authLoading } = useAuth();
  const { fetchTasks, createTask, updateTask, toggleTaskStatus, deleteTask } = useTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');

  const loadTasks = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const filters: TaskFilters = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (search) filters.search = search;
      const data = await fetchTasks(filters);
      setTasks(data);
    } catch (err) {
      console.error('Load tasks error:', err);
    } finally {
      setLoading(false);
    }
  }, [orgId, statusFilter, priorityFilter, search, fetchTasks]);

  useEffect(() => { if (orgId) loadTasks(); }, [orgId, loadTasks]);

  useEffect(() => {
    const timer = setTimeout(() => { if (orgId) loadTasks(); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreate = async (data: Partial<Task>) => {
    await createTask(data);
    await loadTasks();
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!editTask) return;
    await updateTask(editTask.id, data);
    setEditTask(null);
    await loadTasks();
  };

  const handleToggle = async (task: Task) => {
    await toggleTaskStatus(task);
    await loadTasks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    await deleteTask(id);
    await loadTasks();
  };

  // Stats
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  if (authLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-shimmer h-10 w-64 rounded-md" />
        <div className="animate-shimmer h-12 w-full rounded-md" />
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="animate-shimmer h-14 w-full rounded-md" />)}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Tasks</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {todoCount} to do · {inProgressCount} in progress · {doneCount} done
          </p>
        </div>
        <motion.button
          onClick={() => { setEditTask(null); setFormOpen(true); }}
          className="btn btn-primary"
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={16} /> Add Task
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="pl-8"
            style={{ fontSize: '13px', padding: '7px 8px 7px 32px' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
          style={{ maxWidth: '140px', fontSize: '12px', padding: '7px 28px 7px 8px' }}
        >
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | '')}
          style={{ maxWidth: '140px', fontSize: '12px', padding: '7px 28px 7px 8px' }}
        >
          {priorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="animate-shimmer h-14 w-full rounded-md" />)}</div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--info-bg)' }}>
            <CheckSquare size={32} style={{ color: 'var(--accent-indigo)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No tasks yet</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Create your first task to start tracking work</p>
          <button onClick={() => { setEditTask(null); setFormOpen(true); }} className="btn btn-primary"><Plus size={16} /> Add Task</button>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleStatus={handleToggle}
          onEdit={(task) => { setEditTask(task); setFormOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      <TaskForm
        task={editTask}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTask(null); }}
        onSave={editTask ? handleUpdate : handleCreate}
      />
    </div>
  );
}
