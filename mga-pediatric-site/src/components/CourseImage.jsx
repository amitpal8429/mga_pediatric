import { useEffect, useMemo, useState } from 'react';
import Icon from './Icon';
import { imageUrls, palette } from '../utils/format';

export default function CourseImage({ course, className = '' }) {
  const urls = useMemo(() => imageUrls(course), [course]);
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Course badle to reset
  useEffect(() => {
    setI(0);
    setLoaded(false);
  }, [course?.slug]);

  // Debug (sirf dev mode mein, ek baar per course)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[CourseImage]', course?.slug, '→ urls:', urls);
      if (!urls.length) console.warn('[CourseImage] Image field nahi mili. Course object:', course);
    }
  }, [course?.slug]); // eslint-disable-line

  // Koi URL nahi ya sab fail → heart placeholder
  if (!urls.length || i >= urls.length) {
    return (
      <div
        className={`ph p${palette(course?.slug || course?.name)} ${className}`}
        role="img"
        aria-label={course?.name}
      >
        <Icon name="heart" size={54} />
      </div>
    );
  }

  return (
    <div className={`course-img-wrap ${className}`}>
      {!loaded && (
        <div className="course-img-skeleton">
          <div className="skeleton-shimmer" />
        </div>
      )}

      <img
        key={urls[i]}
        src={urls[i]}
        alt={course?.name || ''}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          if (import.meta.env.DEV) console.warn('IMG FAIL:', e.currentTarget.src);
          setI((n) => n + 1);
        }}
        className={`course-img ${loaded ? 'is-loaded' : ''}`}
      />
    </div>
  );
}