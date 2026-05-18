import { create } from 'zustand';
import { load, save, remove, KEYS } from '../services/storage.js';
import {
  createInitialMatch,
  setOpeners,
  setNextBatter,
  setNextBowler,
  activateJoker,
  applyBall,
  undoLastBall,
  endInnings,
  startSecondInnings,
  availableBatters,
  availableBowlers,
  getInnings,
} from '../engine/index.js';

const initial = load(KEYS.active, null);

export const useMatchStore = create((set, get) => ({
  match: initial,
  draft: null,
  setDraft: (draft) => set({ draft }),
  patchDraft: (patch) =>
    set((s) => ({ draft: { ...(s.draft || {}), ...patch } })),
  resetDraft: () => set({ draft: null }),

  createMatch: (cfg) => {
    const match = createInitialMatch(cfg);
    save(KEYS.active, match);
    set({ match });
    return match;
  },

  setOpeners: (opts) => {
    const next = setOpeners(get().match, opts);
    save(KEYS.active, next);
    set({ match: next });
  },

  setNextBatter: (id) => {
    const next = setNextBatter(get().match, id);
    save(KEYS.active, next);
    set({ match: next });
  },

  setNextBowler: (id) => {
    const next = setNextBowler(get().match, id);
    save(KEYS.active, next);
    set({ match: next });
  },

  activateJoker: (replaces) => {
    const next = activateJoker(get().match, { replaces });
    save(KEYS.active, next);
    set({ match: next });
  },

  applyBall: (event) => {
    const next = applyBall(get().match, event);
    save(KEYS.active, next);
    set({ match: next });
  },

  undo: () => {
    const next = undoLastBall(get().match);
    save(KEYS.active, next);
    set({ match: next });
  },

  endInnings: () => {
    const next = endInnings(get().match);
    save(KEYS.active, next);
    set({ match: next });
  },

  startSecondInnings: (opts) => {
    const next = startSecondInnings(get().match, opts);
    save(KEYS.active, next);
    set({ match: next });
  },

  clearMatch: () => {
    remove(KEYS.active);
    set({ match: null, draft: null });
  },

  availableBatters: () => availableBatters(get().match || undefined),
  availableBowlers: () => availableBowlers(get().match || undefined),
  getCurrentInnings: () => getInnings(get().match || undefined),
}));
