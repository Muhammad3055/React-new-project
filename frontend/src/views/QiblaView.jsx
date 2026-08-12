import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

const PRESET_CITIES = [
  { name: 'Quetta, Pakistan', lat: 30.1798, lon: 66.9750 },
  { name: 'Karachi, Pakistan', lat: 24.8607, lon: 67.0011 },
  { name: 'Lahore, Pakistan', lat: 31.5204, lon: 74.3587 },
  { name: 'Islamabad, Pakistan', lat: 33.6844, lon: 73.0479 },
  { name: 'Peshawar, Pakistan', lat: 34.0151, lon: 71.5249 },
  { name: 'Multan, Pakistan', lat: 30.1575, lon: 71.5249 },
  { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lon: 46.6753 },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708 },
  { name: 'Istanbul, Turkey', lat: 41.0082, lon: 28.9784 },
  { name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.0060 }
];

export default function QiblaView() {
  const { t, lang, dir } = useLanguage();

  const [location, setLocation] = useState({ lat: 30.1798, lon: 66.9750, name: 'Quetta, Pakistan (Default)' });
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locError, setLocError] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');

  // Device orientation sensor states
  const [deviceHeading, setDeviceHeading] = useState(null);
  const [isSensorAvailable, setIsSensorAvailable] = useState(false);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt' | 'granted' | 'denied'

  // Calculate Qibla Bearing angle in degrees (0-360)
  const calculateBearing = (userLat, userLon) => {
    const phi1 = (userLat * Math.PI) / 180;
    const phi2 = (KAABA_LAT * Math.PI) / 180;
    const deltaLambda = ((KAABA_LON - userLon) * Math.PI) / 180;

    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  // Calculate Distance to Makkah in KM
  const calculateDistance = (userLat, userLon) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((KAABA_LAT - userLat) * Math.PI) / 180;
    const dLon = ((KAABA_LON - userLon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLat * Math.PI) / 180) *
        Math.cos((KAABA_LAT * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const qiblaBearing = calculateBearing(location.lat, location.lon);
  const distanceToMakkah = calculateDistance(location.lat, location.lon);

  // Request GPS Location from Browser Geolocation API
  const requestGpsLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLoc(true);
    setLocError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoadingLoc(false);
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: `GPS Location (${pos.coords.latitude.toFixed(4)}°, ${pos.coords.longitude.toFixed(4)}°)`
        });
      },
      (err) => {
        setLoadingLoc(false);
        setLocError(err.message || 'Unable to retrieve your location. Please select a city manually below.');
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      requestGpsLocation();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Request Device Orientation Sensor (iOS 13+ & Android)
  useEffect(() => {
    const handleOrientation = (e) => {
      let compass = null;
      if (e.webkitCompassHeading !== undefined) {
        // iOS Safari webkitCompassHeading
        compass = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android Device Orientation
        compass = 360 - e.alpha;
      }

      if (compass !== null && !isNaN(compass)) {
        setDeviceHeading(compass);
        setIsSensorAvailable(true);
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined') {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ permission workflow
      } else {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const requestOrientationPermission = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            setPermissionState('granted');
            window.addEventListener('deviceorientation', (e) => {
              if (e.webkitCompassHeading !== undefined) setDeviceHeading(e.webkitCompassHeading);
            }, true);
          } else {
            setPermissionState('denied');
          }
        })
        .catch(console.error);
    }
  };

  const handleCitySelect = (cityName) => {
    const selected = PRESET_CITIES.find(c => c.name === cityName);
    if (selected) {
      setManualCity(cityName);
      setLocation({ lat: selected.lat, lon: selected.lon, name: selected.name });
      setLocError('');
    }
  };

  const handleCustomCoordinatesSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      setLocation({ lat, lon, name: `Custom (${lat.toFixed(4)}°, ${lon.toFixed(4)}°)` });
      setLocError('');
    } else {
      setLocError('Please enter valid Latitude (-90 to 90) and Longitude (-180 to 180).');
    }
  };

  // Dial rotation calculation
  const compassDialRotation = deviceHeading !== null ? -deviceHeading : 0;
  const needleRotation = deviceHeading !== null ? qiblaBearing - deviceHeading : qiblaBearing;

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem', maxWidth: '850px', margin: 'auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1c1917', margin: '0 0 0.5rem 0' }}>
          <i className="fas fa-compass" style={{ color: 'var(--accent-gold)', marginRight: '0.5rem' }}></i>
          {t('qiblaFinderTitle', 'Qibla Direction Compass')}
        </h1>
        <p style={{ color: '#78716c', fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>
          {t('qiblaFinderSubtitle', 'Accurate live Qibla bearing towards the Holy Kaaba in Makkah Mukarramah')}
        </p>
      </div>

      {/* Main Grid: Compass Visual & Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        
        {/* Animated Interactive Compass Dial Card */}
        <div
          className="card"
          style={{
            padding: '2rem 1.5rem',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid var(--border-color)',
            boxShadow: '0 12px 35px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Compass Outer Ring */}
          <div
            style={{
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              border: '8px solid #fef3c7',
              boxShadow: '0 0 0 4px var(--accent-gold), inset 0 0 20px rgba(180, 83, 9, 0.1)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle, #ffffff 60%, #fdfbf7 100%)',
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* Compass Directions N, E, S, W */}
            <span style={{ position: 'absolute', top: '10px', fontWeight: 900, color: '#dc2626', fontSize: '1.1rem' }}>N</span>
            <span style={{ position: 'absolute', right: '14px', fontWeight: 800, color: '#78716c', fontSize: '0.95rem' }}>E</span>
            <span style={{ position: 'absolute', bottom: '10px', fontWeight: 800, color: '#78716c', fontSize: '0.95rem' }}>S</span>
            <span style={{ position: 'absolute', left: '14px', fontWeight: 800, color: '#78716c', fontSize: '0.95rem' }}>W</span>

            {/* Qibla Direction Needle Arrow */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: `rotate(${needleRotation}deg)`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}
            >
              {/* Gold Kaaba Pointer Arrow */}
              <div style={{ position: 'absolute', top: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', background: '#1c1917', borderRadius: '6px', border: '2px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} title="Kaaba Makkah">
                  <i className="fas fa-kaaba" style={{ color: 'var(--accent-gold)', fontSize: '0.9rem' }}></i>
                </div>
                <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '25px solid var(--accent-gold)', marginTop: '-4px' }}></div>
              </div>
            </div>

            {/* Center Pivot Point */}
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-gold)', border: '3px solid #ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)', zIndex: 10 }}></div>
          </div>

          {/* Compass Bearing Details */}
          <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-gold)', margin: 0 }}>
              {qiblaBearing.toFixed(1)}°
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#78716c', margin: '4px 0 0 0', fontWeight: 700 }}>
              {t('qiblaAngleFromNorth', 'Qibla Angle from True North')}
            </p>

            {isSensorAvailable ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', padding: '0.3rem 0.85rem', borderRadius: '15px', background: '#dcfce7', color: '#15803d', fontSize: '0.78rem', fontWeight: 800 }}>
                <i className="fas fa-mobile-alt"></i> {t('liveCompassActive', 'Live Phone Compass Active')}
              </span>
            ) : (
              <div style={{ marginTop: '0.75rem' }}>
                {typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function' && permissionState === 'prompt' && (
                  <button
                    onClick={requestOrientationPermission}
                    style={{ padding: '0.4rem 0.9rem', borderRadius: '16px', background: '#ffffff', color: 'var(--accent-gold)', border: '2px solid var(--accent-gold)', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    <i className="fas fa-compass"></i> Enable Mobile Live Sensor
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Location & Controls Card */}
        <div>
          {/* Current Location Badge */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem', background: '#ffffff', borderRadius: '20px', border: '1.5px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}></i>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1c1917' }}>
                  {t('yourLocation', 'Your Current Location')}
                </h3>
              </div>
              <button
                onClick={requestGpsLocation}
                disabled={loadingLoc}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '14px', background: '#ffffff', border: '1.5px solid var(--accent-gold)', color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
              >
                {loadingLoc ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-crosshairs"></i> GPS Detect</>}
              </button>
            </div>

            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#1c1917' }}>
              {location.name}
            </p>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: '#78716c', fontWeight: 600 }}>
              <span><i className="fas fa-globe"></i> Lat: <strong>{location.lat.toFixed(4)}°</strong></span>
              <span><i className="fas fa-globe"></i> Lon: <strong>{location.lon.toFixed(4)}°</strong></span>
              <span><i className="fas fa-kaaba"></i> Distance: <strong style={{ color: 'var(--accent-gold)' }}>{distanceToMakkah} km</strong></span>
            </div>

            {locError && (
              <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.8rem' }}>
                <i className="fas fa-exclamation-circle"></i> {locError}
              </div>
            )}
          </div>

          {/* Manual City Selector */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem', background: '#ffffff', borderRadius: '20px', border: '1.5px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1c1917', marginBottom: '0.5rem' }}>
              <i className="fas fa-city" style={{ color: 'var(--accent-gold)', marginRight: '0.35rem' }}></i>
              {t('selectCity', 'Select City Manually')}
            </label>
            <select
              value={manualCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1.5px solid #d1d5db', fontSize: '0.88rem', background: '#ffffff', color: '#1c1917', fontWeight: 600, outline: 'none' }}
            >
              <option value="">-- Choose Preset City --</option>
              {PRESET_CITIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Custom Latitude & Longitude Input Form */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', background: '#ffffff', borderRadius: '20px', border: '1.5px solid var(--border-color)' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', fontWeight: 800, color: '#1c1917' }}>
              <i className="fas fa-sliders-h" style={{ color: 'var(--accent-gold)', marginRight: '0.35rem' }}></i>
              {t('customCoordinates', 'Enter Custom Latitude & Longitude')}
            </h4>
            <form onSubmit={handleCustomCoordinatesSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="number"
                step="any"
                placeholder="Latitude (e.g. 30.1798)"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                style={{ flex: 1, minWidth: '120px', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #d1d5db', fontSize: '0.85rem', outline: 'none' }}
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude (e.g. 66.9750)"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                style={{ flex: 1, minWidth: '120px', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #d1d5db', fontSize: '0.85rem', outline: 'none' }}
              />
              <button
                type="submit"
                style={{ padding: '0.55rem 1rem', borderRadius: '10px', border: '2px solid var(--accent-gold)', background: '#ffffff', color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Apply
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
