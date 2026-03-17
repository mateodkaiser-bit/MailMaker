import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import BlockColumnsView from '../components/nodeviews/BlockColumnsView.jsx';
import BlockColumnView from '../components/nodeviews/BlockColumnView.jsx';

export const BlockColumns = Node.create({
  name: 'blockColumns',
  group: 'block',
  content: 'blockColumn blockColumn',

  addAttributes() {
    return {
      ratio: { default: '50-50' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="blockColumns"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'blockColumns', ...HTMLAttributes }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockColumnsView);
  },
});

export const BlockColumn = Node.create({
  name: 'blockColumn',
  group: '',
  content: 'block+',
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="blockColumn"]' }];
  },

  renderHTML() {
    return ['div', { 'data-type': 'blockColumn' }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockColumnView);
  },
});
