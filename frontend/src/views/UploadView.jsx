import React from 'react';

export default function UploadView({ user }) {
  if (!user || !user.is_staff) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2><i className="fas fa-lock" style={{ color: 'var(--accent-gold)' }}></i> Staff Admin Required</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Content upload management is reserved for staff administrators.</p>
        <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" className="btn-play" style={{ display: 'inline-flex', margin: '0 auto' }}>
          <i className="fas fa-user-shield"></i> Open Django Admin Portal
        </a>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-cloud-upload-alt" style={{ color: 'var(--accent-gold)' }}></i> Media & Content Admin Upload</h1>
      </div>

      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <i className="fas fa-tools fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
        <h2>Django Staff Admin Management</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.75rem auto 1.5rem auto' }}>
          As a staff administrator, you can upload new Quran MP3 Audio files, Video Lectures, PDF Books, Tafseer commentaries, and Hadiths directly through the Django Admin Portal.
        </p>
        <a
          href="http://127.0.0.1:8000/admin/"
          target="_blank"
          rel="noreferrer"
          className="btn-play"
          style={{ display: 'inline-flex', padding: '0.75rem 2rem', fontSize: '1rem', margin: '0 auto' }}
        >
          <i className="fas fa-external-link-alt"></i> Access Django Admin Dashboard
        </a>
      </div>
    </div>
  );
}
