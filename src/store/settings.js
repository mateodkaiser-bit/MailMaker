import { create } from 'zustand';
import * as storage from '../lib/storage.js';

export const useSettingsStore = create((set) => ({
  settings: storage.getSettings(),

  /** Update settings and persist. */
  updateSettings: (patch) => {
    set(s => {
      const next = { ...s.settings, ...patch };
      storage.saveSettings(next);
      return { settings: next };
    });
  },

  /** Update only the defaultTheme portion. */
  updateDefaultTheme: (themePatch) => {
    set(s => {
      const next = {
        ...s.settings,
        defaultTheme: { ...s.settings.defaultTheme, ...themePatch },
      };
      storage.saveSettings(next);
      return { settings: next };
    });
  },

  /** Add a global variable. */
  addVariable: (variable) => {
    set(s => {
      const next = {
        ...s.settings,
        variables: [...s.settings.variables, variable],
      };
      storage.saveSettings(next);
      return { settings: next };
    });
  },

  /** Update a variable by index. */
  updateVariable: (index, patch) => {
    set(s => {
      const variables = s.settings.variables.map((v, i) =>
        i === index ? { ...v, ...patch } : v
      );
      const next = { ...s.settings, variables };
      storage.saveSettings(next);
      return { settings: next };
    });
  },

  /** Delete a variable by index. */
  deleteVariable: (index) => {
    set(s => {
      const variables = s.settings.variables.filter((_, i) => i !== index);
      const next = { ...s.settings, variables };
      storage.saveSettings(next);
      return { settings: next };
    });
  },
}));
