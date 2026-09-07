import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Radio, Video, Play, Pause, Volume2, Sparkles, Tv, Compass, RefreshCw, ExternalLink, ShieldAlert, Heart, Edit3, Check, Globe } from 'lucide-react';

export default function LiveView({ user }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('makkah'); // 'makkah', 'madinah', 'radio'
  const [selectedServer, setSelectedServer] = useState('server1'); // 'server1', 'server2', 'server3', 'custom'
  
  // Radio State
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);
  const [selectedStation, setSelectedStation] = useState(0);

  // Admin Custom Stream IDs / URLs stored in LocalStorage for zero-downtime updates
  const [customMakkahId, setCustomMakkahId] = useState(() => {
    try { return localStorage.getItem('quran_portal_makkah_id') || ''; } catch(e) { return ''; }
  });
  const [customMadinahId, setCustomMadinahId] = useState(() => {
    try { return localStorage.getItem('quran_portal_madinah_id') || ''; } catch(e) { return ''; }
  });

  const [isEditingMakkah, setIsEditingMakkah] = useState(false);
  const [isEditingMadinah, setIsEditingMadinah] = useState(false);
  const [makkahInput, setMakkahInput] = useState(customMakkahId);
  const [madinahInput, setMadinahInput] = useState(customMadinahId);

  const saveMakkahId = () => {
    let cleanId = makkahInput.trim();
    // Extract video ID if user pasted full YouTube URL
    if (cleanId.includes('v=')) {
      cleanId = cleanId.split('v=')[1].split('&')[0];
    } else if (cleanId.includes('youtu.be/')) {
      cleanId = cleanId.split('youtu.be/')[1].split('?')[0];
    }
    setCustomMakkahId(cleanId);
    try { localStorage.setItem('quran_portal_makkah_id', cleanId); } catch(e){}
    setIsEditingMakkah(false);
    setSelectedServer('custom');
  };

  const saveMadinahId = () => {
    let cleanId = madinahInput.trim();
    if (cleanId.includes('v=')) {
      cleanId = cleanId.split('v=')[1].split('&')[0];
    } else if (cleanId.includes('youtu.be/')) {
      cleanId = cleanId.split('youtu.be/')[1].split('?')[0];
    }
    setCustomMadinahId(cleanId);
    try { localStorage.setItem('quran_portal_madinah_id', cleanId); } catch(e){}
    setIsEditingMadinah(false);
    setSelectedServer('custom');
  };

  const radioStations = [
    {
      name: '🕋 Saudi Official Quran Radio (Makkah)',
      desc: 'Live 24/7 Recitations from Al-Masjid Al-Haram',
      url: 'https://stream.quranicaudio.com/radio/quran'
    },
    {
      name: '🎙️ Qari Mishary Rashid Alafasy 24/7',
      desc: 'High Definition Tilawat by Sheikh Mishary Alafasy',
      url: 'https://qurango.net/radio/alafasy'
    },
    {
      name: '🎙️ Qari Abdul Basit Abdul Samad',
      desc: 'Classic Mojawwad Recitation by Sheikh Abdul Basit',
      url: 'https://qurango.net/radio/abdulbasit_mjwd'
    },
    {
      name: '🎙️ Sheikh Saud Al-Shuraim & Sudais',
      desc: 'Taraweeh and Daily Salah Recitations from Kaaba',
      url: 'https://qurango.net/radio/shuraym'
    },
    {
      name: '📜 Urdu & Brahui Tarjuma Radio',
      desc: 'Quran Translation with Audio Recitation',
      url: 'https://qurango.net/radio/tarajm'
    },
    {
      name: '🔊 Global Live Quran HD Radio',
      desc: 'Continuous 24/7 High Quality Audio Feed',
      url: 'https://n0a.radiojar.com/8smy151v80uvt'
    }
  ];

  const currentStationObj = radioStations[selectedStation] || radioStations[0];

  // Helper to determine exact embed URL
  const getEmbedUrl = () => {
    if (activeTab === 'makkah') {
      if (selectedServer === 'custom' && customMakkahId) {
        return `https://www.youtube.com/embed/${customMakkahId}?autoplay=1&rel=0`;
      }
      if (selectedServer === 'server2') {
        return 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC5u28zD6cQc4lV_0J9q3s6A';
      }
      // Verified Working Default ID for Makkah
      return 'https://www.youtube.com/embed/Jqr7aM-OwRg?autoplay=1&rel=0';
    } else {
      if (selectedServer === 'custom' && customMadinahId) {
        return `https://www.youtube.com/embed/${customMadinahId}?autoplay=1&rel=0`;
      }
      if (selectedServer === 'server2') {
        return 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCROKYPep-UuODNwyipe6JMw';
      }
      // Verified Working Default ID for Madinah
      return 'https://www.youtube.com/embed/Rs7St51oDDc?autoplay=1&rel=0';
    }
  };

  const getDirectYoutubeUrls = () => {
    if (activeTab === 'makkah') {
      return [
        { label: 'Saudi Quran TV (@SaudiQuranTv)', url: 'https://www.youtube.com/@SaudiQuranTv/live' },
        { label: 'KSA Quran Channel (@qurantvsa)', url: 'https://www.youtube.com/@qurantvsa/live' },
        { label: 'Makkah Live Official 1080p', url: 'https://www.youtube.com/results?search_query=makkah+live+stream+24%2F7' }
      ];
    } else {
      return [
        { label: 'Saudi Sunnah TV (@SaudiSunnahTv)', url: 'https://www.youtube.com/@SaudiSunnahTv/live' },
        { label: 'KSA Sunnah Channel (@sunnahtvsa)', url: 'https://www.youtube.com/@sunnahtvsa/live' },
        { label: 'Madinah Live Official 1080p', url: 'https://www.youtube.com/results?search_query=madinah+live+stream+24%2F7' }
      ];
    }
  };

  return (
    <div style={{ background: 'var(--bg-cream, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #1c1917 100%)',
          borderRadius: '24px', padding: '2.5rem 1.5rem', color: '#fff',
          textAlign: 'center', marginBottom: '2rem',
          border: '2px solid var(--accent-gold, #b45309)', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              24/7 Official Saudi Live HD Broadcast & Radio
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Makkah &amp; Madinah Live Streams
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Watch live 24/7 broadcasts from Al-Masjid Al-Haram (Holy Kaaba) and Al-Masjid An-Nabawi (Madinah), and listen to non-stop Tilawat radio.
          </p>
        </div>

        {/* ── Main Tab Navigation ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveTab('makkah'); setSelectedServer('server1'); }}
            style={{
              padding: '12px 24px', borderRadius: '18px', fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
              background: activeTab === 'makkah' ? '#059669' : '#ffffff',
              color: activeTab === 'makkah' ? '#ffffff' : 'var(--text-main)',
              border: activeTab === 'makkah' ? 'none' : '1.5px solid var(--border-color)',
              boxShadow: activeTab === 'makkah' ? '0 8px 20px rgba(5,150,105,0.3)' : 'none', transition: 'all 0.2s'
            }}
          >
            🕋 Makkah Live (قناة القرآن)
          </button>
          <button
            onClick={() => { setActiveTab('madinah'); setSelectedServer('server1'); }}
            style={{
              padding: '12px 24px', borderRadius: '18px', fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
              background: activeTab === 'madinah' ? '#059669' : '#ffffff',
              color: activeTab === 'madinah' ? '#ffffff' : 'var(--text-main)',
              border: activeTab === 'madinah' ? 'none' : '1.5px solid var(--border-color)',
              boxShadow: activeTab === 'madinah' ? '0 8px 20px rgba(5,150,105,0.3)' : 'none', transition: 'all 0.2s'
            }}
          >
            💚 Madinah Live (قناة السنة)
          </button>
          <button
            onClick={() => setActiveTab('radio')}
            style={{
              padding: '12px 24px', borderRadius: '18px', fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
              background: activeTab === 'radio' ? '#b45309' : '#ffffff',
              color: activeTab === 'radio' ? '#ffffff' : 'var(--text-main)',
              border: activeTab === 'radio' ? 'none' : '1.5px solid var(--border-color)',
              boxShadow: activeTab === 'radio' ? '0 8px 20px rgba(180,83,9,0.3)' : 'none', transition: 'all 0.2s'
            }}
          >
            📻 24/7 Quran Radio Stream
          </button>
        </div>

        {/* ── Main Live Stream Container (Makkah or Madinah) ── */}
        {(activeTab === 'makkah' || activeTab === 'madinah') && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '1.75rem', border: '1.5px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
            
            {/* Header & Title Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🔴 24/7 OFFICIAL SAUDI LIVE BROADCAST
                  </span>
                </div>

                <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  {activeTab === 'makkah' ? 'Al-Masjid Al-Haram (Holy Kaaba • Makkah Mukarramah)' : 'Al-Masjid An-Nabawi (Madinah Munawwarah)'}
                </h2>
                <p style={{ margin: 0, fontSize: '0.92rem', fontFamily: 'Amiri, serif', color: '#059669', fontWeight: 700 }}>
                  {activeTab === 'makkah' ? 'قناة القرآن الكريم • بث مباشر من المسجد الحرام بمكة المكرمة' : 'قناة السنة النبوية • بث مباشر من المسجد النبوي الشريف'}
                </p>
              </div>

              {/* Direct YouTube Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {getDirectYoutubeUrls().map((ch, idx) => (
                  <a
                    key={idx}
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '8px 16px',
                      borderRadius: '14px', background: idx === 0 ? 'linear-gradient(135deg, #059669, #047857)' : '#f1f5f9',
                      color: idx === 0 ? '#ffffff' : '#334155', fontWeight: 800, fontSize: '0.82rem', textDecoration: 'none',
                      boxShadow: idx === 0 ? '0 4px 12px rgba(5,150,105,0.3)' : 'none', transition: 'all 0.2s'
                    }}
                  >
                    ▶ {ch.label} <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Stream Server Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-gold, #b45309)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Tv size={16} /> Select Stream Source:
                </span>
                
                <button
                  onClick={() => setSelectedServer('server1')}
                  style={{
                    padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                    background: selectedServer === 'server1' ? '#059669' : '#ffffff',
                    color: selectedServer === 'server1' ? '#ffffff' : '#475569',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  Server 1 (Saudi Official)
                </button>

                <button
                  onClick={() => setSelectedServer('server2')}
                  style={{
                    padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                    background: selectedServer === 'server2' ? '#059669' : '#ffffff',
                    color: selectedServer === 'server2' ? '#ffffff' : '#475569',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  Server 2 (No-Cookie Player)
                </button>

                {(customMakkahId || customMadinahId) && (
                  <button
                    onClick={() => setSelectedServer('custom')}
                    style={{
                      padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                      background: selectedServer === 'custom' ? '#b45309' : '#ffffff',
                      color: selectedServer === 'custom' ? '#ffffff' : '#475569',
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    Custom Stream ID
                  </button>
                )}
              </div>

              {/* Admin Custom Stream Editor */}
              {user && user.is_staff && (
                <div>
                  {activeTab === 'makkah' ? (
                    isEditingMakkah ? (
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Paste YouTube Video ID or Link"
                          value={makkahInput}
                          onChange={(e) => setMakkahInput(e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', width: '180px' }}
                        />
                        <button onClick={saveMakkahId} style={{ background: '#059669', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}>Save</button>
                        <button onClick={() => setIsEditingMakkah(false)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setIsEditingMakkah(true)} style={{ background: 'rgba(180,83,9,0.12)', color: 'var(--accent-gold, #b45309)', border: '1px solid rgba(180,83,9,0.3)', padding: '4px 10px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Edit3 size={13} /> Edit Makkah Stream ID
                      </button>
                    )
                  ) : (
                    isEditingMadinah ? (
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Paste YouTube Video ID or Link"
                          value={madinahInput}
                          onChange={(e) => setMadinahInput(e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', width: '180px' }}
                        />
                        <button onClick={saveMadinahId} style={{ background: '#059669', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}>Save</button>
                        <button onClick={() => setIsEditingMadinah(false)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setIsEditingMadinah(true)} style={{ background: 'rgba(180,83,9,0.12)', color: 'var(--accent-gold, #b45309)', border: '1px solid rgba(180,83,9,0.3)', padding: '4px 10px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Edit3 size={13} /> Edit Madinah Stream ID
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Video Player Box */}
            <div style={{ background: '#000000', borderRadius: '20px', overflow: 'hidden', border: '2px solid var(--accent-gold, #b45309)', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={getEmbedUrl()}
                  title={activeTab === 'makkah' ? 'Makkah Live Stream' : 'Madinah Live Stream'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>

            {/* Help / Fallback Notification Banner */}
            <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                💡 <b>Having trouble with video playback?</b> YouTube regularly restarts live streams. If the video player above shows <i>"Video Unavailable"</i> or <i>"Playback error"</i>, click any of the green buttons above to open the official 1080p stream directly on YouTube!
              </div>
              <a
                href={activeTab === 'makkah' ? 'https://www.youtube.com/@SaudiQuranTv/live' : 'https://www.youtube.com/@SaudiSunnahTv/live'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 800, color: '#059669', fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
              >
                Open Official Saudi Channel Live <ExternalLink size={14} />
              </a>
            </div>

          </div>
        )}

        {/* ── 24/7 Quran Radio Stream Container ── */}
        {activeTab === 'radio' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1.5px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Radio size={54} style={{ color: 'var(--accent-gold, #b45309)', marginBottom: '0.75rem', animation: isPlayingRadio ? 'pulse 2s infinite' : 'none' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-main)' }}>24/7 Global Quran Radio Stations</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '550px', margin: '0 auto' }}>
                Listen to continuous, high-definition audio streams of the Holy Quran, reciter channels, and multi-language translations.
              </p>
            </div>

            {/* Station Selector Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {radioStations.map((st, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedStation(idx);
                    const player = document.getElementById('quran-radio-player');
                    if (player) {
                      player.src = st.url;
                      player.play().then(() => setIsPlayingRadio(true)).catch(() => {});
                    }
                  }}
                  style={{
                    padding: '1.2rem 1rem', borderRadius: '18px', cursor: 'pointer',
                    background: selectedStation === idx ? 'rgba(180,83,9,0.1)' : '#f8fafc',
                    border: selectedStation === idx ? '2px solid var(--accent-gold, #b45309)' : '1px solid #e2e8f0',
                    transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: '0.85rem'
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: selectedStation === idx ? 'var(--accent-gold, #b45309)' : '#e2e8f0', color: selectedStation === idx ? '#fff' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    {selectedStation === idx && isPlayingRadio ? <Volume2 size={20} /> : <Radio size={20} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>{st.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{st.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Player Bar */}
            <div style={{ background: 'linear-gradient(135deg, #022c22 0%, #1c1917 100%)', borderRadius: '20px', padding: '2rem', textAlign: 'center', color: '#ffffff', border: '2px solid var(--accent-gold, #b45309)' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.3rem', color: '#fcd34d' }}>
                {currentStationObj.name}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#a7f3d0', marginBottom: '1.5rem' }}>
                {currentStationObj.desc}
              </div>

              <audio id="quran-radio-player" src={currentStationObj.url} preload="none" />

              <button
                onClick={() => {
                  const player = document.getElementById('quran-radio-player');
                  if (player) {
                    if (isPlayingRadio) {
                      player.pause();
                      setIsPlayingRadio(false);
                    } else {
                      player.play().then(() => setIsPlayingRadio(true)).catch(() => {});
                    }
                  }
                }}
                style={{
                  padding: '16px 40px', borderRadius: '30px', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer',
                  background: 'linear-gradient(135deg, var(--accent-gold, #b45309) 0%, #d97706 100%)', color: '#ffffff', border: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 8px 25px rgba(180,83,9,0.4)'
                }}
              >
                {isPlayingRadio ? <><Pause size={22}/> Pause Radio Stream</> : <><Play size={22}/> Play Live Radio Station</>}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
