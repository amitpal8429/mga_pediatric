import { useState } from 'react';
import { deptLabel, deptList, flat, initials, palette } from '../utils/format';

export default function FacultyCard({ faculty }) {
  const [broken, setBroken] = useState(false);
  const showPhoto = faculty.image_url && !broken;
  return (
    <article className={`fac-card p${palette(faculty.name)}`}>
      <div className="avatar">
        {showPhoto ? <img src={faculty.image_url} alt={faculty.name} loading="lazy" onError={() => setBroken(true)} /> : initials(faculty.name)}
      </div>
      <h3>{faculty.name}</h3>
      <p className="fac-q">{flat(faculty.qualification)}</p>
      <div className="tags">
        {deptList(faculty).slice(0, 2).map((d) => (
          <span key={d} className="tag tag-soft">{deptLabel(d)}</span>
        ))}
      </div>
    </article>
  );
}
