import { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPediatricCourse, getPediatricCourses } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { useSeo } from '../hooks/useSeo';
import { useScrollSpy } from '../hooks/useScrollSpy';
import CourseCard from '../components/CourseCard';
import CourseImage from '../components/CourseImage';
import ModuleList from '../components/ModuleList';
import Icon from '../components/Icon';
import EnquiryForm from '../components/EnquiryForm';
import { ErrorState, Skeletons } from '../components/States';
import { SITE } from '../config/site';
import { courseUrl, excerpt, futureDate, mailLink, money, paragraphs, typeLabel, whatsappLink } from '../utils/format';
import { focusArea } from '../utils/pediatric';

function EnquiryModal({ course, onClose }) {
  // Esc key se close, aur modal khulne par background scroll band
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="enq-overlay" onClick={onClose} role="presentation">
      <div
        className="enq-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Enquiry form"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="enq-close" onClick={onClose} aria-label="Close enquiry form">
          ×
        </button>
        <EnquiryForm course={course} />
      </div>
    </div>
  );
}

function Detail({ d, all, slug }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const closeEnquiry = useMemo(() => () => setEnquiryOpen(false), []);

  const listed = all.find((c) => c.slug === d.slug) || {};
  const type = d.type || listed.type;
  const area = focusArea({ name: d.name });
  const start = futureDate(listed.start_date || d.start_date);
  const total = money(d.total_fee);
  const fee = money(d.fee);
  const online = money(listed.online_cpd || d.online_cpd);
  const hybrid = money(listed.hybrid_cpd || d.hybrid_cpd);
  const isTop = Number(listed.top_courses ?? d.top_courses) === 1;
  const hasHybrid = Number(listed.hybrid_cpd || d.hybrid_cpd) > 0;

  const highlights = d.highlight || [];
  const learn = d.what_you_learn || [];
  const workshop = d.workshop;
  const modules = d.module || [];

  const sections = [
    { id: 'overview', label: 'Overview', show: true },
    { id: 'highlights', label: 'Highlights', show: highlights.length > 0 },
    { id: 'learn', label: 'Curriculum', show: learn.length > 0 || modules.length > 0 },
    { id: 'training', label: 'Training', show: !!workshop }
  ].filter((s) => s.show);

  const active = useScrollSpy(sections.map((s) => s.id));

  useSeo({
    title: d.name,
    description: excerpt(d.description, 155),
    path: courseUrl(slug),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: d.name,
      description: excerpt(d.description, 300),
      provider: { '@type': 'Organization', name: SITE.parent, sameAs: SITE.mainSite },
      ...(total ? { offers: { '@type': 'Offer', priceCurrency: SITE.currency, price: String(d.total_fee), category: type } } : {})
    }
  });

  const related = useMemo(
    () =>
      all
        .filter((c) => c.slug !== d.slug)
        .sort((a, b) => Number(b.type === type) - Number(a.type === type) || Number(b.top_courses) - Number(a.top_courses))
        .slice(0, 3),
    [all, d.slug, type]
  );

  const subject = `Enquiry: ${d.name}`;
  const wa = whatsappLink(`Hello, I would like to know more about ${d.name}`);

  const facts = [
    { icon: 'clock', label: 'Duration', value: `${d.duration} Months` },
    { icon: 'calendar', label: 'Starts', value: start || 'Enrolling now' },
    { icon: 'laptop', label: 'Mode', value: hasHybrid ? 'Online / Hybrid' : 'Online' },
    { icon: 'award', label: 'Level', value: typeLabel(type) }
  ];

  return (
    <div className="hm" style={{ paddingBottom: '80px' }}>
      {/* HERO SECTION */}
      <section className="hm-d-hero">
        <div className="container hm-d-hero-grid">
          <div className="hm-d-content">
            <nav className="hm-crumbs">
              <Link to="/">Home</Link> / <Link to="/courses">Courses</Link> / <span>{typeLabel(type)}</span>
            </nav>

            <div className="hm-d-tags">
              <span className="hm-tag primary">{typeLabel(type)}</span>
              <span className="hm-tag">{area}</span>
              {isTop && (
                <span className="hm-tag accent">
                  <Icon name="star" size={12} /> Top rated
                </span>
              )}
            </div>

            <h1>{d.name}</h1>
            <p className="hm-d-lead">{excerpt(d.description, 210)}</p>

            <div className="hm-actions">
              <button type="button" className="hm-btn hm-btn-solid" onClick={() => setEnquiryOpen(true)}>
                <Icon name="mail" size={18} /> Enquire now
              </button>
              <a className="hm-btn hm-btn-line" href={wa} target="_blank" rel="noopener noreferrer">
                <Icon name="chat" size={18} /> WhatsApp
              </a>
            </div>
          </div>

          <div className="hm-d-visual">
            <div className="hm-d-frame">
              <CourseImage course={{ ...d, ...listed, image: d.image || listed.image }} />
            </div>
            <div className="hm-d-fee-card">
              <span>Total fee</span>
              <b>{total || fee || 'On request'}</b>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <div className="container">
        <div className="hm-facts-grid">
          {facts.map((f) => (
            <div className="hm-fact-box" key={f.label}>
              <span className="fi">
                <Icon name={f.icon} size={22} />
              </span>
              <div>
                <small>{f.label}</small>
                <b>{f.value}</b>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container hm-d-layout">
        <div className="hm-d-main">
          <nav className="hm-d-tabs">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''}>
                {s.label}
              </a>
            ))}
          </nav>

          <section id="overview" className="hm-d-panel">
            <h2>About this program</h2>
            <div className="hm-prose">
              {paragraphs(d.description).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {highlights.length > 0 && (
            <section id="highlights" className="hm-d-panel">
              <h2>Program highlights</h2>
              <ul className="hm-check-list">
                {highlights.map((h) => (
                  <li key={h.id}>
                    <span className="check-icon">
                      <Icon name="check" size={14} />
                    </span>
                    <span>{h.highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {learn.length > 0 && (
            <section id="learn" className="hm-d-panel">
              <h2>What you will learn</h2>
              <div className="hm-learn-grid">
                {learn.map((l, i) => (
                  <div className="hm-learn-card" key={l.id}>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    <h4>{l.heading}</h4>
                    <p>{l.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {workshop && (
            <section id="training" className="hm-d-panel">
              <h2>{workshop.title || 'Training'}</h2>
              {workshop.subtitle && <p className="hm-sub">{workshop.subtitle}</p>}
              <div className="hm-training">
                {(workshop.parts || []).map((p) => (
                  <div className="hm-train-part" key={p.id}>
                    <h4>{p.title}</h4>
                    {p.subtitle && <p className="hm-text-muted">{p.subtitle}</p>}
                    <ul className="hm-check-list">
                      {(p.key_points || []).map((k) => (
                        <li key={k.id}>
                          <span className="check-icon">
                            <Icon name="check" size={14} />
                          </span>
                          <span>{k.content}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {modules.length > 0 && (
            <section id="curriculum" className="hm-d-panel">
              <h2>Curriculum</h2>
              <ModuleList modules={modules} />
            </section>
          )}
        </div>

        {/* STICKY SIDEBAR */}
        <aside className="hm-d-sidebar">
          <div className="hm-enrol-card">
            <div className="hm-enrol-head">
              <small>Total program fee</small>
              <div className="price">{total || fee || 'Enquire'}</div>
            </div>
            <div className="hm-enrol-body">
              <ul className="hm-kv">
                <li>
                  <span>Level</span>
                  <b>{typeLabel(type)}</b>
                </li>
                <li>
                  <span>Speciality</span>
                  <b>{area}</b>
                </li>
                <li>
                  <span>Duration</span>
                  <b>{d.duration} Months</b>
                </li>
                <li>
                  <span>Start</span>
                  <b>{start || 'Enrolling now'}</b>
                </li>
                {fee && (
                  <li>
                    <span>Registration fee</span>
                    <b>{fee}</b>
                  </li>
                )}
                {online && (
                  <li>
                    <span>Online + CPD</span>
                    <b>{online}</b>
                  </li>
                )}
                {hybrid && (
                  <li>
                    <span>Hybrid + CPD</span>
                    <b>{hybrid}</b>
                  </li>
                )}
              </ul>
              <div className="hm-enrol-actions">
                <button type="button" className="hm-btn hm-btn-solid" onClick={() => setEnquiryOpen(true)}>
                  <Icon name="mail" size={18} /> Enquire now
                </button>
                <a className="hm-btn hm-btn-line" href={wa} target="_blank" rel="noopener noreferrer">
                  <Icon name="chat" size={18} /> WhatsApp us
                </a>
                <a className="hm-btn hm-btn-light" href={`tel:${SITE.phoneRaw}`}>
                  <Icon name="phone" size={18} /> {SITE.phone}
                </a>
              </div>
            </div>
          </div>

          {/* CERTIFICATE SECTION (CPD & ACTD) */}
          <div className="hm-cert-card">
            <h4>Globally Accredited</h4>
            <div className="hm-cert-list">
              <div className="hm-cert-item">
                <img
                  src="https://medicalglobalacademy.com/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-17-at-10.15.41-AM.jpeg"
                  alt="CPD Accreditation"
                  loading="lazy"
                />
              </div>
              <div className="hm-cert-item">
                <img
                  src="https://medicalglobalacademy.com/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-17-at-5.58.43-PM.jpeg"
                  alt="ACTD Accreditation"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* RELATED COURSES */}
      {related.length > 0 && (
        <section className="hm-block hm-block-tint">
          <div className="container">
            <div className="hm-head hm-head-split">
              <div className="hm-head-left">
                <div>
                  <p className="hm-eyebrow">Keep exploring</p>
                  <h2>More pediatric programs</h2>
                </div>
              </div>
              <Link className="hm-btn hm-btn-line" to="/courses">
                View all <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="hm-cards-grid">
              {related.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MOBILE CTA */}
      <div className="hm-mobile-cta">
        <button type="button" className="hm-btn hm-btn-solid" onClick={() => setEnquiryOpen(true)}>
          Enquire
        </button>
        <a className="hm-btn hm-btn-line" href={wa} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </div>

      {enquiryOpen && <EnquiryModal course={d.name} onClose={closeEnquiry} />}
    </div>
  );
}

export default function CourseDetail() {
  const { slug } = useParams();
  const { data, error, loading, retry } = useAsync(
    () => Promise.all([getPediatricCourse(slug), getPediatricCourses()]),
    [slug]
  );

  if (loading) {
    return (
      <div className="hm" style={{ padding: '80px 0' }}>
        <div className="container">
          <Skeletons count={1} height={400} />
        </div>
      </div>
    );
  }
  if (error || !data?.[0]?.name) {
    return (
      <div className="hm" style={{ padding: '80px 0' }}>
        <div className="container">
          <ErrorState
            error={error || new Error('Course not found')}
            onRetry={retry}
            backTo={{ to: '/courses', label: 'Browse pediatric courses' }}
          />
        </div>
      </div>
    );
  }
  return <Detail d={data[0]} all={data[1]} slug={slug} />;
}