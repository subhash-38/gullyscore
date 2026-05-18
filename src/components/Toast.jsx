import { useToastStore } from '../hooks/useToast.js';

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed top-3 left-0 right-0 z-50 flex flex-col items-center gap-2 px-3 pointer-events-none safe-top">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-2.5 rounded-full text-sm font-semibold shadow-pop animate-pop ${
            t.tone === 'success'
              ? 'bg-brand text-white'
              : t.tone === 'danger'
              ? 'bg-danger text-white'
              : t.tone === 'warn'
              ? 'bg-accent-yellow text-black'
              : 'bg-bg-card border border-border text-fg'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
