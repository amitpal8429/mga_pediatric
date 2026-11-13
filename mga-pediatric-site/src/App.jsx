import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Faculty from './pages/Faculty';
import About from './pages/About';
import Support from './pages/Support';
import AppPage from './pages/AppPage';
import LegalPage from './pages/LegalPage';
import SitemapPage from './pages/SitemapPage';
import NotFound from './pages/NotFound';
import { PRIVACY, REFUND, TERMS } from './content/legal';

// Route paths mirror medicalglobalacademy.com (/about, /support, /privacy-policy, /app, /terms, /refund, /sitemap).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:slug" element={<CourseDetail />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="about" element={<About />} />
        <Route path="support" element={<Support />} />
        <Route path="app" element={<AppPage />} />
        <Route path="privacy-policy" element={<LegalPage doc={PRIVACY} path="/privacy-policy" />} />
        <Route path="terms" element={<LegalPage doc={TERMS} path="/terms" />} />
        <Route path="refund" element={<LegalPage doc={REFUND} path="/refund" />} />
        <Route path="sitemap" element={<SitemapPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
