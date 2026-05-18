import SEO from '../../components/SEO.jsx';
import Article, { H2, H3, P, UL } from '../../components/Article.jsx';

export default function HowToScore() {
  return (
    <>
      <SEO
        title="How to Score a Gully Cricket Match"
        description="A simple walkthrough of how to score a gully cricket match. Setup, toss, scoring runs, recording wickets, byes, leg byes and the joker player."
        canonical="https://gullyscore.app/how-to-score-gully-cricket"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to score a gully cricket match',
          step: [
            { '@type': 'HowToStep', name: 'Set up the match' },
            { '@type': 'HowToStep', name: 'Add players and split teams' },
            { '@type': 'HowToStep', name: 'Pick rules' },
            { '@type': 'HowToStep', name: 'Do the toss' },
            { '@type': 'HowToStep', name: 'Score ball by ball' },
            { '@type': 'HowToStep', name: 'Wrap up with the summary' },
          ],
        }}
      />

      <Article
        title="How to score a gully cricket match"
        intro="If you have ever lost track of the score halfway through an over, this guide is for you. Scoring a gully match is easy if you keep a few things in your head and let the app do the rest."
      >
        <H2>1. Match setup</H2>
        <P>
          Decide how many overs you want to play. Most groups go with 2, 5 or 10. Gullyscore
          accepts any number between 1 and 50. Set the number before anything else so the
          chase and run rate make sense.
        </P>

        <H2>2. Add players</H2>
        <P>
          Type each name once. The app remembers them so the next time you start a match the
          same names show up as quick add chips. If a name is wrong you can remove and retype
          it in seconds.
        </P>

        <H2>3. Split teams</H2>
        <P>
          If you already know who plays for whom, tap pick manually. Otherwise let the app
          shuffle and split for you. With an odd number, the app asks if you want to pick the
          joker yourself or let it pick at random.
        </P>

        <H2>4. Choose rules</H2>
        <UL>
          <li>Single batter mode for when only one batter is left.</li>
          <li>Wide ball setting. Either 1 run and reroll, or reroll only.</li>
          <li>No ball free hit. On or off.</li>
          <li>Byes and leg byes. Most groups leave these off.</li>
        </UL>

        <H2>5. Toss</H2>
        <P>
          If the toss has happened on the ground already, just pick the winner and the
          decision. If not, tap to flip a virtual coin, call heads or tails, and continue.
        </P>

        <H2>6. Score the match</H2>
        <H3>Runs</H3>
        <P>
          Tap 0, 1, 2, 3, 4 or 6 after every legal ball. The runs go to the batter, the team
          total goes up, and the bowler concedes them. Strike rotates on odd runs and at the
          end of the over.
        </P>

        <H3>Extras</H3>
        <P>
          Tap Wide or No ball for an illegal delivery. Both will cause the ball to be rebowled.
          If byes and leg byes are on, tap Bye or Leg bye first and then a run value.
        </P>

        <H3>Wickets</H3>
        <P>
          Tap Wicket and pick how the batter is out. For caught and stumped, type the fielder
          name. For run out, type the fielder name and pick how many runs were completed
          before the run out. For retired hurt, choose whether the player can come back later
          or the innings ends here.
        </P>

        <H3>Joker</H3>
        <P>
          If a joker is in the match, tap Use joker any time during your innings. Pick whether
          the joker replaces the striker, the non striker, or fills an open batter slot after
          a wicket.
        </P>

        <H3>Undo</H3>
        <P>
          Made a mistake. Tap Undo. It rolls back exactly one ball. Hit it twice to roll back
          two and so on. Strike, overs, runs, wickets, stats all come back to where they were.
        </P>

        <H2>7. End of the match</H2>
        <P>
          The app announces the result when the chase finishes, all batters are out, or the
          overs run out. The summary shows the full scorecard for both innings, top scorer,
          best bowler, and quick buttons to rematch the same teams, reshuffle, toss again or
          let the winner bat first next.
        </P>

        <H2>Tips from games we have scored</H2>
        <UL>
          <li>Keep one phone with one scorer. Two scorers can drift apart fast.</li>
          <li>Lock orientation if the screen keeps rotating mid match.</li>
          <li>Plug in or keep the phone charged. Live scoring eats some battery.</li>
          <li>If a ball was a no ball but you tapped a run, hit Undo and tap No ball.</li>
        </UL>
      </Article>
    </>
  );
}
