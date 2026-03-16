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
        background: 'var(--color-shell)',
        border: '1.5px solid #000',
        borderRadius: 0,
        display: 'flex', gap: 0, padding: 0,
        zIndex: 200,
        boxShadow: 'none',
      }}
    >
      <button
        onMouseDown={e => { e.preventDefault(); deleteBlock(); }}
        title="Delete block"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--color-white)', padding: '5px 8px',
          borderRadius: 0,
          display: 'flex', alignItems: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <Icon name="delete" size={15} style={{ color: 'inherit' }} />
      </button>
    </div>
  );
}
