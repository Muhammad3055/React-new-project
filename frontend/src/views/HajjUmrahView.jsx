import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Volume2, CheckSquare, Sparkles, MapPin, Check, Plus, Minus, RotateCcw } from 'lucide-react';

export default function HajjUmrahView() {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState('umrah'); // 'umrah' or 'hajj'
  const [activeStep, setActiveStep] = useState(0);

  // Digital Tawaf & Sa'i Counters
  const [tawafCount, setTawafCount] = useState(0);
  const [saiCount, setSaiCount] = useState(0);

  // Checklists State
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Cleanliness & Ghusl before Ihram', done: false },
    { id: 2, text: 'Wear 2 unstitched white sheets (Ihram for Men) / Modest attire (Women)', done: false },
    { id: 3, text: 'Perform 2 Rakat Nafil Prayer at Miqat', done: false },
    { id: 4, text: 'Recite Talbiyah (Labbayk Allahumma Labbayk...)', done: false },
    { id: 5, text: 'Tawaf (7 rounds counter-clockwise around Kaaba)', done: false },
    { id: 6, text: 'Pray 2 Rakat behind Maqam Ibrahim', done: false },
    { id: 7, text: 'Drink Zamzam Water & Make Supplication', done: false },
    { id: 8, text: 'Sa\'i (7 laps between Safa and Marwah)', done: false },
    { id: 9, text: 'Halq (Shaving head for men) or Taqseer (Cutting hair tips for women)', done: false }
  ]);

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const umrahSteps = [
    {
      title: '1. Ihram & Niyyah (at Miqat)',
      location: 'Miqat Boundary',
      arabic: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً',
      transliteration: 'Labbayka Allahumma \'Umratan',
      meaning: 'Here I am O Allah, making the intention for Umrah.',
      desc: 'Perform Ghusl, put on the Ihram garments, offer 2 Rakat Nafil, and make your intention at the designated Miqat boundary.'
    },
    {
      title: '2. Talbiyah Recitation',
      location: 'En route to Makkah',
      arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لاَ شَرِيكَ لَكَ',
      transliteration: 'Labbayk Allahumma Labbayk, Labbayka Laa Shareeka Laka Labbayk, Innal-Hamda Wan-Ni\'mata Laka Wal-Mulka Laa Shareeka Lak.',
      meaning: 'Here I am O Allah, here I am. Here I am, You have no partner, here I am. Truly all praise, grace, and sovereignty belong to You. You have no partner.',
      desc: 'Recite the Talbiyah frequently with devotion on the journey to Al-Masjid Al-Haram until starting Tawaf.'
    },
    {
      title: '3. Tawaf Al-Qudum (7 Circuits around Kaaba)',
      location: 'Al-Masjid Al-Haram (Mataf)',
      arabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ',
      transliteration: 'Bismillahi Allahu Akbar',
      meaning: 'In the name of Allah, Allah is the Greatest.',
      desc: 'Begin at the Black Stone (Hajar al-Aswad). Perform 7 counter-clockwise rounds around the Holy Kaaba. Men uncover the right shoulder (Idtiba) during Tawaf.'
    },
    {
      title: '4. Maqam Ibrahim & Zamzam',
      location: 'Behind Maqam Ibrahim',
      arabic: 'وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى',
      transliteration: 'Wattakhithoo min maqaami Ibraaheema musalla',
      meaning: 'And take, [O believers], from the standing place of Abraham a place of prayer.',
      desc: 'Pray 2 Rakat behind Maqam Ibrahim (or anywhere in the Mosque), then drink holy Zamzam water and supplicate.'
    },
    {
      title: '5. Sa\'i (7 Laps between Safa & Marwah)',
      location: 'Safa and Marwah Hills',
      arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ',
      transliteration: 'Innas-Safa wal-Marwata min sha\'a\'irillah',
      meaning: 'Indeed, Safa and Marwah are among the symbols of Allah.',
      desc: 'Start at Safa hill, walk to Marwah (1 lap), return to Safa (2 laps), completing 7 total laps ending at Marwah.'
    },
    {
      title: '6. Halq or Taqseer (Shaving / Trimming Hair)',
      location: 'Makkah Barbers / Hotel',
      arabic: 'اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ وَالْمُقَصِّرِينَ',
      transliteration: 'Allahumma-ghfir lil-muhalliqeena wal-muqassireen',
      meaning: 'O Allah, forgive those who shave their heads and those who trim.',
      desc: 'Men shave their head completely (Halq) or cut hair evenly (Taqseer). Women trim a fingertip length of hair. Umrah is now complete!'
    }
  ];

  const hajjSteps = [
    { title: 'Day 1 (8th Dhul Hijjah) - Tarwiyah in Mina', location: 'Mina Tents', desc: 'Enter Ihram for Hajj, travel to Mina, and perform Dhuhr, Asr, Maghrib, Isha, and Fajr prayers.' },
    { title: 'Day 2 (9th Dhul Hijjah) - Day of Arafat', location: 'Mount Arafat', desc: 'Travel to Arafat. Spend the afternoon in Wuqoof (dua & repentance) until sunset. This is the core pillar of Hajj.' },
    { title: 'Night 2 - Night at Muzdalifah', location: 'Muzdalifah', desc: 'Travel to Muzdalifah after sunset. Combine Maghrib and Isha prayers, sleep under open sky, and gather pebbles for Jamarat.' },
    { title: 'Day 3 (10th Dhul Hijjah) - Yawm al-Nahr', location: 'Jamarat & Mina', desc: 'Stone Jamarat al-Aqaba (7 pebbles), perform Qurbani (sacrificial animal), shave/cut hair, perform Tawaf al-Ifadah.' },
    { title: 'Days 4 & 5 (11th-13th Dhul Hijjah) - Tashreeq', location: 'Mina & Jamarat', desc: 'Stay in Mina, stone all 3 Jamarat pillars daily (Small, Medium, Big), perform Tawaf al-Wada (Farewell Tawaf) before leaving.' }
  ];

  const stepsList = activeMode === 'umrah' ? umrahSteps : hajjSteps;

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Compass size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Interactive Pilgrim Guide
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Hajj &amp; Umrah Step-by-Step Guide
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Master the sacred rites of Umrah and Hajj with interactive step-by-step guidance, authentic duas, Tawaf counters, and preparation checklists.
          </p>
        </div>

        {/* ── Mode Selector: Umrah vs Hajj ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <button
            onClick={() => { setActiveMode('umrah'); setActiveStep(0); }}
            style={{
              padding: '12px 28px', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer',
              background: activeMode === 'umrah' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#ffffff',
              color: activeMode === 'umrah' ? '#ffffff' : '#475569',
              border: activeMode === 'umrah' ? 'none' : '1px solid #cbd5e1',
              boxShadow: activeMode === 'umrah' ? '0 8px 20px rgba(5,150,105,0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            🌙 Umrah Guide (عُمرة)
          </button>
          <button
            onClick={() => { setActiveMode('hajj'); setActiveStep(0); }}
            style={{
              padding: '12px 28px', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer',
              background: activeMode === 'hajj' ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : '#ffffff',
              color: activeMode === 'hajj' ? '#ffffff' : '#475569',
              border: activeMode === 'hajj' ? 'none' : '1px solid #cbd5e1',
              boxShadow: activeMode === 'hajj' ? '0 8px 20px rgba(217,119,6,0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            🕋 Hajj Guide (حَجّ)
          </button>
        </div>

        {/* ── Counters Section: Tawaf & Sa'i Counter Widgets ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem'
        }}>
          {/* Tawaf Counter */}
          <div style={{ background: '#022c22', borderRadius: '20px', padding: '1.5rem', color: '#ffffff', border: '1px solid #f59e0b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tawaf Circuit Counter</span>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ffffff', margin: '0.5rem 0' }}>{tawafCount} / 7</div>
            <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#a7f3d0' }}>Counter-clockwise rounds around Kaaba</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setTawafCount(Math.min(7, tawafCount + 1))} style={btnCounterStyle}><Plus size={16}/> Count Round</button>
              <button onClick={() => setTawafCount(0)} style={{ ...btnCounterStyle, background: 'rgba(255,255,255,0.1)' }}><RotateCcw size={14}/></button>
            </div>
          </div>

          {/* Sa'i Counter */}
          <div style={{ background: '#1e1b4b', borderRadius: '20px', padding: '1.5rem', color: '#ffffff', border: '1px solid #f59e0b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sa'i Lap Counter</span>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ffffff', margin: '0.5rem 0' }}>{saiCount} / 7</div>
            <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#cbd5e1' }}>Laps between Safa &amp; Marwah</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setSaiCount(Math.min(7, saiCount + 1))} style={{ ...btnCounterStyle, background: '#d97706' }}><Plus size={16}/> Count Lap</button>
              <button onClick={() => setSaiCount(0)} style={{ ...btnCounterStyle, background: 'rgba(255,255,255,0.1)' }}><RotateCcw size={14}/></button>
            </div>
          </div>
        </div>

        {/* ── Main Step-by-Step Walkthrough Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

          {/* Left Column: Interactive Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stepsList.map((step, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  background: activeStep === idx ? '#0f172a' : '#ffffff',
                  color: activeStep === idx ? '#ffffff' : '#1e293b',
                  borderRadius: '18px', padding: '1.25rem 1.5rem',
                  border: activeStep === idx ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                  boxShadow: activeStep === idx ? '0 8px 25px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.02)',
                  cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: activeStep === idx ? '#fcd34d' : '#059669', marginBottom: '2px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> {step.location}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{step.title}</h3>
                </div>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: activeStep === idx ? '#f59e0b' : '#f1f5f9',
                  color: activeStep === idx ? '#ffffff' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem'
                }}>
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Step Detail Card with Dua */}
          <div>
            <div style={{
              position: 'sticky', top: '100px', background: '#ffffff', borderRadius: '24px',
              padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Stage {activeStep + 1} of {stepsList.length}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 1rem' }}>
                {stepsList[activeStep].title}
              </h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {stepsList[activeStep].desc}
              </p>

              {/* Arabic Dua Box (if available for stage) */}
              {stepsList[activeStep].arabic && (
                <div style={{
                  background: '#f8fafc', borderRadius: '18px', padding: '1.5rem',
                  border: '1px solid #cbd5e1', marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <Volume2 size={16} /> Authentic Dua for this Stage
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Amiri, serif', color: '#022c22', textAlign: 'right', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                    {stepsList[activeStep].arabic}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#d97706', marginBottom: '0.5rem' }}>
                    {stepsList[activeStep].transliteration}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{stepsList[activeStep].meaning}"
                  </div>
                </div>
              )}

              {/* Checklist Widget */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.9rem', fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>
                  Pilgrim Readiness Checklist
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {checklist.slice(0, 5).map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '8px 12px',
                        borderRadius: '10px', background: item.done ? '#f0fdf4' : '#f8fafc',
                        cursor: 'pointer', border: item.done ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '6px',
                        background: item.done ? '#10b981' : '#ffffff',
                        border: item.done ? 'none' : '2px solid #cbd5e1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                      }}>
                        {item.done && <Check size={14} />}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: item.done ? '#166534' : '#334155', textDecoration: item.done ? 'line-through' : 'none', fontWeight: 600 }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const btnCounterStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '8px 14px',
  borderRadius: '12px', background: '#059669', color: '#ffffff', border: 'none',
  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
};
