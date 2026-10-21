import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PrayerTimesWidget from '../components/PrayerTimesWidget';
import DailyReminderBanner from '../components/DailyReminderBanner';
import { fetchWithCache, getApiUrl } from '../utils/apiCache';
import { useLanguage } from '../context/LanguageContext';
import { getPrayerMethodAndAdjustment } from '../utils/hijriDate';

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

const DEFAULT_TAQREERS = [];

const DEFAULT_HADITHS = [
  { id: 1, book_name: "Sahih Bukhari", hadith_number: 1, grade: "Sahih", arabic_text: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى", translation: "Actions are judged by intentions, and every person will get what they intended." },
  { id: 2, book_name: "Sahih Muslim", hadith_number: 223, grade: "Sahih", arabic_text: "الطَّهُورُ شَطْرُ الإِيمَانِ", translation: "Purity is half of faith." }
];

const TODAY_DUA = { arabic: 'رَبِّ زِدْنِي عِلْمًا', translation: 'My Lord, increase me in knowledge.', reference: 'Ta-Ha 20:114' };

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

const HADITH_OF_THE_DAY_COLLECTION = [
  {
    book: "Sahih Bukhari",
    number: 1,
    grade: "Sahih",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translation_en: "Actions are judged by intentions, and every person will get what they intended.",
    translation_ur: "اعمال کا دارومدار نیتوں پر ہے، اور ہر انسان کو وہی ملے گا جس کی اس نے نیت کی تھی۔"
  },
  {
    book: "Sahih Muslim",
    number: 223,
    grade: "Sahih",
    arabic: "الطَّهُورُ شَطْرُ الإِيمَانِ",
    translation_en: "Purity is half of faith.",
    translation_ur: "پاکیزگی اور طہارت نصف ایمان ہے۔"
  },
  {
    book: "Sahih Bukhari",
    number: 6412,
    grade: "Sahih",
    arabic: "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ",
    translation_en: "Be in this world as if you were a stranger or a traveler on a path.",
    translation_ur: "دنیا میں اس طرح رہو گویا تم ایک مسافر یا راہ چلتے راہگیر ہو۔"
  },
  {
    book: "Sahih Bukhari",
    number: 5027,
    grade: "Sahih",
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translation_en: "The best among you are those who learn the Quran and teach it.",
    translation_ur: "تم میں سے سب سے بہتر وہ شخص ہے جو قرآن سیکھے اور اسے دوسروں کو سکھائے۔"
  },
  {
    book: "Sahih Bukhari",
    number: 13,
    grade: "Sahih",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translation_en: "None of you will have true faith until he wishes for his brother what he wishes for himself.",
    translation_ur: "تم میں سے کوئی بھی اس وقت تک سچا مؤمن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے بھی وہی پسند نہ کرے جو اپنے لیے کرتا ہے۔"
  },
  {
    book: "Sahih Bukhari",
    number: 6011,
    grade: "Sahih",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translation_en: "Whoever believes in Allah and the Last Day should speak good things or keep silent.",
    translation_ur: "جو شخص اللہ اور آخرت کے دن پر ایمان رکھتا ہو، اسے چاہیے کہ اچھی بات کہے یا خاموش رہے۔"
  },
  {
    book: "Sahih Muslim",
    number: 2564,
    grade: "Sahih",
    arabic: "الْمُسْلِمُ أَخُو الْمُسْلِمِ لاَ يَظْلِمُهُ وَلاَ يَخْذُلُهُ وَلاَ يَحْقِرُهُ",
    translation_en: "A Muslim is the brother of a Muslim. He does not oppress him, nor does he abandon him, nor does he humiliate him.",
    translation_ur: "مسلمان مسلمان کا بھائی ہے، وہ نہ اس پر ظلم کرتا ہے، نہ اسے بے یار و مددگار چھوڑتا ہے، اور نہ ہی اسے حقیر سمجھتا ہے۔"
  }
];

const getTodayPlanKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export default function HomeView({ navigateToTab, setActiveTab, playTrack, user, openAuthModal, openSpotlight, openAIChat, openCalendar }) {
  const { t, lang } = useLanguage();
  const handleNav = (tab) => {
    if (typeof navigateToTab === 'function') navigateToTab(tab);
    else if (typeof setActiveTab === 'function') setActiveTab(tab);
  };
  const navigate = (tab, query = null) => {
    if (typeof navigateToTab === 'function') navigateToTab(tab, query);
    else if (typeof setActiveTab === 'function') setActiveTab(tab);
  };

  // ─── Document Viewer Modal State ───────────────────────────────────────────
  const [docViewer, setDocViewer] = useState(null); // { url, title, author }
  const [viewerEngine, setViewerEngine] = useState('direct');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const getCleanDocumentUrl = (rawUrl) => {
    if (!rawUrl) return '';
    let url = String(rawUrl).trim();
    url = url.replace(/^https?:\/\/(127\.0\.0\.1|localhost):(8000|3000)/, '');
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (!url.startsWith('/')) url = `/${url}`;
    if (!url.startsWith('/media/')) url = `/media${url}`;
    return getApiUrl(url);
  };
  const getDocumentUrl = (book) => {
    const rawUrl = book?.document_url || book?.pdf_url || book?.pdf_file || book?.file_url || '';
    return getCleanDocumentUrl(rawUrl);
  };
  const rememberBookReading = (book, page = 1) => {
    const saved = { id: book.id, title: book.title, author: book.author || '', page, pages_count: book.pages_count || book.pages || 1, timestamp: new Date().toISOString() };
    setLastBook(saved);
    try { localStorage.setItem('maktaba_last_read_book', JSON.stringify(saved)); } catch {}
  };
  const openDocViewer = (bk) => {
    const url = getDocumentUrl(bk);
    if (!url) {
      alert('This document is not available to view yet.');
      return;
    }
    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setViewerEngine(isMobile ? 'google' : 'direct');
    setIsFullscreen(false);
    rememberBookReading(bk);
    setDocViewer({ url, title: bk.title, author: bk.author, fileType: bk.file_type });
  };
  const getViewerUrl = (doc) => {
    if (viewerEngine === 'google') {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`;
    }
    const isPdf = ['pdf', 'book'].includes(doc.fileType) || /\.pdf(?:$|[?#])/i.test(doc.url);
    return isPdf ? `${doc.url.split('#')[0]}#view=FitH` : doc.url;
  };
  const closeDocViewer = () => setDocViewer(null);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeDocViewer(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const [stats, setStats] = useState({ total_audios: 7, total_taqreers: 0, total_books: 3, total_hadiths: 3 });
  const [audios, setAudios] = useState(DEFAULT_AUDIOS);
  const [taqreers, setTaqreers] = useState([]);
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [hadiths, setHadiths] = useState(DEFAULT_HADITHS);
  const [lastRead, setLastRead] = useState(null);
  const [lastBook, setLastBook] = useState(() => {
    try { return JSON.parse(localStorage.getItem('maktaba_last_read_book') || 'null'); } catch { return null; }
  });
  const [dailyPlan, setDailyPlan] = useState(() => {
    const today = getTodayPlanKey();
    try {
      const saved = JSON.parse(localStorage.getItem('maktaba_daily_reading_plan') || 'null');
      if (saved?.date === today) {
        const target = [1, 3, 5, 10].includes(Number(saved.target)) ? Number(saved.target) : 5;
        const completed = Math.max(0, Math.min(target, Number(saved.completed) || 0));
        return { date: today, target, completed };
      }
    } catch {}
    return { date: today, target: 5, completed: 0 };
  });

  useEffect(() => {
    try { localStorage.setItem('maktaba_daily_reading_plan', JSON.stringify(dailyPlan)); } catch {}
  }, [dailyPlan]);

  useEffect(() => {
    const checkDay = () => {
      const today = getTodayPlanKey();
      setDailyPlan(current => current.date === today ? current : { date: today, target: current.target || 5, completed: 0 });
    };
    const timer = setInterval(checkDay, 60000);
    return () => clearInterval(timer);
  }, []);

  const [copiedHadith, setCopiedHadith] = useState(false);
  const [todayTab, setTodayTab] = useState('ayah');
  const [savedContentCount] = useState(() => {
    try {
      const duas = JSON.parse(localStorage.getItem('maktaba_dua_favorites') || '[]');
      const ayahs = JSON.parse(localStorage.getItem('maktaba_local_ayah_bookmarks') || '[]');
      return duas.length + ayahs.length;
    } catch { return 0; }
  });
  const getDailyHadith = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % HADITH_OF_THE_DAY_COLLECTION.length;
    return HADITH_OF_THE_DAY_COLLECTION[index];
  };
  const dailyHadith = getDailyHadith();

  const [locationInfo, setLocationInfo] = useState(null);
  const [ramadanCountdown, setRamadanCountdown] = useState(null);
  const [hijriYear, setHijriYear] = useState('1448');

  // Load cache on init
  useEffect(() => {
    const cachedLat = localStorage.getItem('user_lat');
    const cachedLng = localStorage.getItem('user_lng');
    const cachedCode = localStorage.getItem('user_country_code');
    const cachedLabel = localStorage.getItem('user_location_name');
    const cachedTimingsStr = localStorage.getItem('user_prayer_timings');
    let cachedTimings = null;
    try {
      if (cachedTimingsStr) cachedTimings = JSON.parse(cachedTimingsStr);
    } catch(e) {}

    if (cachedLat && cachedLng) {
      setLocationInfo({
        hijri: { year: new Date().getFullYear() - 579 },
        lat: parseFloat(cachedLat),
        lng: parseFloat(cachedLng),
        countryCode: cachedCode || '',
        city: cachedLabel || 'Local City',
        timings: cachedTimings,
        timezone: localStorage.getItem('user_prayer_timezone') || ''
      });
    }
  }, []);

  const handleLocationOrDateUpdate = (info) => {
    setLocationInfo(info);
  };

  useEffect(() => {
    if (!locationInfo || !locationInfo.hijri) return;

    const year = parseInt(locationInfo.hijri.year, 10) || 1448;
    setHijriYear(year);

    const loadRamadan = async (targetYear) => {
      try {
        const { method, hijriAdjustment } = getPrayerMethodAndAdjustment(locationInfo.countryCode);
        const lat = locationInfo.lat;
        const lon = locationInfo.lng;

        const url = lat && lon
          ? `https://api.aladhan.com/v1/hToGCalendar/9/${targetYear}?latitude=${lat}&longitude=${lon}&method=${method}&hijriAdjustment=${hijriAdjustment}`
          : `https://api.aladhan.com/v1/hToGCalendar/9/${targetYear}?hijriAdjustment=${hijriAdjustment}`;

        const res = await fetch(url);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const firstDay = json.data[0].gregorian;
          const lastDay = json.data[json.data.length - 1].gregorian;
          const parseGregorian = (g) => new Date(`${g.year}-${String(g.month.number).padStart(2,'0')}-${String(g.day).padStart(2,'0')}`);

          const ramStart = parseGregorian(firstDay);
          const ramEnd = parseGregorian(lastDay);
          const totalDays = json.data.length;

          // Calculate countdown
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          ramStart.setHours(0, 0, 0, 0);
          ramEnd.setHours(0, 0, 0, 0);

          if (now < ramStart) {
            const daysUntil = Math.ceil((ramStart - now) / (1000 * 60 * 60 * 24));
            setRamadanCountdown({ state: 'upcoming', days: daysUntil, total: totalDays });
          } else if (now <= ramEnd) {
            const dayIn = Math.ceil((now - ramStart) / (1000 * 60 * 60 * 24)) + 1;
            const daysLeft = Math.ceil((ramEnd - now) / (1000 * 60 * 60 * 24));
            setRamadanCountdown({ state: 'active', dayIn, daysLeft, total: totalDays });
          } else {
            // Ramadan has passed for targetYear, check if we need to load next year's Ramadan
            if (targetYear === year) {
              setHijriYear(year + 1);
              loadRamadan(year + 1);
            } else {
              const daysAgo = Math.ceil((now - ramEnd) / (1000 * 60 * 60 * 24));
              setRamadanCountdown({ state: 'passed', daysAgo });
            }
          }
        }
      } catch (e) {
        console.error("Error fetching Ramadan dates in HomeView:", e);
      }
    };

    loadRamadan(year);
  }, [locationInfo]);

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
  const featuredAudios = getDailyRotatedSlice(audios.filter(item => item.audio_url), 3);
  const featuredBooks = books.filter(book => getDocumentUrl(book)).slice(0, 3);

  useEffect(() => {
    // Check local storage for last read position
    const saved = localStorage.getItem('quranLastRead');
    if (saved) {
      try {
        setLastRead(JSON.parse(saved));
      } catch (e) {}
    }

    fetchWithCache('/api/stats/')
      .then(data => setStats(data))
      .catch(() => {});

    fetchWithCache('/api/quran/?featured=1')
      .then(data => {
        if (data.results && data.results.length > 0) setAudios(data.results);
      })
      .catch(() => {});

    fetchWithCache('/api/taqreer/')
      .then(data => {
        if (data.results && data.results.length > 0) setTaqreers(data.results);
      })
      .catch(() => {});

    fetchWithCache('/api/books/')
      .then(data => {
        if (data.results && data.results.length > 0) setBooks(data.results);
      })
      .catch(() => {});

    fetchWithCache('/api/hadith/')
      .then(data => {
        if (data.results && data.results.length > 0) setHadiths(data.results);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(getApiUrl('/api/user/dashboard/'))
      .then(response => response.json())
      .then(data => {
        const recentBook = data.book_history?.[0];
        if (data.status === 'success' && recentBook?.title) {
          let localBook = null;
          try { localBook = JSON.parse(localStorage.getItem('maktaba_last_read_book') || 'null'); } catch {}
          const localTime = Date.parse(localBook?.timestamp || '');
          const remoteTime = Date.parse(recentBook.timestamp || '');
          if (Number.isFinite(localTime) && (!Number.isFinite(remoteTime) || localTime >= remoteTime)) return;
          const saved = { id: recentBook.book_id, title: recentBook.title, author: recentBook.author || '', page: recentBook.page || 1, pages_count: recentBook.pages_count || 1, timestamp: recentBook.timestamp };
          setLastBook(saved);
          try { localStorage.setItem('maktaba_last_read_book', JSON.stringify(saved)); } catch {}
        }
      })
      .catch(() => {});
  }, [user]);

  const CAROUSEL_SLIDES = [
    {
      badge: t('slide1Badge'),
      title: t('slide1Title'),
      subtitle: t('slide1Desc'),
      btnText: t('readQuran'),
      btnIcon: "fas fa-book-open",
      tab: "read",
      arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"
    },
    {
      badge: "نئی گائیڈ • NEW FEATURE",
      title: "آسان نماز اور مکمل مسنون احکام",
      subtitle: "نماز کا مرحلہ وار طریقہ، ۵ نمازوں کی رکعتیں، فرائض، وضو، غسل، جنازہ، قبرستان اور مسنون دعائیں",
      btnText: "آسان نماز کھولیں (Open Guide)",
      btnIcon: "fas fa-mosque",
      tab: "asanNimaz",
      arabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا"
    },
    {
      badge: t('slide2Badge'),
      title: t('slide2Title'),
      subtitle: t('slide2Desc'),
      btnText: t('mp3Audio'),
      btnIcon: "fas fa-headphones",
      tab: "quran",
      arabic: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
    },
    {
      badge: t('slide3Badge'),
      title: t('slide3Title'),
      subtitle: t('slide3Desc'),
      btnText: t('books'),
      btnIcon: "fas fa-book",
      tab: "books",
      arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا"
    },
    {
      badge: t('slide4Badge'),
      title: t('slide4Title'),
      subtitle: t('slide4Desc'),
      btnText: t('prayers'),
      btnIcon: "fas fa-clock",
      tab: "prayers",
      arabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا"
    },
    {
      badge: t('slide5Badge'),
      title: t('slide5Title'),
      subtitle: t('slide5Desc'),
      btnText: t('hadith'),
      btnIcon: "fas fa-star",
      tab: "hadith",
      arabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ"
    },
    {
      badge: t('slide6Badge'),
      title: t('slide6Title'),
      subtitle: t('slide6Desc'),
      btnText: t('khatam'),
      btnIcon: "fas fa-chart-line",
      tab: "khatam",
      arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
    }
  ];

  const slide = CAROUSEL_SLIDES[0];

  const isFriday = new Date().getDay() === 5;
  const FRIDAY_INLINE_AYAT = [
    {
      surah: "Surah Al-Kahf (18:10)", num: 18,
      arabic: "\u0625\u0630\u0652 \u0623\u064e\u0648\u0649 \u0627\u0644\u0652\u0641\u0650\u062a\u0652\u064a\u064e\u0629\u064f \u0625\u0650\u0644\u064e\u0649 \u0627\u0644\u0652\u0643\u064e\u0647\u0652\u0641\u0650 \u0641\u064e\u0642\u064e\u0627\u0644\u064f\u0648\u0627 \u0631\u064e\u0628\u064e\u0651\u0646\u064e\u0627 \u0622\u062a\u0650\u0646\u064e\u0627 \u0645\u0650\u0646 \u0644\u064e\u0651\u062f\u064f\u0646\u0643\u064e \u0631\u064e\u062d\u0652\u0645\u064e\u0629\u064b \u0648\u064e\u0647\u064e\u064a\u0651\u0650\u0626\u0652 \u0644\u064e\u0646\u064e\u0627 \u0645\u0650\u0646\u0652 \u0623\u064e\u0645\u0652\u0631\u0650\u0646\u064e\u0627 \u0631\u064e\u0634\u064e\u062f\u064b\u0627",
      urdu: "\u062c\u0628 \u0627\u0646 \u0646\u0648\u062c\u0648\u0627\u0646\u0648\u06ba \u0646\u06d2 \u063a\u0627\u0631 \u0645\u06cc\u06ba \u067e\u0646\u0627\u06c1 \u0644\u06cc \u062a\u0648 \u06a9\u06c1\u0627: \u0627\u06d2 \u06c1\u0645\u0627\u0631\u06d2 \u0631\u0628! \u06c1\u0645\u06cc\u06ba \u0631\u062d\u0645\u062a \u0639\u0637\u0627 \u0641\u0631\u0645\u0627 \u0627\u0648\u0631 \u06c1\u0645\u0627\u0631\u06d2 \u0645\u0639\u0627\u0645\u0644\u06d2 \u0645\u06cc\u06ba \u06c1\u062f\u0627\u06cc\u062a \u0639\u0637\u0627 \u0641\u0631\u0645\u0627\u06d4",
      english: "When the youths retreated to the cave, they said: Our Lord, grant us mercy and guide us rightly.",
      audio: "https://server8.mp3quran.net/afs/018.mp3"
    },
    {
      surah: "Surah Al-Jumu'ah (62:9)", num: 62,
      arabic: "\u064a\u064e\u0627 \u0623\u064e\u064a\u064f\u0651\u0647\u064e\u0627 \u0627\u0644\u064e\u0651\u0630\u0650\u064a\u0646\u064e \u0622\u0645\u064e\u0646\u064f\u0648\u0627 \u0625\u0650\u0630\u064e\u0627 \u0646\u064f\u0648\u062f\u0650\u064a\u064e \u0644\u0650\u0644\u0635\u064e\u0651\u0644\u064e\u0627\u0629\u0650 \u0645\u0650\u0646 \u064a\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u0652\u062c\u064f\u0645\u064f\u0639\u064e\u0629\u0650 \u0641\u064e\u0627\u0633\u0652\u0639\u064e\u0648\u0652\u0627 \u0625\u0650\u0644\u064e\u0649\u0670 \u0630\u0650\u0643\u0652\u0631\u0650 \u0627\u0644\u0644\u064e\u0651\u0647\u0650 \u0648\u064e\u0630\u064e\u0631\u064f\u0648\u0627 \u0627\u0644\u0652\u0628\u064e\u064a\u0652\u0639\u064e",
      urdu: "\u0627\u06d2 \u0627\u06cc\u0645\u0627\u0646 \u0648\u0627\u0644\u0648! \u062c\u0628 \u062c\u0645\u0639\u06c1 \u06a9\u06d2 \u062f\u0646 \u0646\u0645\u0627\u0632 \u06a9\u06d2 \u0644\u06cc\u06d2 \u0627\u0630\u0627\u0646 \u062f\u06cc \u062c\u0627\u0626\u06d2 \u062a\u0648 \u0627\u0644\u0644\u06c1 \u06a9\u06d2 \u0630\u06a9\u0631 \u06a9\u06cc \u0637\u0631\u0641 \u062f\u0648\u0691\u0648 \u0627\u0648\u0631 \u062e\u0631\u06cc\u062f \u0648 \u0641\u0631\u0648\u062e\u062a \u0686\u06be\u0648\u0691 \u062f\u0648\u06d4",
      english: "O believers! When called to Friday prayer, hurry to the remembrance of Allah and leave all business.",
      audio: "https://server8.mp3quran.net/afs/062.mp3"
    },
  ];


  return (
    <div className="home-page">
      
      <main className="home-redesign">
        <section className="home-hero container">
          <span className="home-eyebrow">Maktaba Tul Muslim · Your Islamic digital library</span>
          <h1>The Quran, Hadith &amp; Islamic Knowledge — in One Place</h1>
          <p>Read the Quran with translations and Tafseer, listen to renowned Qaris, explore Hadith, and discover trusted Islamic books.</p>
          <div className="home-hero-actions">
            <button className="home-btn-primary" onClick={() => handleNav('read')}>Read Quran <i className="fas fa-arrow-right" aria-hidden="true" /></button>
            <button className="home-btn-secondary" onClick={() => handleNav('books')}>Explore Library <i className="fas fa-arrow-right" aria-hidden="true" /></button>
          </div>
        </section>

        <section id="home-prayer-times" className="container home-section home-prayer-section">
          <PrayerTimesWidget compact onLocationOrDateUpdate={handleLocationOrDateUpdate} />
          <DailyReminderBanner timings={locationInfo?.timings} timezone={locationInfo?.timezone} navigateToTab={navigateToTab} />
        </section>

        {(lastRead || lastBook || savedContentCount > 0) && <section className="container home-section home-journey-section">
          <div className="home-section-heading"><div><span className="home-eyebrow">Pick up where you left off</span><h2>Continue your journey</h2></div></div>
          <div className="home-journey-grid">
            {lastRead && <button className="home-journey-card" onClick={() => handleNav('read')}><i className="fas fa-book-open" aria-hidden="true" /><span><strong>Continue Quran</strong><small>{lastRead.surahName || 'Saved reading'} · Ayah {lastRead.ayahNumber}</small></span><i className="fas fa-arrow-right" aria-hidden="true" /></button>}
            {lastBook && <button className="home-journey-card" onClick={() => navigate('books', lastBook.title)}><i className="fas fa-book" aria-hidden="true" /><span><strong>Continue your book</strong><small>{lastBook.title} · Page {lastBook.page || 1}</small></span><i className="fas fa-arrow-right" aria-hidden="true" /></button>}
            {savedContentCount > 0 && <button className="home-journey-card" onClick={() => handleNav('bookmarks')}><i className="fas fa-heart" aria-hidden="true" /><span><strong>Saved content</strong><small>{savedContentCount} saved items</small></span><i className="fas fa-arrow-right" aria-hidden="true" /></button>}
          </div>
        </section>}

        <section className="container home-section home-explore-section">
          <div className="home-section-heading"><div><span className="home-eyebrow">Browse the collection</span><h2>Explore</h2></div></div>
          <div className="home-explore-grid">{[
            ['read', 'Quran', 'fas fa-book-open'], ['hadith', 'Hadith', 'fas fa-quote-left'], ['tafseer', 'Tafseer', 'fas fa-bookmark'],
            ['books', 'Books', 'fas fa-book'], ['quran', 'Audio', 'fas fa-headphones'], ['azkar', 'Azkar', 'fas fa-hands']
          ].map(([tab, label, icon]) => <button key={tab} className={`home-explore-card${['books', 'tafseer'].includes(tab) ? ' home-library-card' : ''}`} onClick={() => handleNav(tab)}><i className={icon} aria-hidden="true" /><span>{label}</span><i className="fas fa-arrow-right" aria-hidden="true" /></button>)}</div>
        </section>

        {(() => {
          const today = new Date();
          const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
          const verse = DAILY_VERSES_COLLECTION[dayOfYear % DAILY_VERSES_COLLECTION.length];
          return <section className="container home-section home-today">
            <div className="home-section-heading"><div><span className="home-eyebrow">A little inspiration for today</span><h2>Today</h2></div></div>
            <div className="home-today-tabs" role="tablist" aria-label="Today's content">
              {[['ayah', 'Ayah'], ['hadith', 'Hadith'], ['dua', 'Dua']].map(([id, label]) => <button key={id} role="tab" aria-selected={todayTab === id} className={todayTab === id ? 'active' : ''} onClick={() => setTodayTab(id)}>{label}</button>)}
            </div>
            <article className="home-today-card">
              {todayTab === 'ayah' && <><span className="home-content-reference">{verse.surahName}</span><p className="arabic-font">{verse.arabic}</p><p>{verse.translation_en}</p><button className="home-text-action" onClick={() => playTrack(verse.audio_url, `Surah ${verse.surahName}`, 'Mishary Rashid Alafasy')}>Listen <i className="fas fa-play" aria-hidden="true" /></button></>}
              {todayTab === 'hadith' && <><span className="home-content-reference">{dailyHadith.book} · #{dailyHadith.number} · {dailyHadith.grade}</span><p className="arabic-font">{dailyHadith.arabic}</p><p>{dailyHadith.translation_en}</p><button className="home-text-action" onClick={() => handleNav('hadith')}>View Hadith <i className="fas fa-arrow-right" aria-hidden="true" /></button></>}
              {todayTab === 'dua' && <><span className="home-content-reference">Quran · {TODAY_DUA.reference}</span><p className="arabic-font">{TODAY_DUA.arabic}</p><p>{TODAY_DUA.translation}</p><button className="home-text-action" onClick={() => handleNav('duas')}>Explore Duas <i className="fas fa-arrow-right" aria-hidden="true" /></button></>}
            </article>
          </section>;
        })()}

        {featuredAudios.length > 0 && <section className="container home-section home-recitation-section">
          <div className="home-section-heading"><div><span className="home-eyebrow">Listen and reflect</span><h2>Featured recitations</h2></div><button className="home-text-action" onClick={() => handleNav('quran')}>View All <i className="fas fa-arrow-right" aria-hidden="true" /></button></div>
          <div className="home-feature-grid">{featuredAudios.map((item, index) => <article className="home-feature-card" key={item.id || index}><span className="home-feature-icon"><i className="fas fa-headphones" aria-hidden="true" /></span><div><h3>{item.surah_name_english || item.title || `Surah ${item.surah_number || ''}`}</h3><p>{item.reciter || item.subtitle || 'Quran recitation'}</p></div><button aria-label={`Listen to ${item.surah_name_english || item.title || 'recitation'}`} onClick={() => playTrack?.(item.audio_url, item.surah_name_english || item.title, item.reciter)}><i className="fas fa-play" aria-hidden="true" /></button></article>)}</div>
        </section>}

        {featuredBooks.length > 0 && <section className="container home-section home-books-section">
          <div className="home-section-heading"><div><span className="home-eyebrow">Selected from the library</span><h2>Featured books</h2></div><button className="home-text-action" onClick={() => handleNav('books')}>View All <i className="fas fa-arrow-right" aria-hidden="true" /></button></div>
          <div className="home-books-grid">{featuredBooks.map((book, index) => <article className="home-book-card" key={book.id || index}><span className="home-book-cover" aria-hidden="true"><i className="fas fa-book-open" />{book.cover_url && <img src={book.cover_url} alt="" loading="lazy" onError={event => { event.currentTarget.style.display = 'none'; }} />}</span><div><h3>{book.title}</h3><p>{book.author}</p><button className="home-btn-secondary" onClick={() => openDocViewer(book)}>Read Book</button></div></article>)}</div>
        </section>}

        <section className="container home-section home-tools-section">
          <div className="home-section-heading"><div><span className="home-eyebrow">Useful every day</span><h2>Islamic tools</h2></div></div>
          <div className="home-tools-grid">{[
            ['qibla', 'Qibla', 'fas fa-compass'], ['tasbeeh', 'Tasbeeh', 'fas fa-fingerprint'], ['khatam', 'Khatam Tracker', 'fas fa-book-open'],
            ['prayer', 'Prayer Times', 'fas fa-clock'], ['azkar', 'Azkar', 'fas fa-hands'], ['calendar', 'Islamic Calendar', 'fas fa-calendar-alt']
          ].map(([id, label, icon]) => <button key={id} className="home-tool-card" onClick={() => id === 'prayer' ? document.getElementById('home-prayer-times')?.scrollIntoView({ behavior: 'smooth' }) : id === 'calendar' ? openCalendar?.() : handleNav(id)}><i className={icon} aria-hidden="true" /><span>{label}</span><i className="fas fa-arrow-right" aria-hidden="true" /></button>)}</div>
        </section>

        <section className="container home-ask-card">
          <span className="home-eyebrow">Your study companion</span><h2>Ask Maktaba</h2>
          <p>Ask about the Quran, Hadith, Tafseer, and content in the Islamic library.</p>
          <button className="home-btn-primary" onClick={() => openAIChat?.()}>Ask a question <i className="fas fa-arrow-right" aria-hidden="true" /></button>
        </section>
      </main>

      {docViewer && createPortal(
        <div
          onClick={closeDocViewer}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 100000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isFullscreen ? 0 : '0.5rem'
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: isFullscreen ? '100vw' : '100%',
              maxWidth: isFullscreen ? '100vw' : '1150px',
              height: isFullscreen ? '100vh' : '94vh',
              background: '#ffffff',
              borderRadius: isFullscreen ? 0 : '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '0.5rem 0.85rem', background: 'var(--primary-dark)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{ minWidth: 0 }}>
                <strong style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docViewer.title}</strong>
                {docViewer.author && <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>By {docViewer.author}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reader'}
                >
                  <i className={isFullscreen ? 'fas fa-compress' : 'fas fa-expand'}></i>
                </button>
                <button
                  onClick={closeDocViewer}
                  style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '1.25rem', cursor: 'pointer', padding: '0.2rem 0.35rem' }}
                  title="Close Viewer"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.35rem 0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Engine:</span>
                <button
                  onClick={() => setViewerEngine('google')}
                  style={{ padding: '3px 8px', borderRadius: '10px', border: 'none', background: viewerEngine === 'google' ? 'var(--primary-emerald)' : '#e2e8f0', color: viewerEngine === 'google' ? '#fff' : '#475569', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Google
                </button>
                <button
                  onClick={() => setViewerEngine('direct')}
                  style={{ padding: '3px 8px', borderRadius: '10px', border: 'none', background: viewerEngine === 'direct' ? 'var(--primary-emerald)' : '#e2e8f0', color: viewerEngine === 'direct' ? '#fff' : '#475569', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Native
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <a href={docViewer.url} download target="_blank" rel="noreferrer" style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                  <i className="fas fa-download"></i> Download
                </a>
                <a href={docViewer.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-dark)', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                  New Tab <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, background: '#f1f5f9', position: 'relative' }}>
              <iframe
                key={`${viewerEngine}_${docViewer.url}`}
                src={getViewerUrl(docViewer)}
                title={docViewer.title || 'Document Reader'}
                style={{ border: 'none', width: '100%', height: '100%', background: '#ffffff' }}
                allowFullScreen
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
