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
      borderBottom: '1px solid var(--color-border)',
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
            color: 'var(--color-slate)',
            fontSize: 'var(--text-sm)',
            padding: '4px 6px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 400,
            whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-slate)'; }}
        >
          <Icon name="space_dashboard" size={14} style={{ color: 'inherit' }} />
          Templates
        </button>

        <Icon name="chevron_right" size={16} style={{ color: 'var(--color-border)', flexShrink: 0 }} />

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
              border: 'none', outline: '2px solid var(--color-accent)',
              borderRadius: 'var(--radius-sm)', padding: '3px 8px',
              background: 'var(--color-accent-soft)',
              minWidth: 0, maxWidth: 260,
            }}
          />
        ) : (
          <button
            onClick={() => { setName(template?.name ?? ''); setEditing(true); }}
            title="Click to rename"
            style={{
              background: 'none', border: 'none', cursor: 'text',
              fontSize: 'var(--text-sm)', fontWeight: 600,
              padding: '4px 6px', borderRadius: 'var(--radius-sm)',
              color: 'var(--color-ink)',
              maxWidth: 280,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            {template?.name ?? 'Untitled'}
          </button>
        )}
      </div>

      {/* Compile status pill */}
      {isCompiling && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-muted)', display: 'inline-block' }} />
          compiling
        </span>
      )}
      {!isCompiling && hasError && (
        <span style={{ fontSize: 'var(--text-xs)', color: '#DC2626', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
          <Icon name="error_outline" size={12} style={{ color: 'inherit' }} />
          error
        </span>
      )}
      {!isCompiling && !hasError && html && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
          ready
        </span>
      )}

      <div style={{ flex: 1 }} />

      {/* Preview toggle */}
      <button
        onClick={onPreviewToggle}
        style={{
          padding: '5px 12px',
          background: previewOpen ? 'var(--color-ink)' : 'transparent',
          color: previewOpen ? 'var(--color-white)' : 'var(--color-slate)',
          border: '1px solid ' + (previewOpen ? 'var(--color-ink)' : 'var(--color-border)'),
          borderRadius: 'var(--radius-md)',
          fontWeight: 500,
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'all 0.12s',
        }}
        onMouseEnter={e => { if (!previewOpen) { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-ink)'; }}}
        onMouseLeave={e => { if (!previewOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-slate)'; }}}
      >
        <Icon name={previewOpen ? 'edit' : 'visibility'} size={15} style={{ color: 'inherit' }} />
        {previewOpen ? 'Edit' : 'Preview'}
      </button>

      {/* Export dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setExportOpen(o => !o)}
          style={{
            padding: '5px 14px',
            background: 'var(--color-ink)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
            transition: 'opacity 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Export
          <Icon name="expand_more" size={15} style={{ color: 'inherit' }} />
        </button>

        {exportOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setExportOpen(false)} />
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)',
              background: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              zIndex: 100,
              minWidth: 200,
              overflow: 'hidden',
              padding: 4,
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
                    borderRadius: 'var(--radius-sm)',
                    cursor: disabled ? 'default' : 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: disabled ? 'var(--color-muted)' : warn ? 'var(--color-danger)' : 'var(--color-ink)',
                    opacity: disabled ? 0.5 : 1,
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
          </>
        )}
      </div>
    </div>
  );
}
