import React, { useState, useEffect, useRef } from 'react';
import { cleanPrayerTime, countdown, dateKey, loadPrayerSchedule, nextPrayerEvent, validCoordinates } from '../utils/prayerTimes';
import { detectDeviceLocation, detectNetworkLocation } from '../utils/prayerLocation';
import { useLanguage } from '../context/LanguageContext';

export default function PrayerTimesWidget({ onLocationOrDateUpdate, compact = false }) {
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
  const [locationName, setLocationName] = useState(() => t('detectingLocation', 'Detecting your location automatically'));
  const [locationType, setLocationType] = useState('ip'); // 'gps' | 'ip' | 'custom'
  const [customCity, setCustomCity] = useState('');
  const [showCityInput, setShowCityInput] = useState(false);
  const [customCountry, setCustomCountry] = useState('');
  const [error, setError] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [scheduleTimezone, setScheduleTimezone] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [refresh, setRefresh] = useState(0);
  const [compactExpanded, setCompactExpanded] = useState(false);
  const detectionRef = useRef(0);
  const lastDetectionRef = useRef(0);
  const callbackRef = useRef(onLocationOrDateUpdate);
  callbackRef.current = onLocationOrDateUpdate;
  const [location, setLocation] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('maktaba_prayer_location'));
      return saved?.type === 'custom' && saved.city && saved.country
        ? saved : saved && validCoordinates(saved.lat, saved.lng) && saved.label ? saved : null;
    } catch { return null; }
  });
  const [calculation, setCalculation] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('maktaba_prayer_calculation'));
      return { method: saved?.method || 'auto', school: saved?.school || 'auto' };
    } catch { return { method: 'auto', school: 'auto' }; }
  });

  const [countdownText, setCountdownText] = useState('');
  const [sehriCountdown, setSehriCountdown] = useState('');
  const [iftarCountdown, setIftarCountdown] = useState('');

  // Audio Adhan & Prayer Notification Alarm State
  const adhanAudioRef = useRef(null);
  const [showAdhanSettings, setShowAdhanSettings] = useState(false);
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [activeAdhanAlert, setActiveAdhanAlert] = useState(null);
  const lastTriggeredPrayerRef = useRef('');
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
      adhanAudioRef.current.volume = (adhanSettings.volume ?? 85) / 100;
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
    audio.volume = (adhanSettings.volume ?? 85) / 100;
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

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(timer); adhanAudioRef.current?.pause(); };
  }, []);

  const detectLocationAndFetch = async (preciseOnly = false) => {
    const id = ++detectionRef.current;
    lastDetectionRef.current = Date.now();
    setError('');
    let winner = 0;
    const useFound = (found, priority) => {
      if (id !== detectionRef.current || priority < winner) return;
      winner = priority;
      setLocation(previous => previous?.type === found.type && previous?.lat === found.lat && previous?.lng === found.lng && previous?.label === found.label ? previous : found);
      setLocationName(found.label);
      setShowCityInput(false);
    };
    const tasks = [detectDeviceLocation().then(found => useFound(found, 2))];
    if (!preciseOnly) tasks.push(detectNetworkLocation().then(found => useFound(found, 1)));
    await Promise.allSettled(tasks);
    if (id !== detectionRef.current || winner) return;
    if (preciseOnly) {
      setError(t('preciseGpsUnavailable', 'Precise GPS is unavailable. Retry automatic location.'));
      return;
    }
    if (!location) {
      setLoading(false);
      setLocationName(t('locationUnavailable', 'Location unavailable'));
      setError(t('automaticLocationUnavailable', 'Automatic location is temporarily unavailable.'));
    }
  };

  useEffect(() => {
    detectLocationAndFetch();
    return () => { detectionRef.current += 1; };
  }, []);

  const localDay = dateKey(new Date(now), scheduleTimezone || location?.timezone || 'UTC');
  useEffect(() => {
    if (!location) return;
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 30000);
    setLoading(true);
    setError('');
    setTimings(null);
    setSchedule(null);
    setMonthlyTimings([]);
    setCountdownText('');
    setSehriCountdown('');
    setIftarCountdown('');
    stopAdhanAudio();
    setNextPrayer({ name: '', time: '' });
    setLocationName(location.label);
    setLocationType(location.type);
    loadPrayerSchedule(location, calculation, controller.signal).then(result => {
      if (!active) return;
      const { today, days } = result;
      const times = Object.fromEntries(Object.entries(today.timings).map(([name, value]) => [name, cleanPrayerTime(value)]));
      setSchedule(result);
      setScheduleTimezone(result.timezone);
      setTimings(times);
      setMonthlyTimings(days);
      const h = today.date.hijri;
      const g = today.date.gregorian;
      setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
      setGregorianDate(`${g.weekday.en}, ${g.day} ${g.month.en} ${g.year}`);
      try {
        localStorage.setItem('maktaba_prayer_location', JSON.stringify(location));
        localStorage.setItem('maktaba_prayer_calculation', JSON.stringify(calculation));
        localStorage.setItem('user_location_name', location.label);
        localStorage.setItem('user_lat', today.meta.latitude);
        localStorage.setItem('user_lng', today.meta.longitude);
        localStorage.setItem('user_country_code', location.countryCode || '');
        localStorage.setItem('user_prayer_timings', JSON.stringify(times));
        localStorage.setItem('user_prayer_timezone', result.timezone || '');
      } catch { /* Prayer times also work when browser storage is disabled. */ }
      callbackRef.current?.({ hijri: h, lat: today.meta.latitude, lng: today.meta.longitude,
        countryCode: location.countryCode || '', city: location.label, timings: times, timezone: result.timezone || '' });
    }).catch(err => {
      if (!active) return;
      setSchedule(null);
      setMonthlyTimings([]);
      setError(err.name === 'AbortError' ? 'Prayer service timed out. Please retry.' : err.message);
    }).finally(() => { clearTimeout(timeout); if (active) setLoading(false); });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [location, calculation, refresh, localDay]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      setNow(Date.now());
      if (location?.type !== 'custom' && Date.now() - lastDetectionRef.current > 10 * 60 * 1000) detectLocationAndFetch();
      else setRefresh(value => value + 1);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [location]);

  useEffect(() => {
    if (!schedule || loading || !timings) return;
    const current = new Date(now);
    setLiveTime(current.toLocaleTimeString([], { timeZone: schedule.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const next = nextPrayerEvent(schedule.events, now);
    setNextPrayer(next || { name: '', time: '' });
    setCountdownText(countdown(next?.at, now));
    setSehriCountdown(countdown(nextPrayerEvent(schedule.events, now, 'Fajr')?.at, now));
    setIftarCountdown(countdown(nextPrayerEvent(schedule.events, now, 'Maghrib')?.at, now));
    const event = schedule.events.find(item => item.at <= now && now - item.at < 60000);
    if (!event || adhanSettings?.prayers?.[event.name] === false) return;
    const key = `${schedule.timezone}_${event.date}_${event.name}_${event.time}`;
    let previous = lastTriggeredPrayerRef.current;
    try { previous = localStorage.getItem('maktaba_last_triggered_adhan') || previous; } catch {}
    if (previous === key) return;
    lastTriggeredPrayerRef.current = key;
    try { localStorage.setItem('maktaba_last_triggered_adhan', key); } catch {}
    setActiveAdhanAlert({ prayer: event.name, time: event.time });
    if (adhanSettings.soundEnabled) playAdhanAudio(event.name);
    if ('Notification' in window && Notification.permission === 'granted' && adhanSettings.notificationsEnabled) {
      try { new Notification(`Time for ${event.name} Salah`, { body: `${event.time} — ${locationName}`, icon: '/favicon-96x96.png' }); } catch {}
    }
  }, [now, schedule, timings, loading, adhanSettings, locationName]);

  const handleCustomCitySubmit = (e) => {
    e.preventDefault();
    if (!customCity.trim() || !customCountry.trim()) return;
    detectionRef.current += 1;
    setLocation({ type: 'custom', city: customCity.trim(), country: customCountry.trim(),
      countryCode: /^[a-z]{2}$/i.test(customCountry.trim()) ? customCountry.trim().toUpperCase() : '',
      label: `${customCity.trim()}, ${customCountry.trim()}` });
    setShowCityInput(false);
  };

  const mainPrayers = [
    { key: 'Fajr', name: t('fajr', 'Fajr'), time: timings?.Fajr },
    { key: 'Sunrise', name: t('sunrise', 'Sunrise'), time: timings?.Sunrise },
    { key: 'Dhuhr', name: t('dhuhr', 'Dhuhr'), time: timings?.Dhuhr },
    { key: 'Asr', name: t('asr', 'Asr'), time: timings?.Asr },
    { key: 'Maghrib', name: t('maghrib', 'Maghrib'), time: timings?.Maghrib },
    { key: 'Isha', name: t('isha', 'Isha'), time: timings?.Isha }
  ];

  if (compact && !compactExpanded) {
    return (
      <section className="home-prayer-summary" aria-label={t('prayerTimesLabel', 'Prayer times')}>
        <div className="home-prayer-summary-top">
          <div>
            <span className="home-eyebrow">{t('prayerTimesLabel', 'Prayer times')}</span>
            <button type="button" className="home-location-button" aria-label={`${t('changeLocation', 'Change location')}: ${locationName}`} onClick={() => setShowCityInput(value => !value)}>
              <i className="fas fa-location-dot" aria-hidden="true" /> {locationName} <i className="fas fa-pen" aria-hidden="true" />
            </button>
          </div>
          {timings && nextPrayer.name && nextPrayer.time && <div className="home-next-prayer"><span>{t('nextPrayer', 'Next Prayer')}</span><strong>{t(nextPrayer.name.toLowerCase(), nextPrayer.name)} · <bdi dir="ltr">{nextPrayer.time}</bdi></strong></div>}
        </div>
        {loading && !timings ? <p role="status" className="home-prayer-state">{t('findingPrayerTimes', 'Finding local prayer times…')}</p> : error && !timings ? <p role="alert" className="home-prayer-state">{t('prayerLoadError', 'Prayer times could not be loaded. Please retry.')} <button type="button" onClick={() => location ? setRefresh(value => value + 1) : detectLocationAndFetch()}>{t('retry', 'Retry')}</button></p> : timings && mainPrayers.some(prayer => prayer.time) ? (
          <div className="home-prayer-times">
            {mainPrayers.filter(prayer => prayer.time).map(prayer => <div key={prayer.key}><span>{prayer.name}</span><strong dir="ltr">{prayer.time.split(' ')[0]}</strong></div>)}
          </div>
        ) : <p role="status" className="home-prayer-state">{t('prayerTimesUnavailable', 'Prayer times are not available right now.')}</p>}
        {showCityInput && <form className="home-city-form" onSubmit={handleCustomCitySubmit}>
          <input value={customCity} onChange={event => setCustomCity(event.target.value)} placeholder={t('city', 'City')} required aria-label={t('city', 'City')} />
          <input value={customCountry} onChange={event => setCustomCountry(event.target.value)} placeholder={t('country', 'Country')} required aria-label={t('country', 'Country')} />
          <button type="submit">{t('updateLocation', 'Update location')}</button>
          <button type="button" onClick={() => detectLocationAndFetch(true)}>{t('autoGps', 'Auto GPS')}</button>
        </form>}
        <button type="button" className="home-prayer-details" onClick={() => setCompactExpanded(true)}>{t('fullScheduleSettings', 'Full schedule & prayer settings')} <i className="fas fa-arrow-right" aria-hidden="true" /></button>
      </section>
    );
  }

  return (
    <div className="prayer-widget-card">
      {compact && <button type="button" className="home-prayer-details" onClick={() => setCompactExpanded(false)}>{t('backToPrayerSummary', 'Back to prayer summary')}</button>}
      <div className="prayer-widget-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="hijri-badge"><i className="fas fa-calendar-alt"></i> {timings ? hijriDate : '—'}</span>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{timings ? gregorianDate : ''}</span>
          
          {/* Location Badge */}
          <button type="button"
            className="prayer-location-badge"
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
            title={t('changeLocation', 'Change location')}
            aria-label={`${t('changeLocation', 'Change location')}: ${locationName}`}
          >
            <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent-gold)' }}></i>
            <span>📍 {locationName}</span>
            <i className="fas fa-edit" style={{ fontSize: '0.7rem', opacity: 0.7 }}></i>
          </button>

          {/* Live Ticking Clock */}
          <span style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,158,11,0.4)', color: 'var(--accent-gold)', padding: '2px 10px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            <i className="fas fa-clock" style={{ marginInlineEnd: '4px' }}></i> {timings && <bdi dir="ltr">{liveTime}</bdi>}
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

      <div className="prayer-location-controls">
        <span><i className="fas fa-location-arrow" aria-hidden="true"></i> {loading && !timings ? t('findingPrayerTimes', 'Finding local prayer times…') : location ? `${t('timesForLocation', 'Times for')} ${location.label}` : t('detectingLocation', 'Detecting your location automatically')}</span>
        <button type="button" onClick={() => detectLocationAndFetch(true)}><i className="fas fa-crosshairs" aria-hidden="true"></i> {t('autoGps', 'Auto GPS')}</button>
        <details className="prayer-settings">
          <summary><i className="fas fa-sliders-h" aria-hidden="true"></i> {t('prayerSettings', 'Prayer settings')}</summary>
          <div className="prayer-settings-fields">
            <label>{t('calculationMethod', 'Calculation method')} <select aria-label={t('calculationMethod', 'Calculation method')} value={calculation.method} onChange={e => setCalculation(prev => ({ ...prev, method: e.target.value }))}>
              <option value="auto">{t('automaticRegionalMethod', 'Automatic regional method')}</option>
              <option value="1">Karachi</option><option value="2">ISNA</option><option value="3">Muslim World League</option>
              <option value="4">Umm Al-Qura, Makkah</option><option value="5">Egyptian Authority</option>
              <option value="8">Gulf Region</option><option value="9">Kuwait</option><option value="10">Qatar</option>
              <option value="11">Singapore</option><option value="12">France</option><option value="13">Turkey</option>
              <option value="14">Russia</option><option value="15">Moonsighting Committee</option><option value="16">Dubai</option>
              <option value="17">Malaysia</option><option value="20">Indonesia</option><option value="21">Morocco</option>
            </select></label>
            <label>{t('asrCalculation', 'Asr calculation')} <select aria-label={t('asrCalculation', 'Asr calculation')} value={calculation.school} onChange={e => setCalculation(prev => ({ ...prev, school: e.target.value }))}>
              <option value="auto">{t('regionalDefault', 'Regional default')}</option><option value="0">{t('standardAsr', 'Standard (Shafi, Maliki, Hanbali)')}</option><option value="1">{t('hanafiAsr', 'Hanafi')}</option>
            </select></label>
            <button type="button" onClick={() => setShowCityInput(value => !value)}>{t('chooseDifferentCity', 'Choose a different city')}</button>
          </div>
        </details>
      </div>
      <p style={{ marginTop: '8px', fontSize: '.8rem' }}>
        {schedule && !loading && `${schedule.timezone} · ${schedule.today.meta.method?.name || t('regionalDefault', 'Regional calculation')} · ${schedule.school === '1' ? t('hanafiAsr', 'Hanafi Asr') : t('standardAsr', 'Standard Asr')}`}
        {locationType === 'ip' && ` · ${t('approximateLocationInfo', 'Approximate location from your network; use GPS or choose your city for better accuracy.')}`}
      </p>
      <p style={{ fontSize: '.78rem', opacity: .85 }}>{t('calculatedPrayerTimesNote', 'Calculated prayer start times. Your mosque’s jamaat times may differ. Adhan alerts require this page to remain open.')}</p>
      {loading && <p role="status">{t('findingPrayerTimes', 'Finding local prayer times…')}</p>}
      {error && <p role="alert" className="prayer-location-error">{t('prayerLoadError', 'Prayer times could not be loaded. Please retry.')} <button type="button" onClick={() => location ? setRefresh(v => v + 1) : detectLocationAndFetch()}>{t('retry', 'Retry')}</button> {!location && <button type="button" onClick={() => setShowCityInput(true)}>{t('chooseDifferentCity', 'Choose a different city')}</button>}</p>}
      {/* Change City Input Bar */}
      {showCityInput && (
        <form onSubmit={handleCustomCitySubmit} style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--accent-gold)' }}>
          <input
            type="text"
            required
            aria-label="City"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            placeholder={t('typeCityPlaceholder', 'Type city name (e.g., Karachi, London, Makkah)...')}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.85rem', padding: '0 0.5rem' }}
          />
          <input required aria-label={t('country', 'Country')} value={customCountry} onChange={e => setCustomCountry(e.target.value)} placeholder={`${t('country', 'Country')} (e.g. Pakistan, United Kingdom)`} style={{ flex: 1, minWidth: '160px', padding: '8px', borderRadius: '8px' }} />
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
            {nextPrayer.name && nextPrayer.time && <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)', border: '1.5px solid var(--accent-gold)', borderRadius: '16px', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#fcd34d', letterSpacing: '0.5px' }}>{t('nextPrayer', 'Next Prayer')}</span>
                <h4 style={{ margin: '0.15rem 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {t(nextPrayer.name.toLowerCase(), nextPrayer.name || 'Prayer')} {nextPrayer.time && <bdi dir="ltr">({nextPrayer.time})</bdi>}
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--accent-gold)', fontFamily: 'monospace' }}>
                  ⏱️ {countdownText}
                </span>
              </div>
            </div>}
          </div>

          {/* Live Daily Nimaz View */}
          {timings && mainPrayers.some(prayer => prayer.time) && <div className="prayer-times-grid">
            {mainPrayers.filter(prayer => prayer.time).map((p) => {
              const isNext = nextPrayer.name === p.key;
              return (
                <div key={p.key} className={`prayer-time-box ${isNext ? 'active-prayer' : ''}`}>
                  <div className="prayer-name">{p.name}</div>
                  <div className="prayer-val" dir="ltr">{p.time}</div>
                </div>
              );
            })}
          </div>}
          {!loading && !error && !mainPrayers.some(prayer => prayer.time) && <p role="status" className="prayer-times-unavailable">{t('prayerTimesUnavailable', 'Prayer times are not available right now.')}</p>}
        </div>
      ) : (
        /* Full Month Daily Nimaz Timetable Calendar */
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span><i className="fas fa-calendar-alt"></i> {t('fullMonthSchedule', 'Full Month Schedule')} ({new Date(now).toLocaleString('default', { timeZone: schedule?.timezone || 'UTC', month: 'long', year: 'numeric' })}) - {locationName}</span>
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
                  const isToday = day.date?.gregorian?.date === localDay;

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
                      <td dir="ltr" style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{cleanPrayerTime(day.timings?.Fajr) || '—'}</td>
                      <td dir="ltr" style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{cleanPrayerTime(day.timings?.Sunrise) || '—'}</td>
                      <td dir="ltr" style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{cleanPrayerTime(day.timings?.Dhuhr) || '—'}</td>
                      <td dir="ltr" style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{cleanPrayerTime(day.timings?.Asr) || '—'}</td>
                      <td dir="ltr" style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{cleanPrayerTime(day.timings?.Maghrib) || '—'}</td>
                      <td dir="ltr" style={{ padding: '0.5rem', color: isToday ? '#fff' : '#cbd5e1' }}>{cleanPrayerTime(day.timings?.Isha) || '—'}</td>
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
