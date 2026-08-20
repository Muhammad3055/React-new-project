import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Heart, Sparkles, BookOpen, User, Filter, Check } from 'lucide-react';

export default function IslamicNamesView() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all'); // 'all', 'boy', 'girl'
  const [startingLetter, setStartingLetter] = useState('');
  const [favorites, setFavorites] = useState([]);

  const namesData = [
    { name: 'Muhammad', arabic: 'مُحَمَّد', gender: 'boy', origin: 'Arabic', meaning: 'Praiseworthy, the name of the Last Prophet of Allah (PBUH).' },
    { name: 'Ayesha', arabic: 'عَائِشَة', gender: 'girl', origin: 'Arabic', meaning: 'Living, prosperous, Mother of the Believers (RA).' },
    { name: 'Zayd', arabic: 'زَيْد', gender: 'boy', origin: 'Arabic', meaning: 'Growth, abundance, companion of Prophet Muhammad (SAW).' },
    { name: 'Fatima', arabic: 'فَاطِمَة', gender: 'girl', origin: 'Arabic', meaning: 'Chaste, one who abstains, beloved daughter of the Prophet (SAW).' },
    { name: 'Ibrahim', arabic: 'إِبْرَاهِيم', gender: 'boy', origin: 'Arabic', meaning: 'Father of nations, Prophet Ibrahim (AS) Friend of Allah.' },
    { name: 'Maryam', arabic: 'مَرْيَم', gender: 'girl', origin: 'Arabic', meaning: 'Pious, devout, mother of Prophet Isa (AS).' },
    { name: 'Yusuf', arabic: 'يُوسُف', gender: 'boy', origin: 'Arabic', meaning: 'God increases, Prophet Yusuf (AS) renowned for beauty & patience.' },
    { name: 'Khadijah', arabic: 'خَدِيجَة', gender: 'girl', origin: 'Arabic', meaning: 'Trustworthy, first wife of Prophet Muhammad (SAW).' },
    { name: 'Bilal', arabic: 'بِلاَل', gender: 'boy', origin: 'Arabic', meaning: 'Moistening, companion & first Muezzin of Islam (RA).' },
    { name: 'Zainab', arabic: 'زَيْنَب', gender: 'girl', origin: 'Arabic', meaning: 'Fragrant flower, daughter & granddaughter of the Prophet (SAW).' },
    { name: 'Hamza', arabic: 'حَمْزَة', gender: 'boy', origin: 'Arabic', meaning: 'Lion, brave warrior, uncle of Prophet Muhammad (SAW).' },
    { name: 'Sumayya', arabic: 'سُمَيَّة', gender: 'girl', origin: 'Arabic', meaning: 'High above, first female martyr in Islam (RA).' },
    { name: 'Omar', arabic: 'عُمَر', gender: 'boy', origin: 'Arabic', meaning: 'Long-lived, Second Caliph of Islam Umar ibn Al-Khattab (RA).' },
    { name: 'Hafsa', arabic: 'حَفْصَة', gender: 'girl', origin: 'Arabic', meaning: 'Young lioness, guardian of the first Quranic manuscript (RA).' },
    { name: 'Rayyan', arabic: 'رَيَّان', gender: 'boy', origin: 'Arabic', meaning: 'Luxuriant, gate of Paradise reserved for fasting believers.' },
    { name: 'Noor', arabic: 'نُور', gender: 'girl', origin: 'Arabic', meaning: 'Divine light, radiance, mentioned frequently in the Quran.' },
    { name: 'Tariq', arabic: 'طَارِق', gender: 'boy', origin: 'Arabic', meaning: 'Morning star, conqueror, title of Surah At-Tariq.' },
    { name: 'Safa', arabic: 'صَفَا', gender: 'girl', origin: 'Arabic', meaning: 'Purity, clarity, holy hill next to the Kaaba.' },
    { name: 'Brahui Gul', arabic: 'براہوئی گل', gender: 'girl', origin: 'Brahui', meaning: 'Flower of the Brahui lands, beautiful and fragrant.' },
    { name: 'Brohi Khan', arabic: 'بروهي خان', gender: 'boy', origin: 'Brahui', meaning: 'Noble leader, honorable Brahui warrior of faith.' }
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const toggleFavorite = (name) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const filteredNames = namesData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(query.toLowerCase()) || 
                          item.meaning.toLowerCase().includes(query.toLowerCase()) ||
                          item.arabic.includes(query);
    const matchesGender = genderFilter === 'all' || item.gender === genderFilter;
    const matchesLetter = !startingLetter || item.name.toUpperCase().startsWith(startingLetter);
    return matchesSearch && matchesGender && matchesLetter;
  });

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Sparkles size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Authentic Islamic Dictionary
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Islamic Baby Names &amp; Meanings
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Discover thousands of meaningful Islamic names for boys &amp; girls with Arabic script, origin, Quranic background, and translations.
          </p>
        </div>

        {/* ── Filter Bar ── */}
        <div style={{
          background: '#ffffff', borderRadius: '20px', padding: '1.5rem',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem'
        }}>
          {/* Top Row: Search & Gender Toggle */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search size= {18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search name, meaning, or Arabic script..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '14px',
                  border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#334155', background: '#f8fafc'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'boy', 'girl'].map(g => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  style={{
                    padding: '8px 18px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                    background: genderFilter === g ? '#059669' : '#f1f5f9',
                    color: genderFilter === g ? '#ffffff' : '#475569', border: 'none', transition: 'all 0.2s', textTransform: 'capitalize'
                  }}
                >
                  {g === 'all' ? 'All Names' : g === 'boy' ? '👦 Boys' : '👧 Girls'}
                </button>
              ))}
            </div>
          </div>

          {/* Alphabet Letter Selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <button
              onClick={() => setStartingLetter('')}
              style={{
                padding: '4px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                background: startingLetter === '' ? '#d97706' : '#f1f5f9',
                color: startingLetter === '' ? '#ffffff' : '#64748b', border: 'none'
              }}
            >
              All A-Z
            </button>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => setStartingLetter(letter)}
                style={{
                  width: '28px', height: '28px', borderRadius: '8px', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                  background: startingLetter === letter ? '#d97706' : '#f1f5f9',
                  color: startingLetter === letter ? '#ffffff' : '#64748b', border: 'none'
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* ── Names Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredNames.map((item, idx) => {
            const isFav = favorites.includes(item.name);
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff', borderRadius: '20px', padding: '1.5rem',
                  border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem',
                      background: item.gender === 'boy' ? '#dbeafe' : '#fce7f3',
                      color: item.gender === 'boy' ? '#1d4ed8' : '#be185d'
                    }}>
                      {item.gender === 'boy' ? '👦 Boy' : '👧 Girl'} • {item.origin}
                    </span>
                    <button
                      onClick={() => toggleFavorite(item.name)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFav ? '#ef4444' : '#cbd5e1' }}
                    >
                      <Heart size={20} fill={isFav ? '#ef4444' : 'none'} />
                    </button>
                  </div>

                  <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {item.name}
                  </h3>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Amiri, serif', color: '#059669', marginBottom: '0.75rem' }}>
                    {item.arabic}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                    {item.meaning}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
