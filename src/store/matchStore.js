import { create } from 'zustand';
import { load, save, remove, KEYS } from '../services/storage.js';
import {
  createInitialMatch,
  setOpeners,
  setNextBatter,
  setNextBowler,
  activateJoker,
  applyBall,
  retireBatter,
  undoLastBall,
  endInnings,
  startSecondInnings,
  availableBatters,
  availableBowlers,
  getInnings,
} from '../engine/index.js';

const initial = load(KEYS.active, null);

/**
 * Zustand store for the active match state.
 * Wraps engine functions and persists state to localStorage.
 */
export const useMatchStore = create((set, get) => ({
  match: initial,
  draft: null,
  setDraft: (draft) => set({ draft }),
  patchDraft: (patch) =>
    set((s) => ({ draft: { ...(s.draft || {}), ...patch } })),
  resetDraft: () => set({ draft: null }),

  /** Create a new match from config and persist. */
  createMatch: (cfg) => {
    const match = createInitialMatch(cfg);
    save(KEYS.active, match);
    set({ match });
    return match;
  },

  /** Set the opening batters and bowler. */
  setOpeners: (opts) => {
    const next = setOpeners(get().match, opts);
    save(KEYS.active, next);
    set({ match: next });
  },

  /** Set the next batter after a wicket or retirement. */
  setNextBatter: (id) => {
    const next = setNextBatter(get().match, id);
    save(KEYS.active, next);
    set({ match: next });
  },

  /** Set the next bowler for a new over. */
  setNextBowler: (id) => {
    const next = setNextBowler(get().match, id);
    save(KEYS.active, next);
    set({ match: next });
  },

  /** Activate the joker player. */
  activateJoker: (replaces) => {
    const next = activateJoker(get().match, { replaces });
    save(KEYS.active, next);
    set({ match: next });
  },

  /** Apply a ball event (run, wide, noball, bye, legbye, wicket). */
  applyBall: (event) => {
    const next = applyBall(get().match, event);
    save(KEYS.active, next);
    set({ match: next });
  },

  /** Retire a batter (hurt). Not a wicket. */
  retireBatter: ({ batterId, returnLater }) => {
    const next = retireBatter(get().match, { batterId, returnLater });
    save(KEYS.active, next);
    set({ match: next });
  },

  /** Undo the last ball or event. */
  undo: () => {
    const next = undoLastBall(get().match);
    save(KEYS.active, next);
    set({ match: next });
  },

  /** Manually end the current innings. */
  endInnings: () => {
    const next = endInnings(get().match);
    save(KEYS.active, next);
    set({ match: next });
  },

  /** Start the second innings with openers. */
  startSecondInnings: (opts) => {
    const next = startSecondInnings(get().match, opts);
    save(KEYS.active, next);
    set({ match: next });
  },

  /** Clear the active match from state and storage. */
  clearMatch: () => {
    remove(KEYS.active);
    set({ match: null, draft: null });
  },

  availableBatters: () => availableBatters(get().match || undefined),
  availableBowlers: () => availableBowlers(get().match || undefined),
  getCurrentInnings: () => getInnings(get().match || undefined),
}));
