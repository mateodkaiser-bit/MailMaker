// Floating toolbar that appears when a block node is selected
import { useState } from 'react';

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

  function moveUp() {
    editor.chain().focus().run();
    // Move block up by swapping with previous sibling
    const { $from } = editor.state.selection;
    const index = $from.index($from.depth - 1);
    if (index === 0) return;
    const parent = $from.node($from.depth - 1);
    const prevNode = parent.child(index - 1);
    const tr = editor.state.tr;
    const start = $from.start($from.depth - 1);
    const nodeStart = $from.before($from.depth);
    const prevStart = nodeStart - prevNode.nodeSize;
    tr.replaceWith(prevStart, nodeStart + node.nodeSize,
      [node, prevNode]
    );
    editor.view.dispatch(tr);
  }

  function moveDown() {
    const { $from } = editor.state.selection;
    const index = $from.index($from.depth - 1);
    const parent = $from.node($from.depth - 1);
    if (index >= parent.childCount - 1) return;
    const nextNode = parent.child(index + 1);
    const tr = editor.state.tr;
    const nodeStart = $from.before($from.depth);
    tr.replaceWith(nodeStart, nodeStart + node.nodeSize + nextNode.nodeSize,
      [nextNode, node]
    );
    editor.view.dispatch(tr);
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
      {[
        { icon: '↑', title: 'Move up',     action: moveUp },
        { icon: '↓', title: 'Move down',   action: moveDown },
        { icon: '🗑', title: 'Delete block', action: deleteBlock },
      ].map(({ icon, title, action }) => (
        <button
          key={title}
          onMouseDown={e => { e.preventDefault(); action(); }}
          title={title}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-white)', padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
