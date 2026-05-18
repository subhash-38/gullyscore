import SEO from '../../components/SEO.jsx';
import Article, { H2, H3, P, UL } from '../../components/Article.jsx';

export default function GullyCricketRules() {
  return (
    <>
      <SEO
        title="Gully Cricket Rules | Standard and Local Variations"
        description="A practical guide to gully cricket rules. How overs, wides, no balls, byes, joker players and single batter mode actually work in street and gully cricket."
        canonical="https://gullyscore.app/gully-cricket-rules"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Gully Cricket Rules',
          description: 'Common rules and local variations for gully cricket matches.',
          author: { '@type': 'Organization', name: 'Gullyscore' },
        }}
      />

      <Article
        title="Gully cricket rules"
        intro="Gully cricket has no fixed rulebook. Every street, society and rooftop ground tweaks the rules to fit the space and the number of players. Here are the rules most groups settle on, and the ones a good scorer needs to handle."
      >
        <H2>How many overs</H2>
        <P>
          Most gully matches go from 2 to 10 overs a side. Two over games are common when the
          group is split into many small teams in a single afternoon. Five and ten over games
          work well when you have steady players and proper teams. Anything longer than that and
          you will likely lose half your players to tea, calls or homework.
        </P>

        <H2>Number of players</H2>
        <P>
          Six a side is the most common count. Four a side works when space is tight. When the
          group is odd numbered, one player becomes the joker and fields for the bowling side
          while being available to bat for either side.
        </P>

        <H2>The over</H2>
        <P>
          Six legal deliveries. Wides and no balls are bowled again. The bowler usually cannot
          bowl two overs in a row, which keeps games moving and lets everyone roll their arm
          over.
        </P>

        <H2>Wides</H2>
        <P>
          Two versions are common. Either the bowling side gives away one run and the ball is
          rebowled, or the ball is just rebowled without a run. Both are fair. Pick one before
          the match and stick with it. In tight grounds, some groups also mark a wide line on
          the wall or fence.
        </P>

        <H2>No balls and free hits</H2>
        <P>
          A no ball is one run plus a rebowl. If your group plays free hits, the next legal
          ball cannot be a wicket except on a run out. This is the same as the professional
          rule and most groups have started using it because it adds a bit of drama.
        </P>

        <H2>Byes and leg byes</H2>
        <P>
          Many gully groups simply do not score byes or leg byes. The keeper saves what they
          can and any runs are usually overthrown or missed by mistake. If you do score them,
          they go to the team total but not to the batter. Gullyscore lets you turn these on
          or off in match setup.
        </P>

        <H2>Joker player</H2>
        <P>
          The joker is the most useful invention in gully cricket. With odd numbers, the joker
          fields for the bowling side every innings, and either batting side can bring the
          joker in to bat at any point. Once the joker is out for a side, they have to keep
          fielding but cannot bat for that side again in that innings.
        </P>

        <H2>Single batter mode</H2>
        <P>
          When only one batter is left, most groups let that batter continue alone. The same
          batter faces every ball and the strike does not rotate. The innings ends when this
          batter is out, when overs run out, or when the target is reached.
        </P>

        <H2>Wickets</H2>
        <UL>
          <li>Bowled and hit wicket are obvious and credit the bowler.</li>
          <li>Caught credits the bowler and the fielder.</li>
          <li>Run out credits only the fielder.</li>
          <li>Stumped is rare in gully but is supported the same way as professional cricket.</li>
          <li>Retired hurt is not a wicket. The player can come back or end their innings.</li>
        </UL>

        <H2>Boundaries</H2>
        <P>
          Local marks decide what counts as a four or six. A common rule is that if the ball
          clears a chosen wall, it is six, and if it reaches the wall on the bounce, it is
          four. Some groups also have a one tip one hand rule where a clean one bounce catch
          is out.
        </P>

        <H2>One tip one hand</H2>
        <P>
          A favourite in apartment cricket. The fielder must catch the ball one handed after a
          single bounce for the catch to count. It is not a standard rule, just turn it on
          before the match and tell everyone.
        </P>

        <H2>Tip and run</H2>
        <P>
          Once the bat touches the ball, the batter must run. Some street groups play this
          because it forces fast cricket and short innings. The app does not need a special
          mode for this, just press the runs button each time they cross.
        </P>
      </Article>
    </>
  );
}
