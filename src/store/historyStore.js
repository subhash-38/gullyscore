import { create } from 'zustand';
import { load, save, KEYS } from '../services/storage.js';

const HISTORY_CAP = 50;

const initial = load(KEYS.history, null) || { matches: [] };

export const useHistoryStore = create((set, get) => ({
  matches: initial.matches, // newest first
  addMatch: (match) => {
    const next = [match, ...get().matches].slice(0, HISTORY_CAP);
    set({ matches: next });
    save(KEYS.history, { matches: next });
  },
  removeMatch: (id) => {
    const next = get().matches.filter((m) => m.id !== id);
    set({ matches: next });
    save(KEYS.history, { matches: next });
  },
  clearAll: () => {
    set({ matches: [] });
    save(KEYS.history, { matches: [] });
  },
}));
