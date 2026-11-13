import PageHero from '../components/PageHero';
import Icon from '../components/Icon';
import { useSeo } from '../hooks/useSeo';
import { SITE } from '../config/site';

const FEATURES = [
  ['laptop', 'Live classes', 'Join interactive sessions led by experienced faculty from your phone.'],
  ['play', 'Recorded lectures', 'Revisit any session whenever it suits your schedule.'],
  ['book', 'Study material', 'Access e-books, notes and assignments for your program.'],
  ['check', 'Assessments', 'Practise with MCQ-based assessments as you progress.']
];

export default function AppPage() {
  useSeo({ title: 'App', description: 'Download the Medical Global Academy learning app to join live classes, watch recordings and access study material.', path: '/app' });
  return (
    <>
      <PageHero crumbs={[{ label: 'App' }]} eyebrow="MGA Learning App" title="Your classes, wherever you are" text="Keep learning between shifts with the Medical Global Academy app." />
      <div className="container">
        <div className="about-split">
          <div>
            <h2>Download the app</h2>
            <p>Install the MGA Learning app from Google Play and sign in with your registered account to access your program.</p>
            <a className="store-btn" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
              <Icon name="play" size={30} />
              <span><small>GET IT ON</small><b>Google Play</b></span>
            </a>
          </div>
          <div className="app-promo" style={{ margin: 0 }}>
            <div><h3 style={{ color: '#fff', fontSize: '1.4rem' }}>Learn on the go</h3><p style={{ margin: 0 }}>Everything for your course in one place.</p></div>
            <div className="phone" aria-hidden="true"><Icon name="play" size={48} /></div>
          </div>
        </div>
        <div className="app-feature-grid">
          {FEATURES.map(([icon, title, text]) => (
            <div className="value" key={title}><div className="fi"><Icon name={icon} size={22} /></div><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </div>
    </>
  );
}
