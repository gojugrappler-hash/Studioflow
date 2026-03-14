'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, DollarSign } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePipeline, useDeals } from '@/hooks/useDeals';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/hooks/useAuth';
import { DealForm } from '@/components/pipeline/DealForm';
import type { Deal, PipelineStage, Contact } from '@/types/database';

function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const days = Math.floor((Date.now() - new Date(deal.created_at).getTime()) / 86400000);
  const contactName = deal.contact
    ? `${(deal.contact as { first_name: string }).first_name} ${(deal.contact as { last_name: string }).last_name}`
    : null;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div
        className="glass-card p-3 mb-2 cursor-pointer group"
        onClick={onClick}
        whileHover={{ scale: 1.01 }}
        layout
      >
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm font-medium flex-1 mr-2" style={{ color: 'var(--text-primary)' }}>{deal.title}</p>
          <button {...listeners} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-grab" style={{ color: 'var(--text-tertiary)' }}>
            <GripVertical size={14} />
          </button>
        </div>
        {contactName && <p className="text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>{contactName}</p>}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>
            <DollarSign size={13} />{deal.value?.toLocaleString()}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-card)', color: 'var(--text-tertiary)' }}>
            {days}d
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function StageColumn({ stage, deals, onDealClick, onNewDeal }: { stage: PipelineStage; deals: Deal[]; onDealClick: (d: Deal) => void; onNewDeal: (stageId: string) => void }) {
  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="flex flex-col min-w-[280px] max-w-[280px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{stage.name}</h3>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--bg-card)', color: 'var(--text-tertiary)' }}>{deals.length}</span>
        </div>
        <button onClick={() => onNewDeal(stage.id)} className="p-1 rounded transition-colors" style={{ color: 'var(--text-tertiary)' }} aria-label="Add deal to stage">
          <Plus size={16} />
        </button>
      </div>

      {/* Total Value */}
      <div className="text-xs mb-3 px-1" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        ${totalValue.toLocaleString()}
      </div>

      {/* Cards Container */}
      <div className="flex-1 min-h-[200px] p-1 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} onClick={() => onDealClick(deal)} />
          ))}
        </SortableContext>
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const { orgId, loading: authLoading } = useAuth();
  const { fetchPipeline } = usePipeline();
  const { fetchDeals, createDeal, updateDeal } = useDeals();
  const { fetchContacts } = useContacts();
  const [pipeline, setPipeline] = useState<{ id: string; stages: PipelineStage[] } | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editDeal, setEditDeal] = useState<Deal | null>(null);
  const [presetStageId, setPresetStageId] = useState<string>('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const loadData = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const [p, c] = await Promise.all([fetchPipeline(), fetchContacts()]);
      if (p) {
        setPipeline({ id: p.id, stages: (p as { stages: PipelineStage[] }).stages || [] });
        const d = await fetchDeals(p.id);
        setDeals(d);
      }
      setContacts(c);
    } catch (err) {
      console.error('Pipeline load error:', err);
    } finally {
      setLoading(false);
    }
  }, [orgId, fetchPipeline, fetchDeals, fetchContacts]);

  useEffect(() => { if (orgId) loadData(); }, [orgId, loadData]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedDeal = deals.find(d => d.id === active.id);
    if (!draggedDeal) return;

    // Find target stage by checking which column the deal was dropped into
    const targetDeal = deals.find(d => d.id === over.id);
    if (targetDeal && targetDeal.stage_id !== draggedDeal.stage_id) {
      // Move to different stage
      const updated = deals.map(d =>
        d.id === draggedDeal.id ? { ...d, stage_id: targetDeal.stage_id } : d
      );
      setDeals(updated);
      await updateDeal(draggedDeal.id, { stage_id: targetDeal.stage_id });
    }
  };

  const handleNewDeal = (stageId: string) => {
    setEditDeal(null);
    setPresetStageId(stageId);
    setFormOpen(true);
  };

  const handleSave = async (data: Partial<Deal>) => {
    if (editDeal) {
      await updateDeal(editDeal.id, data);
    } else {
      await createDeal(data);
    }
    await loadData();
  };

  if (authLoading || loading) {
    return (
      <div className="animate-fade-in">
        <div className="animate-shimmer h-10 w-48 rounded mb-6" />
        <div className="flex gap-4 overflow-x-auto">
          {[1,2,3,4].map(i => <div key={i} className="animate-shimmer min-w-[280px] h-80 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (!pipeline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No pipeline found</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Create a workspace first via the signup flow to set up your default pipeline.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Pipeline</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{deals.length} deals &middot; ${deals.reduce((s, d) => s + (d.value || 0), 0).toLocaleString()} total</p>
        </div>
        <motion.button onClick={() => { setEditDeal(null); setPresetStageId(pipeline.stages[0]?.id || ''); setFormOpen(true); }} className="btn btn-primary" whileTap={{ scale: 0.97 }}>
          <Plus size={16} /> Add Deal
        </motion.button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
          {pipeline.stages.map(stage => (
            <StageColumn
              key={stage.id}
              stage={stage}
              deals={deals.filter(d => d.stage_id === stage.id)}
              onDealClick={(d) => { setEditDeal(d); setFormOpen(true); }}
              onNewDeal={handleNewDeal}
            />
          ))}
        </div>
      </DndContext>

      <DealForm
        deal={editDeal}
        stages={pipeline.stages}
        contacts={contacts}
        pipelineId={pipeline.id}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditDeal(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
