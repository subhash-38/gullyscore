import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore.js';

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0f14' : '#ffffff');
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    setTheme,
  };
}
