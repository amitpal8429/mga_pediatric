// src/components/EnquiryForm.jsx

import { useState } from 'react';
import { useAsync } from '../hooks/useAsync'; // ✅ Curly braces
import { getCourses } from '../api/client';
import { SITE } from '../config/site';

const COUNTRIES = [
  ['India', '+91'], ['United Arab Emirates', '+971'], ['Saudi Arabia', '+966'], ['Qatar', '+974'],
  ['Kuwait', '+965'], ['Oman', '+968'], ['Bahrain', '+973'], ['Nepal', '+977'],
  ['Bangladesh', '+880'], ['Sri Lanka', '+94'], ['Pakistan', '+92'], ['Nigeria', '+234'],
  ['Kenya', '+254'], ['United Kingdom', '+44'], ['United States', '+1'], ['Other', ''],
];

const QUALIFICATIONS = ['MBBS', 'MD', 'MS', 'DNB', 'BDS / MDS', 'BAMS / BHMS / BUMS', 'Diploma', 'Other'];

export default function EnquiryForm({ course, onSubmit, className = '' }) {
  const courses = useAsync(getCourses, []);
  const [f, setF] = useState({
    name: '', email: '', code: '+91', phone: '', country: 'India', course: course || '', qual: '',
  });

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const setCountry = (e) => {
    const name = e.target.value;
    const dial = COUNTRIES.find(([n]) => n === name)?.[1];
    setF((p) => ({ ...p, country: name, code: dial || p.code }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(f);
    const text =
      `Hi, I want to apply for a program at Medical Global Academy.\n\n` +
      `Name: ${f.name}\nEmail: ${f.email}\nMobile: ${f.code} ${f.phone}\n` +
      `Country: ${f.country}\nProgram: ${f.course}\nQualification: ${f.qual}`;
    window.open(
      `https://api.whatsapp.com/send?phone=${SITE.phoneRaw}&text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener'
    );
  };

  const options = courses.data || [];

  return (
    <form className={`enq ${className}`} onSubmit={submit}>
      <div className="enq__head">
        <span className="enq__badge">Priority 2026 batch application</span>
        <h3>Apply for a Program</h3>
        <p>Get the full curriculum and next batch details on WhatsApp</p>
      </div>

      <div className="enq__body">
        <h4>Fast-track your medical career</h4>
        <p className="enq__sub">
          Advance your clinical expertise with Fellowship, PG Diploma and Certificate programs.
        </p>

        <label className="enq__f">
          <span>Doctor full name *</span>
          <input required placeholder="e.g. Dr. Rajesh Kumar" value={f.name} onChange={set('name')} autoComplete="name" />
        </label>

        <label className="enq__f">
          <span>Email *</span>
          <input required type="email" placeholder="Email address" value={f.email} onChange={set('email')} autoComplete="email" />
        </label>

        <div className="enq__f">
          <span>Mobile number *</span>
          <div className="enq__phone">
            <input
              aria-label="Country code"
              className="enq__code"
              required
              value={f.code}
              onChange={set('code')}
              inputMode="tel"
            />
            <input
              aria-label="Mobile number"
              required
              type="tel"
              placeholder="Mobile no."
              value={f.phone}
              onChange={(e) => setF((p) => ({ ...p, phone: e.target.value.replace(/[^\d\s-]/g, '') }))}
              pattern="[0-9\s\-]{6,15}"
              autoComplete="tel-national"
            />
          </div>
        </div>

        <label className="enq__f">
          <span>Country *</span>
          <select required value={f.country} onChange={setCountry}>
            {COUNTRIES.map(([n]) => <option key={n}>{n}</option>)}
          </select>
        </label>

        <label className="enq__f">
          <span>Course program *</span>
          <select required value={f.course} onChange={set('course')} disabled={!!course}>
            <option value="">- Select course program -</option>
            {course && !options.some((c) => c.name === course) && <option value={course}>{course}</option>}
            {options.map((c) => <option key={c.id ?? c.name} value={c.name}>{c.name}</option>)}
          </select>
        </label>

        <label className="enq__f">
          <span>Highest qualification *</span>
          <select required value={f.qual} onChange={set('qual')}>
            <option value="">Select qualification</option>
            {QUALIFICATIONS.map((q) => <option key={q}>{q}</option>)}
          </select>
        </label>

        <button className="enq__submit" type="submit">Submit form &rarr;</button>
        <p className="enq__note">Programs are skill-development courses, not government degrees.</p>
      </div>
    </form>
  );
}