import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EnquiryForm from './EnquiryForm';
import Icon from './Icon';

export default function AutoLeadPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // Jab bhi page change ho, popup band kar dein aur 3 second baad wapas kholen
    setShowPopup(false);
    
    // 3 second (3000ms) ka timer
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [pathname]); // pathname change hone par dobara chalega

  if (!showPopup) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', maxWidth: '480px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Close Button */}
        <button 
          onClick={() => setShowPopup(false)}
          style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 10,
            background: '#f1f5f9', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Icon name="close" size={20} />
        </button>
        
        {/* Form */}
        <div style={{ padding: '24px' }}>
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}