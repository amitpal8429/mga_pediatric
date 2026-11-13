import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { clearApiCache } from '../src/api/client';
import { isPediatricCourse, isPediatricFaculty } from '../src/config/pediatric-rules';
import { cleanSessions, deptLabel, deptList, futureDate, money, paragraphs } from '../src/utils/format';
import { focusArea, focusAreas, pediatricCourses, pediatricFaculty } from '../src/utils/pediatric';
import { courses, detail, faculty, mockFetch } from './fixtures';

beforeEach(() => {
  clearApiCache();
  vi.stubGlobal('fetch', mockFetch);
});

const go = (path) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

describe('pediatric rules', () => {
  it('keeps only pediatric courses', () => {
    expect(pediatricCourses(courses).map((c) => c.slug)).toEqual([
      'pg-diploma-in-child-health',
      'fellowship-in-pediatric-neurology',
      'fellowship-in-pediatrics-neonatology',
      'fellowship-in-pedodontist'
    ]);
  });
  it('does not confuse orthopedic with pediatric', () => {
    expect(isPediatricCourse({ name: 'Fellowship in Orthopedic', slug: 'x' })).toBe(false);
    expect(isPediatricCourse({ name: 'Fellowship in Pediatric Orthopedic', slug: 'y' })).toBe(true);
  });
  it('does not use the unreliable API category', () => {
    // "Pediatric Neurology" is tagged "Orthopedic" by the API, but is still pediatric
    expect(isPediatricCourse(courses[1])).toBe(true);
  });
  it('matches the real pediatric course names', () => {
    ['Pg Diploma in Reproductive & Child Health', 'Pg Diploma in Maternal and Child Health', 'Fellowship in Paediatric Endocrinology',
      'Fellowship in Pediatric Genetics and Metabolism', 'Fellowship in Pediatric Cardiology', 'Fellowship in Pediatric Echocardiography',
      'Fellowship in Neonatal Echocardiography'].forEach((name) => expect(isPediatricCourse({ name, slug: name })).toBe(true));
    ['Fellowship in Fetal Medicine', 'Pg Diploma in Dermatology', 'Fellowship in Urology', 'Certificate In Family Medicine'].forEach((name) =>
      expect(isPediatricCourse({ name, slug: name })).toBe(false));
  });
  it('keeps only pediatric faculty and hides placeholders', () => {
    expect(pediatricFaculty(faculty).map((f) => f.name)).toEqual(['Dr. Neeraj Kumar', 'Dr. Soumita Roy', 'Dr. Vismaya Molly Siby']);
    expect(isPediatricFaculty({ department: 'Medicine', qualification: 'MD' })).toBe(false);
  });
  it('derives friendly focus areas', () => {
    expect(focusArea({ name: 'Fellowship in Paediatric Endocrinology' })).toBe('Endocrinology');
    expect(focusArea({ name: 'Fellowship in Pediatrics Neonatology' })).toBe('Neonatology');
    expect(focusArea({ name: 'Fellowship in Pediatric Genetics and Metabolism' })).toBe('Genetics and Metabolism');
    expect(focusArea({ name: 'Pg Diploma in Child Health' })).toBe('Child Health');
    expect(focusArea({ name: 'Fellowship in Pedodontist' })).toBe('Pediatric Dentistry');
    expect(focusAreas(pediatricCourses(courses))).toHaveLength(4);
  });
});

describe('utils', () => {
  it('formats money in INR', () => expect(money(80000)).toMatch(/80,000/));
  it('splits comma departments and tidies casing', () => {
    expect(deptList({ department: 'Orthopedic,Surgery' })).toEqual(['Orthopedic', 'Surgery']);
    expect(deptLabel('PEDIATRIC ENDOCRINOLOGY')).toBe('Pediatric Endocrinology');
  });
  it('drops junk curriculum fragments', () => {
    expect(cleanSessions(detail.module[0].sessions).map((s) => s.title)).toEqual(['Principles of pediatric neurology']);
  });
  it('treats past dates as empty', () => {
    expect(futureDate('2020-01-01')).toBe('');
    expect(futureDate('2099-07-01')).toMatch(/2099/);
  });
  it('regroups description into paragraphs', () => expect(paragraphs('One. Two. Three. Four.')).toHaveLength(2));
});

describe('pages', () => {
  it('Home shows only pediatric courses and counts', async () => {
    const { container } = go('/');
    expect((await screen.findAllByText('Pg Diploma in Child Health')).length).toBeGreaterThan(0);
    expect(screen.queryByText('Pg Diploma in Dermatology')).toBeNull();
    expect(screen.queryByText('Fellowship in Orthopedic')).toBeNull();
    await waitFor(() => expect(container.querySelector('.fc-1 b').textContent).toBe('4'));
    expect(container.querySelector('.fc-2 b').textContent).toBe('3');
    expect(screen.getByRole('heading', { name: 'PG Diplomas' })).toBeTruthy();
    expect(container.querySelectorAll('.bubble').length).toBe(4);
  });

  it('Courses lists only pediatric courses and filters by type, area and search', async () => {
    const a = go('/courses');
    expect(await screen.findByText('4 courses found')).toBeTruthy();
    expect(screen.queryByText('Certificate In Family Medicine')).toBeNull();
    a.unmount();

    clearApiCache();
    const b = go('/courses?type=Fellowship');
    expect(await screen.findByText('3 courses found')).toBeTruthy();
    b.unmount();

    clearApiCache();
    go('/courses?area=Neonatology');
    expect(await screen.findByText('1 course found')).toBeTruthy();
    expect(screen.getAllByText('Fellowship in Pediatrics Neonatology').length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText('Search courses'), { target: { value: 'zzz' } });
    expect(await screen.findByText(/No pediatric courses match/)).toBeTruthy();
  });

  it('Course detail renders sections, cleaned curriculum, escaped HTML and fees', async () => {
    go('/courses/fellowship-in-pediatric-neurology');
    expect(await screen.findByRole('heading', { level: 1, name: 'Fellowship in Pediatric Neurology' })).toBeTruthy();
    expect(screen.getByText('Comprehensive 12-Month Program.')).toBeTruthy();
    expect(screen.getByText('Industry leaders')).toBeTruthy();
    expect(screen.getByText('2 modules · 2 topics')).toBeTruthy(); // junk removed
    expect(screen.getAllByText(/1,50,000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Neurology').length).toBeGreaterThan(0); // focus area, not the API's "Orthopedic"
    expect(document.getElementById('ld-json').textContent).toContain('"@type":"Course"');
    expect(document.title).toContain('Fellowship in Pediatric Neurology');
  });

  it('refuses course pages that are not pediatric, even though the API has them', async () => {
    go('/courses/certificate-in-family-medicine');
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByText(/not part of the Pediatrics department/)).toBeTruthy();
  });

  it('Course detail shows an error for an unknown slug', async () => {
    go('/courses/nope');
    expect(await screen.findByRole('alert')).toBeTruthy();
  });

  it('Faculty shows only pediatric faculty, hides test records and never shows contact data', async () => {
    const { container } = go('/faculty');
    expect(await screen.findByText('Dr. Neeraj Kumar')).toBeTruthy();
    expect(screen.queryByText('FACULTY1102')).toBeNull();
    expect(screen.queryByText('Dr. Poonam Pawadi')).toBeNull();
    expect(screen.getByText('3 faculty members')).toBeTruthy();
    expect(container.textContent).not.toMatch(/8492862174|9831771940|faculty1102@gmail\.com/);
    const sel = screen.getByLabelText('Department');
    fireEvent.change(sel, { target: { value: 'pediatric pulmonology' } });
    expect(await screen.findByText('1 faculty member')).toBeTruthy();
  });

  it.each([
    ['/about', /Better care for children/],
    ['/support', /How can we help/],
    ['/app', /Your classes, wherever/],
    ['/privacy-policy', /Information we collect/],
    ['/terms', /Acceptance of terms/],
    ['/refund', /Cancelling your enrolment/],
    ['/sitemap', /Everything on one page/],
    ['/does-not-exist', /could not find that page/]
  ])('%s renders', async (path, text) => {
    go(path);
    expect(await screen.findByRole('heading', { name: text })).toBeTruthy();
  });

  it('Sitemap page lists only pediatric courses', async () => {
    go('/sitemap');
    expect(await screen.findByText('Fellowship in Pediatric Neurology')).toBeTruthy();
    expect(screen.queryByText('Pg Diploma in Dermatology')).toBeNull();
  });

  it('Footer links to all requested company and legal pages', async () => {
    const { container } = go('/about');
    await screen.findByText(/Better care for children/);
    const hrefs = [...container.querySelectorAll('footer a')].map((a) => a.getAttribute('href'));
    ['/about', '/support', '/privacy-policy', '/app', '/terms', '/refund', '/sitemap'].forEach((h) => expect(hrefs).toContain(h));
  });
});
