import React, { useEffect, useState } from 'react';
import PrayerTimesWidget from '../components/PrayerTimesWidget';

export default function HomeView({ navigateToTab, setActiveTab, playTrack, openVideoModal }) {
  const handleNav = (tab) => {
    if (typeof navigateToTab === 'function') navigateToTab(tab);
    else if (typeof setActiveTab === 'function') setActiveTab(tab);
  };
  const [stats, setStats] = useState({ total_audios: 7, total_videos: 3, total_books: 3, total_hadiths: 3 });
  const [audios, setAudios] = useState([]);
  const [videos, setVideos] = useState([]);
  const [books, setBooks] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [lastRead, setLastRead] = useState(null);

  useEffect(() => {
    // Check local storage for last read position
    const saved = localStorage.getItem('quranLastRead');
    if (saved) {
      try {
        setLastRead(JSON.parse(saved));
      } catch (e) {}
    }

    fetch('/api/stats/')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});

    fetch('/api/quran/?featured=1')
      .then(res => res.json())
      .then(data => setAudios(data.results || []))
      .catch(() => {});

    fetch('/api/videos/?page=1')
      .then(res => res.json())
      .then(data => setVideos(data.results ? data.results.slice(0, 2) : []))
      .catch(() => {});

    fetch('/api/books/?page=1')
      .then(res => res.json())
      .then(data => setBooks(data.results ? data.results.slice(0, 2) : []))
      .catch(() => {});

    fetch('/api/hadith/?page=1')
      .then(res => res.json())
      .then(data => setHadiths(data.results ? data.results.slice(0, 2) : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 60%, #047857 100%)', color: '#fff', padding: '4rem 2rem', textAlign: 'center', borderBottom: '4px solid #f59e0b', position: 'relative', overflow: 'hidden' }}>
        <h2 className="arabic-font" style={{ fontSize: '2.8rem', color: '#f59e0b', marginBottom: '0.75rem' }}>اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</h2>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0 1rem 0', letterSpacing: '-0.5px' }}>Discover, Listen & Learn The Holy Quran</h1>
        <p style={{ color: '#e2e8f0', maxWidth: '750px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>Modern React + Django Full-Stack Application for Quran Audio Recitations, Interactive Reading, Multi-Language Translations, Video Lectures, PDF Books & Authentic Hadiths.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="/read"
            className="btn-play"
            style={{ padding: '0.75rem 1.8rem', fontSize: '1rem', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              handleNav('read');
            }}
          >
            <i className="fas fa-book-open"></i> Start Reading Quran
          </a>
          <a
            href="/quran"
            className="btn-play"
            style={{
              padding: '0.75rem 1.8rem',
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              textDecoration: 'none'
            }}
            onClick={(e) => {
              e.preventDefault();
              handleNav('quran');
            }}
          >
            <i className="fas fa-headphones"></i> Listen Quran MP3
          </a>
        </div>

        {/* Stats Grid */}
        <div className="container" style={{ margin: '3rem auto 0 auto', padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#f59e0b' }}>{stats.total_audios}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Quran Recitations</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#f59e0b' }}>{stats.total_videos}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Video Lectures</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#f59e0b' }}>{stats.total_books}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>PDF Books Library</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#f59e0b' }}>{stats.total_hadiths}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Hadith Collections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Prayer Times & Hijri Date Widget */}
      <section className="container" style={{ marginTop: '2rem' }}>
        <PrayerTimesWidget />
      </section>

      {/* Continue Reading Quick Banner if saved position exists */}
      {lastRead && (
        <section className="container" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
            border: '1px solid #fde68a',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--accent-gold)', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fas fa-bookmark"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '1.05rem', fontWeight: 800 }}>
                  Resume Reading: Surah {lastRead.surahName} (Ayah {lastRead.ayahNumber})
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#78350f' }}>
                  Saved position from your recent reading session.
                </p>
              </div>
            </div>

            <a
              href="/read"
              className="btn-play"
              onClick={(e) => {
                e.preventDefault();
                handleNav('read');
              }}
              style={{ background: 'var(--primary-dark)', padding: '0.6rem 1.4rem', textDecoration: 'none' }}
            >
              <i className="fas fa-arrow-right"></i> Continue Reading
            </a>
          </div>
        </section>
      )}

      {/* Featured Audio Recitations */}
      <section className="container">
        <div className="section-header">
          <h2 className="section-title"><i className="fas fa-volume-up" style={{ color: 'var(--accent-gold)' }}></i> Featured Audio Recitations</h2>
          <a
            href="/quran"
            className="btn-link"
            onClick={(e) => {
              e.preventDefault();
              handleNav('quran');
            }}
          >
            View All Audio <i className="fas fa-arrow-right"></i>
          </a>
        </div>

        <div className="grid-3">
          {audios.map((item) => (
            <div key={item.id} className="card">
              <div className="card-header-badge">
                <span className="surah-number-badge">{item.surah_number}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)', background: 'var(--accent-gold-light)', padding: '2px 10px', borderRadius: '12px' }}>{item.revelation_place}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">Surah {item.surah_name_english}</h3>
                <p className="arabic-font card-arabic">{item.surah_name_arabic}</p>
                <p className="card-subtitle"><i className="fas fa-user-alt"></i> {item.reciter}</p>
              </div>
              <div className="card-footer">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><i className="far fa-clock"></i> {item.duration}</span>
                <button className="btn-play" onClick={() => playTrack(item.audio_url, `Surah ${item.surah_name_english}`, item.reciter)}>
                  <i className="fas fa-play"></i> Play Audio
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Video Lectures & Books */}
      <section className="container">
        <div className="grid-2">
          {/* Featured Videos */}
          <div>
            <div className="section-header">
              <h2 className="section-title"><i className="fas fa-video" style={{ color: 'var(--accent-gold)' }}></i> Video Lectures</h2>
              <a
                href="/videos"
                className="btn-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('videos');
                }}
              >
                View All <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {videos.map((vid) => (
                <div key={vid.id} className="card" style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <div className="media-cover-wrapper" style={{ width: '160px', height: '110px', flexShrink: 0 }}>
                    <img src={vid.thumbnail_url || "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=500&q=80"} alt={vid.title} className="media-cover-img" />
                    <div className="media-play-overlay" onClick={() => openVideoModal(vid.title, vid.video_url)}>
                      <button className="play-icon-lg" style={{ width: '38px', height: '38px', fontSize: '1rem' }}><i className="fas fa-play"></i></button>
                    </div>
                  </div>
                  <div style={{ padding: '1rem', flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{vid.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)', margin: '0.25rem 0' }}>{vid.speaker}</p>
                    <button className="btn-play" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', marginTop: '0.4rem' }} onClick={() => openVideoModal(vid.title, vid.video_url)}>
                      <i className="fas fa-play"></i> Watch Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Books */}
          <div>
            <div className="section-header">
              <h2 className="section-title"><i className="fas fa-book" style={{ color: 'var(--accent-gold)' }}></i> PDF Books Library</h2>
              <a
                href="/books"
                className="btn-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('books');
                }}
              >
                View All <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {books.map((bk) => (
                <div key={bk.id} className="card" style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <div className="media-cover-wrapper" style={{ width: '100px', height: '110px', flexShrink: 0 }}>
                    <img src={bk.cover_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80"} alt={bk.title} className="media-cover-img" />
                  </div>
                  <div style={{ padding: '1rem', flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{bk.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>By {bk.author}</p>
                    <a href={bk.document_url} target="_blank" rel="noreferrer" className="btn-play" style={{ display: 'inline-flex', padding: '0.3rem 0.8rem', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                      <i className="fas fa-file-pdf"></i> Read PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hadith Spotlight */}
      <section className="container" style={{ marginBottom: '3rem' }}>
        <div className="section-header">
          <h2 className="section-title"><i className="fas fa-scroll" style={{ color: 'var(--accent-gold)' }}></i> Hadith Spotlight</h2>
          <a
            href="/hadith"
            className="btn-link"
            onClick={(e) => {
              e.preventDefault();
              handleNav('hadith');
            }}
          >
            Explore Hadiths <i className="fas fa-arrow-right"></i>
          </a>
        </div>
        <div className="grid-2">
          {hadiths.map((h) => (
            <div key={h.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', background: 'var(--accent-gold-light)', padding: '2px 10px', borderRadius: '12px' }}>{h.book_name} #{h.hadith_number}</span>
                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>{h.grade}</span>
              </div>
              <p className="arabic-font" style={{ fontSize: '1.3rem', color: 'var(--primary-emerald)', lineHeight: '1.8', marginBottom: '0.75rem' }}>{h.arabic_text}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic' }}>"{h.translation}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
