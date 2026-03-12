import ColorPicker from '../ui/ColorPicker.jsx';
import NumberInput from '../ui/NumberInput.jsx';

const FONT_OPTIONS = [
  'Inter, sans-serif',
  'Georgia, serif',
  'Arial, sans-serif',
  'Helvetica Neue, sans-serif',
  'Times New Roman, serif',
];

export default function GlobalStylePanel({ theme, onChange }) {
  if (!theme) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        GLOBAL STYLES
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <NumberInput
          label="Max width"
          value={theme.maxWidth}
          onChange={v => onChange({ maxWidth: v })}
          min={400} max={900} step={10}
          suffix="px"
        />

        <ColorPicker
          label="Background"
          value={theme.backgroundColor}
          onChange={v => onChange({ backgroundColor: v })}
        />

        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 6 }}>
            Font family
          </label>
          <select
            value={theme.fontFamily}
            onChange={e => onChange({ fontFamily: e.target.value })}
            style={{
              width: '100%', padding: '6px 8px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-sm)',
              background: 'var(--color-white)',
            }}
          >
            {FONT_OPTIONS.map(f => (
              <option key={f} value={f}>{f.split(',')[0]}</option>
            ))}
          </select>
        </div>

        <NumberInput
          label="Body font size"
          value={theme.bodyFontSize}
          onChange={v => onChange({ bodyFontSize: v })}
          min={12} max={24} step={1}
          suffix="px"
        />

        <ColorPicker
          label="Link color"
          value={theme.linkColor}
          onChange={v => onChange({ linkColor: v })}
        />
      </div>
    </div>
  );
}
