import { EditorContent } from '@tiptap/react';
import BlockActionBar from './BlockActionBar.jsx';
import SlashMenu from './SlashMenu.jsx';
import { useState } from 'react';
import VariableMenu from './VariableMenu.jsx';

export default function EditorCanvas({ editor, theme }) {
  const [varMenuOpen, setVarMenuOpen] = useState(false);
  const [varMenuPos, setVarMenuPos] = useState({ x: 0, y: 0 });

  function handleKeyDown(e) {
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
      className="dot-grid"
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Paper canvas — crisp white sheet floating on the dark shell */}
      <div
        style={{
          width: '100%',
          maxWidth: `${theme?.maxWidth ?? 680}px`,
          background: theme?.backgroundColor ?? '#ffffff',
          border: '1px solid #000',
          borderRadius: 0,
          boxShadow: 'none',
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
