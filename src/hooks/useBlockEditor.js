import { useState, useCallback, useRef, useEffect } from 'react';
import { createBlock } from '../lib/migrateDoc.js';

/**
 * useBlockEditor — core state management for the block-based editor.
 *
 * Manages: block CRUD, selection, multi-select, undo/redo.
 * Returns a stable API object that consumers (context, panels) can call.
 */
export function useBlockEditor({ initialBlocks, onChange }) {
  const [blocks, setBlocksRaw] = useState(initialBlocks ?? []);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [focusedId, setFocusedId] = useState(null);

  // ─── Undo / redo ────────────────────────────────────────────────────────────
  const historyRef = useRef({ past: [], future: [] });
  const suppressOnChange = useRef(false);

  const setBlocks = useCallback((nextOrFn) => {
    setBlocksRaw(prev => {
      const next = typeof nextOrFn === 'function' ? nextOrFn(prev) : nextOrFn;
      // Push previous state onto undo stack
      historyRef.current.past.push(structuredClone(prev));
      historyRef.current.future = [];
      if (historyRef.current.past.length > 100) historyRef.current.past.shift();
      return next;
    });
  }, []);

  // Fire onChange on every block change
  useEffect(() => {
    if (suppressOnChange.current) {
      suppressOnChange.current = false;
      return;
    }
    onChange?.(blocks);
  }, [blocks, onChange]);

  const undo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (past.length === 0) return;
    setBlocksRaw(prev => {
      future.push(structuredClone(prev));
      suppressOnChange.current = false;
      return past.pop();
    });
    // Still trigger onChange for undo
    setTimeout(() => {
      setBlocksRaw(b => { onChange?.(b); return b; });
    }, 0);
  }, [onChange]);

  const redo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (future.length === 0) return;
    setBlocksRaw(prev => {
      past.push(structuredClone(prev));
      return future.pop();
    });
    setTimeout(() => {
      setBlocksRaw(b => { onChange?.(b); return b; });
    }, 0);
  }, [onChange]);

  // ─── Block CRUD ─────────────────────────────────────────────────────────────

  const addBlock = useCallback((type, afterId = null, overrides = {}) => {
    const block = createBlock(type, overrides);
    setBlocks(prev => {
      if (!afterId) return [...prev, block];
      const idx = prev.findIndex(b => b.id === afterId);
      if (idx === -1) return [...prev, block];
      const next = [...prev];
      next.splice(idx + 1, 0, block);
      return next;
    });
    setFocusedId(block.id);
    setSelectedIds(new Set([block.id]));
    return block.id;
  }, [setBlocks]);

  const updateBlock = useCallback((id, patch) => {
    setBlocks(prev => prev.map(b => {
      if (b.id !== id) return b;
      const updated = { ...b };
      if (patch.type) updated.type = patch.type;
      if (patch.attrs) updated.attrs = { ...b.attrs, ...patch.attrs };
      if (patch.html !== undefined) updated.html = patch.html;
      if (patch.columns) updated.columns = patch.columns;
      return updated;
    }));
  }, [setBlocks]);

  // "Light" update that does NOT push undo history (for typing in contenteditable)
  const updateBlockSilent = useCallback((id, patch) => {
    setBlocksRaw(prev => prev.map(b => {
      if (b.id !== id) return b;
      const updated = { ...b };
      if (patch.type) updated.type = patch.type;
      if (patch.attrs) updated.attrs = { ...b.attrs, ...patch.attrs };
      if (patch.html !== undefined) updated.html = patch.html;
      if (patch.columns) updated.columns = patch.columns;
      return updated;
    }));
  }, []);

  const deleteBlocks = useCallback((ids) => {
    const idSet = ids instanceof Set ? ids : new Set(ids);
    setBlocks(prev => {
      const next = prev.filter(b => !idSet.has(b.id));
      // Never leave editor empty
      if (next.length === 0) next.push(createBlock('paragraph'));
      return next;
    });
    setSelectedIds(new Set());
    setFocusedId(null);
  }, [setBlocks]);

  const duplicateBlock = useCallback((id) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx === -1) return prev;
      const clone = structuredClone(prev[idx]);
      clone.id = createBlock(clone.type).id;
      // Also reassign IDs for nested blocks (columns)
      if (clone.columns) {
        clone.columns = clone.columns.map(col =>
          col.map(b => ({ ...b, id: createBlock(b.type).id }))
        );
      }
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  }, [setBlocks]);

  const moveBlock = useCallback((activeId, overId) => {
    if (activeId === overId) return;
    setBlocks(prev => {
      const oldIdx = prev.findIndex(b => b.id === activeId);
      const newIdx = prev.findIndex(b => b.id === overId);
      if (oldIdx === -1 || newIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(oldIdx, 1);
      next.splice(newIdx, 0, moved);
      return next;
    });
  }, [setBlocks]);

  const moveBlockUp = useCallback((id) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, [setBlocks]);

  const moveBlockDown = useCallback((id) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, [setBlocks]);

  // ─── Column operations ─────────────────────────────────────────────────────

  const addBlockToColumn = useCallback((columnsBlockId, colIndex, type, afterId = null, overrides = {}) => {
    const block = createBlock(type, overrides);
    setBlocks(prev => prev.map(b => {
      if (b.id !== columnsBlockId || !b.columns) return b;
      const cols = b.columns.map((col, i) => {
        if (i !== colIndex) return col;
        if (!afterId) return [...col, block];
        const idx = col.findIndex(cb => cb.id === afterId);
        if (idx === -1) return [...col, block];
        const next = [...col];
        next.splice(idx + 1, 0, block);
        return next;
      });
      return { ...b, columns: cols };
    }));
    setFocusedId(block.id);
    return block.id;
  }, [setBlocks]);

  const updateColumnBlock = useCallback((columnsBlockId, blockId, patch) => {
    setBlocksRaw(prev => prev.map(b => {
      if (b.id !== columnsBlockId || !b.columns) return b;
      const cols = b.columns.map(col =>
        col.map(cb => {
          if (cb.id !== blockId) return cb;
          const updated = { ...cb };
          if (patch.attrs) updated.attrs = { ...cb.attrs, ...patch.attrs };
          if (patch.html !== undefined) updated.html = patch.html;
          return updated;
        })
      );
      return { ...b, columns: cols };
    }));
  }, []);

  const deleteColumnBlock = useCallback((columnsBlockId, blockId) => {
    setBlocks(prev => prev.map(b => {
      if (b.id !== columnsBlockId || !b.columns) return b;
      const cols = b.columns.map(col => {
        const next = col.filter(cb => cb.id !== blockId);
        if (next.length === 0) next.push(createBlock('paragraph'));
        return next;
      });
      return { ...b, columns: cols };
    }));
  }, [setBlocks]);

  const moveColumnBlock = useCallback((columnsBlockId, colIndex, activeId, overId) => {
    if (activeId === overId) return;
    setBlocks(prev => prev.map(b => {
      if (b.id !== columnsBlockId || !b.columns) return b;
      const cols = b.columns.map((col, i) => {
        if (i !== colIndex) return col;
        const oldIdx = col.findIndex(cb => cb.id === activeId);
        const newIdx = col.findIndex(cb => cb.id === overId);
        if (oldIdx === -1 || newIdx === -1) return col;
        const next = [...col];
        const [moved] = next.splice(oldIdx, 1);
        next.splice(newIdx, 0, moved);
        return next;
      });
      return { ...b, columns: cols };
    }));
  }, [setBlocks]);

  // ─── Turn into / wrap in columns ────────────────────────────────────────────

  const turnBlockInto = useCallback((id, newType, newAttrs = {}) => {
    setBlocks(prev => prev.map(b => {
      if (b.id !== id) return b;
      return { ...b, type: newType, attrs: { ...b.attrs, ...newAttrs } };
    }));
  }, [setBlocks]);

  const wrapInColumns = useCallback((id, numColumns = 2) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx === -1) return prev;
      const block = prev[idx];

      // Build column arrays: first column gets a copy of the current block
      const cols = [];
      cols.push([{ ...structuredClone(block), id: createBlock(block.type).id }]);
      for (let i = 1; i < numColumns; i++) {
        cols.push([createBlock('paragraph')]);
      }

      const ratio = numColumns === 3 ? '33-33-33' : '50-50';
      const columnsBlock = createBlock('columns', { ratio });
      columnsBlock.columns = cols;

      const next = [...prev];
      next[idx] = columnsBlock;
      return next;
    });
  }, [setBlocks]);

  // ─── Selection ──────────────────────────────────────────────────────────────

  const selectBlock = useCallback((id, multi = false) => {
    if (multi) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      setSelectedIds(new Set([id]));
    }
    setFocusedId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ─── Derived ────────────────────────────────────────────────────────────────

  const getBlock = useCallback((id) => blocks.find(b => b.id === id), [blocks]);

  const selectedBlock = blocks.find(b => selectedIds.has(b.id)) || null;

  return {
    blocks,
    selectedIds,
    focusedId,
    selectedBlock,

    // Block CRUD
    addBlock,
    updateBlock,
    updateBlockSilent,
    deleteBlocks,
    duplicateBlock,
    moveBlock,
    moveBlockUp,
    moveBlockDown,

    // Column operations
    addBlockToColumn,
    updateColumnBlock,
    deleteColumnBlock,
    moveColumnBlock,

    // Turn into / wrap
    turnBlockInto,
    wrapInColumns,

    // Selection
    selectBlock,
    clearSelection,
    setFocusedId,

    // Undo/redo
    undo,
    redo,
    canUndo: historyRef.current.past.length > 0,
    canRedo: historyRef.current.future.length > 0,

    // Helpers
    getBlock,
  };
}
