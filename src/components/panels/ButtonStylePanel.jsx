import ColorPicker from '../ui/ColorPicker.jsx';
import NumberInput from '../ui/NumberInput.jsx';
import Toggle from '../ui/Toggle.jsx';

const ALIGN_OPTIONS = ['left', 'center', 'right'];

const sectionTitle = {
  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.06em', color: 'var(--color-muted)',
  padding: '16px 16px 10px',
  borderBottom: '1px solid var(--color-ghost)',
  margin: 0,
};

const fieldLabel = {
  display: 'block', fontSize: 10, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.05em',
  color: 'var(--color-muted)', marginBottom: 6,
};

const inputStyle = {
  width: '100%', padding: '6px 8px', boxSizing: 'border-box',
  border: '1.5px solid var(--color-surface-mid)',
  borderRadius: 0, fontSize: 'var(--text-sm)', outline: 'none',
  background: 'var(--color-white)',
};

export default function ButtonStylePanel({ block, onUpdate }) {
  if (!block || block.type !== 'button') return null;

  const attrs = block.attrs;

  function update(patch) {
    onUpdate(block.id, { attrs: { ...block.attrs, ...patch } });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={sectionTitle}>Button</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
        <div>
          <label style={fieldLabel}>Label</label>
          <input type="text" value={attrs.label || ''} onChange={e => update({ label: e.target.value })} style={inputStyle} />
        </div>

        <div>
          <label style={fieldLabel}>URL</label>
          <input type="url" value={attrs.href || ''} onChange={e => update({ href: e.target.value })} placeholder="https://example.com" style={inputStyle} />
        </div>

        <ColorPicker label="Background" value={attrs.backgroundColor} onChange={v => update({ backgroundColor: v })} />
        <ColorPicker label="Text color"  value={attrs.color}           onChange={v => update({ color: v })} />

        <NumberInput label="Border radius" value={attrs.borderRadius} onChange={v => update({ borderRadius: v })} min={0} max={40} suffix="px" />
        <NumberInput label="Font size"     value={attrs.fontSize}     onChange={v => update({ fontSize: v })}     min={10} max={32} suffix="px" />

        <div>
          <div style={{ ...fieldLabel, marginBottom: 8 }}>Padding</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <NumberInput label="Top"   value={attrs.paddingTop}    onChange={v => update({ paddingTop: v })}    min={0} max={80} suffix="px" />
            <NumberInput label="Bot"   value={attrs.paddingBottom} onChange={v => update({ paddingBottom: v })} min={0} max={80} suffix="px" />
            <NumberInput label="Left"  value={attrs.paddingLeft}   onChange={v => update({ paddingLeft: v })}   min={0} max={80} suffix="px" />
            <NumberInput label="Right" value={attrs.paddingRight}  onChange={v => update({ paddingRight: v })}  min={0} max={80} suffix="px" />
          </div>
        </div>

        <div>
          <div style={{ ...fieldLabel, marginBottom: 8 }}>Align</div>
          <div style={{ display: 'flex', gap: 0 }}>
            {ALIGN_OPTIONS.map(a => (
              <button key={a} onClick={() => update({ align: a })} style={{
                flex: 1,
                padding: '5px 8px',
                background: attrs.align === a ? 'var(--color-shell)' : 'transparent',
                color: attrs.align === a ? '#fff' : 'var(--color-slate)',
                border: '1.5px solid var(--color-surface-mid)',
                borderRight: a !== 'right' ? 'none' : '1.5px solid var(--color-surface-mid)',
                borderRadius: 0,
                cursor: 'pointer', fontSize: 'var(--text-xs)',
                textTransform: 'capitalize', fontWeight: attrs.align === a ? 700 : 400,
              }}>{a}</button>
            ))}
          </div>
        </div>

        <Toggle label="Full width" checked={attrs.fullWidth} onChange={v => update({ fullWidth: v })} />
      </div>
    </div>
  );
}
