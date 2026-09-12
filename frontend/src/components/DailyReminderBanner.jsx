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
            arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
            translation: 'O Ever-Living One, O Sustainer of all that exists, by Your mercy I seek assistance. Rectify all my affairs and do not entrust me to myself for even the blink of an eye.',
            urdu: 'اے ہمیشہ زندہ رہنے والے، اے سب کو قائم رکھنے والے! میں تیری رحمت کے وسیلے سے فریاد کرتا ہوں، میرے تمام کام درست فرما دے اور مجھے پلک جھپکنے کے برابر بھی میرے نفس کے حوالے نہ کر۔',
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

  // Fallback dua to ensure something is completely visible on the home page when no specific time-based reminder is active
  const displayReminders = activeReminders.length > 0 ? activeReminders : [{
    id: 'default_dua',
    type: 'dua',
    title: '🤲 Daily Supplication',
    message: 'Keep your tongue moist with the remembrance of Allah.',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    translation: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
    urdu: 'اے اللہ! تو ہی سلامتی والا ہے اور تیری ہی طرف سے سلامتی ہے، تو بہت برکت والا ہے اے جلال اور بزرگی والے۔',
    linkTab: 'azkar'
  }];

  return (
    <div style={{ padding: '0 1rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayReminders.map(reminder => (
          <div key={reminder.id} style={{
            background: 'linear-gradient(90deg, #ecfdf5 0%, #ffffff 100%)',
            border: '1.5px solid #059669',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            boxShadow: '0 4px 15px rgba(5,150,105,0.1)',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h4 style={{ margin: '0 0 0.5rem', color: '#065f46', fontSize: '1.2rem', fontWeight: 800 }}>{reminder.title}</h4>
              <p style={{ margin: '0 0 1rem', color: '#047857', fontSize: '0.95rem', fontWeight: 500 }}>{reminder.message}</p>
              
              {reminder.arabic && (
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Amiri, serif', color: '#0f172a', textAlign: 'right', lineHeight: 1.6 }}>
                    {reminder.arabic}
                  </p>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                    <strong>Meaning:</strong> {reminder.translation}
                  </p>
                  <p style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b', fontFamily: 'Amiri, serif', textAlign: 'right' }}>
                    {reminder.urdu}
                  </p>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <button 
                 onClick={() => { if(navigateToTab) navigateToTab(reminder.linkTab) }}
                 style={{
                   background: '#059669', color: '#fff', border: 'none', padding: '10px 20px',
                   borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap',
                   boxShadow: '0 4px 12px rgba(5,150,105,0.2)', transition: 'all 0.3s ease'
                 }}
                 onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                 onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                View All Azkar <i className="fas fa-arrow-right" style={{ marginLeft: '6px' }}></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
