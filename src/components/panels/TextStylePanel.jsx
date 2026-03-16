// Panel shown when a text/heading node is selected
import Icon from '../ui/Icon.jsx';

export default function TextStylePanel({ editor }) {
  if (!editor) return null;

  const active = {
    bold:        editor.isActive('bold'),
    italic:      editor.isActive('italic'),
    underline:   editor.isActive('underline'),
    h1:          editor.isActive('heading', { level: 1 }),
    h2:          editor.isActive('heading', { level: 2 }),
    h3:          editor.isActive('heading', { level: 3 }),
    alignLeft:   editor.isActive({ textAlign: 'left' }),
    alignCenter: editor.isActive({ textAlign: 'center' }),
    alignRight:  editor.isActive({ textAlign: 'right' }),
  };

  const btnStyle = (on) => ({
    padding: '6px 10px',
    background: on ? 'var(--color-ink)' : 'var(--color-ghost)',
    color: on ? 'var(--color-white)' : 'var(--color-slate)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: on ? 700 : 400,
    cursor: 'pointer', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        TEXT STYLE
      </h3>

      {/* Heading level */}
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 6 }}>Level</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { label: 'P',  action: () => editor.chain().focus().setParagraph().run(),            on: !active.h1 && !active.h2 && !active.h3 },
            { label: 'H1', action: () => editor.chain().focus().setHeading({ level: 1 }).run(), on: active.h1 },
            { label: 'H2', action: () => editor.chain().focus().setHeading({ level: 2 }).run(), on: active.h2 },
            { label: 'H3', action: () => editor.chain().focus().setHeading({ level: 3 }).run(), on: active.h3 },
          ].map(({ label, action, on }) => (
            <button key={label} onClick={action} style={btnStyle(on)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 6 }}>Format</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { label: 'B', action: () => editor.chain().focus().toggleBold().run(),      on: active.bold,      extra: { fontWeight: 700 } },
            { label: 'I', action: () => editor.chain().focus().toggleItalic().run(),    on: active.italic,    extra: { fontStyle: 'italic' } },
            { label: 'U', action: () => editor.chain().focus().toggleUnderline().run(), on: active.underline, extra: { textDecoration: 'underline' } },
          ].map(({ label, action, on, extra }) => (
            <button key={label} onClick={action} style={{ ...btnStyle(on), ...extra }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 6 }}>Align</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { icon: 'format_align_left',   value: 'left',   title: 'Align left',   on: active.alignLeft },
            { icon: 'format_align_center', value: 'center', title: 'Align center', on: active.alignCenter },
            { icon: 'format_align_right',  value: 'right',  title: 'Align right',  on: active.alignRight },
          ].map(({ icon, value, title, on }) => (
            <button
              key={value}
              onClick={() => editor.chain().focus().setTextAlign(value).run()}
              title={title}
              style={btnStyle(on)}
            >
              <Icon name={icon} size={14} style={{ color: 'inherit' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 6 }}>Text color</div>
        <input
          type="color"
          onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          style={{ width: 36, height: 28, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
