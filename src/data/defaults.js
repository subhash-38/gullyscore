export const DEFAULT_RULES = {
  singleBatterMode: true,
  wide: 'plusOne',
  noBall: 'plusOne',
  freeHit: true,
  bye: false,
  legBye: false,
};

export const OVER_CHIPS = [2, 5, 10];

export const DISMISSAL_TYPES = [
  { id: 'bowled', label: 'Bowled', creditBowler: true, askCatcher: false },
  { id: 'caught', label: 'Caught', creditBowler: true, askCatcher: true },
  { id: 'runout', label: 'Run Out', creditBowler: false, askCatcher: true, catcherLabel: 'Run out by' },
  { id: 'stumped', label: 'Stumped', creditBowler: true, askCatcher: true, catcherLabel: 'Stumped by' },
  { id: 'hitwicket', label: 'Hit Wicket', creditBowler: true, askCatcher: false },
  { id: 'retired', label: 'Retired Hurt', creditBowler: false, askCatcher: false },
];

export const TEAM_COLORS = {
  A: '#22c55e',
  B: '#3b82f6',
};

export const DEFAULT_TEAM_NAMES = {
  A: '',
  B: '',
};
