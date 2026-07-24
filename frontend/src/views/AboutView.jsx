import React from 'react';

export default function AboutView({ navigateToTab }) {
  const features = [
    { icon: 'fas fa-book-open', title: '114 Surahs Quran Reader', desc: 'Read the complete Holy Quran with verse-by-verse audio playback, bookmarking, and clear translations.' },
    { icon: 'fas fa-headphones', title: 'HD Audio Recitations', desc: 'Listen to recitations from over 20 world-renowned Qaris in high-definition audio with continuous playback.' },
    { icon: 'fas fa-scroll', title: 'Authentic Hadith Collections', desc: 'Search and study canonical Hadith texts including Sahih al-Bukhari, Sahih Muslim, and Sunan collections.' },
    { icon: 'fas fa-bookmark', title: 'Tafseer & Commentary', desc: 'Gain deeper insights into divine verses with verse-by-verse scholarly explanations and Tafseer.' },
    { icon: 'fas fa-clock', title: 'Live Prayer Times & Hijri Calendar', desc: 'Real-time calculation of daily Nimaz times based on location along with a complete monthly timetable.' },
    { icon: 'fas fa-file-pdf', title: 'Digital PDF Library & Media', desc: 'Access free downloadable Islamic PDF books and curated video lectures by verified Islamic scholars.' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-cream)' }}>
      {/* Hero Header Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #011c16 0%, #022c22 50%, #064e3b 100%)',
        color: '#ffffff',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        borderBottom: '4px solid var(--accent-gold)',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <p className="arabic-font" style={{ fontSize: '2.5rem', color: 'var(--accent-gold)', marginBottom: '0.75rem', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>

        <span style={{
          background: 'rgba(245, 158, 11, 0.15)',
          color: 'var(--accent-gold)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'inline-block',
          marginBottom: '1rem'
        }}>
          About Our Platform
        </span>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0.5rem 0 1rem 0', letterSpacing: '-0.5px' }}>
          Quran Al Kareem
        </h1>
        <p style={{ color: '#e2e8f0', maxWidth: '800px', margin: '0 auto', fontSize: '1.15rem', lineHeight: '1.8' }}>
          A modern, ad-free Islamic digital portal dedicated to facilitating the study, recitation, and understanding of the Holy Quran, authentic Hadiths, Tafseer, and Islamic literature worldwide.
        </p>
      </section>

      {/* Main Container */}
      <div className="container" style={{ marginTop: '3rem', marginBottom: '4rem' }}>
        
        {/* Mission & Vision Cards */}
        <div className="grid-2" style={{ marginBottom: '3.5rem' }}>
          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--primary-emerald)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fas fa-bullseye"></i>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>Our Mission & Vision</h2>
            </div>
            <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
              Our goal is to build an accessible, beautifully crafted, and fast digital ecosystem that connects Muslims and learners of all backgrounds to authentic Islamic teachings.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              We strive to deliver seamless Quranic reading, audio recitations, and scholarly commentary across all devices without distractions or commercialization.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--accent-gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(6, 78, 59, 0.1)', color: 'var(--primary-emerald)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fas fa-star"></i>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>Sadaqah Jariyah Initiative</h2>
            </div>
            <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
              This portal is built purely for the sake of Allah SWT to serve Muslims, students of knowledge, and researchers across all nations.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              All audio recitations, PDF books, Hadith databases, and Tafseer tools are provided completely free of charge without commercial ads.
            </p>
          </div>
        </div>

        {/* Platform Core Features */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', justifyContent: 'center' }}>
              <i className="fas fa-cubes" style={{ color: 'var(--accent-gold)' }}></i> Core Features of Quran Al Kareem
            </h2>
            <div style={{ width: '80px', height: '4px', background: 'var(--accent-gold)', borderRadius: '2px' }}></div>
          </div>

          <div className="grid-3">
            {features.map((f, idx) => (
              <div key={idx} className="card" style={{ padding: '1.75rem', transition: 'all 0.3s ease' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-emerald))', color: 'var(--accent-gold)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1.25rem' }}>
                  <i className={f.icon}></i>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pure Spiritual Dedication Showcase Card */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 15px 35px rgba(2, 44, 34, 0.3)',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
              <p className="arabic-font" style={{ fontSize: '2.2rem', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
                وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا
              </p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
                Dedicated to Serving the Global Ummah
              </h2>
              <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Quran Al Kareem was created with sincere devotion to provide a clean, peaceful, and respectful online space for reading the Word of Allah, listening to authentic recitations, and learning Islamic knowledge.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.75rem 1.75rem', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.3)' }}>
                <i className="fas fa-heart" style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}></i>
                <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>May Allah accept this effort from us and benefit all who use it.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', borderBottom: '4px solid var(--accent-gold)' }}>
              <h3 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)', fontWeight: 800, margin: 0 }}>114</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}>Complete Surahs</p>
            </div>
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', borderBottom: '4px solid var(--primary-emerald)' }}>
              <h3 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)', fontWeight: 800, margin: 0 }}>20+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}>Famous Reciters</p>
            </div>
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', borderBottom: '4px solid var(--accent-gold)' }}>
              <h3 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)', fontWeight: 800, margin: 0 }}>100%</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}>Ad-Free & Free</p>
            </div>
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', borderBottom: '4px solid var(--primary-emerald)' }}>
              <h3 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)', fontWeight: 800, margin: 0 }}>24/7</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}>Digital Access</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="card" style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
          border: '1px solid #fde68a',
          padding: '2.5rem',
          textAlign: 'center',
          borderRadius: '20px'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
            Have Questions or Suggestions?
          </h2>
          <p style={{ color: '#78350f', maxWidth: '600px', margin: '0 auto 1.5rem auto', fontSize: '1rem' }}>
            We welcome feedback, suggestions, and feature requests from our global community.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <a
              href="/contact"
              className="btn-play"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '0.75rem 2.2rem',
                fontSize: '1rem',
                textDecoration: 'none',
                background: 'var(--primary-dark)',
                color: 'var(--accent-gold)'
              }}
              onClick={(e) => {
                e.preventDefault();
                if (typeof navigateToTab === 'function') navigateToTab('contact');
              }}
            >
              <i className="fas fa-envelope"></i> Contact Us Today
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
