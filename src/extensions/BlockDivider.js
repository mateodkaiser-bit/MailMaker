import { Node } from '@tiptap/core';

export const BlockDivider = Node.create({
  name: 'blockDivider',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      color:     { default: '#E5E7EB' },
      thickness: { default: 1 },
      width:     { default: 100 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="blockDivider"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'blockDivider', ...HTMLAttributes }];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'blockDivider');
      dom.style.padding = '8px 0';

      const hr = document.createElement('hr');
      hr.style.borderTop = `${node.attrs.thickness ?? 1}px solid ${node.attrs.color || '#E5E7EB'}`;
      hr.style.width = `${node.attrs.width ?? 100}%`;
      hr.style.margin = '0 auto';
      hr.style.borderBottom = 'none';
      dom.appendChild(hr);

      return { dom };
    };
  },
});
