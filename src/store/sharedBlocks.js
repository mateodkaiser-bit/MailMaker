import { create } from 'zustand';
import { nanoid } from 'nanoid';
import * as storage from '../lib/storage.js';

export const useSharedBlockStore = create((set, get) => ({
  blocks: storage.getSharedBlocks(),

  /** Create a new shared block, persist it, return the block object. */
  createSharedBlock: ({ name, doc, styles = {} }) => {
    const block = {
      id: nanoid(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      doc,
      styles,
    };
    storage.saveSharedBlock(block);
    set(s => ({ blocks: [block, ...s.blocks] }));
    return block;
  },

  /** Patch fields on an existing shared block. */
  updateSharedBlock: (id, patch) => {
    const all = get().blocks.map(b =>
      b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b
    );
    const updated = all.find(b => b.id === id);
    if (updated) storage.saveSharedBlock(updated);
    set({ blocks: all });
  },

  /** Delete a shared block. Templates that reference it fall back to their snapshot. */
  deleteSharedBlock: (id) => {
    storage.deleteSharedBlock(id);
    set(s => ({ blocks: s.blocks.filter(b => b.id !== id) }));
  },

  /** Find a shared block by id. */
  getBlock: (id) => get().blocks.find(b => b.id === id),

  /**
   * Count how many templates reference a given shared block id.
   * Templates array is passed in to avoid circular dependency.
   * @param {string} id
   * @param {Array} templates
   * @returns {number}
   */
  getUsageCount: (id, templates) => {
    return templates.filter(t => {
      const str = JSON.stringify(t.doc);
      return str.includes(id);
    }).length;
  },
}));
