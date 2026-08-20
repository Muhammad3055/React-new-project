import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Clock, Globe, Plus, Trash2, CheckCircle2, Circle, Search, Sparkles, MapPin, Calendar, CheckSquare, RefreshCw, Navigation } from 'lucide-react';

export default function WorldClockView() {
  const { t } = useLanguage();
  const [time, setTime] = useState(new Date());
  const [searchCityInput, setSearchCityInput] = useState('');
  const [searchCountryInput, setSearchCountryInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Detected User Auto-Location State
  const [detectedLocation, setDetectedLocation] = useState({ city: 'Islamabad', country: 'Pakistan', tz: 'Asia/Karachi' });
  const [detectedTimings, setDetectedTimings] = useState(null);
  const [detectedHijri, setDetectedHijri] = useState(null);
  const [loadingAutoLoc, setLoadingAutoLoc] = useState(true);

  // Saved Cities List (Persisted in LocalStorage)
  const defaultSaved = [
    { name: 'Makkah', country: 'Saudi Arabia', tz: 'Asia/Riyadh' },
    { name: 'Madinah', country: 'Saudi Arabia', tz: 'Asia/Riyadh' },
    { name: 'Islamabad', country: 'Pakistan', tz: 'Asia/Karachi' },
    { name: 'London', country: 'United Kingdom', tz: 'Europe/London' },
    { name: 'New York', country: 'United States', tz: 'America/New_York' },
    { name: 'Dubai', country: 'United Arab Emirates', tz: 'Asia/Dubai' }
  ];

  const [savedCities, setSavedCities] = useState(() => {
    const local = localStorage.getItem('maktaba_world_clock_cities_v2');
    return local ? JSON.parse(local) : defaultSaved;
  });

  // Prayer Timings API Data Cache for Saved Cities { "Makkah-Saudi Arabia": { timings, hijri, tz } }
  const [cityApiData, setCityApiData] = useState({});

  // Todo List State (Persisted in LocalStorage)
  const defaultTodos = [
    { id: 1, text: 'Offer Tahajjud & Fajr Prayer in Congregation', done: true },
    { id: 2, text: 'Recite Morning Adhkar (Hisn al-Muslim)', done: true },
    { id: 3, text: 'Read 1 Juz of Holy Quran with Translation', done: false },
    { id: 4, text: 'Send 100 Salawat upon Prophet Muhammad (PBUH)', done: false },
    { id: 5, text: 'Recite Surah Al-Kahf (Friday Special)', done: false },
    { id: 6, text: 'Give Daily Charity (Sadaqah)', done: false }
  ];

  const [todos, setTodos] = useState(() => {
    const local = localStorage.getItem('maktaba_islamic_todos');
    return local ? JSON.parse(local) : defaultTodos;
  });

  const [newTodoText, setNewTodoText] = useState('');

  // Clock Ticker (Updates every second)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('maktaba_world_clock_cities_v2', JSON.stringify(savedCities));
  }, [savedCities]);

  useEffect(() => {
    localStorage.setItem('maktaba_islamic_todos', JSON.stringify(todos));
  }, [todos]);

  // Auto Detect User Location via IP
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.country_name) {
          const loc = { city: data.city, country: data.country_name, tz: data.timezone || 'Asia/Karachi' };
          setDetectedLocation(loc);
          fetchCityTimings(data.city, data.country_name, true);
        } else {
          fetchCityTimings('Islamabad', 'Pakistan', true);
        }
      })
      .catch(() => {
        fetchCityTimings('Islamabad', 'Pakistan', true);
      })
      .finally(() => setLoadingAutoLoc(false));
  }, []);

  // Fetch Prayer Timings for all Saved Cities
  useEffect(() => {
    savedCities.forEach(c => {
      fetchCityTimings(c.name, c.country, false);
    });
  }, [savedCities]);

  const fetchCityTimings = (city, country, isUserLoc = false) => {
    const key = `${city}-${country}`;
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const payload = {
            timings: data.data.timings,
            hijri: data.data.date.hijri,
            tz: data.data.meta.timezone
          };
          if (isUserLoc) {
            setDetectedTimings(data.data.timings);
            setDetectedHijri(data.data.date.hijri);
          }
          setCityApiData(prev => ({ ...prev, [key]: payload }));
        }
      })
      .catch(() => {});
  };

  const handleAddCustomCity = (e) => {
    e.preventDefault();
    if (!searchCityInput.trim() || !searchCountryInput.trim()) return;
    setIsAdding(true);
    const newCity = searchCityInput.trim();
    const newCountry = searchCountryInput.trim();

    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(newCity)}&country=${encodeURIComponent(newCountry)}&method=2`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const tz = data.data.meta.timezone;
          if (!savedCities.some(c => c.name.toLowerCase() === newCity.toLowerCase())) {
            setSavedCities([...savedCities, { name: newCity, country: newCountry, tz }]);
          }
          setSearchCityInput('');
          setSearchCountryInput('');
        } else {
          alert('City or Country not found. Please check spelling.');
        }
      })
      .catch(() => alert('Failed to fetch data for this city.'))
      .finally(() => setIsAdding(false));
  };

  const removeSavedCity = (cityName) => {
    setSavedCities(savedCities.filter(c => c.name !== cityName));
  };

  const getCityTime = (tz) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz || 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(time);
    } catch {
      return '--:--:--';
    }
  };

  const getCityDate = (tz) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz || 'UTC',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(time);
    } catch {
      return '';
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodoText.trim(), done: false }]);
    setNewTodoText('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #0f172a 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Globe size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Real-Time Aladhan API Integration
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Islamic World Clock &amp; Live Prayer Times
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Track live local times, exact prayer schedules (Fajr, Dhuhr, Asr, Maghrib, Isha), and Hijri dates for any city and country in the world.
          </p>
        </div>

        {/* ── Auto-Detected User City Card ── */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
          borderRadius: '24px', padding: '2rem', color: '#ffffff',
          border: '2px solid #34d399', boxShadow: '0 10px 30px rgba(6,78,59,0.3)',
          marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Navigation size={14} /> Your Detected Location
              </span>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>
                {detectedLocation.city}, {detectedLocation.country}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'monospace', color: '#fcd34d' }}>
                {getCityTime(detectedLocation.tz)}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>
                {getCityDate(detectedLocation.tz)} {detectedHijri && `• ${detectedHijri.day} ${detectedHijri.month.en} ${detectedHijri.year} AH`}
              </div>
            </div>
          </div>

          {detectedTimings && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              {[
                { name: 'Fajr', time: detectedTimings.Fajr },
                { name: 'Sunrise', time: detectedTimings.Sunrise },
                { name: 'Dhuhr', time: detectedTimings.Dhuhr },
                { name: 'Asr', time: detectedTimings.Asr },
                { name: 'Maghrib', time: detectedTimings.Maghrib },
                { name: 'Isha', time: detectedTimings.Isha }
              ].map(p => (
                <div key={p.name} style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 800 }}>{p.name}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{p.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Add Custom City Form ── */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem 2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '2.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} style={{ color: '#059669' }} /> Add Any World City &amp; Country
          </h3>
          <form onSubmit={handleAddCustomCity} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="City Name (e.g. Quetta, Karachi, Istanbul)..."
              value={searchCityInput}
              onChange={e => setSearchCityInput(e.target.value)}
              style={{ flex: 1, minWidth: '180px', padding: '0.65rem 1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
            />
            <input
              type="text"
              placeholder="Country Name (e.g. Pakistan, Turkey)..."
              value={searchCountryInput}
              onChange={e => setSearchCountryInput(e.target.value)}
              style={{ flex: 1, minWidth: '180px', padding: '0.65rem 1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
            />
            <button
              type="submit"
              disabled={isAdding}
              style={{
                padding: '0.65rem 1.5rem', borderRadius: '12px', background: '#059669', color: '#ffffff',
                border: 'none', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              {isAdding ? 'Fetching API...' : '+ Fetch & Save City'}
            </button>
          </form>
        </div>

        {/* ── Saved Favorite Cities Cards Grid ── */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>My Saved World Cities ({savedCities.length})</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {savedCities.map(cityObj => {
              const key = `${cityObj.name}-${cityObj.country}`;
              const apiInfo = cityApiData[key];
              const timeStr = getCityTime(apiInfo?.tz || cityObj.tz);
              const dateStr = getCityDate(apiInfo?.tz || cityObj.tz);
              const isHoly = cityObj.name === 'Makkah' || cityObj.name === 'Madinah';

              return (
                <div
                  key={key}
                  style={{
                    background: isHoly ? 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' : '#ffffff',
                    color: isHoly ? '#ffffff' : '#0f172a',
                    borderRadius: '20px', padding: '1.5rem',
                    border: isHoly ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                    boxShadow: isHoly ? '0 10px 25px rgba(2,44,34,0.2)' : '0 4px 15px rgba(0,0,0,0.03)',
                    position: 'relative'
                  }}
                >
                  <button
                    onClick={() => removeSavedCity(cityObj.name)}
                    style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: isHoly ? '#fca5a5' : '#cbd5e1' }}
                    title="Remove city"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isHoly ? '#fcd34d' : '#059669', textTransform: 'uppercase', marginBottom: '2px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> {cityObj.country}
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 800 }}>{cityObj.name}</h3>

                  <div style={{ fontSize: '2.1rem', fontWeight: 900, fontFamily: 'monospace', color: isHoly ? '#ffffff' : '#1e293b', margin: '0.2rem 0' }}>
                    {timeStr}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: isHoly ? '#a7f3d0' : '#64748b', marginBottom: '1rem' }}>
                    {dateStr} {apiInfo?.hijri && `• ${apiInfo.hijri.day} ${apiInfo.hijri.month.en}`}
                  </div>

                  {/* Live Aladhan API Prayer Timings Grid */}
                  {apiInfo?.timings ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', paddingTop: '0.75rem', borderTop: isHoly ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.75rem' }}><span style={{ opacity: 0.7 }}>Fajr:</span> <b>{apiInfo.timings.Fajr}</b></div>
                      <div style={{ fontSize: '0.75rem' }}><span style={{ opacity: 0.7 }}>Dhuhr:</span> <b>{apiInfo.timings.Dhuhr}</b></div>
                      <div style={{ fontSize: '0.75rem' }}><span style={{ opacity: 0.7 }}>Asr:</span> <b>{apiInfo.timings.Asr}</b></div>
                      <div style={{ fontSize: '0.75rem' }}><span style={{ opacity: 0.7 }}>Maghrib:</span> <b>{apiInfo.timings.Maghrib}</b></div>
                      <div style={{ fontSize: '0.75rem' }}><span style={{ opacity: 0.7 }}>Isha:</span> <b>{apiInfo.timings.Isha}</b></div>
                      <div style={{ fontSize: '0.75rem' }}><span style={{ opacity: 0.7 }}>Sunrise:</span> <b>{apiInfo.timings.Sunrise}</b></div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: isHoly ? '#fcd34d' : '#d97706', fontStyle: 'italic' }}>
                      Fetching real-time API prayer schedule...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section: Islamic Daily Todo Checklist Manager ── */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={22} style={{ color: '#059669' }} /> Daily Islamic Spiritual Checklist
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.88rem', color: '#64748b' }}>Track your daily prayers, Quran reading, and Sunnah deeds</p>
            </div>

            <form onSubmit={addTodo} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 300px', maxWidth: '450px' }}>
              <input
                type="text"
                placeholder="Add custom task (e.g. Recite Surah Mulk)..."
                value={newTodoText}
                onChange={e => setNewTodoText(e.target.value)}
                style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.88rem' }}
              />
              <button type="submit" style={{ padding: '0.65rem 1rem', borderRadius: '12px', background: '#059669', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Plus size={16}/> Add Task
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todos.map(todo => (
              <div
                key={todo.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
                  borderRadius: '14px', background: todo.done ? '#f0fdf4' : '#f8fafc',
                  border: todo.done ? '1px solid #bbf7d0' : '1px solid #e2e8f0', transition: 'all 0.2s'
                }}
              >
                <div
                  onClick={() => toggleTodo(todo.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }}
                >
                  <div style={{ color: todo.done ? '#10b981' : '#94a3b8' }}>
                    {todo.done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: todo.done ? '#166534' : '#334155', textDecoration: todo.done ? 'line-through' : 'none' }}>
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
