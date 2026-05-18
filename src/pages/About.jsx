import SEO from '../components/SEO.jsx';

export default function About() {
  return (
    <div className="space-y-4 pt-1">
      <SEO
        title="About Gullyscore | Built for local cricket"
        description="Gullyscore is a free cricket scoring app made for everyday local cricket. It runs in the browser, works offline and saves matches on your device."
      />

      <header>
        <h1 className="text-2xl font-extrabold">About Gullyscore</h1>
        <p className="text-sm text-fg-muted mt-1">
          A small tool that started from a simple problem.
        </p>
      </header>

      <section className="card p-5 leading-relaxed text-sm">
        <p>
          Every weekend cricket game starts with the same fight. Who is keeping score on paper.
          Who lost the paper. What was the score at the end of the last over. Who hit that six.
        </p>
        <p className="mt-3">
          Gullyscore is built for those games. It is not a professional scorer app. It does not
          try to do everything. It tries to do the few things you actually need during a tennis
          ball or street cricket match, and it tries to do them fast.
        </p>
        <p className="mt-3">
          The whole thing runs in your browser. There is no login. No account. No tracking. Your
          matches stay on your phone and survive a refresh or a browser restart. You can install
          it as an app from the browser menu if you want and it will work without internet.
        </p>
      </section>

      <section className="card p-5">
        <h2 className="font-bold">What it handles well</h2>
        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
          <li>Quick match setup for 2 to 50 overs.</li>
          <li>Manual or automatic team split.</li>
          <li>Joker player for odd numbers, shared across both teams.</li>
          <li>Common gully rule toggles. Wides, no balls, free hit, byes, leg byes.</li>
          <li>Full ball by ball undo across the whole innings.</li>
          <li>Single batter mode for when only one batter is left.</li>
          <li>Toss with optional coin flip animation.</li>
          <li>Scorecards, top scorer and best bowler in the summary.</li>
        </ul>
      </section>

      <section className="card p-5">
        <h2 className="font-bold">What it does not do</h2>
        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
          <li>No live streaming or live commentary.</li>
          <li>No multi device sync. Each device keeps its own history.</li>
          <li>No accounts or login. Ever.</li>
        </ul>
      </section>

      <section className="card p-5 text-sm leading-relaxed">
        <h2 className="font-bold">Privacy</h2>
        <p className="mt-2">
          Everything you do in Gullyscore stays on your device. Players you add, matches you play,
          rules you pick. None of it leaves your browser.
        </p>
      </section>
    </div>
  );
}
