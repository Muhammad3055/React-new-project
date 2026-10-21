import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiCache';
import { useLanguage } from '../context/LanguageContext';

export default function BookmarksView({ user, navigateToTab, setActiveTab }) {
  const { t } = useLanguage();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('All');

  const handleNav = (tab) => {
    if (typeof navigateToTab === 'function') navigateToTab(tab);
    else if (typeof setActiveTab === 'function') setActiveTab(tab);
  };

  useEffect(() => {
    const localAyahBookmarks = (() => {
      try { return JSON.parse(localStorage.getItem('maktaba_local_ayah_bookmarks') || '[]').map(item => ({ ...item, type: 'local_ayah' })); }
      catch { return []; }
    })();
    const localDuaFavorites = (() => {
      try { return JSON.parse(localStorage.getItem('maktaba_dua_favorites') || '[]').map(item => ({ ...item, type: 'dua' })); }
      catch { return []; }
    })();

    if (user) {
      fetch(getApiUrl('/api/bookmarks/'))
        .then(res => res.json())
        .then(data => {
          setBookmarks([...(data.bookmarks || []).map(item => ({ ...item, type: 'ayah' })), ...localAyahBookmarks, ...localDuaFavorites]);
          setLoading(false);
        })
        .catch(() => { setBookmarks(localDuaFavorites); setLoading(false); });
    } else {
      setBookmarks([...localAyahBookmarks, ...localDuaFavorites]);
      setLoading(false);
    }
  }, [user]);

  const removeBookmark = (bookmark) => {
    if (bookmark.type === 'dua') {
      let saved = [];
      try { saved = JSON.parse(localStorage.getItem('maktaba_dua_favorites') || '[]'); } catch {}
      const next = saved.filter(item => item.id !== bookmark.id);
      try { localStorage.setItem('maktaba_dua_favorites', JSON.stringify(next)); } catch {}
      setBookmarks(prev => prev.filter(item => !(item.type === 'dua' && item.id === bookmark.id)));
      return;
    }
    if (!user || bookmark.type === 'local_ayah') {
      let saved = [];
      try { saved = JSON.parse(localStorage.getItem('maktaba_local_ayah_bookmarks') || '[]'); } catch {}
      const next = saved.filter(item => !(item.surah_number === bookmark.surah_number && item.ayah_number === bookmark.ayah_number));
      try { localStorage.setItem('maktaba_local_ayah_bookmarks', JSON.stringify(next)); } catch {}
      setBookmarks(prev => prev.filter(item => !(['ayah', 'local_ayah'].includes(item.type) && item.surah_number === bookmark.surah_number && item.ayah_number === bookmark.ayah_number)));
      return;
    }
    fetch(getApiUrl('/api/bookmark/toggle/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surah_number: bookmark.surah_number, ayah_number: bookmark.ayah_number })
    })
      .then(res => res.json())
      .then(() => {
        setBookmarks(prev => prev.filter(item => !(item.type === 'ayah' && item.surah_number === bookmark.surah_number && item.ayah_number === bookmark.ayah_number)));
      });
  };

  const visibleBookmarks = bookmarks.filter(item => selectedFolder === 'All' || selectedFolder === 'Favorites' || (selectedFolder === 'Duas' && item.type === 'dua'));

  return (
    <div className="container">
      <div className="section-header" style={{ marginBottom: '1rem' }}>
        <h1 className="section-title"><i className="fas fa-bookmark" style={{ color: 'var(--accent-gold)' }}></i> {t('myBookmarks', 'My Saved Bookmarks')}</h1>
      </div>

      {/* Bookmark Folders Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'All', label: t('all', 'All') },
          { key: 'Favorites', label: '⭐ ' + t('favorites', 'Favorites') },
          { key: 'Duas', label: '🤲 ' + t('duas', 'Duas') },
        ].map((folder) => {
          const isSelected = selectedFolder === folder.key;
          return (
            <button
              key={folder.key}
              onClick={() => setSelectedFolder(folder.key)}
              style={{
                padding: '0.45rem 1rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700,
                background: isSelected ? 'var(--accent-gold)' : '#18181b',
                color: isSelected ? '#000' : '#cbd5e1',
                border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'
              }}
            >
              {folder.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{t('loading', 'Loading your saved bookmarks...')}</p>
        </div>
      ) : visibleBookmarks.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <i className="far fa-star fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
          <h3>{t('noBookmarksYet', 'No Bookmarks Saved Yet')}</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>{t('noBookmarksDesc', 'Click the star icon next to any Ayah while reading the Quran to save it here for quick access.')}</p>
          <a
            href="/read"
            className="btn-play"
            style={{ margin: '0 auto', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              handleNav('read');
            }}
          >
            <i className="fas fa-book-open"></i> {t('goToQuranReader', 'Go to Quran Reader')}
          </a>
        </div>
      ) : (
        <div className="grid-3">
          {visibleBookmarks.map((bm) => (
            <div key={`${bm.type}-${bm.id || `${bm.surah_number}-${bm.ayah_number}`}`} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="surah-number-badge" style={{ width: 'auto', padding: '0.3rem 0.8rem', borderRadius: '15px', fontSize: '0.85rem' }}>
                  {bm.type === 'dua' ? t('duas', 'Dua') : `${t('surah', 'Surah')} ${bm.surah_number}:${bm.ayah_number}`}
                </span>
                <button
                  className="verse-btn"
                  style={{ color: '#ef4444' }}
                  title={t('removeBookmark', 'Remove Bookmark')}
                  onClick={() => removeBookmark(bm)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
              {bm.title && <h3 style={{ margin: '0 0 0.65rem', fontSize: '1rem' }}>{bm.title}</h3>}
              {bm.arabic && <p dir="rtl" style={{ fontFamily: "'Amiri', serif", fontSize: '1.4rem', lineHeight: 1.9, color: 'var(--primary-dark)' }}>{bm.arabic}</p>}
              {bm.translation && <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{bm.translation}</p>}
              {bm.reference && <p style={{ margin: '0 0 0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{bm.reference}</p>}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{bm.created_at || bm.saved_at}</p>
              <a
                href={bm.type === 'dua' ? '/duas' : '/read'}
                className="btn-play"
                style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(bm.type === 'dua' ? 'duas' : 'read');
                }}
              >
                <i className="fas fa-book-open"></i> {bm.type === 'dua' ? t('openDua', 'Open Duas') : t('goToQuranReader', 'Go to Quran Reader')}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
