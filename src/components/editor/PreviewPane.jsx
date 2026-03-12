import { useState } from 'react';
import { applyVariableFallbacks } from '../../lib/utils.js';
import { useSettingsStore } from '../../store/settings.js';

const WIDTHS = { desktop: '100%', mobile: '375px' };

export default function PreviewPane({ html, error }) {
  const [device, setDevice] = useState('desktop');
  const { settings } = useSettingsStore();
  const variables = settings?.variables ?? [];

  const previewHtml = html ? applyVariableFallbacks(html, variables) : '';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', background: 'var(--color-preview-bg)',
    }}>
      {/* Device toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px',
        background: 'var(--color-ink)',
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>PREVIEW</span>
        <div style={{ flex: 1 }} />
        {['desktop', 'mobile'].map(d => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            style={{
              padding: '4px 12px',
              background: device === d ? 'var(--color-amber)' : 'rgba(255,255,255,0.1)',
              color: 'var(--color-white)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {d === 'desktop' ? '🖥' : '📱'} {d}
          </button>
        ))}
      </div>

      {/* Frame */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: 24 }}>
        {error ? (
          <div style={{
            background: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            padding: 16, borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)',
            maxWidth: 600, alignSelf: 'flex-start',
          }}>
            <strong>Compile error:</strong> {error}
          </div>
        ) : (
          <iframe
            srcDoc={previewHtml}
            title="Email preview"
            style={{
              width: WIDTHS[device],
              height: '100%',
              border: 'none',
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              transition: 'width 0.25s',
            }}
            sandbox="allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}
