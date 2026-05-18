import { Link } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';

export default function Article({ title, intro, children, ctaLabel, ctaTo = '/setup' }) {
  return (
    <article className="space-y-4 pt-1">
      <header>
        <h1 className="text-2xl font-extrabold leading-tight">{title}</h1>
        {intro && <p className="mt-2 text-fg-muted">{intro}</p>}
      </header>

      <section className="prose-content space-y-4 text-sm leading-relaxed">
        {children}
      </section>

      <div className="card p-4 mt-4 bg-gradient-to-br from-brand/10 to-bg-card border-brand/30">
        <div className="font-bold">Ready to keep score?</div>
        <p className="text-sm text-fg-muted mt-1">
          Open Gullyscore and start a match in under thirty seconds.
        </p>
        <Link to={ctaTo} className="btn-primary mt-3 inline-flex">
          <Play className="h-4 w-4" /> {ctaLabel || 'Start a match'}
        </Link>
      </div>

      <RelatedLinks />
    </article>
  );
}

export function H2({ children }) {
  return <h2 className="text-lg font-bold mt-5 mb-1">{children}</h2>;
}

export function H3({ children }) {
  return <h3 className="font-semibold mt-3 mb-1">{children}</h3>;
}

export function P({ children }) {
  return <p className="text-fg leading-relaxed">{children}</p>;
}

export function UL({ children }) {
  return <ul className="list-disc pl-5 space-y-1 text-fg">{children}</ul>;
}

function RelatedLinks() {
  const items = [
    { to: '/gully-cricket-rules', title: 'Gully cricket rules' },
    { to: '/how-to-score-gully-cricket', title: 'How to score gully cricket' },
    { to: '/tennis-ball-cricket-rules', title: 'Tennis ball cricket rules' },
    { to: '/street-cricket-scoring-guide', title: 'Street cricket scoring guide' },
  ];
  return (
    <section>
      <div className="text-xs font-bold uppercase tracking-wider text-fg-muted px-1 mb-2">
        Related
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="card p-3 flex items-center gap-2 hover:border-brand transition-colors"
          >
            <span className="flex-1 text-sm font-medium">{it.title}</span>
            <ChevronRight className="h-4 w-4 text-fg-dim" />
          </Link>
        ))}
      </div>
    </section>
  );
}
