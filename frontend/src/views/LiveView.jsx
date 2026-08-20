import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Radio, Video, Play, Pause, Volume2, Sparkles, Tv, Compass, RefreshCw, ExternalLink, ShieldAlert, Heart } from 'lucide-react';

export default function LiveView() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('makkah'); // 'makkah', 'madinah', 'radio'
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);

  const streamsInfo = {
    makkah: {
      title: 'Al-Masjid Al-Haram (Holy Kaaba • Makkah Mukarramah)',
      arabicTitle: 'قناة القرآن الكريم • بث مباشر من المسجد الحرام بمكة المكرمة',
      desc: 'Watch 24/7 live HD broadcast of Tawaf around the Holy Kaaba, daily prayers (Salah), and Azan from Makkah.',
      channelName: 'Official Saudi Quran TV (قناة القرآن الكريم)',
      youtubeUrl: 'https://www.youtube.com/@SaudiQuranTv/live',
      embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC5u28zD6cQc4lV_0J9q3s6A',
      altEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC5u28zD6cQc4lV_0J9q3s6A'
    },
    madinah: {
      title: 'Al-Masjid An-Nabawi (Madinah Munawwarah)',
      arabicTitle: 'قناة السنة النبوية • بث مباشر من المسجد النبوي الشريف بالمدينة المنورة',
      desc: 'Watch 24/7 live HD broadcast from the Prophet\'s Mosque in Madinah, Rawdah Rasool (SAW), and daily prayers.',
      channelName: 'Official Saudi Sunnah TV (قناة السنة النبوية)',
      youtubeUrl: 'https://www.youtube.com/@SaudiSunnahTv/live',
      embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCROKYPep-UuODNwyipe6JMw',
      altEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCROKYPep-UuODNwyipe6JMw'
    }
  };

  const currentStream = streamsInfo[activeTab] || streamsInfo.makkah;

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
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              24/7 Official Saudi Live Broadcast
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Makkah &amp; Madinah Live Streams &amp; 24/7 Quran Radio
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Watch live 24/7 broadcasts from Al-Masjid Al-Haram (Holy Kaaba) and Al-Masjid An-Nabawi (Madinah), and listen to non-stop Tilawat radio.
          </p>
        </div>

        {/* ── Main Tab Navigation ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('makkah')}
            style={{
              padding: '14px 28px', borderRadius: '18px', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer',
              background: activeTab === 'makkah' ? '#059669' : '#ffffff',
              color: activeTab === 'makkah' ? '#ffffff' : '#475569',
              border: activeTab === 'makkah' ? 'none' : '1.5px solid #cbd5e1',
              boxShadow: activeTab === 'makkah' ? '0 8px 20px rgba(5,150,105,0.3)' : 'none', transition: 'all 0.2s'
            }}
          >
            🕋 Makkah Live (قناة القرآن الكريم)
          </button>
          <button
            onClick={() => setActiveTab('madinah')}
            style={{
              padding: '14px 28px', borderRadius: '18px', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer',
              background: activeTab === 'madinah' ? '#059669' : '#ffffff',
              color: activeTab === 'madinah' ? '#ffffff' : '#475569',
              border: activeTab === 'madinah' ? 'none' : '1.5px solid #cbd5e1',
              boxShadow: activeTab === 'madinah' ? '0 8px 20px rgba(5,150,105,0.3)' : 'none', transition: 'all 0.2s'
            }}
          >
            💚 Madinah Live (قناة السنة النبوية)
          </button>
          <button
            onClick={() => setActiveTab('radio')}
            style={{
              padding: '14px 28px', borderRadius: '18px', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer',
              background: activeTab === 'radio' ? '#d97706' : '#ffffff',
              color: activeTab === 'radio' ? '#ffffff' : '#475569',
              border: activeTab === 'radio' ? 'none' : '1.5px solid #cbd5e1',
              boxShadow: activeTab === 'radio' ? '0 8px 20px rgba(217,119,6,0.3)' : 'none', transition: 'all 0.2s'
            }}
          >
            📻 24/7 Quran Radio Stream
          </button>
        </div>

        {/* ── Main Live Stream Container ── */}
        {(activeTab === 'makkah' || activeTab === 'madinah') && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span> 🔴 LIVE 24/7 BROADCAST
                </span>
                <h2 style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                  {currentStream.title}
                </h2>
                <div style={{ fontSize: '0.92rem', fontFamily: 'Amiri, serif', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                  {currentStream.arabicTitle}
                </div>
              </div>

              <a
                href={currentStream.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '12px 24px',
                  borderRadius: '16px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff', fontWeight: 900, fontSize: '0.95rem', textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(5,150,105,0.3)'
                }}
              >
                ▶ Watch Full HD 1080p Live Stream <ExternalLink size={16}/>
              </a>
            </div>

            {/* Video Player Box */}
            <div style={{ background: '#000000', borderRadius: '20px', overflow: 'hidden', border: '2px solid #f59e0b', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={currentStream.embedUrl}
                  title={currentStream.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                💡 <b>Note:</b> YouTube blocks embedding live streams on certain browsers. If the player above shows <i>"This video is unavailable"</i>, click the green button above to open the official Saudi channel stream.
              </div>
              <a
                href={currentStream.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 800, color: '#059669', fontSize: '0.88rem', textDecoration: 'none' }}
              >
                Open Official {currentStream.channelName} →
              </a>
            </div>
          </div>
        )}

        {/* ── 24/7 Quran Radio Stream Container ── */}
        {activeTab === 'radio' && (
          <div style={{ background: '#000000', borderRadius: '24px', overflow: 'hidden', border: '2px solid #f59e0b', boxShadow: '0 15px 40px rgba(0,0,0,0.35)', marginBottom: '3rem' }}>
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
          </div>
        )}

      </div>
    </div>
  );
}
