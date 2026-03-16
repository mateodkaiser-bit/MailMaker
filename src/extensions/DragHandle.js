/**
 * DragHandle — Notion-style six-dot drag handle for every block.
 *
 * Behaviour (mirrors Notion exactly):
 *  • Hover any block  → grip appears to the left, fades in
 *  • Hover the grip   → subtle gray pill background, darker dots
 *  • Drag the grip    → semi-transparent block ghost follows cursor
 *  • Drag over editor → blue 2 px line + dot shows exact drop position
 *  • Drop             → ProseMirror transaction moves the block
 *  • Release / cancel → all chrome disappears cleanly
 *
 * Implementation notes:
 *  – Pure ProseMirror Plugin (no @dnd-kit), so it works with every node type
 *    including atomic nodes (blockImage, blockButton, …) and text blocks.
 *  – Handle + drop-line live on document.body with position:fixed so they
 *    are never clipped by overflow:hidden/scroll containers.
 *  – dragover / drop are intercepted via Tiptap's handleDOMEvents (returns
 *    true) so ProseMirror's own drop handler never fires for our drags.
 */

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, NodeSelection } from 'prosemirror-state';

const DRAG_KEY = new PluginKey('notionDragHandle');

// ─── SVG ─────────────────────────────────────────────────────────────────────

function buildDotGrid() {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 8 14');
  svg.setAttribute('width', '8');
  svg.setAttribute('height', '14');
  svg.style.cssText = 'fill:currentColor;display:block;flex-shrink:0;';

  [[2, 2], [6, 2], [2, 7], [6, 7], [2, 12], [6, 12]].forEach(([cx, cy]) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', '1.4');
    svg.appendChild(c);
  });
  return svg;
}

// ─── View class ──────────────────────────────────────────────────────────────

class DragHandleView {
  constructor(view) {
    this.view        = view;
    this.hoveredPos  = null;   // top-level block pos currently hovered
    this.dragFromPos = null;   // pos of the block being dragged
    this.dragging    = false;
    this.dropPos     = null;   // resolved drop target position

    this._buildHandle();
    this._buildDropLine();

    document.body.appendChild(this.handle);
    document.body.appendChild(this.dropLine);

    // Bind
    this._onMove  = this._onMove.bind(this);
    this._onLeave = this._onLeave.bind(this);
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragEnd   = this._onDragEnd.bind(this);

    // Listen for hover on the editor's immediate parent
    // (EditorContent wrapper — covers full content area including padding)
    this._container = view.dom.parentElement;
    this._container.addEventListener('mousemove', this._onMove);
    this._container.addEventListener('mouseleave', this._onLeave);

    this.handle.addEventListener('dragstart', this._onDragStart);
    this.handle.addEventListener('dragend',   this._onDragEnd);
  }

  // ─── DOM builders ──────────────────────────────────────────────────────────

  _buildHandle() {
    const el = document.createElement('div');
    el.setAttribute('draggable', 'true');
    el.setAttribute('data-dm-drag-handle', '');
    el.appendChild(buildDotGrid());

    el.style.cssText = `
      position: fixed;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      cursor: grab;
      color: rgba(55,53,47,0.30);
      opacity: 0;
      transition: opacity 0.12s ease, background 0.1s ease, color 0.1s ease;
      user-select: none;
      -webkit-user-select: none;
    `;

    el.addEventListener('mouseenter', () => {
      if (this.dragging) return;
      el.style.background = 'rgba(55,53,47,0.08)';
      el.style.color       = 'rgba(55,53,47,0.65)';
    });
    el.addEventListener('mouseleave', (e) => {
      el.style.background = 'transparent';
      el.style.color       = 'rgba(55,53,47,0.30)';
      // If cursor left handle without going back into the editor, hide
      if (!this._container.contains(e.relatedTarget)) {
        if (!this.dragging) this._hide();
      }
    });

    this.handle = el;
  }

  _buildDropLine() {
    const line = document.createElement('div');
    line.setAttribute('data-dm-drop-line', '');
    line.style.cssText = `
      position: fixed;
      height: 2px;
      border-radius: 2px;
      background: #2383e2;
      z-index: 9999;
      pointer-events: none;
      display: none;
    `;

    // Blue circle at the left end (Notion's style)
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      left: -4px;
      top: -3px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2383e2;
    `;
    line.appendChild(dot);
    this.dropLine = line;
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /** Return the top-level block at viewport coordinates, or null. */
  _blockAt(clientX, clientY) {
    const view      = this.view;
    const hit       = view.posAtCoords({ left: clientX, top: clientY });
    if (!hit) return null;

    try {
      // For atomic nodes, posAtCoords returns { pos, inside } where
      // inside is the atom's own position. Use whichever is more useful.
      const rawPos  = hit.inside >= 0 ? hit.inside : hit.pos;
      const $pos    = view.state.doc.resolve(rawPos);
      if ($pos.depth === 0) return null;

      const nodePos = $pos.before(1);          // position of depth-1 ancestor
      const node    = view.state.doc.nodeAt(nodePos);
      if (!node) return null;

      const dom = view.nodeDOM(nodePos);
      const el  = (dom && dom.nodeType === 1) ? dom : dom?.parentElement;
      if (!el) return null;

      return { nodePos, node, el };
    } catch {
      return null;
    }
  }

  _hide() {
    this.handle.style.opacity = '0';
    this.hoveredPos = null;
  }

  _positionHandle(rect) {
    // Vertically centre on the block; 28 px to the left of its content edge
    this.handle.style.top  = `${rect.top + rect.height / 2 - 10}px`;
    this.handle.style.left = `${rect.left - 28}px`;
  }

  // ─── Hover tracking ────────────────────────────────────────────────────────

  _onMove(e) {
    if (this.dragging) return;

    const block = this._blockAt(e.clientX, e.clientY);
    if (!block) { this._hide(); return; }

    this.hoveredPos = block.nodePos;
    const rect = block.el.getBoundingClientRect();
    this._positionHandle(rect);
    this.handle.style.opacity = '1';
  }

  _onLeave(e) {
    // Don't hide if cursor moved onto the handle itself
    if (e.relatedTarget === this.handle || this.handle.contains(e.relatedTarget)) return;
    if (!this.dragging) this._hide();
  }

  // ─── Drag lifecycle (fired on the handle element) ──────────────────────────

  _onDragStart(e) {
    if (this.hoveredPos === null) { e.preventDefault(); return; }

    this.dragging    = true;
    this.dragFromPos = this.hoveredPos;

    const view = this.view;

    // Select the whole block so ProseMirror highlights it
    try {
      const sel = NodeSelection.create(view.state.doc, this.dragFromPos);
      view.dispatch(view.state.tr.setSelection(sel));
    } catch { /* text nodes can't always be NodeSelected; that's fine */ }

    e.dataTransfer.effectAllowed = 'move';
    // Custom MIME type — our drop handler checks for this to distinguish
    // our drags from clipboard pastes / other drops.
    e.dataTransfer.setData('application/x-dm-drag', String(this.dragFromPos));

    // ── Drag ghost ──
    // Clone the block's DOM, make it slightly opaque with a card shadow
    const dom = view.nodeDOM(this.dragFromPos);
    const domEl = (dom && dom.nodeType === 1) ? dom : dom?.parentElement;
    if (domEl) {
      const rect  = domEl.getBoundingClientRect();
      const ghost = domEl.cloneNode(true);
      ghost.style.cssText += `
        position: fixed;
        top: -9999px; left: -9999px;
        width: ${rect.width}px;
        opacity: 0.75;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        pointer-events: none;
        overflow: hidden;
      `;
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, e.clientX - rect.left, 12);
      // Remove after the browser has captured the image
      requestAnimationFrame(() => ghost.remove());
    }

    this.handle.style.cursor  = 'grabbing';
    this.handle.style.opacity = '0';
    document.body.classList.add('dm-dragging');
  }

  _onDragEnd() {
    this.dragging    = false;
    document.body.classList.remove('dm-dragging');
    this.dragFromPos = null;
    this.dropPos     = null;
    this.handle.style.cursor = 'grab';
    this.dropLine.style.display = 'none';
    // Don't re-show the handle; next mousemove will do that
  }

  // ─── Drag-over / drop (called from handleDOMEvents in the Plugin) ──────────

  onDragOver(view, e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const block = this._blockAt(e.clientX, e.clientY);
    if (!block) { this.dropLine.style.display = 'none'; return; }

    const { nodePos, node, el } = block;
    const rect    = el.getBoundingClientRect();
    const isAbove = e.clientY < rect.top + rect.height / 2;

    if (isAbove) {
      this.dropPos              = nodePos;
      this.dropLine.style.top   = `${rect.top - 1}px`;
    } else {
      this.dropPos              = nodePos + node.nodeSize;
      this.dropLine.style.top   = `${rect.bottom + 1}px`;
    }

    this.dropLine.style.left    = `${rect.left}px`;
    this.dropLine.style.width   = `${rect.width}px`;
    this.dropLine.style.display = 'block';
  }

  onDragLeave(view, e) {
    if (!view.dom.contains(e.relatedTarget)) {
      this.dropLine.style.display = 'none';
    }
  }

  onDrop(view, e) {
    e.preventDefault();
    this.dropLine.style.display = 'none';

    const from = this.dragFromPos;
    const to   = this.dropPos;

    // Bail if no valid drag state
    if (from === null || to === null) { this._resetDragState(); return; }

    const node = view.state.doc.nodeAt(from);
    if (!node) { this._resetDragState(); return; }

    // No-op: dropping onto the block's own position or immediately after it
    if (to === from || to === from + node.nodeSize) { this._resetDragState(); return; }

    // ── ProseMirror transaction ──
    // Delete at source, insert at target.
    // When target is after the source, every position after the deletion shifts
    // left by nodeSize, so we compensate.
    const insertAt = to > from ? to - node.nodeSize : to;

    const tr = view.state.tr;
    tr.delete(from, from + node.nodeSize);
    tr.insert(insertAt, node);
    view.dispatch(tr);

    this._resetDragState();
  }

  _resetDragState() {
    this.dragging    = false;
    this.dragFromPos = null;
    this.dropPos     = null;
    document.body.classList.remove('dm-dragging');
  }

  // ─── ProseMirror view interface ────────────────────────────────────────────

  update() { /* no-op: we react to DOM events, not doc changes */ }

  destroy() {
    this._container.removeEventListener('mousemove', this._onMove);
    this._container.removeEventListener('mouseleave', this._onLeave);
    this.handle.remove();
    this.dropLine.remove();
  }
}

// ─── Tiptap Extension ────────────────────────────────────────────────────────

export const DragHandle = Extension.create({
  name: 'notionDragHandle',

  addProseMirrorPlugins() {
    // We keep a reference so handleDOMEvents can delegate to the view instance.
    let handleView = null;

    return [
      new Plugin({
        key: DRAG_KEY,

        view(editorView) {
          handleView = new DragHandleView(editorView);
          return handleView;
        },

        props: {
          handleDOMEvents: {
            /**
             * Intercept dragover events when OUR drag is in progress.
             * Returning true prevents ProseMirror's own dragover handler.
             */
            dragover(view, e) {
              if (!handleView?.dragging) return false;
              handleView.onDragOver(view, e);
              return true;
            },

            /**
             * Show / hide drop line as cursor leaves the editor area.
             * Return false: we still want default cursor updates.
             */
            dragleave(view, e) {
              if (!handleView?.dragging) return false;
              handleView.onDragLeave(view, e);
              return false;
            },

            /**
             * Intercept drop events when OUR drag is in progress.
             * Returning true prevents ProseMirror's clipboard-paste logic
             * from firing on our custom drag data.
             */
            drop(view, e) {
              if (!handleView?.dragging) return false;
              handleView.onDrop(view, e);
              return true;
            },
          },
        },
      }),
    ];
  },
});
