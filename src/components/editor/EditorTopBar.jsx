import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClipboard } from '../../hooks/useClipboard.js';
import Icon from '../ui/Icon.jsx';

const secondaryBtn = (active) => ({
  padding: '5px 10px',
  background: active ? 'var(--color-shell)' : 'transparent',
  color: active ? '#fff' : 'var(--color-slate)',
  border: '1.5px solid ' + (active ? 'var(--color-shell)' : 'var(--color-surface-mid)'),
  borderRadius: 0,
  fontWeight: 500,
  fontSize: 'var(--text-sm)',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 5,
});

export default function EditorTopBar({ editor, template, onRename, html, isCompiling, hasError, onPreviewToggle, previewOpen }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(template?.name ?? '');
  const { copied: copiedHtml, copy: copyHtml } = useClipboard();
  const [exportOpen, setExportOpen] = useState(false);

  const canUndo = editor?.can().undo() ?? false;
  const canRedo = editor?.can().redo() ?? false;

  function commitRename() {
    if (name.trim()) onRename(name.trim());
    setEditing(false);
  }

  function downloadHtml() {
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${template?.name ?? 'email'}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
    setExportOpen(false);
  }

  const exportItems = [
    {
      icon: copiedHtml ? 'check' : (hasError && html ? 'warning' : 'content_copy'),
      label: copiedHtml ? 'Copied!' : 'Copy HTML',
      action: () => { copyHtml(html); },
      disabled: isCompiling || !html,
      warn: !copiedHtml && hasError && !!html,
    },
    {
      icon: 'download',
      label: 'Download .html',
      action: downloadHtml,
    },
  ];

  return (
    <div style={{
      height: 'var(--topbar-height)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      borderBottom: '1.5px solid #000',
      background: 'var(--color-white)',
      gap: 8,
      flexShrink: 0,
      zIndex: 10,
    }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-slate)', fontSize: 'var(--text-sm)',
            padding: '4px 6px', borderRadius: 0, fontWeight: 400,
            whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-slate)'; }}
        >
          <Icon name="space_dashboard" size={14} style={{ color: 'inherit' }} />
          Templates
        </button>

        <span style={{ color: 'var(--color-border)', fontSize: 'var(--text-sm)', flexShrink: 0 }}>/</span>

        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') setEditing(false);
            }}
            style={{
              fontSize: 'var(--text-sm)', fontWeight: 600,
              border: '1.5px solid var(--color-punch)',
              borderRadius: 0, padding: '3px 8px',
              background: 'var(--color-punch-soft)',
              outline: 'none', minWidth: 0, maxWidth: 260,
            }}
          />
        ) : (
          <button
            onClick={() => { setName(template?.name ?? ''); setEditing(true); }}
            title="Click to rename"
            style={{
              background: 'none', border: 'none', cursor: 'text',
              fontSize: 'var(--text-sm)', fontWeight: 600,
              padding: '4px 6px', borderRadius: 0,
              color: 'var(--color-ink)',
              maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            {template?.name ?? 'Untitled'}
          </button>
        )}
      </div>

      {/* Compile status */}
      {isCompiling && (
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
          <span style={{ width: 5, height: 5, background: 'var(--color-muted)', display: 'inline-block' }} />
          compiling
        </span>
      )}
      {!isCompiling && hasError && (
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#DC2626', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
          <Icon name="error_outline" size={11} style={{ color: 'inherit' }} />
          error
        </span>
      )}
      {!isCompiling && !hasError && html && (
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
          <span style={{ width: 5, height: 5, background: 'var(--color-success)', display: 'inline-block' }} />
          ready
        </span>
      )}

      <div style={{ flex: 1 }} />

      {/* Undo / Redo */}
      <div style={{ display: 'flex', gap: 2, borderRight: '1.5px solid var(--color-ghost)', paddingRight: 8, marginRight: 4 }}>
        {[
          { icon: 'undo', action: () => editor?.chain().focus().undo().run(), enabled: canUndo, title: 'Undo (⌘Z)' },
          { icon: 'redo', action: () => editor?.chain().focus().redo().run(), enabled: canRedo, title: 'Redo (⌘⇧Z)' },
        ].map(({ icon, action, enabled, title }) => (
          <button
            key={icon}
            onClick={action}
            disabled={!enabled}
            title={title}
            style={{
              background: 'none', border: 'none', cursor: enabled ? 'pointer' : 'default',
              color: enabled ? 'var(--color-slate)' : 'var(--color-muted)',
              padding: '5px 6px', borderRadius: 0,
              display: 'flex', alignItems: 'center',
              opacity: enabled ? 1 : 0.4,
            }}
            onMouseEnter={e => { if (enabled) e.currentTarget.style.background = 'var(--color-ghost)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            <Icon name={icon} size={16} style={{ color: 'inherit' }} />
          </button>
        ))}
      </div>

      {/* Preview toggle */}
      <button
        onClick={onPreviewToggle}
        style={secondaryBtn(previewOpen)}
        onMouseEnter={e => { if (!previewOpen) { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-ink)'; } }}
        onMouseLeave={e => { if (!previewOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-slate)'; } }}
      >
        <Icon name={previewOpen ? 'edit' : 'visibility'} size={15} style={{ color: 'inherit' }} />
        {previewOpen ? 'Edit' : 'Preview'}
      </button>

      {/* Export — Safety Orange primary */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setExportOpen(o => !o)}
          style={{
            padding: '5px 14px',
            background: 'var(--color-punch)',
            color: '#fff',
            border: '1.5px solid var(--color-punch)',
            borderRadius: 0,
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-punch-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-punch)'}
        >
          Export
          <Icon name="expand_more" size={15} style={{ color: 'inherit' }} />
        </button>

        {exportOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setExportOpen(false)} />
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 4px)',
              background: 'var(--color-white)',
              border: '1.5px solid #000',
              borderRadius: 0,
              zIndex: 100,
              minWidth: 200,
              overflow: 'hidden',
            }}>
              {exportItems.map(({ icon, label, action, disabled, warn }) => (
                <button
                  key={label}
                  onClick={() => { if (!disabled) { action(); setExportOpen(false); } }}
                  disabled={disabled}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    width: '100%', textAlign: 'left',
                    padding: '8px 12px',
                    background: 'none', border: 'none',
                    borderBottom: '1px solid var(--color-ghost)',
                    borderRadius: 0,
                    cursor: disabled ? 'default' : 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: disabled ? 'var(--color-muted)' : warn ? 'var(--color-danger)' : 'var(--color-ink)',
                    opacity: disabled ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--color-ghost)'; }}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <Icon name={icon} size={15} style={{ color: warn ? 'var(--color-danger)' : 'var(--color-muted)', flexShrink: 0 }} />
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
