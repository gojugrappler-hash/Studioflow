'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Circle, CircleDot, CheckCircle2, Trash2, Edit,
  Calendar, AlertTriangle, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import type { Task, TaskStatus } from '@/types/database';

const statusIcons: Record<TaskStatus, React.ElementType> = {
  todo: Circle,
  in_progress: CircleDot,
  done: CheckCircle2,
};

const statusColors: Record<TaskStatus, string> = {
  todo: 'var(--text-tertiary)',
  in_progress: 'var(--accent-blue)',
  done: 'var(--success)',
};

const priorityConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  urgent: { icon: AlertTriangle, color: 'var(--error)', bg: 'var(--error-bg)' },
  high: { icon: ArrowUp, color: 'var(--warning)', bg: 'var(--warning-bg)' },
  medium: { icon: Minus, color: 'var(--accent-blue)', bg: 'rgba(96, 165, 250, 0.1)' },
  low: { icon: ArrowDown, color: 'var(--text-tertiary)', bg: 'rgba(90, 90, 114, 0.1)' },
};

function formatDueDate(dateStr: string | null): { text: string; isOverdue: boolean } {
  if (!dateStr) return { text: '', isOverdue: false };
  const due = new Date(dateStr + 'T23:59:59');
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: Math.abs(diffDays) + 'd overdue', isOverdue: true };
  if (diffDays === 0) return { text: 'Today', isOverdue: false };
  if (diffDays === 1) return { text: 'Tomorrow', isOverdue: false };
  if (diffDays <= 7) return { text: diffDays + 'd', isOverdue: false };
  return { text: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), isOverdue: false };
}

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggleStatus, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-1">
      <AnimatePresence>
        {tasks.map((task, idx) => {
          const StatusIcon = statusIcons[task.status];
          const pConfig = priorityConfig[task.priority];
          const PriorityIcon = pConfig.icon;
          const dueInfo = formatDueDate(task.due_date);
          const isDone = task.status === 'done';

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="glass-card flex items-center gap-3 px-4 py-3 group"
            >
              {/* Status Toggle */}
              <motion.button
                onClick={() => onToggleStatus(task)}
                className="shrink-0 p-0.5 rounded-full transition-colors"
                style={{ color: statusColors[task.status] }}
                whileTap={{ scale: 0.85 }}
                aria-label={`Toggle task status: ${task.status}`}
              >
                <StatusIcon size={20} />
              </motion.button>

              {/* Content */}
              <div className="flex-1 min-w-0" onClick={() => onEdit(task)} style={{ cursor: 'pointer' }}>
                <p
                  className="text-sm font-medium truncate"
                  style={{
                    color: isDone ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                    {task.description}
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Priority Badge */}
                <span
                  className="badge text-[10px] flex items-center gap-1"
                  style={{ background: pConfig.bg, color: pConfig.color }}
                >
                  <PriorityIcon size={10} />
                  {task.priority}
                </span>

                {/* Due Date */}
                {dueInfo.text && (
                  <span
                    className="flex items-center gap-1 text-[10px]"
                    style={{ color: dueInfo.isOverdue ? 'var(--error)' : 'var(--text-tertiary)' }}
                  >
                    <Calendar size={10} />
                    {dueInfo.text}
                  </span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 rounded transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                    aria-label="Edit task"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 rounded transition-colors"
                    style={{ color: 'var(--error)' }}
                    aria-label="Delete task"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
