const PATHS = {
  cross: 'M9 2h6v7h7v6h-7v7H9v-7H2V9h7z',
  heart: 'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2 0 3.5 1 5.4 3 1.9-2 3.4-3 5.4-3 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z',
  search: 'M11 4a7 7 0 105 11.9l4.6 4.6 1.4-1.4-4.6-4.6A7 7 0 0011 4zm0 2a5 5 0 110 10 5 5 0 010-10z',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 2a7 7 0 110 14 7 7 0 010-14zm-1 3v5l4 2 .8-1.6-3-1.5V8z',
  calendar: 'M7 2v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm-2 6h14v11H5V8z',
  laptop: 'M4 5h16v10H4V5zm-2 12h20v2H2v-2z',
  award: 'M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.3 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2zM8 20l4-2 4 2v3l-4-2-4 2v-3z',
  users: 'M9 11a4 4 0 100-8 4 4 0 000 8zm8 1a3 3 0 100-6 3 3 0 000 6zM9 13c-3.3 0-7 1.7-7 4v3h14v-3c0-2.3-3.7-4-7-4zm8 1c-.6 0-1.2.1-1.8.2 1.2.9 1.8 2 1.8 3.3V20h5v-2.5c0-1.9-2.6-3.5-5-3.5z',
  book: 'M4 4a2 2 0 012-2h13v18H6a2 2 0 00-2 2V4zm4 3v2h8V7H8z',
  arrow: 'M4 11h12.2l-5.6-5.6L12 4l8 8-8 8-1.4-1.4 5.6-5.6H4v-2z',
  phone: 'M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25c1.1.37 2.3.57 3.6.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1l-2.2 2.2z',
  mail: 'M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7L4 7v2l8 5 8-5V7l-8 5z',
  chat: 'M4 3h16a2 2 0 012 2v11a2 2 0 01-2 2H9l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2z',
  check: 'M9.5 16.2L5.3 12l-1.4 1.4 5.6 5.6L21 7.5l-1.4-1.4z',
  chevron: 'M8.6 5.4L15.2 12l-6.6 6.6L10 20l8-8-8-8z',
  menu: 'M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z',
  close: 'M5.7 4.3L12 10.6l6.3-6.3 1.4 1.4-6.3 6.3 6.3 6.3-1.4 1.4-6.3-6.3-6.3 6.3-1.4-1.4 6.3-6.3-6.3-6.3z',
  mobile: 'M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm0 3v13h10V5H7zm5 14.5a1 1 0 100 2 1 1 0 000-2z',
  shield: 'M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3zm-1 13l6-6-1.4-1.4L11 12.2 8.4 9.6 7 11l4 4z',
  star: 'M12 2l2.9 6.3 6.8.7-5.1 4.6 1.5 6.7L12 16.8 5.9 20.3l1.5-6.7L2.3 9l6.8-.7L12 2z',
  play: 'M8 5v14l11-7z'
};

export const STAR_PATH = PATHS.star;
export const HEART_PATH = PATHS.heart;

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={PATHS[name] || PATHS.cross} />
    </svg>
  );
}
