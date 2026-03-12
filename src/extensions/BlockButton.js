import { Node } from '@tiptap/core';

export const BlockButton = Node.create({
  name: 'blockButton',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      label:           { default: 'Click here' },
      href:            { default: '#' },
      backgroundColor: { default: '#D97706' },
      color:           { default: '#ffffff' },
      borderRadius:    { default: 6 },
      paddingTop:      { default: 12 },
      paddingBottom:   { default: 12 },
      paddingLeft:     { default: 24 },
      paddingRight:    { default: 24 },
      fontSize:        { default: 14 },
      fontWeight:      { default: 600 },
      fullWidth:       { default: false },
      align:           { default: 'center' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="blockButton"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'blockButton', ...HTMLAttributes }];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'blockButton');
      dom.style.textAlign = node.attrs.align || 'center';
      dom.style.padding = '8px 0';

      const btn = document.createElement('a');
      btn.href = node.attrs.href || '#';
      btn.textContent = node.attrs.label || 'Click here';
      btn.style.display = 'inline-block';
      btn.style.backgroundColor = node.attrs.backgroundColor || '#D97706';
      btn.style.color = node.attrs.color || '#ffffff';
      btn.style.borderRadius = `${node.attrs.borderRadius ?? 6}px`;
      btn.style.padding = `${node.attrs.paddingTop ?? 12}px ${node.attrs.paddingRight ?? 24}px ${node.attrs.paddingBottom ?? 12}px ${node.attrs.paddingLeft ?? 24}px`;
      btn.style.fontSize = `${node.attrs.fontSize ?? 14}px`;
      btn.style.fontWeight = node.attrs.fontWeight ?? 600;
      btn.style.textDecoration = 'none';
      if (node.attrs.fullWidth) btn.style.width = '100%';
      dom.appendChild(btn);

      return { dom };
    };
  },
});
