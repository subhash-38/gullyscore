import { useState } from 'react';
import Modal from './Modal.jsx';

/**
 * RetiredHurtModal — allows either the striker or non-striker to retire hurt.
 * This is NOT a wicket — it doesn't count as a dismissal or increment the wickets count.
 * The retired batter can optionally return later in the innings.
 *
 * @param {boolean} open - Whether the modal is visible.
 * @param {function} onClose - Called when user cancels.
 * @param {function} onConfirm - Called with { batterId, returnLater }.
 * @param {object|null} striker - Current striker batter object ({ id, name }).
 * @param {object|null} nonStriker - Current non-striker batter object ({ id, name }).
 */
export default function RetiredHurtModal({
  open,
  onClose,
  onConfirm,
  striker = null,
  nonStriker = null,
}) {
  const [selectedBatter, setSelectedBatter] = useState(null);
  const [returnOption, setReturnOption] = useState('returnLater');

  /** Reset all local state. */
  const reset = () => {
    setSelectedBatter(null);
    setReturnOption('returnLater');
  };

  /** Close modal and reset. */
  const close = () => {
    reset();
    onClose?.();
  };

  /** Confirm the retirement. */
  const confirm = () => {
    if (!selectedBatter) return;
    onConfirm?.({
      batterId: selectedBatter,
      returnLater: returnOption === 'returnLater',
    });
    reset();
  };

  const valid = !!selectedBatter;

  return (
    <Modal
      open={open}
      onClose={close}
      title="Retired Hurt"
      footer={
        <>
          <button onClick={close} className="btn-secondary">
            Cancel
          </button>
          <button onClick={confirm} className="btn-primary" disabled={!valid}>
            Confirm
          </button>
        </>
      }
    >
      <div className="mb-3 text-xs font-semibold rounded-lg px-3 py-2 bg-accent-orange/15 text-accent-orange border border-accent-orange/30">
        Retired hurt is not a wicket. The batter can return later if needed.
      </div>

      {/* Who wants to retire? */}
      <div>
        <div className="text-xs font-semibold text-fg-muted mb-1.5">
          Who wants to retire?
        </div>
        <div className="flex gap-2">
          {striker && (
            <button
              onClick={() => setSelectedBatter(striker.id)}
              className={`chip flex-1 justify-center py-2.5 text-sm ${
                selectedBatter === striker.id
                  ? '!bg-accent-orange !text-white !border-accent-orange'
                  : ''
              }`}
            >
              <span className="font-semibold">{striker.name}</span>
              <span className="text-[10px] opacity-75 ml-1">(Striker)</span>
            </button>
          )}
          {nonStriker && (
            <button
              onClick={() => setSelectedBatter(nonStriker.id)}
              className={`chip flex-1 justify-center py-2.5 text-sm ${
                selectedBatter === nonStriker.id
                  ? '!bg-accent-orange !text-white !border-accent-orange'
                  : ''
              }`}
            >
              <span className="font-semibold">{nonStriker.name}</span>
              <span className="text-[10px] opacity-75 ml-1">(Non-Striker)</span>
            </button>
          )}
        </div>
      </div>

      {/* Return option */}
      {selectedBatter && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-fg-muted mb-1.5">
            Will they return later?
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReturnOption('returnLater')}
              className={`chip flex-1 justify-center py-2 text-sm ${
                returnOption === 'returnLater'
                  ? '!bg-brand !text-white !border-brand'
                  : ''
              }`}
            >
              Yes, will return
            </button>
            <button
              onClick={() => setReturnOption('wontReturn')}
              className={`chip flex-1 justify-center py-2 text-sm ${
                returnOption === 'wontReturn'
                  ? '!bg-brand !text-white !border-brand'
                  : ''
              }`}
            >
              No, won't return
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
