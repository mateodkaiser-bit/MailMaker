import { useEffect } from 'react';
import Icon from './Icon.jsx';

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26,39,48,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        style={{
          background: 'var(--color-white)',
          border: '1.5px solid #000',
          borderRadius: 0,
          boxShadow: 'none',
          width: 480,
          maxWidth: '90vw',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1.5px solid var(--color-surface-mid)',
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: 'var(--color-muted)',
          }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-muted)', padding: '4px',
              borderRadius: 0, display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '12px 20px',
            borderTop: '1.5px solid var(--color-surface-mid)',
            display: 'flex', gap: 8, justifyContent: 'flex-end',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
