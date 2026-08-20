import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Palette, Download, Sparkles, Image as ImageIcon, Type, Layout, RefreshCw } from 'lucide-react';

export default function CardCreatorView() {
  const { t } = useLanguage();
  const cardRef = useRef(null);

  // Card Content & Styling State
  const [arabicText, setArabicText] = useState('فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا');
  const [translationText, setTranslationText] = useState('Indeed, with hardship comes ease. Indeed, with hardship comes ease. (Surah Ash-Sharh 94:5-6)');
  const [theme, setTheme] = useState('emerald'); // 'emerald', 'dark', 'gold', 'navy'
  const [ratio, setRatio] = useState('square'); // 'square' (1:1) or 'story' (9:16)

  const themes = {
    emerald: { bg: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', text: '#ffffff', accent: '#f59e0b', sub: '#a7f3d0', border: '#f59e0b' },
    dark: { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', text: '#ffffff', accent: '#38bdf8', sub: '#cbd5e1', border: '#38bdf8' },
    gold: { bg: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)', text: '#ffffff', accent: '#fcd34d', sub: '#fef3c7', border: '#fcd34d' },
    navy: { bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', text: '#ffffff', accent: '#c084fc', sub: '#e9d5ff', border: '#c084fc' }
  };

  const selectedTheme = themes[theme] || themes.emerald;

  const sampleQuotes = [
    { ar: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', en: 'Indeed, with hardship comes ease. (Surah Ash-Sharh 94:5)' },
    { ar: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', en: 'And say: My Lord, increase me in knowledge. (Surah Taha 20:114)' },
    { ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', en: 'Sufficient for us is Allah, and He is the best Disposer of affairs. (3:173)' },
    { ar: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', en: 'Indeed, Allah is with the patient. (Surah Al-Baqarah 2:153)' }
  ];

  const handleDownloadCard = () => {
    if (!cardRef.current) return;
    // Download html representation or canvas snapshot
    const link = document.createElement('a');
    link.download = 'islamic-quote-card.png';
    link.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${ratio === 'story' ? 1066 : 600}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;background:${selectedTheme.bg};color:${selectedTheme.text};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;box-sizing:border-box;text-align:center;font-family:sans-serif;border:10px solid ${selectedTheme.border};">
            <div style="font-size:32px;font-family:serif;font-weight:bold;margin-bottom:20px;color:${selectedTheme.accent};">${arabicText}</div>
            <div style="font-size:18px;line-height:1.6;color:${selectedTheme.sub};">${translationText}</div>
            <div style="margin-top:30px;font-size:14px;font-weight:bold;letter-spacing:1px;color:${selectedTheme.accent};">MAKTABATULMUSLIM.COM</div>
          </div>
        </foreignObject>
      </svg>`
    );
    link.click();
  };

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Palette size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Digital Calligraphy Studio
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Quran Verse &amp; Hadith Card Creator
          </h1>
          <p style={{ color: '#fef3c7', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Create, style, and download custom Quranic verse &amp; Hadith quote cards for WhatsApp, Instagram, and Facebook sharing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

          {/* Left Column: Form Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Quick Sample Selector */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Quick Verse Presets</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {sampleQuotes.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setArabicText(q.ar); setTranslationText(q.en); }}
                    style={{
                      padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0',
                      textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.92rem', fontFamily: 'Amiri, serif' }}>{q.ar}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{q.en}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Inputs */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Customize Content</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Arabic Text / Verse:</label>
                  <textarea rows={3} value={arabicText} onChange={e => setArabicText(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Translation / Reference:</label>
                  <textarea rows={3} value={translationText} onChange={e => setTranslationText(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Theme & Ratio Controls */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Color Theme &amp; Format</h3>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
                {Object.keys(themes).map(th => (
                  <button
                    key={th}
                    onClick={() => setTheme(th)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                      background: theme === th ? '#059669' : '#f1f5f9', color: theme === th ? '#ffffff' : '#475569',
                      border: 'none', textTransform: 'capitalize'
                    }}
                  >
                    {th}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={() => setRatio('square')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                    background: ratio === 'square' ? '#d97706' : '#f1f5f9', color: ratio === 'square' ? '#ffffff' : '#475569', border: 'none'
                  }}
                >
                  Square (1:1 Post)
                </button>
                <button
                  onClick={() => setRatio('story')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                    background: ratio === 'story' ? '#d97706' : '#f1f5f9', color: ratio === 'story' ? '#ffffff' : '#475569', border: 'none'
                  }}
                >
                  Story (9:16 Tall)
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Live Card Canvas Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              ref={cardRef}
              style={{
                width: '100%', maxWidth: '420px',
                minHeight: ratio === 'story' ? '600px' : '420px',
                background: selectedTheme.bg, color: selectedTheme.text,
                borderRadius: '24px', padding: '2.5rem 2rem',
                border: `3px solid ${selectedTheme.border}`,
                boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', position: 'relative', transition: 'all 0.3s'
              }}
            >
              <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'Amiri, serif', color: selectedTheme.accent, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {arabicText}
              </div>
              <div style={{ fontSize: '0.95rem', color: selectedTheme.sub, lineHeight: 1.6, marginBottom: '2rem' }}>
                {translationText}
              </div>
              <div style={{ position: 'absolute', bottom: '20px', fontSize: '0.75rem', fontWeight: 800, color: selectedTheme.accent, letterSpacing: '1px', textTransform: 'uppercase' }}>
                MAKTABATULMUSLIM.COM
              </div>
            </div>

            <button
              onClick={handleDownloadCard}
              style={{
                marginTop: '1.5rem', width: '100%', maxWidth: '420px', padding: '14px',
                borderRadius: '16px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff', fontWeight: 800, fontSize: '1.05rem', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                boxShadow: '0 8px 25px rgba(5,150,105,0.3)'
              }}
            >
              <Download size={20} /> Download High-Res Image Card
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '0.65rem 0.9rem', borderRadius: '12px',
  border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.9rem',
  color: '#1e293b', background: '#f8fafc'
};
