import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AutoLeadPopup from './AutoLeadPopup'; // ✅ Popup import kiya

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo?.(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />

      {/* ✅ GLOBAL POPUP - Har page par 3 second baad khulega */}
      <AutoLeadPopup />
    </>
  );
}