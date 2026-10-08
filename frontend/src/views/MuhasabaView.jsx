import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function MuhasabaView() {
  const { lang, t } = useLanguage();
  
  const [todayTasks, setTodayTasks] = useState({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    quran: false,
    azkar: false,
    sadaqah: false
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('maktaba_muhasaba') || '{}');
    const today = new Date().toISOString().split('T')[0];
    
    if (savedData[today]) {
      setTodayTasks(savedData[today]);
    } else {
      // New day, reset
      savedData[today] = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, quran: false, azkar: false, sadaqah: false };
      localStorage.setItem('maktaba_muhasaba', JSON.stringify(savedData));
    }

    // Process history for heatmap
    const hist = [];
    const dateKeys = Object.keys(savedData).sort((a,b) => new Date(a) - new Date(b));
    for (let key of dateKeys) {
      const dayTasks = savedData[key];
      const completed = Object.values(dayTasks).filter(Boolean).length;
      hist.push({ date: key, completed });
    }
    setHistory(hist.slice(-30)); // Last 30 days
  }, []);

  const toggleTask = (task) => {
    const updated = { ...todayTasks, [task]: !todayTasks[task] };
    setTodayTasks(updated);

    const savedData = JSON.parse(localStorage.getItem('maktaba_muhasaba') || '{}');
    const today = new Date().toISOString().split('T')[0];
    savedData[today] = updated;
    localStorage.setItem('maktaba_muhasaba', JSON.stringify(savedData));

    // Update history immediately for UI
    setHistory(prev => {
      const newHist = [...prev];
      const completed = Object.values(updated).filter(Boolean).length;
      if (newHist.length > 0 && newHist[newHist.length - 1].date === today) {
        newHist[newHist.length - 1].completed = completed;
      }
      return newHist;
    });
  };

  const score = Object.values(todayTasks).filter(Boolean).length;
  const total = 8;
  const percentage = Math.round((score / total) * 100);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem', direction: lang === 'ur' || lang === 'ar' || lang === 'br' ? 'rtl' : 'ltr' }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #042f2e 100%)',
        borderRadius: '20px', padding: '2.5rem 2rem', display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', color: '#10b981', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
            <i className="fas fa-tasks"></i> Daily Muhasaba
          </h1>
          <p style={{ margin: 0, color: '#ccfbf1', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Hold yourself accountable. Track your daily prayers, Quran recitation, and spiritual habits. Consistent small deeds are most beloved to Allah.
          </p>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '50%', width: '120px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '4px solid #10b981' }}>
          <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{percentage}%</span>
          <span style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase', fontWeight: 700 }}>Today</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Checklist */}
        <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#38bdf8', fontSize: '1.3rem', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
            Today's Checklist
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { id: 'fajr', label: 'Fajr Prayer', icon: 'fas fa-cloud-sun' },
              { id: 'dhuhr', label: 'Dhuhr Prayer', icon: 'fas fa-sun' },
              { id: 'asr', label: 'Asr Prayer', icon: 'fas fa-sun' },
              { id: 'maghrib', label: 'Maghrib Prayer', icon: 'fas fa-sunset' },
              { id: 'isha', label: 'Isha Prayer', icon: 'fas fa-moon' },
              { id: 'quran', label: 'Read Quran (1 Page min)', icon: 'fas fa-book-open' },
              { id: 'azkar', label: 'Morning/Evening Azkar', icon: 'fas fa-pray' },
              { id: 'sadaqah', label: 'Sadaqah (Even a smile)', icon: 'fas fa-hand-holding-heart' }
            ].map(task => (
              <label key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                background: todayTasks[task.id] ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.2)',
                border: todayTasks[task.id] ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s'
              }}>
                <input 
                  type="checkbox" 
                  checked={todayTasks[task.id]} 
                  onChange={() => toggleTask(task.id)} 
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#10b981' }}
                />
                <i className={task.icon} style={{ color: todayTasks[task.id] ? '#10b981' : '#94a3b8', fontSize: '1.2rem', width: '24px', textAlign: 'center' }}></i>
                <span style={{ fontSize: '1.05rem', color: todayTasks[task.id] ? '#fff' : '#cbd5e1', fontWeight: todayTasks[task.id] ? 700 : 400, textDecoration: todayTasks[task.id] ? 'line-through' : 'none' }}>
                  {task.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 30 Day Graph */}
        <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#f59e0b', fontSize: '1.3rem', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
            30-Day Activity History
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            A greener box means more daily spiritual habits completed.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {history.map((day, idx) => {
              // color intensity based on score out of 8
              let bg = 'rgba(255,255,255,0.05)';
              if (day.completed > 0) bg = '#064e3b';
              if (day.completed >= 3) bg = '#047857';
              if (day.completed >= 6) bg = '#10b981';
              if (day.completed === 8) bg = '#34d399';

              return (
                <div 
                  key={idx} 
                  title={`${day.date}: ${day.completed}/8 completed`}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px',
                    background: bg, border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'transform 0.2s', cursor: 'help'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                ></div>
              );
            })}
            {history.length === 0 && (
              <div style={{ color: '#64748b', fontSize: '0.9rem', padding: '1rem', fontStyle: 'italic' }}>
                No history yet. Start tracking today!
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Less</span>
            <div style={{ width: '16px', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}></div>
            <div style={{ width: '16px', height: '16px', background: '#064e3b', borderRadius: '3px' }}></div>
            <div style={{ width: '16px', height: '16px', background: '#047857', borderRadius: '3px' }}></div>
            <div style={{ width: '16px', height: '16px', background: '#10b981', borderRadius: '3px' }}></div>
            <div style={{ width: '16px', height: '16px', background: '#34d399', borderRadius: '3px' }}></div>
            <span>More</span>
          </div>

        </div>

      </div>
    </div>
  );
}
