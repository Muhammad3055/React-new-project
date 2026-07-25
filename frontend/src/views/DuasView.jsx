import React, { useState } from 'react';

export default function DuasView() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    { id: 'all', label: 'All Du\'as', icon: 'fas fa-hands' },
    { id: 'morning', label: 'Morning Adhkar', icon: 'fas fa-sun' },
    { id: 'evening', label: 'Evening Adhkar', icon: 'fas fa-moon' },
    { id: 'salah', label: 'After Prayer (Salah)', icon: 'fas fa-kaaba' },
    { id: 'sleep', label: 'Before Sleeping', icon: 'fas fa-bed' },
    { id: 'forgiveness', label: 'Seeking Forgiveness', icon: 'fas fa-heart' },
    { id: 'guidance', label: 'Knowledge & Guidance', icon: 'fas fa-book-reader' }
  ];

  const duasData = [
    {
      id: 1,
      category: 'morning',
      title: 'Morning Remembrance for Divine Protection',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      transliteration: 'Asbahna wa-asbahal-mulku lillah wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah',
      translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. There is no god worthy of worship except Allah alone, without partner.',
      reference: 'Sahih Muslim 2723',
      recommendedCount: 'Recite 1 time'
    },
    {
      id: 2,
      category: 'morning',
      title: 'Sayyid al-Istighfar (The Master Supplication for Forgiveness)',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
      transliteration: 'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa-ana \'abduk, wa-ana \'ala \'ahdika wa-wa\'dika mas-tata\'t',
      translation: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I am faithful to my covenant and my promise to You as much as I can.',
      reference: 'Sahih al-Bukhari 6306',
      recommendedCount: 'Recite 1 time every morning & evening'
    },
    {
      id: 3,
      category: 'evening',
      title: 'Evening Supplication for Complete Safety',
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      transliteration: 'A\'udhu bi-kalimatil-lahit-tam-mati min sharri ma khalaq',
      translation: 'I seek refuge in the Perfect Words of Allah from the evil of what He has created.',
      reference: 'Sahih Muslim 2709',
      recommendedCount: 'Recite 3 times in the evening'
    },
    {
      id: 4,
      category: 'evening',
      title: 'Protection from Harm in Earth and Heaven',
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa huwas-Sami\'ul-\'Alim',
      translation: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth or in the heaven, and He is the All-Hearing, the All-Knowing.',
      reference: 'Sunan Abu Dawud 5088 (Sahih)',
      recommendedCount: 'Recite 3 times morning & evening'
    },
    {
      id: 5,
      category: 'salah',
      title: 'Ayat al-Kursi (The Verse of the Throne)',
      arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
      transliteration: 'Allahu la ilaha illa huwal-Hayyul-Qayyum, la ta\'khudhuhu sinatun wa la nawm',
      translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep.',
      reference: 'Surah Al-Baqarah 2:255 (Recite after every obligatory Salah)',
      recommendedCount: 'Recite 1 time after each prayer'
    },
    {
      id: 6,
      category: 'salah',
      title: 'Dhikr After Completing Obligatory Salah',
      arabic: 'أَسْتَغْفِرُ اللَّهَ (٣×)، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
      transliteration: 'Astaghfirullah (3x), Allahumma antas-Salam wa minkas-Salam, tabarakta ya Dhal-Jalali wal-Ikram',
      translation: 'I ask Allah for forgiveness (3 times). O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Majesty and Honor.',
      reference: 'Sahih Muslim 591',
      recommendedCount: 'Recite immediately after Salam'
    },
    {
      id: 7,
      category: 'sleep',
      title: 'Supplication Before Sleeping',
      arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      transliteration: 'Bismika-Allahumma amutu wa-ahya',
      translation: 'In Your Name, O Allah, I die and I live.',
      reference: 'Sahih al-Bukhari 6312',
      recommendedCount: 'Recite before sleeping'
    },
    {
      id: 8,
      category: 'guidance',
      title: 'Dua for Increase in Beneficial Knowledge',
      arabic: 'رَّبِّ زِدْنِي عِلْمًا',
      transliteration: 'Rabbi zidni \'ilma',
      translation: 'My Lord, increase me in knowledge.',
      reference: 'Surah Taha 20:114',
      recommendedCount: 'Recite frequently when studying'
    },
    {
      id: 9,
      category: 'forgiveness',
      title: 'Dua of Prophet Yunus (Jonah) in Distress',
      arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
      transliteration: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin',
      translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
      reference: 'Surah Al-Anbiya 21:87',
      recommendedCount: 'Recite when facing anxiety or trouble'
    }
  ];

  const filteredDuas = duasData.filter((d) => {
    const matchesCat = activeCategory === 'all' || d.category === activeCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      d.translation.toLowerCase().includes(search.toLowerCase()) ||
      d.arabic.includes(search);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (item) => {
    const copyText = `${item.title}\n${item.arabic}\n${item.transliteration}\n"${item.translation}"\n(${item.reference})`;
    navigator.clipboard.writeText(copyText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      {/* Banner */}
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>
          <i className="fas fa-hands" style={{ color: 'var(--accent-gold)' }}></i> Authentic Du'as & Daily Adhkar
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '680px', marginInline: 'auto' }}>
          Explore authentic supplications from the Holy Quran and Sunnah of Prophet Muhammad (ﷺ) for daily protection, morning/evening adhkar, and forgiveness.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '30px',
              border: activeCategory === cat.id ? '2px solid var(--accent-gold)' : '1.5px solid #cbd5e1',
              background: activeCategory === cat.id ? 'rgba(245, 158, 11, 0.2)' : '#ffffff',
              color: activeCategory === cat.id ? '#b45309' : '#0f172a',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            <i className={cat.icon} style={{ color: activeCategory === cat.id ? '#b45309' : 'var(--accent-gold)' }}></i>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: '520px', margin: '0 auto 2rem auto', position: 'relative' }}>
        <i className="fas fa-search" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
        <input
          type="text"
          className="form-input"
          placeholder="Search supplication by title, keyword, or translation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.8rem', borderRadius: '30px', border: '1.5px solid var(--accent-gold)' }}
        />
      </div>

      {/* Du'as List */}
      <div style={{ display: 'grid', gap: '1.25rem', maxWidth: '850px', margin: '0 auto' }}>
        {filteredDuas.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold-dark)', background: '#fef3c7', padding: '4px 12px', borderRadius: '15px' }}>
                {item.recommendedCount}
              </span>
              <button
                onClick={() => handleCopy(item)}
                style={{ background: 'transparent', border: 'none', color: copiedId === item.id ? '#15803d' : '#64748b', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
              >
                <i className={`fas ${copiedId === item.id ? 'fa-check-circle' : 'fa-copy'}`}></i> {copiedId === item.id ? 'Copied!' : 'Copy Dua'}
              </button>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
              {item.title}
            </h3>

            {/* Arabic Card Box */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-gold)', marginBottom: '1rem', textAlign: 'right' }}>
              <p className="arabic-font" style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, lineHeight: '1.8', direction: 'rtl' }}>
                {item.arabic}
              </p>
            </div>

            {/* Transliteration & Translation */}
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155', fontStyle: 'italic', margin: '0 0 0.5rem 0' }}>
              "{item.transliteration}"
            </p>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 0.85rem 0', lineHeight: '1.6' }}>
              {item.translation}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              <i className="fas fa-bookmark" style={{ color: 'var(--accent-gold)' }}></i>
              <span>{item.reference}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
