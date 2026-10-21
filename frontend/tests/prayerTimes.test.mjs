import test from 'node:test';
import assert from 'node:assert/strict';
import { dateKey, prayerInstant, prayerEvents, nextPrayerEvent, validCoordinates, loadPrayerSchedule, fetchPrayerJson } from '../src/utils/prayerTimes.js';
import { normaliseNetworkLocation, detectNetworkLocation } from '../src/utils/prayerLocation.js';

test('selected city determines date across midnight', () => {
  const now = new Date('2026-10-20T20:30:00Z');
  assert.equal(dateKey(now, 'Asia/Karachi'), '21-10-2026');
  assert.equal(dateKey(now, 'America/New_York'), '20-10-2026');
});
test('wall-clock conversion handles Karachi and seasonal DST', () => {
  assert.equal(new Date(prayerInstant('21-10-2026', '05:30 (PKT)', 'Asia/Karachi')).toISOString(), '2026-10-21T00:30:00.000Z');
  assert.equal(new Date(prayerInstant('01-07-2026', '05:30', 'Europe/London')).toISOString(), '2026-07-01T04:30:00.000Z');
  assert.equal(new Date(prayerInstant('01-12-2026', '05:30', 'Europe/London')).toISOString(), '2026-12-01T05:30:00.000Z');
});
test('next prayer rolls into tomorrow after Isha', () => {
  const days = ['31-12-2026', '01-01-2027'].map(date => ({date: {gregorian: {date}}, timings: {Fajr:'05:30', Dhuhr:'12:30', Asr:'16:00', Maghrib:'18:00', Isha:'19:30'}}));
  const event = nextPrayerEvent(prayerEvents(days, 'Asia/Karachi'), Date.parse('2026-12-31T18:00:00Z'));
  assert.equal(event.name, 'Fajr');
  assert.equal(event.date, '01-01-2027');
});
test('coordinate validation rejects missing and out of range values', () => {
  assert.equal(validCoordinates(0, 0), true);
  for (const pair of [[null, 20], ['', 20], [91, 0], [0, 181], ['abc', 20]]) assert.equal(validCoordinates(...pair), false);
});
test('manual city refetches using city date and regional Asr school', async () => {
  const original = globalThis.fetch;
  const urls = [];
  const day = {date: {gregorian: {date:'21-10-2026'}}, timings: {Fajr:'05:30'}, meta: {timezone:'Asia/Karachi'}};
  globalThis.fetch = async url => { urls.push(url); return {ok:true, json:async () => ({code:200, data:url.includes('/calendar') ? [day] : day})}; };
  try {
    const result = await loadPrayerSchedule({type:'custom', city:'Karachi', country:'Pakistan', timezone:'UTC'}, {method:'auto',school:'auto'}, undefined, new Date('2026-10-20T20:30:00Z'));
    assert.equal(result.timezone, 'Asia/Karachi');
    assert.equal(result.school, '1');
    assert.match(urls[1], /21-10-2026/);
    assert.match(urls[1], /school=1/);
  } finally { globalThis.fetch = original; }
});

test('automatic location accepts city, country, coordinates and timezone', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async url => url === '/api/prayer/location/'
    ? { ok: true, json: async () => ({city:'Lahore', country:'Pakistan', countryCode:'PK', lat:31.52, lng:74.35, timezone:'Asia/Karachi'}) }
    : { ok: false, json: async () => ({}) };
  try {
    assert.equal((await detectNetworkLocation()).label, 'Lahore, Pakistan');
    assert.equal(normaliseNetworkLocation({city:'Lahore', country:'Pakistan', latitude:null, longitude:74, timezone:'Asia/Karachi'}), null);
  } finally { globalThis.fetch = original; }
});

test('prayer times fall back to AlAdhan when the same-origin proxy fails', async () => {
  const original = globalThis.fetch;
  const urls = [];
  globalThis.fetch = async url => {
    urls.push(url);
    return url.startsWith('/api/')
      ? {ok:false}
      : {ok:true, json:async () => ({code:200, data:{timings:{Fajr:'05:00'}}})};
  };
  try {
    const day = await fetchPrayerJson('https://api.aladhan.com/v1/timings/21-10-2026?latitude=24.86&longitude=67.01');
    assert.equal(day.timings.Fajr, '05:00');
    assert.match(urls[0], /^\/api\/prayer\/proxy\/timings\/21-10-2026/);
    assert.match(urls[1], /^https:\/\/api\.aladhan\.com/);
  } finally { globalThis.fetch = original; }
});
