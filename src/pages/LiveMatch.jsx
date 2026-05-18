import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Undo2,
  Sparkles,
  StopCircle,
  Skull,
  Home as HomeIcon,
} from 'lucide-react';
import SEO from '../components/SEO.jsx';
import BallTimeline from '../components/BallTimeline.jsx';
import WicketModal from '../components/WicketModal.jsx';
import JokerModal from '../components/JokerModal.jsx';
import PickerModal from '../components/PickerModal.jsx';
import OpenersModal from '../components/OpenersModal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { useMatchStore } from '../store/matchStore.js';
import { useHistoryStore } from '../store/historyStore.js';
import { useToastStore } from '../hooks/useToast.js';
import {
  formatOvers,
  runRate,
  requiredRunRate,
  strikeRate,
  economy,
  fmt1,
  fmt2,
} from '../utils/format.js';
import { availableBatters, availableBowlers } from '../engine/index.js';

export default function LiveMatch() {
  const navigate = useNavigate();
  const match = useMatchStore((s) => s.match);
  const setOpeners = useMatchStore((s) => s.setOpeners);
  const setNextBatter = useMatchStore((s) => s.setNextBatter);
  const setNextBowler = useMatchStore((s) => s.setNextBowler);
  const applyBall = useMatchStore((s) => s.applyBall);
  const undo = useMatchStore((s) => s.undo);
  const endInnings = useMatchStore((s) => s.endInnings);
  const startSecond = useMatchStore((s) => s.startSecondInnings);
  const activateJokerStore = useMatchStore((s) => s.activateJoker);
  const clearMatch = useMatchStore((s) => s.clearMatch);
  const addToHistory = useHistoryStore((s) => s.addMatch);
  const showToast = useToastStore((s) => s.show);

  const [wicketOpen, setWicketOpen] = useState(false);
  const [jokerOpen, setJokerOpen] = useState(false);
  const [endInningsOpen, setEndInningsOpen] = useState(false);
  const [extrasMode, setExtrasMode] = useState(null);

  useEffect(() => {
    if (!match) navigate('/', { replace: true });
  }, [match, navigate]);

  useEffect(() => {
    if (match?.status === 'complete') {
      addToHistory(snapshotForHistory(match));
      const id = match.id;
      clearMatch();
      navigate(`/summary?id=${id}`, { replace: true });
    }
  }, [match?.status]);

  if (!match) return null;

  const inn = match.innings[match.current];
  const cfg = match.config;
  const battingTeam = cfg.teams[inn.battingTeam];
  const bowlingTeam = cfg.teams[inn.bowlingTeam];

  const needOpeners = !inn.striker && !inn.nonStriker && !inn.bowler && match.status === 'live';
  const needNextBatter = match.status === 'live' && (!inn.striker || (!inn.nonStriker && !inn.singleBatterMode)) && !needOpeners;
  const needNextBowler = match.status === 'live' && !inn.bowler && (inn.striker || needNextBatter) && !needOpeners;
  const isInningsBreak = match.status === 'inningsBreak';

  const batterOptions = useMemo(() => {
    if (!match) return [];
    const ids = availableBatters(match, inn);
    return ids.map((id) => {
      const b = inn.batters[id];
      const isJoker = cfg.joker && id === cfg.joker.id;
      return { id, name: b?.name || id, tag: isJoker ? 'JOKER' : null };
    });
  }, [match, inn, cfg.joker]);

  const bowlerOptions = useMemo(() => {
    if (!match) return [];
    const ids = availableBowlers(match, inn);
    return ids.map((id) => {
      const b = inn.bowlers[id];
      return { id, name: b?.name || id };
    });
  }, [match, inn]);

  const fielderOptions = useMemo(() => {
    if (!match) return [];
    const teamPlayers = cfg.teams[inn.bowlingTeam].players;
    const list = teamPlayers.map((p) => ({ id: p.id, name: p.name }));
    if (cfg.joker && !inn.jokerActive) {
      list.push({ id: cfg.joker.id, name: cfg.joker.name, tag: 'JOKER' });
    }
    return list;
  }, [match, inn, cfg]);

  const striker = inn.striker ? inn.batters[inn.striker] : null;
  const nonStriker = inn.nonStriker ? inn.batters[inn.nonStriker] : null;
  const bowler = inn.bowler ? inn.bowlers[inn.bowler] : null;

  const target = inn.target;
  const ballsLeft = cfg.overs * 6 - inn.legalBalls;
  const runsNeeded = target ? target - inn.runs : null;

  const onRun = (n) => {
    if (extrasMode === 'bye') {
      applyBall({ kind: 'bye', runs: n });
      setExtrasMode(null);
      flash(`Bye ${n}`);
    } else if (extrasMode === 'legbye') {
      applyBall({ kind: 'legbye', runs: n });
      setExtrasMode(null);
      flash(`Leg bye ${n}`);
    } else if (extrasMode === 'wide') {
      applyBall({ kind: 'wide', runs: n });
      setExtrasMode(null);
      flash(n > 0 ? `Wide + ${n}` : 'Wide');
    } else if (extrasMode === 'noball') {
      applyBall({ kind: 'noball', runs: n });
      setExtrasMode(null);
      flash(n === 4 ? 'No ball + FOUR' : n === 6 ? 'No ball + SIX' : n > 0 ? `No ball + ${n}` : 'No ball');
    } else {
      applyBall({ kind: 'run', runs: n });
      flash(n === 4 ? 'FOUR' : n === 6 ? 'SIX' : n === 0 ? 'Dot' : `${n} run${n > 1 ? 's' : ''}`);
    }
  };

  const onWide = () => {
    setExtrasMode((m) => (m === 'wide' ? null : 'wide'));
  };
  const onNoBall = () => {
    setExtrasMode((m) => (m === 'noball' ? null : 'noball'));
  };

  const onWicket = (payload) => {
    setWicketOpen(false);
    if (payload.dismissal?.type === 'retired' && payload.returnLater === false) {
      applyBall(payload);
      endInnings();
      flash('Innings ended');
      return;
    }
    applyBall(payload);
    flash('Wicket!');
  };

  const onActivateJoker = (replaces) => {
    activateJokerStore(replaces);
    flash(`${cfg.joker.name} is in`);
  };

  const onEndInnings = () => {
    setEndInningsOpen(true);
  };

  const flash = (msg) => showToast(msg);

  const wideEnabled = true;
  const noBallEnabled = true;
  const byeEnabled = cfg.rules.bye;
  const legByeEnabled = cfg.rules.legBye;
  const jokerCanCome = cfg.joker && !inn.jokerActive && !inn.jokerOut && match.status === 'live';

  return (
    <div className="pb-2 -mx-4 px-4">
      <SEO title={`${battingTeam.name} batting | Gullyscore`} description="Live scoring in progress." />

      <ScoreHeader
        battingName={battingTeam.name}
        runs={inn.runs}
        wickets={inn.wickets}
        overs={formatOvers(inn.legalBalls)}
        oversTotal={cfg.overs}
        crr={runRate(inn.runs, inn.legalBalls)}
        target={target}
        runsNeeded={runsNeeded}
        ballsLeft={ballsLeft}
        rrr={target ? requiredRunRate(runsNeeded, ballsLeft) : null}
        freeHit={inn.freeHit}
        singleBatter={inn.singleBatterMode}
        inningsNumber={match.current + 1}
      />

      <BattersCard
        striker={striker}
        nonStriker={nonStriker}
        singleBatter={inn.singleBatterMode}
      />

      <BowlerCard bowler={bowler} bowlingName={bowlingTeam.name} />

      <ThisOver currentOver={inn.currentOver} />

      {match.status === 'live' && inn.striker && inn.bowler && (
        <ScoringPad
          onRun={onRun}
          onWide={onWide}
          onNoBall={onNoBall}
          onWicket={() => setWicketOpen(true)}
          onUndo={undo}
          onEndInnings={onEndInnings}
          onJoker={jokerCanCome ? () => setJokerOpen(true) : null}
          byeEnabled={byeEnabled}
          legByeEnabled={legByeEnabled}
          extrasMode={extrasMode}
          setExtrasMode={setExtrasMode}
          freeHit={inn.freeHit}
        />
      )}

      {isInningsBreak && (
        <InningsBreak
          firstInn={match.innings[0]}
          secondInnTeamName={cfg.teams[match.innings[1].battingTeam].name}
          target={match.innings[1].target}
          onContinue={() => {
            const opts = { batterOptions, bowlerOptions };
            return opts;
          }}
          batterOptions={batterOptions}
          bowlerOptions={bowlerOptions}
          onStart={(picks) => {
            startSecond(picks);
            flash('Second innings');
          }}
        />
      )}

      <OpenersModal
        open={needOpeners && match.status === 'live'}
        onClose={() => {}}
        onConfirm={(picks) => {
          setOpeners(picks);
          flash('Match started');
        }}
        batters={batterOptions}
        bowlers={bowlerOptions}
        title="Pick openers and first bowler"
      />

      <PickerModal
        open={!needOpeners && needNextBatter && match.status === 'live'}
        onClose={() => {}}
        title="Pick the next batter"
        options={batterOptions}
        onPick={(id) => {
          setNextBatter(id);
          flash('New batter in');
        }}
        emptyMessage="No batters left. The innings ends here."
      />

      <PickerModal
        open={!needOpeners && !needNextBatter && needNextBowler && match.status === 'live'}
        onClose={() => {}}
        title="Pick the next bowler"
        options={bowlerOptions}
        onPick={(id) => {
          setNextBowler(id);
          flash('New over starts');
        }}
        emptyMessage="No other bowler available."
      />

      <WicketModal
        open={wicketOpen}
        onClose={() => setWicketOpen(false)}
        onConfirm={onWicket}
        freeHit={inn.freeHit}
        fielderOptions={fielderOptions}
      />

      <JokerModal
        open={jokerOpen}
        onClose={() => setJokerOpen(false)}
        onConfirm={onActivateJoker}
        jokerName={cfg.joker?.name}
        hasStriker={!!inn.striker}
        hasNonStriker={!!inn.nonStriker}
      />

      <ConfirmModal
        open={endInningsOpen}
        onClose={() => setEndInningsOpen(false)}
        onConfirm={() => {
          endInnings();
          setEndInningsOpen(false);
        }}
        title="End innings?"
        message="Are you sure you want to end the innings now?"
      />

      <BackToHomeFooter />
    </div>
  );
}

function snapshotForHistory(match) {
  return {
    id: match.id,
    createdAt: match.createdAt,
    completedAt: Date.now(),
    config: match.config,
    innings: match.innings,
    result: match.result,
  };
}

function ScoreHeader({
  battingName,
  runs,
  wickets,
  overs,
  oversTotal,
  crr,
  target,
  runsNeeded,
  ballsLeft,
  rrr,
  freeHit,
  singleBatter,
  inningsNumber,
}) {
  return (
    <div className="sticky top-14 z-20 -mx-4 px-4 py-2 bg-bg/95 backdrop-blur-md border-b border-border">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-xs font-semibold text-fg-muted">
            {battingName} batting · Innings {inningsNumber}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <div className="score-digit text-3xl">
              {runs}/{wickets}
            </div>
            <div className="text-fg-muted text-sm font-mono">
              ({overs}/{oversTotal})
            </div>
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="text-fg-muted">CRR</div>
          <div className="font-bold font-mono">{fmt2(crr)}</div>
        </div>
      </div>

      {target && (
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <div>
            Need <b className="font-mono">{Math.max(runsNeeded, 0)}</b> from{' '}
            <b className="font-mono">{Math.max(ballsLeft, 0)}</b> balls
          </div>
          <div className="text-fg-muted">
            RRR <b className="font-mono text-fg">{fmt2(rrr)}</b>
          </div>
        </div>
      )}

      {(freeHit || singleBatter) && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {freeHit && (
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/40">
              Free hit
            </span>
          )}
          {singleBatter && (
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue border border-accent-blue/40">
              Single Batter Mode
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function BattersCard({ striker, nonStriker, singleBatter }) {
  return (
    <div className="card mt-3 p-3">
      <BatterRow batter={striker} isStriker />
      {!singleBatter && nonStriker && <BatterRow batter={nonStriker} />}
      {!striker && !nonStriker && (
        <div className="text-sm text-fg-muted py-2">Waiting for batter</div>
      )}
    </div>
  );
}

function BatterRow({ batter, isStriker }) {
  if (!batter) return null;
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        {isStriker && <span className="h-2 w-2 rounded-full bg-brand" />}
        <span className="font-semibold">{batter.name}</span>
      </div>
      <div className="font-mono text-sm">
        <span className="font-bold">{batter.runs}</span>
        <span className="text-fg-muted">({batter.balls})</span>
        <span className="text-fg-dim ml-2">SR {fmt1(strikeRate(batter.runs, batter.balls))}</span>
      </div>
    </div>
  );
}

function BowlerCard({ bowler, bowlingName }) {
  return (
    <div className="card mt-2 p-3 flex items-center justify-between">
      <div>
        <div className="text-xs text-fg-muted">{bowlingName} bowling</div>
        <div className="font-semibold">{bowler?.name || 'Waiting for bowler'}</div>
      </div>
      {bowler && (
        <div className="font-mono text-sm text-right">
          <div className="font-bold">
            {Math.floor(bowler.legalBalls / 6)}.{bowler.legalBalls % 6} - {bowler.runs} - {bowler.wickets}
          </div>
          <div className="text-fg-dim text-xs">Econ {fmt2(economy(bowler.runs, bowler.legalBalls))}</div>
        </div>
      )}
    </div>
  );
}

function ThisOver({ currentOver }) {
  return (
    <div className="card mt-2 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
          This over
        </div>
      </div>
      <BallTimeline balls={currentOver} />
    </div>
  );
}

function ScoringPad({
  onRun,
  onWide,
  onNoBall,
  onWicket,
  onUndo,
  onEndInnings,
  onJoker,
  byeEnabled,
  legByeEnabled,
  extrasMode,
  setExtrasMode,
  freeHit,
}) {
  const runValues = [0, 1, 2, 3, 4, 6];
  return (
    <div className="mt-4 space-y-2 safe-bottom">
      {extrasMode && (
        <div className="text-xs font-semibold rounded-lg px-3 py-2 bg-accent-blue/15 text-accent-blue border border-accent-blue/30 flex items-center justify-between gap-2">
          <span>
            {extrasModePrompt(extrasMode)}
          </span>
          <button onClick={() => setExtrasMode(null)} className="underline shrink-0">
            cancel
          </button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {runValues.map((n) => (
          <button
            key={n}
            onClick={() => onRun(n)}
            className={`score-btn ${n === 4 ? 'score-btn-boundary' : ''} ${n === 6 ? 'score-btn-six' : ''}`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onWide}
          className={`extra-btn ${extrasMode === 'wide' ? '!bg-accent-blue !text-white !border-accent-blue' : ''}`}
        >
          Wide
        </button>
        <button
          onClick={onNoBall}
          className={`extra-btn ${extrasMode === 'noball' ? '!bg-accent-blue !text-white !border-accent-blue' : ''}`}
        >
          No ball
        </button>
        {byeEnabled && (
          <button
            onClick={() => setExtrasMode(extrasMode === 'bye' ? null : 'bye')}
            className={`extra-btn ${extrasMode === 'bye' ? '!bg-accent-blue !text-white !border-accent-blue' : ''}`}
          >
            Bye
          </button>
        )}
        {legByeEnabled && (
          <button
            onClick={() => setExtrasMode(extrasMode === 'legbye' ? null : 'legbye')}
            className={`extra-btn ${extrasMode === 'legbye' ? '!bg-accent-blue !text-white !border-accent-blue' : ''}`}
          >
            Leg bye
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={onWicket} className="action-btn bg-danger text-white">
          <Skull className="h-5 w-5" /> Wicket
        </button>
        <button onClick={onUndo} className="action-btn bg-bg-soft border border-border">
          <Undo2 className="h-5 w-5" /> Undo
        </button>
        {onJoker && (
          <button onClick={onJoker} className="action-btn bg-accent-yellow/20 border border-accent-yellow text-accent-yellow">
            <Sparkles className="h-5 w-5" /> Use joker
          </button>
        )}
        <button onClick={onEndInnings} className={`action-btn bg-bg-soft border border-border ${onJoker ? '' : 'col-span-1'}`}>
          <StopCircle className="h-5 w-5" /> End innings
        </button>
      </div>
    </div>
  );
}

function extrasModePrompt(mode) {
  switch (mode) {
    case 'bye':
      return 'Tap a number for byes scored.';
    case 'legbye':
      return 'Tap a number for leg byes scored.';
    case 'wide':
      return 'Tap a number for extra runs on the wide (tap 0 for just a wide).';
    case 'noball':
      return 'Tap a number for runs the batter scored off the no ball (4 or 6 for boundary).';
    default:
      return '';
  }
}

function InningsBreak({ firstInn, secondInnTeamName, target, batterOptions, bowlerOptions, onStart }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="card mt-4 p-5 text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-fg-muted">Innings break</div>
        <div className="mt-2 text-2xl font-extrabold">
          {firstInn.runs}/{firstInn.wickets}
        </div>
        <div className="text-sm text-fg-muted mt-1">
          {secondInnTeamName} needs <b className="text-fg">{target}</b> runs to win.
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary mt-4 w-full">
          Start second innings
        </button>
      </div>
      <OpenersModal
        open={open}
        onClose={() => {}}
        onConfirm={(picks) => {
          setOpen(false);
          onStart(picks);
        }}
        batters={batterOptions}
        bowlers={bowlerOptions}
        title="Pick openers and bowler for chase"
      />
    </>
  );
}

function BackToHomeFooter() {
  return (
    <div className="mt-6 text-center">
      <a href="/" className="btn-ghost text-sm text-fg-muted">
        <HomeIcon className="h-4 w-4" /> Home
      </a>
    </div>
  );
}
