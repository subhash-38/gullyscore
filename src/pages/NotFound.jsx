import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <SEO title="Page not found | Gullyscore" />
      <div className="text-5xl font-extrabold">404</div>
      <p className="mt-2 text-fg-muted">That page does not exist.</p>
      <Link to="/" className="btn-primary mt-5 inline-flex">
        Back to home
      </Link>
    </div>
  );
}
