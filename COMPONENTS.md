# MailDraft — Component Map

> Auto-generated for Lovable handoff. All components are Phase 1 scope.

---

## Entry Points

| File | Role |
|------|------|
| `src/main.jsx` | ReactDOM entry — mounts `<App />` in StrictMode, imports global CSS |
| `src/App.jsx` | Root — `RouterProvider` + `ToastContainer` |
| `src/router.jsx` | React Router v6 `createBrowserRouter` with 5 routes |

### Routes

| Path | Component |
|------|-----------|
| `/` | `pages/HomePage` |
| `/editor/:id` | `pages/EditorPage` |
| `/blocks` | `components/blocks/SharedBlocksPage` |
| `/blocks/:id` | `components/blocks/SharedBlockEditor` |
| `/settings` | `components/settings/SettingsPage` |

---

## Pages

### `src/pages/HomePage.jsx`
Top-level home screen. Renders NavRail + TemplateGrid. Handles template creation (from blank, starter, or existing), deletion, duplication, and rename via modal.

**Props:** none
**State:** search string, modal state
**Stores:** `useTemplateStore`

---

### `src/pages/EditorPage.jsx`
Full 3-panel email editor. Top bar + canvas/preview area + right style panel.

**Props:** none (reads `:id` from URL params)
**State:** `theme`, `doc`, `previewOpen`
**Stores:** `useTemplateStore`, `useSettingsStore`
**Hooks:** `useEditor`, `useCompiler`
**Auto-saves** on every doc/theme change via `updateTemplate`

---

## Blocks

### `src/components/blocks/SharedBlocksPage.jsx`
Route `/blocks`. Grid of saved reusable blocks. Search, create, duplicate, rename, delete.

**Props:** none
**Stores:** `useSharedBlockStore`, `useTemplateStore`

---

### `src/components/blocks/SharedBlockCard.jsx`
Card for a single shared block. Shows name, usage count, hover Edit overlay, three-dot menu (Rename / Duplicate / Delete). Two-step delete confirm when `usageCount > 0`.

**Props:**
- `block: SharedBlock`
- `usageCount: number`
- `onDelete(id)`
- `onRename(id, name)`
- `onDuplicate(id)`

---

### `src/components/blocks/SharedBlockEditor.jsx`
Route `/blocks/:id`. Same 3-panel layout as `EditorPage` but scoped to a shared block. **Explicit Save** button (no autosave). Calls `updateSharedBlock()` on save, shows success toast.

**Props:** none (reads `:id` from URL params)
**Stores:** `useSharedBlockStore`, `useSettingsStore`
**Hooks:** `useEditor`, `useCompiler`, `useToast`

---

## Settings

### `src/components/settings/SettingsPage.jsx`
Route `/settings`. Two sections: Default email theme (maxWidth, backgroundColor, fontFamily, bodyFontSize, linkColor) and Global variables (key + fallback, add/edit/delete). Data export to JSON.

**Props:** none
**Stores:** `useSettingsStore`

---

## Editor Components

### `src/components/editor/EditorCanvas.jsx`
The editable TipTap canvas. Renders the editor inside the email envelope shape. Accepts `editor` and `theme`.

**Props:** `editor: Editor`, `theme: Theme`

---

### `src/components/editor/EditorTopBar.jsx`
Top bar for EditorPage: back button, inline rename, preview toggle, export menu (Copy HTML, Copy MJML, Download .html).

**Props:** `template`, `onRename`, `html`, `mjml`, `previewOpen`, `onPreviewToggle`

---

### `src/components/editor/PreviewPane.jsx`
Live HTML preview rendered in an `<iframe>`. Shows MJML compilation errors if present.

**Props:** `html: string`, `error: string | null`

---

### `src/components/editor/SlashMenu.jsx`
Floating slash command menu triggered by `/` in the editor. Lists all insertable block types.

**Props:** `editor: Editor`

---

### `src/components/editor/VariableMenu.jsx`
Floating variable insertion menu triggered by `{{` in the editor. Lists global variables.

**Props:** `editor: Editor`

---

### `src/components/editor/BlockActionBar.jsx`
Floating action bar above a focused block: move up, move down, duplicate, delete.

**Props:** `editor: Editor`

---

## Panels

### `src/components/panels/RightPanel.jsx`
Auto-detects the active block type via `editor.isActive()` and routes to the correct style sub-panel. Falls back to `GlobalStylePanel`.

**Props:** `editor: Editor`, `theme: Theme`, `onThemeChange(patch)`

---

### `src/components/panels/GlobalStylePanel.jsx`
Theme-level controls: max width, background color, font family, body font size, link color.

**Props:** `theme: Theme`, `onChange(patch)`

---

### `src/components/panels/TextStylePanel.jsx`
Paragraph/heading inline style controls: bold, italic, underline, color, align, font size.

**Props:** `editor: Editor`

---

### `src/components/panels/ImageStylePanel.jsx`
Image block controls: src URL, alt text, width, align.

**Props:** `editor: Editor`

---

### `src/components/panels/ButtonStylePanel.jsx`
Button block controls: label, href, background color, text color, border radius.

**Props:** `editor: Editor`

---

### `src/components/panels/DividerStylePanel.jsx`
Divider block controls: color, thickness.

**Props:** `editor: Editor`

---

### `src/components/panels/SpacerStylePanel.jsx`
Spacer block controls: height in px.

**Props:** `editor: Editor`

---

### `src/components/panels/ColumnsStylePanel.jsx`
Columns block controls: column ratio (split), gap.

**Props:** `editor: Editor`

---

### `src/components/panels/SharedBlockInfoPanel.jsx`
Info panel shown when cursor is inside a `sharedInstance` block. Displays block name, usage, and a link to edit the source.

**Props:** `editor: Editor`

---

## Home Components

### `src/components/home/TemplateGrid.jsx`
Responsive grid of `TemplateCard` items + `EmptyState` if list is empty.

**Props:** `templates`, `onOpen`, `onDelete`, `onDuplicate`, `onRename`

---

### `src/components/home/TemplateCard.jsx`
Card for a single template: thumbnail iframe preview, name, relative timestamp, hover overlay, three-dot menu.

**Props:** `template`, `onOpen`, `onDelete`, `onDuplicate`, `onRename`

---

### `src/components/home/EmptyState.jsx`
Zero-state illustration + "Create your first template" CTA.

**Props:** `onCreate()`

---

## UI Primitives

### `src/components/ui/NavRail.jsx`
Fixed left navigation with links to `/`, `/blocks`, `/settings`. Uses `NavLink` for active state.

**Props:** none

---

### `src/components/ui/Toast.jsx`
Global toast notification system. Exports `useToast()` hook (`toast(message, type)`) and `ToastContainer` (mount once in App). Types: `info | success | danger`.

**Exports:** `useToast`, `ToastContainer`

---

### `src/components/ui/Modal.jsx`
Accessible overlay modal with title, body slot, and configurable action buttons.

**Props:** `open`, `onClose`, `title`, `children`, `actions`

---

### `src/components/ui/ColorPicker.jsx`
Hex color picker with preview swatch + text input.

**Props:** `value: string`, `onChange(hex: string)`

---

### `src/components/ui/NumberInput.jsx`
Numeric stepper with min/max/step and optional unit suffix label.

**Props:** `value`, `onChange`, `min`, `max`, `step`, `suffix`

---

### `src/components/ui/Toggle.jsx`
Boolean on/off toggle switch.

**Props:** `checked: boolean`, `onChange(val: boolean)`, `label?: string`

---

## Node Views

### `src/components/nodeviews/BlockColumnsView.jsx`
ProseMirror React node view for the two-column block. Renders two editable content areas side-by-side.

**Props:** (node view contract) `node`, `updateAttributes`, `editor`

---

## TipTap Extensions

| File | Node name | Description |
|------|-----------|-------------|
| `extensions/BlockImage.js` | `blockImage` | Full-width image block with align/width attrs |
| `extensions/BlockButton.js` | `blockButton` | CTA button block with href/color attrs |
| `extensions/BlockDivider.js` | `blockDivider` | Horizontal rule with color/thickness |
| `extensions/BlockSpacer.js` | `blockSpacer` | Vertical whitespace with height attr |
| `extensions/BlockColumns.js` | `blockColumns` | Two-column layout with nested content |
| `extensions/BlockSocialIcons.js` | `blockSocialIcons` | Social icon row with platform links |
| `extensions/BlockSharedInstance.js` | `sharedInstance` | Reference to a saved shared block |
| `extensions/SlashCommand.js` | — | ProseMirror plugin: `/` triggers block-insert menu |

---

## Hooks

| File | Returns | Description |
|------|---------|-------------|
| `hooks/useEditor.js` | `Editor` | TipTap editor factory with all extensions wired |
| `hooks/useCompiler.js` | `{ html, mjml, error }` | Debounced (300ms) MJML → HTML compiler |
| `hooks/useClipboard.js` | `{ copy(text), copied }` | Clipboard copy with auto-reset `copied` boolean |

---

## Stores (Zustand)

| File | State | Actions |
|------|-------|---------|
| `store/templates.js` | `templates[]` | `createTemplate`, `updateTemplate`, `deleteTemplate`, `getTemplate` |
| `store/sharedBlocks.js` | `blocks[]` | `createSharedBlock`, `updateSharedBlock`, `deleteSharedBlock`, `getBlock`, `getUsageCount` |
| `store/settings.js` | `settings` | `updateSettings`, `updateDefaultTheme`, `addVariable`, `updateVariable`, `deleteVariable` |

All stores write through to localStorage via `src/lib/storage.js` (`md:` key prefix).

---

## Library

| File | Exports | Description |
|------|---------|-------------|
| `lib/storage.js` | get/save/delete functions | localStorage read-write layer, `md:` prefix |
| `lib/constants.js` | `BLOCK_TYPES`, `getDefaultTheme()`, starter docs | Shared enums and seed data |
| `lib/serializer.js` | `serializeToMjml(doc, theme)` | TipTap doc JSON → MJML string |
| `lib/utils.js` | `relativeTime`, `countSharedInstances`, `applyVariableFallbacks` | Shared utilities |

---

## Styles

| File | Description |
|------|-------------|
| `styles/tokens.css` | All CSS custom properties (colors, spacing, typography, shadows, radii) |
| `styles/global.css` | Tailwind directives + TipTap `.tiptap` editor styles |

---

*Generated: Phase 1 complete — ready for Lovable handoff.*
