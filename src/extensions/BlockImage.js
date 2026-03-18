import { Node } from '@tiptap/core';

export const BlockImage = Node.create({
  name: 'blockImage',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src:          { default: '' },
      alt:          { default: '' },
      width:        { default: '100%' },
      align:        { default: 'center' },
      href:         { default: null },
      borderRadius: { default: 5 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="blockImage"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'blockImage', ...HTMLAttributes }];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'blockImage');
      dom.style.textAlign = node.attrs.align || 'center';
      dom.style.padding = '8px 0';

      const img = document.createElement('img');
      img.src = node.attrs.src || '';
      img.alt = node.attrs.alt || '';
      const w = node.attrs.width;
      img.style.width = typeof w === 'number' ? `${w}px` : (w || '100%');
      img.style.display = 'inline-block';
      img.style.maxWidth = '100%';
      const br = node.attrs.borderRadius;
      if (br) img.style.borderRadius = `${br}px`;
      dom.appendChild(img);

      return { dom };
    };
  },
});
