import { useState, useRef, useEffect, useCallback } from 'react';
import { resolveVariables, mergeVariables } from '../../lib/variableResolver.js';

const EMAIL_WIDTH = 600; // logical email width in px

/**
 * @param {object}  props
 * @param {string}  props.html            - compiled HTML (last-good on error)
 * @param {string|null} props.error       - compile error message, or null
 * @param {Array}   [props.variables]     - template-level variables
 * @param {Array}   [props.globalVariables] - account-level variables
 */
export default function PreviewPane({ html, error, variables = [], globalVariables = [] }) {
  const [device, setDevice] = useState('desktop');
  const [previewMode, setPreviewMode] = useState('raw'); // 'raw' | 'resolved'

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const merged = mergeVariables(variables, globalVariables);
  const previewHtml =
    previewMode === 'resolved' && html
      ? resolveVariables(html, merged)
      : (html ?? '');

  // Target render width: 375 for mobile, EMAIL_WIDTH for desktop
  const targetWidth = device === 'mobile' ? 375 : EMAIL_WIDTH;

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const paneWidth = containerRef.current.clientWidth - 48; // subtract 24px padding each side
    const next = Math.min(1, paneWidth / targetWidth);
    setScale(next);
  }, [targetWidth]);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  // Outer wrapper height tracks the scaled content height so scroll works
  const scaledOuterWidth  = targetWidth  * scale;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', background: 'var(--color-preview-bg)',
    }}>
      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px',
        background: 'var(--color-ink)',
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
          PREVIEW
        </span>

        <div style={{ flex: 1 }} />

        {/* Variable mode toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-sm)',
          padding: 2, gap: 2,
        }}>
          {[
            { id: 'raw',      label: '{{ }} Tokens' },
            { id: 'resolved', label: '✓ Preview'    },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPreviewMode(id)}
              style={{
                padding: '3px 10px',
                background: previewMode === id ? 'var(--color-amber)' : 'none',
                color: 'var(--color-white)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Device toggle */}
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

      {/* ── Non-blocking compile-error banner ── */}
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
          <span style={{ flexShrink: 0 }}>⚠</span>
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
        {previewHtml ? (
          /* Outer div sized to the scaled footprint so scrolling works correctly */
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
              dangerouslySetInnerHTML={{ __html: previewHtml }}
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
