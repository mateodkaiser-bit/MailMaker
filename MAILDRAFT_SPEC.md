# MailDraft — Product & Architecture Spec

## Overview

MailDraft is a browser-based email template builder. Users compose emails visually using a block-based TipTap editor, preview them rendered as real HTML, manage reusable shared blocks, and export finished HTML for use in any ESP.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 |
| Editor | TipTap (ProseMirror-based) |
| State management | Zustand |
| Routing | React Router v6 |
| Email rendering | **@react-email/components** + **@react-email/render** |
| Compilation worker | **comlink** (Comlink-wrapped Web Worker) |
| Build tool | Vite |
| Tests | Vitest |
| Styling | CSS variables (global) + inline styles |

---

## Compilation Pipeline

Compilation is fully off the main thread via a module Web Worker.

```
TipTap doc JSON
      │
      ▼ (300 ms debounce)
useCompiler(doc, theme)
      │  calls getSharedBlocks() from storage
      │
      ▼
compiler.worker.js  (Comlink worker, type: module)
      │  expose({ compile(doc, theme, sharedBlocks) })
      │
      ▼
buildEmailTree(doc, theme, sharedBlocks)   ← serializer.jsx
      │  returns React element tree
      │
      ▼
render(tree)   ← @react-email/render
      │  returns full HTML string
      │
      ▼
{ html, error, isCompiling }   ← useCompiler return value
```

### Key files

| File | Role |
|---|---|
| `src/lib/serializer.jsx` | `buildEmailTree(doc, theme, sharedBlocks)` → React element tree |
| `src/workers/compiler.worker.js` | Comlink-exposed `compile()` — calls `buildEmailTree` + `render` |
| `src/hooks/useCompiler.js` | Debounced hook; lazily creates worker via `getCompilerApi()`; returns `{ html, mjml: '', error, isCompiling }` |

### Block → React Email component mapping

| TipTap node type | React Email output |
|---|---|
| `paragraph` | `<Text dangerouslySetInnerHTML>` |
| `heading` | `<Text>` with level-appropriate `fontSize` / `fontWeight` |
| `blockImage` | `<Img>` (wrapped in `<Link>` when `href` present) |
| `blockButton` | `<Button>` |
| `blockDivider` | `<Hr>` |
| `blockSpacer` | `<Section>` with top padding |
| `blockColumns` | `<Section>` + two `<Column>` children (ratio-based widths) |
| `blockSocialIcons` | `<Row>` of `<Link>` + `<Img>` |
| `sharedInstance` | `<React.Fragment>` wrapping resolved shared-block nodes |

### Inline marks (via `buildInlineHtml`)

Text content is serialised to an HTML string and injected with `dangerouslySetInnerHTML`.

| TipTap mark | HTML |
|---|---|
| `bold` | `<strong>` |
| `italic` | `<em>` |
| `underline` | `<u>` |
| `code` | `<code>` |
| `link` | `<a href="…">` |
| `textStyle` (color) | `<span style="color:…">` |

HTML-special characters are escaped via `escapeHtml()`. `{{ variable }}` tokens are preserved through the escape pass.

---

## Block Model

All content is represented as a TipTap document (ProseMirror JSON). Top-level nodes are "blocks"; inline content lives inside `paragraph` / `heading` nodes.

### Shared Blocks

A shared block is a reusable fragment (e.g. a footer). It is stored independently and referenced by `sharedInstance` nodes via `sharedBlockId`. At compile time, `buildEmailTree` resolves shared block content from the `sharedBlocks` array passed in — no direct storage access inside the serializer.

Fallback: if the live block is not found, `snapshot` (stored on the node) is used.

---

## PreviewPane

- No iframe. The compiled HTML is rendered into a `<div dangerouslySetInnerHTML>`.
- A `ResizeObserver` on the pane container computes a CSS `scale()` transform to fit the email (600 px logical width for desktop, 375 px for mobile) within the available pane width.
- The outer wrapper is sized to `targetWidth × scale` so that scroll behavior is correct.
- Toggling "{{ }} Tokens" / "✓ Preview" mode runs `resolveVariables()` over the HTML before display.

---

## Variable System

Templates and the global account settings each carry a `variables` array of `{ name, fallback }` objects. `mergeVariables(templateVars, globalVars)` produces a merged list (template takes priority on collision). `resolveVariables(html, vars)` substitutes `{{ name }}` tokens with fallback values.

---

## Export

`EditorTopBar` provides:
- **Copy HTML** — copies the compiled HTML string to the clipboard.
- **Download .html** — triggers a `Blob` download of the HTML file.

MJML export has been removed. The compilation target is React Email / HTML only.

---

## State & Persistence

- Templates are stored in Zustand with `localStorage` persistence via `zustand/middleware/persist`.
- Shared blocks are stored separately in `localStorage` via helpers in `src/lib/storage.js`.
- Settings (default theme, global variables) are a separate Zustand slice.

---

## Testing

Test entry: `src/lib/__tests__/compiler.test.js`

Covers:
- `resolveVariables` — token substitution, edge cases
- `mergeVariables` — priority and null handling
- `buildEmailTree` + `render` — HTML output correctness (paragraph, heading, button, sharedInstance, theme properties, variable token passthrough, bold marks)

No mocks required: `serializer.jsx` has no storage dependency; `sharedBlocks` are passed as a parameter.

Run tests: `npm test`
