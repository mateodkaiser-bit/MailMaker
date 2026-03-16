import { useState, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useSharedBlockStore } from '../../store/sharedBlocks.js';
import { useSettingsStore } from '../../store/settings.js';
import { useEditor } from '../../hooks/useEditor.js';
import { useCompiler } from '../../hooks/useCompiler.js';
import { useToast } from '../ui/Toast.jsx';
import EditorCanvas from '../editor/EditorCanvas.jsx';
import PreviewPane from '../editor/PreviewPane.jsx';
import RightPanel from '../panels/RightPanel.jsx';
import Icon from '../ui/Icon.jsx';

export default function SharedBlockEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getBlock, updateSharedBlock } = useSharedBlockStore();
  const { settings } = useSettingsStore();

  const block = getBlock(id);

  const [theme, setTheme] = useState(() => ({ ...settings?.defaultTheme }));
  const [doc, setDoc] = useState(block?.doc ?? null);
  const [isDirty, setIsDirty] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(block?.name ?? '');
  const [editingName, setEditingName] = useState(false);

  const editor = useEditor({
    content: block?.doc ?? null,
    onUpdate: useCallback((newDoc) => {
      setDoc(newDoc);
      setIsDirty(true);
    }, []),
  });

  const { html: previewHtml, error } = useCompiler(doc, theme, previewOpen);
  const { html: exportHtml, mjml: exportMjml } = useCompiler(doc, theme, true);

  function handleSave() {
    setSaving(true);
    updateSharedBlock(id, { doc, name: name.trim() || block.name });
    setIsDirty(false);
    setSaving(false);
    toast('Block saved', 'success');
  }

  function handleThemeChange(patch) {
    setTheme(t => ({ ...t, ...patch }));
    setIsDirty(true);
  }

  function commitRename() {
    if (name.trim()) updateSharedBlock(id, { name: name.trim() });
    else setName(block.name);
    setEditingName(false);
  }

  if (!block) return <Navigate to="/blocks" replace />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        height: 52,
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-white)',
        gap: 12, flexShrink: 0, zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/blocks')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-muted)', padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center',
          }}
          title="Back to saved blocks"
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <Icon name="arrow_back" size={18} />
        </button>

        {editingName ? (
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') { setName(block.name); setEditingName(false); }
            }}
            style={{
              fontSize: 'var(--text-base)', fontWeight: 600,
              border: 'none', outline: '2px solid var(--color-amber)',
              borderRadius: 'var(--radius-sm)', padding: '3px 8px',
              background: 'var(--color-amber-soft)',
            }}
          />
        ) : (
          <button
            onClick={() => { setName(block.name); setEditingName(true); }}
            style={{
              background: 'none', border: 'none', cursor: 'text',
              fontSize: 'var(--text-base)', fontWeight: 600,
              padding: '3px 8px', borderRadius: 'var(--radius-sm)',
              color: 'var(--color-ink)',
            }}
            title="Click to rename"
          >
            {block.name}
          </button>
        )}

        {isDirty && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
            Unsaved changes
          </span>
        )}

        <div style={{ flex: 1 }} />

        <button
          onClick={() => setPreviewOpen(o => !o)}
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

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '6px 18px',
            background: isDirty ? 'var(--color-amber)' : 'var(--color-ghost)',
            color: isDirty ? 'var(--color-white)' : 'var(--color-muted)',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: 'var(--text-sm)',
            cursor: isDirty ? 'pointer' : 'default',
            transition: 'background 0.15s',
          }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {previewOpen
            ? <PreviewPane html={previewHtml} error={error} />
            : <EditorCanvas editor={editor} theme={theme} />
          }
        </div>
        <RightPanel editor={editor} theme={theme} onThemeChange={handleThemeChange} />
      </div>
    </div>
  );
}
