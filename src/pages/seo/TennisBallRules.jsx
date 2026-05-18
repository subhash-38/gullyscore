import SEO from '../../components/SEO.jsx';
import Article, { H2, P, UL } from '../../components/Article.jsx';

export default function TennisBallRules() {
  return (
    <>
      <SEO
        title="Tennis Ball Cricket Rules and Scoring"
        description="Rules and scoring conventions for tennis ball cricket. How wides, no balls, boundaries and wickets are usually handled in tape ball and tennis ball matches."
        canonical="https://gullyscore.app/tennis-ball-cricket-rules"
      />

      <Article
        title="Tennis ball cricket rules"
        intro="Tennis ball cricket is its own sport. The ball moves faster, swings less, bounces higher and the pitch is usually shorter. The rules adjust to fit, and the scoring needs to keep up."
      >
        <H2>The ball</H2>
        <P>
          A regular tennis ball is light. Some groups tape one side or the entire ball with
          electrical tape to make a tape ball that swings and skids. A taped tennis ball
          behaves a lot like a leather ball at half the speed and is much safer for narrow
          streets.
        </P>

        <H2>The pitch</H2>
        <P>
          Tennis ball matches are played on concrete, cement, matting, dust or even grass.
          The pitch is short, usually 16 to 20 yards instead of 22. Bowlers run in shorter and
          the batter has less time to react. Scoring tends to be high because the ball flies
          off the bat.
        </P>

        <H2>Number of players</H2>
        <P>
          Six or seven a side is most common. Tape ball tournaments are usually eight or nine
          a side. Park games with friends are usually four to six per team. With odd numbers,
          a joker player is the cleanest way to fix the imbalance.
        </P>

        <H2>Wides and no balls</H2>
        <UL>
          <li>Wides usually cost 1 run and are rebowled.</li>
          <li>No balls cost 1 run and are rebowled.</li>
          <li>Free hits are increasingly common and Gullyscore supports them.</li>
          <li>Front foot no balls are not always called in casual matches. Pick a rule and stick to it.</li>
        </UL>

        <H2>Boundaries</H2>
        <P>
          On most local grounds, a four needs to reach the rope, fence or chosen marker on
          the bounce or roll. A six needs to clear it on the full. In rooftop or apartment
          cricket, hitting the wall on the full is often six, hitting on the bounce is four.
        </P>

        <H2>Wickets</H2>
        <P>
          Bowled, caught, run out, stumped and hit wicket all work the same as professional
          cricket. Caught off the wall is usually not out unless the group has agreed
          otherwise. One tip one hand is a popular house rule for narrow grounds where a
          clean one bounce one handed catch is out.
        </P>

        <H2>Common house rules</H2>
        <UL>
          <li>Last man standing. The last batter can bat alone with strike not rotating.</li>
          <li>Six and out. Hit a six and you are out. Rare but exists in tight grounds.</li>
          <li>Boundary catch on the wall. Some allow, some do not. Decide before the match.</li>
          <li>Powerplay overs. Not common but used in tournaments.</li>
        </UL>

        <H2>Match length</H2>
        <P>
          Two over slogs, four over knockouts and eight or ten over league games are all
          common formats. Choose what fits your time. Gullyscore handles any number of overs
          and tracks run rates, required rates and wickets in hand for the chase.
        </P>
      </Article>
    </>
  );
}
