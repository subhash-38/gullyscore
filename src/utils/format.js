export function formatOvers(legalBalls) {
  const overs = Math.floor(legalBalls / 6);
  const balls = legalBalls % 6;
  return `${overs}.${balls}`;
}

export function totalOvers(legalBalls) {
  return legalBalls / 6;
}

export function runRate(runs, legalBalls) {
  if (!legalBalls) return 0;
  return (runs / (legalBalls / 6));
}

export function requiredRunRate(runsNeeded, ballsLeft) {
  if (ballsLeft <= 0) return Infinity;
  return runsNeeded / (ballsLeft / 6);
}

export function strikeRate(runs, balls) {
  if (!balls) return 0;
  return (runs / balls) * 100;
}

export function economy(runs, legalBalls) {
  if (!legalBalls) return 0;
  return runs / (legalBalls / 6);
}

export function fmt1(n) {
  if (!isFinite(n)) return '0.0';
  return (Math.round(n * 10) / 10).toFixed(1);
}

export function fmt2(n) {
  if (!isFinite(n)) return '0.00';
  return (Math.round(n * 100) / 100).toFixed(2);
}

export function shortDate(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export function shortDateTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}
