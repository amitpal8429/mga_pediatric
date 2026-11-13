// Decorative wave divider. Colour it with CSS: `.wave { color: ... }` (it fills with currentColor).
export default function Wave({ flip = false, className = '' }) {
  return (
    <svg className={`wave ${flip ? 'flip' : ''} ${className}`} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M0 40c120 36 240 40 360 20S600 0 720 8s240 52 360 52 240-30 360-44V80H0z" />
    </svg>
  );
}
