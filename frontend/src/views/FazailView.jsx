import React, { useState } from 'react';

const FAZAIL_DATA = [
  {
    id: 1,
    category: 'quran',
    title: 'The Best of People',
    arabic_text: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'The best among you are those who learn the Quran and teach it to others.',
    reference: 'Sahih al-Bukhari 5027',
    narrator: 'Uthman bin Affan (RA)',
    benefit: 'Teaching and learning the Quran elevates one to the highest status in Islam.',
  },
  {
    id: 2,
    category: 'quran',
    title: 'Reward of 10 Good Deeds for Every Letter',
    arabic_text: 'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا',
    translation: 'Whoever recites a letter from the Book of Allah will be credited with a good deed, and a good deed gets a ten-fold reward.',
    reference: 'Sunan at-Tirmidhi 2910',
    narrator: 'Abdullah ibn Mas’ud (RA)',
    benefit: 'Reading even a short verse brings hundreds of multiplied rewards.',
  },
  {
    id: 3,
    category: 'quran',
    title: 'Quran as an Intercessor on Judgment Day',
    arabic_text: 'اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ',
    translation: 'Read the Quran, for it will come as an intercessor for its companions on the Day of Resurrection.',
    reference: 'Sahih Muslim 804',
    narrator: 'Abu Umamah al-Bahili (RA)',
    benefit: 'The Quran intercedes for those who recite and live by it.',
  },
  {
    id: 4,
    category: 'salah',
    title: 'Purity is Half of Faith & Prayer is Light',
    arabic_text: 'الطَّهُورُ شَطْرُ الإِيمَانِ وَالصَّلاَةُ نُورٌ',
    translation: 'Purity is half of faith, and prayer is a guiding light.',
    reference: 'Sahih Muslim 223',
    narrator: 'Abu Malik al-Ash’ari (RA)',
    benefit: 'Obligatory prayers illuminate a believer\'s heart and life.',
  },
  {
    id: 5,
    category: 'salah',
    title: 'Erasing Sins Like a Flowing River',
    arabic_text: 'أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ هَلْ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ',
    translation: 'If there was a river at the door of one of you in which he bathed five times a day, would any dirt remain on him? Five daily prayers wipe out sins.',
    reference: 'Sahih al-Bukhari 528 & Muslim 667',
    narrator: 'Abu Hurairah (RA)',
    benefit: 'Regular 5 daily prayers wash away minor daily sins completely.',
  },
  {
    id: 6,
    category: 'dhikr',
    title: 'Two Words Beloved to the Most Merciful',
    arabic_text: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ ثَقِيلَتَانِ فِي الْمِيزَانِ حَبِيبَتَانِ إِلَى الرَّحْمَنِ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    translation: 'Two words are light on the tongue, heavy on the scale, and beloved to the Most Merciful: "SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem".',
    reference: 'Sahih al-Bukhari 6406 & Muslim 2691',
    narrator: 'Abu Hurairah (RA)',
    benefit: 'Repetition of this Dhikr heavily weighs on the scales of good deeds.',
  },
  {
    id: 7,
    category: 'dhikr',
    title: 'Remembrance of Allah vs Not Remembering',
    arabic_text: 'مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لاَ يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ',
    translation: 'The example of the one who remembers his Lord and the one who does not remember his Lord is like the living and the dead.',
    reference: 'Sahih al-Bukhari 6407',
    narrator: 'Abu Musa al-Ash’ari (RA)',
    benefit: 'Dhikr gives spiritual life and peace to the heart.',
  },
  {
    id: 8,
    category: 'ramadan',
    title: 'Forgiveness of Past Sins Through Fasting',
    arabic_text: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    translation: 'Whoever fasts during Ramadan out of sincere faith and hoping for reward, all his past sins will be forgiven.',
    reference: 'Sahih al-Bukhari 38 & Muslim 760',
    narrator: 'Abu Hurairah (RA)',
    benefit: 'Ramadan fasting purifies the soul and wipes clean past transgressions.',
  },
  {
    id: 9,
    category: 'knowledge',
    title: 'Seeking Knowledge Leads directly to Paradise',
    arabic_text: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: 'Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise.',
    reference: 'Sahih Muslim 2699',
    narrator: 'Abu Hurairah (RA)',
    benefit: 'Learning Islamic knowledge is a direct pathway to Jannah.',
  },
  {
    id: 10,
    category: 'charity',
    title: 'Charity Never Decreases Wealth',
    arabic_text: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلاَّ عِزًّا',
    translation: 'Charity does not decrease wealth, and Allah increases the honor of one who forgives.',
    reference: 'Sahih Muslim 2588',
    narrator: 'Abu Hurairah (RA)',
    benefit: 'Giving Sadaqah brings barakah and divine blessings into wealth.',
  }
];

export default function FazailView() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'All Fazail', icon: 'fas fa-star' },
    { id: 'quran', label: 'Virtues of Quran', icon: 'fas fa-quran' },
    { id: 'salah', label: 'Virtues of Prayer', icon: 'fas fa-mosque' },
    { id: 'dhikr', label: 'Dhikr & Remembrance', icon: 'fas fa-hands' },
    { id: 'ramadan', label: 'Fasting & Ramadan', icon: 'fas fa-moon' },
    { id: 'knowledge', label: 'Seeking Knowledge', icon: 'fas fa-graduation-cap' },
    { id: 'charity', label: 'Charity (Sadaqah)', icon: 'fas fa-hand-holding-heart' },
  ];

  const filteredItems = FAZAIL_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.benefit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.arabic_text.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const copyFazail = (item) => {
    const text = `"${item.title}"\n\n${item.arabic_text}\n\n"${item.translation}"\n\nReference: ${item.reference}`;
    navigator.clipboard.writeText(text);
    alert('Fazail text copied to clipboard!');
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">
          <i className="fas fa-book" style={{ color: 'var(--accent-gold)' }}></i> Fazail & Virtues of Good Deeds
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '680px', marginInline: 'auto' }}>
          Discover authentic virtues (فضائل الأعمال) of reciting the Holy Quran, performing Salah, remembering Allah, and doing good deeds.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '30px',
              border: selectedCategory === cat.id ? '2px solid var(--accent-gold)' : '1.5px solid #cbd5e1',
              background: selectedCategory === cat.id ? 'rgba(245, 158, 11, 0.2)' : '#ffffff',
              color: selectedCategory === cat.id ? '#b45309' : '#000000',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.25s ease',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
            }}
          >
            <i className={cat.icon} style={{ color: selectedCategory === cat.id ? 'var(--accent-gold)' : '#d97706', fontSize: '1rem' }}></i>
            <span style={{ color: selectedCategory === cat.id ? '#b45309' : '#000000' }}>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '500px', margin: '0 auto 2rem auto', position: 'relative' }}>
        <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
        <input
          type="text"
          placeholder="Search virtues, translations, keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 1rem 0.65rem 2.6rem',
            borderRadius: '25px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Fazail Grid */}
      <div className="grid-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(145deg, rgba(3, 45, 35, 0.9), rgba(2, 30, 24, 0.95))',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.12)', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <i className="fas fa-award" style={{ marginRight: '0.35rem' }}></i> {item.title}
                </span>
                <button
                  className="verse-btn"
                  title="Copy Fazail"
                  onClick={() => copyFazail(item)}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <i className="far fa-copy"></i>
                </button>
              </div>

              <p className="arabic-font" style={{ fontSize: '1.45rem', color: '#6ee7b7', lineHeight: '1.9', marginBottom: '1rem', textAlign: 'right' }}>
                {item.arabic_text}
              </p>

              <p style={{ fontSize: '0.95rem', color: '#f8fafc', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '0.85rem' }}>
                "{item.translation}"
              </p>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '10px', borderLeft: '3px solid var(--accent-gold)', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  ✨ Key Virtue & Benefit:
                </span>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{item.benefit}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span><i className="fas fa-user-tag"></i> {item.narrator}</span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}><i className="fas fa-book-open"></i> {item.reference}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
