import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${widths[size]} mx-auto bg-bg-card border border-border rounded-t-3xl sm:rounded-2xl shadow-pop animate-slide-up safe-bottom`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto -mr-2 h-9 w-9 rounded-full hover:bg-bg-soft flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 pb-5">{children}</div>
        {footer && (
          <div className="px-5 pb-5 pt-2 border-t border-border flex gap-2 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
