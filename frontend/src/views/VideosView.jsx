import React from 'react';
import { Video, Lock, Sparkles, Film, PlusCircle } from 'lucide-react';

export default function VideosView({ user, onOpenAdminModal }) {
  return (
    <div className="container" style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="section-title" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
          <i className="fas fa-play-circle" style={{ color: 'var(--accent-gold)', marginRight: '0.5rem' }}></i> Islamic Video Lectures & Bayanat Studio
        </h1>
        <p style={{ color: '#44403c', fontSize: '0.9rem', maxWidth: '600px', margin: '0.4rem auto 0 auto' }}>
          Watch high-definition Islamic lectures, Seerah series, and Quranic reflections.
        </p>
      </div>

      <div 
        className="card" 
        style={{ 
          maxWidth: '680px', 
          margin: '2rem auto', 
          padding: '3.5rem 2rem', 
          textAlign: 'center', 
          border: '2px dashed var(--accent-gold)', 
          borderRadius: '24px',
          background: '#ffffff',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', border: '2px solid #fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '2.2rem' }}>
          <Lock size={38} style={{ color: '#b45309' }} />
        </div>

        <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#022c22', background: 'var(--accent-gold)', padding: '4px 14px', borderRadius: '16px', letterSpacing: '0.5px' }}>
          🔓 Section Unlocked — Wait for Future Videos
        </span>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1c1917', margin: '1rem 0 0.5rem 0' }}>
          Islamic Video Library Unlocked!
        </h2>
        
        <p style={{ fontSize: '0.92rem', color: '#44403c', lineHeight: '1.65', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
          This section is fully unlocked and ready for future video lecture uploads (MP4, YouTube Embeds, Seerah Series & Bayanat). Please check back soon or use the Admin Studio to upload new video links!
        </p>

        {user && (user.is_staff || user.is_superuser) && onOpenAdminModal && (
          <button
            onClick={onOpenAdminModal}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '25px',
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              border: '2px solid var(--accent-gold)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
            }}
          >
            <PlusCircle size={18} /> Upload Video Lecture as Admin
          </button>
        )}
      </div>
    </div>
  );
}
