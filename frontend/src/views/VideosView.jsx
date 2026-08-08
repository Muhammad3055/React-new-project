import React from 'react';
import { Video, Film, Sparkles } from 'lucide-react';

export default function VideosView() {
  return (
    <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
      <div className="section-header">
        <h1 className="section-title">
          <i className="fas fa-play-circle" style={{ color: 'var(--accent-gold)' }}></i> Video Library & Bayanat
        </h1>
      </div>

      <div 
        className="card" 
        style={{ 
          maxWidth: '650px', 
          margin: '2rem auto', 
          padding: '3rem 2rem', 
          textAlign: 'center', 
          border: '1.5px dashed var(--accent-gold)', 
          borderRadius: '24px',
          background: 'rgba(2, 44, 34, 0.4)'
        }}
      >
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '2rem' }}>
          <i className="fas fa-video"></i>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
          Islamic Video Section Ready
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
          No video lectures or bayanat uploaded yet. Admins can upload videos (MP4, WEBM, HD/4K) anytime from the Admin Media Studio.
        </p>
      </div>
    </div>
  );
}
