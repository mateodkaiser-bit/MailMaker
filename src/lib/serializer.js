import { getSharedBlocks } from './storage.js';

/**
 * Convert a TipTap document JSON + template theme into an MJML string.
 * @param {object} doc   - TipTap document JSON
 * @param {object} theme - template theme object
 * @returns {string}     - full MJML string
 */
export function serializeToMjml(doc, theme) {
  const sharedBlocks = getSharedBlocks();
  const bodyContent = serializeNodes(doc?.content, theme, sharedBlocks);

  return `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="${theme.fontFamily}" />
      <mj-text font-size="${theme.bodyFontSize}px" color="#0F1117" line-height="1.6" />
      <mj-section background-color="${theme.backgroundColor}" />
    </mj-attributes>
    <mj-style>
      a { color: ${theme.linkColor}; }
    </mj-style>
  </mj-head>
  <mj-body background-color="${theme.backgroundColor}">
    <mj-section>
      <mj-column>
        ${bodyContent}
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`.trim();
}

function serializeNodes(nodes, theme, sharedBlocks) {
  if (!nodes) return '';
  return nodes.map(node => serializeNode(node, theme, sharedBlocks)).join('\n');
}

function serializeNode(node, theme, sharedBlocks) {
  switch (node.type) {
    case 'paragraph':       return serializeParagraph(node);
    case 'heading':         return serializeHeading(node);
    case 'blockImage':      return serializeImage(node);
    case 'blockButton':     return serializeButton(node);
    case 'blockDivider':    return serializeDivider(node);
    case 'blockSpacer':     return serializeSpacer(node);
    case 'blockColumns':    return serializeColumns(node, theme, sharedBlocks);
    case 'blockSocialIcons':return serializeSocialIcons(node);
    case 'sharedInstance':  return serializeSharedInstance(node, theme, sharedBlocks);
    default:                return '';
  }
}

function serializeParagraph(node) {
  const content = serializeInline(node.content);
  const align = node.attrs?.textAlign || 'left';
  const color = node.attrs?.color || '#0F1117';
  const size = node.attrs?.fontSize ? `font-size="${node.attrs.fontSize}px"` : '';
  return `<mj-text align="${align}" color="${color}" ${size}>${content}</mj-text>`;
}

function serializeHeading(node) {
  const level = node.attrs?.level || 1;
  const sizes   = { 1: 32, 2: 24, 3: 20 };
  const weights = { 1: 700, 2: 700, 3: 600 };
  const px = sizes[level] || 24;
  const fw = weights[level] || 700;
  const content = serializeInline(node.content);
  return `<mj-text font-size="${px}px" font-weight="${fw}" line-height="1.3">${content}</mj-text>`;
}

function serializeImage(node) {
  const { src = '', alt = '', width = '100%', align = 'center', href } = node.attrs || {};
  const link = href ? `href="${href}"` : '';
  const w = typeof width === 'number' ? `${width}px` : width;
  return `<mj-image src="${src}" alt="${alt}" width="${w}" align="${align}" ${link} />`;
}

function serializeButton(node) {
  const {
    label           = 'Click here',
    href            = '#',
    backgroundColor = '#D97706',
    color           = '#ffffff',
    borderRadius    = 6,
    paddingTop      = 12,
    paddingBottom   = 12,
    paddingLeft     = 24,
    paddingRight    = 24,
    fontSize        = 14,
    fontWeight      = 600,
    fullWidth       = false,
    align           = 'center',
  } = node.attrs || {};
  return `<mj-button
    href="${href}"
    background-color="${backgroundColor}"
    color="${color}"
    border-radius="${borderRadius}px"
    inner-padding="${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px"
    font-size="${fontSize}px"
    font-weight="${fontWeight}"
    align="${align}"
    ${fullWidth ? 'width="100%"' : ''}
  >${label}</mj-button>`;
}

function serializeDivider(node) {
  const { color = '#E5E7EB', thickness = 1, width = 100 } = node.attrs || {};
  return `<mj-divider border-color="${color}" border-width="${thickness}px" width="${width}%" />`;
}

function serializeSpacer(node) {
  const { height = 24 } = node.attrs || {};
  return `<mj-spacer height="${height}px" />`;
}

function serializeColumns(node, theme, sharedBlocks) {
  const { ratio = '50-50' } = node.attrs || {};
  const ratioMap = { '50-50': [50, 50], '33-66': [33, 66], '66-33': [66, 33] };
  const [l, r] = ratioMap[ratio] || [50, 50];
  const leftContent  = serializeNodes(node.content?.[0]?.content, theme, sharedBlocks);
  const rightContent = serializeNodes(node.content?.[1]?.content, theme, sharedBlocks);
  return `<mj-section>
  <mj-column width="${l}%">${leftContent}</mj-column>
  <mj-column width="${r}%">${rightContent}</mj-column>
</mj-section>`;
}

function serializeSocialIcons(node) {
  const { icons = [] } = node.attrs || {};
  const iconElements = icons.map(icon =>
    `<mj-social-element name="${icon.network}" href="${icon.href}" />`
  ).join('\n    ');
  return `<mj-social font-size="15px" icon-size="24px" mode="horizontal">${iconElements}</mj-social>`;
}

function serializeSharedInstance(node, theme, sharedBlocks) {
  const { sharedBlockId, snapshot } = node.attrs || {};
  const block = sharedBlocks.find(b => b.id === sharedBlockId);
  const doc = block?.doc || snapshot;
  if (!doc) return '';
  return serializeNodes(doc.content, theme, sharedBlocks);
}

// ---- Inline serializers ----

function serializeInline(nodes) {
  if (!nodes) return '';
  return nodes.map(serializeInlineNode).join('');
}

function serializeInlineNode(node) {
  if (node.type === 'text') {
    let text = escapeHtml(node.text || '');
    if (node.marks) {
      node.marks.forEach(mark => {
        switch (mark.type) {
          case 'bold':      text = `<strong>${text}</strong>`; break;
          case 'italic':    text = `<em>${text}</em>`; break;
          case 'underline': text = `<u>${text}</u>`; break;
          case 'code':      text = `<code>${text}</code>`; break;
          case 'link':      text = `<a href="${mark.attrs?.href || '#'}">${text}</a>`; break;
          case 'textStyle':
            if (mark.attrs?.color) text = `<span style="color:${mark.attrs.color}">${text}</span>`;
            break;
        }
      });
    }
    return text;
  }
  return '';
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Preserve {{ variable }} tokens — unescape them after
    .replace(/\{\{/g, '{{')
    .replace(/\}\}/g, '}}');
}
