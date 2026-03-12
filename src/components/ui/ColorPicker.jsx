import { useState, useRef, useEffect } from 'react';

export default function ColorPicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} ref={ref}>
      {label && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', flex: 1 }}>
          {label}
        </span>
      )}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: 28, height: 28,
            borderRadius: 'var(--radius-sm)',
            border: '2px solid var(--color-border)',
            background: value || '#000000',
            cursor: 'pointer',
            padding: 0,
          }}
          title={value}
        />
        {open && (
          <div
            style={{
              position: 'absolute',
              top: '100%', right: 0, marginTop: 4,
              background: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 12,
              boxShadow: 'var(--shadow-md)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              style={{ width: 160, height: 100, border: 'none', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              style={{
                width: '100%',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
