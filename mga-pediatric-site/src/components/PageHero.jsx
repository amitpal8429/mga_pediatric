import { Link } from 'react-router-dom';
import Wave from './Wave';

export default function PageHero({ eyebrow, title, text, crumbs = [], children }) {
  return (
    <section className="page-hero">
      <span className="blob b1" aria-hidden="true" />
      <span className="blob b2" aria-hidden="true" />
      <div className="container">
        {crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label}>
                {' / '}
                {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="eyebrow eyebrow-light">{eyebrow}</span>}
        <h1>{title}</h1>
        {text && <p className="page-hero-text">{text}</p>}
        {children}
      </div>
      <Wave className="hero-wave" />
    </section>
  );
}
