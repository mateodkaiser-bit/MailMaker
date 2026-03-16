import { useEffect } from 'react';
import ColorPicker from '../ui/ColorPicker.jsx';
import NumberInput from '../ui/NumberInput.jsx';
import FontPicker  from '../ui/FontPicker.jsx';
import { extractFontName, ensureFontLoaded } from '../../lib/fonts.js';

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

  // Derive the font's display name from whichever field is available.
  // theme.fontName  — set by FontPicker (new)
  // theme.fontFamily — legacy CSS string, e.g. "Inter, Helvetica, …"
  const fontName = theme.fontName ?? extractFontName(theme.fontFamily ?? '');

  // Keep the canvas preview in sync: re-inject the Google Fonts <link>
  // whenever the selected font changes (e.g. after loading a saved template).
  useEffect(() => {
    if (fontName) ensureFontLoaded(fontName);
  }, [fontName]);

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

        {/*
          FontPicker returns the full font object so we can persist:
            fontFamily — the Outlook-safe CSS stack, used by the canvas + email
            fontName   — the display name, used to re-resolve the object later
            fontIsCustom — so the serialiser knows to inject a Google Fonts link
        */}
        <FontPicker
          label="Font family"
          value={fontName}
          onChange={font => onChange({
            fontFamily:   font.fontStack,
            fontName:     font.name,
            fontIsCustom: font.isCustom,
          })}
        />

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
