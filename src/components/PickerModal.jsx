import Modal from './Modal.jsx';

export default function PickerModal({ open, onClose, title, options, onPick, emptyMessage }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {(!options || options.length === 0) ? (
        <p className="text-sm text-fg-muted py-4 text-center">
          {emptyMessage || 'No players available.'}
        </p>
      ) : (
        <ul className="space-y-1.5 max-h-72 overflow-y-auto">
          {options.map((o) => (
            <li key={o.id}>
              <button
                onClick={() => onPick(o.id)}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-bg-soft border border-border hover:border-brand hover:bg-brand/5 font-medium"
              >
                {o.name}
                {o.tag && (
                  <span className="ml-2 text-xs text-accent-yellow font-semibold">
                    {o.tag}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
