import React, { useState, useEffect } from 'react';

export default function BookmarksView({ user, navigateToTab, setActiveTab }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('All');

  const handleNav = (tab) => {
    if (typeof navigateToTab === 'function') navigateToTab(tab);
    else if (typeof setActiveTab === 'function') setActiveTab(tab);
  };

  useEffect(() => {
    if (user) {
      fetch('/api/bookmarks/')
        .then(res => res.json())
        .then(data => {
          setBookmarks(data.bookmarks || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const removeBookmark = (surahNum, ayahNum) => {
    fetch('/api/bookmark/toggle/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surah_number: surahNum, ayah_number: ayahNum })
    })
      .then(res => res.json())
      .then(() => {
        setBookmarks(prev => prev.filter(b => !(b.surah_number === surahNum && b.ayah_number === ayahNum)));
      });
  };

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2><i className="fas fa-lock" style={{ color: 'var(--accent-gold)' }}></i> Login Required</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Please log in to view your saved Ayah bookmarks.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-header" style={{ marginBottom: '1rem' }}>
        <h1 className="section-title"><i className="fas fa-bookmark" style={{ color: 'var(--accent-gold)' }}></i> My Saved Bookmarks</h1>
      </div>

      {/* Bookmark Folders Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Favorites ⭐', 'Duas 🤲', 'Study 📖', 'Hifz 🧠'].map((folder) => {
          const folderName = folder.split(' ')[0];
          const isSelected = selectedFolder === folderName;
          return (
            <button
              key={folderName}
              onClick={() => setSelectedFolder(folderName)}
              style={{
                padding: '0.45rem 1rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700,
                background: isSelected ? 'var(--accent-gold)' : '#18181b',
                color: isSelected ? '#000' : '#cbd5e1',
                border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'
              }}
            >
              {folder}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading your saved bookmarks...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <i className="far fa-star fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
          <h3>No Bookmarks Saved Yet</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>Click the star icon next to any Ayah while reading the Quran to save it here for quick access.</p>
          <a
            href="/read"
            className="btn-play"
            style={{ margin: '0 auto', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              handleNav('read');
            }}
          >
            <i className="fas fa-book-open"></i> Go to Quran Reader
          </a>
        </div>
      ) : (
        <div className="grid-3">
          {bookmarks.map((bm) => (
            <div key={bm.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="surah-number-badge" style={{ width: 'auto', padding: '0.3rem 0.8rem', borderRadius: '15px', fontSize: '0.85rem' }}>
                  Surah {bm.surah_number}:{bm.ayah_number}
                </span>
                <button
                  className="verse-btn"
                  style={{ color: '#ef4444' }}
                  title="Remove Bookmark"
                  onClick={() => removeBookmark(bm.surah_number, bm.ayah_number)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Saved on {bm.created_at}</p>
              <a
                href="/read"
                className="btn-play"
                style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('read');
                }}
              >
                <i className="fas fa-book-open"></i> Read in Quran Reader
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
