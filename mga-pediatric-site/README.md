# MGA Pediatrics (React + Vite)

A Pediatrics-only website for Medical Global Academy. It reads the live MGA APIs and shows **only Pediatric department courses and faculty**.

APIs used
- `https://24x7.medicalglobalacademy.com/api/course-list`
- `https://24x7.medicalglobalacademy.com/api/course-details/:slug`
- `https://24x7.medicalglobalacademy.com/api/faculty-list`

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 27 tests (vitest)
SITE_URL=https://your-domain.com npm run build   # also regenerates sitemap.xml + robots.txt
npm run preview
```

Set `VITE_SITE_URL` (canonical / Open Graph URLs) and `SITE_URL` (sitemap) to your real domain. The default is the placeholder `https://your-domain.com`.

## Pages

`/` Home, `/courses` (search, type, focus area, sort, pagination), `/courses/:slug` (detail with tabs, curriculum, sticky enrol card), `/faculty`, `/about`, `/support`, `/app`, `/privacy-policy`, `/terms`, `/refund`, `/sitemap`, plus a 404.

## How "Pediatric only" works

The API `category` field is unreliable (for example, Pediatric Neurology is tagged "Orthopedic"), so filtering is done on the **course name** with keywords in `src/config/pediatric-rules.js`:

`pediatric, paediatric, pedodont, neonat, newborn, infant, child`

- Add a course the keywords miss: put its slug in `includeSlugs`.
- Remove a false positive: put its slug in `excludeSlugs`.
- Detail pages for non-pediatric slugs are refused ("not part of the Pediatrics department").
- Faculty are filtered by department and qualification (`facultyKeywords`).
- The sitemap script uses the same rules, so it lists only pediatric courses.

## Notes

- **API access:** requests go direct first, then fall back to `/proxy` (Vite dev proxy, `public/_redirects` for Netlify, `vercel.json` for Vercel). This avoids CORS problems.
- **Course images:** the API returns only a filename. `SITE.imageBases` in `src/config/site.js` lists base URLs tried in order, then a coloured placeholder is shown. Adjust it if your images live elsewhere.
- **Faculty privacy:** faculty phone and email are never displayed. Placeholder records such as `FACULTY1102` are hidden.
- **Legal pages:** `src/content/legal.js` contains generic draft text. Replace it with the official MGA Privacy, Terms and Refund wording before going live.
- **Sitemap:** `npm run build` regenerates it from the live API. If the API is unreachable, the existing file is kept. For offline use, set `COURSE_LIST_FILE=path/to/course-list.json`.
- **Contact details** (email, phone, WhatsApp, Play Store link, socials) are in `src/config/site.js`.

## Structure

```
src/config     site settings, pediatric rules
src/api        API client (cache, proxy fallback)
src/utils      formatting + pediatric helpers
src/hooks      useAsync, useScrollSpy, useSeo
src/components Header, Footer, cards, hero art, etc.
src/pages      one file per route
src/content    legal text
src/styles     base, layout, components, pages
scripts        sitemap generator
tests          vitest + mock API fixtures
```
