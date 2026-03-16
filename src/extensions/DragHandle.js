/**
 * DragHandle — Notion-style six-dot drag handle for every block.
 *
 * Behaviour:
 *  • Hover any block  → grip appears to the left, fades in
 *  • Hover the grip   → subtle gray pill background, darker dots
 *  • Click the grip   → select that block (clears multi-select)
 *  • Shift+click      → add/remove block from multi-selection
 *  • Drag the grip    → move single block (or all selected blocks if multi-selected)
 *  • Drag over editor → blue 2 px line + dot shows exact drop position
 *  • Drop             → ProseMirror transaction moves the block(s)
 *  • Release / cancel → all chrome disappears cleanly
 *
 * Implementation notes:
 *  – Pure ProseMirror Plugin (no @dnd-kit), works with every node type.
 *  – Handle + drop-line live on document.body with position:fixed so they
 *    are never clipped by overflow:hidden/scroll containers.
 *  – dragover / drop are intercepted via Tiptap's handleDOMEvents (returns
 *    true) so ProseMirror's own drop handler never fires for our drags.
 *  – Multi-select state is stored in selectedPositions (Set of doc positions).
 *    Selected blocks get a data-dm-selected attribute for CSS highlighting.
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

// ─── Inject styles once ───────────────────────────────────────────────────────

function injectStyles() {
  if (document.getElementById('dm-drag-styles')) return;
  const style = document.createElement('style');
  style.id = 'dm-drag-styles';
  // Safety Orange left-bar indicator — matches .ProseMirror-selectednode style
  style.textContent = `
    [data-dm-selected] {
      box-shadow: -4px 0 0 0 #FF5F1F !important;
    }
  `;
  document.head.appendChild(style);
}

// ─── View class ──────────────────────────────────────────────────────────────

class DragHandleView {
  constructor(view) {
    this.view        = view;
    this.hoveredPos  = null;   // top-level block pos currently hovered
    this.dragFromPos = null;   // pos of the block the drag started from
    this.dragging    = false;
    this.dropPos     = null;   // resolved drop target position
    this.draggingNodes = [];   // { pos, node } pairs being dragged

    // Multi-select state
    this.selectedPositions = new Set(); // Set of top-level block positions

    injectStyles();
    this._buildHandle();
    this._buildDropLine();

    document.body.appendChild(this.handle);
    document.body.appendChild(this.dropLine);

    // Bind
    this._onMove          = this._onMove.bind(this);
    this._onLeave         = this._onLeave.bind(this);
    this._onDragStart     = this._onDragStart.bind(this);
    this._onDragEnd       = this._onDragEnd.bind(this);
    this._onContainerDown = this._onContainerDown.bind(this);

    this._container = view.dom.parentElement;
    this._container.addEventListener('mousemove', this._onMove);
    this._container.addEventListener('mouseleave', this._onLeave);
    this._container.addEventListener('mousedown', this._onContainerDown);

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
      if (!this._container.contains(e.relatedTarget)) {
        if (!this.dragging) this._hide();
      }
    });

    // Click to select / shift+click to multi-select
    // Use mousedown + mouseup pattern to avoid firing after a drag
    let _mouseDownPos = null;
    el.addEventListener('mousedown', (e) => {
      _mouseDownPos = { x: e.clientX, y: e.clientY };
    });
    el.addEventListener('mouseup', (e) => {
      if (!_mouseDownPos) return;
      const dx = Math.abs(e.clientX - _mouseDownPos.x);
      const dy = Math.abs(e.clientY - _mouseDownPos.y);
      _mouseDownPos = null;
      // Only treat as a click if cursor didn't move (not a drag)
      if (dx < 5 && dy < 5 && !this.dragging) {
        this._onHandleClick(e);
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
    const view = this.view;
    const hit  = view.posAtCoords({ left: clientX, top: clientY });
    if (!hit) return null;

    try {
      const rawPos  = hit.inside >= 0 ? hit.inside : hit.pos;
      const $pos    = view.state.doc.resolve(rawPos);
      if ($pos.depth === 0) return null;

      const nodePos = $pos.before(1);
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
    this.handle.style.top  = `${rect.top + rect.height / 2 - 10}px`;
    this.handle.style.left = `${rect.left - 28}px`;
  }

  // ─── Multi-select ──────────────────────────────────────────────────────────

  _onHandleClick(e) {
    if (this.hoveredPos === null) return;
    const pos = this.hoveredPos;

    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      // Toggle this block in/out of selection
      if (this.selectedPositions.has(pos)) {
        this.selectedPositions.delete(pos);
      } else {
        this.selectedPositions.add(pos);
      }
    } else {
      // Single select — also set ProseMirror NodeSelection so StylePanel works
      this.selectedPositions.clear();
      this.selectedPositions.add(pos);
      try {
        const sel = NodeSelection.create(this.view.state.doc, pos);
        this.view.dispatch(this.view.state.tr.setSelection(sel));
      } catch { /* text nodes can't always be NodeSelected */ }
    }

    this._updateSelectionVisuals();
  }

  _clearSelection() {
    this.selectedPositions.clear();
    this._updateSelectionVisuals();
  }

  _updateSelectionVisuals() {
    // Remove attribute from all previously selected elements
    document.querySelectorAll('[data-dm-selected]').forEach(el => {
      el.removeAttribute('data-dm-selected');
    });
    // Apply to currently selected
    this.selectedPositions.forEach(pos => {
      try {
        const dom = this.view.nodeDOM(pos);
        const el  = (dom && dom.nodeType === 1) ? dom : dom?.parentElement;
        if (el) el.setAttribute('data-dm-selected', '');
      } catch { /* pos may be stale */ }
    });
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
    if (e.relatedTarget === this.handle || this.handle.contains(e.relatedTarget)) return;
    if (!this.dragging) this._hide();
  }

  /** Clear selection when clicking inside the editor but not on the handle. */
  _onContainerDown(e) {
    if (!this.handle.contains(e.target)) {
      this._clearSelection();
    }
  }

  // ─── Drag lifecycle (fired on the handle element) ──────────────────────────

  _onDragStart(e) {
    if (this.hoveredPos === null) { e.preventDefault(); return; }

    this.dragging    = true;
    this.dragFromPos = this.hoveredPos;

    const view = this.view;

    // Determine which blocks we're moving:
    // If the dragged block is part of a multi-selection, move all selected.
    // Otherwise, move just the dragged block.
    if (this.selectedPositions.size > 1 && this.selectedPositions.has(this.hoveredPos)) {
      const sorted = [...this.selectedPositions].sort((a, b) => a - b);
      this.draggingNodes = sorted
        .map(pos => ({ pos, node: view.state.doc.nodeAt(pos) }))
        .filter(d => d.node);
    } else {
      const node = view.state.doc.nodeAt(this.hoveredPos);
      this.draggingNodes = node ? [{ pos: this.hoveredPos, node }] : [];
    }

    if (this.draggingNodes.length === 0) { e.preventDefault(); return; }

    // Select the dragged block in ProseMirror (for highlight)
    try {
      const sel = NodeSelection.create(view.state.doc, this.dragFromPos);
      view.dispatch(view.state.tr.setSelection(sel));
    } catch { /* fine */ }

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/x-dm-drag', String(this.dragFromPos));

    // ── Drag ghost ──
    if (this.draggingNodes.length > 1) {
      // Multi-block: show a pill label
      const ghost = document.createElement('div');
      ghost.style.cssText = `
        position: fixed; top: -9999px; left: -9999px;
        padding: 6px 12px;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        font-size: 13px;
        font-family: var(--font-sans, Inter, sans-serif);
        color: #1a1a2e;
        pointer-events: none;
        opacity: 0.9;
      `;
      ghost.textContent = `Moving ${this.draggingNodes.length} blocks`;
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 60, 16);
      requestAnimationFrame(() => ghost.remove());
    } else {
      // Single block: clone its DOM as the ghost
      const dom   = view.nodeDOM(this.dragFromPos);
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
        requestAnimationFrame(() => ghost.remove());
      }
    }

    this.handle.style.cursor  = 'grabbing';
    this.handle.style.opacity = '0';
    document.body.classList.add('dm-dragging');
  }

  _onDragEnd() {
    this.dragging    = false;
    document.body.classList.remove('dm-dragging');
    this.dragFromPos  = null;
    this.dropPos      = null;
    this.draggingNodes = [];
    this.handle.style.cursor = 'grab';
    this.dropLine.style.display = 'none';
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

    const nodes = this.draggingNodes;
    const to    = this.dropPos;

    if (nodes.length === 0 || to === null) { this._resetDragState(); return; }

    if (nodes.length === 1) {
      // ── Single block drop (original logic) ──
      const { pos: from, node } = nodes[0];

      if (to === from || to === from + node.nodeSize) { this._resetDragState(); return; }

      const insertAt = to > from ? to - node.nodeSize : to;
      const tr = view.state.tr;
      tr.delete(from, from + node.nodeSize);
      tr.insert(insertAt, node);
      view.dispatch(tr);
    } else {
      // ── Multi-block drop ──
      // Nodes are already sorted ascending by position.
      const firstPos = nodes[0].pos;
      const lastNode = nodes[nodes.length - 1];
      const lastEnd  = lastNode.pos + lastNode.node.nodeSize;

      // No-op if dropping inside the selected range
      if (to > firstPos && to <= lastEnd) { this._resetDragState(); return; }

      const tr = view.state.tr;

      // Delete nodes from highest to lowest so earlier positions stay valid
      const sortedDesc = [...nodes].sort((a, b) => b.pos - a.pos);
      sortedDesc.forEach(({ pos, node }) => {
        const from = tr.mapping.map(pos);
        const end  = tr.mapping.map(pos + node.nodeSize);
        tr.delete(from, end);
      });

      // Map the target insertion position through all the deletions
      const insertAt = tr.mapping.map(to);

      // Insert all nodes in original (ascending) order
      tr.insert(insertAt, nodes.map(d => d.node));

      view.dispatch(tr);
    }

    this._resetDragState();
    this._clearSelection();
  }

  _resetDragState() {
    this.dragging     = false;
    this.dragFromPos  = null;
    this.dropPos      = null;
    this.draggingNodes = [];
    document.body.classList.remove('dm-dragging');
  }

  // ─── ProseMirror view interface ────────────────────────────────────────────

  update() { /* no-op: we react to DOM events, not doc changes */ }

  destroy() {
    this._container.removeEventListener('mousemove', this._onMove);
    this._container.removeEventListener('mouseleave', this._onLeave);
    this._container.removeEventListener('mousedown', this._onContainerDown);
    this.handle.remove();
    this.dropLine.remove();
    const styles = document.getElementById('dm-drag-styles');
    if (styles) styles.remove();
  }
}

// ─── Tiptap Extension ────────────────────────────────────────────────────────

export const DragHandle = Extension.create({
  name: 'notionDragHandle',

  addProseMirrorPlugins() {
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
            dragover(view, e) {
              if (!handleView?.dragging) return false;
              handleView.onDragOver(view, e);
              return true;
            },

            dragleave(view, e) {
              if (!handleView?.dragging) return false;
              handleView.onDragLeave(view, e);
              return false;
            },

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
