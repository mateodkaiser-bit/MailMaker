import { render } from '@react-email/render';
import { expose } from 'comlink';
import { buildEmailTree } from '../lib/serializer.jsx';

expose({
  async compile(doc, theme, sharedBlocks) {
    const tree = buildEmailTree(doc, theme, sharedBlocks);
    const html = await render(tree);
    return html;
  },
});
