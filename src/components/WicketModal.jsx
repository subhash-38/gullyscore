import { useState } from 'react';
import Modal from './Modal.jsx';
import { DISMISSAL_TYPES } from '../data/defaults.js';

/**
 * WicketModal — asks user for dismissal type, fielder, and (for runout) which batter is out.
 * @param {boolean} open - Whether the modal is visible.
 * @param {function} onClose - Called when user cancels.
 * @param {function} onConfirm - Called with the wicket payload.
 * @param {boolean} freeHit - Whether a free hit is active (only runout counts).
 * @param {Array} fielderOptions - List of fielders for caught/stumped/runout.
 * @param {string|null} strikerName - Name of the current striker.
 * @param {string|null} nonStrikerName - Name of the current non-striker.
 */
export default function WicketModal({
  open,
  onClose,
  onConfirm,
  freeHit,
  fielderOptions = [],
  strikerName = null,
  nonStrikerName = null,
}) {
  const [type, setType] = useState(null);
  const [fielderId, setFielderId] = useState(null);
  const [runs, setRuns] = useState(0);
  const [outBatter, setOutBatter] = useState('striker');
  const [crossed, setCrossed] = useState(false);

  /** Reset all local state to defaults. */
  const reset = () => {
    setType(null);
    setFielderId(null);
    setRuns(0);
    setOutBatter('striker');
    setCrossed(false);
  };

  /** Close modal and reset state. */
  const close = () => {
    reset();
    onClose?.();
  };

  /** Build payload and confirm the wicket. */
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
    // For runout, tell the engine which batter is out and if they crossed
    if (type === 'runout') {
      payload.dismissal.outBatter = outBatter;
      payload.dismissal.crossed = crossed;
    }
    onConfirm?.(payload);
    reset();
  };

  const meta = type ? DISMISSAL_TYPES.find((d) => d.id === type) : null;
  const valid =
    type &&
    (!meta?.askCatcher || fielderId) &&
    (type !== 'runout' || outBatter);

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
        <>
          {/* Who got run out? */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-fg-muted mb-1.5">
              Who got run out?
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setOutBatter('striker')}
                className={`chip flex-1 justify-center py-2.5 ${
                  outBatter === 'striker' ? '!bg-danger !text-white !border-danger' : ''
                }`}
              >
                <span className="font-semibold">{strikerName || 'Striker'}</span>
                <span className="text-[10px] opacity-75 ml-1">(Striker)</span>
              </button>
              {nonStrikerName && (
                <button
                  onClick={() => setOutBatter('nonStriker')}
                  className={`chip flex-1 justify-center py-2.5 ${
                    outBatter === 'nonStriker' ? '!bg-danger !text-white !border-danger' : ''
                  }`}
                >
                  <span className="font-semibold">{nonStrikerName || 'Non-Striker'}</span>
                  <span className="text-[10px] opacity-75 ml-1">(Non-Striker)</span>
                </button>
              )}
            </div>
          </div>

          {/* Runs completed before run out */}
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

          {/* Did the batters cross? */}
          <div className="mt-4 flex items-center justify-between card p-3 border-dashed border-border">
            <div>
              <div className="text-xs font-bold">Did the batters cross?</div>
              <div className="text-[10px] text-fg-muted mt-0.5">
                Toggle if they crossed ends during the runout attempt
              </div>
            </div>
            <button
              onClick={() => setCrossed(!crossed)}
              className={`chip px-4 py-2 font-bold ${
                crossed ? '!bg-brand !text-white !border-brand' : ''
              }`}
            >
              {crossed ? 'Yes' : 'No'}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
