import { SITE } from '../config/site';
import { pediatricCourses, pediatricFaculty } from '../utils/pediatric';

const cache = new Map();

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function apiGet(path) {
  if (cache.has(path)) return cache.get(path);
  const promise = (async () => {
    try {
      return await getJson(SITE.apiBase + path);
    } catch (err) {
      try {
        return await getJson(SITE.proxyBase + path);
      } catch {
        throw err;
      }
    }
  })();
  cache.set(path, promise);
  promise.catch(() => cache.delete(path));
  return promise;
}

const asList = (d) => (Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);

export const getFaculty = () => apiGet('/faculty-list').then(asList);
export const getCourses = () => apiGet('/course-list').then(asList);
export const getCourse = (slug) =>
  apiGet(`/course-details/${encodeURIComponent(slug)}`).then((d) => (d?.data && !d.name ? d.data : d));

// ✅ Yeh function ab exactly 19 courses return karega
export const getPediatricCourses = () => getCourses().then(pediatricCourses);
export const getPediatricFaculty = () => getFaculty().then(pediatricFaculty);

export async function getPediatricCourse(slug) {
  const list = await getPediatricCourses();
  if (!list.some((c) => c.slug === slug)) throw new Error('This course is not part of the Pediatrics department.');
  return getCourse(slug);
}

export function clearApiCache() {
  cache.clear();
}