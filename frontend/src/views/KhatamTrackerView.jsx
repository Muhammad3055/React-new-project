import React, { useState, useEffect } from 'react';
import { ALL_30_JUZ } from '../data/juz_data';

export default function KhatamTrackerView({ navigateToTab, user, openAuthModal }) {
  const [completedJuz, setCompletedJuz] = useState(() => {
    try {
      const saved = localStorage.getItem('khatam_quran_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [khatamTargetDays, setKhatamTargetDays] = useState(30);

  useEffect(() => {
    try {
      localStorage.setItem('khatam_quran_progress', JSON.stringify(completedJuz));
    } catch (e) {}
  }, [completedJuz]);

  const toggleJuzComplete = (juzId) => {
    setCompletedJuz(prev => ({
      ...prev,
      [juzId]: !prev[juzId]
    }));
  };

  const completedCount = Object.keys(completedJuz).filter(k => completedJuz[k]).length;
  const progressPercent = Math.round((completedCount / 30) * 100);

  const resetTracker = () => {
    if (window.confirm("Are you sure you want to reset your 30-Day Khatam progress?")) {
      setCompletedJuz({});
    }
  };

  const startNewKhatam = () => {
    if (window.confirm("Congratulations on completing your Khatam! Would you like to reset and start a fresh 30-Day Khatam Quran journey?")) {
      setCompletedJuz({});
    }
  };

  return (
    <div className="container" style={{ margin: '1.5rem auto' }}>

      {/* ===== HERO BANNER ===== */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', color: '#ffffff', border: '2px solid var(--accent-gold)', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', tracking: '1px', fontWeight: 800, background: 'rgba(245,158,11,0.2)', color: 'var(--accent-gold)', padding: '3px 10px', borderRadius: '14px', border: '1px solid var(--accent-gold)' }}>
              <i className="fas fa-calendar-check"></i> 30-Day Planner
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.4rem', marginBottom: '0.2rem' }}>
              Khatam Quran 30-Day Progress Tracker
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', maxWidth: '650px' }}>
              Complete the Holy Quran in 30 days by reading 1 Juz (approx. 20 pages) daily. Track your progress, mark daily Juz as finished, and study with English, Urdu & Brahui translations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="auth-btn login-btn"
              onClick={() => navigateToTab('read')}
              style={{ background: 'var(--accent-gold)', color: 'var(--primary-dark)', fontWeight: 800 }}
            >
              <i className="fas fa-book-open"></i> Read Quran Now
            </button>
            {completedCount === 30 ? (
              <button
                className="auth-btn signup-btn"
                onClick={startNewKhatam}
                style={{ background: '#10b981', color: '#fff' }}
              >
                <i className="fas fa-trophy"></i> Start New Khatam
              </button>
            ) : (
              <button
                onClick={resetTracker}
                style={{ padding: '0.6rem 1.1rem', borderRadius: '25px', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <i className="fas fa-redo-alt"></i> Reset Progress
              </button>
            )}
          </div>
        </div>

        {/* STATS DASHBOARD BAR */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          
          {/* Progress Card */}
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(245,158,11,0.25)' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: 700 }}>Overall Completion</p>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)', margin: '0.2rem 0' }}>
              {completedCount} <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>/ 30 Juz ({progressPercent}%)</span>
            </h3>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', overflow: 'hidden', marginTop: '0.4rem' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #10b981)', transition: 'width 0.4s ease' }}></div>
            </div>
          </div>

          {/* Remaining Card */}
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: 700 }}>Remaining Juz</p>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0' }}>
              {30 - completedCount} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Juz Left</span>
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#10b981', margin: 0, fontWeight: 600 }}>
              <i className="fas fa-check-circle"></i> Target: 1 Juz Daily (~20 pgs)
            </p>
          </div>

          {/* Target Goal Card */}
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: 700 }}>Planner Schedule</p>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0' }}>
              30 Days <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Plan</span>
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', margin: 0, fontWeight: 600 }}>
              <i className="fas fa-star"></i> Ramadan & Daily Khatam
            </p>
          </div>

          {/* Dynamic Badge Card */}
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: 700 }}>Status Level</p>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: completedCount === 30 ? '#10b981' : 'var(--accent-gold)', margin: '0.35rem 0' }}>
              {completedCount === 30 ? '🏆 Khatam Complete!' : (completedCount > 15 ? '🌟 Halfway Completed!' : (completedCount > 0 ? '📖 Reading in Progress' : '🚀 Ready to Begin'))}
            </h3>
          </div>

        </div>
      </div>

      {/* ===== 30-DAY JUZ GRID ===== */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-th-large"></i> Daily 30 Juz Schedule Map
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Click checkbox to mark completed
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {ALL_30_JUZ.map((juz) => {
          const isDone = !!completedJuz[juz.id];

          return (
            <div
              key={juz.id}
              className="card"
              style={{
                padding: '1.1rem',
                border: isDone ? '2px solid #10b981' : '1px solid #e2e8f0',
                background: isDone ? 'rgba(16, 185, 129, 0.05)' : '#ffffff',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isDone ? '#047857' : 'var(--accent-gold)', background: isDone ? 'rgba(16,185,129,0.15)' : '#fef3c7', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '0.3rem' }}>
                    Day {juz.id} &bull; Juz {juz.id}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                    Juz {juz.id}: <span style={{ color: 'var(--text-main)' }}>{juz.nameTranslit}</span>
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="arabic-font" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-emerald)' }}>
                    {juz.nameArabic}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.6rem 0 0.8rem 0' }}>
                <i className="fas fa-book-open" style={{ color: 'var(--accent-gold)' }}></i> {juz.surahRange}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                {/* 1-Click Checkbox Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: isDone ? '#047857' : 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleJuzComplete(juz.id)}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <span>{isDone ? 'Finished ✓' : 'Mark Completed'}</span>
                </label>

                {/* Read Juz Button */}
                <button
                  onClick={() => navigateToTab('read')}
                  title={`Read Juz ${juz.id}`}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '16px',
                    border: '1px solid var(--primary-emerald)',
                    background: 'var(--primary-dark)',
                    color: 'var(--accent-gold)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <i className="fas fa-book"></i> Read
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
