import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClipboard } from '../../hooks/useClipboard.js';
import Icon from '../ui/Icon.jsx';

export default function EditorTopBar({ template, onRename, html, isCompiling, hasError, onPreviewToggle, previewOpen }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(template?.name ?? '');
  const { copied: copiedHtml, copy: copyHtml } = useClipboard();
  const [exportOpen, setExportOpen] = useState(false);

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
      label: copiedHtml ? 'Copied' : 'Copy HTML',
      action: () => { copyHtml(html); },
      disabled: isCompiling || !html,
      title: isCompiling ? 'Compiling…' : (hasError ? 'Showing last valid output — email has errors' : undefined),
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
      height: 52,
      display: 'flex', alignItems: 'center',
      padding: '0 16px',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-white)',
      gap: 12,
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--color-muted)', padding: '6px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center',
        }}
        title="Back to templates"
        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <Icon name="arrow_back" size={18} />
      </button>

      {/* Template name */}
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={commitRename}
          onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditing(false); }}
          style={{
            fontSize: 'var(--text-base)', fontWeight: 600,
            border: 'none', outline: '2px solid var(--color-accent)',
            borderRadius: 'var(--radius-sm)', padding: '3px 8px',
            background: 'var(--color-accent-soft)',
          }}
        />
      ) : (
        <button
          onClick={() => { setName(template?.name ?? ''); setEditing(true); }}
          style={{
            background: 'none', border: 'none', cursor: 'text',
            fontSize: 'var(--text-base)', fontWeight: 600,
            padding: '3px 8px', borderRadius: 'var(--radius-sm)',
            color: 'var(--color-ink)',
          }}
          title="Click to rename"
        >
          {template?.name ?? 'Untitled'}
        </button>
      )}

      <div style={{ flex: 1 }} />

      {/* Preview toggle */}
      <button
        onClick={onPreviewToggle}
        style={{
          padding: '6px 14px',
          background: previewOpen ? 'var(--color-ink)' : 'var(--color-ghost)',
          color: previewOpen ? 'var(--color-white)' : 'var(--color-slate)',
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
          fontWeight: 500, fontSize: 'var(--text-sm)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <Icon name={previewOpen ? 'visibility_off' : 'visibility'} size={16} style={{ color: 'inherit' }} />
        Preview
      </button>

      {/* Export menu */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setExportOpen(o => !o)}
          style={{
            padding: '6px 14px',
            background: 'var(--color-accent)', color: 'var(--color-white)',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}
        >
          Export
          <Icon name="expand_more" size={16} style={{ color: 'inherit' }} />
        </button>

        {exportOpen && (
          <div style={{
            position: 'absolute', right: 0, top: '100%', marginTop: 4,
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 100,
            minWidth: 200,
            overflow: 'hidden',
          }}>
            {exportItems.map(({ icon, label, action, disabled, title, warn }) => (
              <button
                key={label}
                onClick={() => { if (!disabled) { action(); setExportOpen(false); } }}
                disabled={disabled}
                title={title}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', textAlign: 'left',
                  padding: '10px 16px',
                  background: 'none', border: 'none',
                  cursor: disabled ? 'default' : 'pointer',
                  fontSize: 'var(--text-sm)',
                  color: disabled ? 'var(--color-muted)' : warn ? 'var(--color-danger)' : 'var(--color-ink)',
                  opacity: disabled ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--color-ghost)'; }}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Icon
                  name={icon}
                  size={15}
                  style={{ color: warn ? 'var(--color-danger)' : 'var(--color-muted)', flexShrink: 0 }}
                />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
