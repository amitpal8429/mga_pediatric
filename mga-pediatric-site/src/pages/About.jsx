import { Link } from 'react-router-dom';
import { getPediatricCourses, getPediatricFaculty } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { useSeo } from '../hooks/useSeo';
import Icon from '../components/Icon';
import { SITE } from '../config/site';
import { focusAreas } from '../utils/pediatric';
import '../styles/home.css';

const handleMouseMove = (e) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rx = ((y - centerY) / centerY) * -5;
  const ry = ((x - centerX) / centerX) * 5;
  el.style.setProperty('--rx', `${rx}deg`);
  el.style.setProperty('--ry', `${ry}deg`);
  el.style.setProperty('--gx', `${x}px`);
  el.style.setProperty('--gy', `${y}px`);
};

const handleMouseLeave = (e) => {
  const el = e.currentTarget;
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
};

export default function About() {
  useSeo({
    title: 'About us',
    description: 'MGA Pediatrics is the pediatrics department of Medical Global Academy: online fellowships and PG diplomas in pediatric, neonatal and child health.',
    path: '/about'
  });

  const { data } = useAsync(
    () => Promise.all([getPediatricCourses().catch(() => []), getPediatricFaculty().catch(() => [])]),
    []
  );
  const courses = data?.[0] || [];
  const faculty = data?.[1] || [];

  const stats = [
    [courses.length || '19', 'Pediatric Courses'],
    [faculty.length || '8', 'Expert Faculty'],
    [focusAreas(courses).length || '15+', 'Focus Areas'],
    ['CPD', 'Accredited Learning']
  ];

  return (
    <div className="hm">
      {/* HERO SECTION */}
      <section className="hm-hero hm-hero-small">
        <div className="container">
          <p className="hm-kicker">About MGA Pediatrics</p>
          <h1>Better care for children starts with <em>better training</em></h1>
          <p className="hm-lead">
            {SITE.name} is the pediatrics department of {SITE.parent}, helping doctors build depth in pediatric, neonatal and child-health medicine through flexible online learning.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '80px' }}>
        
        {/* ✅ NEW: ACCREDITATION CERTIFICATES (Top Position) */}
        <section className="hm-block" style={{ paddingTop: 0 }}>
          <div className="hm-head hm-head-split">
            <div className="hm-head-left">
              <div>
                <p className="hm-eyebrow">Global Recognition</p>
                <h2>Our Accreditations</h2>
              </div>
            </div>
            <p className="hm-head-text">
              We are proud to be accredited by leading global bodies, ensuring your certification holds value worldwide.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '32px' }}>
            {/* CPD Certificate */}
            <div className="hm-tilt" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ background: '#fff', padding: '16px', borderRadius: '24px', border: '1px solid var(--hm-line)', boxShadow: '0 4px 0 var(--hm-line)' }}>
              <img 
                src="https://medicalglobalacademy.com/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-17-at-10.15.41-AM.jpeg" 
                alt="CPD Accreditation Certificate" 
                style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }} 
              />
            </div>

            {/* ACTD Certificate */}
            <div className="hm-tilt" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ background: '#fff', padding: '16px', borderRadius: '24px', border: '1px solid var(--hm-line)', boxShadow: '0 4px 0 var(--hm-line)' }}>
              <img 
                src="https://medicalglobalacademy.com/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-17-at-5.58.43-PM.jpeg" 
                alt="ACTD Accreditation Certificate" 
                style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }} 
              />
            </div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <div className="hm-about-split" style={{ marginTop: '60px' }}>
          <div className="hm-about-text">
            <span className="hm-eyebrow">Who we are</span>
            <h2>Pediatric learning built around clinical practice</h2>
            <p>
              Our programs combine live interactive classes, recorded lectures, e-books, case-based learning, assignments and MCQ assessments, so you can keep learning alongside your work. They span general child health and pediatric sub-specialities such as neurology, cardiology, endocrinology, genetics and neonatology.
            </p>
            <p>
              Our programs are professional skill-development courses. They are not a government postgraduate medical degree, a NEET-based PG residency or a regular medical college seat, and we encourage every learner to check eligibility and recognition requirements for their own career plans.
            </p>
            <Link className="hm-btn hm-btn-solid" to="/courses" style={{ marginTop: '16px' }}>
              Explore pediatric courses <Icon name="arrow" size={16} />
            </Link>
          </div>
          
          <div className="hm-stat-grid">
            {stats.map(([n, label], i) => (
              <div 
                key={label} 
                className="hm-stat-box hm-tilt"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <b>{n}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WHY CHOOSE US (Values) */}
        <section className="hm-block">
          <div className="hm-head hm-head-split">
            <div className="hm-head-left">
              <div>
                <p className="hm-eyebrow">What you get</p>
                <h2>Why doctors learn with us</h2>
              </div>
            </div>
          </div>
          
          <div className="hm-values-grid">
            <div className="hm-value-card hm-tilt" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div className="hm-value-icon"><Icon name="users" size={24} /></div>
              <h3>Practising faculty</h3>
              <p>Learn from pediatric specialists with hands-on clinical experience.</p>
            </div>
            <div className="hm-value-card hm-tilt" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div className="hm-value-icon"><Icon name="laptop" size={24} /></div>
              <h3>Flexible formats</h3>
              <p>Live online sessions, recordings and self-paced modules, with hybrid pathways on selected programs.</p>
            </div>
            <div className="hm-value-card hm-tilt" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div className="hm-value-icon"><Icon name="book" size={24} /></div>
              <h3>Case-based curriculum</h3>
              <p>Real clinical scenarios, diagnostic reasoning and evidence-based decision-making.</p>
            </div>
            <div className="hm-value-card hm-tilt" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div className="hm-value-icon"><Icon name="award" size={24} /></div>
              <h3>Accredited learning</h3>
              <p>Programs aligned with international standards and accredited by CPD and ACTD, with a final assessment for certification.</p>
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <div className="hm-closing" style={{ marginTop: '80px' }}>
          <div className="hm-app">
            <p className="hm-eyebrow hm-eyebrow-light">Ready to take the next step?</p>
            <h2>Upgrade your clinical practice today</h2>
            <p>Browse our pediatric programs or talk to our team about the right course for your career goals.</p>
            <div className="hm-actions">
              <Link className="hm-btn hm-btn-light" to="/courses">Browse courses</Link>
              <Link className="hm-btn hm-btn-ghost" to="/support">Contact support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}