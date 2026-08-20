import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Clock, Globe, Plus, Trash2, CheckCircle2, Circle, Search, Sparkles, MapPin, Calendar, CheckSquare } from 'lucide-react';

export default function WorldClockView() {
  const { t } = useLanguage();
  const [time, setTime] = useState(new Date());
  const [query, setQuery] = useState('');
  
  // Custom Saved World Cities (Saved in LocalStorage)
  const defaultCities = ['Makkah', 'Madinah', 'Islamabad', 'London', 'New York', 'Dubai'];
  const [savedCities, setSavedCities] = useState(() => {
    const local = localStorage.getItem('maktaba_world_clock_cities');
    return local ? JSON.parse(local) : defaultCities;
  });

  // Custom Todo List State (Saved in LocalStorage)
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

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save cities & todos to LocalStorage
  useEffect(() => {
    localStorage.setItem('maktaba_world_clock_cities', JSON.stringify(savedCities));
  }, [savedCities]);

  useEffect(() => {
    localStorage.setItem('maktaba_islamic_todos', JSON.stringify(todos));
  }, [todos]);

  // Cities Master Database with Timezones
  const citiesDatabase = [
    { name: 'Makkah', country: 'Saudi Arabia', tz: 'Asia/Riyadh', prayer: 'Asr in 1h 24m' },
    { name: 'Madinah', country: 'Saudi Arabia', tz: 'Asia/Riyadh', prayer: 'Asr in 1h 24m' },
    { name: 'Islamabad', country: 'Pakistan', tz: 'Asia/Karachi', prayer: 'Maghrib in 45m' },
    { name: 'Karachi', country: 'Pakistan', tz: 'Asia/Karachi', prayer: 'Maghrib in 52m' },
    { name: 'Quetta', country: 'Pakistan', tz: 'Asia/Karachi', prayer: 'Maghrib in 58m' },
    { name: 'Lahore', country: 'Pakistan', tz: 'Asia/Karachi', prayer: 'Maghrib in 42m' },
    { name: 'Peshawar', country: 'Pakistan', tz: 'Asia/Karachi', prayer: 'Maghrib in 46m' },
    { name: 'Dubai', country: 'United Arab Emirates', tz: 'Asia/Dubai', prayer: 'Asr in 2h 10m' },
    { name: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh', prayer: 'Asr in 1h 20m' },
    { name: 'Istanbul', country: 'Turkey', tz: 'Europe/Istanbul', prayer: 'Dhuhr in 35m' },
    { name: 'Cairo', country: 'Egypt', tz: 'Africa/Cairo', prayer: 'Dhuhr in 1h 05m' },
    { name: 'London', country: 'United Kingdom', tz: 'Europe/London', prayer: 'Dhuhr in 2h 15m' },
    { name: 'New York', country: 'United States', tz: 'America/New_York', prayer: 'Fajr in 40m' },
    { name: 'Chicago', country: 'United States', tz: 'America/Chicago', prayer: 'Fajr in 1h 40m' },
    { name: 'Los Angeles', country: 'United States', tz: 'America/Los_Angeles', prayer: 'Isha in 3h 10m' },
    { name: 'Toronto', country: 'Canada', tz: 'America/Toronto', prayer: 'Fajr in 40m' },
    { name: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta', prayer: 'Isha in 1h 15m' },
    { name: 'Kuala Lumpur', country: 'Malaysia', tz: 'Asia/Kuala_Lumpur', prayer: 'Isha in 1h 30m' },
    { name: 'Dhaka', country: 'Bangladesh', tz: 'Asia/Dhaka', prayer: 'Isha in 45m' },
    { name: 'Tashkent', country: 'Uzbekistan', tz: 'Asia/Tashkent', prayer: 'Asr in 50m' },
    { name: 'Kabul', country: 'Afghanistan', tz: 'Asia/Kabul', prayer: 'Maghrib in 30m' },
    { name: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', prayer: 'Fajr in 3h 20m' },
    { name: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', prayer: 'Fajr in 2h 50m' },
    { name: 'Berlin', country: 'Germany', tz: 'Europe/Berlin', prayer: 'Dhuhr in 1h 45m' },
    { name: 'Paris', country: 'France', tz: 'Europe/Paris', prayer: 'Dhuhr in 1h 50m' }
  ];

  const getCityTime = (tz) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
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
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(time);
    } catch {
      return '';
    }
  };

  const toggleCitySave = (cityName) => {
    setSavedCities(prev => prev.includes(cityName) ? prev.filter(c => c !== cityName) : [...prev, cityName]);
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

  const filteredDatabase = citiesDatabase.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.country.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #022c22 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Globe size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Global Islamic Time &amp; Task Manager
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Islamic World Clock &amp; Daily Todo List
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Track live local times and prayer schedules for world cities, customize your saved city dashboard, and manage your daily Islamic spiritual checklist.
          </p>
        </div>

        {/* ── Section 1: Saved Favorite Cities Dashboard Grid ── */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>My Saved World Cities</h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.88rem', color: '#64748b' }}>Live local time and prayer schedules</p>
            </div>
            <span style={{ background: '#059669', color: '#fff', padding: '4px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
              {savedCities.length} Cities Saved
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {savedCities.map(cityName => {
              const cityObj = citiesDatabase.find(c => c.name === cityName) || { name: cityName, country: '', tz: 'UTC', prayer: 'Prayer info unavailable' };
              const timeStr = getCityTime(cityObj.tz);
              const dateStr = getCityDate(cityObj.tz);
              const isHoly = cityName === 'Makkah' || cityName === 'Madinah';

              return (
                <div
                  key={cityName}
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
                    onClick={() => toggleCitySave(cityName)}
                    style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: isHoly ? '#fca5a5' : '#cbd5e1' }}
                    title="Remove city"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isHoly ? '#fcd34d' : '#059669', textTransform: 'uppercase', marginBottom: '2px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> {cityObj.country}
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 800 }}>{cityObj.name}</h3>

                  <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'monospace', color: isHoly ? '#ffffff' : '#1e293b', margin: '0.2rem 0' }}>
                    {timeStr}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: isHoly ? '#a7f3d0' : '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: isHoly ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f1f5f9' }}>
                    <span>{dateStr}</span>
                    <span style={{ fontWeight: 800, color: isHoly ? '#fcd34d' : '#d97706' }}>{cityObj.prayer}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 2: Islamic Daily Todo Checklist Manager ── */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={22} style={{ color: '#059669' }} /> Daily Islamic Todo Checklist
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

        {/* ── Section 3: Add More World Cities Directory ── */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>World Cities Directory</h2>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search city or country..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.8rem 0.55rem 2.2rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {filteredDatabase.map(c => {
              const isSaved = savedCities.includes(c.name);
              return (
                <div
                  key={c.name}
                  style={{
                    padding: '10px 14px', borderRadius: '12px', background: '#f8fafc',
                    border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.country}</div>
                  </div>
                  <button
                    onClick={() => toggleCitySave(c.name)}
                    style={{
                      padding: '4px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer',
                      background: isSaved ? '#ef4444' : '#059669', color: '#ffffff', border: 'none'
                    }}
                  >
                    {isSaved ? 'Remove' : '+ Add'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
