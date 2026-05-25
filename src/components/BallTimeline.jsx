export default function BallTimeline({ balls = [] }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
      {balls.length === 0 && (
        <div className="text-xs text-fg-dim italic">No balls yet this over</div>
      )}
      {balls.map((b, i) => (
        <Pill key={i} b={b} />
      ))}
    </div>
  );
}

function Pill({ b }) {
  let cls = 'bg-bg-soft text-fg';
  if (b.wicket) cls = 'bg-danger text-white';
  else if (b.kind === 'run' && b.runs === 4) cls = 'bg-brand text-white';
  else if (b.kind === 'run' && b.runs === 6) cls = 'bg-accent-orange text-white';
  else if (b.kind === 'wide' || b.kind === 'noball') cls = 'bg-accent-yellow text-black';
  else if (b.kind === 'bye' || b.kind === 'legbye') cls = 'bg-accent-blue text-white';
  return (
    <span
      className={`shrink-0 inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full text-[11px] font-bold ${cls}`}
    >
      {b.wicket ? 'W' : b.label}
    </span>
  );
}
