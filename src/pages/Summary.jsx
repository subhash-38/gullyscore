import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Trophy, RotateCw, Shuffle, UserPlus, UserMinus, Users, Coins, Home as HomeIcon, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { useHistoryStore } from '../store/historyStore.js';
import { useMatchStore } from '../store/matchStore.js';
import { fmt1, fmt2, formatOvers, strikeRate, economy, shortDateTime } from '../utils/format.js';

export default function Summary() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const matches = useHistoryStore((s) => s.matches);
  const setDraft = useMatchStore((s) => s.setDraft);
  const clearMatch = useMatchStore((s) => s.clearMatch);
  const navigate = useNavigate();

  const match = useMemo(() => matches.find((m) => m.id === id), [matches, id]);

  useEffect(() => {
    if (!match) {
      navigate('/history', { replace: true });
    }
  }, [match, navigate]);

  if (!match) return null;

  const { config, innings, result } = match;
  const inn1 = innings[0];
  const inn2 = innings[1];

  const topScorer = findTopScorer(innings);
  const bestBowler = findBestBowler(innings);

  const rematch = (mode) => {
    clearMatch();
    const players = [
      ...config.teams.A.players,
      ...config.teams.B.players,
      ...(config.joker ? [config.joker] : []),
    ];

    if (mode === 'same') {
      setDraft({
        overs: config.overs,
        teams: config.teams,
        joker: config.joker,
        rules: config.rules,
      });
      navigate('/toss');
      return;
    }
    if (mode === 'reshuffle') {
      const shuffled = [...players].sort(() => Math.random() - 0.5);
      const joker = config.joker ? shuffled.pop() : null;
      const half = Math.floor(shuffled.length / 2);
      setDraft({
        overs: config.overs,
        teams: {
          A: { name: config.teams.A.name, players: shuffled.slice(0, half) },
          B: { name: config.teams.B.name, players: shuffled.slice(half) },
        },
        joker,
        rules: config.rules,
      });
      navigate('/toss');
      return;
    }
    if (mode === 'winnerBatsFirst') {
      const winnerKey = result?.winner;
      if (!winnerKey) {
        navigate('/setup');
        return;
      }
      const winner = winnerKey;
      const loser = winner === 'A' ? 'B' : 'A';
      setDraft({
        overs: config.overs,
        teams: config.teams,
        joker: config.joker,
        rules: config.rules,
      });
      // Skip toss screen by writing match directly using winner as batting first.
      // We just route to toss page where user can confirm. For simplicity we still go to toss.
      navigate('/toss?winner=' + winner);
      return;
    }
    navigate('/setup');
  };

  return (
    <div className="space-y-4 pt-1">
      <SEO title={`Match Summary | Gullyscore`} description="Full scorecard, top scorer and best bowler." />

      <ResultBanner result={result} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <StatCard
          icon={Trophy}
          label="Top scorer"
          name={topScorer?.name || 'No runs'}
          detail={topScorer ? `${topScorer.runs} (${topScorer.balls}) · SR ${fmt1(strikeRate(topScorer.runs, topScorer.balls))}` : ''}
        />
        <StatCard
          icon={Trophy}
          label="Best bowler"
          name={bestBowler?.name || 'No wickets'}
          detail={bestBowler ? `${bestBowler.wickets}/${bestBowler.runs} in ${formatOvers(bestBowler.legalBalls)} · Econ ${fmt2(economy(bestBowler.runs, bestBowler.legalBalls))}` : ''}
        />
      </div>

      <InningsCard label="Innings 1" inn={inn1} config={config} />
      {inn2 && <InningsCard label="Innings 2" inn={inn2} config={config} />}

      <section className="card p-4">
        <div className="text-sm font-bold mb-2">What next?</div>
        <div className="grid grid-cols-2 gap-2">
          <ActionBtn icon={RotateCw} label="Rematch same teams" onClick={() => rematch('same')} />
          <ActionBtn icon={Shuffle} label="Reshuffle teams" onClick={() => rematch('reshuffle')} />
          <ActionBtn icon={UserPlus} label="Add players" onClick={() => navigate('/setup')} />
          <ActionBtn icon={UserMinus} label="Remove players" onClick={() => navigate('/setup')} />
          <ActionBtn icon={Users} label="Manual team change" onClick={() => navigate('/setup')} />
          <ActionBtn icon={Trophy} label="Winner bats first" onClick={() => rematch('winnerBatsFirst')} />
          <ActionBtn icon={Coins} label="Toss again" onClick={() => rematch('same')} />
          <ActionBtn icon={HomeIcon} label="Back to home" onClick={() => navigate('/')} />
        </div>
      </section>

      <div className="text-center pt-2">
        <Link to="/history" className="text-sm font-semibold text-brand">
          See all matches <ChevronRight className="inline h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ResultBanner({ result }) {
  if (!result) return null;
  return (
    <section className="card p-5 bg-gradient-to-br from-brand/15 to-bg-card border-brand/30">
      <div className="text-xs font-bold uppercase tracking-wider text-brand">Result</div>
      <div className="mt-1 text-xl font-extrabold">
        {result.marginType === 'tie'
          ? 'Match tied'
          : `${result.winnerName} won by ${result.margin} ${result.marginType}`}
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, name, detail }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="mt-1 font-bold text-lg">{name}</div>
      {detail && <div className="text-xs text-fg-muted mt-0.5">{detail}</div>}
    </div>
  );
}

function InningsCard({ label, inn, config }) {
  const battingName = config.teams[inn.battingTeam].name;
  const bowlingName = config.teams[inn.bowlingTeam].name;
  const batters = Object.values(inn.batters).filter((b) => b.didBat);
  const bowlers = Object.values(inn.bowlers).filter((b) => b.didBowl);

  const extrasTotal = inn.extras.wide + inn.extras.noBall + inn.extras.bye + inn.extras.legBye;

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-fg-muted uppercase tracking-wider">{label}</div>
          <div className="font-bold text-lg">{battingName}</div>
        </div>
        <div className="text-right">
          <div className="score-digit text-xl">
            {inn.runs}/{inn.wickets}
          </div>
          <div className="text-xs text-fg-muted font-mono">
            ({formatOvers(inn.legalBalls)})
          </div>
        </div>
      </div>

      {batters.length > 0 && (
        <div className="mt-3">
          <div className="text-[11px] font-bold uppercase text-fg-muted mb-1">Batting</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-fg-muted text-left">
                <th className="font-semibold py-1">Batter</th>
                <th className="font-semibold text-right">R</th>
                <th className="font-semibold text-right">B</th>
                <th className="font-semibold text-right">4s</th>
                <th className="font-semibold text-right">6s</th>
                <th className="font-semibold text-right">SR</th>
              </tr>
            </thead>
            <tbody>
              {batters.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="py-1.5">
                    <div className="font-medium">{b.name}</div>
                    <div className="text-[11px] text-fg-muted">
                      {b.out ? formatDismissal(b.dismissal) : b.notOut ? 'retired hurt' : 'not out'}
                    </div>
                  </td>
                  <td className="text-right font-mono font-bold">{b.runs}</td>
                  <td className="text-right font-mono">{b.balls}</td>
                  <td className="text-right font-mono">{b.fours}</td>
                  <td className="text-right font-mono">{b.sixes}</td>
                  <td className="text-right font-mono">{fmt1(strikeRate(b.runs, b.balls))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-xs text-fg-muted">
            Extras: {extrasTotal} (wd {inn.extras.wide}, nb {inn.extras.noBall}, b {inn.extras.bye}, lb {inn.extras.legBye})
          </div>
        </div>
      )}

      {bowlers.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase text-fg-muted mb-1">{bowlingName} bowling</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-fg-muted text-left">
                <th className="font-semibold py-1">Bowler</th>
                <th className="font-semibold text-right">O</th>
                <th className="font-semibold text-right">R</th>
                <th className="font-semibold text-right">W</th>
                <th className="font-semibold text-right">Econ</th>
              </tr>
            </thead>
            <tbody>
              {bowlers.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="py-1.5 font-medium">{b.name}</td>
                  <td className="text-right font-mono">{formatOvers(b.legalBalls)}</td>
                  <td className="text-right font-mono">{b.runs}</td>
                  <td className="text-right font-mono font-bold">{b.wickets}</td>
                  <td className="text-right font-mono">{fmt2(economy(b.runs, b.legalBalls))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function formatDismissal(d) {
  if (!d) return 'not out';
  switch (d.type) {
    case 'bowled':
      return `b ${d.bowler || ''}`;
    case 'caught':
      return `c ${d.fielder || ''} b ${d.bowler || ''}`;
    case 'runout':
      return `run out${d.fielder ? ' (' + d.fielder + ')' : ''}`;
    case 'stumped':
      return `st ${d.fielder || ''} b ${d.bowler || ''}`;
    case 'hitwicket':
      return `hit wkt b ${d.bowler || ''}`;
    case 'retired':
      return 'retired';
    default:
      return d.type;
  }
}

function findTopScorer(innings) {
  let best = null;
  for (const inn of innings) {
    for (const b of Object.values(inn.batters)) {
      if (!b.didBat) continue;
      if (!best || b.runs > best.runs) best = b;
    }
  }
  return best;
}

function findBestBowler(innings) {
  let best = null;
  for (const inn of innings) {
    for (const b of Object.values(inn.bowlers)) {
      if (!b.didBowl) continue;
      if (!best) {
        best = b;
        continue;
      }
      if (b.wickets > best.wickets || (b.wickets === best.wickets && b.runs < best.runs)) {
        best = b;
      }
    }
  }
  return best;
}

function ActionBtn({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="btn-secondary text-xs justify-start">
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
