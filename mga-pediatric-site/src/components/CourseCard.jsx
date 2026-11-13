import { Link } from 'react-router-dom';
import CourseImage from './CourseImage';
import Icon from './Icon';
import { courseUrl, excerpt, money, palette, typeLabel } from '../utils/format';
import { focusArea } from '../utils/pediatric';

export default function CourseCard({ course }) {
  const total = money(course.total_fee);
  return (
    <Link 
      to={courseUrl(course.slug)} 
      className={`course-card p${palette(course.slug || course.name)}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      <div className="cc-media">
        <CourseImage course={course} />
        <span className="tag tag-white">{typeLabel(course.type)}</span>
        {Number(course.top_courses) === 1 && (
          <span className="tag tag-sun">
            <Icon name="star" size={12} /> Top
          </span>
        )}
      </div>
      <div className="cc-body">
        <span className="cc-area">{focusArea(course)}</span>
        <h3 style={{ wordBreak: 'break-word' }}>{course.name}</h3>
        <p>{excerpt(course.description, 105)}</p>
        <div className="cc-meta">
          <span>
            <Icon name="clock" size={15} /> {course.duration} months
          </span>
          <strong>{total || 'Enquire'}</strong>
        </div>
      </div>
    </Link>
  );
}