import { Link } from 'react-router-dom';
import Icon from './Icon';
import { SITE } from '../config/site';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label={`${SITE.name} home`}>
      <span className="logo-mark"><Icon name="heart" size={22} /></span>
      <span className="logo-text">
        <strong>{SITE.name}</strong>
        <small>by {SITE.parent}</small>
      </span>
    </Link>
  );
}
