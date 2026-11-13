import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { useSeo } from '../hooks/useSeo';
import { SITE } from '../config/site';

// Shared layout for Privacy policy, Terms & Conditions and Refund policy.
export default function LegalPage({ doc, path }) {
  useSeo({ title: doc.title, description: doc.intro, path });
  return (
    <>
      <PageHero crumbs={[{ label: doc.title }]} eyebrow="Legal" title={doc.title} text={doc.intro} />
      <div className="container content-grid">
        <aside className="toc" aria-label="On this page">
          <h4>On this page</h4>
          {doc.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{s.heading}</a>
          ))}
        </aside>
        <article className="prose">
          {doc.sections.map((s) => (
            <section key={s.id}>
              <h2 id={s.id}>{s.heading}</h2>
              {s.body.map((p, i) => <p key={i}>{p}</p>)}
              {s.list && <ul>{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
            </section>
          ))}
          <div className="notice">
            Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or visit our <Link to="/support">Support page</Link>.
          </div>
        </article>
      </div>
    </>
  );
}
