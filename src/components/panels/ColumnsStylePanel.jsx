const RATIO_OPTIONS = [
  { value: '50-50', label: '50 / 50' },
  { value: '33-66', label: '33 / 66' },
  { value: '66-33', label: '66 / 33' },
];

export default function ColumnsStylePanel({ editor }) {
  if (!editor) return null;
  if (!editor.isActive('blockColumns')) return null;

  const attrs = editor.getAttributes('blockColumns');
  function update(patch) { editor.chain().focus().updateAttributes('blockColumns', patch).run(); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        COLUMNS
      </h3>

      <div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 6 }}>Column ratio</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {RATIO_OPTIONS.map(r => (
            <button
              key={r.value}
              onClick={() => update({ ratio: r.value })}
              style={{
                padding: '8px 12px', textAlign: 'left',
                background: attrs.ratio === r.value ? 'var(--color-accent-soft)' : 'var(--color-ghost)',
                color: attrs.ratio === r.value ? 'var(--color-accent)' : 'var(--color-ink)',
                border: `1px solid ${attrs.ratio === r.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontSize: 'var(--text-sm)', fontWeight: attrs.ratio === r.value ? 600 : 400,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
