import React, { useState, useEffect } from 'react';

export default function QarisView({ playTrack }) {
  const [qaris, setQaris] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/qaris/')
      .then(res => res.json())
      .then(data => setQaris(data.qaris || []))
      .catch(() => {});
  }, []);

  const filteredQaris = qaris.filter(qari => {
    if (!qari) return false;
    const q = (query || '').trim().toLowerCase();
    if (!q) return true;
    const name = (qari.name || '').toLowerCase();
    const arabName = (qari.arabic_name || '').toLowerCase();
    const bio = (qari.bio || '').toLowerCase();
    return name.includes(q) || arabName.includes(q) || bio.includes(q);
  });

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-microphone" style={{ color: 'var(--accent-gold)' }}></i> 20 Famous Reciters (Qaris)</h1>
      </div>

      <div className="filter-bar">
        <div className="filter-group" style={{ width: '100%' }}>
          <span className="filter-label"><i className="fas fa-search"></i> Search Qari:</span>
          <input
            type="text"
            className="filter-input"
            style={{ width: '100%', maxWidth: '400px' }}
            placeholder="Search by name, arabic title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid-4">
        {filteredQaris.map((qari) => (
          <div key={qari.id} className="card" style={{ padding: '1.5rem', textAlign: 'center', alignItems: 'center' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-emerald))', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '1rem', border: '2px solid var(--accent-gold)' }}>
              <i className="fas fa-user-alt"></i>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{qari.name}</h3>
            <p className="arabic-font" style={{ fontSize: '1.3rem', color: 'var(--primary-light)', margin: '0.4rem 0' }}>{qari.arabic_name}</p>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1 }}>{qari.bio}</p>
            <button
              className="btn-play"
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
              onClick={() => playTrack(`https://server8.mp3quran.net/${qari.slug}/001.mp3`, `Surah Al-Fatiha`, qari.name)}
            >
              <i className="fas fa-play"></i> Play Sample
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
