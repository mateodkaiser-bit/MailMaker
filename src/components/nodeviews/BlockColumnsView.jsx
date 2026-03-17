import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export default function BlockColumnsView() {
  return (
    <NodeViewWrapper data-type="blockColumns">
      <NodeViewContent as="div" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }} />
    </NodeViewWrapper>
  );
}
