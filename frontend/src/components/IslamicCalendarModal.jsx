import React, { useState, useEffect } from 'react';
import { Moon, Calendar, Sparkles, X, Clock, MapPin, RefreshCw } from 'lucide-react';
import { getPrayerMethodAndAdjustment } from '../utils/hijriDate';

// ─────────────────────────────────────────────────────────────────────────────
// Hijri Months list
// ─────────────────────────────────────────────────────────────────────────────
const HIJRI_MONTHS = [
  { en: 'Muharram', ar: 'محرم', num: 1 },
  { en: 'Safar', ar: 'صفر', num: 2 },
  { en: "Rabi' al-Awwal", ar: 'ربيع الأول', num: 3 },
  { en: "Rabi' al-Thani", ar: 'ربيع الثاني', num: 4 },
  { en: 'Jumada al-Awwal', ar: 'جمادى الأولى', num: 5 },
  { en: 'Jumada al-Thani', ar: 'جمادى الثانية', num: 6 },
  { en: 'Rajab', ar: 'رجب', num: 7 },
  { en: "Sha'ban", ar: 'شعبان', num: 8 },
  { en: 'Ramadan', ar: 'رمضان', num: 9 },
  { en: 'Shawwal', ar: 'شوال', num: 10 },
  { en: "Dhu al-Qi'dah", ar: 'ذو القعدة', num: 11 },
  { en: 'Dhu al-Hijjah', ar: 'ذو الحجة', num: 12 },
];

const HIJRI_MONTHS_DISPLAY = HIJRI_MONTHS.map(m => `${m.en} (${m.ar})`);

// ─────────────────────────────────────────────────────────────────────────────
// Islamic Events (1447-1448 AH)
// ─────────────────────────────────────────────────────────────────────────────
const ISLAMIC_EVENTS = [
  { name: 'Islamic New Year 1448', hijriDate: '1 Muharram 1448', status: 'Upcoming' },
  { name: 'Day of Ashura', hijriDate: '10 Muharram 1448', status: 'Sunnah Fast' },
  { name: 'Mawlid an-Nabi (ﷺ)', hijriDate: '12 Rabi al-Awwal 1448', status: 'Blessed Day' },
  { name: "Isra and Mi'raj", hijriDate: '27 Rajab 1448', status: 'Night Journey' },
  { name: "Nisfu Sha'ban", hijriDate: "15 Sha'ban 1448", status: 'Night of Forgiveness' },
  { name: 'First Day of Ramadan', hijriDate: '1 Ramadan 1448', status: 'Fasting Month' },
  { name: 'Laylat al-Qadr', hijriDate: '27 Ramadan 1448', status: 'Night of Power' },
  { name: 'Eid al-Fitr', hijriDate: '1 Shawwal 1448', status: 'Celebration' },
  { name: 'Day of Arafah', hijriDate: '9 Dhu al-Hijjah 1448', status: 'Hajj Peak Day' },
  { name: 'Eid al-Adha', hijriDate: '10 Dhu al-Hijjah 1448', status: 'Feast of Sacrifice' }
];

// ─────────────────────────────────────────────────────────────────────────────
// Fetch Hijri date from AlAdhan API (location-aware)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchHijriDate(lat, lon, countryCode) {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const dateStr = `${dd}-${mm}-${yyyy}`;

  const { method, hijriAdjustment } = getPrayerMethodAndAdjustment(countryCode);

  let url = `https://api.aladhan.com/v1/gToH?date=${dateStr}&hijriAdjustment=${hijriAdjustment}`;
  if (lat && lon) {
    url = `https://api.aladhan.com/v1/gToHCalendar/${mm}/${yyyy}?latitude=${lat}&longitude=${lon}&method=${method}&hijriAdjustment=${hijriAdjustment}`;
  }

  const res = await fetch(url);
  const json = await res.json();

  if (lat && lon) {
    // calendar endpoint returns array — find today's day
    const dayNum = today.getDate();
    const entry = json.data && json.data[dayNum - 1];
    return entry ? entry.hijri : null;
  }
  return json.data ? json.data.hijri : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch Ramadan dates for current Hijri year from AlAdhan
// Returns: { start: Date, end: Date } or null
// ─────────────────────────────────────────────────────────────────────────────
async function fetchRamadanDates(hijriYear, lat, lon, countryCode) {
  try {
    const { method, hijriAdjustment } = getPrayerMethodAndAdjustment(countryCode);
    const url = lat && lon
      ? `https://api.aladhan.com/v1/hToGCalendar/9/${hijriYear}?latitude=${lat}&longitude=${lon}&method=${method}&hijriAdjustment=${hijriAdjustment}`
      : `https://api.aladhan.com/v1/hToGCalendar/9/${hijriYear}?hijriAdjustment=${hijriAdjustment}`;

    const res = await fetch(url);
    const json = await res.json();
    if (!json.data || json.data.length === 0) return null;

    const firstDay = json.data[0].gregorian;
    const lastDay = json.data[json.data.length - 1].gregorian;

    const parseGregorian = (g) => new Date(`${g.year}-${String(g.month.number).padStart(2,'0')}-${String(g.day).padStart(2,'0')}`);

    return {
      start: parseGregorian(firstDay),
      end: parseGregorian(lastDay),
      totalDays: json.data.length
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function IslamicCalendarModal({ isOpen, onClose }) {
  const [hijriData, setHijriData] = useState(null);
  const [ramadanInfo, setRamadanInfo] = useState(null);
  const [locationLabel, setLocationLabel] = useState('Global (UTC)');
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [coords, setCoords] = useState(null);

  const today = new Date();
  const gregorianFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // ── Load Hijri date (with or without location) ──
  const loadHijriData = async (lat, lon, code) => {
    setLoading(true);
    try {
      const hijri = await fetchHijriDate(lat, lon, code);
      if (hijri) {
        setHijriData(hijri);
        const hijriYear = parseInt(hijri.year, 10);
        const ramadan = await fetchRamadanDates(hijriYear, lat, lon, code);
        setRamadanInfo(ramadan);
      }
    } catch {
      // fallback: use static approximate
      setHijriData({ day: '22', month: { en: 'Safar', ar: 'صفر', number: 2 }, year: '1447' });
    } finally {
      setLoading(false);
    }
  };

  // ── Request geolocation or load from cache on open ──
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    // 1. Try reading cached location from localStorage
    const cachedLat = localStorage.getItem('user_lat');
    const cachedLng = localStorage.getItem('user_lng');
    const cachedCode = localStorage.getItem('user_country_code');
    const cachedLabel = localStorage.getItem('user_location_name');

    if (cachedLat && cachedLng) {
      const lat = parseFloat(cachedLat);
      const lon = parseFloat(cachedLng);
      setCoords({ lat, lon });
      setLocationLabel(cachedLabel || 'Your Location');
      loadHijriData(lat, lon, cachedCode || '');
      return;
    }

    // 2. Geolocation GPS fallback
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lon: longitude });
          localStorage.setItem('user_lat', latitude);
          localStorage.setItem('user_lng', longitude);

          let code = '';
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const geoJson = await geoRes.json();
            const city = geoJson.address?.city || geoJson.address?.town || geoJson.address?.state || geoJson.address?.country || 'Your Location';
            code = geoJson.address?.country_code?.toUpperCase() || '';
            if (code) {
              localStorage.setItem('user_country_code', code);
            }
            setLocationLabel(city);
            localStorage.setItem('user_location_name', city);
          } catch {
            setLocationLabel('Your Location');
            localStorage.setItem('user_location_name', 'Your Location');
          }
          loadHijriData(latitude, longitude, code);
        },
        () => {
          setLocationError(true);
          setLocationLabel('Global (UTC)');
          loadHijriData(null, null, '');
        },
        { timeout: 8000 }
      );
    } else {
      setLocationError(true);
      loadHijriData(null, null, '');
    }
  }, [isOpen]);

  // ── Ramadan countdown calculations ──
  const getRamadanCountdown = () => {
    if (!ramadanInfo) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const ramStart = new Date(ramadanInfo.start);
    ramStart.setHours(0, 0, 0, 0);
    const ramEnd = new Date(ramadanInfo.end);
    ramEnd.setHours(0, 0, 0, 0);

    if (now < ramStart) {
      const daysUntil = Math.ceil((ramStart - now) / (1000 * 60 * 60 * 24));
      return { state: 'upcoming', days: daysUntil, total: ramadanInfo.totalDays };
    } else if (now <= ramEnd) {
      const dayIn = Math.ceil((now - ramStart) / (1000 * 60 * 60 * 24)) + 1;
      const daysLeft = Math.ceil((ramEnd - now) / (1000 * 60 * 60 * 24));
      return { state: 'active', dayIn, daysLeft, total: ramadanInfo.totalDays };
    } else {
      const daysAgo = Math.ceil((now - ramEnd) / (1000 * 60 * 60 * 24));
      return { state: 'passed', daysAgo };
    }
  };

  const ramadanCountdown = getRamadanCountdown();

  // ── Hijri display string ──
  const hijriDisplay = hijriData
    ? `${hijriData.day} ${hijriData.month.en} ${hijriData.year} AH`
    : '...';
  const hijriArabicDisplay = hijriData
    ? `${hijriData.day} ${hijriData.month.ar} ${hijriData.year} هـ`
    : '...';

  // ── Current Hijri month index (1-based) ──
  const currentHijriMonthNum = hijriData ? parseInt(hijriData.month.number, 10) : 0;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: '700px', maxHeight: '93vh',
        background: 'linear-gradient(135deg, #022c22 0%, #0f172a 100%)',
        border: '2px solid var(--accent-gold, #f59e0b)',
        borderRadius: '24px', color: '#fff',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(245,158,11,0.06)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(2,44,34,0.95)',
          borderBottom: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '14px',
              background: 'rgba(16,185,129,0.2)', border: '1px solid #f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Moon size={22} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>
                Islamic Hijri Calendar
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={11} style={{ color: '#34d399' }} />
                {locationLabel}
                {loading && <RefreshCw size={11} style={{ color: '#f59e0b', animation: 'spin 1s linear infinite' }} />}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          ><X size={18} /></button>
        </div>

        {/* ── Scrollable Body ── */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* Today's Date Banner */}
          <div style={{
            padding: '1.25rem', borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(5,150,105,0.3) 0%, rgba(13,148,136,0.2) 100%)',
            border: '1px solid #f59e0b',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '0.75rem'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#34d399', letterSpacing: '1px' }}>
                Today — Gregorian &amp; Hijri
              </span>
              {loading ? (
                <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={16} style={{ color: '#f59e0b', animation: 'spin 1s linear infinite' }} />
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Fetching location-based date…</span>
                </div>
              ) : (
                <>
                  <h4 style={{ margin: '0.2rem 0 0.1rem', fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                    {hijriDisplay}
                  </h4>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#fde68a', fontFamily: 'serif', direction: 'rtl' }}>
                    {hijriArabicDisplay}
                  </p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.87rem', color: '#e2e8f0' }}>{gregorianFormatted}</p>
                  {locationError && (
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#fbbf24' }}>
                      ⚠️ Location not available — showing global calculation
                    </p>
                  )}
                </>
              )}
            </div>
            <div style={{
              textAlign: 'right', background: 'rgba(0,0,0,0.3)',
              padding: '0.6rem 0.9rem', borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: 700 }}>Hijri Year</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>
                {hijriData ? hijriData.year : '1447'} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>AH</span>
              </div>
            </div>
          </div>

          {/* ── Ramadan Countdown ── */}
          {!loading && (
            <div style={{
              padding: '1.1rem 1.25rem', borderRadius: '18px',
              background: ramadanCountdown?.state === 'active'
                ? 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(5,150,105,0.15) 100%)'
                : 'linear-gradient(135deg, rgba(5,150,105,0.12) 0%, rgba(13,148,136,0.08) 100%)',
              border: `1.5px solid ${ramadanCountdown?.state === 'active' ? 'rgba(245,158,11,0.6)' : 'rgba(5,150,105,0.3)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.7rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🌙</span>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>
                  Ramadan {hijriData ? hijriData.year : '1447'} — Countdown
                </h4>
              </div>

              {!ramadanInfo ? (
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                  Calculating Ramadan dates…
                </p>
              ) : ramadanCountdown?.state === 'upcoming' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                      {ramadanCountdown.days}
                    </span>
                    <span style={{ fontSize: '1rem', color: '#fcd34d', fontWeight: 700 }}>days remaining</span>
                  </div>
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                    until the blessed month of Ramadan begins · {ramadanCountdown.total} days of fasting
                  </p>
                  <div style={{ marginTop: '0.75rem', height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '4px',
                      background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                      width: `${Math.max(5, 100 - (ramadanCountdown.days / 365) * 100)}%`
                    }} />
                  </div>
                </div>
              ) : ramadanCountdown?.state === 'active' ? (
                <div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399', lineHeight: 1 }}>
                        Day {ramadanCountdown.dayIn}
                      </div>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>of Ramadan</p>
                    </div>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                        {ramadanCountdown.daysLeft}
                      </div>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>days left</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '4px',
                      background: 'linear-gradient(90deg, #f59e0b, #34d399)',
                      width: `${(ramadanCountdown.dayIn / ramadanCountdown.total) * 100}%`,
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#34d399' }}>
                    🤲 You are in the blessed month — keep fasting!
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                    Ramadan has passed {ramadanCountdown?.daysAgo} days ago. May Allah accept your fasts! 🤲
                  </p>
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', color: '#fcd34d' }}>
                    Next Ramadan countdown will appear soon — stay connected with Allah.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── 12 Sacred Hijri Months ── */}
          <div>
            <h4 style={{
              fontSize: '1rem', fontWeight: 800, color: '#f59e0b',
              marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem'
            }}>
              <Calendar size={18} /> 12 Sacred Hijri Months
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.55rem' }}>
              {HIJRI_MONTHS_DISPLAY.map((month, idx) => {
                const monthNum = idx + 1;
                const isCurrent = monthNum === currentHijriMonthNum;
                const isRamadan = monthNum === 9;
                return (
                  <div key={idx} style={{
                    padding: '0.65rem 0.85rem', borderRadius: '12px',
                    background: isCurrent
                      ? 'rgba(5,150,105,0.25)'
                      : isRamadan
                        ? 'rgba(245,158,11,0.12)'
                        : 'rgba(255,255,255,0.05)',
                    border: isCurrent
                      ? '1.5px solid #34d399'
                      : isRamadan
                        ? '1.5px solid rgba(245,158,11,0.5)'
                        : '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.82rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}>
                    <span style={{ color: isCurrent ? '#34d399' : '#f59e0b', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                      {String(monthNum).padStart(2, '0')}.
                    </span>
                    <span style={{ color: isCurrent ? '#fff' : isRamadan ? '#fde68a' : '#cbd5e1' }}>
                      {month}
                    </span>
                    {isCurrent && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', background: '#34d399', color: '#000', padding: '1px 5px', borderRadius: '5px', fontWeight: 800, flexShrink: 0 }}>NOW</span>}
                    {isRamadan && !isCurrent && <span style={{ marginLeft: 'auto', fontSize: '0.9rem' }}>🌙</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Key Islamic Events ── */}
          <div>
            <h4 style={{
              fontSize: '1rem', fontWeight: 800, color: '#f59e0b',
              marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem'
            }}>
              <Sparkles size={18} /> Important Islamic Events
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ISLAMIC_EVENTS.map((evt, idx) => (
                <div key={idx} style={{
                  padding: '0.65rem 1rem', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: '0.4rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{evt.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{evt.hijriDate}</div>
                  </div>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 800,
                    background: 'rgba(5,150,105,0.3)', color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.4)', padding: '3px 10px', borderRadius: '12px',
                    whiteSpace: 'nowrap'
                  }}>
                    {evt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '12px',
            background: 'rgba(245,158,11,0.06)', border: '1px dashed rgba(245,158,11,0.25)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
              📍 Hijri date calculated using your GPS location via{' '}
              <strong style={{ color: '#f59e0b' }}>AlAdhan.com</strong> — the world's trusted Islamic API.
              Dates may vary by 1 day based on moon sighting in your country.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
