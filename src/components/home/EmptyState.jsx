import Icon from '../ui/Icon.jsx';

export default function EmptyState({ onCreateBlank, onCreateFromTemplate }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: 48,
    }}>
      <Icon name="mail" size={48} style={{ color: 'var(--color-border)' }} />
      <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 }}>
        No templates yet
      </h2>
      <p style={{ margin: 0, color: 'var(--color-slate)', fontSize: 'var(--text-sm)', textAlign: 'center', maxWidth: 320 }}>
        Create your first email template to get started. Use a starter template or begin from scratch.
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button
          onClick={onCreateBlank}
          style={{
            padding: '10px 20px',
            background: 'var(--color-amber)', color: 'var(--color-white)',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <Icon name="add" size={16} style={{ color: 'inherit' }} />
          Blank template
        </button>
        <button
          onClick={onCreateFromTemplate}
          style={{
            padding: '10px 20px',
            background: 'transparent', color: 'var(--color-slate)',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
            fontWeight: 500, fontSize: 'var(--text-sm)', cursor: 'pointer',
          }}
        >
          Use starter
        </button>
      </div>
    </div>
  );
}
