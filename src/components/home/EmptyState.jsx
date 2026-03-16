import Icon from '../ui/Icon.jsx';

export default function EmptyState({ onCreateBlank, onCreateFromTemplate }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 48,
    }}>
      <div style={{
        width: 52, height: 52,
        background: 'var(--color-ghost)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 4,
      }}>
        <Icon name="mail" size={24} style={{ color: 'var(--color-muted)' }} />
      </div>

      <h2 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-ink)' }}>
        No templates yet
      </h2>
      <p style={{
        margin: 0,
        color: 'var(--color-slate)',
        fontSize: 'var(--text-sm)',
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 1.6,
      }}>
        Create your first email template to get started.
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={onCreateBlank}
          style={{
            padding: '8px 18px',
            background: 'var(--color-ink)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'opacity 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Icon name="add" size={16} style={{ color: 'inherit' }} />
          New template
        </button>
        <button
          onClick={onCreateFromTemplate}
          style={{
            padding: '8px 18px',
            background: 'transparent',
            color: 'var(--color-slate)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500, fontSize: 'var(--text-sm)', cursor: 'pointer',
            transition: 'all 0.12s',
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
