import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <div className="center-message"><h1>Page not found</h1><p>That page doesn’t seem to exist.</p><Link className="button primary" to="/">Go to overview</Link></div>;
}
