import React, { useState } from 'react';
import AdminUploadModal from './AdminUploadModal';

export default function AdminFloatingBar({ user, navigateToTab }) {
  const [showModal, setShowModal] = useState(false);

  // Render floating bar ONLY if logged in as Admin or Staff
  if (!user || (!user.is_staff && !user.is_superuser)) {
    return null;
  }

  return (
    <>
      <div
        className="admin-floating-bar"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
          border: '2px solid var(--accent-gold)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(245, 158, 11, 0.4)',
          borderRadius: '30px',
          padding: '6px 14px',
          color: '#fff',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="admin-badge-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#ffffff', color: '#022c22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', border: '1px solid var(--accent-gold)', flexShrink: 0 }}>
            <i className="fas fa-book-quran" style={{ color: '#022c22' }}></i>
          </div>
          <span className="admin-text-label">ADMIN STUDIO</span>
        </div>


        <button
          className="admin-add-content-btn"
          onClick={() => setShowModal(true)}
          style={{
            background: 'var(--accent-gold)',
            color: '#022c22',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
          title="Admin Upload & Add Content Studio"
        >
          <i className="fas fa-plus-circle"></i>
          <span className="admin-btn-text">+ Add Content / Document / MP3</span>
        </button>

        <button
          className="admin-portal-page-btn"
          onClick={() => navigateToTab && navigateToTab('upload')}
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Open Full Admin Portal Page"
        >
          <i className="fas fa-sliders-h" style={{ fontSize: '0.88rem' }}></i>
        </button>
      </div>

      {showModal && (
        <AdminUploadModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
