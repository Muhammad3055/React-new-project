import React, { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../utils/apiCache';
import AdminUploadModal from '../components/AdminUploadModal';

export default function VideosView({ user }) {
  const { t } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = new URLSearchParams(window.location.search).get('q') || '';
  const [editingVideo, setEditingVideo] = useState(null);
  const isAdmin = user?.is_staff || user?.is_superuser;

  const loadVideos = () => {
    setLoading(true);
    setError('');
    fetch(getApiUrl(`/api/videos/?q=${encodeURIComponent(query)}`))
      .then(response => { if (!response.ok) throw new Error('Could not load videos. Please retry.'); return response.json(); })
      .then(data => setVideos(data.results || []))
      .catch(error => setError(error.message)).finally(() => setLoading(false));
  };

  useEffect(() => { loadVideos(); }, [isAdmin]);
  return (
    <div className="container" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
          <i className="fas fa-video" style={{ color: 'var(--accent-gold)', marginRight: '0.6rem' }}></i> {t('videoLecturesTitle', 'Islamic Video Lectures & Bayanat')}
        </h1>
      </div>

      {loading && <p role="status">Loading videos…</p>}
      {error && <p role="alert">{error} <button type="button" onClick={loadVideos}>Retry</button></p>}
      {!loading && !error && videos.length > 0 && <div className="video-library-grid">{videos.filter(video => !query || video.title.toLowerCase().includes(query.toLowerCase())).map(video => <article key={video.id} className="video-library-card">{video.thumbnail_url && <img src={video.thumbnail_url} alt="" loading="lazy" />}<h2>{video.title}</h2><p>{video.speaker}</p>{/^https?:\/\//i.test(video.video_url || '') || /^\/(?!\/)/.test(video.video_url || '') ? <a href={video.video_url} target="_blank" rel="noopener noreferrer">Watch video ↗</a> : <span>Video currently unavailable</span>}</article>)}</div>}
      {!loading && !error && videos.length === 0 && <div
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
          {t('videosComingSoonTitle', 'Videos Will Be Uploaded Soon!')}
        </h2>
        
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#059669', marginBottom: '1rem', fontFamily: "'Jameel Noori Nastaleeq', 'Amiri', serif" }}>
          {t('videosComingSoonUrdu', 'ویڈیوز جلد اپ لوڈ کی جائیں گی')}
        </h3>

        <p style={{ fontSize: '0.95rem', color: '#44403c', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
          {t('videosComingSoonDesc', 'We are preparing high-quality Islamic video lectures, Seerah series, and Quranic reflections. Stay tuned — video bayanat will be uploaded soon!')}
        </p>
      </div>}
      {isAdmin && (
        <div style={{ maxWidth: '750px', margin: '2rem auto', textAlign: 'left' }}>
          <h2>Manage uploaded videos</h2>
          {videos.map(video => (
            <div key={video.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', padding: '0.75rem', marginBottom: '0.5rem', background: '#fff', borderRadius: '8px' }}>
              <span>{video.title}</span>
              <button type="button" onClick={() => setEditingVideo(video)}>Edit video</button>
            </div>
          ))}
        </div>
      )}
      {editingVideo && <AdminUploadModal editItem={{ ...editingVideo, contentType: 'video' }} defaultContentType="video" onClose={() => setEditingVideo(null)} onSuccess={loadVideos} />}
    </div>
  );
}
