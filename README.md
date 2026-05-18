# Gullyscore

Cricket scoring app for gully, street and tennis ball cricket. Set up a match in under 30 seconds, score ball by ball, and everything gets saved locally on your device. No sign ups, no cloud, no nonsense.

Built this because existing scoring apps are way too complicated for a casual game in the parking lot.

---

## What it does

- **Fast match setup** — add players, split teams manually or randomly, pick overs and start
- **Captain-named teams** — teams are identified by captain name, not "Team A" and "Team B"
- **Joker player** — for odd numbered groups, one shared player bats for both sides
- **Coin toss** — built in flip animation, or just pick the winner manually
- **One tap scoring** — tap 0, 1, 2, 3, 4, 6 for runs. Wide, no ball, bye, leg bye buttons
- **Wickets** — caught, bowled, run out, stumped, hit wicket, retired hurt with fielder selection
- **Single batter mode** — kicks in automatically when only one batter is left
- **Full undo** — revert any delivery, including runs, wickets, strike changes, everything
- **Live stats** — run rate, required rate, strike rate, economy, all updating in real time
- **Match history** — saves last 50 completed matches with delete and clear all
- **Dark and light themes** — dark by default
- **Works offline** — installable as a PWA on any phone
- **Private** — zero data leaves your device

---

## Tech stack

- React 18
- Vite 5
- Tailwind CSS 3
- Zustand (state management)
- React Router 6
- Lucide icons
- vite-plugin-pwa

---

## Running locally

You need Node.js 18 or newer installed.

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

---

## Production build

```bash
npm run build
npm run preview
```

Build output goes into `dist/`. Preview lets you test the production version locally before deploying.

---

## Project structure

```
src/
  components/     Reusable UI pieces (modals, toast, etc.)
  data/           Default settings, rules, dismissal types
  engine/         Match engine logic, no React dependency
  hooks/          useTheme, useToast
  pages/          All route pages (Home, Setup, Toss, LiveMatch, Summary, History)
  services/       localStorage wrapper
  store/          Zustand stores (match, history, players, settings)
  styles/         Tailwind entry and design tokens
  utils/          Formatters and ID generators
  App.jsx         Router config
  main.jsx        Entry point

index.html          HTML shell with meta tags and structured data
vite.config.js      Vite and PWA config
tailwind.config.js  Tailwind setup
vercel.json         Deployment settings
```

---

## Deploying to Vercel

The project is already configured for Vercel. Just connect your GitHub repo.

1. Push this code to a GitHub repository
2. Go to vercel.com, sign in with GitHub
3. Click "Add New Project" and import your repo
4. Vercel detects Vite automatically. The build command and output directory are set in `vercel.json` so you do not need to change anything
5. Hit deploy. Done in about a minute

The site stays live permanently. Vercel hosts static sites on a CDN so there is no server that sleeps or shuts down. Even if nobody visits for six months, the next visitor gets an instant response. The free plan gives 100 GB bandwidth per month which is more than enough for a personal project.

---

## Pushing to GitHub

If you have not set up Git yet:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gullyscore.git
git push -u origin main
```

Replace the URL with your actual repository URL. GitHub will ask for a personal access token instead of a password — you can generate one under Settings > Developer Settings > Personal Access Tokens.

---

## Installing on your phone

Since this is a PWA, you can add it to your home screen and use it like a regular app.

**Android:** Open the site in Chrome, tap the three dot menu, tap "Install app"

**iPhone:** Open the site in Safari, tap the share button, tap "Add to Home Screen"

After installing it works fully offline.

---

## Where data is stored

Everything lives in the browser's localStorage under keys prefixed with `gs:`.

- `gs:players` — saved player pool for quick add
- `gs:settings` — theme, default overs, default rules
- `gs:history` — last 50 completed matches
- `gs:active` — current in-progress match if any

Clearing your browser data will wipe everything. There is no cloud backup.

---

## License

MIT
