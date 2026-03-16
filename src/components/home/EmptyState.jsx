import Icon from '../ui/Icon.jsx';

export default function EmptyState({ onCreateBlank, onCreateFromTemplate }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: 16,
      padding: 48,
    }}>
      {/* Icon mark */}
      <div style={{
        width: 48, height: 48,
        background: 'var(--color-shell)',
        border: '1.5px solid var(--color-surface-mid)',
        borderRadius: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="mail" size={22} fill={1} style={{ color: '#fff' }} />
      </div>

      <div>
        <h2 style={{ margin: '0 0 8px', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.01em' }}>
          No templates yet
        </h2>
        <p style={{ margin: 0, color: 'var(--color-slate)', fontSize: 'var(--text-sm)', lineHeight: 1.6, maxWidth: 300 }}>
          Create your first email template to get started.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {/* Primary — Safety Orange */}
        <button
          onClick={onCreateBlank}
          style={{
            padding: '8px 18px',
            background: 'var(--color-punch)',
            color: '#fff',
            border: '1.5px solid var(--color-punch)',
            borderRadius: 0,
            fontWeight: 700, fontSize: 'var(--text-sm)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-punch-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-punch)'}
        >
          <Icon name="add" size={16} style={{ color: 'inherit' }} />
          New template
        </button>

        {/* Secondary — surface mid */}
        <button
          onClick={onCreateFromTemplate}
          style={{
            padding: '8px 18px',
            background: 'transparent',
            color: 'var(--color-slate)',
            border: '1.5px solid var(--color-surface-mid)',
            borderRadius: 0,
            fontWeight: 500, fontSize: 'var(--text-sm)', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-slate)'; }}
        >
          Starter templates
        </button>
      </div>
    </div>
  );
}
