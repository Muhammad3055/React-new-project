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
  { id: 'basit', name: 'Qari Abdul Basit Abdul Samad (Murattal)', server: 'https://server7.mp3quran.net/basit/' },
  { id: 'minshawi', name: 'Mohamed Siddiq El-Minshawi (Murattal)', server: 'https://server10.mp3quran.net/minsh/' },
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

export default function QuranView({ playTrack, user, navigateToTab, initialSubCategory = 'quran_arabic' }) {
  const [subCategory, setSubCategory] = useState(initialSubCategory); // 'quran_arabic' | 'taqreer_arabic' | 'taqreer_brahui' | 'taqreer_urdu'
  
  // Quran Tilawat states
  const [surahsList, setSurahsList] = useState([]);
  const [selectedQari, setSelectedQari] = useState('alafasy');
  const [quranQuery, setQuranQuery] = useState('');
  const [quranPage, setQuranPage] = useState(1);

  // Taqreer Audio states
  const [taqreers, setTaqreers] = useState([]);
  const [taqreerQuery, setTaqreerQuery] = useState('');
  const [loadingTaqreers, setLoadingTaqreers] = useState(false);

  const itemsPerPage = 12;

  useEffect(() => {
    // Load Quran Surahs
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data.data) setSurahsList(data.data);
      })
      .catch(() => {});

    // Sync preferred Qari if logged in
    if (user) {
      fetch('/api/user/dashboard/')
        .then(res => res.json())
        .then(d => {
          if (d?.preferences?.preferred_qari) {
            setSelectedQari(d.preferences.preferred_qari);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Load Taqreers when subCategory changes to a Taqreer section
  useEffect(() => {
    if (subCategory.startsWith('taqreer_')) {
      const lang = subCategory.replace('taqreer_', '');
      setLoadingTaqreers(true);
      fetch(`/api/taqreer/?language=${lang}&q=${encodeURIComponent(taqreerQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (data.results) {
            setTaqreers(data.results);
          } else {
            setTaqreers([]);
          }
        })
        .catch(() => {
          setTaqreers([]);
        })
        .finally(() => setLoadingTaqreers(false));
    }
  }, [subCategory, taqreerQuery]);

  const activeQariObj = QARIS.find(q => q.id === selectedQari) || QARIS[0];

  const getQariAudioUrl = (surahNumber, qariObj) => {
    const padded = surahNumber < 10 ? `00${surahNumber}` : (surahNumber < 100 ? `0${surahNumber}` : `${surahNumber}`);
    return `${qariObj.server}${padded}.mp3`;
  };

  const handleDownloadMp3 = (title, audioUrl) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${title.replace(/\s+/g, '_')}.mp3`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Started downloading MP3: ${title}`);
  };

  const filteredSurahs = surahsList.filter(s =>
    s.englishName.toLowerCase().includes(quranQuery.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(quranQuery.toLowerCase()) ||
    s.number.toString().includes(quranQuery)
  );

  const totalQuranPages = Math.ceil(filteredSurahs.length / itemsPerPage) || 1;
  const displayedSurahs = filteredSurahs.slice((quranPage - 1) * itemsPerPage, quranPage * itemsPerPage);

  return (
    <div className="container">
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">
          <i className="fas fa-headphones-alt" style={{ color: 'var(--accent-gold)' }}></i> Audio MP3 Portal & Recitations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.4rem', maxWidth: '750px', margin: '0.4rem auto 0' }}>
          Explore complete Quranic MP3 recitations by renowned Qaris or listen to Islamic Taqreers & voice notes in Arabic, Brahui, and Urdu.
        </p>
      </div>

      {/* 4 Primary Sub-Page Category Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <button
          onClick={() => setSubCategory('quran_arabic')}
          style={{
            padding: '1.2rem 1rem',
            borderRadius: '16px',
            border: subCategory === 'quran_arabic' ? '2px solid var(--accent-gold)' : '1px solid rgba(226, 232, 240, 0.8)',
            background: subCategory === 'quran_arabic' ? 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' : 'var(--bg-card)',
            color: subCategory === 'quran_arabic' ? '#ffffff' : 'var(--text-main)',
            boxShadow: subCategory === 'quran_arabic' ? '0 10px 25px -5px rgba(217, 119, 6, 0.4)' : '0 4px 12px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <i className="fas fa-quran" style={{ fontSize: '1.8rem', color: subCategory === 'quran_arabic' ? 'var(--accent-gold)' : 'var(--primary-emerald)' }}></i>
          <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>MP3 Voice Quran in Arabic</span>
          <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>45+ Renowned Qaris & 114 Surahs</span>
        </button>

        <button
          onClick={() => setSubCategory('taqreer_arabic')}
          style={{
            padding: '1.2rem 1rem',
            borderRadius: '16px',
            border: subCategory === 'taqreer_arabic' ? '2px solid var(--accent-gold)' : '1px solid rgba(226, 232, 240, 0.8)',
            background: subCategory === 'taqreer_arabic' ? 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' : 'var(--bg-card)',
            color: subCategory === 'taqreer_arabic' ? '#ffffff' : 'var(--text-main)',
            boxShadow: subCategory === 'taqreer_arabic' ? '0 10px 25px -5px rgba(217, 119, 6, 0.4)' : '0 4px 12px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <i className="fas fa-microphone-alt" style={{ fontSize: '1.8rem', color: subCategory === 'taqreer_arabic' ? 'var(--accent-gold)' : 'var(--primary-emerald)' }}></i>
          <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Taqreer Arabic (تقارير عربية)</span>
          <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>Arabic Speeches & Reminders</span>
        </button>

        <button
          onClick={() => setSubCategory('taqreer_brahui')}
          style={{
            padding: '1.2rem 1rem',
            borderRadius: '16px',
            border: subCategory === 'taqreer_brahui' ? '2px solid var(--accent-gold)' : '1px solid rgba(226, 232, 240, 0.8)',
            background: subCategory === 'taqreer_brahui' ? 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' : 'var(--bg-card)',
            color: subCategory === 'taqreer_brahui' ? '#ffffff' : 'var(--text-main)',
            boxShadow: subCategory === 'taqreer_brahui' ? '0 10px 25px -5px rgba(217, 119, 6, 0.4)' : '0 4px 12px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <i className="fas fa-bullhorn" style={{ fontSize: '1.8rem', color: subCategory === 'taqreer_brahui' ? 'var(--accent-gold)' : 'var(--primary-emerald)' }}></i>
          <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Taqreer Brahui (تقارير براہوئی)</span>
          <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>Brahui Islamic Voice Notes</span>
        </button>

        <button
          onClick={() => setSubCategory('taqreer_urdu')}
          style={{
            padding: '1.2rem 1rem',
            borderRadius: '16px',
            border: subCategory === 'taqreer_urdu' ? '2px solid var(--accent-gold)' : '1px solid rgba(226, 232, 240, 0.8)',
            background: subCategory === 'taqreer_urdu' ? 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' : 'var(--bg-card)',
            color: subCategory === 'taqreer_urdu' ? '#ffffff' : 'var(--text-main)',
            boxShadow: subCategory === 'taqreer_urdu' ? '0 10px 25px -5px rgba(217, 119, 6, 0.4)' : '0 4px 12px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <i className="fas fa-volume-up" style={{ fontSize: '1.8rem', color: subCategory === 'taqreer_urdu' ? 'var(--accent-gold)' : 'var(--primary-emerald)' }}></i>
          <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Taqreer Urdu (تقارير اردو)</span>
          <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>Urdu Lectures & Bayans</span>
        </button>
      </div>

      {/* CATEGORY 1: MP3 Voice Quran in Arabic */}
      {subCategory === 'quran_arabic' && (
        <div>
          <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '1.2rem', alignItems: 'center' }}>
            <div className="filter-group">
              <span className="filter-label"><i className="fas fa-user-alt"></i> Select Qari Voice:</span>
              <select
                className="filter-select"
                value={selectedQari}
                onChange={(e) => { setSelectedQari(e.target.value); setQuranPage(1); }}
              >
                {QARIS.map(q => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label"><i className="fas fa-search"></i> Search Surah:</span>
              <input
                type="text"
                className="filter-input"
                placeholder="Search Surah name or number..."
                value={quranQuery}
                onChange={(e) => { setQuranQuery(e.target.value); setQuranPage(1); }}
              />
            </div>
          </div>

          {surahsList.length === 0 ? (
            <div className="grid-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-line-short skeleton-shimmer"></div>
                  <div className="skeleton-line-title skeleton-shimmer"></div>
                  <div className="skeleton-line skeleton-shimmer"></div>
                  <div className="skeleton-line skeleton-shimmer" style={{ width: '75%' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {displayedSurahs.map((surah) => {
                const qariAudioUrl = getQariAudioUrl(surah.number, activeQariObj);
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

                    <div className="card-footer" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-play"
                        style={{ flex: 1, justifyContent: 'center' }}
                        onClick={() => playTrack(qariAudioUrl, `Surah ${surah.englishName} (${surah.name})`, activeQariObj.name)}
                      >
                        <i className="fas fa-play"></i> Play Tilawat
                      </button>

                      <button
                        className="btn-play"
                        title="Download MP3 Audio"
                        onClick={() => handleDownloadMp3(`Surah_${surah.number}_${surah.englishName}`, qariAudioUrl)}
                        style={{ background: 'var(--primary-emerald)', color: '#fff', padding: '0.55rem 0.9rem', fontSize: '0.9rem' }}
                      >
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quran Pagination */}
          {totalQuranPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '2.5rem 0' }}>
              <button className="btn-play" disabled={quranPage <= 1} onClick={() => setQuranPage(quranPage - 1)} style={{ opacity: quranPage <= 1 ? 0.5 : 1 }}>
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Page {quranPage} of {totalQuranPages}</span>
              <button className="btn-play" disabled={quranPage >= totalQuranPages} onClick={() => setQuranPage(quranPage + 1)} style={{ opacity: quranPage >= totalQuranPages ? 0.5 : 1 }}>
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES 2, 3, 4: Taqreer Audio Voice Notes (Arabic, Brahui, Urdu) */}
      {subCategory.startsWith('taqreer_') && (
        <div>
          <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
            <div className="filter-group" style={{ flex: 1 }}>
              <span className="filter-label"><i className="fas fa-search"></i> Search Taqreer MP3:</span>
              <input
                type="text"
                className="filter-input"
                placeholder={`Search ${subCategory.replace('taqreer_', '').toUpperCase()} Taqreers by title or speaker...`}
                value={taqreerQuery}
                onChange={(e) => setTaqreerQuery(e.target.value)}
              />
            </div>
          </div>

          {loadingTaqreers ? (
            <div className="grid-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-line-short skeleton-shimmer"></div>
                  <div className="skeleton-line-title skeleton-shimmer"></div>
                  <div className="skeleton-line skeleton-shimmer"></div>
                  <div className="skeleton-line skeleton-shimmer" style={{ width: '80%' }}></div>
                </div>
              ))}
            </div>
          ) : taqreers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid rgba(226,232,240,0.8)' }}>
              <i className="fas fa-microphone-slash fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
              <h3>No MP3 Taqreer audio found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Be the first to add or upload Taqreers in this language category!</p>
            </div>
          ) : (
            <div className="grid-2">
              {taqreers.map((item) => (
                <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{
                        background: 'var(--accent-gold-light)',
                        color: 'var(--primary-dark)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        textTransform: 'uppercase'
                      }}>
                        <i className="fas fa-bullhorn"></i> {item.language} MP3
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <i className="far fa-clock"></i> {item.duration}
                      </span>
                    </div>

                    <h3 className="card-title" style={{ fontSize: '1.15rem', lineHeight: '1.4' }}>{item.title}</h3>
                    <p style={{ fontWeight: 600, color: 'var(--primary-emerald)', margin: '0.3rem 0 0.6rem 0', fontSize: '0.92rem' }}>
                      <i className="fas fa-user-tie"></i> {item.speaker}
                    </p>
                    {item.description && (
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.description}</p>
                    )}
                  </div>

                  <div className="card-footer" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-play"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => playTrack(item.audio_url, item.title, item.speaker)}
                    >
                      <i className="fas fa-play"></i> Play Taqreer Voice Note
                    </button>

                    <button
                      className="btn-play"
                      title="Download MP3 Voice Note"
                      onClick={() => handleDownloadMp3(item.title, item.audio_url)}
                      style={{ background: 'var(--primary-emerald)', color: '#fff', padding: '0.55rem 0.9rem', fontSize: '0.9rem' }}
                    >
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
