import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Trash2, ChevronRight, Trophy } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { useHistoryStore } from '../store/historyStore.js';
import { shortDateTime, formatOvers } from '../utils/format.js';

export default function History() {
  const matches = useHistoryStore((s) => s.matches);
  const removeMatch = useHistoryStore((s) => s.removeMatch);
  const clearAll = useHistoryStore((s) => s.clearAll);
  const [params] = useSearchParams();
  const focusId = params.get('id');

  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const sorted = useMemo(
    () => [...matches].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [matches],
  );

  return (
    <div className="space-y-3 pt-1">
      <SEO title="Match History | Gullyscore" description="Browse your locally saved gully cricket matches." />

      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Match history</h1>
        {sorted.length > 0 && (
          <button
            onClick={() => setConfirmClearAll(true)}
            className="btn-ghost text-xs text-fg-muted"
          >
            Clear all
          </button>
        )}
      </header>

      {sorted.length === 0 ? (
        <div className="card p-8 text-center">
          <Trophy className="h-10 w-10 mx-auto text-fg-dim mb-2" />
          <p className="text-sm text-fg-muted">No saved matches yet.</p>
          <Link to="/setup" className="btn-primary mt-3 inline-flex">
            Start a match
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {sorted.map((m) => {
            const inn1 = m.innings?.[0];
            const inn2 = m.innings?.[1];
            const teamA = m.config.teams.A.name;
            const teamB = m.config.teams.B.name;
            const highlight = m.id === focusId;
            return (
              <li key={m.id}>
                <div
                  className={`card p-4 ${highlight ? 'border-brand bg-brand/5' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <Link to={`/summary?id=${m.id}`} className="flex-1 min-w-0">
                      <div className="text-xs text-fg-muted">
                        {shortDateTime(m.createdAt)} · {m.config.overs} overs
                      </div>
                      <div className="font-bold mt-1">
                        {m.result?.winnerName || 'Match'}{' '}
                        <span className="text-fg-muted font-normal text-sm">
                          {m.result?.marginType === 'runs'
                            ? `won by ${m.result.margin} runs`
                            : m.result?.marginType === 'wickets'
                            ? `won by ${m.result.margin} wickets`
                            : m.result?.marginType === 'tie'
                            ? 'tied'
                            : ''}
                        </span>
                      </div>
                      <div className="text-sm text-fg-muted mt-1.5 font-mono">
                        {inn1 && (
                          <>
                            {m.config.teams[inn1.battingTeam].name}: {inn1.runs}/{inn1.wickets}{' '}
                            ({formatOvers(inn1.legalBalls)})
                          </>
                        )}
                        {inn2 && (
                          <>
                            {' · '}
                            {m.config.teams[inn2.battingTeam].name}: {inn2.runs}/{inn2.wickets}{' '}
                            ({formatOvers(inn2.legalBalls)})
                          </>
                        )}
                      </div>
                    </Link>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => setConfirmDeleteId(m.id)}
                        className="text-fg-dim hover:text-danger p-1"
                        aria-label="Delete match"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/summary?id=${m.id}`}
                        className="text-brand"
                        aria-label="Open"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        open={confirmClearAll}
        onClose={() => setConfirmClearAll(false)}
        onConfirm={clearAll}
        title="Clear all matches?"
        message="This will permanently delete all saved match history. This action cannot be undone."
      />

      <ConfirmModal
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => removeMatch(confirmDeleteId)}
        title="Delete this match?"
        message="This match will be permanently removed from your history."
      />
    </div>
  );
}
