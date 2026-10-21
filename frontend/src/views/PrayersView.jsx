import React from 'react';
import PrayerTimesWidget from '../components/PrayerTimesWidget';
import { useLanguage } from '../context/LanguageContext';

export default function PrayersView({ navigateToTab }) {
  const { t } = useLanguage();
  const tools = [
    { title: 'آسان نماز و مسنون احکام (Asan Nimaz)', desc: 'نماز کا مکمل طریقہ، ۵ نمازوں کی رکعتیں، وضو، غسل، جنازہ، قبرستان اور روزمرہ کی دعائیں۔', icon: 'fas fa-mosque', tab: 'asanNimaz', color: '#059669' },
    { title: 'قضائے عمری ٹریکر (Qaza-e-Umri Tracker)', desc: 'چھوٹی ہوئی نمازوں اور روزوں کا مکمل حساب، روزانہ قضاء ادا کرنے کا لائیو ٹریکر۔', icon: 'fas fa-history', tab: 'qada', color: '#b45309' },
    { title: t('qiblaCompassTitle', 'Qibla Direction Compass'), desc: t('qiblaCompassDesc', 'Accurate live Qibla direction for your exact location.'), icon: 'fas fa-compass', tab: 'qibla', color: '#0d9488' },
    { title: t('khatamTrackerTitle', '30-Day Khatam Tracker'), desc: t('khatamTrackerDesc', 'Track your daily Juz reading progress to complete Quran.'), icon: 'fas fa-calendar-check', tab: 'khatam', color: '#b45309' },
    { title: t('masnoonDuasTitle', 'Masnoon Duas & Azkar'), desc: t('masnoonDuasDesc', 'Morning & evening Azkar with audio recitations.'), icon: 'fas fa-hands', tab: 'duas', color: '#059669' },
    { title: t('digitalTasbeehTitle', 'Digital Tasbeeh Counter'), desc: t('digitalTasbeehDesc', 'Count your daily Zikr, Salawat, and Istighfar.'), icon: 'fas fa-hand-holding-heart', tab: 'tasbeeh', color: '#7c3aed' },
    { title: t('namesOfAllahTitle', '99 Beautiful Names of Allah'), desc: t('namesOfAllahDesc', 'Asma-ul-Husna with English & Urdu meanings.'), icon: 'fas fa-star', tab: 'namesOfAllah', color: '#d97706' },
    { title: t('fazailQuranTitle', 'Virtues of Quran (Fazail)'), desc: t('fazailQuranDesc', 'Virtues and rewards of reciting Quran Majeed.'), icon: 'fas fa-book-reader', tab: 'fazail', color: '#2563eb' },
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', minHeight: '80vh' }}>
      <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
          <i className="fas fa-clock" style={{ color: 'var(--accent-gold)', marginRight: '0.6rem' }}></i> {t('prayerToolsTitle', 'Daily Prayer Times & Spiritual Tools')}
        </h1>
        <p style={{ color: '#78716c', fontSize: '0.92rem', marginTop: '0.35rem' }}>
          {t('prayerToolsDesc', 'Accurate prayer times, live digital clock, Qibla finder, daily Zikr tools, and Khatam tracker.')}
        </p>
      </div>

      {/* Main Prayer Times & Live Widget */}
      <section style={{ marginBottom: '2rem' }}>
        <PrayerTimesWidget />
      </section>

      {/* Featured Banner: Asan Nimaz Guide */}
      <div
        onClick={() => navigateToTab && navigateToTab('asanNimaz')}
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem 2rem',
          marginBottom: '3rem',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(6,78,59,0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          transition: 'transform 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', color: '#fde68a' }}>
            <i className="fas fa-mosque" />
          </div>
          <div>
            <span style={{ background: '#f59e0b', color: '#78350f', padding: '2px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900 }}>نئی خصوصیت • Featured</span>
            <h3 style={{ margin: '4px 0 2px 0', fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>
              آسان نماز اور مکمل مسنون احکام (Asan Nimaz Guide)
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#d1fae5' }}>
              نماز کا مرحلہ وار طریقہ، ۵ نمازوں کی رکعتیں، وضو، غسل، جنازہ، قبرستان اور مسنون دعائیں
            </p>
          </div>
        </div>

        <button
          type="button"
          style={{
            background: 'var(--surface-paper)',
            color: '#064e3b',
            border: 'none',
            padding: '10px 22px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <span>کھولیں (Open Guide)</span>
          <i className="fas fa-arrow-right" />
        </button>
      </div>

      {/* Spiritual Tools Cards */}
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1c1917', marginBottom: '1.5rem', textAlign: 'center' }}>
          <i className="fas fa-th-large" style={{ color: '#b45309', marginRight: '0.5rem' }}></i> {t('spiritualToolsHeader', 'Daily Islamic Spiritual Tools')}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' }}>
          {tools.map((item, idx) => (
            <div
              key={idx}
              className="card"
              onClick={() => navigateToTab && navigateToTab(item.tab)}
              style={{
                padding: '1.5rem',
                borderRadius: '20px',
                background: 'var(--surface-paper)',
                border: '1.5px solid #e7e5e4',
                boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',  // Note: use justifyContent for flexbox — kept for legacy compat
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: `${item.color}15`, color: item.color, border: `1.5px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', marginBottom: '1rem' }}>
                  <i className={item.icon}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1c1917', marginBottom: '0.4rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#686461', lineHeight: '1.5' }}>{item.desc}</p>
              </div>

              <button
                className="btn-play"
                style={{ marginTop: '1.25rem', padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '20px', background: 'var(--surface-paper)', color: item.color, border: `1.5px solid ${item.color}`, fontWeight: 800, width: '100%', justifyContent: 'center' }}
              >
                {t('openTool', 'Open Tool')} <i className="fas fa-arrow-right" style={{ marginLeft: '0.35rem' }}></i>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
