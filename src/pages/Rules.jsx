import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO.jsx';

export default function Rules() {
  return (
    <div className="space-y-4 pt-1">
      <SEO
        title="Rules Guide | Gullyscore"
        description="Reference for all the scoring rules Gullyscore supports, including joker, single batter mode, wides, no balls, byes and leg byes."
      />

      <header>
        <h1 className="text-2xl font-extrabold">Rules guide</h1>
        <p className="text-sm text-fg-muted mt-1">
          Quick reference for everything the app handles.
        </p>
      </header>

      <Section title="Single Batter Mode">
        <p>
          When only one batter is left, the same batter keeps facing every ball.
          Odd runs do not rotate the strike and over end does not rotate strike either.
          The non striker section disappears and a small badge shows the mode is on.
        </p>
      </Section>

      <Section title="Wide ball">
        <p>You can pick between two behaviours:</p>
        <ul className="list-disc pl-5 mt-1.5 space-y-1">
          <li><b>1 run and reroll:</b> the bowling side concedes 1 run and the ball is bowled again.</li>
          <li><b>Reroll only:</b> no run conceded, just bowl again.</li>
        </ul>
      </Section>

      <Section title="No ball">
        <p>
          A no ball always adds 1 run and is rebowled. If free hit is enabled, the next legal
          ball is a free hit and only a run out dismissal can take the wicket on that ball.
          Batter runs scored off a no ball still count for the batter.
        </p>
      </Section>

      <Section title="Byes and leg byes">
        <p>
          Both are off by default to keep things simple. Turn them on during match setup if
          your group plays with them. When on, dedicated buttons appear during scoring and
          the runs go to the team total but not to the batter.
        </p>
      </Section>

      <Section title="Joker player">
        <p>
          With an odd number of players, one player becomes the joker. The joker:
        </p>
        <ul className="list-disc pl-5 mt-1.5 space-y-1">
          <li>Fields for the bowling side every innings.</li>
          <li>Can be brought in to bat by either batting side, at any point during their innings.</li>
          <li>Stays available across both innings.</li>
          <li>If the joker is out while batting for a side, it counts as a wicket for that side and the joker cannot bat again in that innings.</li>
        </ul>
      </Section>

      <Section title="Wickets">
        <p>The app supports six dismissal types:</p>
        <ul className="list-disc pl-5 mt-1.5 space-y-1">
          <li><b>Bowled</b> and <b>Hit wicket</b> credit the bowler.</li>
          <li><b>Caught</b> and <b>Stumped</b> credit the bowler and the fielder.</li>
          <li><b>Run out</b> credits the fielder. The bowler is not credited.</li>
          <li><b>Retired hurt</b> never counts as a wicket. The player can come back later or end the innings.</li>
        </ul>
      </Section>

      <Section title="Undo">
        <p>
          Every ball can be undone one by one with the Undo button. Runs, wickets, strike
          rotation, overs, extras and batter or bowler stats all roll back together.
        </p>
      </Section>

      <Section title="Innings end">
        <p>The innings ends automatically when any of these happen:</p>
        <ul className="list-disc pl-5 mt-1.5 space-y-1">
          <li>All overs are bowled.</li>
          <li>No batter is left to come in.</li>
          <li>The batting side passes the target in the second innings.</li>
        </ul>
        <p className="mt-2">You can also tap End innings at any time.</p>
      </Section>

      <div className="card p-4">
        <div className="text-sm font-bold mb-2">More reading</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <LearnCard to="/gully-cricket-rules" title="Gully cricket rules" />
          <LearnCard to="/how-to-score-gully-cricket" title="How to score gully cricket" />
          <LearnCard to="/tennis-ball-cricket-rules" title="Tennis ball cricket rules" />
          <LearnCard to="/street-cricket-scoring-guide" title="Street cricket scoring guide" />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="card p-4">
      <h2 className="font-bold">{title}</h2>
      <div className="mt-1.5 text-sm text-fg-muted leading-relaxed">{children}</div>
    </section>
  );
}

function LearnCard({ to, title }) {
  return (
    <Link to={to} className="card p-3 flex items-center gap-2 hover:border-brand transition-colors">
      <BookOpen className="h-4 w-4 text-brand" />
      <span className="flex-1 text-sm font-medium">{title}</span>
      <ChevronRight className="h-4 w-4 text-fg-dim" />
    </Link>
  );
}
