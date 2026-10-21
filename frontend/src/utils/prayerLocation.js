import { validCoordinates } from './prayerTimes.js';

async function getJson(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('Location service unavailable');
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export function normaliseNetworkLocation(data) {
  if (!data || data.success === false || data.error) return null;
  const geo = data.geoLocation || data;
  const lat = geo.latitude ?? geo.lat;
  const lng = geo.longitude ?? geo.lng;
  if (!validCoordinates(lat, lng)) return null;
  const city = geo.city || geo.region || '';
  const country = geo.country_name || geo.country || '';
  const timezone = typeof data.timezone === 'object'
    ? (data.timezone.id || data.timezone.time_zone)
    : data.timezone;
  if (!city || !country || !timezone) return null;
  try { new Intl.DateTimeFormat('en', { timeZone: timezone }); } catch { return null; }
  return {
    type: 'ip', lat: Number(lat), lng: Number(lng), city, country,
    countryCode: geo.countryCode || geo.country_code || '', timezone,
    label: `${city}, ${country}`,
  };
}

export async function detectNetworkLocation() {
  const urls = ['/api/prayer/location/', 'https://ipapi.co/json/', 'https://ipwho.is/'];
  return Promise.any(urls.map(async url => {
    const location = normaliseNetworkLocation(await getJson(url));
    if (!location) throw new Error('Incomplete location response');
    return location;
  }));
}

export async function detectDeviceLocation() {
  if (!navigator.geolocation || !window.isSecureContext) throw new Error('Device location unavailable');
  const position = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Device location timed out')), 9000);
    navigator.geolocation.getCurrentPosition(
      value => { clearTimeout(timer); resolve(value); },
      error => { clearTimeout(timer); reject(error); },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  });
  const { latitude: lat, longitude: lng } = position.coords;
  if (!validCoordinates(lat, lng)) throw new Error('Invalid device location');
  const location = {
    type: 'gps', lat, lng, city: '', country: '', countryCode: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    label: 'Device location',
  };
  try {
    const geo = await getJson(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`);
    const address = geo.address || {};
    location.city = address.city || address.town || address.village || address.state || '';
    location.country = address.country || '';
    location.countryCode = (address.country_code || '').toUpperCase();
    location.label = [location.city, location.country].filter(Boolean).join(', ') || location.label;
  } catch { /* Coordinates still provide accurate prayer times. */ }
  return location;
}
