import { useState } from 'react';
import Modal from './Modal.jsx';

export default function JokerModal({ open, onClose, onConfirm, jokerName, hasStriker, hasNonStriker }) {
  const [replaces, setReplaces] = useState(hasStriker ? 'striker' : 'new');

  const close = () => {
    setReplaces(hasStriker ? 'striker' : 'new');
    onClose?.();
  };

  const confirm = () => {
    onConfirm?.(replaces);
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Bring in the joker"
      footer={
        <>
          <button onClick={close} className="btn-secondary">
            Cancel
          </button>
          <button onClick={confirm} className="btn-primary">
            Bring in {jokerName}
          </button>
        </>
      }
    >
      <p className="text-sm text-fg-muted mb-3">
        Choose how {jokerName} comes in.
      </p>
      <div className="space-y-2">
        {hasStriker && (
          <Option
            id="striker"
            checked={replaces === 'striker'}
            onChange={setReplaces}
            label="Replace striker"
            sub="Joker takes the strike."
          />
        )}
        {hasNonStriker && (
          <Option
            id="nonStriker"
            checked={replaces === 'nonStriker'}
            onChange={setReplaces}
            label="Replace non striker"
            sub="Joker takes the non strike end."
          />
        )}
        <Option
          id="new"
          checked={replaces === 'new'}
          onChange={setReplaces}
          label="Fill the empty slot"
          sub="Joker takes whichever batter slot is open."
        />
      </div>
    </Modal>
  );
}

function Option({ id, checked, onChange, label, sub }) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer ${
        checked ? 'border-brand bg-brand/5' : 'border-border bg-bg-soft'
      }`}
    >
      <input
        type="radio"
        name="jokerReplaces"
        checked={checked}
        onChange={() => onChange(id)}
        className="mt-1 accent-brand"
      />
      <div>
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-fg-muted">{sub}</div>
      </div>
    </label>
  );
}
