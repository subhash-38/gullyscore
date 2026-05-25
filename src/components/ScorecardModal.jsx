import { useState } from 'react';
import Modal from './Modal.jsx';
import { fmt1, fmt2, formatOvers, strikeRate, economy, formatDismissal } from '../utils/format.js';

/**
 * ScorecardModal — popup modal showing the full mid-innings batting and bowling stats.
 * Allows toggling between innings if there are multiple innings.
 * @param {boolean} open - Whether the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {object} match - The current match state from store.
 */
export default function ScorecardModal({ open, onClose, match }) {
  const [activeTab, setActiveTab] = useState(match ? match.current : 0);

  if (!match) return null;

  const inn = match.innings[activeTab];
  if (!inn) return null;

  const config = match.config;
  const battingName = config.teams[inn.battingTeam].name;
  const bowlingName = config.teams[inn.bowlingTeam].name;

  // Filter players who did bat, or are currently on the crease
  const batters = Object.values(inn.batters).filter(
    (b) => b.didBat || b.id === inn.striker || b.id === inn.nonStriker
  );

  // Filter bowlers who did bowl, or is currently bowling
  const bowlers = Object.values(inn.bowlers).filter(
    (b) => b.didBowl || b.id === inn.bowler
  );

  const extrasTotal = inn.extras.wide + inn.extras.noBall + inn.extras.bye + inn.extras.legBye;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Live Scorecard"
      size="lg"
      footer={
        <button onClick={onClose} className="btn-secondary w-full py-2">
          Close
        </button>
      }
    >
      {match.innings.length > 1 && (
        <div className="flex gap-2 mb-4">
          {match.innings.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 chip justify-center py-2 text-xs font-extrabold ${
                activeTab === idx ? '!bg-brand !text-white !border-brand' : ''
              }`}
            >
              Innings {idx + 1} ({config.teams[match.innings[idx].battingTeam].name})
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
        {/* Innings Summary Banner */}
        <div className="card p-3.5 flex justify-between items-center bg-bg-soft/50 border border-border/60">
          <div>
            <div className="text-[10px] font-bold text-fg-muted uppercase tracking-wider">
              {battingName} batting
            </div>
            <div className="text-2xl font-extrabold mt-0.5">
              {inn.runs}/{inn.wickets}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-fg-muted uppercase tracking-wider">Overs</div>
            <div className="font-mono font-bold text-lg mt-0.5">
              {formatOvers(inn.legalBalls)}/{config.overs}
            </div>
          </div>
        </div>

        {/* Batting Section */}
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-fg-muted mb-1.5 px-1">
            Batting
          </div>
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-bg-card">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-bg-soft/40 text-[10px] text-fg-muted uppercase tracking-wider border-b border-border/40">
                  <th className="font-bold px-3 py-2">Batter</th>
                  <th className="font-bold text-right px-3 py-2">R</th>
                  <th className="font-bold text-right px-3 py-2">B</th>
                  <th className="font-bold text-right px-3 py-2">4s</th>
                  <th className="font-bold text-right px-3 py-2">6s</th>
                  <th className="font-bold text-right px-3 py-2">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {batters.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-fg-dim italic text-xs">
                      No batters have taken crease yet.
                    </td>
                  </tr>
                ) : (
                  batters.map((b) => {
                    const isStriker = b.id === inn.striker;
                    const isNonStriker = b.id === inn.nonStriker;
                    const onCrease = isStriker || isNonStriker;

                    return (
                      <tr key={b.id} className={`${onCrease ? 'bg-brand/5' : ''}`}>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-fg">
                              {b.name}
                            </span>
                            {isStriker && (
                              <span className="h-1.5 w-1.5 rounded-full bg-brand" title="Striker" />
                            )}
                            {isNonStriker && (
                              <span className="h-1.5 w-1.5 rounded-full bg-fg-muted" title="Non-striker" />
                            )}
                          </div>
                          <div className="text-[10px] text-fg-muted mt-0.5">
                            {b.out
                              ? formatDismissal(b.dismissal)
                              : b.notOut
                              ? 'retired hurt'
                              : onCrease
                              ? 'batting'
                              : 'yet to bat'}
                          </div>
                        </td>
                        <td className="text-right font-mono font-bold text-fg px-3 py-2">{b.runs}</td>
                        <td className="text-right font-mono text-fg-muted px-3 py-2">{b.balls}</td>
                        <td className="text-right font-mono text-fg-muted px-3 py-2">{b.fours}</td>
                        <td className="text-right font-mono text-fg-muted px-3 py-2">{b.sixes}</td>
                        <td className="text-right font-mono text-fg-muted px-3 py-2">
                          {fmt1(strikeRate(b.runs, b.balls))}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {batters.length > 0 && (
            <div className="mt-2 text-[10px] text-fg-muted bg-bg-soft/30 border border-border/30 rounded-lg p-2.5 font-mono">
              <span className="font-bold">Extras:</span> {extrasTotal} (wd {inn.extras.wide}, nb {inn.extras.noBall}, b {inn.extras.bye}, lb {inn.extras.legBye})
            </div>
          )}
        </div>

        {/* Bowling Section */}
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-fg-muted mb-1.5 px-1">
            {bowlingName} Bowling
          </div>
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-bg-card">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-bg-soft/40 text-[10px] text-fg-muted uppercase tracking-wider border-b border-border/40">
                  <th className="font-bold px-3 py-2">Bowler</th>
                  <th className="font-bold text-right px-3 py-2">O</th>
                  <th className="font-bold text-right px-3 py-2">R</th>
                  <th className="font-bold text-right px-3 py-2">W</th>
                  <th className="font-bold text-right px-3 py-2">Econ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {bowlers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-fg-dim italic text-xs">
                      No bowling stats recorded yet.
                    </td>
                  </tr>
                ) : (
                  bowlers.map((b) => {
                    const isActive = b.id === inn.bowler;
                    return (
                      <tr key={b.id} className={`${isActive ? 'bg-brand/5' : ''}`}>
                        <td className="px-3 py-2 font-semibold text-fg flex items-center gap-1.5">
                          {b.name}
                          {isActive && <span className="text-[10px] text-brand" title="Current bowler">🏏</span>}
                        </td>
                        <td className="text-right font-mono text-fg-muted px-3 py-2">{formatOvers(b.legalBalls)}</td>
                        <td className="text-right font-mono text-fg-muted px-3 py-2">{b.runs}</td>
                        <td className="text-right font-mono font-bold text-fg px-3 py-2">{b.wickets}</td>
                        <td className="text-right font-mono text-fg-muted px-3 py-2">
                          {fmt2(economy(b.runs, b.legalBalls))}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
