import { Node } from '@tiptap/core';

export const BlockSharedInstance = Node.create({
  name: 'sharedInstance',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      sharedBlockId: { default: null },
      label:         { default: 'Shared Block' },
      snapshot:      { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="sharedInstance"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'sharedInstance', ...HTMLAttributes }];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'sharedInstance');
      dom.style.border = '2px dashed #D97706';
      dom.style.borderRadius = '6px';
      dom.style.padding = '12px 16px';
      dom.style.background = '#FFFBEB';
      dom.style.display = 'flex';
      dom.style.alignItems = 'center';
      dom.style.gap = '8px';

      const icon = document.createElement('span');
      icon.textContent = '⚡';
      icon.style.fontSize = '16px';

      const label = document.createElement('span');
      label.textContent = node.attrs.label || 'Shared Block';
      label.style.fontSize = '13px';
      label.style.fontWeight = '600';
      label.style.color = '#D97706';

      dom.appendChild(icon);
      dom.appendChild(label);

      return { dom };
    };
  },
});
