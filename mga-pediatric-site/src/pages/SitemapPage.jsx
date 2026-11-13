import { Link } from 'react-router-dom';
import { getPediatricCourses } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { useSeo } from '../hooks/useSeo';
import { COMPANY_LINKS, LEGAL_LINKS } from '../config/site';
import { courseUrl, typePlural } from '../utils/format';
import '../styles/pages.css';

export default function SitemapPage() {
  useSeo({ title: 'Sitemap', description: 'All pages and pediatric courses on the MGA Pediatrics website.', path: '/sitemap' });
  const { data: courses } = useAsync(() => getPediatricCourses().catch(() => []), []);
  const groups = (courses || []).reduce((m, c) => ((m[c.type] ||= []).push(c), m), {});

  return (
    <div className="hm">
      {/* HERO SECTION */}
      <section className="hm-hero hm-hero-small">
        <div className="container">
          <div className="hm-crumbs" style={{ marginBottom: '24px' }}>
            <Link to="/">Home</Link> <span>/</span> <span>Sitemap</span>
          </div>
          <p className="hm-kicker">Sitemap</p>
          <h1>Everything on <em>one page</em></h1>
          <p className="hm-lead">
            Find any page or pediatric course quickly. Search engines can use our XML sitemap.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <div className="container" style={{ paddingBottom: '100px', maxWidth: '900px' }}>
        
        {/* 1. MAIN PAGES (Simple List like Image 1 & 2) */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'var(--hm-sans)', fontSize: '2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--hm-ink)' }}>
            Main pages
          </h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/" className="sitemap-link">Home</Link></li>
            <li><Link to="/courses" className="sitemap-link">Pediatric courses</Link></li>
            <li><Link to="/faculty" className="sitemap-link">Faculty</Link></li>
            {COMPANY_LINKS.map((l) => <li key={l.to}><Link to={l.to} className="sitemap-link">{l.label}</Link></li>)}
          </ul>
        </div>

        {/* 2. LEGAL (Simple List like Image 1 & 2) */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'var(--hm-sans)', fontSize: '2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--hm-ink)' }}>
            Legal
          </h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {LEGAL_LINKS.map((l) => <li key={l.to}><Link to={l.to} className="sitemap-link">{l.label}</Link></li>)}
            <li>
              <a href="/sitemap.xml" className="sitemap-link" target="_blank" rel="noopener noreferrer">
                sitemap.xml (for search engines)
              </a>
            </li>
          </ul>
        </div>

        {/* 3. COURSES SECTION (Simple Lists stacked vertically) */}
        {Object.keys(groups).length > 0 && (
          <div>
            {Object.entries(groups).map(([type, list]) => (
              <div key={type} style={{ marginBottom: '56px' }}>
                <h2 style={{ fontFamily: 'var(--hm-sans)', fontSize: '2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--hm-ink)' }}>
                  {typePlural(type)}
                </h2>
                <ul style={{ listStyleType: 'disc', paddingLeft: '24px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link to={courseUrl(c.slug)} className="sitemap-link">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* CUSTOM CSS FOR LINKS */}
      <style>{`
        .sitemap-link {
          color: #1A56DB; /* Matches the blue link color in your screenshot */
          text-decoration: none;
          font-family: var(--hm-sans);
          font-size: 1.15rem;
          transition: color 0.2s ease;
        }
        .sitemap-link:hover {
          text-decoration: underline;
          color: var(--hm-teal);
        }
      `}</style>
    </div>
  );
}