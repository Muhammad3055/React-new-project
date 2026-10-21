export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function zonedDateParts(date, timeZone) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
}

export function dateKey(date, timeZone) {
  const { year, month, day } = zonedDateParts(date, timeZone);
  return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
}

export function cleanPrayerTime(value) {
  return typeof value === 'string' && /^\d{2}:\d{2}/.test(value) ? value.slice(0, 5) : '';
}

// Convert the selected city's wall clock to an instant, including its DST offset.
export function prayerInstant(date, time, timeZone) {
  const clock = cleanPrayerTime(time);
  if (!clock || !timeZone) return NaN;
  const [day, month, year] = date.split('-').map(Number);
  const [hour, minute] = clock.split(':').map(Number);
  const target = Date.UTC(year, month - 1, day, hour, minute);
  let instant = target;
  for (let i = 0; i < 4; i++) {
    const p = zonedDateParts(new Date(instant), timeZone);
    const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - instant;
    const adjusted = target - offset;
    if (adjusted === instant) break;
    instant = adjusted;
  }
  return instant;
}

export function prayerEvents(days, timeZone) {
  return days.flatMap(day => PRAYERS.map(name => ({
    name, date: day.date.gregorian.date, time: cleanPrayerTime(day.timings[name]),
    at: prayerInstant(day.date.gregorian.date, day.timings[name], timeZone),
  }))).filter(event => Number.isFinite(event.at)).sort((a, b) => a.at - b.at);
}

export function nextPrayerEvent(events, now, name) {
  return events.find(event => event.at > now && (!name || event.name === name)) || null;
}

export function countdown(at, now) {
  if (!Number.isFinite(at)) return '';
  const seconds = Math.max(0, Math.floor((at - now) / 1000));
  const hours = Math.floor(seconds / 3600);
  return `${hours ? `${hours}h ` : ''}${Math.floor(seconds % 3600 / 60)}m ${seconds % 60}s`;
}

export function validCoordinates(lat, lng) {
  return lat !== null && lng !== null && lat !== '' && lng !== ''
    && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
    && Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180;
}

export async function fetchPrayerJson(url, signal) {
  const remote = new URL(url);
  const local = `/api/prayer/proxy/${remote.pathname.replace(/^\/v1\//, '')}${remote.search}`;
  let lastError;
  for (const endpoint of [local, url]) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timer = setTimeout(abort, 8000);
    try {
      const response = await fetch(endpoint, { signal: controller.signal });
      if (!response.ok) throw new Error('Prayer service unavailable. Please retry.');
      const json = await response.json();
      if (json.code !== 200 || !json.data) throw new Error('No prayer times found for this location.');
      return json.data;
    } catch (error) {
      lastError = error;
      if (signal?.aborted) break;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    }
  }
  throw lastError || new Error('Prayer service unavailable. Please retry.');
}

export async function loadPrayerSchedule(location, preferences, signal, now = new Date()) {
  const params = new URLSearchParams();
  if (location.type === 'custom') {
    params.set('city', location.city);
    params.set('country', location.country);
  } else {
    if (!validCoordinates(location.lat, location.lng)) throw new Error('Choose a valid location.');
    params.set('latitude', location.lat);
    params.set('longitude', location.lng);
  }
  // Omitting method allows AlAdhan to choose the closest regional authority.
  if (preferences.method !== 'auto') params.set('method', preferences.method);
  let school = preferences.school === 'auto'
    ? (['PK', 'IN', 'BD', 'AF'].includes(location.countryCode?.toUpperCase()) ? '1' : '0')
    : preferences.school;
  params.set('school', school);
  const suffix = location.type === 'custom' ? 'ByCity' : '';
  let requestedDate = dateKey(now, location.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  let today = await fetchPrayerJson(`https://api.aladhan.com/v1/timings${suffix}/${requestedDate}?${params}`, signal);
  const timezone = today.meta?.timezone;
  if (!timezone) throw new Error('The prayer service did not provide a timezone.');
  const localDate = dateKey(now, timezone);
  // Manual country names and a failed reverse lookup may not supply an ISO code.
  const regionalSchool = ['Asia/Karachi', 'Asia/Kolkata', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Kabul'].includes(timezone) ? '1' : '0';
  const correctSchool = preferences.school === 'auto' && !location.countryCode && school !== regionalSchool;
  if (correctSchool) {
    school = regionalSchool;
    params.set('school', school);
  }
  if (requestedDate !== localDate || correctSchool) {
    today = await fetchPrayerJson(`https://api.aladhan.com/v1/timings${suffix}/${localDate}?${params}`, signal);
  }
  if (today.date?.gregorian?.date !== localDate) throw new Error('Prayer service returned an outdated date. Please retry.');
  const { year, month, day } = zonedDateParts(now, timezone);
  const days = await fetchPrayerJson(`https://api.aladhan.com/v1/calendar${suffix}/${year}/${month}?${params}`, signal);
  if (!Array.isArray(days)) throw new Error('Prayer calendar unavailable. Please retry.');
  let upcomingDays = days;
  if (day === new Date(Date.UTC(year, month, 0)).getUTCDate()) {
    const tomorrow = new Date(Date.UTC(year, month - 1, day + 1));
    const nextDate = `${String(tomorrow.getUTCDate()).padStart(2, '0')}-${String(tomorrow.getUTCMonth() + 1).padStart(2, '0')}-${tomorrow.getUTCFullYear()}`;
    const nextDay = await fetchPrayerJson(`https://api.aladhan.com/v1/timings${suffix}/${nextDate}?${params}`, signal);
    upcomingDays = [...days, nextDay];
  }
  return { today, days, timezone, events: prayerEvents(upcomingDays, timezone), school };
}
