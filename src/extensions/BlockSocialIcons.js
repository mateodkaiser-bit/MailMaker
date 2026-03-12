import { Node } from '@tiptap/core';

export const BlockSocialIcons = Node.create({
  name: 'blockSocialIcons',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      icons: { default: [] },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="blockSocialIcons"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'blockSocialIcons', ...HTMLAttributes }];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'blockSocialIcons');
      dom.style.display = 'flex';
      dom.style.gap = '12px';
      dom.style.justifyContent = 'center';
      dom.style.padding = '8px 0';

      const icons = node.attrs.icons || [];
      icons.forEach(icon => {
        const a = document.createElement('a');
        a.href = icon.href || '#';
        a.style.display = 'inline-flex';
        a.style.alignItems = 'center';
        a.style.justifyContent = 'center';
        a.style.width = '32px';
        a.style.height = '32px';
        a.style.borderRadius = '50%';
        a.style.background = '#E5E7EB';

        const span = document.createElement('span');
        span.textContent = (icon.network || '').charAt(0).toUpperCase();
        span.style.fontSize = '12px';
        span.style.fontWeight = '700';
        a.appendChild(span);
        dom.appendChild(a);
      });

      if (icons.length === 0) {
        const placeholder = document.createElement('span');
        placeholder.textContent = 'Social Icons';
        placeholder.style.color = '#9CA3AF';
        placeholder.style.fontSize = '13px';
        dom.appendChild(placeholder);
      }

      return { dom };
    };
  },
});
