// ---------------------------------------------------------------------------
// WHICH COURSES / FACULTY COUNT AS "PEDIATRICS"
// ---------------------------------------------------------------------------
export const PEDIATRIC_RULES = {
  courseKeywords: ['pediatric', 'pediatrics', 'paediatric', 'paediatrics', 'pedodont', 'neonat', 'newborn', 'infant', 'child'],
  includeSlugs: [],
  excludeSlugs: [],
  facultyKeywords: ['pediatric', 'pediatrics', 'paediatric', 'paediatrics', 'neonat', 'child']
};

const norm = (s) => String(s ?? '').toLowerCase();

export function isPediatricCourse(course, rules = PEDIATRIC_RULES) {
  if (!course) return false;
  if (rules.excludeSlugs.includes(course.slug)) return false;
  if (rules.includeSlugs.includes(course.slug)) return true;
  
  // Name, department, ya tags me se kisi me bhi keyword match ho jaye toh true
  const name = norm(course.name);
  const dept = norm(course.department || course.specialty);
  
  return rules.courseKeywords.some((k) => name.includes(k) || dept.includes(k));
}

export function isPediatricFaculty(faculty, rules = PEDIATRIC_RULES) {
  if (!faculty) return false;
  const text = `${norm(faculty.department)} ${norm(faculty.qualification)}`;
  return rules.facultyKeywords.some((k) => text.includes(k));
}