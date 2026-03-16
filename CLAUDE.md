# MailDraft — Claude's Project Guide

> A fast, Notion-inspired email template editor built with React + Tiptap (ProseMirror).

---

## Project purpose

MailDraft lets users build **HTML email templates** using a block-based editor. Blocks map 1-to-1 with email-safe HTML constructs (images, buttons, dividers, spacers, columns, social icons). Templates are exported as self-contained HTML files or copied to clipboard.

---

## Tech stack

| Layer | Library / Tool |
|---|---|
| UI framework | React 18 + Vite |
| Editor engine | **Tiptap 2** (ProseMirror under the hood) |
| State management | **Zustand** — two stores (templates, shared blocks) |
| Routing | React Router v6 |
| Styling | CSS custom properties (`tokens.css`) + Tailwind utilities + inline styles |
| Drag & drop | Custom ProseMirror plugin (`DragHandle.js`) — `@dnd-kit` is installed but unused |

---

## Running the project

```bash
npm install
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # Production build
npm run preview    # Preview production build
```

---

## Directory map

```
src/
├── App.jsx                     # Router root: /, /blocks, /settings
├── main.jsx                    # ReactDOM entry
│
├── components/
│   ├── editor/
│   │   ├── EditorCanvas.jsx        # Scrollable white email card + editor mount
│   │   ├── EditorTopBar.jsx        # Template name, preview toggle, export
│   │   ├── BlockActionBar.jsx      # Floating ↑ ↓ 🗑 toolbar on block selection
│   │   ├── SlashMenu.jsx           # "/" command palette
│   │   ├── VariableMenu.jsx        # Ctrl+Shift+V variable inserter
│   │   └── PreviewPane.jsx         # Side panel: live HTML preview (desktop/mobile)
│   │
│   ├── panels/
│   │   ├── StylePanel.jsx          # Right-hand inspector (routes to sub-panels)
│   │   ├── ThemePanel.jsx          # Global theme (colors, fonts, max-width)
│   │   ├── ColumnsStylePanel.jsx   # Ratio picker for blockColumns
│   │   └── SharedBlockInfoPanel.jsx# Info + detach for sharedInstance blocks
│   │
│   ├── blocks/
│   │   ├── SharedBlocksPage.jsx    # /blocks route — block library grid
│   │   └── SharedBlockCard.jsx     # Individual block card with rename/delete/dupe
│   │
│   └── ui/
│       └── NavRail.jsx             # Fixed left sidebar with route links
│
├── extensions/                 # Every Tiptap/ProseMirror extension
│   ├── BlockImage.js
│   ├── BlockButton.js
│   ├── BlockDivider.js
│   ├── BlockSpacer.js
│   ├── BlockColumns.js         # + BlockColumn (child node)
│   ├── BlockColumnsView.jsx    # ReactNodeViewRenderer for columns
│   ├── BlockSocialIcons.js
│   ├── BlockSharedInstance.js
│   ├── SlashCommand.js         # ProseMirror Plugin — "/" command menu
│   └── DragHandle.js           # ProseMirror Plugin — Notion-style drag handle
│
├── hooks/
│   └── useEditor.js            # useEditor({content, onUpdate}) — wires all extensions
│
├── store/
│   ├── useTemplateStore.js     # Zustand: templates CRUD + active template
│   └── useSharedBlockStore.js  # Zustand: shared blocks CRUD
│
├── lib/
│   └── detachSharedBlock.js    # Helper: snapshot + detach sharedInstance node
│
└── styles/
    ├── tokens.css              # ALL CSS custom properties (single source of truth)
    └── global.css              # Tailwind directives, .tiptap styles, scrollbars
```

---

## Editor architecture

### How the editor works

1. `useEditor.js` calls Tiptap's `useEditor()` with all extensions registered.
2. `EditorCanvas.jsx` renders `<EditorContent editor={editor} />` inside a white card.
3. Custom blocks are **ProseMirror nodes** defined in `src/extensions/`.
4. The editor outputs JSON (`editor.getJSON()`) on every change; Zustand persists it.

### Two kinds of custom nodes

| Kind | Examples | Node view renderer |
|---|---|---|
| **Atomic block** | BlockImage, BlockButton, BlockDivider, BlockSpacer, BlockSocialIcons, BlockSharedInstance | Raw DOM (`addNodeView()` → `{ dom }`) |
| **Container block** | BlockColumns (with child BlockColumn) | React (`ReactNodeViewRenderer(BlockColumnsView)`) |

Atomic nodes have `atom: true, selectable: true` — clicking selects the whole node (NodeSelection), which is what `BlockActionBar` checks for.

### Block positions in ProseMirror

- `doc` is depth 0. Every direct child is depth 1.
- `$pos.before(1)` = position of the top-level block containing the cursor.
- `node.nodeSize` = 2 + content size for block nodes; 1 for inline leaves.
- To move a block: `tr.delete(from, from + node.nodeSize)` then `tr.insert(adjustedPos, node)`.
- When inserting AFTER the deleted range, subtract `node.nodeSize` from the target position.

---

## Design system

All design tokens live in `src/styles/tokens.css` — **never hardcode raw colours or sizes**.

### Key variables

```css
/* Colours */
--color-ink          /* #1a1a2e — primary text */
--color-slate        /* mid-tone text */
--color-muted        /* placeholder / secondary text */
--color-ghost        /* subtle bg (hover, code bg) */
--color-border       /* dividers */
--color-accent       /* indigo — links, buttons, focus rings */
--color-accent-hover
--color-accent-light
--color-accent-soft  /* very light accent bg */
--color-white
--color-preview-bg   /* canvas outer background */

/* Typography */
--font-sans          /* Inter */
--font-mono          /* JetBrains Mono */
--text-xs … --text-2xl

/* Spacing (4 px base) */
--space-1 (4px) … --space-16 (64px)

/* Border radius */
--radius-sm (4px) … --radius-xl (12px)

/* Shadows */
--shadow-sm  --shadow-md  --shadow-canvas

/* Layout */
--nav-width: 240px
--panel-width: 320px
--canvas-max: 680px
```

### Notion-philosophy rules

- **White space first** — padding is generous, layouts never feel cramped.
- **Subtle over loud** — hover states use `rgba(55,53,47,0.08)`, not bold fills.
- **Consistent radii** — use the token scale, not arbitrary `px` values.
- **No breaking UI** — every interactive element must have defined hover, active, and disabled states.

---

## Drag handle (DragHandle.js)

Notion-style block dragging implemented as a pure ProseMirror Plugin.

### States

| State | What happens |
|---|---|
| Hover over any block | Six-dot grip fades in 28 px left of content |
| Hover the grip | Pill background `rgba(55,53,47,0.08)`, dots darken |
| Grab (dragstart) | Block ghost at 75% opacity + card shadow; blue drop line appears |
| Drag over editor | 2 px blue line + dot shows exact insertion point |
| Drop | ProseMirror transaction moves block; all chrome disappears |
| Cancel / dragend | `dm-dragging` class removed from body; handle fades out |

### How it intercepts ProseMirror's default drop

`handleDOMEvents.drop` returns `true` → ProseMirror's clipboard-paste handler never fires on our custom `application/x-dm-drag` MIME type drag.

---

## Zustand stores

### `useTemplateStore`

```js
{ templates, activeId }
// Actions: createTemplate, updateTemplate, deleteTemplate, setActive, updateContent
```

### `useSharedBlockStore`

```js
{ blocks }
// Actions: createBlock, updateBlock, deleteBlock, duplicateBlock
// Each block: { id, name, content (TipTap JSON), createdAt }
```

---

## Slash command menu (SlashCommand.js)

Triggered by typing `/` at the start of an empty line. Implemented as a ProseMirror Plugin with its own PluginKey. The menu component (`SlashMenu.jsx`) reads the plugin state and renders a floating list. Commands are defined in the `COMMANDS` array inside `SlashMenu.jsx`.

To add a new slash command:
1. Add an entry to `COMMANDS` in `SlashMenu.jsx`.
2. Ensure the corresponding Tiptap extension is registered in `useEditor.js`.

---

## Adding a new block type

1. **Create `src/extensions/BlockFoo.js`**
   - `Node.create({ name: 'blockFoo', group: 'block', atom: true, ... })`
   - Define `addAttributes()`, `parseHTML()`, `renderHTML()`, `addNodeView()`

2. **Register in `useEditor.js`**
   - Import and add to the `extensions` array.

3. **Add a slash command entry** in `SlashMenu.jsx` `COMMANDS` array.

4. **Add to `BLOCK_NODE_TYPES`** in `BlockActionBar.jsx` so the toolbar appears on selection.

5. **Add a style panel** in `src/components/panels/` if the block has configurable attributes, and route to it in `StylePanel.jsx`.

---

## Key patterns

### ProseMirror transaction pattern (move blocks)

```js
const node    = view.state.doc.nodeAt(from);
const insertAt = to > from ? to - node.nodeSize : to;
const tr = view.state.tr;
tr.delete(from, from + node.nodeSize);
tr.insert(insertAt, node);
view.dispatch(tr);
```

### NodeSelection on an atomic block

```js
import { NodeSelection } from 'prosemirror-state';
const sel = NodeSelection.create(editor.state.doc, nodePos);
editor.view.dispatch(editor.state.tr.setSelection(sel));
```

### Reading selected block in a component

```js
const { selection } = editor.state;
const node = selection?.node;          // only set for NodeSelection
if (!node || !BLOCK_NODE_TYPES.includes(node.type.name)) return null;
```

### Updating a block's attributes

```js
editor.chain().focus().updateAttributes('blockFoo', { color: '#ff0000' }).run();
```

---

## HTML export

`EditorTopBar.jsx` exports HTML via `editor.getHTML()`. The email HTML is inline-styled by each block's `renderHTML()` / `addNodeView()` method — there is no separate render pipeline.

---

## Things to keep in mind

- **Do not use `@dnd-kit`** for editor block reordering — the custom `DragHandle.js` ProseMirror plugin handles this correctly with ProseMirror's transaction model.
- **Never hardcode `#hex` colours** for UI chrome — use `--color-*` tokens.
- **Atomic nodes** use raw DOM node views (not React) for performance — keep them as simple DOM construction.
- **BlockColumns** is the only block using `ReactNodeViewRenderer` because its columns need interactive React state.
- The editor's `padding: '32px 40px'` on `<EditorContent>` stacks with `.tiptap { padding: 32px 24px }` from `global.css` — total canvas padding is `64px` top/bottom, `64px` left/right.
- `posAtCoords({ left, top })` returns `{ pos, inside }` — `inside` is `>= 0` for atomic nodes and gives the atom's start position directly.
