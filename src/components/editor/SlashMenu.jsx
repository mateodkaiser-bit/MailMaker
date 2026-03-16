import { useEffect, useRef, useState } from 'react';
import { SLASH_MENU_KEY } from '../../extensions/SlashCommand.js';

const COMMANDS = [
  {
    group: 'Text',
    items: [
      { label: 'Paragraph',   desc: 'Plain body text',              icon: 'notes',          type: 'paragraph' },
      { label: 'Heading 1',   desc: 'Large section heading',        icon: 'format_h1',      type: 'heading', attrs: { level: 1 } },
      { label: 'Heading 2',   desc: 'Medium section heading',       icon: 'format_h2',      type: 'heading', attrs: { level: 2 } },
      { label: 'Heading 3',   desc: 'Small section heading',        icon: 'format_h3',      type: 'heading', attrs: { level: 3 } },
    ],
  },
  {
    group: 'Blocks',
    items: [
      { label: 'Image',        desc: 'Full-width image block',       icon: 'image',          type: 'blockImage' },
      { label: 'Button',       desc: 'Call-to-action button',        icon: 'smart_button',   type: 'blockButton' },
      { label: 'Divider',      desc: 'Horizontal rule',              icon: 'horizontal_rule',type: 'blockDivider' },
      { label: 'Spacer',       desc: 'Empty vertical space',         icon: 'height',         type: 'blockSpacer' },
      { label: 'Two Columns',  desc: 'Side-by-side layout',          icon: 'view_column',    type: 'blockColumns' },
      { label: 'Social Icons', desc: 'Social media link buttons',    icon: 'hub',            type: 'blockSocialIcons' },
    ],
  },
];

const ALL_ITEMS = COMMANDS.flatMap(g => g.items);

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

  const filtered = ALL_ITEMS.filter(c =>
    c.label.toLowerCase().includes((state.query || '').toLowerCase()) ||
    c.desc.toLowerCase().includes((state.query || '').toLowerCase())
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

  // Build grouped display respecting search filter
  const groupedFiltered = state.query
    ? [{ group: null, items: filtered }]
    : COMMANDS.map(g => ({ group: g.group, items: g.items.filter(i => filtered.includes(i)) })).filter(g => g.items.length > 0);

  let globalIdx = 0;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: coords.bottom + 6,
        left: Math.max(8, coords.left),
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        zIndex: 500,
        minWidth: 260,
        maxHeight: 380,
        overflowY: 'auto',
        padding: '6px 0 0',
      }}
    >
      {groupedFiltered.map(({ group, items }) => (
        <div key={group ?? 'results'}>
          {group && (
            <div style={{
              padding: '4px 14px 3px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
            }}>
              {group}
            </div>
          )}
          {items.map(cmd => {
            const idx = globalIdx++;
            const active = idx === selectedIndex;
            return (
              <button
                key={cmd.type + (cmd.attrs?.level ?? '')}
                onMouseDown={e => { e.preventDefault(); insertCommand(cmd); }}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', textAlign: 'left',
                  padding: '7px 12px',
                  background: active ? 'var(--color-ghost)' : 'none',
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.08s',
                }}
              >
                {/* Icon container */}
                <div style={{
                  width: 30, height: 30,
                  background: active ? 'var(--color-white)' : 'var(--color-ghost)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.08s',
                }}>
                  <span
                    className="material-symbols-rounded"
                    style={{
                      fontSize: 15,
                      color: 'var(--color-slate)',
                      fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 16",
                    }}
                  >
                    {cmd.icon}
                  </span>
                </div>

                {/* Label + desc */}
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: 'var(--color-ink)',
                    lineHeight: 1.3,
                  }}>
                    {cmd.label}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-muted)',
                    lineHeight: 1.4,
                    marginTop: 1,
                  }}>
                    {cmd.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ))}

      {/* Keyboard hint */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px',
        borderTop: '1px solid var(--color-border)',
        marginTop: 2,
      }}>
        {[['arrow_upward', ''], ['arrow_downward', 'navigate'], ['keyboard_return', 'select']].map(([icon, label]) => (
          <span key={icon} style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--color-muted)', fontSize: 10 }}>
            <span
              className="material-symbols-rounded"
              style={{ fontSize: 11, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 12" }}
            >
              {icon}
            </span>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
