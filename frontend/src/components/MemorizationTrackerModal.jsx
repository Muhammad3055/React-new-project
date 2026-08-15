import React, { useState, useEffect } from 'react';
import { Award, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SURAHS_LIST = [
  { number: 1, name: 'Al-Fatiha', ayahs: 7, juz: 1 },
  { number: 2, name: 'Al-Baqarah', ayahs: 286, juz: 1 },
  { number: 3, name: 'Ali \'Imran', ayahs: 200, juz: 3 },
  { number: 36, name: 'Ya-Sin', ayahs: 83, juz: 22 },
  { number: 55, name: 'Ar-Rahman', ayahs: 78, juz: 27 },
  { number: 56, name: 'Al-Waqi\'ah', ayahs: 96, juz: 27 },
  { number: 67, name: 'Al-Mulk', ayahs: 30, juz: 29 },
  { number: 78, name: 'An-Naba\'', ayahs: 40, juz: 30 },
  { number: 112, name: 'Al-Ikhlas', ayahs: 4, juz: 30 },
  { number: 113, name: 'Al-Falaq', ayahs: 5, juz: 30 },
  { number: 114, name: 'An-Nas', ayahs: 6, juz: 30 },
];

export default function MemorizationTrackerModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [hifzData, setHifzData] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchHifzRecords();
    }
  }, [isOpen]);

  const fetchHifzRecords = async () => {
    try {
      const res = await fetch('/api/hifz/');
      const data = await res.json();
      if (data.records) {
        const map = {};
        data.records.forEach(r => { map[r.surah_number] = r.status; });
        setHifzData(map);
      }
    } catch (e) {
      console.log('Using local hifz data fallback');
    }
  };

  const updateStatus = async (surahNumber, surahName, newStatus) => {
    setHifzData(prev => ({ ...prev, [surahNumber]: newStatus }));
    try {
      await fetch('/api/hifz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surah_number: surahNumber, surah_name: surahName, status: newStatus })
      });
    } catch (e) {
      console.log('Error updating hifz status');
    }
  };

  if (!isOpen) return null;

  const countMemorized = Object.values(hifzData).filter(s => s === 'memorized').length;
  const countInProgress = Object.values(hifzData).filter(s => s === 'in_progress').length;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #064e3b 50%, #022c22 100%)',
        color: '#f8fafc',
        borderRadius: '24px',
        border: '1.5px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '750px',
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(6, 78, 59, 0.4)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ecfdf5' }}>{t('hifzTracker', 'Hifz Quran Memorization Tracker')}</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#6ee7b7' }}>Track Memorized Surahs & Revision Schedules</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#cbd5e1', borderRadius: '12px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid #1e293b', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ padding: '0.75rem', borderRadius: '16px', background: 'rgba(6, 78, 59, 0.5)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', display: 'block' }}>{countMemorized}</span>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Memorized</span>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: '16px', background: 'rgba(19, 78, 74, 0.5)', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2dd4bf', display: 'block' }}>{countInProgress}</span>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>In Progress</span>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: '16px', background: 'rgba(2, 44, 34, 0.5)', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f1f5f9', display: 'block' }}>114</span>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Total Surahs</span>
          </div>
        </div>

        {/* Surahs Grid */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {SURAHS_LIST.map((surah) => {
            const status = hifzData[surah.number] || 'not_started';
            return (
              <div 
                key={surah.number}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #1e293b' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#022c22', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#34d399', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {surah.number}
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 800, color: '#f8fafc', fontSize: '0.92rem' }}>{surah.name}</h5>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{surah.ayahs} Ayahs • Juz {surah.juz}</span>
                  </div>
                </div>

                <div>
                  <select
                    value={status}
                    onChange={(e) => updateStatus(surah.number, surah.name, e.target.value)}
                    style={{ background: '#022c22', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', fontSize: '0.78rem', color: '#6ee7b7', padding: '0.35rem 0.65rem', outline: 'none', fontWeight: 700, cursor: 'pointer' }}
                  >
                    <option value="not_started">⚪ Not Started</option>
                    <option value="in_progress">🟡 In Progress</option>
                    <option value="revision">🟠 Needs Revision</option>
                    <option value="memorized">🟢 Memorized</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
