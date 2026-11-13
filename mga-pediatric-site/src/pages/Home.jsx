import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPediatricCourses, getPediatricFaculty } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { useSeo } from '../hooks/useSeo';
import CourseCard from '../components/CourseCard';
import FacultyCard from '../components/FacultyCard';
import Icon from '../components/Icon';
import { ErrorState, Skeletons } from '../components/States';
import { SITE } from '../config/site';
import { typePlural } from '../utils/format';
import { focusAreas } from '../utils/pediatric';
import '../styles/pages.css';

const LEVEL_BLURB = {
  Fellowship: 'Advanced, case-based training for doctors who want to go deep.',
  'Pg Diploma': 'Structured one-year diplomas in pediatric and child health.',
  Certificate: 'Focused programs that sharpen core clinical skills.'
};

const STAGES = [
  { title: 'Newborn & neonatal care', text: 'Resuscitation, preterm care, NICU practice and neonatal echocardiography.', q: 'neonat' },
  { title: 'Growth, nutrition & vaccines', text: 'Child growth and development, nutrition, immunization and preventive care.', q: 'immuniz' },
  { title: 'Pediatric sub-specialities', text: 'Neurology, cardiology, endocrinology, genetics, orthopedics and more.', q: 'pediatric' },
  { title: 'Maternal & adolescent health', text: 'Reproductive health, maternal and child health, adolescent care.', q: 'adolescent' }
];

const TRUST = [
  'CPD UK & ACTD accredited',
  'Live + recorded classes',
  'One-year mentorship',
  'No-cost EMI options'
];

const STEPS = [
  { title: 'Choose & enrol', text: 'Pick a fellowship or PG diploma, with flexible payment and no-cost EMI options.' },
  { title: 'Learn your way', text: 'Join live interactive sessions or watch recordings, with e-books, notes and case-based learning.' },
  { title: 'Get mentored', text: 'Learn from experienced doctors and use one-year mentorship for questions beyond class.' },
  { title: 'Assess & certify', text: 'Complete the final assessment and MCQ-based exam to receive your certification.' }
];

const POPULAR_FALLBACK = ['Neonatology', 'Cardiology', 'Neurology', 'Child Health'];

// Mouse position ke hisaab se element ko tilt + glare position dene wala helper.
// Har element par CSS variables (--rx, --ry, --gx, --gy) set hote hain.
const tilt = (max = 8) => ({
  onMouseMove(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - py) * max).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * max).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
  },
  onMouseLeave(e) {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }
});

export default function Home() {
  useSeo({
    description: 'Pediatric, neonatal and child-health fellowships and PG diplomas for doctors, taught online by practising specialists at Medical Global Academy.',
    path: '/'
  });

  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const rail = useRef(null);
  const { data, error, loading, retry } = useAsync(
    () => Promise.all([getPediatricCourses(), getPediatricFaculty()]),
    []
  );

  const view = useMemo(() => {
    if (!data) return null;
    const [courses, faculty] = data;

    const byType = courses.reduce((m, c) => {
      m[c.type] = (m[c.type] || 0) + 1;
      return m;
    }, {});

    const areas = focusAreas(courses);
    const top = courses.filter((c) => Number(c.top_courses) === 1);
    const rest = courses.filter((c) => Number(c.top_courses) !== 1);
    const featured = [...top, ...rest].slice(0, 9);

    const facPick = [
      ...faculty.filter((f) => f.image_url),
      ...faculty.filter((f) => !f.image_url)
    ].slice(0, 8);

    return { courses, faculty, byType, areas, featured, facPick };
  }, [data]);

  const popular = view?.areas.slice(0, 4).map((a) => a.label) || POPULAR_FALLBACK;

  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/courses?q=${encodeURIComponent(term)}` : '/courses');
  };

  const scrollRail = (dir) => {
    rail.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  const courseCount = view ? view.courses.length : 12;
  const facultyCount = view ? view.faculty.length : 8;

  return (
    <div className="hm">
      {/* HERO */}
      <section className="hm-hero">
        <div className="container hm-hero-grid">
          <div className="hm-hero-copy">
            <p className="hm-kicker">Pediatrics department · Medical Global Academy</p>
            <h1>
              Raise the standard of <em>child care</em>, one case at a time.
            </h1>
            <p className="hm-lead">
              Online fellowships, Certificate and PG diplomas in pediatrics, neonatology and child health, taught by
              practising specialists and built around your clinical schedule.
            </p>

            <form className="hm-search" onSubmit={onSearch} role="search">
              <label htmlFor="hero-q" className="sr-only">Search pediatric courses</label>
              <Icon name="search" size={18} />
              <input
                id="hero-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search neonatology, cardiology, child health…"
              />
              <button className="hm-btn hm-btn-solid" type="submit">Search</button>
            </form>

            <div className="hm-popular">
              <span>Popular</span>
              {popular.map((t) => (
                <Link key={t} to={`/courses?area=${encodeURIComponent(t)}`}>{t}</Link>
              ))}
            </div>
          </div>

          {/* 3D STACK */}
          <div className="hm-deck" {...tilt(12)} role="group" aria-label="Academy at a glance">
            <div className="hm-deck-scene">
              <div className="hm-layer hm-layer-back">
                <span>Accreditation</span>
                <b>CPD</b>
                <small>UK &amp; ACTD accredited</small>
              </div>

              <div className="hm-layer hm-layer-front">
                <span>Pediatric courses</span>
                <b>{courseCount}</b>
                <small>Fellowships, diplomas &amp; certificates</small>
              </div>

              <div className="hm-layer hm-layer-mid">
                <span>Specialist faculty</span>
                <b>{facultyCount}</b>
                <small>Practising clinicians</small>
              </div>

              <div className="hm-badge">
                <b>1 yr</b>
                <span>Mentorship</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <ul className="hm-trust">
            {TRUST.map((t) => (
              <li key={t}><Icon name="check" size={16} /> {t}</li>
            ))}
          </ul>
        </div>
      </section>

      {error && (
        <div className="container hm-block">
          <ErrorState error={error} onRetry={retry} />
        </div>
      )}

      {/* PROGRAMS */}
      <section className="hm-block">
        <div className="container">
          <header className="hm-head">
            <span className="hm-num">01</span>
            <div>
              <p className="hm-eyebrow">Programs</p>
              <h2>Choose your level</h2>
            </div>
            <p className="hm-head-text">
              Every program runs online with live sessions, recorded lectures, case discussions and assessments.
            </p>
          </header>

          <div className="hm-programs">
            {loading && <Skeletons count={2} height={110} />}
            {view &&
              Object.entries(view.byType).map(([type, n]) => (
                <Link
                  key={type}
                  to={`/courses?type=${encodeURIComponent(type)}`}
                  className="hm-program hm-tilt"
                  {...tilt(4)}
                >
                  <div className="hm-program-count">{n}</div>
                  <div className="hm-program-body">
                    <h3>{typePlural(type)}</h3>
                    <p>{LEVEL_BLURB[type] || 'Explore programs'}</p>
                  </div>
                  <span className="hm-program-go" aria-hidden="true">
                    <Icon name="arrow" size={18} />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* FOCUS AREAS */}
      {view && view.areas.length > 0 && (
        <section className="hm-block hm-block-tint">
          <div className="container">
            <header className="hm-head">
              <span className="hm-num">02</span>
              <div>
                <p className="hm-eyebrow">Focus areas</p>
                <h2>Find your pediatric speciality</h2>
              </div>
            </header>
            <div className="hm-areas">
              {view.areas.map((a) => (
                <Link key={a.label} to={`/courses?area=${encodeURIComponent(a.label)}`}>
                  <span>{a.label}</span>
                  <em>{a.count}</em>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COURSES RAIL */}
      <section className="hm-block">
        <div className="container">
          <header className="hm-head hm-head-split">
            <div className="hm-head-left">
              <span className="hm-num">03</span>
              <div>
                <p className="hm-eyebrow">Courses</p>
                <h2>Pediatric programs</h2>
              </div>
            </div>
            <div className="hm-rail-controls">
              <button className="hm-round flip" aria-label="Previous courses" onClick={() => scrollRail(-1)}>
                <Icon name="chevron" />
              </button>
              <button className="hm-round" aria-label="Next courses" onClick={() => scrollRail(1)}>
                <Icon name="chevron" />
              </button>
            </div>
          </header>

          <div className="hm-rail" ref={rail}>
            {loading && <Skeletons count={3} />}
            {view &&
              view.featured.map((c) => (
                <div key={c.slug} className="hm-tilt hm-tilt-card" {...tilt(6)}>
                  <CourseCard course={c} />
                </div>
              ))}
          </div>

          <div className="hm-center">
            <Link className="hm-btn hm-btn-line" to="/courses">
              View all pediatric courses <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* STAGES */}
      <section className="hm-block hm-block-tint">
        <div className="container">
          <header className="hm-head">
            <span className="hm-num">04</span>
            <div>
              <p className="hm-eyebrow">Care across childhood</p>
              <h2>From the first breath to adolescence</h2>
            </div>
            <p className="hm-head-text">
              Programs cover the full range of children's health, so you can build depth where your practice needs it.
            </p>
          </header>

          <div className="hm-stages">
            {STAGES.map((s, i) => (
              <Link
                key={s.title}
                to={`/courses?q=${encodeURIComponent(s.q)}`}
                className="hm-stage hm-tilt"
                {...tilt(7)}
              >
                <span className="hm-stage-no">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="hm-stage-go">
                  Explore <Icon name="arrow" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="hm-block">
        <div className="container">
          <header className="hm-head">
            <span className="hm-num">05</span>
            <div>
              <p className="hm-eyebrow">How it works</p>
              <h2>From enrolment to certification</h2>
            </div>
          </header>

          <ol className="hm-timeline">
            {STEPS.map((s, i) => (
              <li key={s.title} className="hm-step">
                <span className="hm-dot">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FACULTY */}
      <section className="hm-block hm-block-tint">
        <div className="container">
          <header className="hm-head hm-head-split">
            <div className="hm-head-left">
              <span className="hm-num">06</span>
              <div>
                <p className="hm-eyebrow">Our team</p>
                <h2>Meet the pediatric faculty</h2>
                {view && (
                  <p className="hm-sub">
                    {view.faculty.length} specialists teaching in the Pediatrics department.
                  </p>
                )}
              </div>
            </div>
            <Link className="hm-btn hm-btn-line" to="/faculty">
              All faculty <Icon name="arrow" size={16} />
            </Link>
          </header>

          <div className="hm-faculty">
            {loading && <Skeletons count={4} height={220} />}
            {view &&
              view.facPick.map((f) => (
                <div key={f.id} className="hm-tilt hm-tilt-card" {...tilt(7)}>
                  <FacultyCard faculty={f} />
                </div>
              ))}
          </div>
        </div>
      </section>

         {/* APP + CTA */}
      <section className="hm-block">
        <div className="container">
          <div className="hm-closing">
            
            {/* MGA App Section */}
            <div className="hm-app" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <p className="hm-eyebrow hm-eyebrow-light">MGA Learning App</p>
              <h2>Your classes, in your pocket</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto 24px auto' }}>
                Join live sessions, revisit recordings and keep learning between shifts with the MGA app.
              </p>
              
              <div style={{ marginTop: '16px' }}>
                <Link 
                  className="hm-btn hm-btn-solid" 
                  to="/support"
                  style={{ padding: '14px 40px', fontSize: '1.1rem', fontWeight: '600' ,color:'white'}}
                >
                  Talk to us
                </Link>
              </div>
            </div>

            {/* Not sure Section */}
            <div className="hm-talk hm-tilt" {...tilt(4)}>
              <h2>Not sure which program fits you?</h2>
              <p>
                Talk to our team. We will help you choose the pediatric course that matches your qualification
                and goals.
              </p>
              <div className="hm-actions">
                <Link className="hm-btn hm-btn-line" to="/courses">Browse courses</Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}