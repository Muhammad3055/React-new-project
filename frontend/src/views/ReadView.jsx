import React, { useState, useEffect } from 'react';

const ALL_114_SURAHS = [
  { number: 1, name: "Al-Fatihah", englishName: "The Opening", arabic: "الفاتحة", ayahs: 7, type: "Meccan" },
  { number: 2, name: "Al-Baqarah", englishName: "The Cow", arabic: "البقرة", ayahs: 286, type: "Medinan" },
  { number: 3, name: "Ali 'Imran", englishName: "Family of Imran", arabic: "آل عمران", ayahs: 200, type: "Medinan" },
  { number: 4, name: "An-Nisa", englishName: "The Women", arabic: "النساء", ayahs: 176, type: "Medinan" },
  { number: 5, name: "Al-Ma'idah", englishName: "The Table Spread", arabic: "المائدة", ayahs: 120, type: "Medinan" },
  { number: 6, name: "Al-An'am", englishName: "The Cattle", arabic: "الأنعام", ayahs: 165, type: "Meccan" },
  { number: 7, name: "Al-A'raf", englishName: "The Heights", arabic: "الأعراف", ayahs: 206, type: "Meccan" },
  { number: 8, name: "Al-Anfal", englishName: "The Spoils of War", arabic: "الأنفال", ayahs: 75, type: "Medinan" },
  { number: 9, name: "At-Tawbah", englishName: "The Repentance", arabic: "التوبة", ayahs: 129, type: "Medinan" },
  { number: 10, name: "Yunus", englishName: "Jonah", arabic: "يونس", ayahs: 109, type: "Meccan" },
  { number: 11, name: "Hud", englishName: "Hud", arabic: "هود", ayahs: 123, type: "Meccan" },
  { number: 12, name: "Yusuf", englishName: "Joseph", arabic: "يوسف", ayahs: 111, type: "Meccan" },
  { number: 13, name: "Ar-Ra'd", englishName: "The Thunder", arabic: "الرعد", ayahs: 43, type: "Medinan" },
  { number: 14, name: "Ibrahim", englishName: "Abraham", arabic: "إبراهيم", ayahs: 52, type: "Meccan" },
  { number: 15, name: "Al-Hijr", englishName: "The Rocky Tract", arabic: "الحجر", ayahs: 99, type: "Meccan" },
  { number: 16, name: "An-Nahl", englishName: "The Bee", arabic: "النحل", ayahs: 128, type: "Meccan" },
  { number: 17, name: "Al-Isra", englishName: "The Night Journey", arabic: "الإسراء", ayahs: 111, type: "Meccan" },
  { number: 18, name: "Al-Kahf", englishName: "The Cave", arabic: "الكهف", ayahs: 110, type: "Meccan" },
  { number: 19, name: "Maryam", englishName: "Mary", arabic: "مريم", ayahs: 98, type: "Meccan" },
  { number: 20, name: "Taha", englishName: "Ta-Ha", arabic: "طه", ayahs: 135, type: "Meccan" },
  { number: 21, name: "Al-Anbiya", englishName: "The Prophets", arabic: "الأنبياء", ayahs: 112, type: "Meccan" },
  { number: 22, name: "Al-Hajj", englishName: "The Pilgrimage", arabic: "الحج", ayahs: 78, type: "Medinan" },
  { number: 23, name: "Al-Mu'minun", englishName: "The Believers", arabic: "المؤمنون", ayahs: 118, type: "Meccan" },
  { number: 24, name: "An-Nur", englishName: "The Light", arabic: "النور", ayahs: 64, type: "Medinan" },
  { number: 25, name: "Al-Furqan", englishName: "The Criterion", arabic: "الفرقان", ayahs: 77, type: "Meccan" },
  { number: 26, name: "Ash-Shu'ara", englishName: "The Poets", arabic: "الشعراء", ayahs: 227, type: "Meccan" },
  { number: 27, name: "An-Naml", englishName: "The Ant", arabic: "النمل", ayahs: 93, type: "Meccan" },
  { number: 28, name: "Al-Qasas", englishName: "The Stories", arabic: "القصص", ayahs: 88, type: "Meccan" },
  { number: 29, name: "Al-'Ankabut", englishName: "The Spider", arabic: "العنكبوت", ayahs: 69, type: "Meccan" },
  { number: 30, name: "Ar-Rum", englishName: "The Romans", arabic: "الروم", ayahs: 60, type: "Meccan" },
  { number: 31, name: "Luqman", englishName: "Luqman", arabic: "لقمان", ayahs: 34, type: "Meccan" },
  { number: 32, name: "As-Sajdah", englishName: "The Prostration", arabic: "السجدة", ayahs: 30, type: "Meccan" },
  { number: 33, name: "Al-Ahzab", englishName: "The Combined Forces", arabic: "الأحزاب", ayahs: 73, type: "Medinan" },
  { number: 34, name: "Saba", englishName: "Sheba", arabic: "سبإ", ayahs: 54, type: "Meccan" },
  { number: 35, name: "Fatir", englishName: "Originator", arabic: "فاطر", ayahs: 45, type: "Meccan" },
  { number: 36, name: "Ya-Sin", englishName: "Ya Sin", arabic: "يس", ayahs: 83, type: "Meccan" },
  { number: 37, name: "As-Saffat", englishName: "Those who set the Ranks", arabic: "الصافات", ayahs: 182, type: "Meccan" },
  { number: 38, name: "Sad", englishName: "The Letter Sad", arabic: "ص", ayahs: 88, type: "Meccan" },
  { number: 39, name: "Az-Zumar", englishName: "The Troops", arabic: "الزمر", ayahs: 75, type: "Meccan" },
  { number: 40, name: "Ghafir", englishName: "The Forgiver", arabic: "غافر", ayahs: 85, type: "Meccan" },
  { number: 41, name: "Fussilat", englishName: "Explained in Detail", arabic: "فصلت", ayahs: 54, type: "Meccan" },
  { number: 42, name: "Ash-Shura", englishName: "The Consultation", arabic: "الشورى", ayahs: 53, type: "Meccan" },
  { number: 43, name: "Az-Zukhruf", englishName: "The Ornaments of Gold", arabic: "الزخرف", ayahs: 89, type: "Meccan" },
  { number: 44, name: "Ad-Dukhan", englishName: "The Smoke", arabic: "الدخان", ayahs: 59, type: "Meccan" },
  { number: 45, name: "Al-Jathiyah", englishName: "The Crouching", arabic: "الجاثية", ayahs: 37, type: "Meccan" },
  { number: 46, name: "Al-Ahqaf", englishName: "The Wind-Curved Sandhills", arabic: "الأحقاف", ayahs: 35, type: "Meccan" },
  { number: 47, name: "Muhammad", englishName: "Muhammad", arabic: "محمد", ayahs: 38, type: "Medinan" },
  { number: 48, name: "Al-Fath", englishName: "The Victory", arabic: "الفتح", ayahs: 29, type: "Medinan" },
  { number: 49, name: "Al-Hujurat", englishName: "The Rooms", arabic: "الحجرات", ayahs: 18, type: "Medinan" },
  { number: 50, name: "Qaf", englishName: "The Letter Qaf", arabic: "ق", ayahs: 45, type: "Meccan" },
  { number: 51, name: "Adh-Dhariyat", englishName: "The Winnowing Winds", arabic: "الذاريات", ayahs: 60, type: "Meccan" },
  { number: 52, name: "At-Tur", englishName: "The Mount", arabic: "الطور", ayahs: 49, type: "Meccan" },
  { number: 53, name: "An-Najm", englishName: "The Star", arabic: "النجم", ayahs: 62, type: "Meccan" },
  { number: 54, name: "Al-Qamar", englishName: "The Moon", arabic: "القمر", ayahs: 55, type: "Meccan" },
  { number: 55, name: "Ar-Rahman", englishName: "The Beneficent", arabic: "الرحمن", ayahs: 78, type: "Medinan" },
  { number: 56, name: "Al-Waqi'ah", englishName: "The Inevitable", arabic: "الواقعة", ayahs: 96, type: "Meccan" },
  { number: 57, name: "Al-Hadid", englishName: "The Iron", arabic: "الحديد", ayahs: 29, type: "Medinan" },
  { number: 58, name: "Al-Mujadila", englishName: "The Pleading Woman", arabic: "المجادلة", ayahs: 22, type: "Medinan" },
  { number: 59, name: "Al-Hashr", englishName: "The Exile", arabic: "الحشر", ayahs: 24, type: "Medinan" },
  { number: 60, name: "Al-Mumtahanah", englishName: "She that is to be examined", arabic: "الممتحنة", ayahs: 13, type: "Medinan" },
  { number: 61, name: "As-Saff", englishName: "The Ranks", arabic: "الصف", ayahs: 14, type: "Medinan" },
  { number: 62, name: "Al-Jumu'ah", englishName: "Friday", arabic: "الجمعة", ayahs: 11, type: "Medinan" },
  { number: 63, name: "Al-Munafiqun", englishName: "The Hypocrites", arabic: "المنافقون", ayahs: 11, type: "Medinan" },
  { number: 64, name: "At-Taghabun", englishName: "The Mutual Disillusion", arabic: "التغابن", ayahs: 18, type: "Medinan" },
  { number: 65, name: "At-Talaq", englishName: "The Divorce", arabic: "الطلاق", ayahs: 12, type: "Medinan" },
  { number: 66, name: "At-Tahrim", englishName: "The Prohibition", arabic: "التحريم", ayahs: 12, type: "Medinan" },
  { number: 67, name: "Al-Mulk", englishName: "The Sovereignty", arabic: "الملك", ayahs: 30, type: "Meccan" },
  { number: 68, name: "Al-Qalam", englishName: "The Pen", arabic: "القلم", ayahs: 52, type: "Meccan" },
  { number: 69, name: "Al-Haqqah", englishName: "The Inevitable Truth", arabic: "الحاقة", ayahs: 52, type: "Meccan" },
  { number: 70, name: "Al-Ma'arij", englishName: "The Ascending Stairways", arabic: "المعارج", ayahs: 44, type: "Meccan" },
  { number: 71, name: "Nuh", englishName: "Noah", arabic: "نوح", ayahs: 28, type: "Meccan" },
  { number: 72, name: "Al-Jinn", englishName: "The Jinn", arabic: "الجن", ayahs: 28, type: "Meccan" },
  { number: 73, name: "Al-Muzzammil", englishName: "The Enshrouded One", arabic: "المزمل", ayahs: 20, type: "Meccan" },
  { number: 74, name: "Al-Muddaththir", englishName: "The Cloaked One", arabic: "المدثر", ayahs: 56, type: "Meccan" },
  { number: 75, name: "Al-Qiyamah", englishName: "The Resurrection", arabic: "القيامة", ayahs: 40, type: "Meccan" },
  { number: 76, name: "Al-Insan", englishName: "Man", arabic: "الإنسان", ayahs: 31, type: "Medinan" },
  { number: 77, name: "Al-Mursalat", englishName: "Those sent forth", arabic: "المرسلات", ayahs: 50, type: "Meccan" },
  { number: 78, name: "An-Naba", englishName: "The Tidings", arabic: "النبإ", ayahs: 40, type: "Meccan" },
  { number: 79, name: "An-Nazi'at", englishName: "Those who drag forth", arabic: "النازعات", ayahs: 46, type: "Meccan" },
  { number: 80, name: "'Abasa", englishName: "He frowned", arabic: "عبس", ayahs: 42, type: "Meccan" },
  { number: 81, name: "At-Takwir", englishName: "The Overthrowing", arabic: "التكوير", ayahs: 29, type: "Meccan" },
  { number: 82, name: "Al-Infitar", englishName: "The Cleaving", arabic: "الانفطار", ayahs: 19, type: "Meccan" },
  { number: 83, name: "Al-Mutaffifin", englishName: "The Defrauding", arabic: "المطففين", ayahs: 36, type: "Meccan" },
  { number: 84, name: "Al-Inshiqaq", englishName: "The Splitting Open", arabic: "الانشقاق", ayahs: 25, type: "Meccan" },
  { number: 85, name: "Al-Buruj", englishName: "The Mansions of the Stars", arabic: "البروج", ayahs: 22, type: "Meccan" },
  { number: 86, name: "At-Tariq", englishName: "The Nightcomer", arabic: "الطارق", ayahs: 17, type: "Meccan" },
  { number: 87, name: "Al-A'la", englishName: "The Most High", arabic: "الأعلى", ayahs: 19, type: "Meccan" },
  { number: 88, name: "Al-Ghashiyah", englishName: "The Overwhelming", arabic: "الغاشية", ayahs: 26, type: "Meccan" },
  { number: 89, name: "Al-Fajr", englishName: "The Dawn", arabic: "الفجر", ayahs: 30, type: "Meccan" },
  { number: 90, name: "Al-Balad", englishName: "The City", arabic: "البلد", ayahs: 20, type: "Meccan" },
  { number: 91, name: "Ash-Shams", englishName: "The Sun", arabic: "الشمس", ayahs: 15, type: "Meccan" },
  { number: 92, name: "Al-Layl", englishName: "The Night", arabic: "الليل", ayahs: 21, type: "Meccan" },
  { number: 93, name: "Ad-Duha", englishName: "The Morning Hours", arabic: "الضحى", ayahs: 11, type: "Meccan" },
  { number: 94, name: "Ash-Sharh", englishName: "The Relief", arabic: "الشرح", ayahs: 8, type: "Meccan" },
  { number: 95, name: "At-Tin", englishName: "The Fig", arabic: "التين", ayahs: 8, type: "Meccan" },
  { number: 96, name: "Al-'Alaq", englishName: "The Clot", arabic: "العلق", ayahs: 19, type: "Meccan" },
  { number: 97, name: "Al-Qadr", englishName: "The Power", arabic: "القدر", ayahs: 5, type: "Meccan" },
  { number: 98, name: "Al-Bayyinah", englishName: "The Clear Proof", arabic: "البينة", ayahs: 8, type: "Medinan" },
  { number: 99, name: "Az-Zalzalah", englishName: "The Earthquake", arabic: "الزلزلة", ayahs: 8, type: "Medinan" },
  { number: 100, name: "Al-'Adiyat", englishName: "The Courser", arabic: "العاديات", ayahs: 11, type: "Meccan" },
  { number: 101, name: "Al-Qari'ah", englishName: "The Calamity", arabic: "القارعة", ayahs: 11, type: "Meccan" },
  { number: 102, name: "At-Takathur", englishName: "Rivalry in worldly increase", arabic: "التكاثر", ayahs: 8, type: "Meccan" },
  { number: 103, name: "Al-'Asr", englishName: "The Declining Day", arabic: "العصر", ayahs: 3, type: "Meccan" },
  { number: 104, name: "Al-Humazah", englishName: "The Traducer", arabic: "الهمزة", ayahs: 9, type: "Meccan" },
  { number: 105, name: "Al-Fil", englishName: "The Elephant", arabic: "الفيل", ayahs: 5, type: "Meccan" },
  { number: 106, name: "Quraysh", englishName: "Quraysh", arabic: "قريش", ayahs: 4, type: "Meccan" },
  { number: 107, name: "Al-Ma'un", englishName: "The Small Kindness", arabic: "الماعون", ayahs: 7, type: "Meccan" },
  { number: 108, name: "Al-Kawthar", englishName: "The Abundance", arabic: "الكوثر", ayahs: 3, type: "Meccan" },
  { number: 109, name: "Al-Kafirun", englishName: "The Disbelievers", arabic: "الكافرون", ayahs: 6, type: "Meccan" },
  { number: 110, name: "An-Nasr", englishName: "The Divine Support", arabic: "النصر", ayahs: 3, type: "Medinan" },
  { number: 111, name: "Al-Masad", englishName: "The Palm Fiber", arabic: "المسد", ayahs: 5, type: "Meccan" },
  { number: 112, name: "Al-Ikhlas", englishName: "The Sincerity", arabic: "الإخلاص", ayahs: 4, type: "Meccan" },
  { number: 113, name: "Al-Falaq", englishName: "The Daybreak", arabic: "الفلق", ayahs: 5, type: "Meccan" },
  { number: 114, name: "An-Nas", englishName: "Mankind", arabic: "الناس", ayahs: 6, type: "Meccan" }
];

const FALLBACK_FATIHAH = {
  number: 1,
  name: "سُورَةُ الفَاتِحَةِ",
  englishName: "Al-Fatihah",
  numberOfAyahs: 7,
  ayahs: [
    { number: 1, numberInSurah: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" },
    { number: 2, numberInSurah: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ" },
    { number: 3, numberInSurah: 3, text: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" },
    { number: 4, numberInSurah: 4, text: "مَٰلِكِ يَوْمِ ٱلدِّينِ" },
    { number: 5, numberInSurah: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
    { number: 6, numberInSurah: 6, text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ" },
    { number: 7, numberInSurah: 7, text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ" }
  ]
};

const FALLBACK_ENGLISH_FATIHAH = [
  { numberInSurah: 1, text: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  { numberInSurah: 2, text: "[All] praise is [due] to Allah, Lord of the worlds -" },
  { numberInSurah: 3, text: "The Entirely Merciful, the Especially Merciful," },
  { numberInSurah: 4, text: "Sovereign of the Day of Recompense." },
  { numberInSurah: 5, text: "It is You we worship and You we ask for help." },
  { numberInSurah: 6, text: "Guide us to the straight path -" },
  { numberInSurah: 7, text: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }
];

export default function ReadView({ user, playTrack, openReportModal }) {
  const [surahsList, setSurahsList] = useState(ALL_114_SURAHS);
  const [selectedSurah, setSelectedSurah] = useState(1);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.length === 114) {
          const formatted = data.data.map(s => ({
            number: s.number,
            name: s.englishName,
            englishName: s.englishNameTranslation,
            arabic: s.name,
            ayahs: s.numberOfAyahs,
            type: s.revelationType
          }));
          setSurahsList(formatted);
        }
      })
      .catch(() => {});
  }, []);
  const [surahData, setSurahData] = useState(FALLBACK_FATIHAH);
  const [translations, setTranslations] = useState({
    en: true,
    ur: false,
    tr: false,
    fr: false,
    es: false,
    de: false,
    id: false,
    bn: false,
    ru: false,
    hi: false
  });
  const [translationData, setTranslationData] = useState({ en: FALLBACK_ENGLISH_FATIHAH });
  const [fontSize, setFontSize] = useState(26);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState({});
  const [surahFilter, setSurahFilter] = useState('');

  // Fetch Surah Arabic Text & Translations from AlQuran Cloud API
  useEffect(() => {
    setLoading(true);
    setSurahData(null);

    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setSurahData(data.data);
        } else {
          setSurahData(FALLBACK_FATIHAH);
        }
        setLoading(false);
      })
      .catch(() => {
        setSurahData(FALLBACK_FATIHAH);
        setTranslationData(prev => ({ ...prev, en: FALLBACK_ENGLISH_FATIHAH }));
        setLoading(false);
      });
  }, [selectedSurah]);

  // Fetch Translations
  useEffect(() => {
    const fetchTrans = (code, edition) => {
      fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/${edition}`)
        .then(res => res.json())
        .then(data => {
          setTranslationData(prev => ({ ...prev, [code]: data.data ? data.data.ayahs : [] }));
        })
        .catch(() => {});
    };

    if (translations.en && !translationData.en) fetchTrans('en', 'en.sahih');
    if (translations.ur && !translationData.ur) fetchTrans('ur', 'ur.jalandhry');
    if (translations.tr && !translationData.tr) fetchTrans('tr', 'tr.transliteration');
    if (translations.fr && !translationData.fr) fetchTrans('fr', 'fr.hamidullah');
    if (translations.es && !translationData.es) fetchTrans('es', 'es.cortes');
    if (translations.de && !translationData.de) fetchTrans('de', 'de.aburida');
    if (translations.id && !translationData.id) fetchTrans('id', 'id.indonesian');
    if (translations.bn && !translationData.bn) fetchTrans('bn', 'bn.bengali');
    if (translations.ru && !translationData.ru) fetchTrans('ru', 'ru.kuliev');
    if (translations.hi && !translationData.hi) fetchTrans('hi', 'hi.hindi');
  }, [selectedSurah, translations]);

  // Fetch User Bookmarks
  useEffect(() => {
    if (user) {
      fetch(`/api/bookmarks/?surah_number=${selectedSurah}`)
        .then(res => res.json())
        .then(data => {
          const map = {};
          (data.bookmarks || []).forEach(bm => {
            map[bm.ayah_number] = true;
          });
          setBookmarks(map);
        })
        .catch(() => {});
    }
  }, [selectedSurah, user]);

  const toggleBookmark = (ayahNumber) => {
    if (!user) {
      alert("Please login to save bookmarks.");
      return;
    }
    fetch('/api/bookmark/toggle/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surah_number: selectedSurah, ayah_number: ayahNumber })
    })
      .then(res => res.json())
      .then(data => {
        setBookmarks(prev => ({ ...prev, [ayahNumber]: data.bookmarked }));
      });
  };

  const copyVerse = (arabicText, ayahNumber) => {
    const fullText = `${arabicText} [Surah ${selectedSurah}:${ayahNumber}]`;
    navigator.clipboard.writeText(fullText);
    alert("Verse copied to clipboard!");
  };

  const [autoSpeakTranslation, setAutoSpeakTranslation] = useState(true);

  const speakTranslationText = (text, langCode = 'en-US') => {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const playAyahAudioAndSpokenTranslation = (ayah, index) => {
    const activeMeta = surahsList.find(s => s.number === selectedSurah) || { name: `Surah ${selectedSurah}` };
    
    // Speaks translation voice ONLY after Arabic Tilawat finishes
    const speakTranslationAfterTilawat = () => {
      if (!autoSpeakTranslation || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const langConfig = [
        { code: 'en', bcp: 'en-US' },
        { code: 'ur', bcp: 'ur-PK' },
        { code: 'tr', bcp: 'tr-TR' },
        { code: 'fr', bcp: 'fr-FR' },
        { code: 'es', bcp: 'es-ES' },
        { code: 'de', bcp: 'de-DE' },
        { code: 'id', bcp: 'id-ID' },
        { code: 'bn', bcp: 'bn-BD' },
        { code: 'ru', bcp: 'ru-RU' },
        { code: 'hi', bcp: 'hi-IN' }
      ];

      langConfig.forEach(({ code, bcp }) => {
        if (translations[code] && translationData[code] && translationData[code][index]) {
          const itemText = translationData[code][index].text;
          if (itemText) {
            const utterance = new SpeechSynthesisUtterance(itemText);
            utterance.lang = bcp;
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
          }
        }
      });
    };

    // Play Arabic Tilawat first; trigger translation voice on finish
    playTrack(
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
      `Surah ${activeMeta.name} (${selectedSurah}:${ayah.numberInSurah})`,
      'Mishary Alafasy (Tilawat)',
      speakTranslationAfterTilawat
    );
  };

  const [theme, setTheme] = useState('light'); // 'light' | 'sepia' | 'dark'
  const [topicFilter, setTopicFilter] = useState('');
  const [lastReadPosition, setLastReadPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('quranLastRead');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const saveLastRead = (ayahNumber) => {
    const activeMeta = surahsList.find(s => s.number === selectedSurah) || { name: `Surah ${selectedSurah}` };
    const pos = {
      surahNumber: selectedSurah,
      surahName: activeMeta.name,
      ayahNumber: ayahNumber,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('quranLastRead', JSON.stringify(pos));
    setLastReadPosition(pos);
    alert(`Saved last read position: Surah ${pos.surahName} (Ayah ${ayahNumber})`);
  };

  const topicKeywords = {
    patience: ['sabr', 'patient', 'patience', 'endure'],
    charity: ['sadaqah', 'zakah', 'spend', 'charity'],
    forgiveness: ['forgive', 'mercy', 'repent', 'tawbah'],
    paradise: ['jannah', 'garden', 'paradise', 'blessing'],
    faith: ['iman', 'believe', 'believers', 'faith']
  };

  const filteredSurahs = surahsList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(surahFilter.toLowerCase()) ||
      s.englishName.toLowerCase().includes(surahFilter.toLowerCase()) ||
      s.number.toString().includes(surahFilter);
    
    if (!topicFilter) return matchesSearch;
    const keywords = topicKeywords[topicFilter] || [];
    const matchesTopic = keywords.some(k => 
      s.name.toLowerCase().includes(k) || s.englishName.toLowerCase().includes(k)
    );
    return matchesSearch && matchesTopic;
  });

  const themeStyles = {
    light: { background: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0' },
    sepia: { background: '#fbf0d9', color: '#432818', border: '1px solid #e9d5a1' },
    dark: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' }
  };

  const activeSurahMeta = surahsList.find(s => s.number === selectedSurah) || { name: `Surah ${selectedSurah}`, englishName: `Surah ${selectedSurah}`, ayahs: surahData ? (surahData.numberOfAyahs || (surahData.ayahs ? surahData.ayahs.length : 7)) : 7, type: "Meccan" };

  return (
    <div className="container" style={{ margin: '1.5rem auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Sidebar: Surah Selector */}
        <div className="card" style={{ padding: '1rem', maxHeight: '800px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}><i className="fas fa-list"></i> Select Surah</h3>
          
          <input
            type="text"
            className="form-input"
            placeholder="Search Surah..."
            value={surahFilter}
            onChange={(e) => setSurahFilter(e.target.value)}
            style={{ marginBottom: '0.5rem', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          />

          {/* Topic Quick Filters */}
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', width: '100%' }}>Topics:</span>
            {['', 'patience', 'charity', 'forgiveness', 'paradise'].map((t) => (
              <button
                key={t}
                onClick={() => setTopicFilter(t)}
                style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  background: topicFilter === t ? 'var(--accent-gold)' : '#ffffff',
                  color: topicFilter === t ? 'var(--primary-dark)' : '#475569',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {t || 'All'}
              </button>
            ))}
          </div>

          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {filteredSurahs.map((s) => (
              <div
                key={s.number}
                onClick={() => setSelectedSurah(s.number)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedSurah === s.number ? 'var(--primary-dark)' : '#f8fafc',
                  color: selectedSurah === s.number ? 'var(--accent-gold)' : 'var(--text-main)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  fontWeight: selectedSurah === s.number ? 700 : 500
                }}
              >
                <span>{s.number}. {s.name} ({s.englishName})</span>
                <span className="arabic-font" style={{ fontSize: '1rem' }}>{s.arabic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Content: Quran Verse Reader */}
        <div>
          {/* Controls Bar */}
          <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.25rem', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>Surah {activeSurahMeta.name} ({activeSurahMeta.englishName})</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeSurahMeta.type} &bull; {activeSurahMeta.ayahs} Verses &bull; Full Audio Recitation Available</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Reading Theme Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Theme:</span>
                <button
                  onClick={() => setTheme('light')}
                  style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: theme === 'light' ? '#ffffff' : 'transparent', color: '#1e293b', cursor: 'pointer' }}
                >Light</button>
                <button
                  onClick={() => setTheme('sepia')}
                  style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: theme === 'sepia' ? '#fbf0d9' : 'transparent', color: '#432818', cursor: 'pointer' }}
                >Sepia</button>
                <button
                  onClick={() => setTheme('dark')}
                  style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: theme === 'dark' ? '#0f172a' : 'transparent', color: '#f8fafc', cursor: 'pointer' }}
                >Dark</button>
              </div>

              {/* Font Resize */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Font:</span>
                <button className="verse-btn" style={{ width: '26px', height: '26px' }} onClick={() => setFontSize(Math.max(18, fontSize - 2))}>-</button>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 4px' }}>{fontSize}px</span>
                <button className="verse-btn" style={{ width: '26px', height: '26px' }} onClick={() => setFontSize(Math.min(42, fontSize + 2))}>+</button>
              </div>

              {/* Auto Spoken Translation Toggle */}
              <button
                onClick={() => setAutoSpeakTranslation(!autoSpeakTranslation)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(245,158,11,0.5)',
                  background: autoSpeakTranslation ? 'var(--accent-gold)' : '#e2e8f0',
                  color: autoSpeakTranslation ? 'var(--primary-dark)' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Toggle automatic translation voice after Arabic Tilawat finishes"
              >
                <i className={`fas ${autoSpeakTranslation ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
                Auto-Voice Translation: {autoSpeakTranslation ? 'ON' : 'OFF'}
              </button>

              {/* Translation Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                <label style={{ cursor: 'pointer' }}><input type="checkbox" checked={translations.en} onChange={(e) => setTranslations({ ...translations, en: e.target.checked })} /> English</label>
                <label style={{ cursor: 'pointer' }}><input type="checkbox" checked={translations.ur} onChange={(e) => setTranslations({ ...translations, ur: e.target.checked })} /> Urdu</label>
                <label style={{ cursor: 'pointer' }}><input type="checkbox" checked={translations.tr} onChange={(e) => setTranslations({ ...translations, tr: e.target.checked })} /> Turkish</label>
                <label style={{ cursor: 'pointer' }}><input type="checkbox" checked={translations.fr} onChange={(e) => setTranslations({ ...translations, fr: e.target.checked })} /> French</label>
                <label style={{ cursor: 'pointer' }}><input type="checkbox" checked={translations.es} onChange={(e) => setTranslations({ ...translations, es: e.target.checked })} /> Spanish</label>
              </div>

              <button
                className="btn-play"
                onClick={() => playTrack(`https://server8.mp3quran.net/afs/${selectedSurah < 10 ? '00' + selectedSurah : (selectedSurah < 100 ? '0' + selectedSurah : selectedSurah)}.mp3`, `Surah ${activeSurahMeta.name}`, 'Mishary Rashid Alafasy')}
              >
                <i className="fas fa-play"></i> Play Surah Audio
              </button>
            </div>
          </div>

          {/* Bismillah Header if not Surah 9 */}
          {selectedSurah !== 9 && selectedSurah !== 1 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: themeStyles[theme].background, borderRadius: '12px', marginBottom: '1rem', border: themeStyles[theme].border }}>
              <p className="arabic-font" style={{ fontSize: '2rem', color: theme === 'dark' ? 'var(--accent-gold)' : 'var(--primary-emerald)' }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
            </div>
          )}

          {/* Verses Container with Active Theme */}
          <div className="card" style={{ ...themeStyles[theme], transition: 'all 0.3s ease' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
                <p style={{ marginTop: '0.75rem' }}>Loading Holy Quran Verses...</p>
              </div>
            ) : (
              surahData && surahData.ayahs && surahData.ayahs.map((ayah, index) => {
                const isLastRead = lastReadPosition && lastReadPosition.surahNumber === selectedSurah && lastReadPosition.ayahNumber === ayah.numberInSurah;

                return (
                  <div key={ayah.numberInSurah} className="verse-block" style={{ borderBottom: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
                    <div className="verse-top-bar">
                      <span className="verse-number">{selectedSurah}:{ayah.numberInSurah}</span>
                      {isLastRead && (
                        <span style={{ fontSize: '0.75rem', background: 'var(--accent-gold)', color: 'var(--primary-dark)', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                          <i className="fas fa-bookmark"></i> Last Read Position
                        </span>
                      )}

                      <div className="verse-actions">
                        <button
                          className="verse-btn"
                          title="Save as Last Read Position"
                          onClick={() => saveLastRead(ayah.numberInSurah)}
                          style={{ color: isLastRead ? 'var(--accent-gold)' : undefined }}
                        >
                          <i className="fas fa-bookmark"></i>
                        </button>

                        <button
                          className={`verse-btn ${bookmarks[ayah.numberInSurah] ? 'active' : ''}`}
                          title="Bookmark Ayah"
                          onClick={() => toggleBookmark(ayah.numberInSurah)}
                        >
                          <i className={`${bookmarks[ayah.numberInSurah] ? 'fas' : 'far'} fa-star`}></i>
                        </button>

                        <button
                          className="verse-btn"
                          title="Copy Verse"
                          onClick={() => copyVerse(ayah.text, ayah.numberInSurah)}
                        >
                          <i className="far fa-copy"></i>
                        </button>

                        <button
                          className="verse-btn"
                          title="Play Verse Audio & Spoken Translation"
                          onClick={() => playAyahAudioAndSpokenTranslation(ayah, index)}
                        >
                          <i className="fas fa-play"></i>
                        </button>

                        <button
                          className="verse-btn"
                          title="Report Error"
                          onClick={() => openReportModal('ayah', `Surah ${selectedSurah}:${ayah.numberInSurah}`)}
                        >
                          <i className="far fa-flag"></i>
                        </button>
                      </div>
                    </div>

                    <p className="arabic-font arabic-text-render" style={{ fontSize: `${fontSize}px`, color: theme === 'dark' ? '#f8fafc' : '#000000', fontWeight: 800 }}>
                      {ayah.text}
                    </p>

                  <div className="translations-list">
                    {translations.en && translationData.en && translationData.en[index] && (
                      <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="lang-tag">EN</span>
                        <span style={{ flex: 1 }}>{translationData.en[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.en[index].text, 'en-US')} title="Listen to English voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                    {translations.ur && translationData.ur && translationData.ur[index] && (
                      <p className="translation-item arabic-font" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.1rem', color: '#047857' }}>
                        <span className="lang-tag">UR</span>
                        <span style={{ flex: 1 }}>{translationData.ur[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.ur[index].text, 'ur-PK')} title="Listen to Urdu voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                    {translations.tr && translationData.tr && translationData.tr[index] && (
                      <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="lang-tag">TR</span>
                        <span style={{ flex: 1 }}>{translationData.tr[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.tr[index].text, 'tr-TR')} title="Listen to Turkish voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                    {translations.fr && translationData.fr && translationData.fr[index] && (
                      <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="lang-tag">FR</span>
                        <span style={{ flex: 1 }}>{translationData.fr[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.fr[index].text, 'fr-FR')} title="Listen to French voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                    {translations.es && translationData.es && translationData.es[index] && (
                      <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="lang-tag">ES</span>
                        <span style={{ flex: 1 }}>{translationData.es[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.es[index].text, 'es-ES')} title="Listen to Spanish voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                    {translations.de && translationData.de && translationData.de[index] && (
                      <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="lang-tag">DE</span>
                        <span style={{ flex: 1 }}>{translationData.de[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.de[index].text, 'de-DE')} title="Listen to German voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                    {translations.id && translationData.id && translationData.id[index] && (
                      <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="lang-tag">ID</span>
                        <span style={{ flex: 1 }}>{translationData.id[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.id[index].text, 'id-ID')} title="Listen to Indonesian voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                    {translations.bn && translationData.bn && translationData.bn[index] && (
                      <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="lang-tag">BN</span>
                        <span style={{ flex: 1 }}>{translationData.bn[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.bn[index].text, 'bn-BD')} title="Listen to Bengali voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                    {translations.ru && translationData.ru && translationData.ru[index] && (
                      <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="lang-tag">RU</span>
                        <span style={{ flex: 1 }}>{translationData.ru[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.ru[index].text, 'ru-RU')} title="Listen to Russian voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                    {translations.hi && translationData.hi && translationData.hi[index] && (
                      <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="lang-tag">HI</span>
                        <span style={{ flex: 1 }}>{translationData.hi[index].text}</span>
                        <button className="verse-btn" onClick={() => speakTranslationText(translationData.hi[index].text, 'hi-IN')} title="Listen to Hindi voice">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </p>
                    )}
                  </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
