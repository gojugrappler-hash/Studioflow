'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';
import type { Product, Contact, InvoiceItem } from '@/types/database';

interface InvoiceFormProps {
  contacts: Contact[];
  products: Product[];
  onSave: (data: { contact_id: string | null; due_date: string | null; tax_rate: number; notes: string; items: Partial<InvoiceItem>[] }) => void;
  onClose: () => void;
}

export function InvoiceForm({ contacts, products, onSave, onClose }: InvoiceFormProps) {
  const [contactId, setContactId] = useState<string>('');
  const [contactSearch, setContactSearch] = useState('');
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState('0');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<{ description: string; quantity: string; unit_price: string; product_id: string | null }[]>([
    { description: '', quantity: '1', unit_price: '', product_id: null },
  ]);
  const [saving, setSaving] = useState(false);

  const filteredContacts = contacts.filter((c) => {
    const search = contactSearch.toLowerCase();
    return `${c.first_name} ${c.last_name}`.toLowerCase().includes(search) || (c.email || '').toLowerCase().includes(search);
  });

  const addItem = () => {
    setItems([...items, { description: '', quantity: '1', unit_price: '', product_id: null }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const addFromCatalog = (product: Product) => {
    setItems([...items, {
      description: product.name,
      quantity: '1',
      unit_price: String(product.price),
      product_id: product.id,
    }]);
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0), 0);
  const taxAmount = subtotal * ((parseFloat(taxRate) || 0) / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter((item) => item.description.trim() && parseFloat(item.unit_price) > 0);
    if (validItems.length === 0) return;
    setSaving(true);
    try {
      await onSave({
        contact_id: contactId || null,
        due_date: dueDate || null,
        tax_rate: parseFloat(taxRate) || 0,
        notes: notes.trim(),
        items: validItems.map((item) => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 1,
          unit_price: parseFloat(item.unit_price) || 0,
          product_id: item.product_id,
        })),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const selectedContact = contacts.find((c) => c.id === contactId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg h-full overflow-y-auto animate-slide-in-right"
        style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>New Invoice</h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/5 transition-colors" aria-label="Close">
            <X size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Client Selector */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Client</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                value={selectedContact ? `${selectedContact.first_name} ${selectedContact.last_name}` : contactSearch}
                onChange={(e) => { setContactSearch(e.target.value); setContactId(''); setShowContactDropdown(true); }}
                onFocus={() => setShowContactDropdown(true)}
                placeholder="Search contacts..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-indigo)' } as React.CSSProperties}
              />
              {showContactDropdown && filteredContacts.length > 0 && !contactId && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border max-h-40 overflow-y-auto z-20" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  {filteredContacts.slice(0, 8).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setContactId(c.id); setContactSearch(''); setShowContactDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {c.first_name} {c.last_name}
                      {c.email && <span className="ml-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{c.email}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2"
              style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-indigo)' } as React.CSSProperties}
            />
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Line Items</label>
              <button type="button" onClick={addItem} className="text-xs flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/5 transition-colors" style={{ color: 'var(--accent-indigo)' }}>
                <Plus size={12} />Custom Item
              </button>
            </div>

            {/* Quick add from catalog */}
            {products.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {products.filter((p) => p.is_active).slice(0, 6).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addFromCatalog(product)}
                    className="text-xs px-2.5 py-1 rounded-full border transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    + {product.name}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_60px_80px_28px] gap-2 items-start">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    placeholder="Description"
                    className="px-2.5 py-1.5 rounded-md border text-xs outline-none transition-colors"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="px-2 py-1.5 rounded-md border text-xs outline-none font-mono text-center transition-colors"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
                    placeholder="$0.00"
                    className="px-2 py-1.5 rounded-md border text-xs outline-none font-mono transition-colors"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-1.5 rounded-md hover:bg-white/5 transition-colors mt-0.5"
                    aria-label="Remove item"
                  >
                    <Trash2 size={12} style={{ color: 'var(--error)' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Rate */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-24 px-3 py-2 rounded-lg border text-sm outline-none font-mono transition-colors focus:ring-2"
              style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-indigo)' } as React.CSSProperties}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment terms, thank you note, etc."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none transition-colors focus:ring-2"
              style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-indigo)' } as React.CSSProperties}
            />
          </div>

          {/* Totals */}
          <div className="rounded-lg p-3 space-y-1.5" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</span>
            </div>
            {parseFloat(taxRate) > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Tax ({taxRate}%)</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>${taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-1.5 border-t" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-primary)' }}>Total</span>
              <span className="font-mono" style={{ color: 'var(--accent-teal)' }}>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || items.filter((i) => i.description.trim() && parseFloat(i.unit_price) > 0).length === 0}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200 disabled:opacity-50"
            style={{ background: 'var(--accent-indigo)' }}
          >
            {saving ? 'Creating...' : 'Create Invoice'}
          </button>
        </form>
      </div>
    </div>
  );
}
