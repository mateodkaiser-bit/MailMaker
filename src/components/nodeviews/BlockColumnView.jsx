import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const ratioMap = { '50-50': [50, 50], '33-66': [33, 66], '66-33': [66, 33] };

export default function BlockColumnView({ getPos, editor }) {
  let width = '50%';
  try {
    const pos  = getPos();
    const $pos = editor.state.doc.resolve(pos);
    const parent = $pos.node($pos.depth - 1);
    const [l, r] = ratioMap[parent?.attrs?.ratio] || [50, 50];
    const index  = $pos.index($pos.depth - 1);
    width = `${index === 0 ? l : r}%`;
  } catch { /* pos may be stale during teardown */ }

  return (
    <NodeViewWrapper
      data-type="blockColumn"
      style={{ width, minWidth: 0, flexShrink: 0 }}
    >
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
