import React, { useState, useEffect } from 'react';

const QARIS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', server: 'https://server8.mp3quran.net/afs/' },
  { id: 'sudais', name: 'Sheikh Abdul Rahman Al-Sudais', server: 'https://server11.mp3quran.net/sds/' },
  { id: 'ghamdi', name: 'Saad Al-Ghamdi', server: 'https://server7.mp3quran.net/s_gmd/' },
  { id: 'muaiqly', name: 'Sheikh Maher Al-Muaiqly', server: 'https://server12.mp3quran.net/maher/' },
  { id: 'shuraim', name: 'Sheikh Saud Al-Shuraim', server: 'https://server7.mp3quran.net/shur/' },
  { id: 'dosari', name: 'Sheikh Yasser Al-Dosari', server: 'https://server11.mp3quran.net/yasser/' },
  { id: 'baleela', name: 'Sheikh Bandar Baleela', server: 'https://server6.mp3quran.net/balila/' },
  { id: 'jaber', name: 'Sheikh Ali Jaber', server: 'https://server11.mp3quran.net/a_jbr/' },
  { id: 'hussary', name: 'Sheikh Mahmoud Khalil Al-Hussary', server: 'https://server13.mp3quran.net/hssr/' },
  { id: 'basit', name: 'Qari Abdul Basit Abdul Samad', server: 'https://server7.mp3quran.net/basit/' },
  { id: 'minshawi', name: 'Mohamed Siddiq El-Minshawi', server: 'https://server10.mp3quran.net/minsh/' },
  { id: 'shatri', name: 'Sheikh Abu Bakr Al-Shatri', server: 'https://server11.mp3quran.net/shatri/' },
  { id: 'rifai', name: 'Sheikh Hani Ar-Rifai', server: 'https://server8.mp3quran.net/href/' },
  { id: 'ajmi', name: 'Ahmed Al-Ajmi', server: 'https://server10.mp3quran.net/ajm/' },
  { id: 'abbad', name: 'Fares Abbad', server: 'https://server8.mp3quran.net/frs_a/' },
  { id: 'budair', name: 'Salah Al-Budair', server: 'https://server6.mp3quran.net/s_bud/' },
  { id: 'juhany', name: 'Abdullah Awad Al-Juhany', server: 'https://server13.mp3quran.net/jhn/' },
  { id: 'kurdi', name: 'Raad Al-Kurdi', server: 'https://server6.mp3quran.net/kurdi/' },
  { id: 'balushi', name: 'Hazza Al-Balushi', server: 'https://server6.mp3quran.net/hazza/' },
  { id: 'sufi', name: 'Abdul Rashid Ali Sufi', server: 'https://server16.mp3quran.net/sofi/a_sofi/' }
];

export default function QuranView({ playTrack }) {
  const [surahsList, setSurahsList] = useState([]);
  const [selectedQari, setSelectedQari] = useState(QARIS[0].id);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setSurahsList(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const activeQariObj = QARIS.find(q => q.id === selectedQari) || QARIS[0];

  const getQariAudioUrl = (surahNumber, qariObj) => {
    const padded = surahNumber < 10 ? `00${surahNumber}` : (surahNumber < 100 ? `0${surahNumber}` : `${surahNumber}`);
    return `${qariObj.server}${padded}.mp3`;
  };

  const getTranslationAudioUrl = (surahNumber, langCode) => {
    if (langCode === 'ur') return `https://cdn.islamic.network/quran/audio-surah/128/ur.khan/${surahNumber}.mp3`;
    if (langCode === 'en') return `https://cdn.islamic.network/quran/audio-surah/128/en.walk/${surahNumber}.mp3`;
    if (langCode === 'fr') return `https://cdn.islamic.network/quran/audio-surah/128/fr.leclerc/${surahNumber}.mp3`;
    return `https://cdn.islamic.network/quran/audio-surah/128/en.walk/${surahNumber}.mp3`;
  };

  const filteredSurahs = surahsList.filter(s =>
    s.englishName.toLowerCase().includes(query.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(query.toLowerCase()) ||
    s.number.toString().includes(query)
  );

  const totalPages = Math.ceil(filteredSurahs.length / itemsPerPage) || 1;
  const displayedSurahs = filteredSurahs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title">
          <i className="fas fa-headphones" style={{ color: 'var(--accent-gold)' }}></i> Complete 114 Surahs MP3 & Audio Translations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Listen to complete 114 Surah recitations by top Qaris or play English & Urdu spoken audio translations directly.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '1.2rem', alignItems: 'center' }}>
        {/* Qari Selection */}
        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-user-alt"></i> Select Qari (Arabic Recitation):</span>
          <select
            className="filter-select"
            value={selectedQari}
            onChange={(e) => { setSelectedQari(e.target.value); setPage(1); }}
          >
            {QARIS.map(q => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-search"></i> Search Surah:</span>
          <input
            type="text"
            className="filter-input"
            placeholder="Search Surah name or number..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* 114 Surahs Grid */}
      {surahsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading 114 Surahs Audio...</p>
        </div>
      ) : (
        <div className="grid-3">
          {displayedSurahs.map((surah) => {
            const qariAudioUrl = getQariAudioUrl(surah.number, activeQariObj);
            const englishAudioUrl = getTranslationAudioUrl(surah.number, 'en');
            const urduAudioUrl = getTranslationAudioUrl(surah.number, 'ur');

            return (
              <div key={surah.number} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-header-badge">
                    <span className="surah-number-badge">{surah.number}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)', background: 'var(--accent-gold-light)', padding: '2px 10px', borderRadius: '12px' }}>
                      {surah.revelationType} &bull; {surah.numberOfAyahs} Verses
                    </span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">Surah {surah.englishName}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{surah.englishNameTranslation}</p>
                    <p className="arabic-font card-arabic">{surah.name}</p>
                    <p className="card-subtitle"><i className="fas fa-microphone"></i> {activeQariObj.name}</p>
                  </div>
                </div>

                <div className="card-footer" style={{ marginTop: '0.75rem' }}>
                  <button
                    className="btn-play"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => playTrack(qariAudioUrl, `Surah ${surah.englishName} (${surah.name})`, activeQariObj.name)}
                  >
                    <i className="fas fa-play"></i> Play Tilawat ({activeQariObj.name.split(' ')[0]})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
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
