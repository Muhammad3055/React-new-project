import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FAZAIL_DATA = [
  {
    id: 1,
    category: 'quran',
    title: 'The Best of People / بہترین انسان',
    arabic_text: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation_en: 'The best among you are those who learn the Quran and teach it to others.',
    translation_ur: 'تم میں سے بہترین شخص وہ ہے جو قرآن سیکھے اور دوسروں کو سکھائے۔',
    reference: 'Sahih al-Bukhari 5027',
    narrator: 'Uthman bin Affan (RA)',
    benefit_en: 'Teaching and learning the Quran elevates one to the highest status in Islam.',
    benefit_ur: 'قرآن مجید کی تعلیم و تعلم انسان کو اسلام میں اعلیٰ ترین مقام عطا کرتی ہے۔',
  },
  {
    id: 2,
    category: 'quran',
    title: 'Reward of 10 Good Deeds for Every Letter / ہر حرف پر 10 نیکیوں کا ثواب',
    arabic_text: 'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا',
    translation_en: 'Whoever recites a letter from the Book of Allah will be credited with a good deed, and a good deed gets a ten-fold reward.',
    translation_ur: 'جو شخص اللہ کی کتاب کا ایک حرف پڑھے گا اسے ایک نیکی ملے گی اور ایک نیکی کا ثواب دس گنا ملتا ہے۔',
    reference: 'Sunan at-Tirmidhi 2910',
    narrator: 'Abdullah ibn Mas’ud (RA)',
    benefit_en: 'Reading even a short verse brings hundreds of multiplied rewards.',
    benefit_ur: 'ایک چھوٹی سی آیت کی تلاوت بھی سینکڑوں نیکیوں کا سبب بنتی ہے۔',
  },
  {
    id: 3,
    category: 'quran',
    title: 'Quran as an Intercessor / قیامت کے دن قرآن کی سفارش',
    arabic_text: 'اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ',
    translation_en: 'Read the Quran, for it will come as an intercessor for its companions on the Day of Resurrection.',
    translation_ur: 'قرآن پڑھا کرو، کیونکہ یہ قیامت کے دن اپنے پڑھنے والوں کے لیے سفارش بن کر آئے گا۔',
    reference: 'Sahih Muslim 804',
    narrator: 'Abu Umamah al-Bahili (RA)',
    benefit_en: 'The Quran intercedes for those who recite and live by it.',
    benefit_ur: 'قرآن مجید اپنے قاری اور عمل کرنے والے کے لیے اللہ کے حضور شفاعت کرے گا۔',
  },
  {
    id: 4,
    category: 'salah',
    title: 'Purity is Half of Faith & Prayer is Light / طہارت آدھا ایمان اور نماز نور ہے',
    arabic_text: 'الطَّهُورُ شَطْرُ الإِيمَانِ وَالصَّلاَةُ نُورٌ',
    translation_en: 'Purity is half of faith, and prayer is a guiding light.',
    translation_ur: 'پاکیزگی آدھا ایمان ہے، اور نماز مومن کے لیے نورِ ہدایت ہے۔',
    reference: 'Sahih Muslim 223',
    narrator: 'Abu Malik al-Ash’ari (RA)',
    benefit_en: 'Obligatory prayers illuminate a believer\'s heart and life.',
    benefit_ur: 'پنجگانہ نماز مومن کے دل اور زندگی کو ہدایت کے نور سے منور کرتی ہے۔',
  },
  {
    id: 5,
    category: 'salah',
    title: 'Erasing Sins Like a Flowing River / گناہوں کی معافی جیسے بہتا ہوا دریا',
    arabic_text: 'أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ هَلْ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ',
    translation_en: 'If there was a river at the door of one of you in which he bathed five times a day, would any dirt remain on him? Five daily prayers wipe out sins.',
    translation_ur: 'اگر تم میں سے کسی کے دروازے پر نہر ہو اور وہ اس میں روزانہ پانچ بار غسل کرے، تو کیا اس کے جسم پر کوئی میل باقی رہے گی؟ اسی طرح پانچوں نمازیں گناہوں کو مٹا دیتی ہیں۔',
    reference: 'Sahih al-Bukhari 528 & Muslim 667',
    narrator: 'Abu Hurairah (RA)',
    benefit_en: 'Regular 5 daily prayers wash away minor daily sins completely.',
    benefit_ur: 'روزانہ کی ۵ وقت کی نمازیں انسان کے تمام چھوٹے گناہوں کو دھو ڈالتی ہیں۔',
  },
  {
    id: 6,
    category: 'dhikr',
    title: 'Two Words Beloved to the Most Merciful / رحمان کے دو پیارے کلمے',
    arabic_text: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ ثَقِيلَتَانِ فِي الْمِيزَانِ حَبِيبَتَانِ إِلَى الرَّحْمَنِ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    translation_en: 'Two words are light on the tongue, heavy on the scale, and beloved to the Most Merciful: "SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem".',
    translation_ur: 'دو کلمے زبان پر ہلکے، میزان میں بھاری اور رحمان کو بہت محبوب ہیں: "سبحان اللہ وبحمدہ سبحان اللہ العظیم"۔',
    reference: 'Sahih al-Bukhari 6406 & Muslim 2691',
    narrator: 'Abu Hurairah (RA)',
    benefit_en: 'Repetition of this Dhikr heavily weighs on the scales of good deeds.',
    benefit_ur: 'یہ ذکر اعمال کے ترازو میں نیکیوں کا وزن بہت بڑھا دیتا ہے۔',
  },
  {
    id: 7,
    category: 'dhikr',
    title: 'Remembrance of Allah vs Neglect / ذکرِ الٰہی کی فضیلت',
    arabic_text: 'مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لاَ يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ',
    translation_en: 'The example of the one who remembers his Lord and the one who does not remember his Lord is like the living and the dead.',
    translation_ur: 'وہ شخص جو اپنے رب کا ذکر کرتا ہے اور جو ذکر نہیں کرتا، ان دونوں کی مثال زندہ اور مردہ کی سی ہے۔',
    reference: 'Sahih al-Bukhari 6407',
    narrator: 'Abu Musa al-Ash’ari (RA)',
    benefit_en: 'Dhikr gives spiritual life and peace to the heart.',
    benefit_ur: 'اللہ کا ذکر روح کو زندگی اور دل کو حقیقی سکون بخشتا ہے۔',
  },
  {
    id: 8,
    category: 'ramadan',
    title: 'Forgiveness Through Fasting / روزے سے پچھلے گناہوں کی معافی',
    arabic_text: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    translation_en: 'Whoever fasts during Ramadan out of sincere faith and hoping for reward, all his past sins will be forgiven.',
    translation_ur: 'جس نے رمضان کے روزے ایمان اور ثواب کی نیت سے رکھے، اس کے پچھلے تمام گناہ معاف کر دیے جاتے ہیں۔',
    reference: 'Sahih al-Bukhari 38 & Muslim 760',
    narrator: 'Abu Hurairah (RA)',
    benefit_en: 'Ramadan fasting purifies the soul and wipes clean past transgressions.',
    benefit_ur: 'رمضان المبارک کے روزے انسان کو گناہوں سے پاک و صاف کر دیتے ہیں۔',
  },
  {
    id: 9,
    category: 'knowledge',
    title: 'Seeking Knowledge Leads to Paradise / علمِ دین کا راستہ جنت کا راستہ',
    arabic_text: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    translation_en: 'Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise.',
    translation_ur: 'جو شخص علمِ دین کی تلاش میں کسی راستے پر چلتا ہے، اللہ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔',
    reference: 'Sahih Muslim 2699',
    narrator: 'Abu Hurairah (RA)',
    benefit_en: 'Learning Islamic knowledge is a direct pathway to Jannah.',
    benefit_ur: 'علمِ دین حاصل کرنا انسان کو سیدھا جنت کی طرف لے جاتا ہے۔',
  },
  {
    id: 10,
    category: 'charity',
    title: 'Charity Never Decreases Wealth / صدقہ سے مال کم نہیں ہوتا',
    arabic_text: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلاَّ عِزًّا',
    translation_en: 'Charity does not decrease wealth, and Allah increases the honor of one who forgives.',
    translation_ur: 'صدقہ دینے سے مال کم نہیں ہوتا، اور معاف کرنے والے کی عزت میں اللہ اضافہ ہی فرماتا ہے۔',
    reference: 'Sahih Muslim 2588',
    narrator: 'Abu Hurairah (RA)',
    benefit_en: 'Giving Sadaqah brings barakah and divine blessings into wealth.',
    benefit_ur: 'صدقہ و خیرات سے مال و دولت میں برکت اور اضافہ ہوتا ہے۔',
  }
];

export default function FazailView() {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLang, setSelectedLang] = useState(() => (lang === 'ur' ? 'ur' : (lang === 'en' ? 'en' : 'both')));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (lang === 'ur') {
      setSelectedLang('ur');
    } else if (lang === 'en') {
      setSelectedLang('en');
    } else {
      setSelectedLang('both');
    }
  }, [lang]);

  const categories = [
    { id: 'all', label: 'All Fazail / تمام فضائل', icon: 'fas fa-star' },
    { id: 'quran', label: 'Virtues of Quran / فضائل قرآن', icon: 'fas fa-quran' },
    { id: 'salah', label: 'Virtues of Prayer / فضائل نماز', icon: 'fas fa-mosque' },
    { id: 'dhikr', label: 'Dhikr / فضائل ذکر', icon: 'fas fa-hands' },
    { id: 'ramadan', label: 'Ramadan / فضائل روزہ', icon: 'fas fa-moon' },
    { id: 'knowledge', label: 'Knowledge / فضائل علم', icon: 'fas fa-graduation-cap' },
    { id: 'charity', label: 'Charity / فضائل صدقہ', icon: 'fas fa-hand-holding-heart' },
  ];

  const filteredItems = FAZAIL_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translation_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translation_ur.includes(searchTerm) ||
      item.arabic_text.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const copyFazail = (item) => {
    const text = `"${item.title}"\n\n${item.arabic_text}\n\nEnglish: "${item.translation_en}"\n\nاردو: "${item.translation_ur}"\n\nReference: ${item.reference}`;
    navigator.clipboard.writeText(text);
    alert('Fazail text copied to clipboard!');
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="section-title">
          <i className="fas fa-book" style={{ color: 'var(--accent-gold)' }}></i> Fazail & Virtues of Good Deeds (فضائل)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '680px', marginInline: 'auto' }}>
          Explore authentic virtues (فضائل و فضائلِ قرآن) in English & Urdu for reciting the Holy Quran, performing Salah, Dhikr, and good deeds.
        </p>
      </div>

      {/* Language Toggle Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setSelectedLang('both')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '25px',
            border: selectedLang === 'both' ? '2px solid var(--accent-gold)' : '1px solid #cbd5e1',
            background: selectedLang === 'both' ? 'var(--primary-dark)' : '#ffffff',
            color: selectedLang === 'both' ? 'var(--accent-gold)' : '#334155',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          🌐 Both (English + Urdu)
        </button>

        <button
          onClick={() => setSelectedLang('en')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '25px',
            border: selectedLang === 'en' ? '2px solid #2563eb' : '1px solid #cbd5e1',
            background: selectedLang === 'en' ? '#2563eb' : '#ffffff',
            color: selectedLang === 'en' ? '#ffffff' : '#334155',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          English Fazail
        </button>

        <button
          onClick={() => setSelectedLang('ur')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '25px',
            border: selectedLang === 'ur' ? '2px solid #059669' : '1px solid #cbd5e1',
            background: selectedLang === 'ur' ? '#059669' : '#ffffff',
            color: selectedLang === 'ur' ? '#ffffff' : '#334155',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          اردو فضائل (Urdu)
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              border: selectedCategory === cat.id ? '2px solid var(--accent-gold)' : '1px solid #cbd5e1',
              background: selectedCategory === cat.id ? 'rgba(245, 158, 11, 0.2)' : '#ffffff',
              color: selectedCategory === cat.id ? '#b45309' : '#334155',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <i className={cat.icon} style={{ color: selectedCategory === cat.id ? 'var(--accent-gold)' : '#d97706' }}></i>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '500px', margin: '0 auto 2rem auto', position: 'relative' }}>
        <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
        <input
          type="text"
          placeholder="Search virtues in English or Urdu..."
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
              background: 'linear-gradient(145deg, rgba(3, 45, 35, 0.95), rgba(2, 30, 24, 0.98))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
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

              {/* Arabic Hadith/Quran Text */}
              <p className="arabic-font" style={{ fontSize: '1.45rem', color: '#6ee7b7', lineHeight: '1.9', marginBottom: '1rem', textAlign: 'right' }}>
                {item.arabic_text}
              </p>

              {/* English Translation */}
              {(selectedLang === 'both' || selectedLang === 'en') && (
                <p style={{ fontSize: '0.95rem', color: '#f8fafc', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '0.85rem' }}>
                  English: "{item.translation_en}"
                </p>
              )}

              {/* Urdu Translation */}
              {(selectedLang === 'both' || selectedLang === 'ur') && (
                <p style={{ fontSize: '1rem', color: '#fef3c7', lineHeight: '1.8', marginBottom: '0.85rem', textAlign: 'right', fontWeight: 600 }}>
                  اردو: "{item.translation_ur}"
                </p>
              )}

              {/* Key Benefit */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '10px', borderLeft: '3px solid var(--accent-gold)', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  ✨ Virtue & Benefit (فضیلت و فائدہ):
                </span>
                {(selectedLang === 'both' || selectedLang === 'en') && (
                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '0.2rem' }}>{item.benefit_en}</span>
                )}
                {(selectedLang === 'both' || selectedLang === 'ur') && (
                  <span style={{ fontSize: '0.88rem', color: '#a7f3d0', display: 'block', textAlign: 'right', fontWeight: 600 }}>{item.benefit_ur}</span>
                )}
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
