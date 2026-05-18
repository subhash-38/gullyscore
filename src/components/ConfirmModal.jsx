import Modal from './Modal.jsx';

export default function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-fg-muted mb-5">{message}</p>
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="btn-primary !bg-danger hover:!bg-red-600"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
