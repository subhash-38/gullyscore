import { create } from 'zustand';
import { load, save, KEYS } from '../services/storage.js';
import { DEFAULT_RULES } from '../data/defaults.js';

const initial = load(KEYS.settings, null) || {
  theme: 'dark',
  defaultOvers: 5,
  defaultRules: DEFAULT_RULES,
};

export const useSettingsStore = create((set, get) => ({
  ...initial,
  setTheme: (theme) => {
    set({ theme });
    save(KEYS.settings, { ...get() });
  },
  setDefaultOvers: (n) => {
    set({ defaultOvers: n });
    save(KEYS.settings, { ...get() });
  },
  setDefaultRules: (rules) => {
    set({ defaultRules: rules });
    save(KEYS.settings, { ...get() });
  },
}));
