import React, { useState } from 'react';

export default function NamesOfAllahView() {
  const [search, setSearch] = useState('');
  const [copiedName, setCopiedName] = useState(null);

  const namesOfAllah = [
    { number: 1, arabic: 'الرَّحْمَٰنُ', transliteration: 'Ar-Rahman', meaning: 'The Most Gracious / The Compassionate', benefit: 'He who repeats this name 100 times after each prayer will be enhanced in memory and awareness.' },
    { number: 2, arabic: 'الرَّحِيمُ', transliteration: 'Ar-Rahim', meaning: 'The Most Merciful', benefit: 'He who repeats this name 100 times after Fajr prayer will find safety from all afflictions.' },
    { number: 3, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', meaning: 'The King / The Sovereign', benefit: 'He who repeats this name abundantly will be granted financial independence and respect.' },
    { number: 4, arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', meaning: 'The Most Holy / The Pure', benefit: 'Reciting this name 100 times daily purifies the heart from anxiety and spiritual diseases.' },
    { number: 5, arabic: 'السَّلَامُ', transliteration: 'As-Salam', meaning: 'The Source of Peace', benefit: 'Reciting this name over a sick person 160 times helps bring healing and tranquility.' },
    { number: 6, arabic: 'الْمُؤْمِنُ', transliteration: 'Al-Mu\'min', meaning: 'The Granter of Security', benefit: 'Repeating this name 63 times when in fear protects from harm.' },
    { number: 7, arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', meaning: 'The Guardian / The Protector', benefit: 'He who takes a bath and offers 2 Rakaat prayer and recites this 100 times will be blessed with inner light.' },
    { number: 8, arabic: 'الْعَزِيزُ', transliteration: 'Al-Aziz', meaning: 'The All-Mighty', benefit: 'He who recites this name 41 times after Fajr will be granted honor and self-reliance.' },
    { number: 9, arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', meaning: 'The Compeller / The Restorer', benefit: 'He who recites this name will be protected from oppression and coercion.' },
    { number: 10, arabic: 'الْمُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', meaning: 'The Supreme / The Majestic', benefit: 'He who recites this name before any major task will achieve righteous success.' },
    { number: 11, arabic: 'الْخَالِقُ', transliteration: 'Al-Khaliq', meaning: 'The Creator', benefit: 'He who recites this name 100 times for 7 consecutive days will have an angel created to pray on his behalf.' },
    { number: 12, arabic: 'الْبَارِئُ', transliteration: 'Al-Bari\'', meaning: 'The Maker of Order', benefit: 'Reciting this name helps relieve physical and mental burdens.' },
    { number: 13, arabic: 'الْمُصَوِّرُ', transliteration: 'Al-Musawwir', meaning: 'The Shaper of Beauty', benefit: 'Reciting this name 21 times helps in creative and artistic endeavors.' },
    { number: 14, arabic: 'الْغَفَّارُ', transliteration: 'Al-Ghaffar', meaning: 'The Forgiving', benefit: 'He who repeats this name 100 times after Jumu\'ah prayer will be granted forgiveness.' },
    { number: 15, arabic: 'الْقَهَّارُ', transliteration: 'Al-Qahhar', meaning: 'The Subduer', benefit: 'Reciting this name helps overcome harmful desires and worldliness.' },
    { number: 16, arabic: 'الْوَهَّابُ', transliteration: 'Al-Wahhab', meaning: 'The Giver of All', benefit: 'Reciting this name 40 times in Sujood brings unexpected sustenance.' },
    { number: 17, arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', meaning: 'The Sustainer / The Provider', benefit: 'Reciting this name 10 times before Fajr brings abundant provision.' },
    { number: 18, arabic: 'الْفَتَّاحُ', transliteration: 'Al-Fattah', meaning: 'The Opener of Victory', benefit: 'He who places his hands on his chest and recites this 70 times after Fajr will have his heart illuminated.' },
    { number: 19, arabic: 'الْعَلِيمُ', transliteration: 'Al-\'Alim', meaning: 'The All-Knowing', benefit: 'He who recites this name will have a heart illuminated with divine wisdom.' },
    { number: 20, arabic: 'الْقَابِضُ', transliteration: 'Al-Qabid', meaning: 'The Restrainer', benefit: 'Writing this on 4 pieces of bread for 40 days protects from hunger and hardship.' },
    { number: 21, arabic: 'الْبَاسِطُ', transliteration: 'Al-Basit', meaning: 'The Expander / The Extender', benefit: 'He who recites this name 10 times at Ishraq prayer with hands raised will be granted wealth.' },
    { number: 22, arabic: 'الْخَافِضُ', transliteration: 'Al-Khafid', meaning: 'The Abaser', benefit: 'Reciting this name 500 times fulfills righteous needs.' },
    { number: 23, arabic: 'الرَّافِعُ', transliteration: 'Ar-Rafi\'', meaning: 'The Exalter', benefit: 'He who recites this 100 times day and night will be elevated in honor.' },
    { number: 24, arabic: 'الْمُعِزُّ', transliteration: 'Al-Mu\'izz', meaning: 'The Bestower of Honor', benefit: 'Reciting this 140 times after Maghrib on Mondays or Fridays removes fear.' },
    { number: 25, arabic: 'الْمُذِلُّ', transliteration: 'Al-Mudhill', meaning: 'The Humiliator', benefit: 'Reciting this 75 times protects against tyranny and oppression.' },
    { number: 26, arabic: 'السَّمِيعُ', transliteration: 'As-Sami\'', meaning: 'The All-Hearing', benefit: 'Reciting this 500 times after Dhuhr prayer ensures prayers are answered.' },
    { number: 27, arabic: 'الْبَصِيرُ', transliteration: 'Al-Basir', meaning: 'The All-Seeing', benefit: 'Reciting this 100 times after Jumu\'ah prayer improves spiritual vision.' },
    { number: 28, arabic: 'الْحَكَمُ', transliteration: 'Al-Hakam', meaning: 'The Judge / The Arbitrator', benefit: 'Reciting this 99 times at night grants wisdom and deep understanding.' },
    { number: 29, arabic: 'الْعَدْلُ', transliteration: 'Al-\'Adl', meaning: 'The Utterly Just', benefit: 'Reciting this name fosters justice and honesty in one\'s character.' },
    { number: 30, arabic: 'اللَّطِيفُ', transliteration: 'Al-Latif', meaning: 'The Subtle One / The Gracious', benefit: 'Reciting this 133 times brings relief from unexpected distress.' },
    { number: 31, arabic: 'الْخَبِيرُ', transliteration: 'Al-Khabir', meaning: 'The All-Aware', benefit: 'Reciting this for 7 days removes harmful habits.' },
    { number: 32, arabic: 'الْحَلِيمُ', transliteration: 'Al-Halim', meaning: 'The Most Forbearing', benefit: 'Writing this name and placing it on crops or possessions protects them.' },
    { number: 33, arabic: 'الْعَظِيمُ', transliteration: 'Al-\'Azim', meaning: 'The Magnificent', benefit: 'Reciting this name frequently grants respect among people.' },
    { number: 34, arabic: 'الْغَفُورُ', transliteration: 'Al-Ghafur', meaning: 'The All-Forgiving', benefit: 'Reciting this frequently cures headaches and sorrow.' },
    { number: 35, arabic: 'الشَّكُورُ', transliteration: 'Ash-Shakur', meaning: 'The Most Appreciative', benefit: 'Reciting 41 times on water and washing the eyes improves vision and clarity.' },
    { number: 36, arabic: 'الْعَلِيُّ', transliteration: 'Al-\'Aliyy', meaning: 'The Most High', benefit: 'Reciting this daily elevates one\'s rank and knowledge.' },
    { number: 37, arabic: 'الْكَبِيرُ', transliteration: 'Al-Kabir', meaning: 'The Most Great', benefit: 'He who recites this 100 times daily will be esteemed by everyone.' },
    { number: 38, arabic: 'الْحَفِيظُ', transliteration: 'Al-Hafiz', meaning: 'The Preserver / The Protector', benefit: 'Reciting 16 times daily protects against danger and calamity.' },
    { number: 39, arabic: 'الْمُقِيتُ', transliteration: 'Al-Muqit', meaning: 'The Sustainer of All', benefit: 'Blowing this name onto water and drinking it satisfies spiritual hunger.' },
    { number: 40, arabic: 'الْحَسِيبُ', transliteration: 'Al-Hasib', meaning: 'The Reckoner', benefit: 'Reciting this 70 times when facing fear brings divine protection.' },
    { number: 41, arabic: 'الْجَلِيلُ', transliteration: 'Al-Jalil', meaning: 'The Sublime One', benefit: 'Writing this on paper with musk and saffron brings spiritual dignity.' },
    { number: 42, arabic: 'الْكَرِيمُ', transliteration: 'Al-Karim', meaning: 'The Most Generous', benefit: 'Reciting this before sleeping brings honor in this life and Hereafter.' },
    { number: 43, arabic: 'الرَّقِيبُ', transliteration: 'Ar-Raqib', meaning: 'The Watchful', benefit: 'Reciting 7 times over family and home preserves them.' },
    { number: 44, arabic: 'الْمُجِيبُ', transliteration: 'Al-Mujib', meaning: 'The Responsive / The Answerer', benefit: 'Frequent recitation ensures supplications are accepted.' },
    { number: 45, arabic: 'الْوَاسِعُ', transliteration: 'Al-Wasi\'', meaning: 'The All-Encompassing', benefit: 'Reciting this name eases financial constraints.' },
    { number: 46, arabic: 'الْحَكِيمُ', transliteration: 'Al-Hakim', meaning: 'The All-Wise', benefit: 'Reciting this name continuously opens doors of wisdom.' },
    { number: 47, arabic: 'الْوَدُودُ', transliteration: 'Al-Wadud', meaning: 'The Loving One', benefit: 'Reciting 1000 times over food and sharing it strengthens affection.' },
    { number: 48, arabic: 'الْمَجِيدُ', transliteration: 'Al-Majid', meaning: 'The Glorious', benefit: 'Reciting this name brings inner peace and nobility.' },
    { number: 49, arabic: 'الْبَاعِثُ', transliteration: 'Al-Ba\'ith', meaning: 'The Resurrector', benefit: 'Reciting 101 times at bedtime fills the heart with wisdom.' },
    { number: 50, arabic: 'الشَّهِيدُ', transliteration: 'Ash-Shahid', meaning: 'The All-Witnessing', benefit: 'Reciting this 21 times over an disobedient child guides them.' },
    { number: 51, arabic: 'الْحَقُّ', transliteration: 'Al-Haqq', meaning: 'The Absolute Truth', benefit: 'Reciting this name brings back lost items.' },
    { number: 52, arabic: 'الْوَكِيلُ', transliteration: 'Al-Wakil', meaning: 'The Trustee / The Disposer of Affairs', benefit: 'Reciting this when facing calamity protects from harm.' },
    { number: 53, arabic: 'الْقَوِيُّ', transliteration: 'Al-Qawiyy', meaning: 'The All-Strong', benefit: 'Reciting this name protects from enemies and weakness.' },
    { number: 54, arabic: 'الْمَتِينُ', transliteration: 'Al-Matin', meaning: 'The Firm / The Steadfast', benefit: 'Reciting this name gives spiritual strength.' },
    { number: 55, arabic: 'الْوَلِيُّ', transliteration: 'Al-Waliyy', meaning: 'The Protecting Friend', benefit: 'Reciting this name frequently makes one a beloved servant of Allah.' },
    { number: 56, arabic: 'الْحَمِيدُ', transliteration: 'Al-Hamid', meaning: 'The Praiseworthy', benefit: 'Reciting 93 times in solitude cleanses speech and character.' },
    { number: 57, arabic: 'الْمُحْصِي', transliteration: 'Al-Muhsi', meaning: 'The Appraiser / The Counter', benefit: 'Reciting 20 times daily makes reckoning easy on Judgment Day.' },
    { number: 58, arabic: 'الْمُبْدِئُ', transliteration: 'Al-Mubdi\'', meaning: 'The Originator', benefit: 'Reciting this before starting a new project ensures success.' },
    { number: 59, arabic: 'الْمُعِيدُ', transliteration: 'Al-Mu\'id', meaning: 'The Restorer', benefit: 'Reciting 70 times for a missing person brings them back safely.' },
    { number: 60, arabic: 'الْمُحْيِي', transliteration: 'Al-Muhyi', meaning: 'The Giver of Life', benefit: 'Reciting 7 times daily cures heavy burdens.' },
    { number: 61, arabic: 'الْمُمِيتُ', transliteration: 'Al-Mumit', meaning: 'The Creator of Death', benefit: 'Reciting this destroys spiritual ego.' },
    { number: 62, arabic: 'الْحَيُّ', transliteration: 'Al-Hayy', meaning: 'The Ever-Living', benefit: 'Reciting 300,000 times protects from illness.' },
    { number: 63, arabic: 'الْقَيُّومُ', transliteration: 'Al-Qayyum', meaning: 'The Sustainer of Existence', benefit: 'Reciting Ya Hayyu Ya Qayyum brings life to the heart.' },
    { number: 64, arabic: 'الْوَاجِدُ', transliteration: 'Al-Wajid', meaning: 'The Finder / The Unfailing', benefit: 'Reciting this while eating food brings nourishment to the heart.' },
    { number: 65, arabic: 'الْمَاجِدُ', transliteration: 'Al-Majid', meaning: 'The Noble', benefit: 'Reciting this name grants spiritual light.' },
    { number: 66, arabic: 'الْوَاحِدُ', transliteration: 'Al-Wahid', meaning: 'The Unique / The One', benefit: 'Reciting 1000 times in solitude removes fear of creation.' },
    { number: 67, arabic: 'الأَحَدُ', transliteration: 'Al-Ahad', meaning: 'The Indivisible / The One', benefit: 'Reciting 1000 times reveals spiritual secrets.' },
    { number: 68, arabic: 'الصَّمَدُ', transliteration: 'As-Samad', meaning: 'The Eternal / The Absolute', benefit: 'Reciting 115 times at dawn protects from dependence on creation.' },
    { number: 69, arabic: 'الْقَادِرُ', transliteration: 'Al-Qadir', meaning: 'The Omnipotent', benefit: 'Reciting 41 times fulfills righteous desires.' },
    { number: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'Al-Muqtadir', meaning: 'The Creator of All Power', benefit: 'Reciting upon waking brings divine guidance.' },
    { number: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'Al-Muqaddim', meaning: 'The Expediter', benefit: 'Reciting in battlefield or stressful situation grants courage.' },
    { number: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'Al-Mu\'akhkhir', meaning: 'The Delayer', benefit: 'Reciting 100 times daily brings repentance.' },
    { number: 73, arabic: 'الأَوَّلُ', transliteration: 'Al-Awwal', meaning: 'The First', benefit: 'Reciting 1000 times for 40 Fridays grants children.' },
    { number: 74, arabic: 'الأَخِرُ', transliteration: 'Al-Akhir', meaning: 'The Last', benefit: 'Reciting 1000 times grants a good end to life.' },
    { number: 75, arabic: 'الظَّاهِرُ', transliteration: 'Az-Zahir', meaning: 'The Manifest', benefit: 'Reciting 15 times after Ishraq illuminates sight.' },
    { number: 76, arabic: 'الْبَاطِنُ', transliteration: 'Al-Batin', meaning: 'The Hidden', benefit: 'Reciting 33 times daily brings inner enlightenment.' },
    { number: 77, arabic: 'الْوَالِي', transliteration: 'Al-Wali', meaning: 'The Supreme Governor', benefit: 'Reciting over a house protects it from disaster.' },
    { number: 78, arabic: 'الْمُتَعَالِي', transliteration: 'Al-Muta\'ali', meaning: 'The Self-Exalted', benefit: 'Reciting frequently grants high status.' },
    { number: 79, arabic: 'الْبَرُّ', transliteration: 'Al-Barr', meaning: 'The Source of All Goodness', benefit: 'Reciting for a child protects them from misfortune.' },
    { number: 80, arabic: 'التَّوَّابُ', transliteration: 'At-Tawwab', meaning: 'The Ever-Pardoning', benefit: 'Reciting 360 times after Duha prayer grants sincere repentance.' },
    { number: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'Al-Muntaqim', meaning: 'The Avenger', benefit: 'Reciting against oppressors grants divine justice.' },
    { number: 82, arabic: 'الْعَفُوُّ', transliteration: 'Al-\'Afuww', meaning: 'The Supreme Pardoner', benefit: 'Reciting frequently forgives sins.' },
    { number: 83, arabic: 'الرَّءُوفُ', transliteration: 'Ar-Ra\'uf', meaning: 'The Most Kind', benefit: 'Reciting 10 times when angry calms emotions.' },
    { number: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Malik-ul-Mulk', meaning: 'Master of All Sovereignty', benefit: 'Reciting constantly grants wealth and independence.' },
    { number: 85, arabic: 'ذُو الْجَلَالِ وَالإِكْرَامِ', transliteration: 'Dhul-Jalali wal-Ikram', meaning: 'Possessor of Majesty and Honor', benefit: 'Reciting frequently brings honor and wealth.' },
    { number: 86, arabic: 'الْمُقْسِطُ', transliteration: 'Al-Muqsit', meaning: 'The Equitable', benefit: 'Reciting 700 times fulfills righteous goals.' },
    { number: 87, arabic: 'الْجَامِعُ', transliteration: 'Al-Jami\'', meaning: 'The Gatherer', benefit: 'Reciting this unites separated loved ones.' },
    { number: 88, arabic: 'الْغَنِيُّ', transliteration: 'Al-Ghaniyy', meaning: 'The Self-Sufficient', benefit: 'Reciting 70 times brings contentment and prosperity.' },
    { number: 89, arabic: 'الْمُغْنِي', transliteration: 'Al-Mughni', meaning: 'The Enricher', benefit: 'Reciting 1000 times for 10 Fridays removes poverty.' },
    { number: 90, arabic: 'الْمَانِعُ', transliteration: 'Al-Mani\'', meaning: 'The Withholder', benefit: 'Reciting 20 times before sleep protects marriage.' },
    { number: 91, arabic: 'الضَّارُّ', transliteration: 'Ad-Darr', meaning: 'The Creator of Harm', benefit: 'Reciting 20 times on Friday night grants spiritual safety.' },
    { number: 92, arabic: 'النَّافِعُ', transliteration: 'An-Nafi\'', meaning: 'The Creator of Good', benefit: 'Reciting before embarking on a journey ensures safety.' },
    { number: 93, arabic: 'النُّورُ', transliteration: 'An-Nur', meaning: 'The Light', benefit: 'Reciting 1001 times illuminates the heart.' },
    { number: 94, arabic: 'الْهَادِي', transliteration: 'Al-Hadi', meaning: 'The Guide', benefit: 'Reciting frequently guides the lost.' },
    { number: 95, arabic: 'الْبَدِيعُ', transliteration: 'Al-Badi\'', meaning: 'The Incomparable Originator', benefit: 'Reciting 70 times in grief brings relief.' },
    { number: 96, arabic: 'الْبَاقِي', transliteration: 'Al-Baqi', meaning: 'The Everlasting', benefit: 'Reciting 100 times before sunrise protects from calamity.' },
    { number: 97, arabic: 'الْوَارِثُ', transliteration: 'Al-Warith', meaning: 'The Inheritor of All', benefit: 'Reciting 100 times at sunrise grants long life.' },
    { number: 98, arabic: 'الرَّشِيدُ', transliteration: 'Ar-Rashid', meaning: 'The Righteous Teacher', benefit: 'Reciting 1000 times between Maghrib and Isha completes tasks.' },
    { number: 99, arabic: 'الصَّبُورُ', transliteration: 'As-Sabur', meaning: 'The Patient One', benefit: 'Reciting 3000 times in hardship grants patience and victory.' }
  ];

  const filteredNames = namesOfAllah.filter(n =>
    n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
    n.meaning.toLowerCase().includes(search.toLowerCase()) ||
    n.arabic.includes(search) ||
    n.number.toString() === search.trim()
  );

  const handleCopy = (item) => {
    const textToCopy = `${item.number}. ${item.arabic} (${item.transliteration}) - ${item.meaning}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedName(item.number);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      {/* Header Banner */}
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>
          <i className="fas fa-star" style={{ color: 'var(--accent-gold)' }}></i> Asma ul Husna — 99 Names of Allah
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '720px', marginInline: 'auto' }}>
          "And to Allah belong the best names, so invoke Him by them." — (Surah Al-A'raf 7:180). Explore the 99 Beautiful Names of Allah with meanings and spiritual virtues.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: '540px', margin: '0 auto 2rem auto', position: 'relative' }}>
        <i className="fas fa-search" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name, meaning, or number (e.g. Ar-Rahman, Merciful, 1)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.8rem', borderRadius: '30px', border: '1.5px solid var(--accent-gold)' }}
        />
      </div>

      {/* Grid of 99 Names */}
      <div className="grid-3">
        {filteredNames.map((name) => (
          <div key={name.number} className="card" style={{ padding: '1.35rem', position: 'relative', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="surah-number-badge" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
                #{name.number}
              </span>
              <button
                onClick={() => handleCopy(name)}
                style={{ background: 'transparent', border: 'none', color: copiedName === name.number ? '#15803d' : '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
                title="Copy Name & Meaning"
              >
                <i className={`fas ${copiedName === name.number ? 'fa-check-circle' : 'fa-copy'}`}></i>
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
              <h2 className="arabic-font" style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: 700, margin: '0 0 0.2rem 0', direction: 'rtl' }}>
                {name.arabic}
              </h2>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold-dark)', margin: 0 }}>
                {name.transliteration}
              </h3>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginTop: '0.3rem' }}>
                {name.meaning}
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.75rem 0.9rem', borderRadius: '10px', borderLeft: '3px solid var(--accent-gold)', marginTop: 'auto' }}>
              <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: '1.45' }}>
                <strong style={{ color: '#0f172a' }}>Virtue:</strong> {name.benefit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
