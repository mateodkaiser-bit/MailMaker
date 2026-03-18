// Panel shown when a text/heading node is selected
import { useState, useCallback } from 'react';
import Icon from '../ui/Icon.jsx';

const sectionTitle = {
  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.06em', color: 'var(--color-muted)',
  padding: '16px 16px 10px',
  borderBottom: '1px solid var(--color-ghost)',
  margin: 0,
};

const fieldLabel = {
  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.05em', color: 'var(--color-muted)', marginBottom: 8,
};

export default function TextStylePanel({ block, onUpdate }) {
  // Force re-render after execCommand to update format state
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick(t => t + 1), []);

  if (!block || (block.type !== 'paragraph' && block.type !== 'heading')) return null;

  const attrs = block.attrs || {};

  const active = {
    bold:        document.queryCommandState('bold'),
    italic:      document.queryCommandState('italic'),
    underline:   document.queryCommandState('underline'),
    h1:          block.type === 'heading' && attrs.level === 1,
    h2:          block.type === 'heading' && attrs.level === 2,
    h3:          block.type === 'heading' && attrs.level === 3,
    alignLeft:   attrs.textAlign === 'left' || !attrs.textAlign,
    alignCenter: attrs.textAlign === 'center',
    alignRight:  attrs.textAlign === 'right',
  };

  // Sharp toggle button: shell bg when on, transparent when off
  const btnStyle = (on) => ({
    padding: '6px 10px',
    background: on ? 'var(--color-shell)' : 'transparent',
    color: on ? '#fff' : 'var(--color-slate)',
    border: '1.5px solid var(--color-surface-mid)',
    borderRadius: 0,
    fontWeight: on ? 700 : 400,
    cursor: 'pointer', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={sectionTitle}>Text Style</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
        {/* Heading level */}
        <div>
          <div style={fieldLabel}>Level</div>
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { label: 'P',  action: () => onUpdate(block.id, { type: 'paragraph', attrs: { ...attrs, level: undefined } }), on: !active.h1 && !active.h2 && !active.h3 },
              { label: 'H1', action: () => onUpdate(block.id, { type: 'heading', attrs: { ...attrs, level: 1 } }), on: active.h1 },
              { label: 'H2', action: () => onUpdate(block.id, { type: 'heading', attrs: { ...attrs, level: 2 } }), on: active.h2 },
              { label: 'H3', action: () => onUpdate(block.id, { type: 'heading', attrs: { ...attrs, level: 3 } }), on: active.h3 },
            ].map(({ label, action, on }, i, arr) => (
              <button key={label} onMouseDown={(e) => e.preventDefault()} onClick={action} style={{
                ...btnStyle(on),
                borderRight: i < arr.length - 1 ? 'none' : '1.5px solid var(--color-surface-mid)',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div>
          <div style={fieldLabel}>Format</div>
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { label: 'B', action: () => { document.execCommand('bold'); rerender(); },      on: active.bold,      extra: { fontWeight: 700 } },
              { label: 'I', action: () => { document.execCommand('italic'); rerender(); },    on: active.italic,    extra: { fontStyle: 'italic' } },
              { label: 'U', action: () => { document.execCommand('underline'); rerender(); }, on: active.underline, extra: { textDecoration: 'underline' } },
            ].map(({ label, action, on, extra }, i, arr) => (
              <button key={label} onMouseDown={(e) => e.preventDefault()} onClick={action} style={{
                ...btnStyle(on), ...extra,
                borderRight: i < arr.length - 1 ? 'none' : '1.5px solid var(--color-surface-mid)',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Alignment */}
        <div>
          <div style={fieldLabel}>Align</div>
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { icon: 'format_align_left',   value: 'left',   title: 'Align left',   on: active.alignLeft },
              { icon: 'format_align_center', value: 'center', title: 'Align center', on: active.alignCenter },
              { icon: 'format_align_right',  value: 'right',  title: 'Align right',  on: active.alignRight },
            ].map(({ icon, value, title, on }, i, arr) => (
              <button
                key={value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onUpdate(block.id, { attrs: { ...block.attrs, textAlign: value } })}
                title={title}
                style={{
                  ...btnStyle(on),
                  borderRight: i < arr.length - 1 ? 'none' : '1.5px solid var(--color-surface-mid)',
                }}
              >
                <Icon name={icon} size={14} style={{ color: 'inherit' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <div style={fieldLabel}>Text color</div>
          <input
            type="color"
            onMouseDown={(e) => e.preventDefault()}
            onChange={e => { document.execCommand('foreColor', false, e.target.value); rerender(); }}
            style={{ width: 36, height: 28, border: '1.5px solid var(--color-surface-mid)', borderRadius: 0, cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}
