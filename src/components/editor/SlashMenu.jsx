import { useEffect, useRef, useState } from 'react';
import { SLASH_MENU_KEY } from '../../extensions/SlashCommand.js';

const COMMANDS = [
  { label: 'Paragraph',    icon: 'notes',           type: 'paragraph' },
  { label: 'Heading 1',    icon: 'format_h1',        type: 'heading', attrs: { level: 1 } },
  { label: 'Heading 2',    icon: 'format_h2',        type: 'heading', attrs: { level: 2 } },
  { label: 'Heading 3',    icon: 'format_h3',        type: 'heading', attrs: { level: 3 } },
  { label: 'Image',        icon: 'image',            type: 'blockImage' },
  { label: 'Button',       icon: 'smart_button',     type: 'blockButton' },
  { label: 'Divider',      icon: 'horizontal_rule',  type: 'blockDivider' },
  { label: 'Spacer',       icon: 'height',           type: 'blockSpacer' },
  { label: 'Two Columns',  icon: 'view_column',      type: 'blockColumns' },
  { label: 'Social Icons', icon: 'hub',              type: 'blockSocialIcons' },
];

export default function SlashMenu({ editor }) {
  const [state, setState] = useState({ active: false, query: '', range: null });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const s = SLASH_MENU_KEY.getState(editor.state);
      setState(s || { active: false, query: '', range: null });
      setSelectedIndex(0);
    };
    editor.on('transaction', update);
    return () => editor.off('transaction', update);
  }, [editor]);

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes((state.query || '').toLowerCase())
  );

  useEffect(() => {
    if (!state.active) return;
    function onKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => (i + 1) % filtered.length); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length); }
      if (e.key === 'Enter')     { e.preventDefault(); insertCommand(filtered[selectedIndex]); }
      if (e.key === 'Escape')    { closeMenu(); }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [state.active, filtered, selectedIndex]);

  function closeMenu() {
    editor.view.dispatch(
      editor.state.tr.setMeta(SLASH_MENU_KEY, { active: false, query: '', range: null })
    );
  }

  function insertCommand(cmd) {
    if (!cmd || !state.range) return;
    const { from, to } = state.range;
    editor.chain().focus().deleteRange({ from, to }).run();

    if (cmd.type === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else if (cmd.type === 'heading') {
      editor.chain().focus().setHeading(cmd.attrs).run();
    } else {
      const defaults = {
        blockImage:       { src: '', alt: '', width: '100%', align: 'center' },
        blockButton:      { label: 'Click here', href: '#' },
        blockDivider:     { color: '#E5E7EB', thickness: 1, width: 100 },
        blockSpacer:      { height: 24 },
        blockColumns:     { ratio: '50-50' },
        blockSocialIcons: { icons: [] },
      };
      editor.chain().focus().insertContent({ type: cmd.type, attrs: defaults[cmd.type] || {} }).run();
    }
    closeMenu();
  }

  if (!state.active || filtered.length === 0) return null;

  const coords = editor.view.coordsAtPos(state.range?.from ?? 0);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: coords.bottom + 4,
        left: Math.max(8, coords.left),
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 500,
        minWidth: 220,
        maxHeight: 320,
        overflowY: 'auto',
        padding: 4,
      }}
    >
      {filtered.map((cmd, i) => (
        <button
          key={cmd.type + (cmd.attrs?.level ?? '')}
          onMouseDown={(e) => { e.preventDefault(); insertCommand(cmd); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', textAlign: 'left',
            padding: '8px 12px',
            background: i === selectedIndex ? 'var(--color-ghost)' : 'none',
            border: 'none', cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
          }}
          onMouseEnter={() => setSelectedIndex(i)}
        >
          <span
            className="material-symbols-rounded"
            style={{
              fontSize: 16,
              width: 20,
              textAlign: 'center',
              color: 'var(--color-muted)',
              fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 16",
            }}
          >
            {cmd.icon}
          </span>
          {cmd.label}
        </button>
      ))}
    </div>
  );
}
