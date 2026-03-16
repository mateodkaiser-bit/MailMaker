import { useSettingsStore } from '../../store/settings.js';
import { getDefaultTheme } from '../../lib/constants.js';
import { getTemplates, getSharedBlocks, getSettings } from '../../lib/storage.js';
import NavRail from '../ui/NavRail.jsx';
import ColorPicker from '../ui/ColorPicker.jsx';
import NumberInput from '../ui/NumberInput.jsx';
import VariablesSection from './VariablesSection.jsx';
import { useToast } from '../ui/Toast.jsx';
import Icon from '../ui/Icon.jsx';

const DEFAULTS = getDefaultTheme();
const FONT_OPTIONS = [
  'Inter, sans-serif',
  'Georgia, serif',
  'Helvetica, Arial, sans-serif',
  'Times New Roman, serif',
  'Courier New, monospace',
];

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontSize: 'var(--text-sm)', fontWeight: 700,
      color: 'var(--color-muted)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      margin: '0 0 16px',
    }}>
      {children}
    </h2>
  );
}
function Card({ children }) {
  return (
    <div style={{
      background: 'var(--color-white)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      marginBottom: 24,
    }}>
      {children}
    </div>
  );
}
function Row({ label, hint, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid var(--color-border)',
      gap: 16,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-ink)' }}>
          {label}
        </div>
        {hint && (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 2 }}>
            {hint}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateDefaultTheme, addVariable, updateVariable, deleteVariable } = useSettingsStore();
  const { toast } = useToast();
  const theme = settings.defaultTheme ?? {};
  const variables = settings.variables ?? [];

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <NavRail />

      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 32px' }}>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 32px' }}>
            Settings
          </h1>

          {/* Default theme */}
          <SectionHeading>Default email theme</SectionHeading>
          <Card>
            <Row
              label="Max width"
              hint="Maximum width of the email body in pixels"
            >
              <NumberInput
                value={theme.maxWidth ?? 680}
                onChange={v => updateDefaultTheme({ maxWidth: v })}
                min={400}
                max={900}
                step={10}
                suffix="px"
              />
            </Row>

            <Row
              label="Background colour"
              hint="Email background behind the content area"
            >
              <ColorPicker
                value={theme.backgroundColor ?? DEFAULTS.backgroundColor}
                onChange={v => updateDefaultTheme({ backgroundColor: v })}
              />
            </Row>

            <Row label="Font family" hint="Applies globally unless overridden per block">
              <select
                value={theme.fontFamily ?? 'Inter, sans-serif'}
                onChange={e => updateDefaultTheme({ fontFamily: e.target.value })}
                style={{
                  padding: '6px 10px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  background: 'var(--color-white)',
                  color: 'var(--color-ink)',
                  cursor: 'pointer',
                }}
              >
                {FONT_OPTIONS.map(f => (
                  <option key={f} value={f}>{f.split(',')[0]}</option>
                ))}
              </select>
            </Row>

            <Row label="Body font size">
              <NumberInput
                value={theme.bodyFontSize ?? 16}
                onChange={v => updateDefaultTheme({ bodyFontSize: v })}
                min={12}
                max={24}
                step={1}
                suffix="px"
              />
            </Row>

            <Row label="Link colour" hint="Default colour for hyperlinks in email">
              <ColorPicker
                value={theme.linkColor ?? DEFAULTS.linkColor}
                onChange={v => updateDefaultTheme({ linkColor: v })}
              />
            </Row>
          </Card>

          {/* Variables */}
          <SectionHeading>Global variables</SectionHeading>
          <VariablesSection
            variables={variables}
            onAdd={addVariable}
            onUpdate={updateVariable}
            onDelete={deleteVariable}
          />

          {/* Data */}
          <SectionHeading>Data management</SectionHeading>
          <Card>
            <Row
              label="Export all data"
              hint="Download all templates and settings as a JSON backup"
            >
              <button
                onClick={() => {
                  const data = {
                    templates: getTemplates(),
                    sharedBlocks: getSharedBlocks(),
                    settings: getSettings(),
                    exportedAt: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `maildraft-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                  toast('Data exported', 'success');
                }}
                style={{
                  padding: '7px 16px',
                  background: 'var(--color-ghost)',
                  color: 'var(--color-slate)',
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                  fontWeight: 500, fontSize: 'var(--text-sm)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Icon name="download" size={16} style={{ color: 'inherit' }} />
                Export JSON
              </button>
            </Row>
          </Card>
        </div>
      </main>
    </div>
  );
}
