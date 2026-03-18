import { nanoid } from 'nanoid';

/**
 * Convert a ProseMirror JSON document (or null) into the new flat-block format.
 * If `doc` is already an array, returns it untouched (already migrated).
 */
export function migrateDoc(doc) {
  // Already in new format
  if (Array.isArray(doc)) return doc;

  // Empty / null
  if (!doc?.content?.length) {
    return [createBlock('paragraph')];
  }

  return doc.content.map(convertNode).filter(Boolean);
}

function convertNode(node) {
  if (!node) return null;

  switch (node.type) {
    case 'paragraph':
      return {
        id: nanoid(),
        type: 'paragraph',
        html: inlineToHtml(node.content),
        attrs: { textAlign: node.attrs?.textAlign || 'left' },
      };

    case 'heading':
      return {
        id: nanoid(),
        type: 'heading',
        html: inlineToHtml(node.content),
        attrs: {
          level: node.attrs?.level || 1,
          textAlign: node.attrs?.textAlign || 'left',
        },
      };

    case 'bulletList':
    case 'orderedList':
      return {
        id: nanoid(),
        type: 'paragraph',
        html: listToHtml(node),
        attrs: { textAlign: 'left' },
      };

    case 'blockImage':
      return {
        id: nanoid(),
        type: 'image',
        attrs: {
          src: node.attrs?.src || '',
          alt: node.attrs?.alt || '',
          width: node.attrs?.width || '100%',
          align: node.attrs?.align || 'center',
          href: node.attrs?.href || null,
          borderRadius: node.attrs?.borderRadius ?? 5,
        },
      };

    case 'blockButton':
      return {
        id: nanoid(),
        type: 'button',
        attrs: {
          label: node.attrs?.label || 'Click here',
          href: node.attrs?.href || '#',
          backgroundColor: node.attrs?.backgroundColor || '#D97706',
          color: node.attrs?.color || '#ffffff',
          borderRadius: node.attrs?.borderRadius ?? 6,
          paddingTop: node.attrs?.paddingTop ?? 12,
          paddingBottom: node.attrs?.paddingBottom ?? 12,
          paddingLeft: node.attrs?.paddingLeft ?? 24,
          paddingRight: node.attrs?.paddingRight ?? 24,
          fontSize: node.attrs?.fontSize ?? 14,
          fontWeight: node.attrs?.fontWeight ?? 600,
          fullWidth: node.attrs?.fullWidth ?? false,
          align: node.attrs?.align || 'center',
        },
      };

    case 'blockDivider':
      return {
        id: nanoid(),
        type: 'divider',
        attrs: {
          color: node.attrs?.color || '#E5E7EB',
          thickness: node.attrs?.thickness ?? 1,
          width: node.attrs?.width ?? 100,
        },
      };

    case 'blockSpacer':
      return {
        id: nanoid(),
        type: 'spacer',
        attrs: { height: node.attrs?.height ?? 24 },
      };

    case 'blockColumns':
      return {
        id: nanoid(),
        type: 'columns',
        attrs: { ratio: node.attrs?.ratio || '50-50' },
        columns: (node.content || []).map(col =>
          (col.content || []).map(convertNode).filter(Boolean)
        ),
      };

    case 'blockSocialIcons':
      return {
        id: nanoid(),
        type: 'socialIcons',
        attrs: { icons: node.attrs?.icons || [] },
      };

    case 'sharedInstance':
      return {
        id: nanoid(),
        type: 'sharedInstance',
        attrs: {
          sharedBlockId: node.attrs?.sharedBlockId || null,
          label: node.attrs?.label || 'Shared Block',
          snapshot: node.attrs?.snapshot || null,
        },
      };

    default:
      return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Deep-clone a block array and assign fresh nanoid IDs to every block.
 * Use when duplicating a template doc so IDs don't collide.
 */
export function cloneBlocksWithNewIds(blocks) {
  if (!Array.isArray(blocks)) return blocks;
  return blocks.map(b => {
    const clone = { ...b, id: nanoid() };
    if (clone.attrs) clone.attrs = { ...clone.attrs };
    if (clone.columns) {
      clone.columns = clone.columns.map(col =>
        col.map(cb => {
          const cc = { ...cb, id: nanoid() };
          if (cc.attrs) cc.attrs = { ...cc.attrs };
          return cc;
        })
      );
    }
    return clone;
  });
}

export function createBlock(type, overrides = {}) {
  const defaults = BLOCK_DEFAULTS[type] || {};
  const block = {
    id: nanoid(),
    type,
    attrs: { ...defaults, ...overrides },
  };

  if (type === 'paragraph' || type === 'heading') {
    block.html = '';
  }

  if (type === 'columns') {
    const numCols = overrides.ratio === '33-33-33' ? 3 : 2;
    block.columns = Array.from({ length: numCols }, () => [
      { id: nanoid(), type: 'paragraph', html: '', attrs: { textAlign: 'left' } },
    ]);
  }

  return block;
}

export const BLOCK_DEFAULTS = {
  paragraph: { textAlign: 'left' },
  heading: { level: 1, textAlign: 'left' },
  image: { src: '', alt: '', width: '100%', align: 'center', href: null, borderRadius: 5 },
  button: {
    label: 'Click here', href: '#', backgroundColor: '#D97706',
    color: '#ffffff', borderRadius: 6, paddingTop: 12, paddingBottom: 12,
    paddingLeft: 24, paddingRight: 24, fontSize: 14, fontWeight: 600,
    fullWidth: false, align: 'center',
  },
  divider: { color: '#E5E7EB', thickness: 1, width: 100 },
  spacer: { height: 24 },
  columns: { ratio: '50-50' },
  socialIcons: { icons: [] },
  sharedInstance: { sharedBlockId: null, label: 'Shared Block', snapshot: null },
};

// ─── Inline HTML helpers ──────────────────────────────────────────────────────

function inlineToHtml(nodes) {
  if (!nodes?.length) return '';
  return nodes.map(n => {
    if (n.type !== 'text') return '';
    let t = escapeHtml(n.text || '');
    for (const m of (n.marks || [])) {
      switch (m.type) {
        case 'bold':      t = `<strong>${t}</strong>`; break;
        case 'italic':    t = `<em>${t}</em>`; break;
        case 'underline': t = `<u>${t}</u>`; break;
        case 'code':      t = `<code>${t}</code>`; break;
        case 'link':      t = `<a href="${m.attrs?.href || '#'}">${t}</a>`; break;
        case 'textStyle':
          if (m.attrs?.color) t = `<span style="color:${m.attrs.color}">${t}</span>`;
          break;
      }
    }
    return t;
  }).join('');
}

function listToHtml(node) {
  return (node.content || []).map(item => {
    const paras = (item.content || []).map(p => inlineToHtml(p.content));
    return `• ${paras.join(' ')}`;
  }).join('<br>');
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
