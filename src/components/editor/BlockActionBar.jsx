// Floating toolbar that appears when a block node is selected
import Icon from '../ui/Icon.jsx';

const BLOCK_NODE_TYPES = ['blockImage', 'blockButton', 'blockDivider', 'blockSpacer', 'blockColumns', 'blockSocialIcons', 'sharedInstance'];

export default function BlockActionBar({ editor }) {
  if (!editor) return null;

  const { selection } = editor.state;
  const node = selection?.node;
  if (!node || !BLOCK_NODE_TYPES.includes(node.type.name)) return null;

  const coords = editor.view.coordsAtPos(selection.from);

  function deleteBlock() {
    editor.chain().focus().deleteSelection().run();
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: coords.top - 40,
        left: coords.left,
        background: 'var(--color-ink)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', gap: 2, padding: 4,
        zIndex: 200,
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <button
        onMouseDown={e => { e.preventDefault(); deleteBlock(); }}
        title="Delete block"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--color-white)', padding: '4px 8px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <Icon name="delete" size={15} style={{ color: 'inherit' }} />
      </button>
    </div>
  );
}
