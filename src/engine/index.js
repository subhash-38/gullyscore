import { uid } from '../utils/id.js';

export function createInitialMatch({ overs, teams, joker, rules, toss }) {
  const battingFirst = toss.decision === 'bat' ? toss.winner : flip(toss.winner);
  const bowlingFirst = flip(battingFirst);

  return {
    id: uid('match'),
    createdAt: Date.now(),
    config: { overs, teams, joker, rules, toss },
    innings: [
      createInnings({ battingTeam: battingFirst, bowlingTeam: bowlingFirst, target: null, teams, joker }),
    ],
    current: 0,
    status: 'live',
    result: null,
    undoStack: [],
  };
}

export function createInnings({ battingTeam, bowlingTeam, target, teams, joker }) {
  const batters = {};
  const bowlers = {};
  for (const p of teams[battingTeam].players) {
    batters[p.id] = newBatter(p);
  }
  if (joker) batters[joker.id] = newBatter(joker);
  for (const p of teams[bowlingTeam].players) {
    bowlers[p.id] = newBowler(p);
  }
  if (joker) bowlers[joker.id] = newBowler(joker);

  return {
    battingTeam,
    bowlingTeam,
    target,
    runs: 0,
    wickets: 0,
    legalBalls: 0,
    extras: { wide: 0, noBall: 0, bye: 0, legBye: 0 },
    batters,
    bowlers,
    striker: null,
    nonStriker: null,
    bowler: null,
    previousBowler: null,
    freeHit: false,
    jokerActive: false,
    jokerOut: false,
    jokerSide: null,
    singleBatterMode: false,
    timeline: [],
    overs: [],
    currentOver: [],
    complete: false,
    retired: [],
  };
}

function newBatter(p) {
  return {
    id: p.id,
    name: p.name,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    out: false,
    dismissal: null,
    notOut: false,
    didBat: false,
  };
}

function newBowler(p) {
  return {
    id: p.id,
    name: p.name,
    legalBalls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0,
    didBowl: false,
    _currentOverRuns: 0,
    _currentOverLegal: 0,
  };
}

function flip(t) {
  return t === 'A' ? 'B' : 'A';
}

export function setOpeners(state, { strikerId, nonStrikerId, bowlerId }) {
  const inn = current(state);
  inn.striker = strikerId;
  inn.nonStriker = nonStrikerId;
  inn.bowler = bowlerId;
  if (inn.batters[strikerId]) inn.batters[strikerId].didBat = true;
  if (inn.batters[nonStrikerId]) inn.batters[nonStrikerId].didBat = true;
  if (inn.bowlers[bowlerId]) inn.bowlers[bowlerId].didBowl = true;
  return { ...state };
}

export function setNextBatter(state, batterId) {
  const inn = current(state);
  if (!inn.striker) inn.striker = batterId;
  else if (!inn.nonStriker) inn.nonStriker = batterId;
  if (inn.batters[batterId]) inn.batters[batterId].didBat = true;
  return { ...state };
}

export function setNextBowler(state, bowlerId) {
  const inn = current(state);
  inn.previousBowler = inn.bowler;
  inn.bowler = bowlerId;
  if (inn.bowlers[bowlerId]) inn.bowlers[bowlerId].didBowl = true;
  return { ...state };
}

export function activateJoker(state, { replaces }) {
  const inn = current(state);
  const cfg = state.config;
  if (!cfg.joker || inn.jokerActive || inn.jokerOut) return state;
  inn.jokerActive = true;
  inn.jokerSide = replaces;
  if (replaces === 'striker') inn.striker = cfg.joker.id;
  else if (replaces === 'nonStriker') inn.nonStriker = cfg.joker.id;
  else if (!inn.striker) inn.striker = cfg.joker.id;
  else if (!inn.nonStriker) inn.nonStriker = cfg.joker.id;
  inn.batters[cfg.joker.id].didBat = true;
  return { ...state };
}

export function applyBall(state, eventInput) {
  const inn = current(state);
  if (inn.complete || state.status !== 'live') return state;

  const rules = state.config.rules;
  const before = snapshot(state);

  const event = { ...eventInput, ts: Date.now() };
  const striker = inn.batters[inn.striker];
  const bowler = inn.bowlers[inn.bowler];
  if (!striker || !bowler) return state;

  let legal = true;
  let teamRuns = 0;
  let batterRuns = 0;
  let extraRuns = 0;
  let strikeChange = false;
  let wicket = false;
  let label = '';
  let nextFreeHit = false;

  switch (event.kind) {
    case 'run': {
      const r = clampRuns(event.runs);
      teamRuns = r;
      batterRuns = r;
      label = r === 0 ? '•' : String(r);
      strikeChange = r % 2 === 1;
      break;
    }
    case 'wide': {
      const extra = rules.wide === 'reroll' ? 0 : 1;
      const additional = clampRuns(event.runs);
      extraRuns = extra + additional;
      teamRuns = extraRuns;
      inn.extras.wide += extraRuns;
      legal = false;
      label = additional > 0 ? `Wd+${additional}` : 'Wd';
      strikeChange = additional % 2 === 1;
      break;
    }
    case 'noball': {
      const additional = clampRuns(event.runs);
      extraRuns = 1;
      batterRuns = additional;
      teamRuns = 1 + additional;
      inn.extras.noBall += 1;
      legal = false;
      nextFreeHit = rules.freeHit;
      label = additional > 0 ? `Nb+${additional}` : 'Nb';
      strikeChange = additional % 2 === 1;
      break;
    }
    case 'bye': {
      const r = clampRuns(event.runs);
      extraRuns = r;
      teamRuns = r;
      inn.extras.bye += r;
      label = `B${r}`;
      strikeChange = r % 2 === 1;
      break;
    }
    case 'legbye': {
      const r = clampRuns(event.runs);
      extraRuns = r;
      teamRuns = r;
      inn.extras.legBye += r;
      label = `Lb${r}`;
      strikeChange = r % 2 === 1;
      break;
    }
    case 'wicket': {
      const d = event.dismissal || { type: 'bowled' };
      if (inn.freeHit && d.type !== 'runout') {
        legal = true;
        teamRuns = 0;
        batterRuns = 0;
        label = 'NO';
        break;
      }
      wicket = true;
      legal = true;
      const r = clampRuns(event.runs || 0);
      teamRuns = r;
      batterRuns = r;
      label = r ? `W+${r}` : 'W';
      strikeChange = r % 2 === 1;
      break;
    }
    default:
      return state;
  }

  inn.runs += teamRuns;

  if (event.kind !== 'wide') {
    striker.balls += 1;
    striker.runs += batterRuns;
    if (event.kind === 'run' || event.kind === 'noball') {
      if (batterRuns === 4) striker.fours += 1;
      if (batterRuns === 6) striker.sixes += 1;
    }
  }

  bowler.runs += teamRuns;
  if (legal) {
    bowler.legalBalls += 1;
    bowler._currentOverLegal += 1;
  }
  bowler._currentOverRuns += teamRuns;

  if (legal) inn.legalBalls += 1;

  if (event.kind === 'noball') {
    nextFreeHit = rules.freeHit;
  } else if (legal) {
    nextFreeHit = false;
  } else {
    nextFreeHit = inn.freeHit;
  }
  inn.freeHit = nextFreeHit;

  let dismissedBatterId = null;
  let isJokerOut = false;
  if (wicket) {
    const d = event.dismissal;
    const credit = ['bowled', 'caught', 'stumped', 'hitwicket'].includes(d.type);
    const isRetired = d.type === 'retired';
    if (credit) bowler.wickets += 1;
    if (!isRetired) {
      inn.wickets += 1;
      striker.out = true;
      striker.dismissal = {
        type: d.type,
        bowler: credit ? bowler.name : null,
        fielder: d.fielderName || null,
      };
      dismissedBatterId = striker.id;
      if (state.config.joker && striker.id === state.config.joker.id) {
        isJokerOut = true;
        inn.jokerOut = true;
        inn.jokerActive = false;
      }
    } else {
      striker.notOut = true;
      striker.dismissal = { type: 'retired', bowler: null, fielder: null };
      if (event.returnLater !== false) inn.retired.push(striker.id);
      dismissedBatterId = striker.id;
    }
    inn.striker = null;
  }

  if (strikeChange && inn.striker && inn.nonStriker) {
    [inn.striker, inn.nonStriker] = [inn.nonStriker, inn.striker];
  }

  inn.currentOver.push({ kind: event.kind, label, runs: teamRuns, wicket, legal });

  let overEnded = false;
  if (legal && bowler._currentOverLegal >= 6) {
    overEnded = true;
    if (bowler._currentOverRuns === 0) bowler.maidens += 1;
    bowler._currentOverLegal = 0;
    bowler._currentOverRuns = 0;
    inn.overs.push(inn.currentOver);
    inn.currentOver = [];
    if (!inn.singleBatterMode && inn.striker && inn.nonStriker) {
      [inn.striker, inn.nonStriker] = [inn.nonStriker, inn.striker];
    }
    inn.previousBowler = inn.bowler;
    inn.bowler = null;
  }

  maybeActivateSingleBatter(state, rules);

  state.undoStack.push({
    event,
    before,
    dismissedBatterId,
    isJokerOut,
    overEnded,
  });

  evaluateInningsEnd(state);

  return { ...state };
}

function clampRuns(r) {
  const n = Number(r);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.max(Math.floor(n), 0), 6);
}

function current(state) {
  return state.innings[state.current];
}

function maybeActivateSingleBatter(state, rules) {
  if (!rules.singleBatterMode) return;
  const inn = current(state);
  if (inn.singleBatterMode) return;

  const battingTeamId = inn.battingTeam;
  const teamPlayers = state.config.teams[battingTeamId].players.map((p) => p.id);
  const jokerId = state.config.joker?.id;
  const eligible = [...teamPlayers];
  if (jokerId && !inn.jokerOut) eligible.push(jokerId);

  const onCrease = [inn.striker, inn.nonStriker].filter(Boolean);
  const usedOrOut = Object.values(inn.batters).filter((b) => b.out).map((b) => b.id);
  const remaining = eligible.filter(
    (id) => !usedOrOut.includes(id) && !onCrease.includes(id),
  );
  const retiredCanReturn = inn.retired.filter((id) => !onCrease.includes(id) && !usedOrOut.includes(id));

  if (onCrease.length === 1 && remaining.length === 0 && retiredCanReturn.length === 0) {
    inn.singleBatterMode = true;
    if (!inn.striker && inn.nonStriker) {
      inn.striker = inn.nonStriker;
      inn.nonStriker = null;
    }
  }
}

function evaluateInningsEnd(state) {
  const inn = current(state);
  const cfg = state.config;
  const totalBalls = cfg.overs * 6;

  let allOut = false;
  if (inn.striker === null) {
    const available = availableBatters(state, inn);
    if (available.length === 0) allOut = true;
  }

  const oversDone = inn.legalBalls >= totalBalls;
  const targetChased = inn.target != null && inn.runs >= inn.target;

  if (oversDone || allOut || targetChased) {
    inn.complete = true;
    if (state.current === 0) {
      const firstInn = state.innings[0];
      const battingNext = flip(firstInn.battingTeam);
      const target = firstInn.runs + 1;
      state.innings.push(
        createInnings({
          battingTeam: battingNext,
          bowlingTeam: flip(battingNext),
          target,
          teams: cfg.teams,
          joker: cfg.joker,
        }),
      );
      state.current = 1;
      state.status = 'inningsBreak';
    } else {
      state.status = 'complete';
      state.result = decideResult(state);
    }
  }
}

export function availableBatters(state, inn = null) {
  inn = inn || current(state);
  const battingTeamId = inn.battingTeam;
  const teamPlayers = state.config.teams[battingTeamId].players.map((p) => p.id);
  const jokerId = state.config.joker?.id;
  const eligible = [...teamPlayers];
  if (jokerId && !inn.jokerOut) eligible.push(jokerId);

  const onCrease = [inn.striker, inn.nonStriker].filter(Boolean);
  const out = Object.values(inn.batters).filter((b) => b.out).map((b) => b.id);
  return eligible.filter((id) => !out.includes(id) && !onCrease.includes(id));
}

export function availableBowlers(state, inn = null) {
  inn = inn || current(state);
  const ids = state.config.teams[inn.bowlingTeam].players.map((p) => p.id);
  if (state.config.joker) ids.push(state.config.joker.id);
  return ids.filter((id) => id !== inn.previousBowler);
}

function decideResult(state) {
  const [a, b] = state.innings;
  if (a.runs > b.runs) {
    return {
      winner: a.battingTeam,
      winnerName: state.config.teams[a.battingTeam].name,
      margin: a.runs - b.runs,
      marginType: 'runs',
    };
  }
  if (b.runs > a.runs) {
    const wktsLeft = state.config.teams[b.battingTeam].players.length - b.wickets;
    return {
      winner: b.battingTeam,
      winnerName: state.config.teams[b.battingTeam].name,
      margin: wktsLeft,
      marginType: 'wickets',
    };
  }
  return { winner: null, winnerName: 'Tie', margin: 0, marginType: 'tie' };
}

function snapshot(state) {
  return JSON.parse(
    JSON.stringify({
      innings: state.innings,
      current: state.current,
      status: state.status,
      result: state.result,
    }),
  );
}

export function undoLastBall(state) {
  const entry = state.undoStack.pop();
  if (!entry) return { ...state };
  state.innings = entry.before.innings;
  state.current = entry.before.current;
  state.status = entry.before.status;
  state.result = entry.before.result;
  return { ...state };
}

export function endInnings(state) {
  const inn = current(state);
  inn.complete = true;
  const cfg = state.config;
  if (state.current === 0) {
    const battingNext = flip(inn.battingTeam);
    const target = inn.runs + 1;
    state.innings.push(
      createInnings({
        battingTeam: battingNext,
        bowlingTeam: flip(battingNext),
        target,
        teams: cfg.teams,
        joker: cfg.joker,
      }),
    );
    state.current = 1;
    state.status = 'inningsBreak';
  } else {
    state.status = 'complete';
    state.result = decideResult(state);
  }
  return { ...state };
}

export function startSecondInnings(state, { strikerId, nonStrikerId, bowlerId }) {
  state.status = 'live';
  return setOpeners(state, { strikerId, nonStrikerId, bowlerId });
}

export function getInnings(state, idx = null) {
  return idx == null ? state.innings[state.current] : state.innings[idx];
}

export function getMatchSummary(state) {
  return {
    config: state.config,
    innings: state.innings,
    result: state.result,
    createdAt: state.createdAt,
    id: state.id,
  };
}
