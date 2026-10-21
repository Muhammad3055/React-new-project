import test from 'node:test';
import assert from 'node:assert/strict';
import { dateKey, prayerInstant, prayerEvents, nextPrayerEvent, validCoordinates, loadPrayerSchedule } from '../src/utils/prayerTimes.js';

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
