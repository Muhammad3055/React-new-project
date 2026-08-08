import React from 'react';
import PrayerTimesWidget from '../components/PrayerTimesWidget';

export default function PrayersView({ navigateToTab }) {
  const tools = [
    { title: 'Qibla Direction Compass', desc: 'Accurate live Qibla direction for your exact location.', icon: 'fas fa-compass', tab: 'qibla', color: '#0d9488' },
    { title: '30-Day Khatam Tracker', desc: 'Track your daily Juz reading progress to complete Quran.', icon: 'fas fa-calendar-check', tab: 'khatam', color: '#b45309' },
    { title: 'Masnoon Duas & Azkar', desc: 'Morning & evening Azkar with audio recitations.', icon: 'fas fa-hands', tab: 'duas', color: '#059669' },
    { title: 'Digital Tasbeeh Counter', desc: 'Count your daily Zikr, Salawat, and Istighfar.', icon: 'fas fa-hand-holding-heart', tab: 'tasbeeh', color: '#7c3aed' },
    { title: '99 Beautiful Names of Allah', desc: 'Asma-ul-Husna with English & Urdu meanings.', icon: 'fas fa-star', tab: 'namesOfAllah', color: '#d97706' },
    { title: 'Virtues of Quran (Fazail)', desc: 'Virtues and rewards of reciting Quran Majeed.', icon: 'fas fa-book-reader', tab: 'fazail', color: '#2563eb' },
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', minHeight: '80vh' }}>
      <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
          <i className="fas fa-clock" style={{ color: 'var(--accent-gold)', marginRight: '0.6rem' }}></i> Daily Prayer Times & Spiritual Tools
        </h1>
        <p style={{ color: '#78716c', fontSize: '0.92rem', marginTop: '0.35rem' }}>
          Accurate prayer times, live digital clock, Qibla finder, daily Zikr tools, and Khatam tracker.
        </p>
      </div>

      {/* Main Prayer Times & Live Widget */}
      <section style={{ marginBottom: '3rem' }}>
        <PrayerTimesWidget />
      </section>

      {/* Spiritual Tools Cards */}
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1c1917', marginBottom: '1.5rem', textAlign: 'center' }}>
          <i className="fas fa-th-large" style={{ color: '#b45309', marginRight: '0.5rem' }}></i> Daily Islamic Spiritual Tools
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {tools.map((item, idx) => (
            <div
              key={idx}
              className="card"
              onClick={() => navigateToTab && navigateToTab(item.tab)}
              style={{
                padding: '1.5rem',
                borderRadius: '20px',
                background: '#ffffff',
                border: '1.5px solid #e7e5e4',
                boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
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
                style={{ marginTop: '1.25rem', padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '20px', background: '#ffffff', color: item.color, border: `1.5px solid ${item.color}`, fontWeight: 800, width: '100%', justifyContent: 'center' }}
              >
                Open Tool <i className="fas fa-arrow-right" style={{ marginLeft: '0.35rem' }}></i>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
