import React, { useState } from 'react';

const SEERAH_EVENTS = [
  {
    id: 1,
    year: '570 CE',
    title: 'Birth of Prophet Muhammad (PBUH)',
    category: 'prophet_meccan',
    era: 'Meccan Era',
    location: 'Makkah Al-Mukarramah',
    summary: 'Prophet Muhammad (PBUH) was born in Makkah in the Year of the Elephant (Aam al-Fil). His father Abdullah passed away before his birth, and his mother Aminah passed away when he was 6 years old.',
    quranRef: 'Surah Al-Duha [93:6]',
    details: 'Reared by his grandfather Abdul Muttalib and later his noble uncle Abu Talib, young Muhammad (PBUH) became renowned throughout Arabia for his perfect honesty, earning the titles Al-Amin (The Trustworthy) and Al-Sadiq (The Truthful).'
  },
  {
    id: 2,
    year: '610 CE',
    title: 'First Divine Revelation in Cave Hira',
    category: 'prophet_meccan',
    era: 'Meccan Era',
    location: 'Mount An-Nour (Cave Hira), Makkah',
    summary: 'Angel Jibreel (Gabriel) appeared to Prophet Muhammad (PBUH) in Cave Hira during the month of Ramadan with the first verses of Surah Al-Alaq.',
    quranRef: 'Surah Al-Alaq [96:1-5]',
    details: '"Read in the name of your Lord who created..." This marked the commencement of final divine prophethood unto humanity at age 40.'
  },
  {
    id: 3,
    year: '620 CE',
    title: 'Isra and Mi\'raj (Night Journey & Ascension)',
    category: 'prophet_meccan',
    era: 'Meccan Era',
    location: 'Makkah to Jerusalem (Al-Aqsa) to Heavens',
    summary: 'Prophet Muhammad (PBUH) was transported miraculously overnight from Al-Masjid Al-Haram in Makkah to Al-Masjid Al-Aqsa in Jerusalem, and ascended through the seven heavens.',
    quranRef: 'Surah Al-Isra [17:1]',
    details: 'During this miraculous ascension, Almighty Allah gifted Muslims the obligation of the 5 Daily Prayers (Salah).'
  },
  {
    id: 4,
    year: '622 CE',
    title: 'The Great Hijrah to Madinah Al-Munawwarah',
    category: 'prophet_medinan',
    era: 'Medinan Era',
    location: 'Makkah to Yathrib (Madinah)',
    summary: 'Following severe persecution in Makkah, Prophet Muhammad (PBUH) and Abu Bakr Al-Siddiq (RA) migrated to Madinah, establishing the first Islamic state.',
    quranRef: 'Surah Al-Tawbah [9:40]',
    details: 'This historic migration marks Year 1 of the Islamic Hijri Calendar (AH) under Umar ibn al-Khattab (RA).'
  },
  {
    id: 5,
    year: '624 CE (2 AH)',
    title: 'Battle of Badr (Ghazwa Badr)',
    category: 'prophet_medinan',
    era: 'Medinan Era',
    location: 'Badr (130 km Southwest of Madinah)',
    summary: '313 ill-equipped Muslim believers miraculously defeated a heavily armed Quraysh army of 1,000 soldiers with divine angelic support.',
    quranRef: 'Surah Aal-Imran [3:123]',
    details: 'Known as Yawm al-Furqan (The Day of Criterion), establishing Islam as a formidable spiritual and military power.'
  },
  {
    id: 6,
    year: '630 CE (8 AH)',
    title: 'Conquest of Makkah (Fath Makkah)',
    category: 'prophet_medinan',
    era: 'Medinan Era',
    location: 'Makkah Al-Mukarramah',
    summary: 'Prophet Muhammad (PBUH) entered Makkah peacefully with 10,000 companions, cleansed the Kaaba of 360 idols, and granted general amnesty to all former enemies.',
    quranRef: 'Surah An-Nasr [110:1-3]',
    details: 'Demonstrated unprecedented mercy in human history by proclaiming: "Go, for you are all free!"'
  },
  {
    id: 7,
    year: 'Ancient Era',
    title: 'Prophet Adam (AS) - First Man & Prophet',
    category: 'other_prophets',
    era: 'Prophets of Antiquity',
    location: 'Jannah to Earth',
    summary: 'Allah created Adam (AS) from clay, taught him all names, and appointed him as the first Vicegerent on Earth.',
    quranRef: 'Surah Al-Baqarah [2:30-34]',
    details: 'Prophet Adam (AS) taught mankind Tawheed, repentance, and obedience to Allah.'
  },
  {
    id: 8,
    year: 'Ancient Era',
    title: 'Prophet Nuh / Noah (AS) & The Great Ark',
    category: 'other_prophets',
    era: 'Prophets of Antiquity',
    location: 'Ancient Mesopotamia',
    summary: 'Prophet Nuh (AS) called his people to Allah for 950 years before building the Ark to save the believers from the Great Deluge.',
    quranRef: 'Surah Nuh [71:1-28]',
    details: 'Embodied immense patience and steadfastness in da\'wah against idolatry.'
  },
  {
    id: 9,
    year: 'Ancient Era',
    title: 'Prophet Ibrahim / Abraham (AS) - Patriarch of Prophets',
    category: 'other_prophets',
    era: 'Prophets of Antiquity',
    location: 'Ur (Iraq), Canaan, Makkah',
    summary: 'Rebuilt the Holy Kaaba with his son Ismail (AS) and established the rites of Hajj pilgrimage.',
    quranRef: 'Surah Al-Baqarah [2:127]',
    details: 'Known as Khalilullah (Friend of Allah) and father of Prophets Ismail and Ishaq AS.'
  },
  {
    id: 10,
    year: 'Ancient Era',
    title: 'Prophet Musa / Moses (AS) & Parting of the Red Sea',
    category: 'other_prophets',
    era: 'Prophets of Antiquity',
    location: 'Egypt & Mount Sinai',
    summary: 'Confronted Pharaoh (Fir\'awn), liberated Bani Isra\'il, and received the Torah (Tawrat).',
    quranRef: 'Surah Ta-Ha [20:9-98]',
    details: 'Prophet Musa (AS) is the most frequently mentioned Prophet in the Holy Quran (136 times).'
  }
];

export default function SeerahView() {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(1);

  const filteredEvents = SEERAH_EVENTS.filter((e) => {
    const matchesCat = category === 'all' || e.category === category;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 1rem', color: '#fff' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '20px', padding: '1.75rem',
        marginBottom: '2rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b', fontSize: '2rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
          📜 Seerah & Stories of the Prophets Timeline
        </h1>
        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem' }}>
          Explore key milestones in the life of Prophet Muhammad (PBUH) & noble Prophets of Islam.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b' }}></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, locations, or Quranic references..."
            style={{
              width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', background: '#09090b',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Milestones' },
            { id: 'prophet_meccan', label: 'Meccan Era (PBUH)' },
            { id: 'prophet_medinan', label: 'Medinan Era (PBUH)' },
            { id: 'other_prophets', label: 'Stories of Prophets (AS)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              style={{
                padding: '0.55rem 1.1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                background: category === tab.id ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                color: category === tab.id ? '#000' : '#cbd5e1', border: 'none', cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Vertical Timeline */}
      <div style={{ position: 'relative', borderLeft: '3px solid rgba(245, 158, 11, 0.4)', paddingLeft: '1.5rem', marginLeft: '0.75rem' }}>
        {filteredEvents.map((event) => {
          const isExpanded = expandedId === event.id;

          return (
            <div key={event.id} style={{ marginBottom: '1.75rem', position: 'relative' }}>
              {/* Timeline Pin Dot */}
              <div style={{
                position: 'absolute', left: '-2.15rem', top: '0.2rem', width: '16px', height: '16px',
                borderRadius: '50%', background: isExpanded ? '#f59e0b' : '#022c22', border: '3px solid #f59e0b',
                boxShadow: isExpanded ? '0 0 10px #f59e0b' : 'none'
              }}></div>

              {/* Event Card */}
              <div style={{
                background: '#09090b', border: isExpanded ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                transition: 'all 0.25s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '700' }}>
                    {event.year} • {event.era}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#ef4444' }}></i> {event.location}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.2rem', fontWeight: '700' }}>
                  {event.title}
                </h3>

                <p style={{ margin: '0 0 0.75rem 0', color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.5' }}>
                  {event.summary}
                </p>

                {isExpanded && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.15)', color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 0.75rem 0' }}>{event.details}</p>
                    <div style={{ background: 'rgba(6, 78, 59, 0.4)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '0.6rem 1rem', color: '#6ee7b7', fontSize: '0.85rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <i className="fas fa-book-quran"></i> Reference: {event.quranRef}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  style={{
                    background: 'none', border: 'none', color: '#f59e0b', fontWeight: '600', fontSize: '0.85rem',
                    cursor: 'pointer', padding: '0.4rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem'
                  }}
                >
                  {isExpanded ? 'Show Less ▲' : 'Read Detailed Historical Account ▼'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
