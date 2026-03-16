import ColorPicker from '../ui/ColorPicker.jsx';
import NumberInput from '../ui/NumberInput.jsx';

const FONT_OPTIONS = [
  'Inter, sans-serif',
  'Georgia, serif',
  'Arial, sans-serif',
  'Helvetica Neue, sans-serif',
  'Times New Roman, serif',
];

// Shared uppercase section label style
const sectionTitle = {
  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.06em', color: 'var(--color-muted)',
  padding: '16px 16px 10px',
  borderBottom: '1px solid var(--color-ghost)',
  margin: 0,
};

export default function GlobalStylePanel({ theme, onChange }) {
  if (!theme) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={sectionTitle}>Global Styles</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
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
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-muted)', marginBottom: 6 }}>
            Font family
          </label>
          <select
            value={theme.fontFamily}
            onChange={e => onChange({ fontFamily: e.target.value })}
            style={{
              width: '100%', padding: '6px 8px',
              border: '1.5px solid var(--color-surface-mid)',
              borderRadius: 0,
              fontSize: 'var(--text-sm)',
              background: 'var(--color-white)',
              outline: 'none',
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
