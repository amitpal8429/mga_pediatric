import { useState } from 'react';
import Icon from './Icon';
import { cleanSessions, flat } from '../utils/format';

// Curriculum accordion with "Expand all / Collapse all".
export default function ModuleList({ modules = [] }) {
  const prepared = modules.map((m) => ({ id: m.id, title: m.module, topics: cleanSessions(m.sessions) }));
  const [open, setOpen] = useState(() => new Set(prepared.length ? [prepared[0].id] : []));
  const allOpen = prepared.length > 0 && open.size === prepared.length;
  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const totalTopics = prepared.reduce((n, m) => n + m.topics.length, 0);

  return (
    <div className="modules">
      <div className="modules-head">
        <span>{prepared.length} modules · {totalTopics} topics</span>
        <button type="button" className="link-btn" onClick={() => setOpen(allOpen ? new Set() : new Set(prepared.map((m) => m.id)))}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      {prepared.map((m, i) => {
        const isOpen = open.has(m.id);
        return (
          <div key={m.id} className={`module ${isOpen ? 'open' : ''}`}>
            <button type="button" className="module-btn" aria-expanded={isOpen} onClick={() => toggle(m.id)}>
              <span className="module-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="module-title">{flat(m.title)}</span>
              <span className="module-count">{m.topics.length} topics</span>
              <Icon name="chevron" size={18} className="module-chev" />
            </button>
            {isOpen && (
              <ol className="module-topics">
                {m.topics.map((t) => (
                  <li key={t.id}>{flat(t.title)}</li>
                ))}
              </ol>
            )}
          </div>
        );
      })}
    </div>
  );
}
