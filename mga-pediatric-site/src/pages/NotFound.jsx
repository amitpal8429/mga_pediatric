import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'The page you are looking for does not exist.', path: '/404' });
  return (
    <div className="container nf">
      <div className="big">404</div>
      <h2>We could not find that page</h2>
      <p className="small">The link may be broken or the page may have moved.</p>
      <div className="cta-actions">
        <Link className="btn btn-primary" to="/">Go home</Link>
        <Link className="btn btn-outline" to="/courses">Browse courses</Link>
      </div>
    </div>
  );
}
