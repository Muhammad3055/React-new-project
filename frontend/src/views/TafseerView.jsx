import React, { useState, useEffect } from 'react';

export default function TafseerView({ openReportModal, user }) {
  const [tafseers, setTafseers] = useState([]);
  const [surahList, setSurahList] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [userSavedTafseers, setUserSavedTafseers] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/user/dashboard/')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setUserSavedTafseers(data.saved_tafseers || []);
        }
      })
      .catch(() => {});
  }, [user]);

  const toggleSaveTafseer = (surah, ayah, scholar) => {
    if (!user) {
      alert("Please sign in to save Tafseer comments.");
      return;
    }
    const existing = [...userSavedTafseers];
    const index = existing.findIndex(t => t.surah === surah && t.ayah === ayah);
    let updated;
    
    if (index > -1) {
      updated = existing.filter(t => !(t.surah === surah && t.ayah === ayah));
    } else {
      updated = [
        ...existing,
        {
          surah: surah,
          ayah: ayah,
          scholar: scholar,
          saved_at: new Date().toLocaleDateString()
        }
      ];
    }
    
    setUserSavedTafseers(updated);
    
    fetch('/api/user/preferences/update/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saved_tafseers: updated })
    });
  };

  const logTafseerHistory = (surah, ayah) => {
    if (!user) return;
    
    fetch('/api/user/dashboard/')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          let history = data.tafseer_history || [];
          const historyItem = {
            surah: surah,
            ayah: ayah,
            timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          history = history.filter(h => !(h.surah === surah && h.ayah === ayah));
          history.unshift(historyItem);
          history = history.slice(0, 30);
          
          fetch('/api/user/preferences/update/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tafseer_history: history })
          });
        }
      });
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tafseer/?q=${encodeURIComponent(debouncedQuery)}&surah=${encodeURIComponent(selectedSurah)}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setTafseers(data.results || []);
        setSurahList(data.surah_list || []);
        setTotalPages(data.total_pages || 1);
        setLoading(false);

        if (user && data.results && data.results.length > 0) {
          const first = data.results[0];
          logTafseerHistory(first.surah_number, first.ayah_number);
        }
      })
      .catch(() => setLoading(false));
  }, [debouncedQuery, selectedSurah, page, user]);

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-bookmark" style={{ color: 'var(--accent-gold)' }}></i> Quran Tafseer & Exegesis</h1>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-search"></i> Search:</span>
          <input
            type="text"
            className="filter-input"
            placeholder="Search Tafseer text, scholar..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-book-open"></i> Surah:</span>
          <select
            className="filter-select"
            value={selectedSurah}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Surahs</option>
            {surahList.map((s) => (
              <option key={s.surah_number} value={s.surah_number}>Surah {s.surah_number}. {s.surah_name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading Tafseer Commentary...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {tafseers.map((item) => (
            <div key={item.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="surah-number-badge" style={{ width: 'auto', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                  Surah {item.surah_name} ({item.surah_number}:{item.ayah_number})
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-light)' }}>{item.scholar_name}</span>
                  {user && (
                    <button
                      className="verse-btn"
                      onClick={() => toggleSaveTafseer(item.surah_number, item.ayah_number, item.scholar_name)}
                      style={{
                        color: userSavedTafseers.some(t => t.surah === item.surah_number && t.ayah === item.ayah_number) ? '#3b82f6' : undefined
                      }}
                      title={userSavedTafseers.some(t => t.surah === item.surah_number && t.ayah === item.ayah_number) ? "Tafseer Saved" : "Save Tafseer"}
                    >
                      <i className={userSavedTafseers.some(t => t.surah === item.surah_number && t.ayah === item.ayah_number) ? "fas fa-bookmark" : "far fa-bookmark"}></i>
                    </button>
                  )}
                  <button
                    className="verse-btn"
                    title="Report Issue"
                    onClick={() => openReportModal('tafseer', `Surah ${item.surah_number}:${item.ayah_number}`)}
                  >
                    <i className="far fa-flag"></i>
                  </button>
                </div>
              </div>

              <p className="arabic-font" style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>{item.arabic_text}</p>
              <p style={{ fontSize: '1rem', fontStyle: 'italic', color: '#334155', marginBottom: '1rem' }}>"{item.translation}"</p>
              
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid var(--accent-gold)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Scholarly Commentary:</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7' }}>{item.tafseer_text}</p>
              </div>
            </div>
          ))}

          {tafseers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#ffffff', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
              <i className="fas fa-info-circle fa-2x" style={{ color: 'var(--accent-gold)', marginBottom: '0.75rem' }}></i>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
                Tafseer Ibn Kathir text commentary is currently being compiled and verified, and will be uploaded soon.
              </p>
            </div>
          )}
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
