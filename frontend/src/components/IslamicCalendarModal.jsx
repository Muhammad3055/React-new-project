import React from 'react';
import { Moon, Calendar, Sparkles, X, Star, Clock } from 'lucide-react';
import { getFormattedHijriDate } from '../utils/hijriDate';

const HIJRI_MONTHS = [
  'Muharram (محرم)', 'Safar (صفر)', 'Rabi al-Awwal (ربيع الأول)', 'Rabi al-Thani (ربيع الثاني)',
  'Jumada al-Awwal (جمادى الأولى)', 'Jumada al-Thani (جمادى الثانية)', 'Rajab (رجب)',
  'Sha\'ban (شعبان)', 'Ramadan (رمضان)', 'Shawwal (شوال)', 'Dhu al-Qi\'dah (ذو القعدة)', 'Dhu al-Hijjah (ذو الحجة)'
];

const ISLAMIC_EVENTS = [
  { name: 'Islamic New Year 1448', hijriDate: '1 Muharram 1448', status: 'Upcoming' },
  { name: 'Day of Ashura', hijriDate: '10 Muharram 1448', status: 'Sunnah Fast' },
  { name: 'Mawlid an-Nabi (ﷺ)', hijriDate: '12 Rabi al-Awwal 1448', status: 'Blessed Day' },
  { name: 'Isra and Mi\'raj', hijriDate: '27 Rajab 1448', status: 'Night Journey' },
  { name: 'Nisfu Sha\'ban', hijriDate: '15 Sha\'ban 1448', status: 'Night of Forgiveness' },
  { name: 'First Day of Ramadan', hijriDate: '1 Ramadan 1448', status: 'Fasting Month' },
  { name: 'Laylat al-Qadr', hijriDate: '27 Ramadan 1448', status: 'Night of Power' },
  { name: 'Eid al-Fitr', hijriDate: '1 Shawwal 1448', status: 'Celebration' },
  { name: 'Day of Arafah', hijriDate: '9 Dhu al-Hijjah 1448', status: 'Hajj Peak Day' },
  { name: 'Eid al-Adha', hijriDate: '10 Dhu al-Hijjah 1448', status: 'Feast of Sacrifice' }
];

export default function IslamicCalendarModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedGregorian = today.toLocaleDateString('en-US', options);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #022c22 0%, #0f172a 100%)',
          border: '2px solid var(--accent-gold)',
          borderRadius: '24px',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(2, 44, 34, 0.95)', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Moon size={22} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>Islamic Hijri Calendar</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>Current Date & Sacred Islamic Events</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Today Banner */}
          <div style={{ padding: '1.25rem', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.3) 0%, rgba(13, 148, 136, 0.2) 100%)', border: '1px solid var(--accent-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#34d399', letterSpacing: '1px' }}>Gregorian & Hijri Date</span>
              <h4 style={{ margin: '0.2rem 0', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{getFormattedHijriDate()}</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0' }}>{formattedGregorian}</p>
            </div>
            <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#fcd34d', fontWeight: 700 }}>Moon Phase</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Waxing Crescent 🌙</div>
            </div>
          </div>

          {/* 12 Sacred Hijri Months Grid */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} /> 12 Sacred Hijri Months
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' }}>
              {HIJRI_MONTHS.map((month, idx) => (
                <div key={idx} style={{ padding: '0.65rem 0.85rem', borderRadius: '12px', background: idx === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)', border: idx === 1 ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.82rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 800, marginRight: '0.4rem' }}>{idx + 1}.</span> {month}
                </div>
              ))}
            </div>
          </div>

          {/* Key Islamic Events */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Important Islamic Events & Fasting Days
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ISLAMIC_EVENTS.map((evt, idx) => (
                <div key={idx} style={{ padding: '0.65rem 1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{evt.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{evt.hijriDate}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(5, 150, 105, 0.3)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '3px 10px', borderRadius: '12px' }}>
                    {evt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
