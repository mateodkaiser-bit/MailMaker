import { create } from 'zustand';
import { nanoid } from 'nanoid';
import * as storage from '../lib/storage.js';
import { getDefaultTheme } from '../lib/constants.js';

export const useTemplateStore = create((set, get) => ({
  templates: storage.getTemplates().map(t => ({
    ...t,
    name: typeof t.name === 'string' ? t.name : (t.name?.name ?? 'Untitled email'),
  })),

  /** Create a new blank template, persist it, return its id. */
  createTemplate: ({ name = 'Untitled email', doc } = {}) => {
    const t = {
      id: nanoid(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      doc: doc ?? { type: 'doc', content: [{ type: 'paragraph' }] },
      theme: getDefaultTheme(),
      variables: [{ name: 'first_name', fallback: 'there' }],
    };
    storage.saveTemplate(t);
    set(s => ({ templates: [t, ...s.templates] }));
    return t.id;
  },

  /** Patch fields on an existing template. */
  updateTemplate: (id, patch) => {
    const all = get().templates.map(t =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
    );
    const updated = all.find(t => t.id === id);
    if (updated) storage.saveTemplate(updated);
    set({ templates: all });
  },

  /** Duplicate a template, return the new id. */
  duplicateTemplate: (id) => {
    const src = get().templates.find(t => t.id === id);
    if (!src) return null;
    const copy = {
      ...src,
      id: nanoid(),
      name: `Copy of ${src.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveTemplate(copy);
    set(s => ({ templates: [copy, ...s.templates] }));
    return copy.id;
  },

  /** Delete a template by id. */
  deleteTemplate: (id) => {
    storage.deleteTemplate(id);
    set(s => ({ templates: s.templates.filter(t => t.id !== id) }));
  },

  /** Find a template by id. */
  getTemplate: (id) => get().templates.find(t => t.id === id),
}));
