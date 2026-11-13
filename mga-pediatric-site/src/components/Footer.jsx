import { Link } from 'react-router-dom';
import Logo from './Logo';
import Icon from './Icon';
import Wave from './Wave';
import { SITE, COMPANY_LINKS, LEGAL_LINKS } from '../config/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Wave className="footer-wave" />
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>
              The Pediatrics department of {SITE.parent}: online fellowships, Certificate and PG diplomas in pediatric, neonatal and child-health
              medicine, taught by practising specialists.
            </p>
            <div className="social">
              {SITE.social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              ))}
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/courses">All pediatric courses</Link></li>
              <li><Link to="/courses?type=Fellowship">Fellowships</Link></li>
              <li><Link to="/courses?type=Pg%20Diploma">PG Diplomas</Link></li>
              <li><Link to="/faculty">Faculty</Link></li>
              <li><a href={SITE.mainSite} target="_blank" rel="noopener noreferrer">All MGA departments</a></li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              {COMPANY_LINKS.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
            </ul>
            <h4 className="mt">Legal</h4>
            <ul>
              {LEGAL_LINKS.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4>Get in touch</h4>
            <ul className="contact-list">
              <li><Icon name="mail" size={16} /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><Icon name="phone" size={16} /><a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a></li>
           
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {SITE.parent}. All rights reserved.</span>
          <span>Professional skill-development programs; not a government postgraduate degree or NEET-PG seat.</span>
        </div>
      </div>
    </footer>
  );
}
