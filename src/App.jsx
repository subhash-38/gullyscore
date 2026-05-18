import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Setup from './pages/Setup.jsx';
import Toss from './pages/Toss.jsx';
import LiveMatch from './pages/LiveMatch.jsx';
import Summary from './pages/Summary.jsx';
import History from './pages/History.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import { useTheme } from './hooks/useTheme.js';

const GullyCricketRules = lazy(() => import('./pages/seo/GullyCricketRules.jsx'));
const HowToScore = lazy(() => import('./pages/seo/HowToScore.jsx'));
const TennisBallRules = lazy(() => import('./pages/seo/TennisBallRules.jsx'));
const StreetCricketGuide = lazy(() => import('./pages/seo/StreetCricketGuide.jsx'));

export default function App() {
  useTheme();

  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center text-fg-muted">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/toss" element={<Toss />} />
          <Route path="/match" element={<LiveMatch />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/gully-cricket-rules" element={<GullyCricketRules />} />
          <Route path="/how-to-score-gully-cricket" element={<HowToScore />} />
          <Route path="/tennis-ball-cricket-rules" element={<TennisBallRules />} />
          <Route path="/street-cricket-scoring-guide" element={<StreetCricketGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
