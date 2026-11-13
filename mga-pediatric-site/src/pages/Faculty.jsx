import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPediatricFaculty } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { useSeo } from '../hooks/useSeo';
import FacultyCard from '../components/FacultyCard';
import Icon from '../components/Icon';
import { EmptyState, ErrorState, Skeletons } from '../components/States';
import { deptLabel, deptList } from '../utils/format';

// Mouse move handler for 3D tilt effect
const handleMouseMove = (e) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rx = ((y - centerY) / centerY) * -5;
  const ry = ((x - centerX) / centerX) * 5;
  el.style.setProperty('--rx', `${rx}deg`);
  el.style.setProperty('--ry', `${ry}deg`);
  el.style.setProperty('--gx', `${x}px`);
  el.style.setProperty('--gy', `${y}px`);
};

const handleMouseLeave = (e) => {
  const el = e.currentTarget;
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
};

export default function Faculty() {
  useSeo({ 
    title: 'Pediatric faculty', 
    description: 'Meet the pediatric specialists who teach and mentor the Medical Global Academy Pediatrics programs.', 
    path: '/faculty' 
  });
  
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const dept = (params.get('dept') || '').toLowerCase();
  const { data, error, loading, retry } = useAsync(getPediatricFaculty, []);

  const { labels, results } = useMemo(() => {
    const list = data || [];
    const labels = {};
    list.forEach((f) => deptList(f).forEach((d) => { labels[d.toLowerCase()] ||= deptLabel(d); }));
    const needle = q.trim().toLowerCase();
    const results = list.filter((f) => {
      const ds = deptList(f).map((x) => x.toLowerCase());
      return (!dept || ds.includes(dept)) && (!needle || `${f.name} ${f.qualification} ${f.department}`.toLowerCase().includes(needle));
    });
    return { labels, results };
  }, [data, q, dept]);

  const setDept = (key) => {
    const next = new URLSearchParams(params);
    key ? next.set('dept', key) : next.delete('dept');
    setParams(next, { replace: true });
  };

  return (
    <div className="hm">
      {/* HERO SECTION */}
      <section className="hm-hero hm-hero-small">
        <div className="container">
          <p className="hm-kicker">Our Team</p>
          <h1>Learn from pediatric <em>specialists</em></h1>
          <p className="hm-lead">
            The doctors who teach, mentor and guide our Pediatrics programs. Learn from the best in the field.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* FILTERS */}
        <div className="hm-faculty-filters">
          <div className="hm-search-input">
            <Icon name="search" size={18} />
            <input 
              type="search" 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search by name, qualification or sub-speciality…" 
              aria-label="Search faculty" 
            />
          </div>
          
          <select 
            className="hm-select" 
            value={labels[dept] ? dept : ''} 
            onChange={(e) => setDept(e.target.value)} 
            aria-label="Department"
          >
            <option value="">All pediatric departments</option>
            {Object.keys(labels).sort().map((k) => <option key={k} value={k}>{labels[k]}</option>)}
          </select>
        </div>

        {/* RESULTS HEADER */}
        <div className="hm-results-header" style={{ marginTop: '40px' }}>
          <div className="hm-results-count">
            {loading ? 'Loading...' : <><strong>{results.length}</strong> faculty members</>}
          </div>
          {(q || dept) && (
            <button 
              className="hm-btn-clear" 
              onClick={() => { setParams({}, { replace: true }); setQ(''); }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* FACULTY GRID */}
        <div className="hm-faculty-grid">
          {loading && <Skeletons count={4} height={240} />}
          {error && <ErrorState error={error} onRetry={retry} />}
          {!loading && !error && results.length === 0 && (
            <EmptyState>No pediatric faculty match your search. Try clearing the filters.</EmptyState>
          )}
          {!loading && !error && results.map((f) => (
            <div 
              key={f.id} 
              className="hm-tilt hm-fac-card"
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave}
            >
              <FacultyCard faculty={f} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}