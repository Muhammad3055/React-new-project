import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function QuranicMapsView() {
  const { lang, t } = useLanguage();
  const [activeSite, setActiveSite] = useState(null);

  const SITES = [
    {
      id: 'makkah',
      name: 'Makkah (مكة المكرمة)',
      top: '55%', left: '35%',
      desc: 'The holiest city in Islam. The birthplace of Prophet Muhammad (PBUH) and the site of the first revelation.',
      ayah: 'إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِي بِبَكَّةَ مُبَارَكًا وَهُدًى لِّلْعَالَمِينَ',
      translation: '"Indeed, the first House [of worship] established for mankind was that at Makkah - blessed and a guidance for the worlds." (Quran 3:96)'
    },
    {
      id: 'madinah',
      name: 'Madinah (المدينة المنورة)',
      top: '40%', left: '32%',
      desc: 'The city of the Prophet (PBUH) where he migrated (Hijrah) and established the first Islamic society.',
      ayah: 'وَالَّذِينَ تَبَوَّءُوا الدَّارَ وَالْإِيمَانَ مِن قَبْلِهِمْ يُحِبُّونَ مَنْ هَاجَرَ إِلَيْهِمْ',
      translation: '"And [also for] those who were settled in al-Madinah and [adopted] the faith before them. They love those who emigrated to them..." (Quran 59:9)'
    },
    {
      id: 'badr',
      name: 'Badr (بدر)',
      top: '43%', left: '28%',
      desc: 'The site of the first major battle in Islamic history (Battle of Badr), where the outnumbered Muslims were victorious by the grace of Allah.',
      ayah: 'وَلَقَدْ نَصَرَكُمُ اللَّهُ بِبَدْرٍ وَأَنتُمْ أَذِلَّةٌ ۖ فَاتَّقُوا اللَّهَ لَعَلَّكُمْ تَشْكُرُونَ',
      translation: '"And already had Allah given you victory at [the battle of] Badr while you were few in number. Then fear Allah; perhaps you will be grateful." (Quran 3:123)'
    },
    {
      id: 'uhud',
      name: 'Mount Uhud (جبل أحد)',
      top: '38%', left: '34%',
      desc: 'The site of the second major battle. The Prophet (PBUH) said, "Uhud is a mountain which loves us and which we love."',
      ayah: 'إِذْ تُصْعِدُونَ وَلَا تَلْوُونَ عَلَىٰ أَحَدٍ وَالرَّسُولُ يَدْعُوكُمْ فِي أُخْرَاكُمْ',
      translation: '"[Remember] when you [fled and] climbed [the mountain] without looking back at anyone while the Messenger was calling you from behind..." (Quran 3:153)'
    },
    {
      id: 'sinai',
      name: 'Mount Sinai (طور سيناء)',
      top: '25%', left: '15%',
      desc: 'The holy mountain where Allah (SWT) spoke directly to Prophet Musa (Moses) and revealed the Torah.',
      ayah: 'وَطُورِ سِينِينَ',
      translation: '"And [by] Mount Sinai." (Quran 95:2)'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', direction: lang === 'ur' || lang === 'ar' || lang === 'br' ? 'rtl' : 'ltr' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24', fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
          <i className="fas fa-map-marked-alt"></i> Interactive Quranic Map
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.1rem' }}>
          Explore the historical locations mentioned in the Holy Quran and Seerah.
        </p>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '70vh', minHeight: '500px', background: '#e2e8f0', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '2px solid #fbbf24' }}>
        
        {/* Placeholder Map Background (Could be an actual map image) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'url("https://www.transparenttextures.com/patterns/arabesque.png") #0f172a',
          backgroundSize: 'cover', opacity: 0.9
        }}>
          {/* Abstract landmass representation */}
          <div style={{ position: 'absolute', top: '10%', right: '10%', bottom: '10%', left: '25%', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', filter: 'blur(40px)' }}></div>
        </div>

        {/* Map Markers */}
        {SITES.map((site) => (
          <div key={site.id} style={{
            position: 'absolute', top: site.top, left: site.left,
            transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: activeSite?.id === site.id ? 10 : 1
          }} onClick={() => setActiveSite(site)}>
            <div style={{
              width: '30px', height: '30px', background: activeSite?.id === site.id ? '#ef4444' : '#f59e0b',
              borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', margin: '0 auto',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)', transition: 'all 0.3s',
              border: '2px solid #fff'
            }}></div>
            <div style={{ 
              color: '#fff', fontSize: '0.85rem', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,1)', 
              marginTop: '5px', whiteSpace: 'nowrap', textAlign: 'center'
            }}>
              {site.name.split(' (')[0]}
            </div>
            {/* Ripple effect */}
            <div style={{
              position: 'absolute', top: '5px', left: '15px', width: '30px', height: '30px',
              background: 'transparent', border: '2px solid rgba(245, 158, 11, 0.5)', borderRadius: '50%',
              transform: 'translate(-50%, -50%)', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
            }}></div>
          </div>
        ))}

        {/* Info Card Pop-over */}
        {activeSite && (
          <div style={{
            position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            width: '90%', maxWidth: '600px', background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.5)',
            borderRadius: '16px', padding: '1.5rem', color: '#f8fafc', boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            animation: 'slideUp 0.3s ease-out', zIndex: 100
          }}>
            <button onClick={() => setActiveSite(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
              <i className="fas fa-times"></i>
            </button>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24', fontSize: '1.5rem' }}>{activeSite.name}</h2>
            <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>{activeSite.desc}</p>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#10b981', fontSize: '1.3rem', fontFamily: '"Amiri", "Uthmani", serif', textAlign: 'right', direction: 'rtl' }}>
                {activeSite.ayah}
              </p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
                {activeSite.translation}
              </p>
            </div>
          </div>
        )}

      </div>
      <style>
        {`
          @keyframes ping {
            75%, 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}
      </style>
    </div>
  );
}
