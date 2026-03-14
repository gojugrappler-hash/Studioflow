'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Package, DollarSign, AlertCircle, Clock } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useInvoices } from '@/hooks/useInvoices';
import { useContacts } from '@/hooks/useContacts';
import { ProductCard } from '@/components/invoices/ProductCard';
import { ProductForm } from '@/components/invoices/ProductForm';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';
import { PaymentBadge } from '@/components/invoices/PaymentBadge';
import type { Product, Invoice, InvoiceItem, Contact, InvoiceStatus } from '@/types/database';

type Tab = 'invoices' | 'products';

export default function InvoicesPage() {
  const [tab, setTab] = useState<Tab>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Filter
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');

  const { fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const { fetchInvoices, fetchInvoice, createInvoice, sendInvoice, deleteInvoice, recordPayment } = useInvoices();
  const { fetchContacts } = useContacts();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [inv, prod, cont] = await Promise.all([
        fetchInvoices(statusFilter ? { status: statusFilter } : undefined),
        fetchProducts(),
        fetchContacts(),
      ]);
      setInvoices(inv);
      setProducts(prod);
      setContacts(cont);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchInvoices, fetchProducts, fetchContacts, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  // Load detail view
  useEffect(() => {
    if (viewingInvoiceId) {
      fetchInvoice(viewingInvoiceId).then(setViewingInvoice);
    } else {
      setViewingInvoice(null);
    }
  }, [viewingInvoiceId, fetchInvoice]);

  // Stats
  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + Number(i.total), 0);
  const outstanding = invoices.filter((i) => i.status === 'sent').reduce((sum, i) => sum + Number(i.total), 0);
  const overdueCount = invoices.filter((i) => i.status === 'overdue' || (i.due_date && new Date(i.due_date) < new Date() && i.status === 'sent')).length;
  const draftCount = invoices.filter((i) => i.status === 'draft').length;

  // Handlers
  const handleCreateProduct = async (data: Partial<Product>) => {
    await createProduct(data);
    loadData();
  };

  const handleUpdateProduct = async (data: Partial<Product>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
      loadData();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    loadData();
  };

  const handleCreateInvoice = async (data: { contact_id: string | null; due_date: string | null; tax_rate: number; notes: string; items: Partial<InvoiceItem>[] }) => {
    await createInvoice(
      { contact_id: data.contact_id, due_date: data.due_date, tax_rate: data.tax_rate, notes: data.notes },
      data.items
    );
    loadData();
  };

  const handleSendInvoice = async (id: string) => {
    await sendInvoice(id);
    loadData();
    if (viewingInvoiceId === id) {
      fetchInvoice(id).then(setViewingInvoice);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    await deleteInvoice(id);
    if (viewingInvoiceId === id) setViewingInvoiceId(null);
    loadData();
  };

  const handleRecordPayment = async (id: string) => {
    // Quick record full payment
    const invoice = invoices.find((i) => i.id === id) || viewingInvoice;
    if (!invoice) return;
    await recordPayment(id, { amount: Number(invoice.total), method: 'other' });
    loadData();
    if (viewingInvoiceId === id) {
      fetchInvoice(id).then(setViewingInvoice);
    }
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  // Detail view
  if (viewingInvoice) {
    return (
      <InvoiceDetail
        invoice={viewingInvoice}
        onBack={() => setViewingInvoiceId(null)}
        onSend={handleSendInvoice}
        onRecordPayment={handleRecordPayment}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Invoices</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage invoices, products, and payments</p>
        </div>
        <button
          onClick={() => tab === 'invoices' ? setShowInvoiceForm(true) : setShowProductForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: 'var(--accent-indigo)' }}
        >
          <Plus size={16} />
          {tab === 'invoices' ? 'New Invoice' : 'Add Product'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={14} style={{ color: 'var(--success)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Revenue</span>
          </div>
          <span className="text-xl font-bold font-mono" style={{ color: 'var(--success)' }}>{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} style={{ color: 'var(--accent-blue)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Outstanding</span>
          </div>
          <span className="text-xl font-bold font-mono" style={{ color: 'var(--accent-blue)' }}>{formatCurrency(outstanding)}</span>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} style={{ color: 'var(--error)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Overdue</span>
          </div>
          <span className="text-xl font-bold font-mono" style={{ color: 'var(--error)' }}>{overdueCount}</span>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Drafts</span>
          </div>
          <span className="text-xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{draftCount}</span>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-1 mb-4 p-1 rounded-lg w-fit" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <button
          onClick={() => setTab('invoices')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
          style={{
            background: tab === 'invoices' ? 'var(--accent-indigo)' : 'transparent',
            color: tab === 'invoices' ? '#fff' : 'var(--text-secondary)',
          }}
        >
          <FileText size={14} />
          Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setTab('products')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
          style={{
            background: tab === 'products' ? 'var(--accent-indigo)' : 'transparent',
            color: tab === 'products' ? '#fff' : 'var(--text-secondary)',
          }}
        >
          <Package size={14} />
          Products ({products.length})
        </button>
      </div>

      {/* Invoices Tab */}
      {tab === 'invoices' && (
        <div>
          {/* Status Filter */}
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {(['' as const, 'draft', 'sent', 'paid', 'overdue', 'cancelled'] as const).map((status) => (
              <button
                key={status || 'all'}
                onClick={() => setStatusFilter(status)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background: statusFilter === status ? 'var(--accent-indigo)' : 'var(--bg-card)',
                  color: statusFilter === status ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${statusFilter === status ? 'var(--accent-indigo)' : 'var(--border)'}`,
                }}
              >
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--bg-card)' }} />
              ))}
            </div>
          ) : invoices.length > 0 ? (
            <InvoiceList
              invoices={invoices}
              onView={(id) => setViewingInvoiceId(id)}
              onSend={handleSendInvoice}
              onDelete={handleDeleteInvoice}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(129, 140, 248, 0.15)' }}>
                <FileText size={32} style={{ color: 'var(--accent-indigo)' }} />
              </div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No invoices yet</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Create your first invoice to start getting paid</p>
              <button
                onClick={() => setShowInvoiceForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: 'var(--accent-indigo)' }}
              >
                <Plus size={16} />
                New Invoice
              </button>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: 'var(--bg-card)' }} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={(p) => { setEditingProduct(p); setShowProductForm(true); }}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(45, 212, 191, 0.15)' }}>
                <Package size={32} style={{ color: 'var(--accent-teal)' }} />
              </div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No products yet</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Add your services to quickly build invoices</p>
              <button
                onClick={() => setShowProductForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: 'var(--accent-teal)' }}
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Form */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
        />
      )}

      {/* Invoice Form */}
      {showInvoiceForm && (
        <InvoiceForm
          contacts={contacts}
          products={products}
          onSave={handleCreateInvoice}
          onClose={() => setShowInvoiceForm(false)}
        />
      )}
    </div>
  );
}
