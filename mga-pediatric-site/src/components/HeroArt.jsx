import { HEART_PATH, STAR_PATH } from './Icon';

// Original decorative illustration for the home hero: blobs, heart, stars, balloon and squiggle.
export default function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 520 480" role="img" aria-label="Decorative illustration with a heart, stars and a balloon">
      <path d="M70 250C50 120 165 38 290 58s195 82 175 195-92 192-214 192S90 370 70 250z" fill="#ffc83d" />
      <path d="M110 260c-10-90 70-150 160-140s150 70 140 150-70 140-150 140-140-60-150-150z" fill="#2f6fed" opacity="0.14" />
      <circle cx="268" cy="238" r="118" fill="#2f6fed" />
      <circle cx="268" cy="238" r="118" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" strokeDasharray="2 16" strokeLinecap="round" />
      <g transform="translate(268 246) scale(6.4) translate(-12 -12)">
        <path d={HEART_PATH} fill="#fff" />
      </g>
      <g transform="translate(70 64) scale(3.2)"><path d={STAR_PATH} fill="#ff6f61" /></g>
      <g transform="translate(420 96) scale(2.2) rotate(14 12 12)"><path d={STAR_PATH} fill="#8b7cf6" /></g>
      <g transform="translate(392 360) scale(1.5)"><path d={STAR_PATH} fill="#35c6a4" /></g>
      <path d="M44 410q22-34 44 0t44 0 44 0 44 0" fill="none" stroke="#35c6a4" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="452" cy="300" rx="36" ry="44" fill="#ff6f61" />
      <path d="M452 344q-12 32 6 70" fill="none" stroke="#1d2a44" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="440" cy="284" rx="7" ry="12" fill="#fff" opacity="0.5" transform="rotate(20 440 284)" />
      <circle cx="120" cy="330" r="12" fill="#8b7cf6" />
      <circle cx="150" cy="356" r="6" fill="#ffc83d" />
      <circle cx="404" cy="46" r="8" fill="#35c6a4" />
    </svg>
  );
}
