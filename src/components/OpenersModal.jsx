import { useState } from 'react';
import Modal from './Modal.jsx';

export default function OpenersModal({ open, onClose, onConfirm, batters, bowlers, title }) {
  const [strikerId, setStrikerId] = useState(null);
  const [nonStrikerId, setNonStrikerId] = useState(null);
  const [bowlerId, setBowlerId] = useState(null);

  const valid = strikerId && nonStrikerId && bowlerId && strikerId !== nonStrikerId;

  const confirm = () => {
    if (!valid) return;
    onConfirm?.({ strikerId, nonStrikerId, bowlerId });
    setStrikerId(null);
    setNonStrikerId(null);
    setBowlerId(null);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || 'Pick openers and bowler'}
      footer={
        <button onClick={confirm} className="btn-primary" disabled={!valid}>
          Start
        </button>
      }
      size="lg"
    >
      <Group
        label="Striker"
        options={batters}
        value={strikerId}
        onChange={setStrikerId}
        disabledId={nonStrikerId}
      />
      <Group
        label="Non striker"
        options={batters}
        value={nonStrikerId}
        onChange={setNonStrikerId}
        disabledId={strikerId}
      />
      <Group label="Bowler" options={bowlers} value={bowlerId} onChange={setBowlerId} />
    </Modal>
  );
}

function Group({ label, options, value, onChange, disabledId }) {
  return (
    <div className="mt-3 first:mt-0">
      <div className="text-xs font-semibold text-fg-muted mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const disabled = o.id === disabledId;
          return (
            <button
              key={o.id}
              disabled={disabled}
              onClick={() => onChange(o.id)}
              className={`chip ${value === o.id ? '!bg-brand !text-white !border-brand' : ''} ${
                disabled ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              {o.name}
              {o.tag && (
                <span className="ml-1 text-[10px] text-accent-yellow font-bold">{o.tag}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
