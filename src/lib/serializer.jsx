import React from 'react';
import {
  Html, Head, Body, Container, Font,
  Text, Img, Button, Hr, Section, Column, Row, Link,
} from '@react-email/components';
import { getFontByName, extractFontName, getGoogleFontsUrl } from './fonts.js';

/**
 * Convert a document (block array or ProseMirror JSON) + theme into a React Email element tree.
 *
 * @param {object|Array} doc    - Block array (new format) or ProseMirror JSON (legacy)
 * @param {object} theme        - template theme object
 * @param {Array}  sharedBlocks - resolved shared blocks array
 * @returns {React.ReactElement} - full React Email tree
 */
export function buildEmailTree(doc, theme = {}, sharedBlocks = []) {
  // Support both new block array format and legacy ProseMirror JSON
  const children = Array.isArray(doc)
    ? buildBlockArray(doc, theme, sharedBlocks)
    : buildNodes(doc?.content, theme, sharedBlocks);

  // ── Font resolution ──────────────────────────────────────────────────────
  // theme.fontName     set by FontPicker (preferred)
  // theme.fontFamily   legacy CSS stack string — extract primary name from it
  const fontName = theme.fontName ?? extractFontName(theme.fontFamily ?? '');
  const fontObj  = getFontByName(fontName);

  // Primary name for the react-email <Font> component (no quotes, no fallbacks)
  const primaryName = fontObj?.name ?? fontName ?? 'Inter';

  // Serif fonts fall back to Georgia; everything else falls back to Arial
  const isSerif  = fontObj?.category === 'google-serif' || fontObj?.category === 'web-safe-serif';
  const fallback = isSerif ? 'Georgia' : 'Arial';

  // Google Fonts: emit an @import so Gmail webmail + Apple Mail can load it
  const googleFontsUrl = getGoogleFontsUrl(primaryName);

  const maxW = theme.maxWidth || 600;

  // Responsive media queries for mobile email clients
  const responsiveCss = `
    @media only screen and (max-width: ${maxW + 40}px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .email-columns-row td,
      .email-columns-row th {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .email-columns-row td > div,
      .email-columns-row th > div {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      img {
        max-width: 100% !important;
        height: auto !important;
      }
    }
  `;

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/*
          @import must appear as the very first rule in a <style> block.
          Most email clients ignore it, but Gmail (webmail), Apple Mail,
          and Outlook.com will honour it — giving a best-effort web font.
          The <Font> element below is the Outlook-safe fallback declaration.
        */}
        {googleFontsUrl && (
          <style>{`@import url('${googleFontsUrl}');`}</style>
        )}
        <style>{responsiveCss}</style>
        <Font
          fontFamily={primaryName}
          fallbackFontFamily={fallback}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={{ backgroundColor: theme.backgroundColor || '#ffffff', margin: 0, padding: '0' }}>
        <Container
          className="email-container"
          style={{
            maxWidth: `${maxW}px`,
            width: '100%',
            margin: '0 auto',
            padding: '24px 32px',
          }}
        >
          {children}
        </Container>
      </Body>
    </Html>
  );
}

// ─── New block-array builder ──────────────────────────────────────────────

function buildBlockArray(blocks, theme, sharedBlocks) {
  if (!blocks?.length) return null;
  return blocks.map((block, i) => buildBlockItem(block, theme, sharedBlocks, i));
}

function buildBlockItem(block, theme, sharedBlocks, key) {
  switch (block.type) {
    case 'paragraph':
      return (
        <Text
          key={key}
          style={{
            textAlign: block.attrs?.textAlign || 'left',
            fontSize: theme.bodyFontSize ? `${theme.bodyFontSize}px` : '16px',
            lineHeight: '1.6',
            margin: '0 0 8px 0',
          }}
          dangerouslySetInnerHTML={{ __html: block.html || '' }}
        />
      );
    case 'heading': {
      const level = block.attrs?.level || 1;
      const sizes = { 1: '32px', 2: '24px', 3: '20px' };
      const weights = { 1: 700, 2: 700, 3: 600 };
      return (
        <Text
          key={key}
          style={{
            fontSize: sizes[level] || '24px',
            fontWeight: weights[level] || 700,
            lineHeight: '1.3',
            margin: '0 0 12px 0',
            textAlign: block.attrs?.textAlign || 'left',
          }}
          dangerouslySetInnerHTML={{ __html: block.html || '' }}
        />
      );
    }
    case 'image':   return buildImage({ attrs: block.attrs }, key);
    case 'button':  return buildButton({ attrs: block.attrs }, key);
    case 'divider': return buildDivider({ attrs: block.attrs }, key);
    case 'spacer':  return buildSpacer({ attrs: block.attrs }, key);
    case 'columns': return buildColumnsFromBlocks(block, theme, sharedBlocks, key);
    case 'socialIcons': return buildSocialIcons({ attrs: block.attrs }, key);
    case 'sharedInstance': return buildSharedInstance({ attrs: block.attrs }, theme, sharedBlocks, key);
    default: return null;
  }
}

function buildColumnsFromBlocks(block, theme, sharedBlocks, key) {
  const { ratio = '50-50' } = block.attrs || {};
  const ratioMap = {
    '50-50': ['50%', '50%'],
    '33-66': ['33%', '66%'],
    '66-33': ['66%', '33%'],
    '33-33-33': ['33.333%', '33.333%', '33.333%'],
  };
  const widths = ratioMap[ratio] || ['50%', '50%'];
  const columns = block.columns || [[], []];

  return (
    <Section key={key} className="email-columns-row">
      {widths.map((w, i) => (
        <Column key={i} style={{ width: w, verticalAlign: 'top', padding: '0 8px' }}>
          {buildBlockArray(columns[i] || [], theme, sharedBlocks)}
        </Column>
      ))}
    </Section>
  );
}

// ─── Legacy ProseMirror node builders ─────────────────────────────────────

function buildNodes(nodes, theme, sharedBlocks) {
  if (!nodes || nodes.length === 0) return null;
  return nodes.map((node, i) => buildNode(node, theme, sharedBlocks, i));
}

function buildNode(node, theme, sharedBlocks, key) {
  switch (node.type) {
    case 'paragraph':        return buildParagraph(node, theme, key);
    case 'heading':          return buildHeading(node, key);
    case 'bulletList':       return buildBulletList(node, theme, key);
    case 'orderedList':      return buildBulletList(node, theme, key);
    case 'listItem':         return buildListItem(node, theme, key);
    case 'blockImage':       return buildImage(node, key);
    case 'blockButton':      return buildButton(node, key);
    case 'blockDivider':     return buildDivider(node, key);
    case 'blockSpacer':      return buildSpacer(node, key);
    case 'blockColumns':     return buildColumns(node, theme, sharedBlocks, key);
    case 'blockSocialIcons': return buildSocialIcons(node, key);
    case 'sharedInstance':   return buildSharedInstance(node, theme, sharedBlocks, key);
    default:                 return null;
  }
}

function buildParagraph(node, theme, key) {
  const align    = node.attrs?.textAlign || 'left';
  const color    = node.attrs?.color     || '#0F1117';
  const fontSize = node.attrs?.fontSize
    ? `${node.attrs.fontSize}px`
    : theme.bodyFontSize ? `${theme.bodyFontSize}px` : '16px';
  const html = buildInlineHtml(node.content);

  return (
    <Text
      key={key}
      style={{ textAlign: align, color, fontSize, lineHeight: '1.6', margin: '0 0 8px 0' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function buildHeading(node, key) {
  const level      = node.attrs?.level || 1;
  const sizes      = { 1: '32px', 2: '24px', 3: '20px' };
  const weights    = { 1: 700,    2: 700,    3: 600    };
  const fontSize   = sizes[level]   || '24px';
  const fontWeight = weights[level] || 700;
  const html       = buildInlineHtml(node.content);

  return (
    <Text
      key={key}
      style={{ fontSize, fontWeight, lineHeight: '1.3', margin: '0 0 12px 0' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function buildImage(node, key) {
  const { src = '', alt = '', width = '100%', align = 'center', href, borderRadius = 5 } = node.attrs || {};
  const w = typeof width === 'number' ? `${width}px` : width;
  const marginStyle = align === 'center'
    ? '0 auto'
    : align === 'right' ? '0 0 0 auto' : '0';

  const img = (
    <Img
      key={href ? undefined : key}
      src={src}
      alt={alt}
      width={w}
      style={{
        display: 'block',
        margin: marginStyle,
        maxWidth: '100%',
        height: 'auto',
        borderRadius: borderRadius ? `${borderRadius}px` : '0',
      }}
    />
  );

  if (href) {
    return <Link key={key} href={href}>{img}</Link>;
  }
  return img;
}

function buildButton(node, key) {
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
    align           = 'center',
  } = node.attrs || {};

  return (
    <Button
      key={key}
      href={href}
      style={{
        backgroundColor,
        color,
        borderRadius: `${borderRadius}px`,
        padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
        fontSize: `${fontSize}px`,
        fontWeight,
        textAlign: align,
        display: 'block',
      }}
    >
      {label}
    </Button>
  );
}

function buildDivider(node, key) {
  const { color = '#E5E7EB', thickness = 1, width = 100 } = node.attrs || {};

  return (
    <Hr
      key={key}
      style={{
        borderColor: color,
        borderTopWidth: `${thickness}px`,
        width: `${width}%`,
        margin: '16px auto',
      }}
    />
  );
}

function buildSpacer(node, key) {
  const { height = 24 } = node.attrs || {};
  return <Section key={key} style={{ padding: `${height}px 0 0 0`, margin: 0 }} />;
}

function buildColumns(node, theme, sharedBlocks, key) {
  const { ratio = '50-50' } = node.attrs || {};
  const ratioMap = {
    '50-50': ['50%', '50%'],
    '33-66': ['33%', '66%'],
    '66-33': ['66%', '33%'],
    '33-33-33': ['33.333%', '33.333%', '33.333%'],
  };
  const widths = ratioMap[ratio] || ['50%', '50%'];

  return (
    <Section key={key} className="email-columns-row">
      {widths.map((w, i) => (
        <Column key={i} style={{ width: w, verticalAlign: 'top', padding: '0 8px' }}>
          {buildNodes(node.content?.[i]?.content, theme, sharedBlocks)}
        </Column>
      ))}
    </Section>
  );
}

function buildSocialIcons(node, key) {
  const { icons = [] } = node.attrs || {};

  return (
    <Row key={key} style={{ textAlign: 'center', margin: '8px 0' }}>
      {icons.map((icon, i) => (
        <Link key={i} href={icon.href || '#'} style={{ display: 'inline-block', margin: '0 6px' }}>
          <Img
            src={icon.iconUrl || `https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${(icon.network || '').toLowerCase()}.svg`}
            alt={icon.network || ''}
            width="24"
            height="24"
          />
        </Link>
      ))}
    </Row>
  );
}

function buildBulletList(node, theme, key) {
  // Render a bullet list as a series of indented Text blocks.
  // Each listItem renders its paragraph children inline with a bullet prefix.
  const items = (node.content || []).map((item, i) => {
    const paragraphs = (item.content || []).flatMap(p => {
      const html = buildInlineHtml(p.content);
      return html ? [`• ${html}`] : [];
    });
    return paragraphs.join('<br />');
  }).filter(Boolean);

  if (items.length === 0) return null;

  return (
    <Text
      key={key}
      style={{ margin: '0 0 8px 0', paddingLeft: '16px', lineHeight: '1.6', fontSize: '16px' }}
      dangerouslySetInnerHTML={{ __html: items.join('<br />') }}
    />
  );
}

function buildListItem(node, theme, key) {
  // Individual listItem — rendered inline inside buildBulletList, but handle
  // standalone case defensively.
  const html = (node.content || [])
    .flatMap(p => (p.content ? [buildInlineHtml(p.content)] : []))
    .filter(Boolean)
    .join('<br />');

  return (
    <Text
      key={key}
      style={{ margin: '0 0 4px 0', paddingLeft: '16px', lineHeight: '1.6', fontSize: '16px' }}
      dangerouslySetInnerHTML={{ __html: `• ${html}` }}
    />
  );
}

function buildSharedInstance(node, theme, sharedBlocks, key) {
  const { sharedBlockId, snapshot } = node.attrs || {};
  const block = sharedBlocks.find(b => b.id === sharedBlockId);
  const doc   = block?.doc ?? snapshot;
  if (!doc) return null;
  const children = buildNodes(doc.content, theme, sharedBlocks);
  return <React.Fragment key={key}>{children}</React.Fragment>;
}

// ─── Inline HTML builder (used via dangerouslySetInnerHTML) ────────────────

function buildInlineHtml(nodes) {
  if (!nodes) return '';
  return nodes.map(buildInlineNodeHtml).join('');
}

function buildInlineNodeHtml(node) {
  if (node.type !== 'text') return '';
  let text = escapeHtml(node.text || '');

  if (node.marks) {
    for (const mark of node.marks) {
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
    }
  }
  return text;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Preserve {{ variable }} tokens
    .replace(/\{\{/g, '{{')
    .replace(/\}\}/g, '}}');
}
