import React, { useState } from 'react';

export default function TasbeehView() {
  const dhikrPresets = [
    { id: 'subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'Subhanallah', meaning: 'Glory be to Allah', target: 33 },
    { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', meaning: 'Praise be to Allah', target: 33 },
    { id: 'allahuakbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest', target: 34 },
    { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', transliteration: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah', target: 100 },
    { id: 'lailahaillallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', transliteration: 'La ilaha illallah', meaning: 'There is no god but Allah', target: 100 },
    { id: 'salawat', arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', transliteration: 'Allahumma Salli Ala Muhammad', meaning: 'O Allah, send blessings upon Muhammad', target: 100 }
  ];

  const [selectedDhikr, setSelectedDhikr] = useState(dhikrPresets[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio context fallback
    }
  };

  const handleIncrement = () => {
    playClickSound();
    const nextCount = count + 1;
    setCount(nextCount);

    if (nextCount >= target) {
      setTotalCompleted(prev => prev + 1);
      // Play completion chime
      if (soundEnabled) {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } catch (e) {}
      }
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleSelectDhikr = (d) => {
    setSelectedDhikr(d);
    setTarget(d.target);
    setCount(0);
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem', maxWidth: '750px' }}>
      {/* Header */}
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>
          <i className="fas fa-hand-holding-heart" style={{ color: 'var(--accent-gold)' }}></i> Digital Tasbeeh & Dhikr Counter
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Remember Allah abundantly with your interactive digital counter. Select a supplication or customize your target.
        </p>
      </div>

      {/* Preset Dhikr Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {dhikrPresets.map((d) => (
          <button
            key={d.id}
            onClick={() => handleSelectDhikr(d)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '25px',
              border: selectedDhikr.id === d.id ? '2px solid var(--accent-gold)' : '1.5px solid #cbd5e1',
              background: selectedDhikr.id === d.id ? 'rgba(245, 158, 11, 0.2)' : '#ffffff',
              color: selectedDhikr.id === d.id ? '#b45309' : '#0f172a',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            {d.transliteration} ({d.target})
          </button>
        ))}
      </div>

      {/* Main Counter Display Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-emerald) 0%, var(--primary-dark) 100%)',
        borderRadius: '24px',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        color: '#ffffff',
        border: '3px solid var(--accent-gold)',
        boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 className="arabic-font" style={{ fontSize: '3rem', color: 'var(--accent-gold)', margin: '0 0 0.3rem 0', direction: 'rtl' }}>
            {selectedDhikr.arabic}
          </h2>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: '#f8fafc' }}>
            {selectedDhikr.transliteration}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0 }}>
            "{selectedDhikr.meaning}"
          </p>
        </div>

        {/* Counter Circle Display */}
        <div
          onClick={handleIncrement}
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(245,158,11,0.05) 70%)',
            border: '4px solid var(--accent-gold)',
            margin: '1.5rem auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(245,158,11,0.35)',
            userSelect: 'none',
            transition: 'transform 0.1s ease'
          }}
          className="tasbeeh-click-circle"
        >
          <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#ffffff', lineHeight: '1' }}>
            {count}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, marginTop: '0.25rem' }}>
            Target: {target}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          Tap circle or press spacebar to count
        </p>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              border: '1px solid rgba(248,113,113,0.5)',
              background: 'rgba(248,113,113,0.15)',
              color: '#f87171',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            <i className="fas fa-undo"></i> Reset Count
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)',
              color: soundEnabled ? 'var(--accent-gold)' : '#94a3b8',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            <i className={`fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`}></i> {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>

          <select
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '20px',
              border: '1px solid rgba(245,158,11,0.4)',
              background: '#0f172a',
              color: 'var(--accent-gold)',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            <option value={33}>Target: 33</option>
            <option value={100}>Target: 100</option>
            <option value={500}>Target: 500</option>
            <option value={1000}>Target: 1000</option>
          </select>
        </div>
      </div>

      {/* Completion Counter Footer */}
      <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
          🏆 Total Completed Rounds Today: <span style={{ color: 'var(--accent-gold-dark)', fontSize: '1.1rem' }}>{totalCompleted}</span>
        </p>
      </div>
    </div>
  );
}
