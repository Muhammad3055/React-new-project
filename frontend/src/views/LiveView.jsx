import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Radio, Video, Play, Pause, Volume2, Sparkles, Tv } from 'lucide-react';

export default function LiveView() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('makkah'); // 'makkah', 'madinah', 'radio'
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Tv size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              24/7 Global Live Feed
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Makkah &amp; Madinah Live Stream &amp; Quran Radio
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Watch live 24/7 HD video streams from Al-Masjid Al-Haram (Makkah) and Al-Masjid An-Nabawi (Madinah), and listen to non-stop Tilawat radio streams.
          </p>
        </div>

        {/* ── Tabs Selector ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('makkah')}
            style={{
              padding: '12px 24px', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              background: activeTab === 'makkah' ? '#059669' : '#ffffff',
              color: activeTab === 'makkah' ? '#ffffff' : '#475569',
              border: activeTab === 'makkah' ? 'none' : '1px solid #cbd5e1', transition: 'all 0.2s'
            }}
          >
            🕌 Makkah Live (قرآن مكة)
          </button>
          <button
            onClick={() => setActiveTab('madinah')}
            style={{
              padding: '12px 24px', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              background: activeTab === 'madinah' ? '#059669' : '#ffffff',
              color: activeTab === 'madinah' ? '#ffffff' : '#475569',
              border: activeTab === 'madinah' ? 'none' : '1px solid #cbd5e1', transition: 'all 0.2s'
            }}
          >
            💚 Madinah Live (سنة المدينة)
          </button>
          <button
            onClick={() => setActiveTab('radio')}
            style={{
              padding: '12px 24px', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              background: activeTab === 'radio' ? '#d97706' : '#ffffff',
              color: activeTab === 'radio' ? '#ffffff' : '#475569',
              border: activeTab === 'radio' ? 'none' : '1px solid #cbd5e1', transition: 'all 0.2s'
            }}
          >
            📻 24/7 Quran Radio Stream
          </button>
        </div>

        {/* ── Main Stream Player Container ── */}
        <div style={{ background: '#000000', borderRadius: '24px', overflow: 'hidden', border: '2px solid #f59e0b', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', marginBottom: '3rem' }}>
          {activeTab === 'makkah' && (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/live_stream?channel=UCv-Mh2Q_X_1e7X9_wQeX-Xg&autoplay=1"
                title="Makkah Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          )}

          {activeTab === 'madinah' && (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/live_stream?channel=UCyJv_w_Vq-1e7X9_wQeX-Xg&autoplay=1"
                title="Madinah Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

      </div>
    </div>
  );
}
