'use client';

import { Package, Edit2, Trash2, DollarSign, Clock, Layers } from 'lucide-react';
import type { Product, PriceType } from '@/types/database';

const priceTypeConfig: Record<PriceType, { icon: React.ReactNode; label: string; color: string }> = {
  fixed: { icon: <DollarSign size={12} />, label: 'Fixed', color: 'var(--accent-teal)' },
  hourly: { icon: <Clock size={12} />, label: 'Hourly', color: 'var(--accent-blue)' },
  package: { icon: <Layers size={12} />, label: 'Package', color: 'var(--accent-indigo)' },
};

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const typeConfig = priceTypeConfig[product.price_type] || priceTypeConfig.fixed;

  return (
    <div
      className="group relative rounded-xl p-4 border transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(129, 140, 248, 0.15)' }}
          >
            <Package size={18} style={{ color: 'var(--accent-indigo)' }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
            aria-label="Edit product"
          >
            <Edit2 size={14} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
            aria-label="Delete product"
          >
            <Trash2 size={14} style={{ color: 'var(--error)' }} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: `${typeConfig.color}20`, color: typeConfig.color }}
        >
          {typeConfig.icon}
          {typeConfig.label}
        </span>
        <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          ${Number(product.price).toFixed(2)}
          {product.price_type === 'hourly' && <span className="text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>/hr</span>}
        </span>
      </div>

      {/* Inactive overlay */}
      {!product.is_active && (
        <div className="absolute inset-0 rounded-xl bg-black/30 flex items-center justify-center">
          <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
            Inactive
          </span>
        </div>
      )}
    </div>
  );
}
