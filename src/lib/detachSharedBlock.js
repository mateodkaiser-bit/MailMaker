import { NodeSelection } from 'prosemirror-state';
import { Fragment } from 'prosemirror-model';

/**
 * Detach the currently-selected sharedInstance node, replacing it
 * in-place with the editable content from either the live shared block
 * doc or, if the original has been deleted, the saved snapshot.
 *
 * @param {import('@tiptap/core').Editor} editor
 * @param {Array<{id: string, doc: object}>} sharedBlocks  - current blocks array from useSharedBlockStore
 * @returns {boolean}  true if detach was applied, false if it failed
 */
export function detachSharedBlock(editor, sharedBlocks) {
  const { state, view } = editor;
  const { selection } = state;

  // Must be a NodeSelection on a sharedInstance node
  if (!(selection instanceof NodeSelection)) return false;
  const node = selection.node;
  if (node.type.name !== 'sharedInstance') return false;

  const { sharedBlockId, snapshot } = node.attrs;

  // Prefer the live block; fall back to the snapshot saved at insert-time
  const liveBlock = sharedBlocks.find(b => b.id === sharedBlockId);
  const sourceDoc = liveBlock?.doc ?? snapshot;

  if (!sourceDoc) return false;

  try {
    // Parse the source doc JSON into ProseMirror nodes using the current schema
    const parsedDoc = state.schema.nodeFromJSON(sourceDoc);

    // Collect the top-level children of the parsed document
    const nodes = [];
    parsedDoc.forEach(child => nodes.push(child));

    if (nodes.length === 0) return false;

    const { from } = selection;
    const tr = state.tr.replaceWith(
      from,
      from + node.nodeSize,
      Fragment.fromArray(nodes),
    );

    // Move cursor to just after the inserted content
    tr.setSelection(
      state.selection.constructor.near(tr.doc.resolve(from + nodes[0].nodeSize))
    );

    view.dispatch(tr);
    return true;
  } catch (e) {
    console.error('[detachSharedBlock] failed to parse source doc:', e);
    return false;
  }
}
