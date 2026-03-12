import ColorPicker from '../ui/ColorPicker.jsx';
import NumberInput from '../ui/NumberInput.jsx';
import Toggle from '../ui/Toggle.jsx';

const ALIGN_OPTIONS = ['left', 'center', 'right'];

export default function ButtonStylePanel({ editor }) {
  if (!editor) return null;
  if (!editor.isActive('blockButton')) return null;

  const attrs = editor.getAttributes('blockButton');

  function update(patch) {
    editor.chain().focus().updateAttributes('blockButton', patch).run();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        BUTTON
      </h3>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 4 }}>Label</label>
        <input
          type="text"
          value={attrs.label || ''}
          onChange={e => update({ label: e.target.value })}
          style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 4 }}>URL</label>
        <input
          type="url"
          value={attrs.href || ''}
          onChange={e => update({ href: e.target.value })}
          placeholder="https://example.com"
          style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}
        />
      </div>

      <ColorPicker label="Background" value={attrs.backgroundColor} onChange={v => update({ backgroundColor: v })} />
      <ColorPicker label="Text color"  value={attrs.color}           onChange={v => update({ color: v })} />

      <NumberInput label="Border radius" value={attrs.borderRadius} onChange={v => update({ borderRadius: v })} min={0} max={40} suffix="px" />
      <NumberInput label="Font size"     value={attrs.fontSize}     onChange={v => update({ fontSize: v })}     min={10} max={32} suffix="px" />

      <div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 6 }}>Padding</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <NumberInput label="Top"   value={attrs.paddingTop}    onChange={v => update({ paddingTop: v })}    min={0} max={80} suffix="px" />
          <NumberInput label="Bot"   value={attrs.paddingBottom} onChange={v => update({ paddingBottom: v })} min={0} max={80} suffix="px" />
          <NumberInput label="Left"  value={attrs.paddingLeft}   onChange={v => update({ paddingLeft: v })}   min={0} max={80} suffix="px" />
          <NumberInput label="Right" value={attrs.paddingRight}  onChange={v => update({ paddingRight: v })}  min={0} max={80} suffix="px" />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 6 }}>Align</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {ALIGN_OPTIONS.map(a => (
            <button key={a} onClick={() => update({ align: a })} style={{
              padding: '5px 12px',
              background: attrs.align === a ? 'var(--color-ink)' : 'var(--color-ghost)',
              color: attrs.align === a ? 'var(--color-white)' : 'var(--color-slate)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: 'var(--text-xs)', textTransform: 'capitalize',
            }}>{a}</button>
          ))}
        </div>
      </div>

      <Toggle label="Full width" checked={attrs.fullWidth} onChange={v => update({ fullWidth: v })} />
    </div>
  );
}
