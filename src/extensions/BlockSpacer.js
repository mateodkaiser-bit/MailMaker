import { Node } from '@tiptap/core';

export const BlockSpacer = Node.create({
  name: 'blockSpacer',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      height: { default: 24 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="blockSpacer"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'blockSpacer', ...HTMLAttributes }];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'blockSpacer');
      dom.style.height = `${node.attrs.height ?? 24}px`;
      dom.style.position = 'relative';

      // Show a dashed guide line in the editor
      const guide = document.createElement('div');
      guide.style.position = 'absolute';
      guide.style.top = '50%';
      guide.style.left = '0';
      guide.style.right = '0';
      guide.style.borderTop = '1px dashed #9CA3AF';
      dom.appendChild(guide);

      return { dom };
    };
  },
});
