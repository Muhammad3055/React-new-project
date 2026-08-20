import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Moon, Sun, Clock, Calendar, CheckSquare, Sparkles, Heart, BookOpen, Volume2 } from 'lucide-react';

export default function RamadanView() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('planner'); // 'planner', 'duas', 'fidyah'

  const [completedDays, setCompletedDays] = useState([1, 2, 3, 4, 5]);

  const toggleDay = (dayNum) => {
    setCompletedDays(prev => prev.includes(dayNum) ? prev.filter(d => d !== dayNum) : [...prev, dayNum]);
  };

  const ramadanDuas = [
    { title: 'Dua at Suhoor (Sehri Niyyah)', arabic: 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ', trans: 'Wa bisawmi ghadin nawaitu min shahri Ramadan', meaning: 'I intend to keep the fast tomorrow for the month of Ramadan.' },
    { title: 'Dua at Iftar (Breaking Fast)', arabic: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ', trans: 'Allahumma inni laka sumtu wa bika aamantu wa alaika tawakkaltu wa ala rizqika aftartu', meaning: 'O Allah, I fasted for You, I believe in You, put my trust in You, and break my fast with Your provision.' },
    { title: 'Dua for Laylatul Qadr (Night of Power)', arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', trans: 'Allahumma innaka \'afuwun tuhibbul \'afwa fa\'fu \'anni', meaning: 'O Allah, You are Most Forgiving, and You love forgiveness, so forgive me.' }
  ];

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Moon size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Blessed Month Hub
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Ramadan Mubarak Hub &amp; Fasting Tracker
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Track your 30-day fasts, Taraweeh prayers, Laylatul Qadr supplications, Suhoor &amp; Iftar timing guides.
          </p>
        </div>

        {/* ── 30-Day Ramadan Fasting Tracker Grid ── */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>30-Day Fasting Progress</h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.88rem', color: '#64748b' }}>Click on a day to mark fast completed</p>
            </div>
            <div style={{ background: '#059669', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.9rem' }}>
              {completedDays.length} / 30 Days Completed
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(65px, 1fr))', gap: '0.75rem' }}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
              const isDone = completedDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  style={{
                    height: '65px', borderRadius: '16px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer',
                    background: isDone ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#f8fafc',
                    color: isDone ? '#ffffff' : '#475569',
                    border: isDone ? 'none' : '1.5px solid #cbd5e1',
                    boxShadow: isDone ? '0 4px 12px rgba(5,150,105,0.3)' : 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                  }}
                >
                  <span>Day {day}</span>
                  {isDone && <span style={{ fontSize: '0.7rem', color: '#fcd34d' }}>✓ Done</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Ramadan Duas Section ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {ramadanDuas.map((dua, idx) => (
            <div key={idx} style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>Authentic Supplication</span>
              <h3 style={{ margin: '0.3rem 0 0.75rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{dua.title}</h3>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'Amiri, serif', color: '#022c22', textAlign: 'right', marginBottom: '0.75rem', lineHeight: 1.8 }}>
                {dua.arabic}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#d97706', marginBottom: '0.4rem' }}>{dua.trans}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>"{dua.meaning}"</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
