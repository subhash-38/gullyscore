import { Link } from 'react-router-dom';
import { Play, ChevronRight, Zap, WifiOff, Trophy } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { useHistoryStore } from '../store/historyStore.js';
import { useMatchStore } from '../store/matchStore.js';
import { shortDateTime } from '../utils/format.js';

export default function Home() {
  const matches = useHistoryStore((s) => s.matches);
  const active = useMatchStore((s) => s.match);
  const recent = matches.slice(0, 3);

  return (
    <div className="space-y-5 pt-2">
      <SEO
        title="Gullyscore | Gully Cricket Scorer and Score Counter"
        description="Free cricket scorer for gully, tennis ball and street cricket. Fast setup, joker player support, custom rules and offline scoring."
        canonical="https://gullyscore.app/"
      />

      <section className="card p-6 bg-gradient-to-br from-bg-card to-bg-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
          For gully, street and tennis ball cricket
        </div>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight">
          Score local cricket
          <br />
          in seconds.
        </h1>
        <p className="mt-2 text-fg-muted">
          Quick setup, joker player support, custom local rules. No login. Works offline.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <Link to="/setup" className="btn-primary text-base flex-1">
            <Play className="h-5 w-5" /> Start New Match
          </Link>
          {active && active.status !== 'complete' && (
            <Link to="/match" className="btn-secondary text-base flex-1">
              Resume Live Match
            </Link>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Recent Matches" link="/history" linkLabel="See all" />
        {recent.length === 0 ? (
          <div className="card p-6 text-center text-fg-muted">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-fg-dim" />
            <p className="text-sm">No matches yet. Your local match history will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {recent.map((m) => (
              <li key={m.id}>
                <Link
                  to={`/history?id=${m.id}`}
                  className="card p-4 flex items-center justify-between hover:border-brand transition-colors"
                >
                  <div>
                    <div className="font-semibold">
                      {m.result?.winnerName || 'Match'}{' '}
                      <span className="text-fg-muted font-normal text-sm">
                        {m.result?.marginType === 'runs'
                          ? `won by ${m.result.margin} runs`
                          : m.result?.marginType === 'wickets'
                          ? `won by ${m.result.margin} wickets`
                          : ''}
                      </span>
                    </div>
                    <div className="text-xs text-fg-muted mt-0.5">
                      {shortDateTime(m.createdAt)} • {m.config.overs} overs
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-fg-dim" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionHeader title="Why Gullyscore" />
        <div className="grid grid-cols-3 gap-2">
          <FeatureChip icon={Zap} label="Fast setup" />
          <FeatureChip icon={WifiOff} label="Works offline" />
          <FeatureChip icon={Trophy} label="Local rules" />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, link, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-2 px-1">
      <h2 className="font-bold text-sm uppercase tracking-wider text-fg-muted">{title}</h2>
      {link && (
        <Link to={link} className="text-xs font-semibold text-brand">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

function FeatureChip({ icon: Icon, label }) {
  return (
    <div className="card p-3 flex flex-col items-center gap-1 text-center">
      <Icon className="h-5 w-5 text-brand" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

