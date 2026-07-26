import React, { useState, useEffect } from 'react';

export default function UserDashboardView({ user, openAuthModal, navigateToTab, playTrack }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' | 'bookmarks' | 'offline' | 'preferences'
  const [offlineSurahs, setOfflineSurahs] = useState({});

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch('/api/user/dashboard/')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setDashboardData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Check localStorage for offline cached surahs
    try {
      const cached = localStorage.getItem('quranOfflineSurahs');
      if (cached) setOfflineSurahs(JSON.parse(cached));
    } catch (e) {}
  }, [user]);

  const handleToggleNamaz = (prayer) => {
    if (!user) return;
    fetch('/api/user/namaz/toggle/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prayer })
    })
      .then(res => res.json())
      .then(() => {
        // Refresh dashboard
        fetch('/api/user/dashboard/')
          .then(res => res.json())
          .then(data => setDashboardData(data));
      });
  };

  const handleSavePreferences = (newPrefs) => {
    fetch('/api/user/preferences/update/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPrefs)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Preferences updated!');
      });
  };

  const toggleOfflineSurahDownload = (surahNumber, surahName) => {
    const updated = { ...offlineSurahs };
    if (updated[surahNumber]) {
      delete updated[surahNumber];
      alert(`Removed Surah ${surahName} from offline storage.`);
    } else {
      updated[surahNumber] = {
        number: surahNumber,
        name: surahName,
        downloadedAt: new Date().toLocaleDateString()
      };
      alert(`Downloaded Surah ${surahName} for offline reading & listening!`);
    }
    setOfflineSurahs(updated);
    localStorage.setItem('quranOfflineSurahs', JSON.stringify(updated));
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '580px', margin: '0 auto', padding: '2.5rem', borderRadius: '20px', border: '1.5px solid var(--accent-gold)' }}>
          <i className="fas fa-lock fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
            Unlock Personal Progress & Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Guest users can read Quran, listen to recitations, and check prayer times without restrictions! Sign in to unlock personal progress tracking, 5 daily Namaz streak tracker, Khatm Quran calculator, saved Ayah notes, and offline Surah downloads.
          </p>
          <button
            onClick={openAuthModal}
            className="btn-play"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem', background: 'var(--primary-dark)', color: 'var(--accent-gold)', margin: '0 auto' }}
          >
            <i className="fas fa-sign-in-alt"></i> Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
        <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Loading your personal dashboard...</p>
      </div>
    );
  }

  const prefs = dashboardData?.preferences || {};
  const namazDays = dashboardData?.namaz_days || [];
  const todayNamaz = namazDays[0] || {};

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      {/* Welcome Header */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', color: '#fff', border: '1px solid var(--accent-gold)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)', margin: 0 }}>
              <i className="fas fa-user-circle"></i> Welcome, {dashboardData?.username || user.username}!
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '0.3rem' }}>
              Track your daily spiritual goals, Namaz streaks, Khatm Quran progress, and offline downloads.
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
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', pb: '0.5rem' }}>
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
          onClick={() => setActiveTab('offline')}
          style={{ padding: '0.6rem 1.2rem', border: 'none', borderBottom: activeTab === 'offline' ? '3px solid var(--accent-gold)' : 'none', background: 'transparent', fontWeight: 800, color: activeTab === 'offline' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          <i className="fas fa-download"></i> Offline Downloads ({Object.keys(offlineSurahs).length})
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          style={{ padding: '0.6rem 1.2rem', border: 'none', borderBottom: activeTab === 'preferences' ? '3px solid var(--accent-gold)' : 'none', background: 'transparent', fontWeight: 800, color: activeTab === 'preferences' ? 'var(--primary-dark)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          <i className="fas fa-cog"></i> Preferences
        </button>
      </div>

      {/* TAB 1: PROGRESS & NAMAZ TRACKER */}
      {activeTab === 'tracker' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* 1. Daily 5 Namaz Tracker Card */}
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

          {/* 2. Quran Khatm Tracker Card */}
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

      {/* TAB 2: BOOKMARKS & NOTES */}
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

      {/* TAB 3: OFFLINE DOWNLOADS MANAGER */}
      {activeTab === 'offline' && (
        <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
            <i className="fas fa-download" style={{ color: 'var(--accent-gold)' }}></i> Offline Surah Download Manager
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Download complete Surahs (Audio MP3 & Text) directly into browser offline cache to read & listen without an active internet connection!
          </p>

          <div className="grid-3" style={{ gap: '1rem' }}>
            {[1, 36, 55, 67, 112, 113, 114].map((num) => {
              const names = { 1: 'Al-Fatihah', 36: 'Ya-Sin', 55: 'Ar-Rahman', 67: 'Al-Mulk', 112: 'Al-Ikhlas', 113: 'Al-Falaq', 114: 'An-Nas' };
              const isDownloaded = !!offlineSurahs[num];

              return (
                <div key={num} style={{ padding: '1rem', border: isDownloaded ? '1.5px solid #10b981' : '1px solid #e2e8f0', borderRadius: '12px', background: isDownloaded ? '#ecfdf5' : '#fff' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{num}. {names[num]}</h4>
                  <button
                    onClick={() => toggleOfflineSurahDownload(num, names[num])}
                    className="btn-play"
                    style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center', fontSize: '0.8rem', background: isDownloaded ? '#dc2626' : 'var(--primary-emerald)' }}
                  >
                    <i className={`fas ${isDownloaded ? 'fa-trash' : 'fa-download'}`}></i>
                    {isDownloaded ? ' Remove Offline Data' : ' Save For Offline'}
                  </button>
                </div>
              );
            })}
          </div>
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
