import { useState } from 'react';
import Modal from './Modal.jsx';
import { DISMISSAL_TYPES } from '../data/defaults.js';

export default function WicketModal({ open, onClose, onConfirm, freeHit, fielderOptions = [] }) {
  const [type, setType] = useState(null);
  const [fielderId, setFielderId] = useState(null);
  const [retiredOption, setRetiredOption] = useState('returnLater');
  const [runs, setRuns] = useState(0);

  const reset = () => {
    setType(null);
    setFielderId(null);
    setRetiredOption('returnLater');
    setRuns(0);
  };

  const close = () => {
    reset();
    onClose?.();
  };

  const confirm = () => {
    if (!type) return;
    const fielderName = fielderId
      ? fielderOptions.find((p) => p.id === fielderId)?.name || null
      : null;
    const dismissal = { type, fielderName };
    const payload = {
      kind: 'wicket',
      dismissal,
      runs: type === 'runout' ? Number(runs) || 0 : 0,
    };
    if (type === 'retired') {
      payload.returnLater = retiredOption === 'returnLater';
    }
    onConfirm?.(payload);
    reset();
  };

  const meta = type ? DISMISSAL_TYPES.find((d) => d.id === type) : null;
  const valid =
    type &&
    (!meta?.askCatcher || fielderId) &&
    (type !== 'retired' || retiredOption);

  return (
    <Modal
      open={open}
      onClose={close}
      title="How did the wicket fall?"
      footer={
        <>
          <button onClick={close} className="btn-secondary">
            Cancel
          </button>
          <button onClick={confirm} className="btn-danger" disabled={!valid}>
            Confirm wicket
          </button>
        </>
      }
    >
      {freeHit && (
        <div className="mb-3 text-xs font-semibold rounded-lg px-3 py-2 bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30">
          Free hit is on. Only run out counts here.
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {DISMISSAL_TYPES.map((d) => (
          <button
            key={d.id}
            onClick={() => setType(d.id)}
            className={`chip justify-center py-2.5 text-sm ${
              type === d.id ? '!bg-danger !text-white !border-danger' : ''
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {meta?.askCatcher && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-fg-muted mb-1.5">
            {meta.catcherLabel || 'Caught by'}
          </div>
          {fielderOptions.length === 0 ? (
            <div className="text-xs text-fg-dim italic">No fielders available.</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {fielderOptions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFielderId(p.id)}
                  className={`chip ${
                    fielderId === p.id ? '!bg-brand !text-white !border-brand' : ''
                  }`}
                >
                  {p.name}
                  {p.tag && (
                    <span className="ml-1 text-[10px] text-accent-yellow font-bold">{p.tag}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {type === 'runout' && (
        <div className="mt-3">
          <label className="block text-xs font-semibold text-fg-muted mb-1">
            Runs completed before run out
          </label>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setRuns(n)}
                className={`chip flex-1 justify-center py-2 ${
                  runs === n ? '!bg-brand !text-white !border-brand' : ''
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {type === 'retired' && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-fg-muted mb-1">
            Retired hurt option
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRetiredOption('returnLater')}
              className={`chip flex-1 justify-center py-2 ${
                retiredOption === 'returnLater' ? '!bg-brand !text-white !border-brand' : ''
              }`}
            >
              Will return later
            </button>
            <button
              onClick={() => setRetiredOption('inningsEnded')}
              className={`chip flex-1 justify-center py-2 ${
                retiredOption === 'inningsEnded' ? '!bg-brand !text-white !border-brand' : ''
              }`}
            >
              Innings ended
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
