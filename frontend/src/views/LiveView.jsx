import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Radio, Video, Play, Pause, Volume2, Sparkles, Tv, Compass, RefreshCw, ExternalLink, ShieldAlert } from 'lucide-react';

export default function LiveView() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('makkah'); // 'makkah', 'madinah', 'radio'
  const [streamServer, setStreamServer] = useState(1);
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);

  const makkahStreams = [
    { id: 1, name: 'Saudi Quran TV (Official 24/7 Channel)', embed: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC_2o20J597F-rV1_u-M9PZA', directUrl: 'https://www.youtube.com/@SaudiQuranTv/live' },
    { id: 2, name: 'Makkah Live Haram Mirror 2', embed: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCv-Mh2Q_X_1e7X9_wQeX-Xg', directUrl: 'https://www.youtube.com/results?search_query=makkah+live+stream+24/7' }
  ];

  const madinahStreams = [
    { id: 1, name: 'Saudi Sunnah TV (Official 24/7 Channel)', embed: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCyJv_w_Vq-1e7X9_wQeX-Xg', directUrl: 'https://www.youtube.com/@SaudiSunnahTv/live' },
    { id: 2, name: 'Madinah Live An-Nabawi Mirror 2', embed: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC_2o20J597F-rV1_u-M9PZA', directUrl: 'https://www.youtube.com/results?search_query=madinah+live+stream+24/7' }
  ];

  const currentStreamObj = activeTab === 'makkah' 
    ? (makkahStreams.find(s => s.id === streamServer) || makkahStreams[0])
    : (madinahStreams.find(s => s.id === streamServer) || madinahStreams[0]);

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #0f172a 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Tv size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              24/7 Official Saudi HD Broadcast
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Makkah &amp; Madinah Live Streams &amp; Quran Radio
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Watch 24/7 live video broadcasts from Al-Masjid Al-Haram (Holy Kaaba Tawaf) and Al-Masjid An-Nabawi (Madinah Munawwarah).
          </p>
        </div>

        {/* ── Main Tab Navigation ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveTab('makkah'); setStreamServer(1); }}
            style={{
              padding: '12px 26px', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              background: activeTab === 'makkah' ? '#059669' : '#ffffff',
              color: activeTab === 'makkah' ? '#ffffff' : '#475569',
              border: activeTab === 'makkah' ? 'none' : '1px solid #cbd5e1',
              boxShadow: activeTab === 'makkah' ? '0 8px 20px rgba(5,150,105,0.3)' : 'none', transition: 'all 0.2s'
            }}
          >
            🕋 Makkah Live (قناة القرآن الكريم)
          </button>
          <button
            onClick={() => { setActiveTab('madinah'); setStreamServer(1); }}
            style={{
              padding: '12px 26px', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              background: activeTab === 'madinah' ? '#059669' : '#ffffff',
              color: activeTab === 'madinah' ? '#ffffff' : '#475569',
              border: activeTab === 'madinah' ? 'none' : '1px solid #cbd5e1',
              boxShadow: activeTab === 'madinah' ? '0 8px 20px rgba(5,150,105,0.3)' : 'none', transition: 'all 0.2s'
            }}
          >
            💚 Madinah Live (قناة السنة النبوية)
          </button>
          <button
            onClick={() => setActiveTab('radio')}
            style={{
              padding: '12px 26px', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              background: activeTab === 'radio' ? '#d97706' : '#ffffff',
              color: activeTab === 'radio' ? '#ffffff' : '#475569',
              border: activeTab === 'radio' ? 'none' : '1px solid #cbd5e1',
              boxShadow: activeTab === 'radio' ? '0 8px 20px rgba(217,119,6,0.3)' : 'none', transition: 'all 0.2s'
            }}
          >
            📻 24/7 Quran Radio Stream
          </button>
        </div>

        {/* ── Server Stream Switcher Bar (for Makkah/Madinah) ── */}
        {(activeTab === 'makkah' || activeTab === 'madinah') && (
          <div style={{
            background: '#ffffff', borderRadius: '18px', padding: '1rem 1.5rem',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
          }}>
            <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={16} style={{ color: '#059669' }} /> Stream Mirror Source:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(activeTab === 'makkah' ? makkahStreams : madinahStreams).map(s => (
                <button
                  key={s.id}
                  onClick={() => setStreamServer(s.id)}
                  style={{
                    padding: '6px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                    background: streamServer === s.id ? '#0f172a' : '#f1f5f9',
                    color: streamServer === s.id ? '#fcd34d' : '#475569', border: 'none'
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Stream Player Box ── */}
        <div style={{ background: '#000000', borderRadius: '24px', overflow: 'hidden', border: '2px solid #f59e0b', boxShadow: '0 15px 40px rgba(0,0,0,0.35)', marginBottom: '1.5rem' }}>
          {(activeTab === 'makkah' || activeTab === 'madinah') && (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={currentStreamObj.embed}
                title={`${activeTab === 'makkah' ? 'Makkah' : 'Madinah'} 24/7 Live Stream`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          )}

          {activeTab === 'radio' && (
            <div style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', textAlign: 'center', color: '#ffffff' }}>
              <Radio size={54} style={{ color: '#f59e0b', marginBottom: '1rem', animation: isPlayingRadio ? 'pulse 2s infinite' : 'none' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>24/7 Global Quran Radio Stream</h2>
              <p style={{ color: '#a7f3d0', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                Continuous high quality MP3 recitations by renowned world Qaris (Qari Sudais, Mishary Alafasy, Shuraim).
              </p>

              <audio id="quran-radio-player" src="https://stream.quranicaudio.com/radio/quran" preload="none" />

              <button
                onClick={() => {
                  const player = document.getElementById('quran-radio-player');
                  if (player) {
                    if (isPlayingRadio) {
                      player.pause();
                      setIsPlayingRadio(false);
                    } else {
                      player.play();
                      setIsPlayingRadio(true);
                    }
                  }
                }}
                style={{
                  padding: '16px 36px', borderRadius: '30px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', border: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 8px 25px rgba(245,158,11,0.4)'
                }}
              >
                {isPlayingRadio ? <><Pause size={22}/> Pause Radio</> : <><Play size={22}/> Play Live Radio Stream</>}
              </button>
            </div>
          )}
        </div>

        {/* ── Direct Live Watch Action Bar ── */}
        {(activeTab === 'makkah' || activeTab === 'madinah') && (
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem 2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {activeTab === 'makkah' ? '🕌 Official Saudi Quran Channel (Makkah)' : '💚 Official Saudi Sunnah Channel (Madinah)'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
                If browser iframe playback is restricted by YouTube, click below to open full HD 1080p stream.
              </p>
            </div>
            <a
              href={currentStreamObj.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '12px 24px',
                borderRadius: '16px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(5,150,105,0.3)'
              }}
            >
              ▶ Open 1080p Official Live Stream <ExternalLink size={16}/>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
