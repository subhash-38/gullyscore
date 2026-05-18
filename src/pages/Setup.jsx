import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Shuffle, ChevronRight, ChevronLeft, Sparkles, Users, ListChecks } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { usePlayersStore } from '../store/playersStore.js';
import { useSettingsStore } from '../store/settingsStore.js';
import { useMatchStore } from '../store/matchStore.js';
import { DEFAULT_TEAM_NAMES } from '../data/defaults.js';

export default function Setup() {
  const navigate = useNavigate();
  const pool = usePlayersStore((s) => s.pool);
  const addPlayerToPool = usePlayersStore((s) => s.addPlayer);
  const touchPlayers = usePlayersStore((s) => s.touchPlayers);
  const defaultOvers = useSettingsStore((s) => s.defaultOvers);
  const defaultRules = useSettingsStore((s) => s.defaultRules);
  const setDefaultOvers = useSettingsStore((s) => s.setDefaultOvers);
  const setDefaultRules = useSettingsStore((s) => s.setDefaultRules);
  const setDraft = useMatchStore((s) => s.setDraft);

  const [step, setStep] = useState(1);
  const [overs, setOvers] = useState(defaultOvers);
  const [players, setPlayers] = useState([]); // [{id, name}]
  const [teamsDecided, setTeamsDecided] = useState(null); // true | false | null
  const [teamA, setTeamA] = useState([]); // [playerId]
  const [teamB, setTeamB] = useState([]);
  const [teamAName, setTeamAName] = useState(DEFAULT_TEAM_NAMES.A);
  const [teamBName, setTeamBName] = useState(DEFAULT_TEAM_NAMES.B);
  const [jokerDecided, setJokerDecided] = useState(null);
  const [jokerId, setJokerId] = useState(null);
  const [rules, setRules] = useState(defaultRules);

  const hasOddPlayers = players.length % 2 === 1;

  return (
    <div className="space-y-4 pt-1">
      <SEO title="Match Setup | Gullyscore" description="Set up a new gully cricket match in seconds." />

      <Stepper step={step} total={4} />

      {step === 1 && (
        <StepOvers
          overs={overs}
          onChange={setOvers}
          onNext={() => {
            setDefaultOvers(overs);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <StepPlayers
          pool={pool}
          players={players}
          setPlayers={setPlayers}
          addPlayerToPool={addPlayerToPool}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <StepTeams
          players={players}
          teamsDecided={teamsDecided}
          setTeamsDecided={setTeamsDecided}
          teamA={teamA}
          teamB={teamB}
          setTeamA={setTeamA}
          setTeamB={setTeamB}
          teamAName={teamAName}
          teamBName={teamBName}
          setTeamAName={setTeamAName}
          setTeamBName={setTeamBName}
          hasOddPlayers={hasOddPlayers}
          jokerDecided={jokerDecided}
          setJokerDecided={setJokerDecided}
          jokerId={jokerId}
          setJokerId={setJokerId}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <StepRules
          rules={rules}
          setRules={setRules}
          onBack={() => setStep(3)}
          onConfirm={() => {
            setDefaultRules(rules);
            touchPlayers(players.map((p) => p.id));
            const joker = jokerId ? players.find((p) => p.id === jokerId) : null;
            // Build teams payload for engine.
            const teamAPlayers = teamA
              .filter((id) => id !== jokerId)
              .map((id) => players.find((p) => p.id === id))
              .filter(Boolean);
            const teamBPlayers = teamB
              .filter((id) => id !== jokerId)
              .map((id) => players.find((p) => p.id === id))
              .filter(Boolean);

            setDraft({
              overs,
              teams: {
                A: { name: teamAName.trim() || 'Team 1', players: teamAPlayers },
                B: { name: teamBName.trim() || 'Team 2', players: teamBPlayers },
              },
              joker: joker ? { id: joker.id, name: joker.name } : null,
              rules,
            });
            navigate('/toss');
          }}
        />
      )}
    </div>
  );
}

function Stepper({ step, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i + 1 <= step ? 'bg-brand' : 'bg-bg-soft'
          }`}
        />
      ))}
    </div>
  );
}

function StepOvers({ overs, onChange, onNext }) {
  const [text, setText] = useState(String(overs || ''));

  useEffect(() => {
    setText(String(overs || ''));
  }, [overs]);

  const commit = () => {
    const n = Math.max(1, Math.min(150, parseInt(text, 10) || 1));
    onChange(n);
    setText(String(n));
  };

  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold">How many overs?</h2>
      <p className="text-sm text-fg-muted mt-1">
        Type any number from 1 to 150.
      </p>

      <div className="mt-5">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={text}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            setText(raw);
          }}
          onBlur={commit}
          placeholder="e.g. 5"
          className="input text-3xl font-extrabold text-center font-mono"
          autoFocus
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => {
            commit();
            onNext();
          }}
          className="btn-primary"
        >
          Next <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function StepPlayers({ pool, players, setPlayers, addPlayerToPool, onBack, onNext }) {
  const [name, setName] = useState('');

  const sortedPool = useMemo(
    () =>
      [...pool].sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0)),
    [pool],
  );
  const inMatchIds = new Set(players.map((p) => p.id));

  const add = (raw) => {
    const text = (raw ?? name).trim();
    if (!text) return;
    let player = pool.find((p) => p.name.toLowerCase() === text.toLowerCase());
    if (!player) {
      player = addPlayerToPool(text);
    } else {
      addPlayerToPool(text);
    }
    if (player && !inMatchIds.has(player.id)) {
      setPlayers([...players, { id: player.id, name: player.name }]);
    }
    setName('');
  };

  const remove = (id) => setPlayers(players.filter((p) => p.id !== id));

  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Users className="h-5 w-5" /> Add players
      </h2>
      <p className="text-sm text-fg-muted mt-1">
        Need at least 2. Odd numbers will trigger the joker flow.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Player name"
          className="input flex-1"
          autoComplete="off"
        />
        <button type="submit" className="btn-primary px-4" aria-label="Add">
          <Plus className="h-5 w-5" />
        </button>
      </form>

      {sortedPool.filter((p) => !inMatchIds.has(p.id)).length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-fg-muted mb-2">
            Quick add from saved players
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sortedPool
              .filter((p) => !inMatchIds.has(p.id))
              .slice(0, 12)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => add(p.name)}
                  className="chip hover:!border-brand hover:!text-brand"
                >
                  <Plus className="h-3.5 w-3.5" /> {p.name}
                </button>
              ))}
          </div>
        </div>
      )}

      {players.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold text-fg-muted mb-2">
            In this match ({players.length})
          </div>
          <ul className="space-y-1.5">
            {players.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-2 bg-bg-soft border border-border rounded-xl px-3 py-2"
              >
                <span className="flex-1 font-medium">{p.name}</span>
                <button
                  onClick={() => remove(p.id)}
                  className="h-8 w-8 rounded-lg hover:bg-bg-card flex items-center justify-center text-fg-muted"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex justify-between">
        <button onClick={onBack} className="btn-secondary">
          <ChevronLeft className="h-5 w-5" /> Back
        </button>
        <button
          onClick={onNext}
          className="btn-primary"
          disabled={players.length < 2}
        >
          Next <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function StepTeams(props) {
  const {
    players,
    teamsDecided,
    setTeamsDecided,
    teamA,
    teamB,
    setTeamA,
    setTeamB,
    teamAName,
    teamBName,
    setTeamAName,
    setTeamBName,
    hasOddPlayers,
    jokerDecided,
    setJokerDecided,
    jokerId,
    setJokerId,
    onBack,
    onNext,
  } = props;

  // Reset assignments if user toggles.
  useEffect(() => {
    if (teamsDecided !== false) return;
    if (teamA.length === 0 && teamB.length === 0) autoSplit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamsDecided]);

  const playerById = (id) => players.find((p) => p.id === id);

  const unassigned = players.filter(
    (p) => !teamA.includes(p.id) && !teamB.includes(p.id),
  );

  const autoSplit = () => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    // Decide joker first if odd.
    let jId = jokerId;
    if (hasOddPlayers && jokerDecided !== true) {
      if (!jId) jId = shuffled[shuffled.length - 1].id;
      setJokerId(jId);
    }
    const nonJoker = shuffled.filter((p) => p.id !== jId);
    const half = Math.floor(nonJoker.length / 2);
    setTeamA(nonJoker.slice(0, half).map((p) => p.id));
    setTeamB(nonJoker.slice(half).map((p) => p.id));
  };

  const reshuffle = () => {
    setTeamA([]);
    setTeamB([]);
    autoSplit();
  };

  const assignTo = (pid, team) => {
    setTeamA((a) => a.filter((id) => id !== pid));
    setTeamB((b) => b.filter((id) => id !== pid));
    if (team === 'A') setTeamA((a) => [...a, pid]);
    else if (team === 'B') setTeamB((b) => [...b, pid]);
  };

  const canProceed =
    teamA.length >= 1 &&
    teamB.length >= 1 &&
    (!hasOddPlayers || (jokerId && !teamA.includes(jokerId) && !teamB.includes(jokerId)));

  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Users className="h-5 w-5" /> Team setup
      </h2>
      <p className="text-sm text-fg-muted mt-1">
        Name each team by its captain.
      </p>

      <div className="mt-3">
        <div className="text-sm font-semibold mb-2">Are teams already decided?</div>
        <div className="flex gap-2">
          <button
            onClick={() => setTeamsDecided(true)}
            className={`chip flex-1 justify-center py-2 ${teamsDecided === true ? '!bg-brand !text-white !border-brand' : ''}`}
          >
            Yes, pick manually
          </button>
          <button
            onClick={() => setTeamsDecided(false)}
            className={`chip flex-1 justify-center py-2 ${teamsDecided === false ? '!bg-brand !text-white !border-brand' : ''}`}
          >
            No, split automatically
          </button>
        </div>
      </div>

      {hasOddPlayers && (
        <div className="mt-4 p-3 rounded-xl bg-accent-yellow/10 border border-accent-yellow/30">
          <div className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-yellow" /> Joker needed
          </div>
          <p className="text-xs text-fg-muted mt-1">
            Odd number of players. One will be the shared joker available to both teams.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setJokerDecided(true)}
              className={`chip flex-1 justify-center py-1.5 ${jokerDecided === true ? '!bg-accent-yellow/30 !border-accent-yellow' : ''}`}
            >
              Pick joker
            </button>
            <button
              onClick={() => {
                setJokerDecided(false);
                const id = players[Math.floor(Math.random() * players.length)].id;
                setJokerId(id);
                // Remove joker from any team.
                setTeamA((a) => a.filter((x) => x !== id));
                setTeamB((b) => b.filter((x) => x !== id));
              }}
              className={`chip flex-1 justify-center py-1.5 ${jokerDecided === false ? '!bg-accent-yellow/30 !border-accent-yellow' : ''}`}
            >
              Random joker
            </button>
          </div>
          {jokerDecided === true && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {players.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setJokerId(p.id);
                    setTeamA((a) => a.filter((x) => x !== p.id));
                    setTeamB((b) => b.filter((x) => x !== p.id));
                  }}
                  className={`chip ${jokerId === p.id ? '!bg-accent-yellow/30 !border-accent-yellow' : ''}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
          {jokerId && (
            <div className="mt-2 text-xs">
              Joker: <span className="font-semibold">{playerById(jokerId)?.name}</span>
            </div>
          )}
        </div>
      )}

      {teamsDecided === false && (
        <div className="mt-4">
          <button onClick={reshuffle} className="btn-secondary w-full">
            <Shuffle className="h-4 w-4" /> Reshuffle teams
          </button>
        </div>
      )}

      {teamsDecided !== null && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <TeamColumn
            label="1"
            color="brand"
            name={teamAName}
            setName={setTeamAName}
            placeholder="Captain 1's name"
            ids={teamA}
            playerById={playerById}
            onRemove={(pid) => setTeamA((a) => a.filter((id) => id !== pid))}
            jokerId={jokerId}
          />
          <TeamColumn
            label="2"
            color="accent-blue"
            name={teamBName}
            setName={setTeamBName}
            placeholder="Captain 2's name"
            ids={teamB}
            playerById={playerById}
            onRemove={(pid) => setTeamB((b) => b.filter((id) => id !== pid))}
            jokerId={jokerId}
          />
        </div>
      )}

      {teamsDecided === true && unassigned.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-fg-muted mb-1">Unassigned</div>
          <div className="flex flex-wrap gap-1.5">
            {unassigned
              .filter((p) => p.id !== jokerId)
              .map((p) => (
                <div
                  key={p.id}
                  className="chip"
                >
                  <span className="font-medium">{p.name}</span>
                  <button
                    onClick={() => assignTo(p.id, 'A')}
                    className="ml-1 text-brand font-bold text-xs px-1.5 rounded-md border border-brand/40 hover:bg-brand hover:text-white"
                  >
                    1
                  </button>
                  <button
                    onClick={() => assignTo(p.id, 'B')}
                    className="text-accent-blue font-bold text-xs px-1.5 rounded-md border border-accent-blue/40 hover:bg-accent-blue hover:text-white"
                  >
                    2
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-between">
        <button onClick={onBack} className="btn-secondary">
          <ChevronLeft className="h-5 w-5" /> Back
        </button>
        <button onClick={onNext} className="btn-primary" disabled={!canProceed}>
          Next <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function TeamColumn({ label, color, name, setName, placeholder, ids, playerById, onRemove, jokerId }) {
  return (
    <div className={`rounded-xl border border-border bg-bg-soft p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`inline-flex items-center justify-center h-6 w-6 rounded-md text-xs font-bold ${
            color === 'brand' ? 'bg-brand text-white' : 'bg-accent-blue text-white'
          }`}
        >
          {label}
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder || `Team ${label}`}
          className="bg-transparent flex-1 font-semibold text-sm focus:outline-none border-b border-transparent focus:border-border placeholder:text-fg-dim"
        />
      </div>
      <ul className="space-y-1">
        {ids.map((id) => {
          const p = playerById(id);
          if (!p) return null;
          return (
            <li
              key={id}
              className="flex items-center gap-1.5 text-sm bg-bg-card rounded-lg px-2 py-1.5"
            >
              <span className="flex-1 truncate">{p.name}</span>
              <button
                onClick={() => onRemove(id)}
                className="text-fg-dim hover:text-danger"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          );
        })}
        {ids.length === 0 && (
          <li className="text-xs text-fg-dim italic px-1">No players yet</li>
        )}
      </ul>
      {jokerId && (
        <div className="mt-2 text-xs text-accent-yellow font-medium">
          + Joker shared
        </div>
      )}
    </div>
  );
}

function StepRules({ rules, setRules, onBack, onConfirm }) {
  const update = (patch) => setRules({ ...rules, ...patch });
  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <ListChecks className="h-5 w-5" /> Match rules
      </h2>
      <p className="text-sm text-fg-muted mt-1">Customize for your gully.</p>

      <RuleRow
        title="Single Batter Mode"
        subtitle="When only one batter remains, they continue alone with no strike rotation."
        value={rules.singleBatterMode}
        onToggle={() => update({ singleBatterMode: !rules.singleBatterMode })}
      />

      <RuleSelect
        title="Wide ball"
        value={rules.wide}
        onChange={(v) => update({ wide: v })}
        options={[
          { value: 'plusOne', label: '1 run and reroll' },
          { value: 'reroll', label: 'Reroll only' },
        ]}
      />

      <RuleRow
        title="No ball free hit"
        subtitle="Next legal ball is a free hit. Only run out dismissals count on a free hit."
        value={rules.freeHit}
        onToggle={() => update({ freeHit: !rules.freeHit })}
      />

      <RuleRow
        title="Allow byes"
        subtitle="Shows the Bye button during scoring."
        value={rules.bye}
        onToggle={() => update({ bye: !rules.bye })}
      />

      <RuleRow
        title="Allow leg byes"
        subtitle="Shows the Leg Bye button during scoring."
        value={rules.legBye}
        onToggle={() => update({ legBye: !rules.legBye })}
      />

      <div className="mt-5 flex justify-between">
        <button onClick={onBack} className="btn-secondary">
          <ChevronLeft className="h-5 w-5" /> Back
        </button>
        <button onClick={onConfirm} className="btn-primary">
          Continue to Toss <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function RuleRow({ title, subtitle, value, onToggle }) {
  return (
    <div className="mt-4 flex items-start gap-3">
      <div className="flex-1">
        <div className="font-semibold text-sm">{title}</div>
        {subtitle && <div className="text-xs text-fg-muted mt-0.5">{subtitle}</div>}
      </div>
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={value}
        className={`h-7 w-12 rounded-full transition-colors relative ${
          value ? 'bg-brand' : 'bg-bg-soft border border-border'
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
            value ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function RuleSelect({ title, value, onChange, options }) {
  return (
    <div className="mt-4">
      <div className="font-semibold text-sm">{title}</div>
      <div className="mt-1.5 flex gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`chip flex-1 justify-center ${
              value === o.value ? '!bg-brand !text-white !border-brand' : ''
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
