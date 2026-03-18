import { useRef, useState } from 'react';
import Icon from '../ui/Icon.jsx';

const ALIGN_OPTIONS = [
  { value: 'left',   icon: 'format_align_left'   },
  { value: 'center', icon: 'format_align_center' },
  { value: 'right',  icon: 'format_align_right'  },
];

export default function ImageStylePanel({ block, onUpdate }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  if (!block || block.type !== 'image') return null;

  const attrs = block.attrs;

  function update(patch) {
    onUpdate(block.id, { attrs: { ...block.attrs, ...patch } });
  }

  // true when the current src is a local file (data URL)
  const isDataUrl = typeof attrs.src === 'string' && attrs.src.startsWith('data:');

  function readFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => update({ src: e.target.result });
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    readFile(e.target.files?.[0]);
    e.target.value = ''; // allow re-selecting the same file
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files?.[0]);
  }

  const inputBase = {
    width: '100%', padding: '6px 8px', boxSizing: 'border-box',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)', outline: 'none',
  };

  const label = (text) => (
    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 6 }}>{text}</div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        IMAGE
      </h3>

      {/* ── Upload zone ── */}
      <div>
        {label('Source')}

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {isDataUrl ? (
          /* Preview when a local file is loaded */
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--color-ghost)',
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src={attrs.src}
                alt=""
                style={{ width: '100%', maxHeight: 120, objectFit: 'contain', display: 'block', padding: 8 }}
              />
            </div>
            <div style={{
              display: 'flex', gap: 4, padding: '6px 8px',
              background: 'var(--color-white)',
              borderTop: '1px solid var(--color-border)',
            }}>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  flex: 1, padding: '5px 8px',
                  background: 'var(--color-ghost)',
                  color: 'var(--color-slate)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}
              >
                <Icon name="upload" size={13} style={{ color: 'inherit' }} />
                Replace
              </button>
              <button
                onClick={() => update({ src: '' })}
                style={{
                  padding: '5px 8px',
                  background: 'none', color: 'var(--color-danger)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Icon name="delete" size={13} style={{ color: 'inherit' }} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* Drop zone when no local file */
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '20px 12px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'var(--color-accent-soft)' : 'transparent',
              transition: 'border-color 0.15s, background 0.15s',
              userSelect: 'none',
            }}
          >
            <Icon
              name="upload_file"
              size={28}
              style={{ color: dragOver ? 'var(--color-accent)' : 'var(--color-muted)', marginBottom: 6 }}
            />
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-slate)', marginBottom: 2 }}>
              Click to upload
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
              or drag and drop an image here
            </div>
          </div>
        )}
      </div>

      {/* ── URL input (always visible; used for remote images) ── */}
      <div>
        {label('URL')}
        <input
          type="text"
          value={isDataUrl ? '' : (attrs.src || '')}
          onChange={e => update({ src: e.target.value })}
          placeholder={isDataUrl ? '(local file — clear above to use URL)' : 'https://… or {{ variable }}'}
          disabled={isDataUrl}
          style={{
            ...inputBase,
            color: isDataUrl ? 'var(--color-muted)' : 'var(--color-ink)',
            background: isDataUrl ? 'var(--color-ghost)' : 'var(--color-white)',
          }}
        />
        {!isDataUrl && (
          <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: 4 }}>
            Supports <code style={{ background: 'var(--color-ghost)', padding: '0 3px', borderRadius: 2 }}>{'{{ variable }}'}</code> for dynamic images
          </div>
        )}
      </div>

      {/* ── Alt text ── */}
      <div>
        {label('Alt text')}
        <input
          type="text"
          value={attrs.alt || ''}
          onChange={e => update({ alt: e.target.value })}
          placeholder="Descriptive alt text"
          style={inputBase}
        />
      </div>

      {/* ── Width ── */}
      <div>
        {label('Width')}
        <input
          type="text"
          value={attrs.width || '100%'}
          onChange={e => update({ width: e.target.value })}
          placeholder="100% or 600px"
          style={inputBase}
        />
      </div>

      {/* ── Corner rounding ── */}
      <div>
        {label('Corner rounding')}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => update({ borderRadius: Math.max(0, (attrs.borderRadius ?? 5) - 1) })}
            style={{
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--color-ghost)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              color: 'var(--color-slate)', fontSize: 'var(--text-sm)', fontWeight: 600,
            }}
          >−</button>
          <input
            type="number"
            min={0}
            max={100}
            value={attrs.borderRadius ?? 5}
            onChange={e => update({ borderRadius: Math.max(0, parseInt(e.target.value, 10) || 0) })}
            style={{ ...inputBase, width: 56, textAlign: 'center' }}
          />
          <button
            onClick={() => update({ borderRadius: Math.min(100, (attrs.borderRadius ?? 5) + 1) })}
            style={{
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--color-ghost)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              color: 'var(--color-slate)', fontSize: 'var(--text-sm)', fontWeight: 600,
            }}
          >+</button>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>px</span>
        </div>
      </div>

      {/* ── Alignment ── */}
      <div>
        {label('Alignment')}
        <div style={{ display: 'flex', gap: 4 }}>
          {ALIGN_OPTIONS.map(({ value, icon }) => {
            const active = attrs.align === value;
            return (
              <button
                key={value}
                onClick={() => update({ align: value })}
                title={value.charAt(0).toUpperCase() + value.slice(1)}
                style={{
                  padding: '6px 10px',
                  background: active ? 'var(--color-ink)' : 'var(--color-ghost)',
                  color: active ? 'var(--color-white)' : 'var(--color-slate)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <Icon name={icon} size={14} style={{ color: 'inherit' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Link URL ── */}
      <div>
        {label('Link URL (optional)')}
        <input
          type="text"
          value={attrs.href || ''}
          onChange={e => update({ href: e.target.value || null })}
          placeholder="https://… or {{ variable }}"
          style={inputBase}
        />
      </div>
    </div>
  );
}
