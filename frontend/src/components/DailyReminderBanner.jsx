import React, { useState, useEffect } from 'react';

export default function DailyReminderBanner({ timings, navigateToTab }) {
  const [activeReminders, setActiveReminders] = useState([]);

  useEffect(() => {
    if (!timings) return;

    const checkReminders = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, 5 = Friday
      const active = [];

      const parseTime = (timeStr) => {
        if (!timeStr) return null;
        // timeStr usually looks like "05:30 (PKT)" or "05:30"
        const cleanTime = timeStr.split(' ')[0];
        const [hours, minutes] = cleanTime.split(':').map(Number);
        const d = new Date(now);
        d.setHours(hours, minutes, 0, 0);
        return d;
      };

      const fajr = parseTime(timings.Fajr);
      const dhuhr = parseTime(timings.Dhuhr);
      const asr = parseTime(timings.Asr);
      const maghrib = parseTime(timings.Maghrib);
      const isha = parseTime(timings.Isha);

      // 1. Ishraq / Fajr Reminder (Fajr + 40 mins to Fajr + 100 mins)
      if (fajr) {
        const ishraqStart = new Date(fajr.getTime() + 40 * 60000);
        const ishraqEnd = new Date(fajr.getTime() + 100 * 60000);
        if (now >= ishraqStart && now <= ishraqEnd) {
          active.push({
            id: 'ishraq',
            type: 'prayer',
            title: '☀️ Ishraq Prayer Reminder',
            message: 'It is time for Ishraq prayer (2 Rakaat). Recite its Azkar and earn the reward of a complete Hajj and Umrah!',
            linkTab: 'azkar'
          });
        }
      }

      // 2. Post-Prayer Azkar (Zuhr, Isha) - 20 mins to 65 mins after
      [
        { name: 'Dhuhr', time: dhuhr },
        { name: 'Isha', time: isha }
      ].forEach(prayer => {
        if (prayer.time) {
          const azkarStart = new Date(prayer.time.getTime() + 20 * 60000);
          const azkarEnd = new Date(prayer.time.getTime() + 65 * 60000);
          if (now >= azkarStart && now <= azkarEnd) {
            active.push({
              id: `azkar_${prayer.name}`,
              type: 'prayer',
              title: `🤲 Post-${prayer.name} Azkar`,
              message: `Don't forget to recite your daily Azkar after ${prayer.name} prayer.`,
              linkTab: 'azkar'
            });
          }
        }
      });

      // 3. Post-Prayer Azkar (Maghrib) - 15 mins to 45 mins after
      if (maghrib) {
        const maghribAzkarStart = new Date(maghrib.getTime() + 15 * 60000);
        const maghribAzkarEnd = new Date(maghrib.getTime() + 45 * 60000);
        if (now >= maghribAzkarStart && now <= maghribAzkarEnd) {
          active.push({
            id: 'azkar_maghrib',
            type: 'prayer',
            title: '🤲 Post-Maghrib Azkar',
            message: 'Don\'t forget to recite your daily Azkar after Maghrib prayer.',
            linkTab: 'azkar'
          });
        }
      }

      // 4. Post-Prayer Azkar (Asr) - 60 mins to 105 mins after
      if (asr) {
        const asrAzkarStart = new Date(asr.getTime() + 60 * 60000);
        const asrAzkarEnd = new Date(asr.getTime() + 105 * 60000);
        if (now >= asrAzkarStart && now <= asrAzkarEnd) {
          active.push({
            id: 'azkar_asr',
            type: 'prayer',
            title: '🤲 Post-Asr Azkar',
            message: 'Don\'t forget to recite your daily Azkar after Asr prayer.',
            linkTab: 'azkar'
          });
        }
      }

      // 5. Asr to Maghrib Dua - 30 mins after Asr until Maghrib
      if (asr && maghrib) {
        const asrDuaStart = new Date(asr.getTime() + 30 * 60000);
        if (now >= asrDuaStart && now < maghrib) {
          active.push({
            id: 'dua_asr_maghrib',
            type: 'dua',
            title: '🌅 Golden Hour (Asr to Maghrib)',
            message: 'This is a blessed time before Maghrib. Read the recommended Duas.',
            linkTab: 'azkar'
          });
        }
      }

      // 6. Surah Kahf (Friday before 2:30 PM)
      if (currentDay === 5) {
        const limitTime = new Date(now);
        limitTime.setHours(14, 30, 0, 0); // 2:30 PM
        if (now < limitTime) {
          active.push({
            id: 'surah_kahf',
            type: 'quran',
            title: '📖 Friday Reminder: Surah Al-Kahf',
            message: 'Don\'t forget to read Surah Al-Kahf before Jumu\'ah prayer for light that shines between the two Fridays.',
            linkTab: 'azkar'
          });
        }
      }

      setActiveReminders(active);
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [timings]);

  if (activeReminders.length === 0) return null;

  return (
    <div style={{ padding: '0 1rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activeReminders.map(reminder => (
          <div key={reminder.id} style={{
            background: 'linear-gradient(90deg, #ecfdf5 0%, #ffffff 100%)',
            border: '1.5px solid #059669',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 15px rgba(5,150,105,0.1)',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.35rem', color: '#065f46', fontSize: '1.05rem', fontWeight: 800 }}>{reminder.title}</h4>
              <p style={{ margin: 0, color: '#047857', fontSize: '0.9rem', fontWeight: 500 }}>{reminder.message}</p>
            </div>
            <button 
               onClick={() => { if(navigateToTab) navigateToTab(reminder.linkTab) }}
               style={{
                 background: '#059669', color: '#fff', border: 'none', padding: '8px 16px',
                 borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap'
               }}
            >
              Read Now <i className="fas fa-arrow-right" style={{ marginLeft: '6px' }}></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
