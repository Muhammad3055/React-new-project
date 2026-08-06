import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiCache';

export default function UserDashboardView({ user, openAuthModal, navigateToTab, playTrack }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('downloads'); // Default to Downloads section
  const [offlineSurahs, setOfflineSurahs] = useState({});
  const [allSurahs, setAllSurahs] = useState([]);
  const [downloadSearch, setDownloadSearch] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch user dashboard data
    fetch(getApiUrl('/api/user/dashboard/'))
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setDashboardData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch 114 Surahs for download catalog
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data.data) setAllSurahs(data.data);
      })
      .catch(() => {});

    // Sync user-specific offline storage
    try {
      const storageKey = `quranOfflineSurahs_user_${user.username}`;
      const cached = localStorage.getItem(storageKey) || localStorage.getItem('quranOfflineSurahs');
      if (cached) setOfflineSurahs(JSON.parse(cached));
    } catch (e) {}
  }, [user]);

  const handleToggleNamaz = (prayer) => {
    if (!user) return;
    fetch(getApiUrl('/api/user/namaz/toggle/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prayer })
    })
      .then(res => res.json())
      .then(() => {
        fetch(getApiUrl('/api/user/dashboard/'))
          .then(res => res.json())
          .then(data => setDashboardData(data));
      });
  };

  const handleSavePreferences = (newPrefs) => {
    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dashboardData?.preferences, ...newPrefs })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Preferences updated!');
        fetch(getApiUrl('/api/user/dashboard/'))
          .then(res => res.json())
          .then(d => setDashboardData(d));
      });
  };

  const toggleOfflineSurahDownload = (surahNumber, surahName) => {
    const storageKey = `quranOfflineSurahs_user_${user.username}`;
    const updated = { ...offlineSurahs };
    const approxSizeMb = parseFloat(((surahNumber * 0.35) + 3.2).toFixed(1));

    if (updated[surahNumber]) {
      delete updated[surahNumber];
      alert(`Removed Surah ${surahName} from User Portal storage.`);
    } else {
      const qariName = dashboardData?.preferences?.preferred_qari || 'Mishary Rashid Alafasy';
      updated[surahNumber] = {
        number: surahNumber,
        name: surahName,
        qari: qariName,
        sizeMb: approxSizeMb,
        downloadedAt: new Date().toLocaleDateString()
      };

      // Trigger MP3 audio file download
      const audioUrl = `https://server8.mp3quran.net/afs/${surahNumber < 10 ? `00${surahNumber}` : (surahNumber < 100 ? `0${surahNumber}` : `${surahNumber}`)}.mp3`;
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `Surah_${surahNumber}_${surahName.replace(/\s+/g, '_')}.mp3`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Downloaded Surah ${surahName}! ${approxSizeMb} MB deducted from device storage for User ID: ${user.username}.`);
    }

    setOfflineSurahs(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const totalDeductedMb = Object.values(offlineSurahs).reduce((acc, curr) => acc + (curr.sizeMb || 4.2), 0).toFixed(1);

  const filteredCatalogSurahs = allSurahs.filter(s =>
    s.englishName.toLowerCase().includes(downloadSearch.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(downloadSearch.toLowerCase()) ||
    s.number.toString().includes(downloadSearch)
  );

  if (!user) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '580px', margin: '0 auto', padding: '2.5rem', borderRadius: '20px', border: '1.5px solid var(--accent-gold)' }}>
          <i className="fas fa-user-lock fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
            User Portal & Downloads Vault
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Guest users can freely read and listen to Quran. Sign in to unlock your personal User Downloads Vault, offline MP3 storage manager, Namaz streak tracker, and Khatm Quran progress!
          </p>
          <button
            onClick={() => openAuthModal ? openAuthModal('login') : null}
            className="btn-play"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem', background: 'var(--primary-dark)', color: 'var(--accent-gold)', margin: '0 auto' }}
          >
            <i className="fas fa-sign-in-alt"></i> Sign In to User Portal
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
        <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Loading User Portal & Offline Storage...</p>
      </div>
    );
  }

  const prefs = dashboardData?.preferences || {};
  const namazDays = dashboardData?.namaz_days || [];
  const todayNamaz = namazDays[0] || {};

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      {/* Welcome Header */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)', color: '#fff', border: '1px solid var(--accent-gold)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)', margin: 0 }}>
              <i className="fas fa-user-circle"></i> User Portal & Downloads Vault
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '0.3rem' }}>
              Logged-in Account: <strong>{user.username}</strong> ({user.email}) &bull; Offline Storage Deducted: <strong>{totalDeductedMb} MB</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => navigateToTab('read')}
              className="btn-play"
              style={{ background: 'var(--accent-gold)', color: 'var(--primary-dark)', fontWeight: 800, padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
            >
              <i className="fas fa-book-open"></i> Resume Surah {prefs.last_read_surah || 1}:{prefs.last_read_ayah || 1}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', pb: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('downloads')}
          style={{ padding: '0.6rem 1.2rem', border: 'none', borderBottom: activeTab === 'downloads' ? '3px solid var(--accent-gold)' : 'none', background: 'transparent', fontWeight: 800, color: activeTab === 'downloads' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          <i className="fas fa-download"></i> User Downloads Vault ({Object.keys(offlineSurahs).length} Downloaded)
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          style={{ padding: '0.6rem 1.2rem', border: 'none', borderBottom: activeTab === 'tracker' ? '3px solid var(--accent-gold)' : 'none', background: 'transparent', fontWeight: 800, color: activeTab === 'tracker' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          <i className="fas fa-tasks"></i> Progress & Namaz Tracker
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          style={{ padding: '0.6rem 1.2rem', border: 'none', borderBottom: activeTab === 'bookmarks' ? '3px solid var(--accent-gold)' : 'none', background: 'transparent', fontWeight: 800, color: activeTab === 'bookmarks' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          <i className="fas fa-star"></i> Bookmarks & Notes ({dashboardData?.bookmarks?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          style={{ padding: '0.6rem 1.2rem', border: 'none', borderBottom: activeTab === 'preferences' ? '3px solid var(--accent-gold)' : 'none', background: 'transparent', fontWeight: 800, color: activeTab === 'preferences' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          <i className="fas fa-cog"></i> Account Preferences
        </button>
      </div>

      {/* TAB 1: DOWNLOADS VAULT */}
      {activeTab === 'downloads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Storage Summary Bar */}
          <div className="card" style={{ padding: '1.25rem', background: '#ecfdf5', borderRadius: '16px', border: '1.5px solid #a7f3d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#065f46' }}>
                  <i className="fas fa-hdd" style={{ marginRight: '0.4rem' }}></i> Device Offline Storage for User: {user.username}
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#047857' }}>
                  Total <strong>{Object.keys(offlineSurahs).length} Surahs Saved</strong> &bull; <strong>{totalDeductedMb} MB Storage Deducted</strong>
                </p>
              </div>

              <div style={{ maxWidth: '320px', flex: 1 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Filter 114 Surahs to download..."
                  value={downloadSearch}
                  onChange={(e) => setDownloadSearch(e.target.value)}
                  style={{ padding: '0.45rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* 114 Surahs Download Catalog */}
          <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem' }}>
              <i className="fas fa-music" style={{ color: 'var(--accent-gold)' }}></i> Complete 114 Surahs MP3 Offline Downloads
            </h3>

            <div className="grid-3" style={{ gap: '1rem' }}>
              {filteredCatalogSurahs.slice(0, 30).map((surah) => {
                const isDownloaded = !!offlineSurahs[surah.number];
                const itemData = offlineSurahs[surah.number] || {};
                const audioUrl = `https://server8.mp3quran.net/afs/${surah.number < 10 ? `00${surah.number}` : (surah.number < 100 ? `0${surah.number}` : `${surah.number}`)}.mp3`;

                return (
                  <div key={surah.number} style={{ padding: '1rem', border: isDownloaded ? '1.5px solid #10b981' : '1px solid #e2e8f0', borderRadius: '14px', background: isDownloaded ? '#f0fdf4' : '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, background: 'var(--accent-gold)', color: 'var(--primary-dark)', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          {surah.number}
                        </span>
                        {isDownloaded && (
                          <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                            <i className="fas fa-check-circle"></i> Downloaded
                          </span>
                        )}
                      </div>

                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Surah {surah.englishName}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.1rem 0 0.5rem 0' }}>{surah.englishNameTranslation} &bull; {surah.numberOfAyahs} Ayahs</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
                      <button
                        onClick={() => playTrack ? playTrack(audioUrl, `Surah ${surah.englishName}`, 'Mishary Rashid Alafasy') : null}
                        className="btn-play"
                        style={{ flex: 1, justifyContent: 'center', padding: '0.45rem 0.5rem', fontSize: '0.78rem' }}
                      >
                        <i className="fas fa-play"></i> Play
                      </button>

                      <button
                        onClick={() => toggleOfflineSurahDownload(surah.number, surah.englishName)}
                        className="btn-play"
                        title={isDownloaded ? "Remove from device storage" : "Download MP3 to device"}
                        style={{ background: isDownloaded ? '#dc2626' : 'var(--primary-emerald)', color: '#fff', padding: '0.45rem 0.8rem', fontSize: '0.78rem' }}
                      >
                        <i className={`fas ${isDownloaded ? 'fa-trash' : 'fa-download'}`}></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROGRESS & NAMAZ TRACKER */}
      {activeTab === 'tracker' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Daily 5 Namaz Tracker Card */}
          <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                <i className="fas fa-pray" style={{ color: 'var(--accent-gold)' }}></i> Daily 5 Namaz Tracker
              </h3>
              <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#b45309', fontWeight: 800, padding: '3px 10px', borderRadius: '12px' }}>
                🔥 {dashboardData?.namaz_streak || 0} Day Streak
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Mark your 5 daily prayers for today ({todayNamaz.date || 'Today'}):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => (
                <label key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.9rem', background: todayNamaz[p] ? '#ecfdf5' : '#f8fafc', borderRadius: '10px', border: todayNamaz[p] ? '1px solid #10b981' : '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'capitalize', color: todayNamaz[p] ? '#065f46' : '#334155' }}>
                    {p === 'fajr' && '🌅 Fajr'}
                    {p === 'dhuhr' && '☀️ Dhuhr'}
                    {p === 'asr' && '🌤️ Asr'}
                    {p === 'maghrib' && '🌆 Maghrib'}
                    {p === 'isha' && '🌙 Isha'}
                  </span>
                  <input
                    type="checkbox"
                    checked={!!todayNamaz[p]}
                    onChange={() => handleToggleNamaz(p)}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Quran Khatm Tracker Card */}
          <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              <i className="fas fa-book-reader" style={{ color: 'var(--accent-gold)' }}></i> Quran Khatm Completion
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                <span>Completed Surahs</span>
                <span>{prefs.completed_surahs?.length || 0} / 114 Surahs ({prefs.khatm_percent || 0}%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${prefs.khatm_percent || 0}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-gold) 0%, #10b981 100%)' }}></div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Target pace: <strong>{prefs.khatm_target_days || 30} Days Khatm</strong> (Approx. {Math.ceil(114 / (prefs.khatm_target_days || 30))} Surahs per day).
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKMARKS & NOTES */}
      {activeTab === 'bookmarks' && (
        <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem' }}>
            <i className="fas fa-bookmark" style={{ color: 'var(--accent-gold)' }}></i> My Saved Bookmarks & Ayah Reflections
          </h3>

          {(!dashboardData?.bookmarks || dashboardData.bookmarks.length === 0) ? (
            <p style={{ color: 'var(--text-muted)' }}>No bookmarks saved yet. Click the star icon on any Ayah to save it!</p>
          ) : (
            <div className="grid-2" style={{ gap: '1rem' }}>
              {dashboardData.bookmarks.map((bm, i) => (
                <div key={i} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-dark)' }}>Surah {bm.surah_number} (Ayah {bm.ayah_number})</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Saved on {bm.created_at}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
            <i className="fas fa-sliders-h" style={{ color: 'var(--accent-gold)' }}></i> Personal Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>Preferred Qari Reciter</label>
              <select
                className="form-input"
                value={prefs.preferred_qari || 'ar.alafasy'}
                onChange={(e) => handleSavePreferences({ preferred_qari: e.target.value })}
                style={{ marginTop: '0.3rem' }}
              >
                <option value="ar.alafasy">Mishary Rashid Alafasy</option>
                <option value="ar.sudais">Sheikh Abdul Rahman Al-Sudais</option>
                <option value="ar.ghamdi">Saad Al-Ghamdi</option>
                <option value="ar.mahermuaiqly">Sheikh Maher Al-Muaiqly</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>Preferred Translation Language</label>
              <select
                className="form-input"
                value={prefs.preferred_language || 'ur'}
                onChange={(e) => handleSavePreferences({ preferred_language: e.target.value })}
                style={{ marginTop: '0.3rem' }}
              >
                <option value="ur">Urdu (اردو)</option>
                <option value="en">English</option>
                <option value="br">Brahui (براہوئی)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
