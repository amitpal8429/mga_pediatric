import { Link } from 'react-router-dom';

export function Skeletons({ count = 6, height = 320 }) {
  return Array.from({ length: count }, (_, i) => <div key={i} className="skeleton" style={{ height }} aria-hidden="true" />);
}

export function ErrorState({ error, onRetry, backTo }) {
  return (
    <div className="state-box state-error" role="alert">
      <h3>We could not load this from the Medical Global Academy API</h3>
      <p>{error?.message || String(error || 'Unknown error')}</p>
      <p className="small">
        If the browser blocked the request (CORS), run the site with <code>npm run dev</code> or deploy with the included proxy
        rewrite (<code>public/_redirects</code> / <code>vercel.json</code>).
      </p>
      <div className="state-actions">
        {onRetry && <button className="btn btn-primary" onClick={onRetry}>Try again</button>}
        {backTo && <Link className="btn btn-outline" to={backTo.to}>{backTo.label}</Link>}
      </div>
    </div>
  );
}

export function EmptyState({ children }) {
  return <div className="state-box">{children}</div>;
}
