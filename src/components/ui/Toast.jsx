import { useState, useCallback, useRef } from 'react';

let toastId = 0;

// Global toast state
let globalSetToasts = null;

export function useToast() {
  const add = useCallback((message, type = 'info') => {
    if (!globalSetToasts) return;
    const id = ++toastId;
    globalSetToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      globalSetToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return { toast: add };
}

const TYPE_STYLES = {
  info:    { background: 'var(--color-info-bg)',    color: 'var(--color-info)',    border: 'var(--color-info)' },
  success: { background: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success)' },
  danger:  { background: 'var(--color-danger-bg)',  color: 'var(--color-danger)',  border: 'var(--color-danger)' },
};

function ToastItem({ toast }) {
  const s = TYPE_STYLES[toast.type] || TYPE_STYLES.info;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderRadius: 'var(--radius-lg)',
        background: s.background,
        border: `1px solid ${s.border}`,
        color: s.color,
        boxShadow: 'var(--shadow-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        minWidth: 240,
        maxWidth: 360,
        animation: 'slideIn 0.2s ease',
      }}
    >
      {toast.message}
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  globalSetToasts = setToasts;

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </>
  );
}
