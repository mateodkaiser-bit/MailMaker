import { useSettingsStore } from '../../store/settings.js';

export default function VariableMenu({ editor, onClose }) {
  const { settings } = useSettingsStore();
  const variables = settings?.variables ?? [];

  function insertVariable(name) {
    editor?.chain().focus().insertContent(`{{ ${name} }}`).run();
    onClose?.();
  }

  return (
    <div style={{
      background: 'var(--color-white)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      minWidth: 200,
      padding: 4,
      zIndex: 500,
    }}>
      <div style={{ padding: '6px 12px 4px', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600 }}>
        VARIABLES
      </div>
      {variables.length === 0 && (
        <div style={{ padding: '8px 12px', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
          No variables defined
        </div>
      )}
      {variables.map(v => (
        <button
          key={v.name}
          onMouseDown={(e) => { e.preventDefault(); insertVariable(v.name); }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', textAlign: 'left',
            padding: '7px 12px',
            background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-amber)' }}>
            {'{{ '}{v.name}{' }}'}
          </span>
          <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>
            {v.fallback}
          </span>
        </button>
      ))}
    </div>
  );
}
