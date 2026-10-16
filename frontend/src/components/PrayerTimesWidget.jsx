import React, { useState, useEffect, useRef } from 'react';
import { getPrayerMethodAndAdjustment } from '../utils/hijriDate';
import { useLanguage } from '../context/LanguageContext';

export default function PrayerTimesWidget({ onLocationOrDateUpdate }) {
  const { t } = useLanguage();
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '' });
  const [liveTime, setLiveTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [monthlyTimings, setMonthlyTimings] = useState([]);
  
  // User Location State
  const [locationName, setLocationName] = useState(localStorage.getItem('user_location_name') || 'Detecting location...');
  const [locationType, setLocationType] = useState('ip'); // 'gps' | 'ip' | 'custom'
  const [customCity, setCustomCity] = useState('');
  const [showCityInput, setShowCityInput] = useState(false);
  const [countryCode, setCountryCode] = useState(localStorage.getItem('user_country_code') || '');

  const [countdownText, setCountdownText] = useState('');
  const [sehriCountdown, setSehriCountdown] = useState('');
  const [iftarCountdown, setIftarCountdown] = useState('');

  // Audio Adhan & Prayer Notification Alarm State
  const adhanAudioRef = useRef(null);
  const [showAdhanSettings, setShowAdhanSettings] = useState(false);
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [activeAdhanAlert, setActiveAdhanAlert] = useState(null);
  const lastTriggeredPrayerRef = useRef(() => {
    try {
      return localStorage.getItem('maktaba_last_triggered_adhan') || '';
    } catch (e) {
      return '';
    }
  });

  const [adhanSettings, setAdhanSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('maktaba_adhan_settings');
      return saved ? JSON.parse(saved) : {
        soundEnabled: true,
        notificationsEnabled: false,
        volume: 85,
        prayers: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true }
      };
    } catch (e) {
      return {
        soundEnabled: true,
        notificationsEnabled: false,
        volume: 85,
        prayers: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true }
      };
    }
  });

  const [notifPermission, setNotifPermission] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });

  useEffect(() => {
    try {
      localStorage.setItem('maktaba_adhan_settings', JSON.stringify(adhanSettings));
    } catch (e) {}
    if (adhanAudioRef.current) {
      adhanAudioRef.current.volume = (adhanSettings.volume || 85) / 100;
    }
  }, [adhanSettings]);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotifPermission(perm);
        if (perm === 'granted') {
          setAdhanSettings(prev => ({ ...prev, notificationsEnabled: true }));
          new Notification('🕌 Maktab tul Muslim Adhan Alarm Active', {
            body: 'You will receive authentic Adhan reminders at prayer times.',
            icon: '/favicon-96x96.png'
          });
        }
      } catch (err) {
        console.error('Notification permission error:', err);
      }
    }
  };

  const playAdhanAudio = (prayerName = 'Salah') => {
    if (!adhanAudioRef.current) {
      adhanAudioRef.current = new Audio('/audio/adhan.mp3');
    }
    const audio = adhanAudioRef.current;
    audio.volume = (adhanSettings.volume || 85) / 100;
    audio.currentTime = 0;
    audio.play().then(() => {
      setIsAdhanPlaying(true);
    }).catch(err => {
      console.warn('Audio autoplay prevented or error:', err);
    });

    audio.onended = () => {
      setIsAdhanPlaying(false);
      setActiveAdhanAlert(null);
    };
  };

  const stopAdhanAudio = () => {
    if (adhanAudioRef.current) {
      adhanAudioRef.current.pause();
      adhanAudioRef.current.currentTime = 0;
    }
    setIsAdhanPlaying(false);
    setActiveAdhanAlert(null);
  };

  const togglePrayerAlarm = (prayerKey) => {
    setAdhanSettings(prev => ({
      ...prev,
      prayers: {
        ...prev.prayers,
        [prayerKey]: !prev.prayers[prayerKey]
      }
    }));
  };

  // Ticking digital clock & live countdown timer
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (timings) {
        // Calculate countdown to Next Prayer
        if (nextPrayer && nextPrayer.time) {
          const [ph, pm] = nextPrayer.time.split(':').map(Number);
          const pDate = new Date();
          pDate.setHours(ph, pm, 0, 0);
          if (pDate < now) pDate.setDate(pDate.getDate() + 1);
          const diffMs = pDate - now;
          const hrs = Math.floor(diffMs / 3600000);
          const mins = Math.floor((diffMs % 3600000) / 60000);
          const secs = Math.floor((diffMs % 60000) / 1000);
          setCountdownText(`${hrs > 0 ? hrs + 'h ' : ''}${mins}m ${secs}s`);
        }

        // Calculate Sehri (Fajr time) Countdown
        if (timings.Fajr) {
          const [fh, fm] = timings.Fajr.split(':').map(Number);
          const fDate = new Date();
          fDate.setHours(fh, fm, 0, 0);
          if (fDate < now) fDate.setDate(fDate.getDate() + 1);
          const diffFajr = fDate - now;
          const fHrs = Math.floor(diffFajr / 3600000);
          const fMins = Math.floor((diffFajr % 3600000) / 60000);
          const fSecs = Math.floor((diffFajr % 60000) / 1000);
          setSehriCountdown(`${fHrs > 0 ? fHrs + 'h ' : ''}${fMins}m ${fSecs}s`);
        }

        // Calculate Iftar (Maghrib time) Countdown
        if (timings.Maghrib) {
          const [mh, mm] = timings.Maghrib.split(':').map(Number);
          const mDate = new Date();
          mDate.setHours(mh, mm, 0, 0);
          if (mDate < now) mDate.setDate(mDate.getDate() + 1);
          const diffMaghrib = mDate - now;
          const mHrs = Math.floor(diffMaghrib / 3600000);
          const mMins = Math.floor((diffMaghrib % 3600000) / 60000);
          const mSecs = Math.floor((diffMaghrib % 60000) / 1000);
          setIftarCountdown(`${mHrs > 0 ? mHrs + 'h ' : ''}${mMins}m ${mSecs}s`);
        }

        // Real-Time Adhan & Notification Alarm Trigger
        const curHours = String(now.getHours()).padStart(2, '0');
        const curMins = String(now.getMinutes()).padStart(2, '0');
        const curTimeStr = `${curHours}:${curMins}`;
        const todayDateStr = now.toISOString().split('T')[0];

        const prayersToCheck = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        for (const pName of prayersToCheck) {
          const pTime = timings[pName]?.split(' ')[0];
          if (pTime === curTimeStr) {
            const triggerKey = `${todayDateStr}_${pName}`;
            let lastTriggered = '';
            try {
              lastTriggered = localStorage.getItem('maktaba_last_triggered_adhan') || '';
            } catch (e) {}

            if (lastTriggered !== triggerKey) {
              try {
                localStorage.setItem('maktaba_last_triggered_adhan', triggerKey);
              } catch (e) {}

              const isPrayerEnabled = adhanSettings?.prayers?.[pName] !== false;
              if (isPrayerEnabled) {
                setActiveAdhanAlert({ prayer: pName, time: pTime });
                if (adhanSettings?.soundEnabled) {
                  playAdhanAudio(pName);
                }
                if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted' && adhanSettings?.notificationsEnabled) {
                  try {
                    new Notification(`🕌 Time for ${pName} Salah!`, {
                      body: `Allahu Akbar! It is now time for ${pName} prayer in ${locationName}. Hayya 'ala-s-Salah.`,
                      icon: '/favicon-96x96.png'
                    });
                  } catch (e) {}
                }
              }
            }
          }
        }
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [timings, nextPrayer, adhanSettings, locationName]);

  // Location & Prayer Times Auto-Detection
  useEffect(() => {
    detectLocationAndFetch();
  }, []);

  const detectLocationAndFetch = () => {
    setLoading(true);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Try reading cached location first
    const cachedLat = localStorage.getItem('user_lat');
    const cachedLng = localStorage.getItem('user_lng');
    const cachedCode = localStorage.getItem('user_country_code');
    const cachedLabel = localStorage.getItem('user_location_name');

    if (cachedLat && cachedLng) {
      const lat = parseFloat(cachedLat);
      const lng = parseFloat(cachedLng);
      fetchTimingsByCoords(lat, lng, month, year, cachedLabel || 'Cached Location', 'gps', cachedCode || '');
      // Still fetch in background/refresh GPS silently
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newLat = pos.coords.latitude;
            const newLng = pos.coords.longitude;
            if (Math.abs(newLat - lat) > 0.01 || Math.abs(newLng - lng) > 0.01) {
              reverseGeocodeAndFetch(newLat, newLng, month, year);
            }
          },
          null,
          { timeout: 8000 }
        );
      }
      return;
    }

    // 1. Try Browser GPS Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          reverseGeocodeAndFetch(lat, lng, month, year);
        },
        () => {
          // 2. Fallback to IP-based Auto Detection
          fetchLocationByIP(month, year);
        },
        { timeout: 8000 }
      );
    } else {
      fetchLocationByIP(month, year);
    }
  };

  const reverseGeocodeAndFetch = (lat, lng, month, year) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(res => res.json())
      .then(geoJson => {
        const city = geoJson.address?.city || geoJson.address?.town || geoJson.address?.state || geoJson.address?.country || 'GPS Location';
        const code = geoJson.address?.country_code?.toUpperCase() || '';
        if (code) {
          setCountryCode(code);
          localStorage.setItem('user_country_code', code);
        }
        localStorage.setItem('user_lat', lat);
        localStorage.setItem('user_lng', lng);
        localStorage.setItem('user_location_name', city);
        fetchTimingsByCoords(lat, lng, month, year, city, 'gps', code);
      })
      .catch(() => {
        localStorage.setItem('user_lat', lat);
        localStorage.setItem('user_lng', lng);
        localStorage.setItem('user_location_name', 'GPS Location');
        fetchTimingsByCoords(lat, lng, month, year, 'GPS Location', 'gps', countryCode);
      });
  };

  const fetchLocationByIP = (month, year) => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(ipData => {
        if (ipData && ipData.latitude && ipData.longitude) {
          const cityCountry = `${ipData.city || 'Local City'}, ${ipData.country_name || ''}`;
          const code = ipData.country_code || '';
          if (code) {
            setCountryCode(code);
            localStorage.setItem('user_country_code', code);
          }
          localStorage.setItem('user_lat', ipData.latitude);
          localStorage.setItem('user_lng', ipData.longitude);
          localStorage.setItem('user_location_name', cityCountry);
          fetchTimingsByCoords(ipData.latitude, ipData.longitude, month, year, cityCountry, 'ip', code);
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
              const code = ipData.countryCode || '';
              if (code) {
                setCountryCode(code);
                localStorage.setItem('user_country_code', code);
              }
              localStorage.setItem('user_lat', ipData.lat);
              localStorage.setItem('user_lng', ipData.lon);
              localStorage.setItem('user_location_name', cityCountry);
              fetchTimingsByCoords(ipData.lat, ipData.lon, month, year, cityCountry, 'ip', code);
            } else {
              fetchTimingsByCity('Karachi', 'Pakistan', month, year);
            }
          })
          .catch(() => fetchTimingsByCity('Karachi', 'Pakistan', month, year));
      });
  };

  const fetchTimingsByCoords = (lat, lng, month, year, label = 'Auto-Detected', type = 'gps', code = '') => {
    setLocationName(label);
    setLocationType(type);

    const activeCode = code || countryCode;
    const { method, hijriAdjustment, school = 0, countryCode: detectedCode } = getPrayerMethodAndAdjustment(activeCode);
    
    if (detectedCode && detectedCode !== countryCode) {
      setCountryCode(detectedCode);
      localStorage.setItem('user_country_code', detectedCode);
    }

    // Daily Timings
    fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}&hijriAdjustment=${hijriAdjustment}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setTimings(data.data.timings);
          localStorage.setItem('user_prayer_timings', JSON.stringify(data.data.timings));
          const h = data.data.date.hijri;
          const g = data.data.date.gregorian;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
          setGregorianDate(`${g.weekday.en}, ${g.day} ${g.month.en} ${g.year}`);
          calculateNextPrayer(data.data.timings);

          if (onLocationOrDateUpdate) {
            onLocationOrDateUpdate({
              hijri: h,
              lat: lat,
              lng: lng,
              countryCode: detectedCode || activeCode,
              city: label,
              timings: data.data.timings
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Monthly Calendar
    fetch(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}&hijriAdjustment=${hijriAdjustment}&month=${month}&year=${year}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) setMonthlyTimings(data.data);
      })
      .catch(() => {});
  };

  const fetchTimingsByCity = (city, country, month, year, forceCode = '') => {
    setLocationName(`${city}${country ? ', ' + country : ''}`);
    setLocationType('custom');

    const activeCode = forceCode || countryCode;
    const { method, hijriAdjustment, school = 0 } = getPrayerMethodAndAdjustment(activeCode);

    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country || '')}&method=${method}&school=${school}&hijriAdjustment=${hijriAdjustment}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const tz = data.data.meta.timezone || '';
          let detectedCode = activeCode;
          if (tz.includes('Karachi')) detectedCode = 'PK';
          else if (tz.includes('Kolkata') || tz.includes('Calcutta')) detectedCode = 'IN';
          else if (tz.includes('Dhaka')) detectedCode = 'BD';
          else if (tz.includes('Casablanca')) detectedCode = 'MA';
          else if (tz.includes('London')) detectedCode = 'GB';
          else if (tz.startsWith('America/')) detectedCode = 'US';
          else if (tz.includes('Cairo')) detectedCode = 'EG';

          if (detectedCode !== activeCode && !forceCode) {
            setCountryCode(detectedCode);
            localStorage.setItem('user_country_code', detectedCode);
            fetchTimingsByCity(city, country, month, year, detectedCode);
            return;
          }

          setTimings(data.data.timings);
          localStorage.setItem('user_prayer_timings', JSON.stringify(data.data.timings));
          const h = data.data.date.hijri;
          const g = data.data.date.gregorian;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
          setGregorianDate(`${g.weekday.en}, ${g.day} ${g.month.en} ${g.year}`);
          calculateNextPrayer(data.data.timings);

          const lat = data.data.meta.latitude;
          const lng = data.data.meta.longitude;
          if (lat && lng) {
            localStorage.setItem('user_lat', lat);
            localStorage.setItem('user_lng', lng);
            localStorage.setItem('user_location_name', `${city}${country ? ', ' + country : ''}`);
          }

          if (onLocationOrDateUpdate) {
            onLocationOrDateUpdate({
              hijri: h,
              lat: lat || null,
              lng: lng || null,
              countryCode: detectedCode,
              city: city,
              timings: data.data.timings
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country || '')}&method=${method}&hijriAdjustment=${hijriAdjustment}&month=${month}&year=${year}`)
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
    { key: 'Fajr', name: t('fajr', 'Fajr'), time: timings?.Fajr },
    { key: 'Sunrise', name: t('sunrise', 'Sunrise'), time: timings?.Sunrise },
    { key: 'Dhuhr', name: t('dhuhr', 'Dhuhr'), time: timings?.Dhuhr },
    { key: 'Asr', name: t('asr', 'Asr'), time: timings?.Asr },
    { key: 'Maghrib', name: t('maghrib', 'Maghrib'), time: timings?.Maghrib },
    { key: 'Isha', name: t('isha', 'Isha'), time: timings?.Isha }
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
              <i className="fas fa-hourglass-half"></i> {t('nextPrayer', 'Next Prayer')}: <strong style={{ color: 'var(--accent-gold)' }}>{t(nextPrayer.name.toLowerCase(), nextPrayer.name)}</strong> ({nextPrayer.time})
            </div>
          )}
          <button
            onClick={() => setShowAdhanSettings(true)}
            style={{
              background: adhanSettings.soundEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.12)',
              color: adhanSettings.soundEnabled ? '#34d399' : '#ffffff',
              border: '1px solid ' + (adhanSettings.soundEnabled ? '#10b981' : 'rgba(255,255,255,0.2)'),
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            title="Configure Adhan Call to Prayer & Alarm"
          >
            <i className={`fas ${adhanSettings.soundEnabled ? 'fa-bell' : 'fa-bell-slash'}`}></i>
            <span>{adhanSettings.soundEnabled ? t('adhanAlarmOn', 'Adhan Alarm ON') : t('adhanAlarmOff', 'Adhan Alarm OFF')}</span>
          </button>
          {isAdhanPlaying && (
            <button
              onClick={stopAdhanAudio}
              style={{
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fas fa-stop-circle"></i>
              <span>{t('stopAdhan', 'Stop Adhan')}</span>
            </button>
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
            {showCalendarView ? t('liveNimazView', 'Live Nimaz View') : t('timetableCalendar', 'Nimaz Timetable Calendar')}
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
            placeholder={t('typeCityPlaceholder', 'Type city name (e.g., Karachi, London, Makkah)...')}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.85rem', padding: '0 0.5rem' }}
          />
          <button type="submit" style={{ background: 'var(--accent-gold)', color: '#000', border: 'none', padding: '0.3rem 0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
            {t('updateLocation', 'Update Location')}
          </button>
          <button type="button" onClick={() => detectLocationAndFetch()} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
            <i className="fas fa-crosshairs"></i> {t('autoGps', 'Auto GPS')}
          </button>
        </form>
      )}

      {/* Active Adhan Alert Banner */}
      {(activeAdhanAlert || isAdhanPlaying) && (
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          margin: '0.85rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff',
          boxShadow: '0 8px 25px rgba(6,78,59,0.3)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontSize: '1.25rem' }}>
              <i className="fas fa-volume-up"></i>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t('adhanCallToPrayer', 'Call to Prayer • Hayya \'ala-s-Salah')}
              </div>
              <h3 style={{ margin: '2px 0 0', fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
                🕌 {activeAdhanAlert?.prayer || nextPrayer.name || 'Prayer'} Adhan Calling ({activeAdhanAlert?.time || nextPrayer.time})
              </h3>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={stopAdhanAudio}
              style={{
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fas fa-stop"></i> {t('stopAdhan', 'Stop Adhan')}
            </button>
          </div>
        </div>
      )}

      {/* Adhan & Prayer Notification Alarm Settings Modal */}
      {showAdhanSettings && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card, #ffffff)', color: 'var(--text-main, #0f172a)',
            width: '100%', maxWidth: '480px', borderRadius: '24px',
            padding: '1.75rem', border: '2px solid var(--accent-gold, #f59e0b)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)', position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color, #e2e8f0)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.35rem', color: 'var(--accent-gold, #f59e0b)' }}>🔔</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{t('adhanSettingsTitle', 'Adhan & Prayer Alarms')}</h3>
              </div>
              <button
                onClick={() => setShowAdhanSettings(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {/* Master Sound Switch */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '14px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{t('masterAdhanSound', 'Play Audio Adhan')}</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{t('masterAdhanSoundDesc', 'Plays authentic Adhan audio when prayer time begins.')}</p>
              </div>
              <input
                type="checkbox"
                checked={adhanSettings.soundEnabled}
                onChange={e => setAdhanSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                style={{ width: '22px', height: '22px', cursor: 'pointer' }}
              />
            </div>

            {/* Browser Push Notifications Switch */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '14px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{t('browserPushAlerts', 'Browser Push Notifications')}</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  {notifPermission === 'granted' ? t('notificationsActive', 'System notifications are active.') : t('clickToEnableNotif', 'Permission required for popup alarms.')}
                </p>
              </div>
              {notifPermission !== 'granted' ? (
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('enable', 'Enable')}
                </button>
              ) : (
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.9rem' }}>✓ {t('enabled', 'Enabled')}</span>
              )}
            </div>

            {/* Volume Slider */}
            <div style={{ marginBottom: '1.25rem', padding: '0 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                <span>{t('adhanVolume', 'Adhan Volume')}</span>
                <span style={{ color: 'var(--accent-gold, #f59e0b)' }}>{adhanSettings.volume}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={adhanSettings.volume}
                onChange={e => setAdhanSettings(prev => ({ ...prev, volume: parseInt(e.target.value, 10) }))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* Per-Prayer Toggles */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
                {t('activePrayerAlarms', 'Select Prayers to Sound Adhan')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(pName => (
                  <label
                    key={pName}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: '10px',
                      background: adhanSettings.prayers?.[pName] ? 'rgba(5, 150, 105, 0.1)' : '#f1f5f9',
                      border: '1px solid ' + (adhanSettings.prayers?.[pName] ? '#059669' : '#cbd5e1'),
                      cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700
                    }}
                  >
                    <span>{t(pName.toLowerCase(), pName)}</span>
                    <input
                      type="checkbox"
                      checked={!!adhanSettings.prayers?.[pName]}
                      onChange={() => togglePrayerAlarm(pName)}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Test & Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  if (isAdhanPlaying) {
                    stopAdhanAudio();
                  } else {
                    playAdhanAudio('Test');
                  }
                }}
                style={{
                  flex: 1, padding: '10px', borderRadius: '12px',
                  background: isAdhanPlaying ? '#ef4444' : '#0f172a',
                  color: '#ffffff', border: 'none', fontWeight: 800,
                  fontSize: '0.88rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <i className={`fas ${isAdhanPlaying ? 'fa-stop' : 'fa-play'}`}></i>
                <span>{isAdhanPlaying ? t('stopTest', 'Stop Test') : t('testAdhanAudio', 'Test Adhan Audio')}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAdhanSettings(false)}
                style={{
                  padding: '10px 20px', borderRadius: '12px',
                  background: 'var(--accent-gold, #f59e0b)',
                  color: '#000000', border: 'none', fontWeight: 800,
                  fontSize: '0.88rem', cursor: 'pointer'
                }}
              >
                {t('saveClose', 'Done')}
              </button>
            </div>
          </div>
        </div>
      )}

      {!showCalendarView ? (
        /* Live Daily Nimaz View & Countdowns */
        <div>
          {/* Live Countdown Cards Row */}
          <div style={{ marginBottom: '1.25rem' }}>
            {/* Next Prayer Countdown Card */}
            <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)', border: '1.5px solid var(--accent-gold)', borderRadius: '16px', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#fcd34d', letterSpacing: '0.5px' }}>{t('nextNimazCountdown', 'Next Nimaz Countdown')}</span>
                <h4 style={{ margin: '0.15rem 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {t(nextPrayer.name.toLowerCase(), nextPrayer.name || 'Prayer')} ({nextPrayer.time || '--:--'})
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--accent-gold)', fontFamily: 'monospace' }}>
                  ⏱️ {countdownText || '00m 00s'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Daily Nimaz View */}
          <div className="prayer-times-grid">
            {mainPrayers.map((p) => {
              const isNext = nextPrayer.name === p.key;
              return (
                <div key={p.key} className={`prayer-time-box ${isNext ? 'active-prayer' : ''}`}>
                  <div className="prayer-name">{p.name}</div>
                  <div className="prayer-val">{p.time || '--:--'}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full Month Daily Nimaz Timetable Calendar */
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span><i className="fas fa-calendar-alt"></i> {t('fullMonthSchedule', 'Full Month Schedule')} ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}) - {locationName}</span>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 400 }}>{t('showingAllDays', 'Showing all days of the month')}</span>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'center' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 5, background: '#022c22', color: 'var(--accent-gold)' }}>
                <tr style={{ borderBottom: '2px solid rgba(245,158,11,0.3)' }}>
                  <th style={{ padding: '0.65rem 0.5rem' }}>{t('dateHeader', 'Date')}</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>{t('fajr', 'Fajr')}</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>{t('sunrise', 'Sunrise')}</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>{t('dhuhr', 'Dhuhr')}</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>{t('asr', 'Asr')}</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>{t('maghrib', 'Maghrib')}</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>{t('isha', 'Isha')}</th>
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
                        {day.date?.readable} {isToday && <span style={{ fontSize: '0.7rem', background: 'var(--accent-gold)', color: '#000', padding: '1px 6px', borderRadius: '10px', marginLeft: '4px' }}>{t('todayBadge', 'Today')}</span>}
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
