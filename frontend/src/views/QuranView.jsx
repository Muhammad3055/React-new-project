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
  { id: 'hussary_mujawwad', name: 'Sheikh Mahmoud Khalil Al-Hussary (Mujawwad)', server: 'https://server13.mp3quran.net/hssr_mjwd/' },
  { id: 'basit', name: 'Qari Abdul Basit Abdul Samad (Murattal)', server: 'https://server7.mp3quran.net/basit/' },
  { id: 'basit_mujawwad', name: 'Qari Abdul Basit Abdul Samad (Mujawwad)', server: 'https://server7.mp3quran.net/basit_mjwd/' },
  { id: 'minshawi', name: 'Mohamed Siddiq El-Minshawi (Murattal)', server: 'https://server10.mp3quran.net/minsh/' },
  { id: 'minshawi_mujawwad', name: 'Mohamed Siddiq El-Minshawi (Mujawwad)', server: 'https://server10.mp3quran.net/minsh_mjwd/' },
  { id: 'shatri', name: 'Sheikh Abu Bakr Al-Shatri', server: 'https://server11.mp3quran.net/shatri/' },
  { id: 'rifai', name: 'Sheikh Hani Ar-Rifai', server: 'https://server8.mp3quran.net/href/' },
  { id: 'ajmi', name: 'Ahmed Al-Ajmi', server: 'https://server10.mp3quran.net/ajm/' },
  { id: 'abbad', name: 'Fares Abbad', server: 'https://server8.mp3quran.net/frs_a/' },
  { id: 'budair', name: 'Salah Al-Budair', server: 'https://server6.mp3quran.net/s_bud/' },
  { id: 'juhany', name: 'Abdullah Awad Al-Juhany', server: 'https://server13.mp3quran.net/jhn/' },
  { id: 'kurdi', name: 'Raad Al-Kurdi', server: 'https://server6.mp3quran.net/kurdi/' },
  { id: 'balushi', name: 'Hazza Al-Balushi', server: 'https://server6.mp3quran.net/hazza/' },
  { id: 'sufi', name: 'Abdul Rashid Ali Sufi', server: 'https://server16.mp3quran.net/sofi/a_sofi/' },
  { id: 'hudhaify', name: 'Ali Abdur-Rahman Al-Hudhaify', server: 'https://server9.mp3quran.net/hthfi/' },
  { id: 'ayyoub', name: 'Muhammad Ayyub', server: 'https://server8.mp3quran.net/ayyub/' },
  { id: 'jibreel', name: 'Muhammad Jibreel', server: 'https://server8.mp3quran.net/jbrl/' },
  { id: 'tablawi', name: 'Mohammad Al-Tablawi', server: 'https://server12.mp3quran.net/tblwi/' },
  { id: 'qatami', name: 'Nasser Al-Qatami', server: 'https://server6.mp3quran.net/qtm/' },
  { id: 'qahtani', name: 'Khaled Al-Qahtani', server: 'https://server10.mp3quran.net/qht/' },
  { id: 'basfar', name: 'Abdullah Basfar', server: 'https://server6.mp3quran.net/bsfr/' },
  { id: 'bukhatir', name: 'Salah Bukhatir', server: 'https://server8.mp3quran.net/bu_khtr/' },
  { id: 'akhdar', name: 'Ibrahim Al-Akhdar', server: 'https://server6.mp3quran.net/akhdr/' },
  { id: 'tunaiji', name: 'Khalifa Al-Tunaiji', server: 'https://server12.mp3quran.net/tnjg/' },
  { id: 'banna', name: 'Mahmoud Ali Al-Banna', server: 'https://server8.mp3quran.net/bna/' },
  { id: 'ismail', name: 'Mustafa Ismail', server: 'https://server8.mp3quran.net/mustafa/' },
  { id: 'neana', name: 'Ahmed Neana', server: 'https://server11.mp3quran.net/naana/' },
  { id: 'zahrani', name: 'Abdul Aziz Az-Zahrani', server: 'https://server9.mp3quran.net/zhrn/' },
  { id: 'ryyan', name: 'Adel Ryyan', server: 'https://server8.mp3quran.net/ryan/' },
  { id: 'farid', name: 'Hatem Farid Al-Waer', server: 'https://server11.mp3quran.net/hatem/' },
  { id: 'abkar', name: 'Idrees Abkar', server: 'https://server6.mp3quran.net/abkar/' },
  { id: 'jaleel', name: 'Khalid Al-Jaleel', server: 'https://server10.mp3quran.net/jlel/' },
  { id: 'nabil_rifai', name: 'Nabil Ar-Rifai', server: 'https://server9.mp3quran.net/nbl/' },
  { id: 'khalaf', name: 'Abdullah Khalaf', server: 'https://server14.mp3quran.net/khalaf/' },
  { id: 'alaqmi', name: 'Akram Al-Alaqmi', server: 'https://server9.mp3quran.net/akrm/' },
  { id: 'daghistani', name: 'Zaki Daghistani', server: 'https://server9.mp3quran.net/zaki/' }
];

export default function QuranView({ playTrack, user, navigateToTab }) {
  const [surahsList, setSurahsList] = useState([]);
  const [selectedQari, setSelectedQari] = useState('alafasy');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [offlineSurahs, setOfflineSurahs] = useState({});
  const itemsPerPage = 12;

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data.data) setSurahsList(data.data);
      })
      .catch(() => {});

    // Sync preferred Qari if user is logged in
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

    try {
      const storageKey = user ? `quranOfflineSurahs_user_${user.username}` : 'quranOfflineSurahs';
      const cached = localStorage.getItem(storageKey);
      if (cached) setOfflineSurahs(JSON.parse(cached));
    } catch (e) {}
  }, [user]);

  const activeQariObj = QARIS.find(q => q.id === selectedQari) || QARIS[0];

  const getQariAudioUrl = (surahNumber, qariObj) => {
    const padded = surahNumber < 10 ? `00${surahNumber}` : (surahNumber < 100 ? `0${surahNumber}` : `${surahNumber}`);
    return `${qariObj.server}${padded}.mp3`;
  };

  const handleSetFavoriteQari = (qariId) => {
    if (!user) {
      alert("Sign in to save your preferred Qari across devices!");
      return;
    }
    fetch('/api/user/preferences/update/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferred_qari: qariId })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || `Set ${activeQariObj.name} as your preferred Qari!`);
      });
  };

  const handleDownloadMp3 = (surahNumber, surahName, audioUrl) => {
    const storageKey = user ? `quranOfflineSurahs_user_${user.username}` : 'quranOfflineSurahs';
    const updated = { ...offlineSurahs };
    
    // Estimate size based on average surah length
    const approxSizeMb = parseFloat(((surahNumber * 0.4) + 3.5).toFixed(1));

    if (updated[surahNumber]) {
      delete updated[surahNumber];
      alert(`Removed Surah ${surahName} from local storage.`);
    } else {
      updated[surahNumber] = {
        number: surahNumber,
        name: surahName,
        qari: activeQariObj.name,
        sizeMb: approxSizeMb,
        downloadedAt: new Date().toLocaleDateString()
      };

      // Trigger browser file download
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `Surah_${surahNumber}_${surahName.replace(/\s+/g, '_')}_${activeQariObj.name.replace(/\s+/g, '_')}.mp3`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const userTag = user ? ` (Saved for User ID: ${user.username})` : '';
      alert(`Downloaded Surah ${surahName}! ${approxSizeMb} MB deducted from local storage${userTag}.`);
    }

    setOfflineSurahs(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const totalDeductedMb = Object.values(offlineSurahs).reduce((acc, curr) => acc + (curr.sizeMb || 4.5), 0).toFixed(1);

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
          <i className="fas fa-headphones" style={{ color: 'var(--accent-gold)' }}></i> Complete 114 Surahs MP3 & Audio Recitations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Listen to complete 114 Surah recitations by top Qaris, download MP3s directly to your User Account storage, or play spoken translations.
        </p>
      </div>

      {/* User Offline Storage Meter Banner */}
      {Object.keys(offlineSurahs).length > 0 && (
        <div style={{ background: 'linear-gradient(90deg, #022c22 0%, #064e3b 100%)', color: '#fff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid var(--accent-gold)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              <i className="fas fa-hdd"></i> {user ? `User Account (${user.username}) Offline Storage` : 'Local Offline Storage'}
            </h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem', color: '#cbd5e1' }}>
              <strong>{Object.keys(offlineSurahs).length} Surahs Downloaded</strong> &bull; <strong>{totalDeductedMb} MB Deducted</strong> from Local Device Storage
            </p>
          </div>

          {user && navigateToTab && (
            <button
              onClick={() => navigateToTab('dashboard')}
              className="btn-play"
              style={{ background: 'var(--accent-gold)', color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.8rem', padding: '0.45rem 1rem' }}
            >
              Manage Storage
            </button>
          )}
        </div>
      )}

      <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '1.2rem', alignItems: 'center' }}>
        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-user-alt"></i> Select Qari:</span>
          <select
            className="filter-select"
            value={selectedQari}
            onChange={(e) => { setSelectedQari(e.target.value); setPage(1); }}
          >
            {QARIS.map(q => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>

          {user && (
            <button
              onClick={() => handleSetFavoriteQari(selectedQari)}
              className="nav-action-btn"
              title="Set as My Default Preferred Qari"
              style={{ background: 'var(--accent-gold)', color: 'var(--primary-dark)', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 700 }}
            >
              <i className="fas fa-star"></i> Set Default
            </button>
          )}
        </div>

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

      {surahsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading 114 Surahs Audio...</p>
        </div>
      ) : (
        <div className="grid-3">
          {displayedSurahs.map((surah) => {
            const qariAudioUrl = getQariAudioUrl(surah.number, activeQariObj);
            const isDownloaded = !!offlineSurahs[surah.number];

            return (
              <div key={surah.number} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: isDownloaded ? '1.5px solid #10b981' : '1px solid #e2e8f0' }}>
                <div>
                  <div className="card-header-badge">
                    <span className="surah-number-badge">{surah.number}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)', background: 'var(--accent-gold-light)', padding: '2px 10px', borderRadius: '12px' }}>
                      {surah.revelationType} &bull; {surah.numberOfAyahs} Verses
                    </span>

                    {isDownloaded && (
                      <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                        <i className="fas fa-check-circle"></i> Offline
                      </span>
                    )}
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
                    onClick={() => handleDownloadMp3(surah.number, surah.englishName, qariAudioUrl)}
                    style={{ background: isDownloaded ? '#10b981' : 'var(--primary-emerald)', color: '#fff', padding: '0.55rem 0.9rem', fontSize: '0.9rem' }}
                  >
                    <i className="fas fa-download"></i>
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
