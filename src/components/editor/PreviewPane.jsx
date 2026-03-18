import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { resolveVariables, mergeVariables } from '../../lib/variableResolver.js';
import Icon from '../ui/Icon.jsx';

const EMAIL_WIDTH = 600;

export default function PreviewPane({ html, error, variables = [], globalVariables = [] }) {
  const [device, setDevice] = useState('desktop');

  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [iframeHeight, setIframeHeight] = useState(800);

  const targetWidth = device === 'mobile' ? 375 : EMAIL_WIDTH;

  // Merge template + global variables and resolve tokens in compiled HTML
  const resolvedHtml = useMemo(() => {
    if (!html) return '';
    const merged = mergeVariables(variables, globalVariables);
    return resolveVariables(html, merged);
  }, [html, variables, globalVariables]);

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

  // Auto-size iframe height to match its content
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !resolvedHtml) return;

    function syncHeight() {
      try {
        const doc = iframe.contentDocument;
        if (doc?.body) {
          const h = doc.body.scrollHeight;
          if (h > 0) setIframeHeight(h);
        }
      } catch (_) { /* cross-origin safety */ }
    }

    iframe.addEventListener('load', syncHeight);
    // Also poll briefly after load for images/fonts to finish rendering
    const timer = setTimeout(syncHeight, 500);
    return () => {
      iframe.removeEventListener('load', syncHeight);
      clearTimeout(timer);
    };
  }, [resolvedHtml]);

  const scaledOuterWidth = targetWidth * scale;
  const scaledOuterHeight = iframeHeight * scale;

  const deviceButtons = [
    { id: 'desktop', icon: 'desktop_windows', label: 'Desktop' },
    { id: 'mobile',  icon: 'smartphone',      label: 'Mobile'  },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Toolbar ── */}
      <div style={{
        height: 'var(--topbar-height)',
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px',
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em' }}>
          PREVIEW
        </span>

        <div style={{ flex: 1 }} />

        {/* Device toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--color-ghost)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 3, gap: 2,
        }}>
          {deviceButtons.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setDevice(id)}
              title={label}
              style={{
                padding: '4px 12px',
                background: device === id ? 'var(--color-white)' : 'none',
                boxShadow: device === id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                color: device === id ? 'var(--color-ink)' : 'var(--color-muted)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.12s',
                fontWeight: device === id ? 600 : 400,
              }}
            >
              <Icon name={icon} size={14} style={{ color: 'inherit' }} />
              <span style={{ fontSize: 'var(--text-xs)' }}>{label}</span>
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
        className="dot-grid"
        style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: 24 }}
      >
        {resolvedHtml ? (
          <div style={{ width: scaledOuterWidth, height: scaledOuterHeight, flexShrink: 0 }}>
            <iframe
              ref={iframeRef}
              srcDoc={resolvedHtml}
              title="Email preview"
              sandbox="allow-same-origin"
              style={{
                width: targetWidth,
                height: iframeHeight,
                transformOrigin: 'top left',
                transform: `scale(${scale})`,
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                border: 'none',
                overflow: 'hidden',
                display: 'block',
              }}
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
