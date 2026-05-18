import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],
  show: (message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    const toast = { id, message, tone: opts.tone || 'default', duration: opts.duration || 1600 };
    set({ toasts: [...get().toasts, toast] });
    setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) });
    }, toast.duration);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
