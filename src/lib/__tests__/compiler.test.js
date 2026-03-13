import { describe, it, expect } from 'vitest';
import { render } from '@react-email/render';
import { resolveVariables, mergeVariables } from '../variableResolver.js';
import { buildEmailTree } from '../serializer.jsx';

// ── Shared defaults ──────────────────────────────────────────────────────────
const DEFAULT_THEME = {
  fontFamily: 'Inter, sans-serif',
  bodyFontSize: 14,
  backgroundColor: '#ffffff',
};

// ────────────────────────────────────────────────────────────────────────────
// resolveVariables
// ────────────────────────────────────────────────────────────────────────────
describe('resolveVariables', () => {
  it('replaces a simple token with its fallback', () => {
    const result = resolveVariables(
      'Hello {{ first_name }}!',
      [{ name: 'first_name', fallback: 'there' }],
    );
    expect(result).toBe('Hello there!');
  });

  it('is tolerant of extra whitespace inside {{ }}', () => {
    const result = resolveVariables(
      'Hi {{  first_name  }}, welcome.',
      [{ name: 'first_name', fallback: 'Alice' }],
    );
    expect(result).toBe('Hi Alice, welcome.');
  });

  it('replaces multiple occurrences of the same token', () => {
    const result = resolveVariables(
      '{{ x }} and {{ x }}',
      [{ name: 'x', fallback: 'hello' }],
    );
    expect(result).toBe('hello and hello');
  });

  it('replaces multiple distinct tokens', () => {
    const result = resolveVariables(
      '{{ greeting }}, {{ name }}!',
      [
        { name: 'greeting', fallback: 'Hi' },
        { name: 'name', fallback: 'Bob' },
      ],
    );
    expect(result).toBe('Hi, Bob!');
  });

  it('uses empty string when fallback is missing', () => {
    const result = resolveVariables(
      'Value: {{ empty }}',
      [{ name: 'empty' }],
    );
    expect(result).toBe('Value: ');
  });

  it('leaves unknown tokens unchanged', () => {
    const result = resolveVariables(
      '{{ unknown }}',
      [{ name: 'other', fallback: 'x' }],
    );
    expect(result).toBe('{{ unknown }}');
  });

  it('returns empty string for empty html', () => {
    expect(resolveVariables('', [])).toBe('');
    expect(resolveVariables(null, [])).toBe('');
  });

  it('returns html unchanged when variables list is empty', () => {
    expect(resolveVariables('Hello {{ name }}', [])).toBe('Hello {{ name }}');
  });

  it('safely handles variable names with regex metacharacters', () => {
    const result = resolveVariables(
      'Val: {{ price.usd }}',
      [{ name: 'price.usd', fallback: '$9.99' }],
    );
    expect(result).toBe('Val: $9.99');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// mergeVariables
// ────────────────────────────────────────────────────────────────────────────
describe('mergeVariables', () => {
  it('returns template vars when no globals', () => {
    const merged = mergeVariables(
      [{ name: 'a', fallback: 'template' }],
      [],
    );
    expect(merged).toEqual([{ name: 'a', fallback: 'template' }]);
  });

  it('returns global vars when no template vars', () => {
    const merged = mergeVariables(
      [],
      [{ name: 'g', fallback: 'global' }],
    );
    expect(merged).toEqual([{ name: 'g', fallback: 'global' }]);
  });

  it('template variables take priority over globals', () => {
    const merged = mergeVariables(
      [{ name: 'color', fallback: 'blue' }],
      [{ name: 'color', fallback: 'red' }],
    );
    expect(merged).toHaveLength(1);
    expect(merged[0].fallback).toBe('blue');
  });

  it('merges non-overlapping variables from both sources', () => {
    const merged = mergeVariables(
      [{ name: 't1', fallback: 'T' }],
      [{ name: 'g1', fallback: 'G' }],
    );
    expect(merged).toHaveLength(2);
    const names = merged.map(v => v.name);
    expect(names).toContain('t1');
    expect(names).toContain('g1');
  });

  it('handles null/undefined gracefully', () => {
    expect(() => mergeVariables(null, null)).not.toThrow();
    expect(mergeVariables(null, null)).toEqual([]);
  });

  it('skips entries without a name', () => {
    const merged = mergeVariables(
      [{ fallback: 'no-name' }, { name: 'valid', fallback: 'ok' }],
      [],
    );
    expect(merged).toEqual([{ name: 'valid', fallback: 'ok' }]);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// buildEmailTree + render
// ────────────────────────────────────────────────────────────────────────────
describe('buildEmailTree + render', () => {
  it('renders a valid HTML document for an empty doc', async () => {
    const doc = { type: 'doc', content: [] };
    const html = await render(buildEmailTree(doc, DEFAULT_THEME));
    expect(typeof html).toBe('string');
    expect(html).toContain('<!DOCTYPE html');
  });

  it('includes the theme background colour in the output', async () => {
    const doc = { type: 'doc', content: [] };
    const html = await render(buildEmailTree(doc, { ...DEFAULT_THEME, backgroundColor: '#123456' }));
    expect(html).toContain('#123456');
  });

  it('serializes a paragraph node into rendered HTML', async () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    };
    const html = await render(buildEmailTree(doc, DEFAULT_THEME));
    expect(html).toContain('Hello world');
  });

  it('serializes a heading node with correct font size', async () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Big Title' }],
        },
      ],
    };
    const html = await render(buildEmailTree(doc, DEFAULT_THEME));
    expect(html).toContain('Big Title');
    expect(html).toContain('32px');
  });

  it('serializes a button node with label and href', async () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'blockButton',
          attrs: { label: 'Click me', href: 'https://example.com' },
        },
      ],
    };
    const html = await render(buildEmailTree(doc, DEFAULT_THEME));
    expect(html).toContain('Click me');
    expect(html).toContain('https://example.com');
  });

  it('applies theme fontFamily in the output', async () => {
    const doc = { type: 'doc', content: [] };
    const html = await render(buildEmailTree(doc, { ...DEFAULT_THEME, fontFamily: 'Georgia' }));
    expect(html).toContain('Georgia');
  });

  it('preserves {{ variable }} tokens without escaping', async () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [{ type: 'text', text: 'Hi {{ first_name }}' }],
        },
      ],
    };
    const html = await render(buildEmailTree(doc, DEFAULT_THEME));
    expect(html).toContain('{{ first_name }}');
  });

  it('handles null/empty doc without throwing', async () => {
    await expect(render(buildEmailTree(null, DEFAULT_THEME))).resolves.toBeTruthy();
    await expect(render(buildEmailTree({ type: 'doc', content: [] }, DEFAULT_THEME))).resolves.toBeTruthy();
  });

  it('bold marks produce <strong> tags in output', async () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: {},
          content: [
            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
          ],
        },
      ],
    };
    const html = await render(buildEmailTree(doc, DEFAULT_THEME));
    expect(html).toContain('<strong>bold</strong>');
  });

  it('resolves sharedInstance nodes from sharedBlocks', async () => {
    const sharedBlocks = [
      {
        id: 'block-1',
        doc: {
          content: [
            {
              type: 'paragraph',
              attrs: {},
              content: [{ type: 'text', text: 'Shared footer text' }],
            },
          ],
        },
      },
    ];
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'sharedInstance',
          attrs: { sharedBlockId: 'block-1' },
        },
      ],
    };
    const html = await render(buildEmailTree(doc, DEFAULT_THEME, sharedBlocks));
    expect(html).toContain('Shared footer text');
  });
});
