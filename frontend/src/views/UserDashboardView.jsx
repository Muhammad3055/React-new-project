import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiCache';

export default function UserDashboardView({ user, openAuthModal, navigateToTab, playTrack }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'quran' | 'audio' | 'namaz' | 'duas' | 'achievements' | 'calendar' | 'preferences'
  const [offlineSurahs, setOfflineSurahs] = useState({});
  const [allSurahs, setAllSurahs] = useState([]);
  const [downloadSearch, setDownloadSearch] = useState('');
  const [currentTheme, setCurrentTheme] = useState('dark'); // 'dark' | 'light' | 'paper' | 'emerald' | 'kaaba'

  // Daily Islamic Quotes & Verses
  const dailyVerse = {
    surah: "Surah Ash-Sharh (94:5-6)",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    note: "Patience and trust in Allah bring victory and peace to every heart."
  };

  const dailyHadith = {
    book: "Sahih al-Bukhari 1",
    arabic: "إنَّما الأعْمالُ بالنِّيَّاتِ، وإنَّما لِكُلِّ امْرِئٍ ما نَوَى",
    translation: "Actions are judged by intentions, and every person will get what they intended.",
    grade: "Sahih (Muttafaq 'Alayh)"
  };

  const dailyDua = {
    title: "Dua for Increase in Knowledge & Wisdom",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi Zidni 'Ilma",
    translation: "O my Lord, Increase me in Knowledge.",
    source: "Surah Taha (20:114)"
  };

  // Morning/Evening Adhkar Checklist
  const [adhkarState, setAdhkarState] = useState({
    subhanAllah: 0,
    alhamdulillah: 0,
    allahuAkbar: 0,
    astaghfirullah: 0
  });

  const incrementAdhkar = (key, max = 33) => {
    setAdhkarState(prev => ({
      ...prev,
      [key]: prev[key] >= max ? 0 : prev[key] + 1
    }));
  };

  const [qadaFasts, setQadaFasts] = useState(() => {
    return parseInt(localStorage.getItem('maktaba_qada_fasts') || '0', 10);
  });

  const [reflections, setReflections] = useState(() => {
    return JSON.parse(localStorage.getItem('maktaba_user_reflections') || '[]');
  });

  const updateQada = (delta) => {
    const nextVal = Math.max(0, qadaFasts + delta);
    setQadaFasts(nextVal);
    localStorage.setItem('maktaba_qada_fasts', nextVal.toString());
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch user dashboard data from API
    fetch(getApiUrl('/api/user/dashboard/'))
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setDashboardData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch 114 Surahs for Quran & Download catalog
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
      alert(`Removed Surah ${surahName} from User Vault.`);
    } else {
      const qariName = dashboardData?.preferences?.preferred_qari || 'Mishary Rashid Alafasy';
      updated[surahNumber] = {
        number: surahNumber,
        name: surahName,
        qari: qariName,
        sizeMb: approxSizeMb,
        downloadedAt: new Date().toLocaleDateString()
      };

      const audioUrl = `https://server8.mp3quran.net/afs/${surahNumber < 10 ? `00${surahNumber}` : (surahNumber < 100 ? `0${surahNumber}` : `${surahNumber}`)}.mp3`;
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `Surah_${surahNumber}_${surahName.replace(/\s+/g, '_')}.mp3`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Downloaded Surah ${surahName}! ${approxSizeMb} MB saved for offline playback.`);
    }

    setOfflineSurahs(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const totalDeductedMb = Object.values(offlineSurahs).reduce((acc, curr) => acc + (curr.sizeMb || 4.2), 0).toFixed(1);

  const filteredCatalogSurahs = allSurahs.filter(s => {
    if (!s) return false;
    const q = (downloadSearch || '').trim().toLowerCase();
    if (!q) return true;
    const eng = (s.englishName || s.surah_name_english || '').toLowerCase();
    const trans = (s.englishNameTranslation || s.translation || '').toLowerCase();
    const arab = (s.name || s.surah_name_arabic || '').toLowerCase();
    const num = (s.number || s.surah_number || '').toString();
    return eng.includes(q) || trans.includes(q) || arab.includes(q) || num.includes(q);
  });

  // Time-based Islamic Greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Sabah al-Khair 🌅 (Good Morning)' : hour < 17 ? 'Masa’ al-Khair ☀️ (Good Afternoon)' : 'Assalamu Alaikum 🌙 (Good Evening)';

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem', borderRadius: '24px', border: '2px solid var(--accent-gold)', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', color: '#fff' }}>
          <i className="fas fa-user-lock fa-4x" style={{ color: 'var(--accent-gold)', marginBottom: '1.25rem' }}></i>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
            Personal Islamic Portal & Dashboard
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Guests can freely read Quran, Hadith, Tafseer & listen to Qaris. Sign in to unlock your personal Islamic Profile, Namaz Streak Tracker, Reading Badges, XP Points, and Offline MP3 Vault!
          </p>
          <button
            onClick={() => openAuthModal ? openAuthModal('login') : null}
            className="btn-play"
            style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem', background: 'var(--accent-gold)', color: '#022c22', fontWeight: 800, margin: '0 auto', borderRadius: '30px' }}
          >
            <i className="fas fa-sign-in-alt"></i> Sign In to Your Islamic Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
        <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Loading Your Personalized Islamic Experience...</p>
      </div>
    );
  }

  const prefs = dashboardData?.preferences || {};
  const namazDays = dashboardData?.namaz_days || [];
  const todayNamaz = namazDays[0] || {};
  const completedNamazCount = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].filter(p => todayNamaz[p]).length;

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      
      {/* 🌟 HERO DASHBOARD HEADER */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', color: '#fff', border: '2px solid var(--accent-gold)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {timeGreeting}
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0' }}>
              Assalamu Alaikum, {user.full_name || user.username}! 🕌
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              📅 <strong>Friday, 22 Safar 1448 AH</strong> &bull; 7 August 2026 &bull; 📍 Makkah Standard Time
            </p>
          </div>

          {/* User Stat Badges (Duolingo Style XP & Streaks) */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(245,158,11,0.2)', border: '1.5px solid var(--accent-gold)', padding: '0.5rem 1rem', borderRadius: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'block' }}>READING STREAK</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>🔥 {dashboardData?.namaz_streak || 7} Days</strong>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.2)', border: '1.5px solid #10b981', padding: '0.5rem 1rem', borderRadius: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'block' }}>SPIRITUAL XP</span>
              <strong style={{ fontSize: '1.2rem', color: '#34d399' }}>⭐ 850 XP (Lvl 5)</strong>
            </div>

            <button
              onClick={() => navigateToTab('read')}
              style={{ background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '16px', fontWeight: 800, padding: '0.75rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
            >
              <i className="fas fa-book-open"></i> Resume Surah {prefs.last_read_surah || 1}:{prefs.last_read_ayah || 1}
            </button>
          </div>
        </div>
      </div>

      {/* 📌 NOTION-STYLE DASHBOARD SUB-NAVIGATION */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: '🏠 Today\'s Overview', icon: 'fas fa-home' },
          { id: 'reflections', label: '✍️ My Reflections Journal', icon: 'fas fa-pen-nib' },
          { id: 'quran', label: '📖 Quran & Reading Vault', icon: 'fas fa-quran' },
          { id: 'audio', label: '🎧 Audio & Downloads (' + Object.keys(offlineSurahs).length + ')', icon: 'fas fa-headphones' },
          { id: 'namaz', label: '🕌 Prayer & Fasting Log (' + completedNamazCount + '/5)', icon: 'fas fa-pray' },
          { id: 'duas', label: '🤲 Daily Adhkar & Tasbeeh', icon: 'fas fa-hands' },
          { id: 'achievements', label: '⭐ Badges & Level', icon: 'fas fa-trophy' },
          { id: 'calendar', label: '📅 Islamic Calendar & Ramadan', icon: 'fas fa-calendar-alt' },
          { id: 'preferences', label: '⚙️ Settings & Theme', icon: 'fas fa-cog' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.65rem 1.2rem',
                borderRadius: '20px',
                border: 'none',
                background: isActive ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
                color: isActive ? '#022c22' : '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <i className={tab.icon}></i> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ✍️ TAB: MY REFLECTIONS JOURNAL */}
      {/* ========================================================================= */}
      {activeTab === 'reflections' && (
        <div className="card" style={{ padding: '2rem', background: '#09090b', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.4)', color: '#fff' }}>
          <h2 style={{ color: '#f59e0b', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-pen-nib"></i> My Tadabbur Personal Reflections & Notes ({reflections.length})
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Private notes and spiritual reflections attached to Ayahs while reading the Holy Quran.
          </p>

          {reflections.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', background: '#18181b', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.15)' }}>
              <i className="fas fa-edit fa-3x" style={{ color: '#f59e0b', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#e2e8f0', margin: '0 0 0.5rem 0' }}>No Reflections Saved Yet</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Go to "Read Quran" view and click the pen icon (✍️) next to any Ayah to save your personal reflections here!
              </p>
              <button onClick={() => navigateToTab('read')} style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: 700, borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
                Open Quran Reader ▶
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {reflections.map((item) => (
                <div key={item.id} style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                      Surah {item.surahName} [{item.surah}:{item.ayah}]
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{item.date}</span>
                  </div>
                  <p className="arabic-font" style={{ fontSize: '1.15rem', color: '#6ee7b7', direction: 'rtl', margin: '0.5rem 0', background: '#09090b', padding: '0.6rem', borderRadius: '8px' }}>
                    {item.textArabic}
                  </p>
                  <p style={{ color: '#f8fafc', fontSize: '0.95rem', margin: '0.75rem 0 0 0', lineHeight: '1.5', background: 'rgba(245,158,11,0.08)', padding: '0.75rem', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
                    💭 <strong>Reflection:</strong> {item.note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏠 TAB 1: TODAY'S OVERVIEW (Daily Verse, Hadith, Prayer Times, Qibla) */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Daily 3-Grid: Verse, Hadith & Dua */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            
            {/* Daily Quran Verse */}
            <div className="card" style={{ padding: '1.5rem', background: '#064e3b', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.4)', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, background: 'rgba(245,158,11,0.2)', color: 'var(--accent-gold)', padding: '3px 10px', borderRadius: '12px' }}>
                  📖 DAILY QURAN VERSE
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{dailyVerse.surah}</span>
              </div>
              <p style={{ fontSize: '1.3rem', fontFamily: "'Amiri', serif", color: 'var(--accent-gold)', direction: 'rtl', textAlign: 'right', margin: '0.75rem 0', lineHeight: '1.8' }}>
                {dailyVerse.arabic}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.5', margin: '0 0 0.75rem 0' }}>
                "{dailyVerse.translation}"
              </p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                💡 Reflection: {dailyVerse.note}
              </p>
            </div>

            {/* Daily Hadith */}
            <div className="card" style={{ padding: '1.5rem', background: '#022c22', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.4)', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '3px 10px', borderRadius: '12px' }}>
                  📜 DAILY HADITH
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{dailyHadith.book}</span>
              </div>
              <p style={{ fontSize: '1.2rem', fontFamily: "'Amiri', serif", color: '#818cf8', direction: 'rtl', textAlign: 'right', margin: '0.75rem 0', lineHeight: '1.7' }}>
                {dailyHadith.arabic}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.5', margin: 0 }}>
                "{dailyHadith.translation}"
              </p>
            </div>

            {/* Daily Dua */}
            <div className="card" style={{ padding: '1.5rem', background: '#0f172a', borderRadius: '20px', border: '1px solid rgba(236,72,153,0.4)', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, background: 'rgba(236,72,153,0.2)', color: '#f472b6', padding: '3px 10px', borderRadius: '12px' }}>
                  🤲 DAILY DUA
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{dailyDua.source}</span>
              </div>
              <p style={{ fontSize: '1.3rem', fontFamily: "'Amiri', serif", color: '#f472b6', direction: 'rtl', textAlign: 'right', margin: '0.75rem 0' }}>
                {dailyDua.arabic}
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)', margin: '0 0 0.25rem 0' }}>
                {dailyDua.transliteration}
              </p>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0 }}>
                "{dailyDua.translation}"
              </p>
            </div>

          </div>

          {/* Live Prayer Times & Qibla Widget Bar */}
          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', borderRadius: '20px', border: '1px solid var(--accent-gold)', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-clock"></i> Today's Prayer Schedule & Next Prayer Countdown
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Next Prayer: <strong>Asr in 1 hr 24 mins</strong> (4:45 PM)</span>
              </div>
              <button
                onClick={() => navigateToTab('qibla')}
                style={{ padding: '0.55rem 1.1rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <i className="fas fa-compass"></i> Open Qibla Compass
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
              {[
                { name: 'Fajr', time: '4:15 AM', active: false },
                { name: 'Dhuhr', time: '12:30 PM', active: false },
                { name: 'Asr', time: '4:45 PM', active: true },
                { name: 'Maghrib', time: '7:15 PM', active: false },
                { name: 'Isha', time: '8:45 PM', active: false },
              ].map(p => (
                <div key={p.name} style={{ padding: '0.85rem 0.5rem', borderRadius: '14px', background: p.active ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)', border: p.active ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.8rem', color: p.active ? 'var(--accent-gold)' : '#a1a1aa', fontWeight: 700, display: 'block' }}>{p.name}</span>
                  <strong style={{ fontSize: '1rem', color: '#fff', marginTop: '0.2rem', display: 'block' }}>{p.time}</strong>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 📖 TAB 2: PERSONAL QURAN & READING VAULT */}
      {/* ========================================================================= */}
      {activeTab === 'quran' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Resume Reading Banner */}
          <div className="card" style={{ padding: '1.5rem', background: '#064e3b', borderRadius: '20px', color: '#fff', border: '1.5px solid var(--accent-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>CONTINUE READING</span>
              <h3 style={{ margin: '0.2rem 0', fontSize: '1.3rem', fontWeight: 800 }}>Surah Al-Kahf (18:10)</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>Last read on 7 August 2026 &bull; Page 294 &bull; Juz 15</p>
            </div>
            <button
              onClick={() => navigateToTab('read')}
              style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
            >
              <i className="fas fa-book-open"></i> Open Surah Reader
            </button>
          </div>

          {/* Khatm Calculator & Bookmarks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            
            {/* Khatm Quran Completion Progress */}
            <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                <i className="fas fa-book-reader" style={{ color: 'var(--accent-gold)' }}></i> Quran Khatm Goal Progress
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  <span>Completed Surahs</span>
                  <span>{prefs.completed_surahs?.length || 12} / 114 Surahs ({prefs.khatm_percent || 10}%)</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${prefs.khatm_percent || 10}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-gold) 0%, #10b981 100%)' }}></div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Target Pace: <strong>30 Days Ramadan Goal</strong> &bull; Recommended: <strong>4 Surahs per day</strong>
              </p>
            </div>

            {/* Saved Ayah Reflections */}
            <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                <i className="fas fa-star" style={{ color: 'var(--accent-gold)' }}></i> Saved Bookmarks & Reflections
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {dashboardData?.bookmarks?.length || 0} Ayahs saved to your cloud profile.
              </p>
              <button
                onClick={() => navigateToTab('bookmarks')}
                style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', background: 'var(--primary-dark)', color: 'var(--accent-gold)', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                View All Saved Bookmarks
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎧 TAB 3: AUDIO VAULT & DOWNLOADS MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'audio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.25rem 1.5rem', background: '#ecfdf5', borderRadius: '20px', border: '1.5px solid #a7f3d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#065f46' }}>
                  <i className="fas fa-hdd" style={{ marginRight: '0.4rem' }}></i> Offline MP3 Vault for User: {user.username}
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#047857' }}>
                  Total <strong>{Object.keys(offlineSurahs).length} Surahs Downloaded</strong> &bull; <strong>{totalDeductedMb} MB Storage Deducted</strong>
                </p>
              </div>

              <div style={{ maxWidth: '320px', flex: 1 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search 114 Surahs to download..."
                  value={downloadSearch}
                  onChange={(e) => setDownloadSearch(e.target.value)}
                  style={{ padding: '0.45rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem' }}>
              <i className="fas fa-music" style={{ color: 'var(--accent-gold)' }}></i> Complete 114 Surahs MP3 Catalog
            </h3>

            <div className="grid-3" style={{ gap: '1rem' }}>
              {filteredCatalogSurahs.slice(0, 30).map((surah) => {
                const isDownloaded = !!offlineSurahs[surah.number];
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
                            <i className="fas fa-check-circle"></i> Saved Offline
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
                        <i className="fas fa-play"></i> Listen
                      </button>

                      <button
                        onClick={() => toggleOfflineSurahDownload(surah.number, surah.englishName)}
                        className="btn-play"
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

      {/* ========================================================================= */}
      {/* 🕌 TAB 4: PRAYER TRACKER & STREAKS */}
      {/* ========================================================================= */}
      {activeTab === 'namaz' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px', border: '1.5px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                <i className="fas fa-pray" style={{ color: 'var(--accent-gold)' }}></i> Daily 5 Namaz Tracker
              </h3>
              <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#b45309', fontWeight: 800, padding: '3px 10px', borderRadius: '12px' }}>
                🔥 {dashboardData?.namaz_streak || 7} Day Streak
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Check off your prayers for today ({todayNamaz.date || 'Today'}):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => (
                <label key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', background: todayNamaz[p] ? '#ecfdf5' : '#f8fafc', borderRadius: '12px', border: todayNamaz[p] ? '1.5px solid #10b981' : '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'capitalize', color: todayNamaz[p] ? '#065f46' : '#334155' }}>
                    {p === 'fajr' && '🌅 Fajr (Dawn)'}
                    {p === 'dhuhr' && '☀️ Dhuhr (Noon)'}
                    {p === 'asr' && '🌤️ Asr (Afternoon)'}
                    {p === 'maghrib' && '🌆 Maghrib (Sunset)'}
                    {p === 'isha' && '🌙 Isha (Night)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={!!todayNamaz[p]}
                    onChange={() => handleToggleNamaz(p)}
                    style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Monthly Completion Stats */}
          <div className="card" style={{ padding: '1.5rem', background: '#022c22', borderRadius: '20px', color: '#fff', border: '1.5px solid var(--accent-gold)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '1rem' }}>
              <i className="fas fa-chart-line"></i> Monthly Prayer Completion Stats
            </h3>
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: '110px', height: '110px', borderRadius: '50%', border: '6px solid var(--accent-gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
                94%
              </div>
              <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Excellent Spiritual Discipline!</h4>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.3rem' }}>You completed 141 out of 150 prayers this month.</p>
            </div>
          </div>

          {/* Fasting (Sawm) & Qada Tracker Card */}
          <div className="card" style={{ padding: '1.5rem', background: '#09090b', borderRadius: '20px', color: '#fff', border: '1.5px solid rgba(245,158,11,0.4)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <i className="fas fa-moon"></i> Fasting (Sawm) & Qada Tracker
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Track voluntary Sunnah fasts and manage remaining Qada fasts to make up.
            </p>

            <div style={{ background: '#18181b', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>REMAINING QADA FASTS</span>
                <strong style={{ fontSize: '1.6rem', color: '#f59e0b' }}>{qadaFasts} Days</strong>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => updateQada(-1)} style={{ padding: '0.4rem 0.8rem', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>-1 Made Up</button>
                <button onClick={() => updateQada(1)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>+1 Added</button>
              </div>
            </div>

            <div style={{ background: 'rgba(6,78,59,0.3)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#6ee7b7' }}>
              <i className="fas fa-star"></i> <strong>Recommended Sunnah Fasts:</strong> Mondays & Thursdays, 13th, 14th, 15th of Hijri month (White Days).
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🤲 TAB 5: DAILY ADHKAR & TASBEEH TRACKER */}
      {/* ========================================================================= */}
      {activeTab === 'duas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem' }}>
              <i className="fas fa-hand-holding-heart" style={{ color: 'var(--accent-gold)' }}></i> Daily Tasbeeh & Dhikr Counter
            </h3>

            <div className="grid-2" style={{ gap: '1rem' }}>
              {[
                { key: 'subhanAllah', name: 'سُبْحَانَ اللَّهِ', trans: 'SubhanAllah (Glory be to Allah)', count: adhkarState.subhanAllah, max: 33 },
                { key: 'alhamdulillah', name: 'الْحَمْدُ لِلَّهِ', trans: 'Alhamdulillah (Praise be to Allah)', count: adhkarState.alhamdulillah, max: 33 },
                { key: 'allahuAkbar', name: 'اللَّهُ أَكْبَرُ', trans: 'Allahu Akbar (Allah is Great)', count: adhkarState.allahuAkbar, max: 34 },
                { key: 'astaghfirullah', name: 'أَسْتَغْفِرُ اللَّهَ', trans: 'Astaghfirullah (I seek forgiveness)', count: adhkarState.astaghfirullah, max: 100 },
              ].map(item => (
                <div key={item.key} style={{ padding: '1.25rem', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.3rem', fontFamily: "'Amiri', serif", color: 'var(--primary-dark)' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.trans}</span>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      {item.count} / {item.max} Completed
                    </div>
                  </div>

                  <button
                    onClick={() => incrementAdhkar(item.key, item.max)}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#022c22', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}
                  >
                    +1
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ⭐ TAB 6: BADGES & ACHIEVEMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'achievements' && (
        <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
            <i className="fas fa-trophy" style={{ color: 'var(--accent-gold)' }}></i> Spiritual Badges & Milestones
          </h3>

          <div className="grid-3" style={{ gap: '1rem' }}>
            {[
              { title: '🔥 7-Day Reading Streak', desc: 'Read Quran 7 consecutive days', unlocked: true, icon: 'fas fa-fire', color: '#f59e0b' },
              { title: '🌅 Fajr Warrior', desc: 'Marked Fajr prayer 30 days', unlocked: true, icon: 'fas fa-sun', color: '#10b981' },
              { title: '📖 Khatm Explorer', desc: 'Completed 10 Surahs', unlocked: true, icon: 'fas fa-book', color: '#6366f1' },
              { title: '🌙 Ramadan Champion', desc: 'Completed full Khatm in Ramadan', unlocked: false, icon: 'fas fa-moon', color: '#ec4899' },
              { title: '📜 Hadith Scholar', desc: 'Read 50 Hadith entries', unlocked: false, icon: 'fas fa-scroll', color: '#8b5cf6' },
              { title: '🎧 Listening Master', desc: 'Listened to 10 hours of tilawat', unlocked: false, icon: 'fas fa-headphones', color: '#eab308' },
            ].map((badge, idx) => (
              <div key={idx} style={{ padding: '1.25rem', borderRadius: '16px', border: badge.unlocked ? `2px solid ${badge.color}` : '1px solid #e2e8f0', background: badge.unlocked ? '#f0fdf4' : '#f8fafc', opacity: badge.unlocked ? 1 : 0.65, textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: badge.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                  <i className={badge.icon}></i>
                </div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{badge.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{badge.desc}</p>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: badge.unlocked ? '#10b981' : '#94a3b8', display: 'inline-block', marginTop: '0.5rem' }}>
                  {badge.unlocked ? '✓ UNLOCKED BADGE' : '🔒 LOCKED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📅 TAB 7: ISLAMIC CALENDAR & COUNTDOWNS */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', background: '#022c22', borderRadius: '20px', color: '#fff', border: '1.5px solid var(--accent-gold)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
              <i className="fas fa-moon"></i> Ramadan 1448 AH Countdown
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>
              182 Days Left
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
              Expected Start: <strong>February 2027</strong> &bull; Prepare your Khatm goal in advance!
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: '#064e3b', borderRadius: '20px', color: '#fff', border: '1.5px solid var(--accent-gold)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
              <i className="fas fa-star"></i> Eid al-Adha Countdown
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>
              284 Days Left
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
              10 Dhul Hijjah 1448 AH &bull; May Allah accept your sacrifices & prayers!
            </p>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚙️ TAB 8: ACCOUNT SETTINGS & PREFERENCES */}
      {/* ========================================================================= */}
      {activeTab === 'preferences' && (
        <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
            <i className="fas fa-sliders-h" style={{ color: 'var(--accent-gold)' }}></i> Personal Preferences & Settings
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
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>Preferred Language</label>
              <select
                className="form-input"
                value={prefs.preferred_language || 'ur'}
                onChange={(e) => handleSavePreferences({ preferred_language: e.target.value })}
                style={{ marginTop: '0.3rem' }}
              >
                <option value="br">Brahui (براہوئی)</option>
                <option value="ur">Urdu (اردو)</option>
                <option value="en">English</option>
                <option value="ar">Arabic (عربي)</option>
              </select>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
