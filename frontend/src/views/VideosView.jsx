import React, { useState, useEffect } from 'react';

export default function VideosView({ openVideoModal, openReportModal }) {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadVideos = () => {
      setLoading(true);
      fetch(`/api/videos/?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}&page=${page}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setVideos(data.results || []);
            setTotalPages(data.total_pages || 1);
            setLoading(false);
          }
        })
        .catch(() => { if (isMounted) setLoading(false); });
    };

    loadVideos();

    const handleUpdate = () => loadVideos();
    window.addEventListener('admin_content_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('admin_content_updated', handleUpdate);
    };
  }, [query, selectedCategory, page]);


  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-play-circle" style={{ color: 'var(--accent-gold)' }}></i> Video Lectures & Reminders</h1>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-search"></i> Search:</span>
          <input
            type="text"
            className="filter-input"
            placeholder="Search lecture title, speaker..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-folder"></i> Category:</span>
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading Video Lectures...</p>
        </div>
      ) : (
        <div className="grid-3">
          {videos.map((vid) => (
            <div key={vid.id} className="card">
              <div className="media-cover-wrapper">
                <img src={vid.thumbnail_url || "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=500&q=80"} alt={vid.title} className="media-cover-img" loading="lazy" decoding="async" />
                <div className="media-play-overlay" onClick={() => openVideoModal(vid.title, vid.video_url)}>
                  <button className="play-icon-lg"><i className="fas fa-play"></i></button>
                </div>
              </div>

              <div className="card-body">
                <h3 className="card-title" style={{ fontSize: '1.1rem' }}>{vid.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 600, margin: '0.3rem 0' }}>
                  <i className="fas fa-microphone-alt"></i> {vid.speaker}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{vid.description}</p>
              </div>

              <div className="card-footer">
                <button className="btn-play" onClick={() => openVideoModal(vid.title, vid.video_url)}>
                  <i className="fas fa-play"></i> Watch Lecture
                </button>
                <button
                  className="verse-btn"
                  title="Report Issue"
                  onClick={() => openReportModal('video', vid.title)}
                >
                  <i className="far fa-flag"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '2.5rem 0' }}>
          <button className="btn-play" disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ opacity: page <= 1 ? 0.5 : 1 }}>
            <i className="fas fa-chevron-left"></i> Previous
          </button>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
          <button className="btn-play" disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ opacity: page >= totalPages ? 0.5 : 1 }}>
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
