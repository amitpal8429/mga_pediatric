import { SITE } from '../config/site';

export const flat = (t) => String(t ?? '').replace(/\s+/g, ' ').trim();

export function money(n) {
  const v = Number(n);
  if (!isFinite(v) || v <= 0) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: SITE.currency, maximumFractionDigits: 0 }).format(v);
}

export function excerpt(text, max = 120) {
  const t = flat(text);
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

// API descriptions contain hard line-wraps; join them and regroup into readable paragraphs of ~3 sentences.
export function paragraphs(text) {
  const sentences = flat(text).split(/(?<=[.!?])\s+(?=[A-Z])/);
  const out = [];
  for (let i = 0; i < sentences.length; i += 3) out.push(sentences.slice(i, i + 3).join(' '));
  return out.filter(Boolean);
}

export function hue(str) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

// 0-3: picks one of the four pastel palettes (blue, coral, mint, lilac) so cards and placeholders vary.
export const palette = (key) => hue(key) % 4;

export const typeLabel = (type) => String(type || 'Course').replace(/^Pg\b/i, 'PG');
export const typePlural = (type) => typeLabel(type) + 's';

export function initials(name) {
  const parts = String(name || '').replace(/^Dr\.?\s*/i, '').trim().split(/\s+/);
  return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

// ----- faculty -----
export const isPlaceholderFaculty = (f) => /^FACULTY\d+$/i.test(flat(f?.name));

export function visibleFaculty(list) {
  return SITE.hidePlaceholderFaculty ? list.filter((f) => !isPlaceholderFaculty(f)) : list;
}

export function deptList(f) {
  return String(f?.department || '')
    .split(/[,/]/)
    .map(flat)
    .filter(Boolean);
}

export function deptLabel(s) {
  const t = flat(s);
  if (t === t.toUpperCase() || t === t.toLowerCase()) return t.toLowerCase().replace(/\b[a-z]/g, (m) => m.toUpperCase());
  return t;
}

// ----- dates -----
export function futureDate(d) {
  if (!d) return '';
  const dt = new Date(`${d}T00:00:00`);
  if (isNaN(dt) || dt < new Date()) return '';
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ----- curriculum -----
// A few courses carry stray fragments in their topic lists ("levels.", contact text, URLs…).
export function cleanSessions(sessions) {
  if (!SITE.cleanSessions) return sessions || [];
  return (sessions || []).filter((s) => {
    const t = flat(s.title);
    return (
      t.length >= 4 &&
      t.length <= 150 &&
      !/^[a-z]/.test(t) &&
      !/www\.|https?:|@/i.test(t) &&
      !/^(MEDICAL GLOBAL|ACADEMY)$/i.test(t)
    );
  });
}

// ----- urls -----
export const courseUrl = (slug) => `/courses/${encodeURIComponent(slug)}`;

// Course object se image ka naam/path nikalta hai (SITE.imageFields ke order mein)
export function getImageFile(course) {
  if (!course) return '';
  for (const key of SITE.imageFields) {
    const v = course[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

// Saare possible image URLs ki list (CourseImage ek-ek karke try karta hai)
export function imageUrls(course) {
  const img = getImageFile(course);
  if (!img) return [];

  // Poora URL: http ko https bana do (mixed content block se bachne ke liye)
  if (/^https?:\/\//i.test(img)) return [img.replace(/^http:\/\//i, 'https://')];
  if (img.startsWith('//')) return [`https:${img}`];

  // Path ya filename: har part ko encode karo (space waghera ke liye)
  const clean = img.replace(/^\/+/, '');
  const encoded = clean.split('/').map(encodeURIComponent).join('/');
  return SITE.imageBases.map((b) => b + encoded);
}

export const mailLink = (subject = '', body = '') =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

export const whatsappLink = (text = '') => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;