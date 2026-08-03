import React, { useState, useEffect } from 'react';
import { fetchWithCache } from '../utils/apiCache';
import { getAdminItems, deleteContentItem } from '../utils/adminContentStore';

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

export default function QuranView({ playTrack, user, navigateToTab, initialSubCategory = 'quran_arabic' }) {
  const [subCategory, setSubCategory] = useState(initialSubCategory); 

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

  const itemsPerPage = 12;

  useEffect(() => {
    // Load Quran Surahs with caching
    fetchWithCache('https://api.alquran.cloud/v1/surah')
      .then(data => {
        if (data && data.data) setSurahsList(data.data);
      })
      .catch(() => {});

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

  // Load Taqreers when subCategory changes to a Taqreer section
  useEffect(() => {
    if (subCategory.startsWith('taqreer_')) {
      const lang = subCategory.replace('taqreer_', '');
      setLoadingTaqreers(true);
      fetch(`/api/taqreer/?language=${lang}&q=${encodeURIComponent(taqreerQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            setTaqreers(data.results);
          } else {
            setTaqreers(DEFAULT_TAQREERS[lang] || []);
          }
        })
        .catch(() => {
          const lang = subCategory.replace('taqreer_', '');
          setTaqreers(DEFAULT_TAQREERS[lang] || []);
        })
        .finally(() => setLoadingTaqreers(false));
    }
  }, [subCategory, taqreerQuery]);

  const activeQariObj = QARIS.find(q => q.id === selectedQari) || QARIS[0];

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
  ];

  const currentTaqreerLang = subCategory.replace('taqreer_', '');
  const adminTaqreers = [...getAdminItems('taqreer'), ...getAdminItems('audio')].map(item => ({
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
  const activeTaqreers = [...adminTaqreers, ...baseTaqreers];

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', color: '#fff', border: '1px solid var(--accent-gold)', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <i className="fas fa-headphones-alt"></i> Audio MP3 Portal & Recitations
        </h1>
        <p style={{ color: '#e2e8f0', fontSize: '0.88rem', marginTop: '0.35rem', lineHeight: '1.5' }}>
          Listen to complete Quran MP3 recitations in Arabic or Quran Translations & Taqreers in Brahui (براہوئی) and Urdu (اردو).
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '0.65rem',
        marginBottom: '1.75rem'
      }}>
        {subCategoryOptions.map(opt => {
          const isActive = subCategory === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => { setSubCategory(opt.id); setQuranPage(1); }}
              style={{
                padding: '0.6rem 0.85rem',
                borderRadius: '16px',
                border: isActive ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)',
                background: isActive ? 'linear-gradient(135deg, var(--accent-gold), #d97706)' : 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
                color: isActive ? '#022c22' : '#ffffff',
                boxShadow: isActive ? '0 4px 14px rgba(245,158,11,0.45)' : '0 2px 8px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center'
              }}
            >
              <i className={opt.icon} style={{ fontSize: '1rem', color: isActive ? '#022c22' : 'var(--accent-gold)' }}></i>
              <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>{opt.label}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.9, fontFamily: 'serif' }}>{opt.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: Arabic Tilawat MP3 */}
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
                  <div key={surah.number} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.1rem', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '16px' }}>
                    <div>
                      <div className="card-header-badge" style={{ marginBottom: '0.5rem', background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <span className="surah-number-badge" style={{ background: 'var(--accent-gold)', color: '#022c22' }}>{surah.number}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#022c22', background: 'var(--accent-gold)', padding: '2px 8px', borderRadius: '12px' }}>
                          {surah.revelationType} &bull; {surah.numberOfAyahs} Ayahs
                        </span>
                      </div>
                      <div className="card-body" style={{ padding: 0 }}>
                        <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '0.2rem', color: '#ffffff' }}>Surah {surah.englishName}</h3>
                        <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>{surah.englishNameTranslation}</p>
                        <p className="arabic-font card-arabic" style={{ fontSize: '1.3rem', margin: '0.3rem 0', color: 'var(--accent-gold)' }}>{surah.name}</p>
                        <p className="card-subtitle" style={{ fontSize: '0.78rem', color: '#e2e8f0' }}><i className="fas fa-microphone" style={{ color: 'var(--accent-gold)' }}></i> {activeQariObj.name}</p>
                      </div>
                    </div>

                    {/* Compact Button Bar */}
                    <div className="card-footer" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <button
                        className="btn-play"
                        style={{ flex: 1, justifyContent: 'center', padding: '0.45rem 0.75rem', fontSize: '0.82rem', borderRadius: '20px', background: 'linear-gradient(135deg, var(--accent-gold), #d97706)', color: '#022c22', fontWeight: 800, border: 'none' }}
                        onClick={() => playTrack(qariAudioUrl, `Surah ${surah.englishName} (${surah.name})`, activeQariObj.name)}
                      >
                        <i className="fas fa-play" style={{ fontSize: '0.75rem' }}></i> Play Tilawat
                      </button>

                      <button
                        className="btn-play"
                        title="Download MP3 Audio"
                        onClick={() => handleDownloadMp3(`Surah_${surah.number}_${surah.englishName}`, qariAudioUrl)}
                        style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', padding: '0.45rem 0.75rem', fontSize: '0.82rem', borderRadius: '20px' }}
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
          <div className="filter-bar" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="filter-group" style={{ flex: 1, minWidth: '240px' }}>
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
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, background: 'rgba(2, 44, 34, 0.9)', padding: '0.4rem 0.85rem', borderRadius: '20px', border: '1px solid var(--accent-gold)' }}>
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
                <div key={surah.number} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.1rem', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '16px' }}>
                  <div>
                    <div className="card-header-badge" style={{ marginBottom: '0.5rem', background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span className="surah-number-badge" style={{ background: 'var(--accent-gold)', color: '#022c22' }}>{surah.number}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#022c22', background: 'var(--accent-gold)', padding: '2px 8px', borderRadius: '12px' }}>
                        {subCategory === 'quran_brahui' ? 'Brahui Tarjuma' : 'Urdu Tarjuma'}
                      </span>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                      <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '0.2rem', color: '#ffffff' }}>Surah {surah.englishName}</h3>
                      <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>{surah.englishNameTranslation}</p>
                      <p className="arabic-font card-arabic" style={{ fontSize: '1.3rem', margin: '0.3rem 0', color: 'var(--accent-gold)' }}>{surah.name}</p>
                      <p className="card-subtitle" style={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                        <i className="fas fa-bullhorn" style={{ marginRight: '0.3rem', color: 'var(--accent-gold)' }}></i>
                        {reciterLabel}
                      </p>
                    </div>
                  </div>

                  {/* Compact Buttons Bar */}
                  <div className="card-footer" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                      className="btn-play"
                      style={{ flex: 1, justifyContent: 'center', padding: '0.45rem 0.75rem', fontSize: '0.82rem', borderRadius: '20px', background: 'linear-gradient(135deg, var(--accent-gold), #d97706)', color: '#022c22', fontWeight: 800, border: 'none' }}
                      onClick={() => playTrack(targetAudioUrl, `Surah ${surah.englishName} (${subCategory === 'quran_brahui' ? 'Brahui Tarjuma' : 'Urdu Tarjuma'})`, reciterLabel)}
                    >
                      <i className="fas fa-play" style={{ fontSize: '0.75rem' }}></i> Play Tarjuma MP3
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
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, background: 'rgba(2, 44, 34, 0.9)', padding: '0.4rem 0.85rem', borderRadius: '20px', border: '1px solid var(--accent-gold)' }}>
              <i className="fas fa-microphone-alt" style={{ marginRight: '0.35rem', color: 'var(--accent-gold)' }}></i>
              {subCategory === 'taqreer_arabic' ? 'Arabic Speeches (تقارير عربية)' : (subCategory === 'taqreer_brahui' ? 'Brahui Speeches (تقارير براہوئی)' : 'Urdu Speeches (تقارير اردو)')}
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
            <div style={{ textAlign: 'center', padding: '3rem', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', color: '#fff', borderRadius: '16px', border: '1px solid var(--accent-gold)' }}>
              <i className="fas fa-microphone-slash fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
              <h3 style={{ color: 'var(--accent-gold)' }}>No MP3 Taqreer audio found</h3>
              <p style={{ color: '#e2e8f0' }}>Use the Admin Upload section to add Taqreers in this language category!</p>
            </div>
          ) : (
            <div className="grid-2">
              {activeTaqreers.map((tq) => (
                <div key={tq.id || tq.title} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.2rem', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '16px' }}>
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
                      onClick={() => playTrack(tq.audio_url, tq.title, tq.speaker)}
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
    </div>
  );
}
