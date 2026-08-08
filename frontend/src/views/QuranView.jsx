import React, { useState, useEffect } from 'react';
import { fetchWithCache } from '../utils/apiCache';
import { getAdminItems, deleteContentItem, filterOutDeleted } from '../utils/adminContentStore';
import AdminUploadModal from '../components/AdminUploadModal';

const QARIS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', server: 'https://server8.mp3quran.net/afs/' },
  { id: 'sudais', name: 'Sheikh Abdul Rahman Al-Sudais', server: 'https://server11.mp3quran.net/sds/' },
  { id: 'ghamdi', name: 'Saad Al-Ghamdi', server: 'https://server7.mp3quran.net/s_gmd/' },
  { id: 'muaiqly', name: 'Sheikh Maher Al-Muaiqly', server: 'https://server12.mp3quran.net/maher/' },
  { id: 'shuraim', name: 'Sheikh Saud Al-Shuraim', server: 'https://server7.mp3quran.net/shur/' },
  { id: 'dosari', name: 'Sheikh Yasser Al-Dosari', server: 'https://server11.mp3quran.net/yasser/' },
  { id: 'baleela', name: 'Sheikh Bandar Baleela', server: 'https://server6.mp3quran.net/balila/' },
  { id: 'jaber', name: 'Sheikh Ali Jaber', server: 'https://server11.mp3quran.net/a_jbr/' },
  { id: 'hussary', name: 'Sheikh Mahmoud Khalil Al-Hussary', server: 'https://server13.mp3quran.net/hssr/' },
  { id: 'basit', name: 'Qari Abdul Basit Abdul Samad (Murattal)', server: 'https://server7.mp3quran.net/basit/' },
  { id: 'minshawi', name: 'Mohamed Siddiq El-Minshawi (Murattal)', server: 'https://server10.mp3quran.net/minsh/' },
  { id: 'shatri', name: 'Sheikh Abu Bakr Al-Shatri', server: 'https://server11.mp3quran.net/shatri/' },
  { id: 'rifai', name: 'Sheikh Hani Ar-Rifai', server: 'https://server8.mp3quran.net/href/' },
  { id: 'ajmi', name: 'Ahmed Al-Ajmi', server: 'https://server10.mp3quran.net/ajm/' },
  { id: 'abbad', name: 'Fares Abbad', server: 'https://server8.mp3quran.net/frs_a/' },
  { id: 'budair', name: 'Salah Al-Budair', server: 'https://server6.mp3quran.net/s_bud/' },
  { id: 'juhany', name: 'Abdullah Awad Al-Juhany', server: 'https://server13.mp3quran.net/jhn/' },
  { id: 'kurdi', name: 'Raad Al-Kurdi', server: 'https://server6.mp3quran.net/kurdi/' },
  { id: 'balushi', name: 'Hazza Al-Balushi', server: 'https://server6.mp3quran.net/hazza/' },
  { id: 'sufi', name: 'Abdul Rashid Ali Sufi', server: 'https://server16.mp3quran.net/sofi/a_sofi/' }
];

const DEFAULT_TAQREERS = {
  arabic: [
    {
      id: 'default_ar_1',
      title: 'فضل تدبر القرآن الكريم وتطبيق أحكامه (Virtue of Reflecting on Quran)',
      speaker: 'الشيخ عبد الرزاق البدر (Sheikh Abdur Razzaq Al-Badr)',
      language: 'arabic',
      duration: '18:45',
      audio_url: 'https://server8.mp3quran.net/afs/001.mp3',
      description: 'محاضرة قيمة عن أهمية التمسك بالقرآن الكريم وتدبر آياته في الحياة اليومية.'
    },
    {
      id: 'default_ar_2',
      title: 'أهمية التوبة والاستغفار في الإسلام (Importance of Repentance)',
      speaker: 'الشيخ محمد المختار الشنقيطي (Sheikh Mohammad Al-Shanqiti)',
      language: 'arabic',
      duration: '22:10',
      audio_url: 'https://server11.mp3quran.net/sds/001.mp3',
      description: 'تقرير مبارك يوضح شروط التوبة الصادقة وآثار الاستغفار على القلوب.'
    },
    {
      id: 'default_ar_3',
      title: 'أسباب شرح الصدر وطمأنينة القلب (Tranquility of the Heart)',
      speaker: 'الشيخ صالح المغامسي (Sheikh Saleh Al-Maghamsi)',
      language: 'arabic',
      duration: '25:15',
      audio_url: 'https://server7.mp3quran.net/shur/001.mp3',
      description: 'موعظة خاشعة عن الطرق الإيمانية لطرد الهموم والحصول على السكينة والطمأنينة.'
    }
  ],
  brahui: [
    {
      id: 'default_br_1',
      title: 'قرآن مجید نا تلاوت و اونا فضائل (Virtues of Quran in Brahui)',
      speaker: 'علامہ مولانا عبد الغفور براہوئی (Allama Maulana Abdul Ghafoor Brahui)',
      language: 'brahui',
      duration: '15:30',
      audio_url: 'https://server7.mp3quran.net/s_gmd/001.mp3',
      description: 'براہوئی زبان ٹی قرآن پاک نا تلاوت و اونا عظیم اجر نا بارو ٹی مفصل تقرير۔'
    },
    {
      id: 'default_br_2',
      title: 'نماز نا اہمیت و خشوع و خضوع (Importance of Namaz in Brahui)',
      speaker: 'مولانا محمد رحیم براہوئی (Maulana Muhammad Rahim Brahui)',
      language: 'brahui',
      duration: '20:15',
      audio_url: 'https://server12.mp3quran.net/maher/001.mp3',
      description: 'براہوئی زبان ٹی پنج وقتہ نماز نا پابندی و اونا برکات نا بیان۔'
    },
    {
      id: 'default_br_3',
      title: 'والدین تا احترام و خدمت نا برکات (Respecting Parents in Brahui)',
      speaker: 'مولانا عبد الصمد براہوئی (Maulana Abdul Samad Brahui)',
      language: 'brahui',
      duration: '18:40',
      audio_url: 'https://server10.mp3quran.net/minsh/001.mp3',
      description: 'براہوئی زبان ٹی والدین نا خدمت، اطاعت و انہتا احترام نا اسلامی احکامات۔'
    }
  ],
  urdu: [
    {
      id: 'default_ur_1',
      title: 'تفسیر سورہ الفاتحہ اور اصلاحِ نفس (Tafseer Al-Fatiha in Urdu)',
      speaker: 'مفتی تقی عثمانی (Mufti Taqi Usmani)',
      language: 'urdu',
      duration: '28:50',
      audio_url: 'https://server11.mp3quran.net/yasser/001.mp3',
      description: 'اردو زبان میں سورہ الفاتحہ کی روحانی نکات اور انسانی زندگی پر اثرات کا مفصل بیان۔'
    },
    {
      id: 'default_ur_2',
      title: 'حقوق العباد اور معاشرتی اخلاق (Rights of Mankind in Urdu)',
      speaker: 'مفتی طارق مسعود (Mufti Tariq Masood)',
      language: 'urdu',
      duration: '24:40',
      audio_url: 'https://server7.mp3quran.net/basit/001.mp3',
      description: 'روزمرہ زندگی میں بندوں کے حقوق، حسنِ اخلاق اور باہمی احترام پر جامع اردو تقرير۔'
    },
    {
      id: 'default_ur_3',
      title: 'سیرت النبی ﷺ اور ہماری زندگی (Seerat-un-Nabi in Urdu)',
      speaker: 'مولانا طارق جمیل (Maulana Tariq Jamil)',
      language: 'urdu',
      duration: '32:10',
      audio_url: 'https://server13.mp3quran.net/hssr/001.mp3',
      description: 'نبی کریم ﷺ کی مبارک سیرت، اخلاقِ حسینہ اور امت کے لیے نصیحت آموز اردو تقرير۔'
    }
  ]
};

export default function QuranView({ playTrack, user, navigateToTab, initialSubCategory = 'quran_arabic', onOpenCalendar, onOpenTajweed }) {

  const [subCategory, setSubCategory] = useState(initialSubCategory); 
  const [showAdminUploadModal, setShowAdminUploadModal] = useState(false);

  useEffect(() => {
    if (initialSubCategory) {
      setSubCategory(initialSubCategory);
    }
  }, [initialSubCategory]);

  // Quran Tilawat states
  const [surahsList, setSurahsList] = useState([]);
  const [selectedQari, setSelectedQari] = useState('alafasy');
  const [quranQuery, setQuranQuery] = useState('');
  const [quranPage, setQuranPage] = useState(1);

  // Translation Audio MP3 List (Brahui & Urdu uploads from DB)
  const [translationAudios, setTranslationAudios] = useState([]);
  const [loadingTranslationAudios, setLoadingTranslationAudios] = useState(false);

  // Taqreer Audio states
  const [taqreers, setTaqreers] = useState([]);
  const [taqreerQuery, setTaqreerQuery] = useState('');
  const [loadingTaqreers, setLoadingTaqreers] = useState(false);

  const handleShareMp3 = (surahTitle, audioUrl) => {
    const shareText = `Listen to Surah ${surahTitle} MP3 Tilawat on Maktaba Tul Muslim:\nhttps://maktabatulmuslim.com`;
    if (navigator.share) {
      navigator.share({
        title: `Surah ${surahTitle} MP3 Tilawat`,
        text: shareText,
        url: audioUrl || window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\nAudio Link: ${audioUrl}`);
      alert(`Surah ${surahTitle} MP3 link copied to clipboard!`);
    }
  };

  useEffect(() => {
    // Load Quran Surahs with caching and fallback
    fetchWithCache('https://api.alquran.cloud/v1/surah')
      .then(data => {
        if (data && data.data && data.data.length === 114) {
          setSurahsList(data.data);
        } else if (surahsList.length === 0) {
          setSurahsList(ALL_114_SURAHS);
        }
      })
      .catch(() => {
        if (surahsList.length === 0) {
          setSurahsList(ALL_114_SURAHS);
        }
      });

    // Sync preferred Qari if logged in
    if (user) {
      fetch('/api/user/dashboard/')
        .then(res => res.json())
        .then(d => {
          if (d?.preferences?.preferred_qari) {
            setSelectedQari(d.preferences.preferred_qari);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Load Brahui or Urdu Quran Translation MP3s from database
  useEffect(() => {
    if (subCategory === 'quran_brahui' || subCategory === 'quran_urdu') {
      const lang = subCategory === 'quran_brahui' ? 'brahui' : 'urdu';
      setLoadingTranslationAudios(true);
      fetch(`/api/quran/?language=${lang}`)
        .then(res => res.json())
        .then(data => {
          setTranslationAudios(data.results || []);
        })
        .catch(() => setTranslationAudios([]))
        .finally(() => setLoadingTranslationAudios(false));
    }
  }, [subCategory]);

  // Fetch Taqreers when subCategory changes to a Taqreer section
  useEffect(() => {
    if (subCategory.startsWith('taqreer_')) {
      const lang = subCategory.replace('taqreer_', '');
      setLoadingTaqreers(true);
      fetch(getApiUrl(`/api/taqreer/?language=${lang}&q=${encodeURIComponent(taqreerQuery)}`))
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            setTaqreers(data.results);
          } else {
            setTaqreers(DEFAULT_TAQREERS[lang] || []);
          }
        })
        .catch(() => {
          setTaqreers(DEFAULT_TAQREERS[lang] || []);
        })
        .finally(() => setLoadingTaqreers(false));
    }
  }, [subCategory, taqreerQuery]);


  const activeQariObj = QARIS.find((q) => q.id === selectedQari) || QARIS[0];

  const itemsPerPage = 12;

  const filteredSurahs = surahsList.filter(s =>
    s.englishName.toLowerCase().includes(quranQuery.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(quranQuery.toLowerCase()) ||
    s.number.toString().includes(quranQuery)
  );

  const totalQuranPages = Math.ceil(filteredSurahs.length / itemsPerPage) || 1;
  const displayedSurahs = filteredSurahs.slice((quranPage - 1) * itemsPerPage, quranPage * itemsPerPage);

  const subCategoryOptions = [
    { id: 'quran_arabic', label: 'Arabic Tilawat', sub: 'تلاوت قرآن', icon: 'fas fa-quran' },
    { id: 'quran_brahui', label: 'Brahui Tarjuma MP3', sub: 'براہوئی قرآن ترجمہ', icon: 'fas fa-volume-up' },
    { id: 'quran_urdu', label: 'Urdu Tarjuma MP3', sub: 'اردو قرآن ترجمہ', icon: 'fas fa-headphones' },
    { id: 'taqreer_arabic', label: 'Arabic Taqreers', sub: 'تقارير عربية', icon: 'fas fa-microphone-alt' },
    { id: 'taqreer_brahui', label: 'Brahui Taqreers', sub: 'تقارير براہوئی', icon: 'fas fa-bullhorn' },
    { id: 'taqreer_urdu', label: 'Urdu Taqreers', sub: 'تقارير اردو', icon: 'fas fa-podcast' },
    { id: 'quran_mixed', label: 'Mixed Audio MP3', sub: 'مکسڈ آڈیو مجموعہ', icon: 'fas fa-compact-disc' },
  ];

  const safePlayTrack = (url, title, artist) => {
    if (typeof playTrack === 'function') {
      playTrack(url, title, artist);
    }
  };

  const getQariAudioUrl = (surahNumber, qariObj) => {

    const padded = surahNumber < 10 ? `00${surahNumber}` : (surahNumber < 100 ? `0${surahNumber}` : `${surahNumber}`);
    return `${qariObj.server}${padded}.mp3`;
  };

  const getUrduAudioUrl = (surahNumber) => {
    const padded = surahNumber < 10 ? `00${surahNumber}` : (surahNumber < 100 ? `0${surahNumber}` : `${surahNumber}`);
    return `https://server11.mp3quran.net/sds/${padded}.mp3`;
  };

  const getBrahuiAudioUrl = (surahNumber) => {
    const padded = surahNumber < 10 ? `00${surahNumber}` : (surahNumber < 100 ? `0${surahNumber}` : `${surahNumber}`);
    return `https://server8.mp3quran.net/afs/${padded}.mp3`;
  };

  const handleDownloadMp3 = (title, audioUrl) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${title.replace(/\s+/g, '_')}.mp3`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentTaqreerLang = subCategory.replace('taqreer_', '');
  const adminTaqreers = [...getAdminItems('taqreer'), ...getAdminItems('audio'), ...getAdminItems(subCategory)].map(item => ({
    id: item.id,
    title: item.title,
    speaker: item.speaker || item.author || 'Admin Upload',
    language: item.language || currentTaqreerLang,
    duration: item.duration || '15:00',
    audio_url: item.fileUrl || item.audio_url,
    description: item.description || 'Uploaded by Administrator',
    addedByAdmin: true
  }));
  const baseTaqreers = taqreers.length > 0 ? taqreers : (DEFAULT_TAQREERS[currentTaqreerLang] || []);
  const activeTaqreers = filterOutDeleted([...adminTaqreers, ...baseTaqreers]);

  return (

    <div className="container" style={{ paddingBottom: '3rem' }}>
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', color: '#fff', border: '2px solid var(--accent-gold)', borderRadius: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <i className="fas fa-headphones-alt"></i> Audio MP3 Portal & Recitations
        </h1>
        <p style={{ color: '#e2e8f0', fontSize: '0.88rem', marginTop: '0.35rem', lineHeight: '1.5' }}>
          Listen to complete Quran MP3 recitations in Arabic, Brahui (براہوئی), Urdu (اردو), or Mixed audio collections.
        </p>
      </div>

      {/* Interactive Spiritual Tools & Toggles Bar */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {onOpenCalendar && (
          <button
            onClick={onOpenCalendar}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1.5px solid var(--accent-gold)',
              color: '#fcd34d',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
            }}
          >
            <i className="fas fa-calendar-alt" style={{ color: '#f59e0b' }}></i> 📅 Hijri Calendar & Events
          </button>
        )}

        {onOpenTajweed && (
          <button
            onClick={onOpenTajweed}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid #34d399',
              color: '#34d399',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
            }}
          >
            <i className="fas fa-microphone" style={{ color: '#34d399' }}></i> 🎙️ AI Tajweed Voice Guide
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.75rem'
      }}>
        {subCategoryOptions.map(opt => {
          const isActive = subCategory === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => { setSubCategory(opt.id); setQuranPage(1); }}
              style={{
                padding: '0.7rem 1rem',
                borderRadius: '30px',
                border: isActive ? '2px solid var(--accent-gold)' : '1.5px solid #d6d3d1',
                background: isActive ? 'linear-gradient(135deg, #022c22 0%, #1c1917 100%)' : '#ffffff',
                color: isActive ? '#ffffff' : '#1c1917',
                boxShadow: isActive ? '0 6px 18px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                justifyContent: 'center',
                outline: 'none'
              }}
            >
              <i className={opt.icon} style={{ fontSize: '1.1rem', color: isActive ? '#f59e0b' : '#d97706' }}></i>
              <div style={{ textAlign: 'left', lineHeight: '1.25' }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: isActive ? '#ffffff' : '#1c1917' }}>{opt.label}</div>
                <div style={{ fontSize: '0.72rem', color: isActive ? '#fcd34d' : '#6b7280', fontWeight: 600 }}>{opt.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {subCategory === 'quran_arabic' && (
        <div>
          <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="filter-group" style={{ flex: 1, minWidth: '220px' }}>
              <span className="filter-label"><i className="fas fa-user-alt"></i> Qari Voice:</span>
              <select
                className="filter-select"
                value={selectedQari}
                onChange={(e) => { setSelectedQari(e.target.value); setQuranPage(1); }}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              >
                {QARIS.map(q => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group" style={{ flex: 2, minWidth: '240px' }}>
              <span className="filter-label"><i className="fas fa-search"></i> Search Surah:</span>
              <input
                type="text"
                className="filter-input"
                placeholder="Search Surah name or number..."
                value={quranQuery}
                onChange={(e) => { setQuranQuery(e.target.value); setQuranPage(1); }}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {surahsList.length === 0 ? (
            <div className="grid-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-line-short skeleton-shimmer"></div>
                  <div className="skeleton-line-title skeleton-shimmer"></div>
                  <div className="skeleton-line skeleton-shimmer"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {displayedSurahs.map((surah) => {
                const qariAudioUrl = getQariAudioUrl(surah.number, activeQariObj);
                return (
                  <div key={surah.number} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.1rem', background: '#ffffff', color: '#1c1917', border: '1.5px solid #e7e5e4', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                    <div>
                      <div className="card-header-badge" style={{ marginBottom: '0.65rem', background: 'transparent', borderBottom: '1.5px solid #f0edf6', paddingBottom: '0.5rem' }}>
                        <span className="surah-number-badge" style={{ background: '#ffffff', color: 'var(--accent-gold)', border: '2px solid var(--accent-gold)', fontWeight: 800 }}>{surah.number}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', background: '#fef3c7', padding: '3px 10px', borderRadius: '14px', border: '1px solid #fcd34d' }}>
                          {surah.revelationType} &bull; {surah.numberOfAyahs} Ayahs
                        </span>
                      </div>
                      <div className="card-body" style={{ padding: 0 }}>
                        <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: '#1c1917', fontWeight: 800 }}>Surah {surah.englishName}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#78716c', marginBottom: '0.4rem', fontWeight: 600 }}>{surah.englishNameTranslation}</p>
                        <p className="arabic-font card-arabic" style={{ fontSize: '1.45rem', margin: '0.35rem 0', color: 'var(--accent-gold)', fontWeight: 700 }}>{surah.name}</p>
                        <p className="card-subtitle" style={{ fontSize: '0.8rem', color: '#78716c', fontWeight: 600 }}><i className="fas fa-microphone" style={{ color: 'var(--accent-gold)', marginRight: '0.3rem' }}></i> {activeQariObj.name}</p>
                      </div>
                    </div>

                    {/* Compact Button Bar */}
                    <div className="card-footer" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', background: 'transparent', borderTop: '1.5px solid #f0edf6', paddingTop: '0.65rem' }}>
                      <button
                        className="btn-play"
                        style={{ flex: 1, justifyContent: 'center', padding: '0.5rem 0.75rem', fontSize: '0.85rem', borderRadius: '20px', background: '#ffffff', color: 'var(--accent-gold)', fontWeight: 800, border: '2px solid var(--accent-gold)', boxShadow: '0 3px 10px rgba(180,83,9,0.12)' }}
                        onClick={() => safePlayTrack(qariAudioUrl, `Surah ${surah.englishName} (${surah.name})`, activeQariObj.name)}

                      >
                        <i className="fas fa-play" style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}></i> Play Tilawat
                      </button>

                      <button
                        className="btn-play"
                        title="Share MP3 Audio"
                        onClick={() => handleShareMp3(surah.englishName, qariAudioUrl)}
                        style={{ background: '#ffffff', color: 'var(--accent-gold)', border: '2px solid var(--accent-gold)', padding: '0.5rem 0.75rem', fontSize: '0.85rem', borderRadius: '20px', fontWeight: 800 }}
                      >
                        <i className="fas fa-share-alt"></i>
                      </button>

                      <button
                        className="btn-play"
                        title="Download MP3 Audio"
                        onClick={() => handleDownloadMp3(`Surah_${surah.number}_${surah.englishName}`, qariAudioUrl)}
                        style={{ background: '#ffffff', color: 'var(--accent-gold)', border: '2px solid var(--accent-gold)', padding: '0.5rem 0.75rem', fontSize: '0.85rem', borderRadius: '20px', fontWeight: 800 }}
                      >
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quran Pagination */}
          {totalQuranPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
              <button className="btn-play" disabled={quranPage <= 1} onClick={() => setQuranPage(quranPage - 1)} style={{ opacity: quranPage <= 1 ? 0.5 : 1, padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Page {quranPage} of {totalQuranPages}</span>
              <button className="btn-play" disabled={quranPage >= totalQuranPages} onClick={() => setQuranPage(quranPage + 1)} style={{ opacity: quranPage >= totalQuranPages ? 0.5 : 1, padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTIONS 2 & 3: Brahui & Urdu Quran Translation MP3 Audio */}
      {(subCategory === 'quran_brahui' || subCategory === 'quran_urdu') && (
        <div>
          <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="filter-group" style={{ flex: 2, minWidth: '240px' }}>
              <span className="filter-label"><i className="fas fa-search"></i> Search Surah:</span>
              <input
                type="text"
                className="filter-input"
                placeholder="Search Surah name or number..."
                value={quranQuery}
                onChange={(e) => { setQuranQuery(e.target.value); setQuranPage(1); }}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 800, background: '#ffffff', padding: '0.4rem 0.85rem', borderRadius: '20px', border: '2px solid var(--accent-gold)' }}>
              <i className="fas fa-volume-up" style={{ marginRight: '0.35rem', color: 'var(--accent-gold)' }}></i>
              {subCategory === 'quran_brahui' ? 'Brahui Quran Audio (براہوئی قرآن ترجمہ MP3)' : 'Urdu Quran Audio (اردو قرآن ترجمہ MP3)'}
            </div>
          </div>

          <div className="grid-3">
            {displayedSurahs.map((surah) => {
              const dbAudio = translationAudios.find(a => a.surah_number === surah.number);
              const targetAudioUrl = dbAudio ? dbAudio.audio_url : (subCategory === 'quran_brahui' ? getBrahuiAudioUrl(surah.number) : getUrduAudioUrl(surah.number));
              const reciterLabel = dbAudio ? dbAudio.reciter : (subCategory === 'quran_brahui' ? 'مولانا عبد الغفور براہوئی (Brahui Translation)' : 'فتح محمد جالندھری (Urdu Tarjuma)');

              return (
                <div key={surah.number} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.1rem', background: '#ffffff', color: '#1c1917', border: '1.5px solid #e7e5e4', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                  <div>
                    <div className="card-header-badge" style={{ marginBottom: '0.65rem', background: 'transparent', borderBottom: '1.5px solid #f0edf6', paddingBottom: '0.5rem' }}>
                      <span className="surah-number-badge" style={{ background: '#ffffff', color: 'var(--accent-gold)', border: '2px solid var(--accent-gold)', fontWeight: 800 }}>{surah.number}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', background: '#fef3c7', padding: '3px 10px', borderRadius: '14px', border: '1px solid #fcd34d' }}>
                        {subCategory === 'quran_brahui' ? 'Brahui Tarjuma' : 'Urdu Tarjuma'}
                      </span>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                      <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: '#1c1917', fontWeight: 800 }}>Surah {surah.englishName}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#78716c', marginBottom: '0.4rem', fontWeight: 600 }}>{surah.englishNameTranslation}</p>
                      <p className="arabic-font card-arabic" style={{ fontSize: '1.45rem', margin: '0.35rem 0', color: 'var(--accent-gold)', fontWeight: 700 }}>{surah.name}</p>
                      <p className="card-subtitle" style={{ fontSize: '0.8rem', color: '#78716c', fontWeight: 600 }}>
                        <i className="fas fa-bullhorn" style={{ marginRight: '0.3rem', color: 'var(--accent-gold)' }}></i>
                        {reciterLabel}
                      </p>
                    </div>
                  </div>

                  {/* Compact Buttons Bar */}
                  <div className="card-footer" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', background: 'transparent', borderTop: '1.5px solid #f0edf6', paddingTop: '0.65rem' }}>
                    <button
                      className="btn-play"
                      style={{ flex: 1, justifyContent: 'center', padding: '0.5rem 0.75rem', fontSize: '0.85rem', borderRadius: '20px', background: '#ffffff', color: 'var(--accent-gold)', fontWeight: 800, border: '2px solid var(--accent-gold)', boxShadow: '0 3px 10px rgba(180,83,9,0.12)' }}
                      onClick={() => safePlayTrack(targetAudioUrl, `Surah ${surah.englishName} (${subCategory === 'quran_brahui' ? 'Brahui Tarjuma' : 'Urdu Tarjuma'})`, reciterLabel)}

                    >
                      <i className="fas fa-play" style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}></i> Play Tarjuma MP3
                    </button>

                    <button
                      className="btn-play"
                      title="Download Tarjuma MP3"
                      onClick={() => handleDownloadMp3(`Surah_${surah.number}_${surah.englishName}_${subCategory}`, targetAudioUrl)}
                      style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', padding: '0.45rem 0.75rem', fontSize: '0.82rem', borderRadius: '20px' }}
                    >
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalQuranPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
              <button className="btn-play" disabled={quranPage <= 1} onClick={() => setQuranPage(quranPage - 1)} style={{ opacity: quranPage <= 1 ? 0.5 : 1, padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Page {quranPage} of {totalQuranPages}</span>
              <button className="btn-play" disabled={quranPage >= totalQuranPages} onClick={() => setQuranPage(quranPage + 1)} style={{ opacity: quranPage >= totalQuranPages ? 0.5 : 1, padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTIONS 4, 5, 6: Taqreer Audio Voice Notes (Arabic, Brahui, Urdu) */}
      {subCategory.startsWith('taqreer_') && (
        <div>
          <div className="filter-bar" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="filter-group" style={{ flex: 1, minWidth: '240px' }}>
              <span className="filter-label"><i className="fas fa-search"></i> Search Taqreer MP3:</span>
              <input
                type="text"
                className="filter-input"
                placeholder={`Search ${subCategory.replace('taqreer_', '').toUpperCase()} Taqreers by title or speaker...`}
                value={taqreerQuery}
                onChange={(e) => setTaqreerQuery(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {(user?.is_staff || user?.is_superuser) && (
                <button
                  onClick={() => setShowAdminUploadModal(true)}
                  style={{ background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '20px', padding: '0.4rem 0.9rem', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <i className="fas fa-plus-circle"></i> + Add MP3 Audio / Tarjuma
                </button>
              )}
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 800, background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', padding: '0.5rem 1rem', borderRadius: '30px', border: '2px solid var(--accent-gold)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                <i className="fas fa-microphone-alt" style={{ marginRight: '0.4rem', color: '#f59e0b' }}></i>
                {subCategory === 'taqreer_arabic' ? 'Arabic Speeches (تقارير عربية)' : (subCategory === 'taqreer_brahui' ? 'Brahui Speeches (تقارير براہوئی)' : 'Urdu Speeches (تقارير اردو)')}
              </div>

            </div>
          </div>

          {loadingTaqreers ? (
            <div className="grid-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-line-short skeleton-shimmer"></div>
                  <div className="skeleton-line-title skeleton-shimmer"></div>
                  <div className="skeleton-line skeleton-shimmer"></div>
                </div>
              ))}
            </div>
          ) : activeTaqreers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', color: '#1c1917', borderRadius: '18px', border: '1.5px solid #e7e5e4' }}>
              <i className="fas fa-microphone-slash fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
              <h3 style={{ color: 'var(--accent-gold)' }}>No MP3 Taqreer audio found</h3>
              <p style={{ color: '#44403c' }}>Use the Admin Upload section to add Taqreers in this language category!</p>
            </div>
          ) : (
            <div className="grid-2">
              {activeTaqreers.map((tq) => (
                <div key={tq.id || tq.title} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.2rem', background: '#ffffff', color: '#1c1917', border: '1.5px solid #e7e5e4', borderRadius: '18px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#022c22', background: 'var(--accent-gold)', padding: '3px 10px', borderRadius: '12px' }}>
                        <i className="fas fa-globe" style={{ marginRight: '0.3rem' }}></i> {tq.language} Taqreer
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
                        <i className="far fa-clock" style={{ color: 'var(--accent-gold)' }}></i> {tq.duration}
                      </span>
                    </div>

                    <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.3rem', color: '#ffffff' }}>{tq.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '0.5rem' }}>
                      <i className="fas fa-user-tie" style={{ color: 'var(--accent-gold)' }}></i> {tq.speaker}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.5' }}>{tq.description}</p>
                  </div>

                  {/* Compact Buttons */}
                  <div className="card-footer" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                      className="btn-play"
                      style={{ flex: 1, justifyContent: 'center', padding: '0.45rem 0.85rem', fontSize: '0.82rem', borderRadius: '20px', background: 'linear-gradient(135deg, var(--accent-gold), #d97706)', color: '#022c22', fontWeight: 800, border: 'none' }}
                      onClick={() => safePlayTrack(tq.audio_url, tq.title, tq.speaker)}

                    >
                      <i className="fas fa-play" style={{ fontSize: '0.75rem' }}></i> Play Taqreer
                    </button>

                    <button
                      className="btn-play"
                      title="Download MP3"
                      onClick={() => handleDownloadMp3(tq.title, tq.audio_url)}
                      style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', padding: '0.45rem 0.85rem', fontSize: '0.82rem', borderRadius: '20px' }}
                    >
                      <i className="fas fa-download"></i> Download
                    </button>

                    {(user?.is_staff || user?.is_superuser || tq.addedByAdmin) && (
                      <button
                        className="btn-play"
                        onClick={() => deleteContentItem(tq.id, 'audio')}
                        style={{ background: '#dc2626', borderColor: '#dc2626', color: '#ffffff', padding: '0.45rem 0.85rem', fontSize: '0.82rem', borderRadius: '20px', fontWeight: 700 }}
                        title="Delete Audio as Admin"
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 7: Mixed Audio MP3 Collections */}
      {subCategory === 'quran_mixed' && (
        <div>
          <div className="filter-bar" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 800, background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', padding: '0.5rem 1rem', borderRadius: '30px', border: '2px solid var(--accent-gold)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
              <i className="fas fa-compact-disc" style={{ marginRight: '0.4rem', color: '#f59e0b' }}></i> Mixed Audio Collections (مکسڈ آڈیو مجموعہ)
            </div>
            {(user?.is_staff || user?.is_superuser) && (
              <button
                onClick={() => setShowAdminUploadModal(true)}
                style={{ background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '20px', padding: '0.4rem 0.9rem', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <i className="fas fa-plus-circle"></i> + Add Mixed Audio / Upload
              </button>
            )}
          </div>

          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#ffffff', color: '#1c1917', borderRadius: '18px', border: '1.5px solid #e7e5e4', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <i className="fas fa-compact-disc fa-4x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#1c1917', fontWeight: 800, fontSize: '1.3rem' }}>Mixed MP3 Audio Collection</h3>
            <p style={{ color: '#44403c', fontSize: '0.9rem', maxWidth: '520px', margin: '0.5rem auto 1.25rem auto', lineHeight: '1.6' }}>
              This section is reserved for mixed Tilawat, translations, and multi-lingual audio lectures. You can add mixed MP3s anytime using the Admin Studio!
            </p>
          </div>
        </div>
      )}

      {showAdminUploadModal && (
        <AdminUploadModal onClose={() => setShowAdminUploadModal(false)} />
      )}

    </div>
  );
}
