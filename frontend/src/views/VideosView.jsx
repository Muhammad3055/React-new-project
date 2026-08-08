import React from 'react';
import { Film } from 'lucide-react';

export default function VideosView() {
  return (
    <div className="container" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
          <i className="fas fa-video" style={{ color: 'var(--accent-gold)', marginRight: '0.6rem' }}></i> Islamic Video Lectures & Bayanat
        </h1>
      </div>

      <div 
        className="card" 
        style={{ 
          maxWidth: '650px', 
          margin: '2rem auto', 
          padding: '4rem 2rem', 
          textAlign: 'center', 
          border: '2px solid var(--accent-gold)', 
          borderRadius: '24px',
          background: '#ffffff',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div style={{ width: '85px', height: '85px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', border: '2.5px solid #fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
          <Film size={42} style={{ color: '#b45309' }} />
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1c1917', marginBottom: '0.5rem' }}>
          Videos Will Be Uploaded Soon!
        </h2>
        
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#059669', marginBottom: '1rem', fontFamily: "'Jameel Noori Nastaleeq', 'Amiri', serif" }}>
          ویڈیوز جلد اپ لوڈ کی جائیں گی
        </h3>

        <p style={{ fontSize: '0.95rem', color: '#44403c', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
          We are preparing high-quality Islamic video lectures, Seerah series, and Quranic reflections. Stay tuned — video bayanat will be uploaded soon!
        </p>
      </div>
    </div>
  );
}
