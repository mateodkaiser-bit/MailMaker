#!/usr/bin/env node
/**
 * convert-emails.mjs
 *
 * Parses every React Email JSX file in emails/ using Babel,
 * walks the AST to build the block-array format used by MailDraft,
 * and writes `src/lib/swarmedTemplates.js`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';

const traverse = _traverse.default || _traverse;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMAILS_DIR = path.join(__dirname, '..', 'emails');
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'swarmedTemplates.js');

// ─── Helpers ──────────────────────────────────────────────────────────────────

let blockIdCounter = 0;
function nextId() {
  return `seed_${++blockIdCounter}`;
}

function titleCase(str) {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Resolve JSX attribute values ─────────────────────────────────────────────

/**
 * Given the function's default params, resolve an expression to a string.
 */
function resolveExpr(node, defaults) {
  if (!node) return '';

  // String literal
  if (t.isStringLiteral(node)) return node.value;

  // Template literal — concatenate quasis + resolved expressions
  if (t.isTemplateLiteral(node)) {
    let result = '';
    for (let i = 0; i < node.quasis.length; i++) {
      result += node.quasis[i].value.cooked || node.quasis[i].value.raw || '';
      if (i < node.expressions.length) {
        result += resolveExpr(node.expressions[i], defaults);
      }
    }
    return result;
  }

  // Identifier — look up in defaults
  if (t.isIdentifier(node)) {
    return defaults[node.name] ?? `{{ ${node.name} }}`;
  }

  // NumericLiteral
  if (t.isNumericLiteral(node)) return String(node.value);

  // BooleanLiteral
  if (t.isBooleanLiteral(node)) return node.value;

  // UnaryExpression (e.g. -1)
  if (t.isUnaryExpression(node) && node.operator === '-' && t.isNumericLiteral(node.argument)) {
    return -node.argument.value;
  }

  return '';
}

/**
 * Extract default prop values from the function's parameter destructuring.
 */
function extractDefaults(funcNode) {
  const defaults = {};
  const params = funcNode.params || [];

  for (const param of params) {
    let pattern = param;

    // Handle default value: (pattern = {})
    if (t.isAssignmentPattern(param)) {
      pattern = param.left;
    }

    if (t.isObjectPattern(pattern)) {
      for (const prop of pattern.properties) {
        if (t.isObjectProperty(prop) && t.isAssignmentPattern(prop.value)) {
          const key = t.isIdentifier(prop.key) ? prop.key.name : '';
          const val = prop.value.right;
          if (t.isStringLiteral(val)) defaults[key] = val.value;
          else if (t.isNumericLiteral(val)) defaults[key] = String(val.value);
          else if (t.isTemplateLiteral(val)) defaults[key] = resolveExpr(val, defaults);
        }
      }
    }
  }

  return defaults;
}

// ─── JSX Attribute helpers ────────────────────────────────────────────────────

function getJSXAttr(openingElement, name) {
  if (!openingElement?.attributes) return undefined;
  for (const attr of openingElement.attributes) {
    if (t.isJSXAttribute(attr) && attr.name?.name === name) {
      return attr;
    }
  }
  return undefined;
}

function getJSXAttrValue(openingElement, name, defaults) {
  const attr = getJSXAttr(openingElement, name);
  if (!attr) return undefined;

  // Boolean attribute: <Foo bar /> means true
  if (!attr.value) return true;

  // String literal: <Foo bar="hello" />
  if (t.isStringLiteral(attr.value)) return attr.value.value;

  // Expression container: <Foo bar={expr} />
  if (t.isJSXExpressionContainer(attr.value)) {
    return resolveExpr(attr.value.expression, defaults);
  }

  return undefined;
}

/**
 * Extract a style object from inline JSX style={{...}} attribute.
 */
function getStyleAttr(openingElement, defaults) {
  const attr = getJSXAttr(openingElement, 'style');
  if (!attr || !t.isJSXExpressionContainer(attr.value)) return {};

  const expr = attr.value.expression;
  if (!t.isObjectExpression(expr)) return {};

  const style = {};
  for (const prop of expr.properties) {
    if (t.isObjectProperty(prop)) {
      const key = t.isIdentifier(prop.key) ? prop.key.name : (t.isStringLiteral(prop.key) ? prop.key.value : '');
      const val = resolveExpr(prop.value, defaults);
      if (key) style[key] = val;
    }
  }
  return style;
}

/**
 * Extract the __html value from dangerouslySetInnerHTML={{ __html: ... }}
 */
function getDangerousHtml(openingElement, defaults) {
  const attr = getJSXAttr(openingElement, 'dangerouslySetInnerHTML');
  if (!attr || !t.isJSXExpressionContainer(attr.value)) return null;

  const expr = attr.value.expression;
  if (!t.isObjectExpression(expr)) return null;

  for (const prop of expr.properties) {
    if (t.isObjectProperty(prop)) {
      const key = t.isIdentifier(prop.key) ? prop.key.name : '';
      if (key === '__html') {
        return resolveExpr(prop.value, defaults);
      }
    }
  }
  return null;
}

// ─── Get JSX element name ─────────────────────────────────────────────────────

function getElementName(jsxElement) {
  const name = jsxElement.openingElement?.name;
  if (t.isJSXIdentifier(name)) return name.name;
  return '';
}

function getChildren(jsxElement) {
  return (jsxElement.children || []).filter(
    c => t.isJSXElement(c) || (t.isJSXExpressionContainer(c) && t.isJSXElement(c.expression))
  ).map(c => t.isJSXExpressionContainer(c) ? c.expression : c);
}

// ─── Convert JSX element tree to blocks ───────────────────────────────────────

function convertElement(el, defaults) {
  const name = getElementName(el);
  const open = el.openingElement;

  switch (name) {
    case 'Img': {
      // Check if parent is a Link (handled at Link level)
      const src = getJSXAttrValue(open, 'src', defaults) || '';
      const alt = getJSXAttrValue(open, 'alt', defaults) || '';
      let width = getJSXAttrValue(open, 'width', defaults) || '100%';
      // Strip 'px' suffix
      if (typeof width === 'string' && width.endsWith('px')) {
        const num = parseInt(width, 10);
        if (!isNaN(num)) width = num;
      }
      const style = getStyleAttr(open, defaults);
      const align = style.margin === '0 auto' ? 'center' : 'left';

      return [{
        id: nextId(),
        type: 'image',
        attrs: { src, alt, width, align, href: null },
      }];
    }

    case 'Link': {
      const href = getJSXAttrValue(open, 'href', defaults) || '#';
      const children = getChildren(el);

      // Link wrapping an Img → image with href
      if (children.length === 1 && getElementName(children[0]) === 'Img') {
        const imgBlocks = convertElement(children[0], defaults);
        if (imgBlocks.length > 0) {
          imgBlocks[0].attrs.href = href;
        }
        return imgBlocks;
      }

      // Otherwise, process children normally
      const blocks = [];
      for (const child of children) {
        blocks.push(...convertElement(child, defaults));
      }
      return blocks;
    }

    case 'Text': {
      const html = getDangerousHtml(open, defaults);
      const style = getStyleAttr(open, defaults);

      // Determine if heading or paragraph based on fontSize + fontWeight
      const fontSize = style.fontSize || '16px';
      const fontWeight = style.fontWeight;
      const isHeading = (fontWeight && Number(fontWeight) >= 600) &&
        (fontSize === '20px' || fontSize === '24px' || fontSize === '32px');

      if (isHeading) {
        const level = fontSize === '32px' ? 1 : fontSize === '24px' ? 2 : 3;
        return [{
          id: nextId(),
          type: 'heading',
          html: html || '',
          attrs: { level, textAlign: style.textAlign || 'left' },
        }];
      }

      return [{
        id: nextId(),
        type: 'paragraph',
        html: html || '',
        attrs: { textAlign: style.textAlign || 'left' },
      }];
    }

    case 'Button': {
      const href = getJSXAttrValue(open, 'href', defaults) || '#';
      const style = getStyleAttr(open, defaults);

      // Get button label from children (text content)
      let label = '';
      for (const child of (el.children || [])) {
        if (t.isJSXText(child)) {
          label += child.value.trim();
        } else if (t.isJSXExpressionContainer(child)) {
          label += resolveExpr(child.expression, defaults);
        }
      }
      if (!label) label = 'Click here';

      const backgroundColor = style.backgroundColor || '#D97706';
      const color = style.color || '#ffffff';
      let borderRadius = 6;
      if (style.borderRadius) {
        const br = parseInt(String(style.borderRadius), 10);
        if (!isNaN(br)) borderRadius = br;
      }

      // Parse padding
      let paddingTop = 12, paddingRight = 24, paddingBottom = 12, paddingLeft = 24;
      if (style.padding) {
        const parts = String(style.padding).split(/\s+/).map(s => parseInt(s, 10));
        if (parts.length === 4) {
          [paddingTop, paddingRight, paddingBottom, paddingLeft] = parts;
        } else if (parts.length === 2) {
          paddingTop = paddingBottom = parts[0];
          paddingRight = paddingLeft = parts[1];
        } else if (parts.length === 1) {
          paddingTop = paddingRight = paddingBottom = paddingLeft = parts[0];
        }
      }

      let fontSize = 14;
      if (style.fontSize) {
        const fs = parseInt(String(style.fontSize), 10);
        if (!isNaN(fs)) fontSize = fs;
      }

      const fontWeight = Number(style.fontWeight) || 600;

      return [{
        id: nextId(),
        type: 'button',
        attrs: {
          label, href, backgroundColor, color,
          borderRadius, paddingTop, paddingBottom, paddingLeft, paddingRight,
          fontSize, fontWeight, fullWidth: false, align: 'center',
        },
      }];
    }

    case 'Hr': {
      const style = getStyleAttr(open, defaults);
      const color = style.borderColor || '#E5E7EB';
      let thickness = 1;
      if (style.borderTopWidth) {
        const tw = parseInt(String(style.borderTopWidth), 10);
        if (!isNaN(tw)) thickness = tw;
      }
      let width = 100;
      if (style.width && String(style.width).endsWith('%')) {
        const w = parseInt(String(style.width), 10);
        if (!isNaN(w)) width = w;
      }

      return [{
        id: nextId(),
        type: 'divider',
        attrs: { color, thickness, width },
      }];
    }

    case 'Section': {
      const children = getChildren(el);
      const style = getStyleAttr(open, defaults);

      // Empty section with padding → spacer
      if (children.length === 0) {
        let height = 24;
        if (style.padding) {
          // Parse first value from padding string
          const match = String(style.padding).match(/(\d+)/);
          if (match) height = parseInt(match[1], 10);
        }
        return [{
          id: nextId(),
          type: 'spacer',
          attrs: { height },
        }];
      }

      // Section with Column children → columns block
      const columnChildren = children.filter(c => getElementName(c) === 'Column');
      if (columnChildren.length >= 2) {
        return convertColumnsSection(columnChildren, defaults);
      }

      // Section with non-Column children → just process children
      const blocks = [];
      for (const child of children) {
        blocks.push(...convertElement(child, defaults));
      }
      return blocks;
    }

    case 'Column': {
      // Should be handled by Section, but process children if standalone
      const blocks = [];
      for (const child of getChildren(el)) {
        blocks.push(...convertElement(child, defaults));
      }
      return blocks;
    }

    case 'Row': {
      const children = getChildren(el);

      // Check if this is a social icons row (contains Link>Img pairs)
      const isSocialRow = children.every(c => {
        const name = getElementName(c);
        if (name === 'Link') {
          const linkChildren = getChildren(c);
          return linkChildren.length === 1 && getElementName(linkChildren[0]) === 'Img';
        }
        return false;
      });

      if (isSocialRow && children.length > 0) {
        const icons = children.map(link => {
          const href = getJSXAttrValue(link.openingElement, 'href', defaults) || '#';
          const img = getChildren(link)[0];
          const alt = getJSXAttrValue(img.openingElement, 'alt', defaults) || '';
          const src = getJSXAttrValue(img.openingElement, 'src', defaults) || '';

          // Determine network from alt or src
          let network = alt || '';
          if (!network && src) {
            if (src.includes('instagram')) network = 'instagram';
            else if (src.includes('facebook')) network = 'facebook';
            else if (src.includes('twitter') || src.includes('x_32px')) network = 'twitter';
            else if (src.includes('linkedin')) network = 'linkedin';
            else if (src.includes('youtube')) network = 'youtube';
          }

          return { href, network, iconUrl: src };
        });

        return [{
          id: nextId(),
          type: 'socialIcons',
          attrs: { icons },
        }];
      }

      // Otherwise process children normally
      const blocks = [];
      for (const child of children) {
        blocks.push(...convertElement(child, defaults));
      }
      return blocks;
    }

    // Skip these wrapper elements, process their children
    case 'Html':
    case 'Head':
    case 'Body':
    case 'Container':
    case 'Font': {
      const blocks = [];
      for (const child of getChildren(el)) {
        blocks.push(...convertElement(child, defaults));
      }
      return blocks;
    }

    default:
      return [];
  }
}

function convertColumnsSection(columnElements, defaults) {
  // Determine ratio from column widths
  const widths = columnElements.map(col => {
    const style = getStyleAttr(col.openingElement, defaults);
    const w = getJSXAttrValue(col.openingElement, 'width', defaults) || style.width || '50%';
    return String(w);
  });

  let ratio = '50-50';
  if (widths.length === 3) {
    ratio = '33-33-33';
  } else if (widths.length === 2) {
    const w1 = parseInt(widths[0], 10);
    if (w1 <= 35) ratio = '33-66';
    else if (w1 >= 65) ratio = '66-33';
    else ratio = '50-50';
  }

  const columns = columnElements.map(col => {
    const children = getChildren(col);
    const blocks = [];
    for (const child of children) {
      blocks.push(...convertElement(child, defaults));
    }
    // Ensure at least one block per column
    if (blocks.length === 0) {
      blocks.push({ id: nextId(), type: 'paragraph', html: '', attrs: { textAlign: 'left' } });
    }
    return blocks;
  });

  return [{
    id: nextId(),
    type: 'columns',
    attrs: { ratio },
    columns,
  }];
}

// ─── Process a single JSX file ────────────────────────────────────────────────

function processFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf-8');

  // Fix invalid JS: function names starting with a digit (e.g. 24HoursNo...)
  code = code.replace(/export default function (\d\w+)/g, (_, name) => {
    return `export default function _${name}`;
  });

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  let subject = '';
  let defaults = {};
  let returnJSX = null;

  traverse(ast, {
    // Find `export const subject = "..."`
    ExportNamedDeclaration(path) {
      const decl = path.node.declaration;
      if (t.isVariableDeclaration(decl)) {
        for (const d of decl.declarations) {
          if (t.isIdentifier(d.id) && d.id.name === 'subject' && t.isStringLiteral(d.init)) {
            subject = d.init.value;
          }
        }
      }
    },

    // Find the default export function and extract defaults + return JSX
    ExportDefaultDeclaration(path) {
      const decl = path.node.declaration;
      let funcNode = null;

      if (t.isFunctionDeclaration(decl)) {
        funcNode = decl;
      } else if (t.isIdentifier(decl)) {
        // Find the function in the file
        const binding = path.scope.getBinding(decl.name);
        if (binding && t.isFunctionDeclaration(binding.path.node)) {
          funcNode = binding.path.node;
        }
      }

      if (funcNode) {
        defaults = extractDefaults(funcNode);

        // Find the return statement with JSX
        path.traverse({
          ReturnStatement(retPath) {
            const arg = retPath.node.argument;
            if (t.isJSXElement(arg)) {
              returnJSX = arg;
            } else if (t.isParenthesizedExpression(arg) && t.isJSXElement(arg.expression)) {
              returnJSX = arg.expression;
            }
          },
        });
      }
    },
  });

  if (!returnJSX) {
    console.warn(`  SKIP: No JSX return found in ${path.basename(filePath)}`);
    return null;
  }

  const blocks = convertElement(returnJSX, defaults);

  return {
    name: subject || titleCase(path.basename(filePath, '.jsx')),
    blocks,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const files = fs.readdirSync(EMAILS_DIR)
    .filter(f => f.endsWith('.jsx'))
    .sort();

  console.log(`Found ${files.length} email files to convert.\n`);

  const templates = [];

  for (const file of files) {
    blockIdCounter = 0; // Reset per file for clean IDs
    const filePath = path.join(EMAILS_DIR, file);
    console.log(`Processing: ${file}`);

    try {
      const result = processFile(filePath);
      if (result && result.blocks.length > 0) {
        templates.push({
          fileName: file,
          name: result.name,
          blocks: result.blocks,
        });
        console.log(`  → ${result.blocks.length} blocks`);
      }
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
    }
  }

  console.log(`\nConverted ${templates.length} templates.`);

  // Write output
  const output = `// Auto-generated by scripts/convert-emails.mjs — do not edit manually.
// Run: node scripts/convert-emails.mjs

export const SWARMED_TEMPLATES = ${JSON.stringify(templates, null, 2)};
`;

  fs.writeFileSync(OUT_FILE, output, 'utf-8');
  console.log(`\nWrote: ${OUT_FILE}`);
}

main();
