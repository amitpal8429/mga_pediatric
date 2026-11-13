// Central site settings. Edit here; nothing else needs to change for these options.
export const SITE = {
  name: 'MGA Pediatrics',
  parent: 'Medical Global Academy',
  department: 'Pediatrics',
  url: (import.meta.env?.VITE_SITE_URL || 'https://your-domain.com').replace(/\/$/, ''),

  // Live API
  apiBase: 'https://24x7.medicalglobalacademy.com/api',
  proxyBase: '/proxy',

  // API course object mein image in fields mein se jo pehle mile wo use hoga
  imageFields: ['image', 'thumbnail', 'featured_image', 'photo', 'banner', 'course_image', 'img'],

  // ✅ Image folders: Aapka diya hua exact path sabse pehle
  imageBases: [
    'https://24x7.medicalglobalacademy.com/storage/uploads/course/', // 👈 #1 Sahi Path
    'https://24x7.medicalglobalacademy.com/uploads/course/',         // #2 Fallback
    'https://24x7.medicalglobalacademy.com/uploads/courses/',        // #3 Fallback
    'https://24x7.medicalglobalacademy.com/storage/courses/',        // #4 Fallback
    'https://24x7.medicalglobalacademy.com/storage/course/',         // #5 Fallback
    'https://24x7.medicalglobalacademy.com/uploads/',                // #6 Fallback
    'https://24x7.medicalglobalacademy.com/storage/',                // #7 Fallback
  ],

  currency: 'INR',
  hidePlaceholderFaculty: true,
  cleanSessions: true,

  email: 'support@medicalglobalacademy.com',
  phone: '+91 92899 94218',
  phoneRaw: '+919289994218',
  whatsapp: '919289994218',
  playStore: 'https://play.google.com/store/apps/details?id=com.medicalglobalacademy.mga.learning',
  mainSite: 'https://medicalglobalacademy.com',

  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/medicalglobalacademy/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@medicalglobalacademy' },
    { label: 'Facebook', href: 'https://www.facebook.com/medicalglobalacademy1/' },
    { label: 'X', href: 'https://x.com/MGA_Courses' },
  ],
};

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/courses', label: 'Courses' },
  { to: '/faculty', label: 'Faculty' },
  { to: '/about', label: 'About' },
  { to: '/support', label: 'Support' },
];

export const COMPANY_LINKS = [
  { to: '/about', label: 'About us' },
  { to: '/support', label: 'Support' },

];

export const LEGAL_LINKS = [
  { to: '/privacy-policy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/refund', label: 'Refund & Cancellation Policy' },
  { to: '/sitemap', label: 'Sitemap' },
];