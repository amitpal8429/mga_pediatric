// Generates public/sitemap.xml and public/robots.txt (runs automatically before `npm run build`).
// Static pages are always included; every PEDIATRIC course from the live course-list API is added as /courses/{slug}.
// Uses the same keyword rules as the website (src/config/pediatric-rules.js).
//
//   SITE_URL=https://yourdomain.com npm run sitemap
//   COURSE_LIST_FILE=./course-list.json npm run sitemap     (offline: read the course list from a local JSON file)
//
// If the API cannot be reached, the last generated sitemap is kept (or static pages only on a first run).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPediatricCourse } from '../src/config/pediatric-rules.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW_URL = process.env.SITE_URL || process.env.VITE_SITE_URL || '';
const SITE_URL = (RAW_URL || 'https://your-domain.com').replace(/\/$/, '');
const API = 'https://24x7.medicalglobalacademy.com/api/course-list';
const out = join(root, 'public', 'sitemap.xml');

if (!RAW_URL) console.warn('sitemap: SITE_URL is not set, using the placeholder https://your-domain.com. Set SITE_URL to your real domain before deploying.');

const STATIC = [
  ['/', '1.0', 'weekly'],
  ['/courses', '0.9', 'daily'],
  ['/faculty', '0.7', 'weekly'],
  ['/about', '0.6', 'monthly'],
  ['/support', '0.6', 'monthly'],
  ['/app', '0.5', 'monthly'],
  ['/privacy-policy', '0.3', 'yearly'],
  ['/terms', '0.3', 'yearly'],
  ['/refund', '0.3', 'yearly'],
  ['/sitemap', '0.3', 'monthly']
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const day = (d) => (d && !isNaN(new Date(d)) ? new Date(d).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
const asList = (j) => (Array.isArray(j) ? j : j?.data || []);

let courses = [];
try {
  if (process.env.COURSE_LIST_FILE) {
    courses = asList(JSON.parse(readFileSync(process.env.COURSE_LIST_FILE, 'utf8')));
    console.log(`sitemap: ${courses.length} courses read from ${process.env.COURSE_LIST_FILE}`);
  } else {
    const res = await fetch(API, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    courses = asList(await res.json());
    console.log(`sitemap: ${courses.length} courses from API`);
  }
} catch (err) {
  console.warn(`sitemap: could not load courses (${err.message}).`);
  if (existsSync(out)) {
    console.warn('sitemap: keeping the existing public/sitemap.xml');
    process.exit(0);
  }
  console.warn('sitemap: writing static pages only');
}

const pediatric = courses.filter((c) => c.slug && isPediatricCourse(c));
console.log(`sitemap: ${pediatric.length} of ${courses.length} courses are Pediatrics`);

const today = day();
const urls = [
  ...STATIC.map(([p, priority, freq]) => ({ loc: SITE_URL + p, lastmod: today, freq, priority })),
  ...pediatric.map((c) => ({
    loc: `${SITE_URL}/courses/${encodeURIComponent(c.slug)}`,
    lastmod: day(c.updated_at),
    freq: 'weekly',
    priority: Number(c.top_courses) === 1 ? '0.9' : '0.8'
  }))
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((u) => `  <url>\n    <loc>${esc(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join('\n') +
  `\n</urlset>\n`;

writeFileSync(out, xml);
writeFileSync(join(root, 'public', 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`sitemap: wrote ${urls.length} URLs to public/sitemap.xml and updated robots.txt (${SITE_URL})`);
