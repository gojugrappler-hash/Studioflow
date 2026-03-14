'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, Mail, Phone, MoreHorizontal, Trash2, Edit, X, FileText, StickyNote } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { ActivityTimeline } from '@/components/shared/ActivityTimeline';
import { NoteCard } from '@/components/shared/NoteCard';
import { NoteEditor } from '@/components/shared/NoteEditor';
import { useContacts } from '@/hooks/useContacts';
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/hooks/useAuth';
import type { Contact, Note } from '@/types/database';

const statusColors: Record<string, string> = {
  lead: 'var(--info)',
  prospect: 'var(--accent-blue)',
  active: 'var(--success)',
  inactive: 'var(--text-tertiary)',
  archived: 'var(--text-tertiary)',
};

const statusBg: Record<string, string> = {
  lead: 'var(--info-bg)',
  prospect: 'rgba(96, 165, 250, 0.1)',
  active: 'var(--success-bg)',
  inactive: 'rgba(90, 90, 114, 0.1)',
  archived: 'rgba(90, 90, 114, 0.1)',
};

export default function ContactsPage() {
  const { orgId, loading: authLoading } = useAuth();
  const { fetchContacts, createContact, updateContact, deleteContact } = useContacts();
  const { fetchNotes, createNote, updateNote, deleteNote, togglePin } = useNotes();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  // Detail panel
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [detailTab, setDetailTab] = useState<'activity' | 'notes'>('activity');
  // Notes
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteEditorOpen, setNoteEditorOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);

  const loadContacts = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const data = await fetchContacts(search || undefined);
      setContacts(data);
    } catch (err) {
      console.error('Load contacts error:', err);
    } finally {
      setLoading(false);
    }
  }, [orgId, search, fetchContacts]);

  useEffect(() => { if (orgId) loadContacts(); }, [orgId, loadContacts]);

  useEffect(() => {
    const timer = setTimeout(() => { if (orgId) loadContacts(); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load notes when contact selected
  const loadNotes = useCallback(async () => {
    if (!selectedContact) return;
    try {
      const data = await fetchNotes('contact', selectedContact.id);
      setNotes(data);
    } catch (err) {
      console.error('Load notes error:', err);
    }
  }, [selectedContact, fetchNotes]);

  useEffect(() => { if (selectedContact) loadNotes(); }, [selectedContact, loadNotes]);

  const handleCreate = async (data: Partial<Contact>) => {
    await createContact(data);
    await loadContacts();
  };

  const handleUpdate = async (data: Partial<Contact>) => {
    if (!editContact) return;
    await updateContact(editContact.id, data);
    setEditContact(null);
    await loadContacts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    await deleteContact(id);
    setMenuOpen(null);
    if (selectedContact?.id === id) setSelectedContact(null);
    await loadContacts();
  };

  const handleCreateNote = async (data: { title: string; content: string }) => {
    if (!selectedContact) return;
    await createNote({ entity_type: 'contact', entity_id: selectedContact.id, ...data });
    await loadNotes();
  };

  const handleUpdateNote = async (data: { title: string; content: string }) => {
    if (!editNote) return;
    await updateNote(editNote.id, data);
    setEditNote(null);
    await loadNotes();
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    await deleteNote(id);
    await loadNotes();
  };

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    await togglePin(id, isPinned);
    await loadNotes();
  };

  if (authLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-shimmer h-10 w-64 rounded-md" />
        <div className="animate-shimmer h-12 w-full rounded-md" />
        <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="animate-shimmer h-16 w-full rounded-md" />)}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex gap-4" style={{ minHeight: 'calc(100vh - var(--topbar-height) - 48px)' }}>
        {/* Main List */}
        <div className={selectedContact ? 'flex-1 min-w-0' : 'w-full'}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Contacts</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{contacts.length} total contacts</p>
            </div>
            <motion.button
              onClick={() => { setEditContact(null); setFormOpen(true); }}
              className="btn btn-primary"
              whileTap={{ scale: 0.97 }}
            >
              <Plus size={16} /> Add Contact
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts by name or email..."
              className="pl-9"
              style={{ maxWidth: '400px' }}
            />
          </div>

          {/* Contact List */}
          {loading ? (
            <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="animate-shimmer h-16 w-full rounded-md" />)}</div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--info-bg)' }}>
                <Users size={32} style={{ color: 'var(--accent-indigo)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No contacts yet</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Add your first client to get started</p>
              <button onClick={() => { setEditContact(null); setFormOpen(true); }} className="btn btn-primary"><Plus size={16} /> Add Contact</button>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_100px_80px] gap-4 px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border)' }}>
                <span>Name</span>
                <span className="hidden md:block">Email</span>
                <span className="hidden md:block">Phone</span>
                <span>Status</span>
                <span></span>
              </div>

              {/* Table Rows */}
              <AnimatePresence>
                {contacts.map((contact, idx) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.03 }}
                    className="grid grid-cols-[1fr_1fr_1fr_100px_80px] gap-4 px-4 py-3 items-center cursor-pointer transition-colors"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: selectedContact?.id === contact.id ? 'var(--info-bg)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (selectedContact?.id !== contact.id) e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                    onMouseLeave={(e) => { if (selectedContact?.id !== contact.id) e.currentTarget.style.background = 'transparent'; }}
                    onClick={() => setSelectedContact(contact)}
                  >
                    {/* Name + Avatar */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))', color: '#fff' }}>
                        {(contact.first_name?.[0] || '').toUpperCase()}{(contact.last_name?.[0] || '').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{contact.first_name} {contact.last_name}</p>
                        {contact.company && <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{(contact.company as { name: string }).name}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="hidden md:flex items-center gap-1.5 text-sm min-w-0" style={{ color: 'var(--text-secondary)' }}>
                      {contact.email && <><Mail size={13} className="shrink-0" /><span className="truncate">{contact.email}</span></>}
                    </div>

                    {/* Phone */}
                    <div className="hidden md:flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {contact.phone && <><Phone size={13} className="shrink-0" /><span>{contact.phone}</span></>}
                    </div>

                    {/* Status Badge */}
                    <span className="badge text-xs" style={{ background: statusBg[contact.status], color: statusColors[contact.status] }}>
                      {contact.status}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 relative" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setMenuOpen(menuOpen === contact.id ? null : contact.id)}
                        className="p-1.5 rounded transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                        aria-label="Contact actions"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {menuOpen === contact.id && (
                        <div className="absolute right-0 top-8 z-20 py-1 rounded-md min-w-[140px]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                          <button onClick={() => { setEditContact(contact); setFormOpen(true); setMenuOpen(null); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors" style={{ color: 'var(--text-secondary)' }}>
                            <Edit size={14} /> Edit
                          </button>
                          <button onClick={() => handleDelete(contact.id)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors" style={{ color: 'var(--error)' }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedContact && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 380 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="hidden lg:flex flex-col shrink-0 overflow-hidden rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))', color: '#fff' }}>
                    {(selectedContact.first_name?.[0] || '').toUpperCase()}{(selectedContact.last_name?.[0] || '').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{selectedContact.first_name} {selectedContact.last_name}</p>
                    <span className="badge text-[10px]" style={{ background: statusBg[selectedContact.status], color: statusColors[selectedContact.status] }}>{selectedContact.status}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedContact(null)} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }} aria-label="Close panel">
                  <X size={16} />
                </button>
              </div>

              {/* Contact Info */}
              <div className="px-4 py-3 space-y-1.5 text-xs" style={{ borderBottom: '1px solid var(--border)' }}>
                {selectedContact.email && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Mail size={12} className="shrink-0" /> <span>{selectedContact.email}</span>
                  </div>
                )}
                {selectedContact.phone && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Phone size={12} className="shrink-0" /> <span>{selectedContact.phone}</span>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex px-4 pt-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <button
                  onClick={() => setDetailTab('activity')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
                  style={{
                    color: detailTab === 'activity' ? 'var(--accent-indigo)' : 'var(--text-tertiary)',
                    borderBottom: detailTab === 'activity' ? '2px solid var(--accent-indigo)' : '2px solid transparent',
                  }}
                >
                  <FileText size={12} /> Activity
                </button>
                <button
                  onClick={() => setDetailTab('notes')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
                  style={{
                    color: detailTab === 'notes' ? 'var(--accent-indigo)' : 'var(--text-tertiary)',
                    borderBottom: detailTab === 'notes' ? '2px solid var(--accent-indigo)' : '2px solid transparent',
                  }}
                >
                  <StickyNote size={12} /> Notes
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {detailTab === 'activity' ? (
                  <ActivityTimeline entityType="contact" entityId={selectedContact.id} />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Notes</h4>
                      <button
                        onClick={() => { setEditNote(null); setNoteEditorOpen(true); }}
                        className="btn btn-ghost text-xs"
                        style={{ padding: '4px 8px' }}
                      >
                        + Add
                      </button>
                    </div>
                    {notes.length === 0 ? (
                      <div className="text-center py-8">
                        <StickyNote size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No notes yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            onEdit={(n) => { setEditNote(n); setNoteEditorOpen(true); }}
                            onDelete={handleDeleteNote}
                            onTogglePin={handleTogglePin}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Form */}
      <ContactForm
        contact={editContact}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditContact(null); }}
        onSave={editContact ? handleUpdate : handleCreate}
      />

      {/* Note Editor */}
      <NoteEditor
        note={editNote}
        open={noteEditorOpen}
        onClose={() => { setNoteEditorOpen(false); setEditNote(null); }}
        onSave={editNote ? handleUpdateNote : handleCreateNote}
      />
    </div>
  );
}
