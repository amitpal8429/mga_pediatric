import { isPediatricCourse, isPediatricFaculty } from '../config/pediatric-rules';
import { flat, visibleFaculty } from './format';

export const pediatricCourses = (list) => (list || []).filter((c) => isPediatricCourse(c));
export const pediatricFaculty = (list) => visibleFaculty(list || []).filter((f) => isPediatricFaculty(f));

const SMALL = /^(and|of|in|the|for|&)$/i;
const titleCase = (s) =>
  s
    .split(' ')
    .map((w, i) => (i > 0 && SMALL.test(w) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');

// Friendly sub-speciality for a pediatric course
export function focusArea(course) {
  let n = flat(course?.name);
  
  if (/pedodont/i.test(n)) return 'Pediatric Dentistry';
  
  n = n.replace(/^(pg diploma|fellowship|certificate)\s+in\s+/i, '');
  
  // ✅ FIX: Pediatric aur Pediatrics dono ko handle karein
  const m = n.match(/^(?:pediatrics?|paediatrics?)\s+(.+)$/i);
  if (m) {
    n = m[1];
  } else if (/^(?:pediatrics?|paediatrics?)$/i.test(n.trim())) {
    return 'General Pediatrics';
  }

  return titleCase(n || flat(course?.name));
}

// [{ label, count }] sorted A-Z
export function focusAreas(courses) {
  const map = new Map();
  (courses || []).forEach((c) => {
    const k = focusArea(c);
    map.set(k, (map.get(k) || 0) + 1);
  });
  return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => a.label.localeCompare(b.label));
}