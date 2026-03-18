import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../ui/Icon.jsx';

const COMMANDS = [
  {
    group: 'Text',
    items: [
      { label: 'Paragraph', desc: 'Plain text', icon: 'notes', type: 'paragraph' },
      { label: 'Heading 1', desc: 'Large heading', icon: 'title', type: 'heading', meta: { level: 1 } },
      { label: 'Heading 2', desc: 'Medium heading', icon: 'title', type: 'heading', meta: { level: 2 } },
      { label: 'Heading 3', desc: 'Small heading', icon: 'title', type: 'heading', meta: { level: 3 } },
    ],
  },
  {
    group: 'Blocks',
    items: [
      { label: 'Image', desc: 'Upload or embed image', icon: 'image', type: 'image' },
      { label: 'Button', desc: 'Call-to-action button', icon: 'smart_button', type: 'button' },
      { label: 'Divider', desc: 'Horizontal line', icon: 'horizontal_rule', type: 'divider' },
      { label: 'Spacer', desc: 'Vertical spacing', icon: 'expand', type: 'spacer' },
      { label: 'Two Columns', desc: 'Side-by-side layout', icon: 'view_column_2', type: 'columns' },
      { label: 'Three Columns', desc: 'Three-column layout', icon: 'view_column', type: 'columns-3' },
      { label: 'Social Icons', desc: 'Social media links', icon: 'share', type: 'socialIcons' },
    ],
  },
];

export default function SlashMenu({ rect, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const allItems = COMMANDS.flatMap(g =>
    g.items.map(item => ({ ...item, group: g.group }))
  );
  const filtered = query
    ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[selectedIndex]) onSelect(filtered[selectedIndex].type, filtered[selectedIndex].meta); }
  }, [filtered, selectedIndex, onSelect, onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        zIndex: 1000,
        width: '280px',
        maxHeight: '320px',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        border: '1px solid var(--color-border)',
        padding: '4px',
      }}
    >
      <div style={{ padding: '8px 8px 4px' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Filter…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%', border: 'none', outline: 'none',
            fontSize: '14px', color: 'var(--color-ink)',
            padding: '4px 0', background: 'transparent',
          }}
        />
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '12px', color: 'var(--color-muted)', fontSize: '13px', textAlign: 'center' }}>
          No matching blocks
        </div>
      )}

      {(() => {
        let lastGroup = '';
        return filtered.map((item, i) => {
          const showGroup = item.group !== lastGroup;
          lastGroup = item.group;
          return (
            <div key={`${item.type}-${item.label}`}>
              {showGroup && (
                <div style={{
                  fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: 'var(--color-muted)', padding: '8px 8px 4px',
                }}>
                  {item.group}
                </div>
              )}
              <button
                onClick={() => onSelect(item.type, item.meta)}
                onMouseEnter={() => setSelectedIndex(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '8px', border: 'none', borderRadius: '4px',
                  background: i === selectedIndex ? 'var(--color-ghost)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', fontSize: '14px',
                  color: 'var(--color-ink)', transition: 'background 0.05s',
                }}
              >
                <Icon name={item.icon} size={18} style={{ color: 'var(--color-slate)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{item.desc}</div>
                </div>
              </button>
            </div>
          );
        });
      })()}
    </div>
  );
}
