const PREFIX = 'gs:';
const VERSION = 1;

function k(key) {
  return `${PREFIX}${key}`;
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(k(key));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && '__v' in parsed) {
      return parsed.data ?? fallback;
    }
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function save(key, data) {
  try {
    localStorage.setItem(k(key), JSON.stringify({ __v: VERSION, data }));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(k(key));
  } catch {}
}

export const KEYS = {
  players: 'players',
  settings: 'settings',
  history: 'history',
  active: 'active',
};
