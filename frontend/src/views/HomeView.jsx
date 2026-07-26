import React, { useEffect, useState } from 'react';
import PrayerTimesWidget from '../components/PrayerTimesWidget';

const DEFAULT_AUDIOS = [
  { id: 1, surah_number: 1, surah_name_arabic: "الفاتحة", surah_name_english: "Al-Fatiha", reciter: "Mishary Rashid Alafasy", audio_url: "https://server8.mp3quran.net/afs/001.mp3", duration: "00:45", revelation_place: "Makki" },
  { id: 2, surah_number: 18, surah_name_arabic: "الكهف", surah_name_english: "Al-Kahf", reciter: "Mishary Rashid Alafasy", audio_url: "https://server8.mp3quran.net/afs/018.mp3", duration: "25:30", revelation_place: "Makki" },
  { id: 3, surah_number: 36, surah_name_arabic: "يس", surah_name_english: "Ya-Sin", reciter: "Saad Al-Ghamdi", audio_url: "https://server7.mp3quran.net/s_gmd/036.mp3", duration: "13:45", revelation_place: "Makki" },
  { id: 4, surah_number: 55, surah_name_arabic: "الرحمن", surah_name_english: "Ar-Rahman", reciter: "Abdul Rahman Al-Sudais", audio_url: "https://server11.mp3quran.net/sds/055.mp3", duration: "09:50", revelation_place: "Madani" }
];

const DEFAULT_BOOKS = [
  { id: 1, title: "Tafseer Ibn Kathir (English)", author: "Hafiz Ibn Kathir", cover_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80", document_url: "https://www.quranfull.com", pages_count: 650, language: "English" },
  { id: 2, title: "Riyad As-Salihin (Meadows of the Righteous)", author: "Imam An-Nawawi", cover_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80", document_url: "https://www.quranfull.com", pages_count: 420, language: "Arabic / English" },
  { id: 3, title: "Stories of the Prophets", author: "Ibn Kathir", cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80", document_url: "https://www.quranfull.com", pages_count: 380, language: "English" }
];

const DEFAULT_VIDEOS = [
  { id: 1, title: "The Beauty of Quran Recitation & Reflection", speaker: "Mufti Menk", thumbnail_url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=500&q=80", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 2, title: "Understanding Surah Al-Kahf & Friday Virtues", speaker: "Nouman Ali Khan", thumbnail_url: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=500&q=80", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
];

const DEFAULT_HADITHS = [
  { id: 1, book_name: "Sahih Bukhari", hadith_number: 1, grade: "Sahih", arabic_text: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى", translation: "Actions are judged by intentions, and every person will get what they intended." },
  { id: 2, book_name: "Sahih Muslim", hadith_number: 223, grade: "Sahih", arabic_text: "الطَّهُورُ شَطْرُ الإِيمَانِ", translation: "Purity is half of faith." }
];

const DAILY_VERSES_COLLECTION = [
  {
    surahName: "Ar-Ra'd (13:28)",
    arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation_en: "Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah do hearts find peace.",
    translation_ur: "جو لوگ ایمان لائے اور ان کے دل اللہ کے ذکر سے اطمینان پاتے ہیں، سن لو! اللہ کے ذکر ہی سے دلوں کو اطمینان ملتا ہے۔",
    audio_url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3"
  },
  {
    surahName: "Ash-Sharh (94:5)",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation_en: "For indeed, with hardship will be ease.",
    translation_ur: "پس بلاشبہ ہر مشکل کے ساتھ آسانیاں ہیں!",
    audio_url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6095.mp3"
  },
  {
    surahName: "Al-Baqarah (2:286)",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ",
    translation_en: "Allah does not charge a soul except with that within its capacity. It will have [the consequence of] what good it has gained.",
    translation_ur: "اللہ کسی بھی انسان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا، جو نیکی اس نے کمائی اس کا فائدہ اسی کو ہے۔",
    audio_url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/293.mp3"
  },
  {
    surahName: "Ali 'Imran (3:139)",
    arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translation_en: "So do not weaken and do not grieve, and you will be superior if you are true believers.",
    translation_ur: "اور نہ تم کمزور پڑو اور نہ غمگین ہو، تم ہی غالب رہو گے اگر تم سچے مومن ہو۔",
    audio_url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/432.mp3"
  },
  {
    surahName: "Al-Anfal (8:30)",
    arabic: "وَإِذْ يَمْكُرُ بِكَ الَّذِينَ كَفَرُوا لِيُثْبِتُوكَ أَوْ يَقْتُلُوكَ أَوْ يُخْرِجُوكَ ۚ وَيَمْكُرُونَ وَيَمْكُرُ اللَّهُ ۖ وَاللَّهُ خَيْرُ الْمَاكِرِينَ",
    translation_en: "And [remember, O Muhammad], when those who disbelieved plotted against you to restrain you or kill you or evict you. But they plan, and Allah plans. And Allah is the best of planners.",
    translation_ur: "اور (یاد کریں) جب کافر لوگ آپ کے خلاف تدبیریں کر رہے تھے کہ آپ کو قید کر دیں یا قتل کر دیں یا وطن سے نکال دیں، وہ تدبیریں کر رہے تھے اور اللہ بھی تدبیر فرما رہا تھا، اور اللہ سب سے بہترین تدبیر فرمانے والا ہے۔",
    audio_url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1190.mp3"
  },
  {
    surahName: "Taha (20:114)",
    arabic: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ ۗ وَلَا تَعْجَلْ بِالْقُرْآنِ مِن قَبْلِ أَن يُقْضَىٰ إِلَيْكَ وَحْيُهُ ۖ وَقُل رَّبِّ زِدْنِي عِلْمًا",
    translation_en: "So high [above all] is Allah, the Sovereign, the Truth. And do not hasten with the Quran before its revelation is completed to you, and say: My Lord, increase me in knowledge.",
    translation_ur: "پس اللہ سچا بادشاہ بلند و برتر ہے، اور آپ قرآن پڑھنے میں جلدی نہ کریں اور دعا کریں: اے میرے پروردگار! میرے علم میں اضافہ فرما۔",
    audio_url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2462.mp3"
  },
  {
    surahName: "Al-Anbiya (21:87)",
    arabic: "وَذَا النُّونِ إِذ ذَّهَبَ مُغَاضِبًا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِي الظُّلُمَاتِ أَن لَّا إِلَـٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translation_en: "And [remember] Dhul-Nun (Yunis), when he went off in anger and thought that We would not decree [any hardship] upon him. And he called out within the darknesses: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.'",
    translation_ur: "اور حضرت یونس علیہ السلام جب غصے میں چلے گئے اور انہوں نے اندھیروں میں پکارا: تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی قصوروار تھا۔",
    audio_url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2570.mp3"
  }
];

export default function HomeView({ navigateToTab, setActiveTab, playTrack, openVideoModal, user, openAuthModal }) {
  const handleNav = (tab) => {
    if (typeof navigateToTab === 'function') navigateToTab(tab);
    else if (typeof setActiveTab === 'function') setActiveTab(tab);
  };

  const [stats, setStats] = useState({ total_audios: 7, total_videos: 3, total_books: 3, total_hadiths: 3 });
  const [audios, setAudios] = useState(DEFAULT_AUDIOS);
  const [videos, setVideos] = useState(DEFAULT_VIDEOS);
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [hadiths, setHadiths] = useState(DEFAULT_HADITHS);
  const [lastRead, setLastRead] = useState(null);

  // Automatic Daily 12 AM Midnight Section Rotator Algorithm
  const getDailyRotatedSlice = (arr, count = 4) => {
    if (!arr || arr.length === 0) return [];
    if (arr.length <= count) return arr;
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const offset = (dayOfYear * count) % arr.length;
    const rotated = [...arr.slice(offset), ...arr.slice(0, offset)];
    return rotated.slice(0, count);
  };

  useEffect(() => {
    // Check local storage for last read position
    const saved = localStorage.getItem('quranLastRead');
    if (saved) {
      try {
        setLastRead(JSON.parse(saved));
      } catch (e) {}
    }

    fetch('/api/stats/')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});

    fetch('/api/quran/?featured=1')
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) setAudios(data.results);
      })
      .catch(() => {});

    fetch('/api/videos/')
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) setVideos(data.results);
      })
      .catch(() => {});

    fetch('/api/books/')
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) setBooks(data.results);
      })
      .catch(() => {});

    fetch('/api/hadith/')
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) setHadiths(data.results);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <h2 className="arabic-font hero-arabic-title">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</h2>
        <h1 className="hero-main-title">Discover, Listen & Learn The Holy Quran</h1>
        <p className="hero-subtitle">Modern Full-Stack Application for Quran Audio Recitations, Interactive Reading, Tafseer Studies, PDF Books & Authentic Hadith Collections.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="/read"
            className="btn-play"
            style={{ padding: '0.75rem 1.8rem', fontSize: '1rem', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              handleNav('read');
            }}
          >
            <i className="fas fa-book-open"></i> Start Reading Quran
          </a>
          <a
            href="/quran"
            className="btn-play"
            style={{
              padding: '0.75rem 1.8rem',
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              textDecoration: 'none'
            }}
            onClick={(e) => {
              e.preventDefault();
              handleNav('quran');
            }}
          >
            <i className="fas fa-headphones"></i> Listen Quran MP3
          </a>
        </div>

        {/* Stats Grid */}
        <div className="container" style={{ margin: '3rem auto 0 auto', padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#f59e0b' }}>{stats.total_audios}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Quran Recitations</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#f59e0b' }}>{stats.total_videos}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Video Lectures</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#f59e0b' }}>{stats.total_books}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>PDF Books Library</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#f59e0b' }}>{stats.total_hadiths}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Hadith Collections</p>
            </div>
          </div>
        </div>
      </section>

      {/* DAILY VERSE & INSPIRATION SPOTLIGHT (DYNAMICALLY ROTATES EVERY DAY AT MIDNIGHT) */}
      {(() => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const todayVerse = DAILY_VERSES_COLLECTION[dayOfYear % DAILY_VERSES_COLLECTION.length];
        return (
          <section className="container" style={{ marginTop: '2rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
                border: '2px solid var(--accent-gold)',
                borderRadius: '16px',
                padding: '2rem 1.75rem',
                color: '#ffffff',
                boxShadow: '0 12px 32px rgba(2, 44, 34, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(245,158,11,0.3)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.15)', padding: '0.35rem 0.85rem', borderRadius: '20px' }}>
                  <i className="fas fa-sun"></i> Daily Verse & Reflection of the Day
                </span>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  Surah {todayVerse.surahName}
                </span>
              </div>

              <div style={{ textAlign: 'center', margin: '1rem 0 1.5rem 0' }}>
                <p className="arabic-font" style={{ fontSize: '1.8rem', color: '#ffffff', lineHeight: '2.2', marginBottom: '1rem', fontWeight: 700 }}>
                  {todayVerse.arabic}
                </p>
                <p style={{ fontSize: '1.05rem', color: '#fef3c7', fontStyle: 'italic', maxWidth: '850px', margin: '0 auto 0.75rem auto', lineHeight: '1.6' }}>
                  "{todayVerse.translation_en}"
                </p>
                <p style={{ fontSize: '0.92rem', color: '#6ee7b7', margin: '0 auto', maxWidth: '800px', fontWeight: 600 }}>
                  اردو ترجمہ: "{todayVerse.translation_ur}"
                </p>
              </div>

              {/* Share & Interactive Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  className="btn-play"
                  onClick={() => playTrack(todayVerse.audio_url, `Surah ${todayVerse.surahName}`, "Mishary Rashid Alafasy")}
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
                >
                  <i className="fas fa-play"></i> Listen Recitation
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🌸 Daily Quranic Reflection 🌸\n\n${todayVerse.arabic}\n\n"${todayVerse.translation_en}"\n[Surah ${todayVerse.surahName}]\n\nRead more on Quran Portal!`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-play"
                  style={{ background: '#25D366', borderColor: '#25D366', color: '#ffffff', padding: '0.55rem 1.25rem', fontSize: '0.88rem', textDecoration: 'none' }}
                >
                  <i className="fab fa-whatsapp"></i> Share on WhatsApp
                </a>

                <button
                  className="btn-play"
                  onClick={() => {
                    const text = `${todayVerse.arabic}\n\n"${todayVerse.translation_en}"\n[Surah ${todayVerse.surahName}]`;
                    navigator.clipboard.writeText(text);
                    alert("Daily verse copied to clipboard!");
                  }}
                  style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff', padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
                >
                  <i className="fas fa-copy"></i> Copy Verse
                </button>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Live Prayer Times & Hijri Date Widget */}
      <section className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <PrayerTimesWidget />
      </section>

      {/* Continue Reading Quick Banner if saved position exists */}
      {lastRead && (
        <section className="container" style={{ marginBottom: '2.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
            border: '1px solid #fde68a',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--accent-gold)', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fas fa-bookmark"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '1.05rem', fontWeight: 800 }}>
                  Resume Reading: Surah {lastRead.surahName} (Ayah {lastRead.ayahNumber})
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#78350f' }}>
                  Saved position from your recent reading session.
                </p>
              </div>
            </div>

            <a
              href="/read"
              className="btn-play"
              onClick={(e) => {
                e.preventDefault();
                handleNav('read');
              }}
              style={{ background: 'var(--primary-dark)', padding: '0.6rem 1.4rem', textDecoration: 'none' }}
            >
              <i className="fas fa-arrow-right"></i> Continue Reading
            </a>
          </div>
        </section>
      )}

      {/* 1. FEATURED AUDIO RECITATIONS (EXACTLY 4 SURAHS - CENTERED) */}
      <section className="container" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center', fontSize: '1.8rem' }}>
            <i className="fas fa-volume-up" style={{ color: 'var(--accent-gold)' }}></i> Featured Surahs Recitations
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Listen to beautiful high-definition recitations from world-renowned Qaris.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {getDailyRotatedSlice(audios, 4).map((item) => (
            <div key={item.id} className="card" style={{ textAlign: 'center', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="surah-number-badge">{item.surah_number}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-light)', background: 'var(--accent-gold-light)', padding: '2px 10px', borderRadius: '12px' }}>
                    {item.revelation_place}
                  </span>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.2rem', margin: '0.3rem 0' }}>Surah {item.surah_name_english}</h3>
                <p className="arabic-font card-arabic" style={{ fontSize: '1.4rem', margin: '0.2rem 0 0.5rem 0' }}>{item.surah_name_arabic}</p>
                <p className="card-subtitle" style={{ fontSize: '0.85rem' }}><i className="fas fa-user-alt"></i> {item.reciter}</p>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><i className="far fa-clock"></i> {item.duration}</span>
                <button
                  className="btn-play"
                  onClick={() => playTrack(item.audio_url, `Surah ${item.surah_name_english}`, item.reciter)}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.55rem 1rem' }}
                >
                  <i className="fas fa-play"></i> Play Audio
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <a
            href="/quran"
            className="btn-play"
            onClick={(e) => {
              e.preventDefault();
              handleNav('quran');
            }}
            style={{
              display: 'inline-flex',
              padding: '0.7rem 2rem',
              fontSize: '0.95rem',
              background: 'var(--primary-dark)',
              color: 'var(--accent-gold)',
              textDecoration: 'none'
            }}
          >
            View All 114 Surahs Recitations <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
          </a>
        </div>
      </section>

      {/* 2. DEDICATED PDF BOOKS LIBRARY SECTION (CENTERED) */}
      <section className="container" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center', fontSize: '1.8rem' }}>
            <i className="fas fa-book" style={{ color: 'var(--accent-gold)' }}></i> PDF Books Library
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Explore and download authentic Islamic literature, Quranic commentary, and Hadith guides.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {getDailyRotatedSlice(books, 4).map((bk) => (
            <div key={bk.id} className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="media-cover-wrapper" style={{ width: '130px', height: '160px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <img src={bk.cover_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80"} alt={bk.title} className="media-cover-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '0.2rem 0' }}>{bk.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>By {bk.author}</p>
                <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', background: 'var(--accent-gold-light)', padding: '2px 10px', borderRadius: '12px', marginTop: '0.4rem', fontWeight: 600 }}>
                  {bk.pages_count} Pages &bull; {bk.language}
                </span>
              </div>

              <div style={{ marginTop: '1.25rem', width: '100%' }}>
                <a
                  href={bk.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-play"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.6rem 1rem',
                    fontSize: '0.85rem',
                    background: 'var(--primary-emerald)',
                    textDecoration: 'none'
                  }}
                >
                  <i className="fas fa-file-pdf"></i> Read / Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <a
            href="/books"
            className="btn-play"
            onClick={(e) => {
              e.preventDefault();
              handleNav('books');
            }}
            style={{
              display: 'inline-flex',
              padding: '0.7rem 2rem',
              fontSize: '0.95rem',
              background: 'var(--primary-dark)',
              color: 'var(--accent-gold)',
              textDecoration: 'none'
            }}
          >
            Explore Full PDF Books Library <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
          </a>
        </div>
      </section>

      {/* 3. FEATURED VIDEO LECTURES (CENTERED) */}
      <section className="container" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center', fontSize: '1.8rem' }}>
            <i className="fas fa-video" style={{ color: 'var(--accent-gold)' }}></i> Video Lectures & Sermons
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Watch inspiring Quranic reflections and Islamic video lectures.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {getDailyRotatedSlice(videos, 4).map((vid) => (
            <div key={vid.id} className="card" style={{ padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="media-cover-wrapper" style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', position: 'relative', marginBottom: '1rem' }}>
                <img src={vid.thumbnail_url || "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=500&q=80"} alt={vid.title} className="media-cover-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="media-play-overlay" onClick={() => openVideoModal(vid.title, vid.video_url)}>
                  <button className="play-icon-lg" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}><i className="fas fa-play"></i></button>
                </div>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '0.2rem 0' }}>{vid.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary-light)', margin: '0.2rem 0 0.8rem 0', fontWeight: 600 }}>{vid.speaker}</p>
              <button
                className="btn-play"
                style={{ width: '100%', justifyContent: 'center', padding: '0.55rem 1rem' }}
                onClick={() => openVideoModal(vid.title, vid.video_url)}
              >
                <i className="fas fa-play"></i> Watch Lecture
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HADITH SPOTLIGHT (CENTERED) */}
      <section className="container" style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center', fontSize: '1.8rem' }}>
            <i className="fas fa-scroll" style={{ color: 'var(--accent-gold)' }}></i> Authentic Hadith Spotlight
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Read authentic traditions of Prophet Muhammad ﷺ.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {getDailyRotatedSlice(hadiths, 4).map((h) => (
            <div key={h.id} className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', background: 'var(--accent-gold-light)', padding: '3px 12px', borderRadius: '12px' }}>
                  {h.book_name} #{h.hadith_number}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '3px 12px', borderRadius: '12px' }}>
                  {h.grade}
                </span>
              </div>
              <p className="arabic-font" style={{ fontSize: '1.35rem', color: 'var(--primary-emerald)', lineHeight: '1.8', marginBottom: '1rem' }}>{h.arabic_text}</p>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.6' }}>"{h.translation}"</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <a
            href="/hadith"
            className="btn-play"
            onClick={(e) => {
              e.preventDefault();
              handleNav('hadith');
            }}
            style={{
              display: 'inline-flex',
              padding: '0.7rem 2rem',
              fontSize: '0.95rem',
              background: 'var(--primary-dark)',
              color: 'var(--accent-gold)',
              textDecoration: 'none'
            }}
          >
            Explore Hadith Collections <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
          </a>
        </div>
      </section>
    </div>
  );
}
