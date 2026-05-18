import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, ChevronRight, ChevronLeft } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { useMatchStore } from '../store/matchStore.js';
import { useToastStore } from '../hooks/useToast.js';

export default function Toss() {
  const navigate = useNavigate();
  const draft = useMatchStore((s) => s.draft);
  const createMatch = useMatchStore((s) => s.createMatch);
  const show = useToastStore((s) => s.show);

  const [phase, setPhase] = useState('ask'); // 'ask' | 'flip' | 'decide'
  const [flipping, setFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState(null); // 'H' | 'T'
  const [call, setCall] = useState(null); // 'H' | 'T'
  const [winner, setWinner] = useState(null); // 'A' | 'B'
  const [decision, setDecision] = useState(null); // 'bat' | 'bowl'

  useEffect(() => {
    if (!draft) navigate('/setup', { replace: true });
  }, [draft, navigate]);

  if (!draft) return null;

  const { teams } = draft;

  const startFlip = () => {
    setFlipping(true);
    setFlipResult(null);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? 'H' : 'T';
      setFlipResult(r);
      setFlipping(false);
    }, 1200);
  };

  const confirmToss = () => {
    if (!winner || !decision) return;
    createMatch({
      overs: draft.overs,
      teams: draft.teams,
      joker: draft.joker,
      rules: draft.rules,
      toss: { winner, decision },
    });
    show(`${teams[winner].name} chose to ${decision} first`, { tone: 'success' });
    navigate('/match');
  };

  return (
    <div className="space-y-4 pt-1">
      <SEO title="Toss | Gullyscore" description="Decide the toss for your match." />

      {phase === 'ask' && (
        <section className="card p-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Coins className="h-5 w-5" /> Has the toss been decided?
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            <button
              onClick={() => setPhase('decide')}
              className="btn-primary"
            >
              Yes, pick winner and decision
            </button>
            <button onClick={() => setPhase('flip')} className="btn-secondary">
              No, flip the coin
            </button>
          </div>
        </section>
      )}

      {phase === 'flip' && (
        <section className="card p-5 text-center">
          <h2 className="text-lg font-bold">Coin flip</h2>
          <p className="text-sm text-fg-muted mt-1">Call heads or tails, then flip.</p>

          <div className="my-6 flex justify-center">
            <div
              className={`relative h-32 w-32 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-pop flex items-center justify-center text-4xl font-extrabold text-yellow-900 ${
                flipping ? 'animate-flip' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {flipping ? '…' : flipResult || '?'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setCall('H')}
              className={`chip justify-center py-2 ${call === 'H' ? '!bg-brand !text-white !border-brand' : ''}`}
            >
              Heads
            </button>
            <button
              onClick={() => setCall('T')}
              className={`chip justify-center py-2 ${call === 'T' ? '!bg-brand !text-white !border-brand' : ''}`}
            >
              Tails
            </button>
          </div>

          <button
            onClick={startFlip}
            className="btn-primary w-full"
            disabled={!call || flipping}
          >
            {flipping ? 'Flipping…' : 'Flip!'}
          </button>

          {flipResult && !flipping && (
            <div className="mt-4 animate-fade-in">
              <div className="text-sm">
                Result: <span className="font-bold">{flipResult === 'H' ? 'Heads' : 'Tails'}</span>
              </div>
              <div className="mt-1 text-base font-semibold">
                {call === flipResult ? 'You won the toss!' : 'You lost the toss.'}
              </div>
              <div className="mt-4 text-xs font-semibold text-fg-muted">
                Who won?
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setWinner('A')}
                  className={`chip justify-center py-2 ${winner === 'A' ? '!bg-brand !text-white !border-brand' : ''}`}
                >
                  {teams.A.name}
                </button>
                <button
                  onClick={() => setWinner('B')}
                  className={`chip justify-center py-2 ${winner === 'B' ? '!bg-brand !text-white !border-brand' : ''}`}
                >
                  {teams.B.name}
                </button>
              </div>
              {winner && (
                <>
                  <div className="mt-4 text-xs font-semibold text-fg-muted">
                    Decision
                  </div>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDecision('bat')}
                      className={`chip justify-center py-2 ${decision === 'bat' ? '!bg-brand !text-white !border-brand' : ''}`}
                    >
                      Bat first
                    </button>
                    <button
                      onClick={() => setDecision('bowl')}
                      className={`chip justify-center py-2 ${decision === 'bowl' ? '!bg-brand !text-white !border-brand' : ''}`}
                    >
                      Bowl first
                    </button>
                  </div>
                </>
              )}
              <button
                className="btn-primary w-full mt-4"
                disabled={!winner || !decision}
                onClick={confirmToss}
              >
                Start Match <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="mt-4">
            <button onClick={() => setPhase('ask')} className="btn-ghost text-sm">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </section>
      )}

      {phase === 'decide' && (
        <section className="card p-5">
          <h2 className="text-lg font-bold">Who won the toss?</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setWinner('A')}
              className={`chip justify-center py-3 text-base ${winner === 'A' ? '!bg-brand !text-white !border-brand' : ''}`}
            >
              {teams.A.name}
            </button>
            <button
              onClick={() => setWinner('B')}
              className={`chip justify-center py-3 text-base ${winner === 'B' ? '!bg-brand !text-white !border-brand' : ''}`}
            >
              {teams.B.name}
            </button>
          </div>

          {winner && (
            <>
              <div className="mt-5 text-sm font-semibold">Decision</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDecision('bat')}
                  className={`chip justify-center py-3 text-base ${decision === 'bat' ? '!bg-brand !text-white !border-brand' : ''}`}
                >
                  Bat first
                </button>
                <button
                  onClick={() => setDecision('bowl')}
                  className={`chip justify-center py-3 text-base ${decision === 'bowl' ? '!bg-brand !text-white !border-brand' : ''}`}
                >
                  Bowl first
                </button>
              </div>
            </>
          )}

          <div className="mt-5 flex justify-between">
            <button onClick={() => setPhase('ask')} className="btn-secondary">
              <ChevronLeft className="h-5 w-5" /> Back
            </button>
            <button
              onClick={confirmToss}
              className="btn-primary"
              disabled={!winner || !decision}
            >
              Start Match <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
