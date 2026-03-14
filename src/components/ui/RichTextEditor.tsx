'use client';

import React, { useCallback, useMemo } from 'react';

/**
 * Rich Text Editor Component
 * 
 * Scaffold for Tiptap integration. Currently renders a styled textarea.
 * To activate: Install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
 * Then replace the textarea with the Tiptap editor.
 * 
 * Usage:
 * <RichTextEditor value={content} onChange={setContent} placeholder="Write something..." />
 */

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '150px',
  maxHeight = '400px',
  disabled = false,
  className = '',
}: RichTextEditorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  // Toolbar buttons (will be wired to Tiptap commands once installed)
  const toolbar = useMemo(
    () => [
      { label: 'B', title: 'Bold', style: 'font-weight: 700' },
      { label: 'I', title: 'Italic', style: 'font-style: italic' },
      { label: 'U', title: 'Underline', style: 'text-decoration: underline' },
      { label: '•', title: 'Bullet List', style: '' },
      { label: '1.', title: 'Numbered List', style: '' },
      { label: '"', title: 'Quote', style: '' },
    ],
    []
  );

  return (
    <div className={`rte-container ${className}`} style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          padding: '8px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
        }}
      >
        {toolbar.map((btn) => (
          <button
            key={btn.title}
            type="button"
            title={btn.title}
            disabled={disabled}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              borderRadius: '4px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              ...(btn.style ? { fontWeight: btn.label === 'B' ? 700 : undefined, fontStyle: btn.label === 'I' ? 'italic' : undefined } : {}),
            }}
            aria-label={btn.title}
          >
            {btn.label}
          </button>
        ))}
      </div>
      {/* Editor Area */}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          minHeight,
          maxHeight,
          padding: '16px',
          border: 'none',
          outline: 'none',
          resize: 'vertical',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          lineHeight: '1.6',
        }}
        aria-label="Rich text editor"
      />
    </div>
  );
}
