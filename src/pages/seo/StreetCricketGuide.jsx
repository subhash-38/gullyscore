import SEO from '../../components/SEO.jsx';
import Article, { H2, P, UL } from '../../components/Article.jsx';

export default function StreetCricketGuide() {
  return (
    <>
      <SEO
        title="Street Cricket Scoring Guide"
        description="A simple street cricket scoring guide. How to track runs, wickets, overs and run rates during a fast paced gully match without losing the plot."
        canonical="https://gullyscore.app/street-cricket-scoring-guide"
      />

      <Article
        title="Street cricket scoring guide"
        intro="Scoring a street match is not hard. It just has to be fast. Here is the simple rhythm that keeps the scoreboard right without slowing the game down."
      >
        <H2>Before the match</H2>
        <UL>
          <li>Agree on the number of overs.</li>
          <li>Agree on wide and no ball rules. Will they cost a run or just be rebowled.</li>
          <li>Decide if free hits are on after a no ball.</li>
          <li>Decide what counts as a four and a six. Where is the boundary.</li>
          <li>Agree on the last batter rule. Single batter mode or all out.</li>
        </UL>

        <H2>During the match</H2>
        <P>
          Keep your eyes on the bowler and the batter. Between balls, look at the screen.
          Tap a run value, a wide, a no ball or a wicket. The app keeps the strike rotation,
          the over count and the run rate in sync.
        </P>

        <H2>Quick scoring patterns</H2>
        <UL>
          <li>Defended dot. Tap 0.</li>
          <li>Singled to deep cover. Tap 1. Strike rotates automatically.</li>
          <li>Driven four through covers. Tap 4. Boundary count goes up for the batter.</li>
          <li>Slogged six over midwicket. Tap 6.</li>
          <li>Wide down leg side. Tap Wide.</li>
          <li>Stepped over the line. Tap No ball.</li>
          <li>Caught at long on. Tap Wicket, then Caught, then the fielder name.</li>
        </UL>

        <H2>Tracking the chase</H2>
        <P>
          In the second innings you will see how many runs are needed and how many balls are
          left. The required rate updates after every ball. The chase can swing on a single
          wicket or a single boundary, so keep an eye on the screen while you are scoring.
        </P>

        <H2>End of over</H2>
        <P>
          After six legal balls, the over ends. The app rotates strike automatically and asks
          you to pick the next bowler. The same bowler cannot bowl two overs in a row, which
          the app enforces for you.
        </P>

        <H2>After the match</H2>
        <P>
          The summary shows the result, full scorecards for both innings, the top scorer and
          the best bowler. From there you can rematch the same teams, reshuffle, let the
          winner bat first next, or just go home. Everything is saved to your device, so
          even if you close the browser you can come back later and reread it.
        </P>
      </Article>
    </>
  );
}
