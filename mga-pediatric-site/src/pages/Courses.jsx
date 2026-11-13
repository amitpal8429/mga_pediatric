import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPediatricCourses } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { useSeo } from '../hooks/useSeo';
import CourseCard from '../components/CourseCard';
import Icon from '../components/Icon';
import EnquiryForm from '../components/EnquiryForm'; // ✅
import { EmptyState, ErrorState, Skeletons } from '../components/States';
import { flat, typeLabel } from '../utils/format';
import { focusArea, focusAreas } from '../utils/pediatric';
import '../styles/home.css';

const PAGE = 12;

const SORTS = {
  name: (a, b) => a.name.localeCompare(b.name),
  'fee-asc': (a, b) => a.total_fee - b.total_fee || a.name.localeCompare(b.name),
  'fee-desc': (a, b) => b.total_fee - a.total_fee || a.name.localeCompare(b.name),
  duration: (a, b) => a.duration - b.duration || a.name.localeCompare(b.name),
  start: (a, b) => String(a.start_date).localeCompare(String(b.start_date)) || a.name.localeCompare(b.name)
};

export default function Courses() {
  useSeo({
    title: 'Pediatric courses',
    description: 'Browse pediatric, neonatal and child-health fellowships and PG diplomas from Medical Global Academy.',
    path: '/courses'
  });
  
  const [params, setParams] = useSearchParams();
  const [shown, setShown] = useState(PAGE);
  
  const q = params.get('q') || '';
  const type = params.get('type') || '';
  const area = params.get('area') || '';
  const sort = params.get('sort') || 'name';

  const { data: courses, error, loading, retry } = useAsync(getPediatricCourses, []);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
    setShown(PAGE);
  };

  const { types, areas, results } = useMemo(() => {
    const list = courses || [];
    const types = [...new Set(list.map((c) => c.type))].filter(Boolean).sort();
    const areas = focusAreas(list);
    const needle = q.trim().toLowerCase();
    
    const results = list
      .filter((c) => (!type || c.type === type) && (!area || focusArea(c) === area))
      .filter((c) => !needle || `${c.name} ${c.type} ${flat(c.description)}`.toLowerCase().includes(needle))
      .sort(SORTS[sort] || SORTS.name);
      
    return { types, areas, results };
  }, [courses, q, type, area, sort]);

  return (
    <div className="hm">
      <section className="hm-hero hm-hero-small">
        <div className="container">
          <p className="hm-kicker">Programs Catalog</p>
          <h1>Explore our pediatric courses</h1>
          <p className="hm-lead">
            Fellowships and PG diplomas in pediatrics, neonatology and child health, designed for modern doctors.
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '40px' }}>
        <div className="hm-listing-layout">
          <aside className="hm-filter-sidebar">
            <div className="hm-filter-group">
              <p className="hm-filter-label">Search</p>
              <div className="hm-search-input">
                <Icon name="search" size={18} />
                <input 
                  type="search" 
                  value={q} 
                  onChange={(e) => update('q', e.target.value)} 
                  placeholder="Search by name..." 
                  aria-label="Search courses" 
                />
              </div>
            </div>

            <div className="hm-filter-group">
              <p className="hm-filter-label">Focus Area</p>
              <select className="hm-select" value={area} onChange={(e) => update('area', e.target.value)} aria-label="Focus area">
                <option value="">All Focus Areas</option>
                {areas.map((a) => (
                  <option key={a.label} value={a.label}>{a.label} ({a.count})</option>
                ))}
              </select>
            </div>

            <div className="hm-filter-group">
              <p className="hm-filter-label">Program Type</p>
              <div className="hm-filter-chips">
                <button className={`hm-chip ${!type ? 'active' : ''}`} onClick={() => update('type', '')}>All Types</button>
                {types.map((t) => (
                  <button 
                    key={t} 
                    className={`hm-chip ${type === t ? 'active' : ''}`} 
                    onClick={() => update('type', t)}
                  >
                    {typeLabel(t)}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="hm-results-area">
            <div className="hm-results-header">
              <div className="hm-results-count">
                {loading ? 'Loading...' : <><strong>{results.length}</strong> programs found</>}
              </div>
              
              <div className="hm-results-actions">
                {(q || type || area) && (
                  <button className="hm-btn-clear" onClick={() => { setParams({}, { replace: true }); setShown(PAGE); }}>
                    Clear filters
                  </button>
                )}
                <select className="hm-select hm-select-small" value={sort} onChange={(e) => update('sort', e.target.value === 'name' ? '' : e.target.value)} aria-label="Sort">
                  <option value="name">Sort: A–Z</option>
                  <option value="fee-asc">Fee: Low to High</option>
                  <option value="fee-desc">Fee: High to Low</option>
                  <option value="duration">Duration: Shortest</option>
                  <option value="start">Start Date</option>
                </select>
              </div>
            </div>

            <div className="hm-cards-grid">
              {loading && <Skeletons count={6} />}
              {error && <ErrorState error={error} onRetry={retry} />}
              {!loading && !error && results.length === 0 && (
                <EmptyState>No pediatric courses match your filters. Try clearing the search.</EmptyState>
              )}
              {!loading && !error && results.slice(0, shown).map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>

            {!loading && !error && results.length > shown && (
              <div className="hm-center" style={{ marginTop: '48px' }}>
                <button className="hm-btn hm-btn-line" onClick={() => setShown((n) => n + PAGE)}>
                  Show more programs ({results.length - shown} left)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ✅ FORM SECTION */}
        <section style={{ padding: '80px 0 60px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <EnquiryForm />
          </div>
        </section>

      </div>
    </div>
  );
}