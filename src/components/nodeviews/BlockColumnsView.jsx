import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const ratioMap = { '50-50': [50, 50], '33-66': [33, 66], '66-33': [66, 33] };

export default function BlockColumnsView({ node }) {
  const [l, r] = ratioMap[node.attrs.ratio] || [50, 50];

  return (
    <NodeViewWrapper data-type="blockColumns">
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ width: `${l}%` }} data-type="blockColumn">
          <NodeViewContent />
        </div>
        <div style={{ width: `${r}%` }} data-type="blockColumn">
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
