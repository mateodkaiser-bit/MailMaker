import { useCallback, useRef, useState } from 'react';
import { useBlockEditorContext } from '../../../context/BlockEditorContext.jsx';

export default function ImageBlock({ block }) {
  const ctx = useBlockEditorContext();
  const { src, alt, width, align, borderRadius = 5 } = block.attrs;
  const w = typeof width === 'number' ? `${width}px` : (width || '100%');
  const containerRef = useRef(null);
  const [resizing, setResizing] = useState(false);
  const [liveWidth, setLiveWidth] = useState(null);
  const [imgHovered, setImgHovered] = useState(false);

  const startResize = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);

    const imgEl = containerRef.current?.querySelector('img');
    if (!imgEl) return;
    const startX = e.clientX;
    const startWidth = imgEl.getBoundingClientRect().width;
    const parentWidth = containerRef.current.parentElement?.getBoundingClientRect().width || 600;

    const onMove = (me) => {
      me.preventDefault();
      const dx = direction === 'left'
        ? startX - me.clientX
        : me.clientX - startX;
      // Both handles: widen by 2x the delta (symmetric resize)
      const newPx = Math.max(60, Math.min(parentWidth, startWidth + dx * 2));
      setLiveWidth(newPx);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      setResizing(false);
      setLiveWidth((finalWidth) => {
        if (finalWidth) {
          ctx.updateBlock(block.id, { attrs: { ...block.attrs, width: Math.round(finalWidth) } });
        }
        return null;
      });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [block.id, block.attrs, ctx]);

  const isDynamic = typeof src === 'string' && src.includes('{{');

  if (!src) {
    return (
      <div style={{
        padding: '40px 16px',
        textAlign: 'center',
        color: 'var(--color-muted)',
        fontSize: 'var(--text-sm)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-ghost)',
      }}>
        Click to configure image in the style panel
      </div>
    );
  }

  if (isDynamic) {
    return (
      <div style={{
        padding: '32px 16px',
        textAlign: 'center',
        color: 'var(--color-amber)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        border: '1px dashed var(--color-amber)',
        borderRadius: borderRadius ? `${borderRadius}px` : 'var(--radius-sm)',
        background: 'rgba(217,119,6,0.06)',
      }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 4 }}>Dynamic image</div>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{src}</code>
      </div>
    );
  }

  const displayWidth = liveWidth ? `${liveWidth}px` : w;
  const showHandles = imgHovered || resizing;

  return (
    <div
      ref={containerRef}
      style={{
        textAlign: align || 'center',
        padding: '4px 0',
        position: 'relative',
        display: 'flex',
        justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
      }}
    >
      <div
        style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => { if (!resizing) setImgHovered(false); }}
      >
        <img
          src={src}
          alt={alt || ''}
          style={{
            width: displayWidth,
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            userSelect: 'none',
            pointerEvents: 'none',
            borderRadius: borderRadius ? `${borderRadius}px` : 0,
          }}
          draggable={false}
        />
        {/* Transparent overlay to catch mouse events instead of the img */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        />
        {/* Left resize handle */}
        <ResizeHandle side="left" onStart={(e) => startResize(e, 'left')} visible={showHandles} />
        {/* Right resize handle */}
        <ResizeHandle side="right" onStart={(e) => startResize(e, 'right')} visible={showHandles} />
        {/* Width indicator during resize */}
        {resizing && liveWidth && (
          <div style={{
            position: 'absolute',
            bottom: -22,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-shell)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            {Math.round(liveWidth)}px
          </div>
        )}
      </div>
    </div>
  );
}

function ResizeHandle({ side, onStart, visible }) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || visible;

  return (
    <div
      data-resize-handle
      onMouseDown={onStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side]: '-6px',
        width: '14px',
        cursor: 'ew-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
      }}
    >
      {/* Visual bar indicator */}
      <div style={{
        width: '4px',
        height: '40px',
        maxHeight: '50%',
        borderRadius: '2px',
        background: hovered ? 'var(--color-shell)' : 'rgba(55,53,47,0.3)',
        transition: 'background 0.1s, opacity 0.15s',
        opacity: active ? 1 : 0,
      }} />
    </div>
  );
}
