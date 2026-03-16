import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '../ui/Icon.jsx';

const EMAIL_WIDTH = 600;

export default function PreviewPane({ html, error }) {
  const [device, setDevice] = useState('desktop');

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const targetWidth = device === 'mobile' ? 375 : EMAIL_WIDTH;

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const paneWidth = containerRef.current.clientWidth - 48;
    const next = Math.min(1, paneWidth / targetWidth);
    setScale(next);
  }, [targetWidth]);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  const scaledOuterWidth = targetWidth * scale;

  const deviceButtons = [
    { id: 'desktop', icon: 'desktop_windows', label: 'Desktop' },
    { id: 'mobile',  icon: 'smartphone',      label: 'Mobile'  },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', background: 'var(--color-preview-bg)',
    }}>
      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px',
        background: 'var(--color-ink)',
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
          PREVIEW
        </span>

        <div style={{ flex: 1 }} />

        {/* Device toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-sm)',
          padding: 2, gap: 2,
        }}>
          {deviceButtons.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setDevice(id)}
              title={label}
              style={{
                padding: '4px 10px',
                background: device === id ? 'rgba(255,255,255,0.18)' : 'none',
                color: 'var(--color-white)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'background 0.12s',
              }}
            >
              <Icon name={icon} size={15} style={{ color: 'inherit' }} />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Compile-error banner ── */}
      {error && (
        <div style={{
          background: 'var(--color-amber-light)',
          borderBottom: '1px solid #FDE68A',
          padding: '7px 16px',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: '#92400E',
          flexShrink: 0,
          display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <Icon name="warning" size={14} style={{ color: '#D97706', marginTop: 1, flexShrink: 0 }} />
          <span>
            <strong>Compile warning — showing last valid output.</strong>{' '}
            {error}
          </span>
        </div>
      )}

      {/* ── Preview area ── */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: 24 }}
      >
        {html ? (
          <div style={{ width: scaledOuterWidth, flexShrink: 0 }}>
            <div
              style={{
                width: targetWidth,
                transformOrigin: 'top left',
                transform: `scale(${scale})`,
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ) : (
          <div style={{
            color: 'var(--color-muted)',
            fontSize: 'var(--text-sm)',
            alignSelf: 'center',
          }}>
            Nothing to preview yet
          </div>
        )}
      </div>
    </div>
  );
}
