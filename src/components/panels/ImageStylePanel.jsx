import NumberInput from '../ui/NumberInput.jsx';

const ALIGN_OPTIONS = ['left', 'center', 'right'];

export default function ImageStylePanel({ editor }) {
  if (!editor) return null;
  if (!editor.isActive('blockImage')) return null;

  const attrs = editor.getAttributes('blockImage');

  function update(patch) {
    editor.chain().focus().updateAttributes('blockImage', patch).run();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        IMAGE
      </h3>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 4 }}>
          Source URL
        </label>
        <input
          type="url"
          value={attrs.src || ''}
          onChange={e => update({ src: e.target.value })}
          placeholder="https://example.com/image.png"
          style={{
            width: '100%', padding: '6px 8px', boxSizing: 'border-box',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 4 }}>
          Alt text
        </label>
        <input
          type="text"
          value={attrs.alt || ''}
          onChange={e => update({ alt: e.target.value })}
          placeholder="Descriptive alt text"
          style={{
            width: '100%', padding: '6px 8px', boxSizing: 'border-box',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 4 }}>
          Width
        </label>
        <input
          type="text"
          value={attrs.width || '100%'}
          onChange={e => update({ width: e.target.value })}
          placeholder="100% or 600px"
          style={{
            width: '100%', padding: '6px 8px', boxSizing: 'border-box',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
          }}
        />
      </div>

      <div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 6 }}>Alignment</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {ALIGN_OPTIONS.map(a => (
            <button
              key={a}
              onClick={() => update({ align: a })}
              style={{
                padding: '5px 12px',
                background: attrs.align === a ? 'var(--color-ink)' : 'var(--color-ghost)',
                color: attrs.align === a ? 'var(--color-white)' : 'var(--color-slate)',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', fontSize: 'var(--text-xs)', textTransform: 'capitalize',
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 4 }}>
          Link URL (optional)
        </label>
        <input
          type="url"
          value={attrs.href || ''}
          onChange={e => update({ href: e.target.value || null })}
          placeholder="https://example.com"
          style={{
            width: '100%', padding: '6px 8px', boxSizing: 'border-box',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
          }}
        />
      </div>
    </div>
  );
}
