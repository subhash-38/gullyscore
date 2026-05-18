import { create } from 'zustand';
import { load, save, KEYS } from '../services/storage.js';
import { uid } from '../utils/id.js';

const initial = load(KEYS.players, null) || { pool: [] };

export const usePlayersStore = create((set, get) => ({
  pool: initial.pool,
  addPlayer: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const existing = get().pool.find(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      const pool = get().pool.map((p) =>
        p.id === existing.id ? { ...p, lastUsed: Date.now() } : p,
      );
      set({ pool });
      save(KEYS.players, { pool });
      return existing;
    }
    const player = { id: uid('p'), name: trimmed, lastUsed: Date.now() };
    const pool = [...get().pool, player];
    set({ pool });
    save(KEYS.players, { pool });
    return player;
  },
  removePlayer: (id) => {
    const pool = get().pool.filter((p) => p.id !== id);
    set({ pool });
    save(KEYS.players, { pool });
  },
  touchPlayers: (ids) => {
    const now = Date.now();
    const pool = get().pool.map((p) =>
      ids.includes(p.id) ? { ...p, lastUsed: now } : p,
    );
    set({ pool });
    save(KEYS.players, { pool });
  },
  clearAll: () => {
    set({ pool: [] });
    save(KEYS.players, { pool: [] });
  },
}));
