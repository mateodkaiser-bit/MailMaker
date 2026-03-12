import { EditorContent } from '@tiptap/react';
import BlockActionBar from './BlockActionBar.jsx';
import SlashMenu from './SlashMenu.jsx';
import { useState } from 'react';
import VariableMenu from './VariableMenu.jsx';

export default function EditorCanvas({ editor, theme }) {
  const [varMenuOpen, setVarMenuOpen] = useState(false);
  const [varMenuPos, setVarMenuPos] = useState({ x: 0, y: 0 });

  function handleKeyDown(e) {
    // Ctrl/Cmd + Shift + V opens variable menu at cursor
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
      e.preventDefault();
      if (!editor) return;
      const { from } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);
      setVarMenuPos({ x: coords.left, y: coords.bottom + 4 });
      setVarMenuOpen(true);
    }
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: 'var(--color-border)',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          width: '100%',
          maxWidth: `${theme?.maxWidth ?? 680}px`,
          background: theme?.backgroundColor ?? 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-canvas)',
          minHeight: 400,
          position: 'relative',
        }}
      >
        <EditorContent
          editor={editor}
          style={{
            fontFamily: theme?.fontFamily ?? 'var(--font-sans)',
            fontSize: `${theme?.bodyFontSize ?? 16}px`,
            padding: '32px 40px',
          }}
        />

        <BlockActionBar editor={editor} />
        <SlashMenu editor={editor} />

        {varMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: varMenuPos.y,
              left: varMenuPos.x,
              zIndex: 500,
            }}
          >
            <VariableMenu editor={editor} onClose={() => setVarMenuOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
