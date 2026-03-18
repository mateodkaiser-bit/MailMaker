import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

/**
 * BlockColumnsView — renders a two-column layout using a single NodeViewContent.
 *
 * Tiptap only supports ONE NodeViewContent per node view. The previous version
 * incorrectly used two, which caused only the first column's content to render.
 *
 * Layout strategy:
 * - NodeViewContent renders as a flex container (via the `as` + `style` props)
 * - ProseMirror renders each child blockColumn inside that flex container
 * - CSS in global.css targets [data-type="blockColumn"] inside [data-ratio="*"]
 *   to set the correct flex widths per ratio
 */
export default function BlockColumnsView({ node }) {
  const ratio = node.attrs.ratio || '50-50';

  return (
    <NodeViewWrapper
      data-type="blockColumns"
      data-ratio={ratio}
      style={{ display: 'block' }}
    >
      <NodeViewContent
        as="div"
        className="dm-columns-flex"
      />
    </NodeViewWrapper>
  );
}
