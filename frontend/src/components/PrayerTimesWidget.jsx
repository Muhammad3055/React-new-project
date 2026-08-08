import React, { useState, useEffect } from 'react';

export default function PrayerTimesWidget() {
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '' });
  const [liveTime, setLiveTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [monthlyTimings, setMonthlyTimings] = useState([]);
  
  // User Location State
  const [locationName, setLocationName] = useState('Detecting location...');
  const [locationType, setLocationType] = useState('ip'); // 'gps' | 'ip' | 'custom'
  const [customCity, setCustomCity] = useState('');
  const [showCityInput, setShowCityInput] = useState(false);

  // Ticking digital clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Location & Prayer Times Auto-Detection
  useEffect(() => {
    detectLocationAndFetch();
  }, []);

  const detectLocationAndFetch = () => {
    setLoading(true);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // 1. Try Browser GPS Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          fetchTimingsByCoords(lat, lng, month, year, 'GPS Location');
        },
        () => {
          // 2. Fallback to IP-based Auto Detection
          fetchLocationByIP(month, year);
        },
        { timeout: 5000 }
      );
    } else {
      fetchLocationByIP(month, year);
    }
  };

  const fetchLocationByIP = (month, year) => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(ipData => {
        if (ipData && ipData.latitude && ipData.longitude) {
          const cityCountry = `${ipData.city || 'Local City'}, ${ipData.country_name || ''}`;
          fetchTimingsByCoords(ipData.latitude, ipData.longitude, month, year, cityCountry, 'ip');
        } else {
          fetchTimingsByCity('Karachi', 'Pakistan', month, year);
        }
      })
      .catch(() => {
        // Backup IP service
        fetch('https://ip-api.com/json/')
          .then(res => res.json())
          .then(ipData => {
            if (ipData && ipData.lat && ipData.lon) {
              const cityCountry = `${ipData.city || 'Local City'}, ${ipData.country || ''}`;
              fetchTimingsByCoords(ipData.lat, ipData.lon, month, year, cityCountry, 'ip');
            } else {
              fetchTimingsByCity('Karachi', 'Pakistan', month, year);
            }
          })
          .catch(() => fetchTimingsByCity('Karachi', 'Pakistan', month, year));
      });
  };

  const fetchTimingsByCoords = (lat, lng, month, year, label = 'Auto-Detected', type = 'gps') => {
    setLocationName(label);
    setLocationType(type);

    // Daily Timings
    fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=4`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setTimings(data.data.timings);
          const h = data.data.date.hijri;
          const g = data.data.date.gregorian;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
          setGregorianDate(`${g.weekday.en}, ${g.day} ${g.month.en} ${g.year}`);
          calculateNextPrayer(data.data.timings);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Monthly Calendar
    fetch(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lng}&method=4&month=${month}&year=${year}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) setMonthlyTimings(data.data);
      })
      .catch(() => {});
  };

  const fetchTimingsByCity = (city, country, month, year) => {
    setLocationName(`${city}, ${country}`);
    setLocationType('custom');

    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setTimings(data.data.timings);
          const h = data.data.date.hijri;
          const g = data.data.date.gregorian;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
          setGregorianDate(`${g.weekday.en}, ${g.day} ${g.month.en} ${g.year}`);
          calculateNextPrayer(data.data.timings);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4&month=${month}&year=${year}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) setMonthlyTimings(data.data);
      })
      .catch(() => {});
  };

  const handleCustomCitySubmit = (e) => {
    e.preventDefault();
    if (!customCity.trim()) return;
    const now = new Date();
    fetchTimingsByCity(customCity.trim(), '', now.getMonth() + 1, now.getFullYear());
    setShowCityInput(false);
  };

  const calculateNextPrayer = (times) => {
    if (!times) return;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let found = false;

    for (let name of prayerOrder) {
      if (!times[name]) continue;
      const [h, m] = times[name].split(':').map(Number);
      const prayerMins = h * 60 + m;
      if (prayerMins > currentMins) {
        setNextPrayer({ name, time: times[name] });
        found = true;
        break;
      }
    }

    if (!found) {
      setNextPrayer({ name: 'Fajr (Tomorrow)', time: times['Fajr'] || '04:30' });
    }
  };

  if (loading) {
    return (
      <div className="prayer-widget-card" style={{ textAlign: 'center', padding: '1.5rem', opacity: 0.8 }}>
        <i className="fas fa-spinner fa-spin" style={{ color: 'var(--accent-gold)', fontSize: '1.5rem' }}></i>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Auto-Detecting your Location & Nimaz Times...</p>
      </div>
    );
  }

  const mainPrayers = [
    { name: 'Fajr', time: timings?.Fajr },
    { name: 'Sunrise', time: timings?.Sunrise },
    { name: 'Dhuhr', time: timings?.Dhuhr },
    { name: 'Asr', time: timings?.Asr },
    { name: 'Maghrib', time: timings?.Maghrib },
    { name: 'Isha', time: timings?.Isha }
  ];

  return (
    <div className="prayer-widget-card">
      <div className="prayer-widget-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="hijri-badge"><i className="fas fa-calendar-alt"></i> {hijriDate || '15 Safar 1448 AH'}</span>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{gregorianDate}</span>
          
          {/* Location Badge */}
          <span 
            onClick={() => setShowCityInput(!showCityInput)}
            style={{ 
              background: 'rgba(16, 185, 129, 0.15)', 
              border: '1px solid rgba(16, 185, 129, 0.4)', 
              color: '#34d399', 
              padding: '2px 10px', 
              borderRadius: '14px', 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Click to change location or city"
          >
            <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent-gold)' }}></i>
            <span>📍 {locationName}</span>
            <i className="fas fa-edit" style={{ fontSize: '0.7rem', opacity: 0.7 }}></i>
          </span>

          {/* Live Ticking Clock */}
          <span style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,158,11,0.4)', color: 'var(--accent-gold)', padding: '2px 10px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            <i className="fas fa-clock" style={{ marginRight: '4px' }}></i> {liveTime}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {nextPrayer.name && (
            <div className="next-prayer-tag">
              <i className="fas fa-hourglass-half"></i> Next: <strong style={{ color: 'var(--accent-gold)' }}>{nextPrayer.name}</strong> ({nextPrayer.time})
            </div>
          )}
          <button
            onClick={() => setShowCalendarView(!showCalendarView)}
            style={{
              background: showCalendarView ? 'var(--accent-gold)' : 'rgba(255,255,255,0.12)',
              color: showCalendarView ? 'var(--primary-dark)' : '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="fas fa-calendar-week" style={{ marginRight: '4px' }}></i>
            {showCalendarView ? 'Live Nimaz View' : 'Nimaz Timetable Calendar'}
          </button>
        </div>
      </div>

      {/* Change City Input Bar */}
      {showCityInput && (
        <form onSubmit={handleCustomCitySubmit} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--accent-gold)' }}>
          <input
            type="text"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            placeholder="Type city name (e.g., Karachi, London, Istanbul, Mecca)..."
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.85rem', padding: '0 0.5rem' }}
          />
          <button type="submit" style={{ background: 'var(--accent-gold)', color: '#000', border: 'none', padding: '0.3rem 0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
            Update Location
          </button>
          <button type="button" onClick={() => detectLocationAndFetch()} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
            <i className="fas fa-crosshairs"></i> Auto GPS
          </button>
        </form>
      )}

      {!showCalendarView ? (
        /* Live Daily Nimaz View */
        <div className="prayer-times-grid">
          {mainPrayers.map((p) => {
            const isNext = nextPrayer.name === p.name;
            return (
              <div key={p.name} className={`prayer-time-box ${isNext ? 'active-prayer' : ''}`}>
                <div className="prayer-name">{p.name}</div>
                <div className="prayer-val">{p.time || '--:--'}</div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Full Month Daily Nimaz Timetable Calendar */
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span><i className="fas fa-calendar-alt"></i> Full Month Schedule ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}) - {locationName}</span>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 400 }}>Showing all {monthlyTimings.length} days of the month</span>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'center' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 5, background: '#022c22', color: 'var(--accent-gold)' }}>
                <tr style={{ borderBottom: '2px solid rgba(245,158,11,0.3)' }}>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Date</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Fajr</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Sunrise</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Dhuhr</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Asr</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Maghrib</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Isha</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTimings.map((day, idx) => {
                  const todayDay = new Date().getDate();
                  const dayNum = parseInt(day.date?.gregorian?.day, 10);
                  const isToday = dayNum === todayDay;

                  return (
                    <tr
                      key={idx}
                      style={{
                        background: isToday ? 'rgba(245, 158, 11, 0.25)' : (idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent'),
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontWeight: isToday ? 700 : 400
                      }}
                    >
                      <td style={{ padding: '0.5rem', fontWeight: 700, color: isToday ? 'var(--accent-gold)' : '#e2e8f0' }}>
                        {day.date?.readable} {isToday && <span style={{ fontSize: '0.7rem', background: 'var(--accent-gold)', color: '#000', padding: '1px 6px', borderRadius: '10px', marginLeft: '4px' }}>Today</span>}
                      </td>
                      <td style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{day.timings?.Fajr?.split(' ')[0]}</td>
                      <td style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{day.timings?.Sunrise?.split(' ')[0]}</td>
                      <td style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{day.timings?.Dhuhr?.split(' ')[0]}</td>
                      <td style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{day.timings?.Asr?.split(' ')[0]}</td>
                      <td style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{day.timings?.Maghrib?.split(' ')[0]}</td>
                      <td style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{day.timings?.Isha?.split(' ')[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
