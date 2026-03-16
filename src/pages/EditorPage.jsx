import { useState, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTemplateStore } from '../store/templates.js';
import { useSettingsStore } from '../store/settings.js';
import { useEditor } from '../hooks/useEditor.js';
import { useCompiler } from '../hooks/useCompiler.js';
import EditorTopBar from '../components/editor/EditorTopBar.jsx';
import EditorCanvas from '../components/editor/EditorCanvas.jsx';
import PreviewPane from '../components/editor/PreviewPane.jsx';
import RightPanel from '../components/panels/RightPanel.jsx';

export default function EditorPage() {
  const { id } = useParams();
  const { getTemplate, updateTemplate } = useTemplateStore();
  const { settings } = useSettingsStore();

  const template = getTemplate(id);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Per-template theme (falls back to settings default)
  const [theme, setTheme] = useState(() => ({
    ...settings?.defaultTheme,
    ...(template?.theme ?? {}),
  }));

  // Doc state kept separate so compiler re-runs on doc change
  const [doc, setDoc] = useState(template?.doc ?? null);

  const editor = useEditor({
    content: template?.doc ?? null,
    onUpdate: useCallback((newDoc) => {
      setDoc(newDoc);
      updateTemplate(id, { doc: newDoc });
    }, [id, updateTemplate]),
  });

  // Single always-on compiler — provides html for export AND preview
  const { html, error, isCompiling } = useCompiler(doc, theme, true);

  function handleThemeChange(patch) {
    const next = { ...theme, ...patch };
    setTheme(next);
    updateTemplate(id, { theme: next });
  }

  function handleRename(name) {
    updateTemplate(id, { name });
  }

  if (!template) return <Navigate to="/" replace />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <EditorTopBar
        editor={editor}
        template={template}
        onRename={handleRename}
        html={html}
        isCompiling={isCompiling}
        hasError={!!error}
        previewOpen={previewOpen}
        onPreviewToggle={() => setPreviewOpen(o => !o)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Canvas */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {previewOpen ? (
            <PreviewPane
              html={html}
              error={error}
              variables={template?.variables ?? []}
              globalVariables={settings?.variables ?? []}
            />
          ) : (
            <EditorCanvas editor={editor} theme={theme} />
          )}
        </div>

        {/* Right panel */}
        <RightPanel editor={editor} theme={theme} onThemeChange={handleThemeChange} />
      </div>
    </div>
  );
}
