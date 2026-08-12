import React, { useState, useEffect } from 'react';
import { getBrahuiVerseTranslation, BRAHUI_SURAH_NAMES } from '../data/brahui_translations';
import { fetchWithCache } from '../utils/apiCache';
import { ALL_114_SURAHS } from '../data/quran_data';

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

const BRAHUI_FATIHAH = [
  { numberInSurah: 1, text: "الله نا پن اٹ ہرا کثیر الرّحم و مہروبان اے۔" },
  { numberInSurah: 2, text: "غٹ التائی و ستا الله کن اے ہرا ساروان عالم تانا رب اے۔" },
  { numberInSurah: 3, text: "کثیر الرّحم و مہروبان اے۔" },
  { numberInSurah: 4, text: "جزاء و سزا نا دے نا واجہ اے۔" },
  { numberInSurah: 5, text: "ننو ای تنہا نیٹ بندغی کیلا و تنہا نیٹ مددی خواسیلا۔" },
  { numberInSurah: 6, text: "نن تا سستین و مچٹ راہو شو۔" },
  { numberInSurah: 7, text: "ہمفتا راہو ہرافتا باہوٹ تیوٹ انعامات کیلا غٹ انعامی تا راہو، مفتا راہو اف ہرافتا غضب مس اے۔" }
];

const QARI_LIST = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.sudais', name: 'Sheikh Abdul Rahman Al-Sudais' },
  { id: 'ar.ghamdi', name: 'Saad Al-Ghamdi' },
  { id: 'ar.mahermuaiqly', name: 'Sheikh Maher Al-Muaiqly' },
  { id: 'ar.abdulbasitmurattal', name: 'Qari Abdul Basit (Murattal)' },
  { id: 'ar.abdulbasitmujawwad', name: 'Qari Abdul Basit (Mujawwad)' },
  { id: 'ar.minshawimurattal', name: 'Mohamed Siddiq El-Minshawi (Murattal)' },
  { id: 'ar.minshawimujawwad', name: 'Mohamed Siddiq El-Minshawi (Mujawwad)' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'ar.husarymujawwad', name: 'Mahmoud Khalil Al-Husary (Mujawwad)' },
  { id: 'ar.hudhaify', name: 'Ali Abdur-Rahman Al-Hudhaify' },
  { id: 'ar.shaatree', name: 'Abu Bakr Al-Shatri' },
  { id: 'ar.saoodshuraym', name: 'Saud Al-Shuraim' },
  { id: 'ar.yasseraldossari', name: 'Yasser Al-Dosari' },
  { id: 'ar.muhammadayyoub', name: 'Muhammad Ayyub' },
  { id: 'ar.alijaber', name: 'Sheikh Ali Jaber' },
  { id: 'ar.abdullahbasfar', name: 'Abdullah Basfar' },
  { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali Al-Ajamy' },
  { id: 'ar.hanrifai', name: 'Hani Ar-Rifai' },
  { id: 'ar.ibrahimakhdar', name: 'Ibrahim Al-Akhdar' },
  { id: 'ar.mahmoudalibanna', name: 'Mahmoud Ali Al-Banna' },
  { id: 'ar.abdulmohsenalqasim', name: 'Abdul Muhsin Al-Qasim' },
  { id: 'ar.salahalbudair', name: 'Salah Al-Budair' },
  { id: 'ar.mohammadaltablawi', name: 'Mohammad al-Tablawi' },
  { id: 'ar.abdullahawadaljuhany', name: 'Abdullah Awad Al-Juhany' },
  { id: 'ar.nasseralqatami', name: 'Nasser Al-Qatami' },
  { id: 'ar.khalidalkahtani', name: 'Khalid Al-Qahtani' },
  { id: 'ar.bandarbaleela', name: 'Bandar Baleela' },
  { id: 'ar.mustafaismail', name: 'Mustafa Ismail' },
  { id: 'ar.yasseralqurashi', name: 'Yasser Al-Qurashi' },
  { id: 'ar.salahalhashem', name: 'Salah Al-Hashem' },
  { id: 'ar.sahlyasin', name: 'Sahl Yasin' },
  { id: 'ar.muhammadjibreel', name: 'Muhammad Jibreel' },
  { id: 'ar.salahbukhatir', name: 'Salah Bukhatir' },
  { id: 'ar.khalifaaltunaiji', name: 'Khalifa Al-Tunaiji' },
  { id: 'ar.ahmedneana', name: 'Ahmed Neana' },
  { id: 'ar.abdulazizazzahrani', name: 'Abdul Aziz Az-Zahrani' },
  { id: 'ar.adelryyan', name: 'Adel Ryyan' },
  { id: 'ar.hatemfarid', name: 'Hatem Farid Al-Waer' },
  { id: 'ar.idreesabkar', name: 'Idrees Abkar' },
  { id: 'ar.khaledjaleel', name: 'Khalid Al-Jaleel' },
  { id: 'ar.nabilrifai', name: 'Nabil Ar-Rifai' },
  { id: 'ar.abdullahkhalaf', name: 'Abdullah Khalaf' },
  { id: 'ar.akramalalaqmi', name: 'Akram Al-Alaqmi' },
  { id: 'ar.zakidaghistani', name: 'Zaki Daghistani' }
];

const toArabicNumerals = (num) => {
  if (!num && num !== 0) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[parseInt(d, 10)] || d).join('');
};

export default function ReadView({ user, playTrack, openReportModal }) {
  const { lang } = useLanguage();
  const [surahsList, setSurahsList] = useState(ALL_114_SURAHS);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [surahData, setSurahData] = useState(FALLBACK_FATIHAH);

  // Main Modes: 'only_quran' (Pure Quran Pak Text, no voice) | 'with_translation' (Quran + Tarjuma)
  const [readMode, setReadMode] = useState('with_translation');

  // Quran Only Sub-Mode: 'page_view' (Continuous Mushaf Page View like Image 3) | 'ayah_view' (Verse-by-Verse)
  const [quranSubMode, setQuranSubMode] = useState('page_view');

  // Translation Sub-Modes: 'audio_and_text' (Multi-Qari MP3 + Spoken Voice) | 'text_only_translation' (Pure Quran + Translation text, no audio)
  const [translationSubMode, setTranslationSubMode] = useState('audio_and_text');

  // Selected Qari for MP3 Tilawat
  const [selectedQari, setSelectedQari] = useState('ar.alafasy');

  // Active Translations (English, Urdu, Brahui)
  const [translations, setTranslations] = useState(() => ({
    en: lang === 'en',
    ur: lang === 'ur' || lang === 'br',
    br: lang === 'br'
  }));

  useEffect(() => {
    if (lang === 'ur') {
      setTranslations({ en: false, ur: true, br: false });
    } else if (lang === 'br') {
      setTranslations({ en: false, ur: true, br: true });
    } else if (lang === 'ar') {
      setTranslations({ en: false, ur: false, br: false });
    } else {
      setTranslations({ en: true, ur: false, br: false });
    }
  }, [lang]);

  const [translationData, setTranslationData] = useState({ en: FALLBACK_ENGLISH_FATIHAH });
  const [fontSize, setFontSize] = useState(28);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState({});
  const [surahFilter, setSurahFilter] = useState('');
  const [theme, setTheme] = useState('light'); // 'light' | 'sepia' | 'dark' | 'custom'
  const [readerBgColor, setReaderBgColor] = useState('#ffffff');
  const [translationTextColor, setTranslationTextColor] = useState('#000000');
  const [arabicTextColor, setArabicTextColor] = useState('#000000');
  const [topicFilter, setTopicFilter] = useState('');

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'light') {
      setReaderBgColor('#ffffff');
      setTranslationTextColor('#000000');
      setArabicTextColor('#000000');
    } else if (newTheme === 'sepia') {
      setReaderBgColor('#fbf0d9');
      setTranslationTextColor('#432818');
      setArabicTextColor('#2b1704');
    } else if (newTheme === 'dark') {
      setReaderBgColor('#0f172a');
      setTranslationTextColor('#38bdf8');
      setArabicTextColor('#ffffff');
    }
  };
  const [autoSpeakTranslation, setAutoSpeakTranslation] = useState(true);

  const [lastReadPosition, setLastReadPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('quranLastRead');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    fetchWithCache('https://api.alquran.cloud/v1/surah')
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

  // Fetch Surah Arabic Text with Caching
  useEffect(() => {
    setLoading(true);

    fetchWithCache(`https://api.alquran.cloud/v1/surah/${selectedSurah}`)
      .then(data => {
        if (data && data.data && data.data.ayahs && data.data.ayahs.length > 0) {
          setSurahData(data.data);
        } else if (!surahData) {
          setSurahData(FALLBACK_FATIHAH);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!surahData) {
          setSurahData(FALLBACK_FATIHAH);
          setTranslationData(prev => ({ ...prev, en: FALLBACK_ENGLISH_FATIHAH }));
        }
        setLoading(false);
      });
  }, [selectedSurah]);

  // Fetch English & Urdu Translations dynamically for selectedSurah with Caching
  useEffect(() => {
    setTranslationData({});

    if (translations.en) {
      fetchWithCache(`https://api.alquran.cloud/v1/surah/${selectedSurah}/en.sahih`)
        .then(data => {
          if (data && data.data && data.data.ayahs) {
            setTranslationData(prev => ({ ...prev, en: data.data.ayahs }));
          }
        })
        .catch(() => {});
    }

    if (translations.ur) {
      fetchWithCache(`https://api.alquran.cloud/v1/surah/${selectedSurah}/ur.jalandhry`)
        .then(data => {
          if (data && data.data && data.data.ayahs) {
            setTranslationData(prev => ({ ...prev, ur: data.data.ayahs }));
          }
        })
        .catch(() => {});
    }
  }, [selectedSurah, translations.en, translations.ur]);

  // Helper for English Translation
  const getEnglishTranslationText = (index) => {
    if (translationData.en && translationData.en[index] && translationData.en[index].text) {
      return translationData.en[index].text;
    }
    if (selectedSurah === 1 && FALLBACK_ENGLISH_FATIHAH[index]) {
      return FALLBACK_ENGLISH_FATIHAH[index].text;
    }
    return `[English Surah ${selectedSurah}:${index + 1}] In the name of Allah, Most Gracious, Most Merciful. Praise be to Allah, Lord of the Worlds.`;
  };

  // Helper for Urdu Translation
  const getUrduTranslationText = (index) => {
    if (translationData.ur && translationData.ur[index] && translationData.ur[index].text) {
      return translationData.ur[index].text;
    }
    const URDU_FATIHAH = [
      "شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔",
      "سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پرورش کرنے والا ہے۔",
      "نہایت مہربان، بہت رحم کرنے والا ہے۔",
      "روزِ جزا کا مالک ہے۔",
      "ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد چاہتے ہیں۔",
      "ہمیں سیدھے راستے کی ہدایت فرما۔",
      "ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا۔"
    ];
    if (selectedSurah === 1 && URDU_FATIHAH[index]) {
      return URDU_FATIHAH[index];
    }
    return `اردو ترجمہ (آیت ${index + 1}): شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔ بیشک اللہ تعالی تمام جہانوں کا مالک و پروردگار ہے۔`;
  };

  // Helper for Brahui Translation from PDF
  const getBrahuiTranslationText = (ayahIndex, ayahText) => {
    return getBrahuiVerseTranslation(selectedSurah, ayahIndex, ayahText);
  };

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

  const copyVerse = (arabicText, ayahNumber, ayahIndex = 0) => {
    const engText = getEnglishTranslationText(ayahIndex);
    const urdText = getUrduTranslationText(ayahIndex);
    const fullText = `Surah ${activeSurahMeta.name} [Ayah ${selectedSurah}:${ayahNumber}]\n\n${arabicText}\n\nEnglish: ${engText}\nUrdu: ${urdText}\n\nRead on Maktaba Tul Muslim: https://maktabatulmuslim.com`;
    navigator.clipboard.writeText(fullText);
    alert(`Surah ${activeSurahMeta.name} Verse ${ayahNumber} copied to clipboard!`);
  };

  const shareVerse = (arabicText, ayahNumber, ayahIndex = 0) => {
    const engText = getEnglishTranslationText(ayahIndex);
    const urdText = getUrduTranslationText(ayahIndex);
    const fullText = `Surah ${activeSurahMeta.name} [Ayah ${selectedSurah}:${ayahNumber}]\n\n${arabicText}\n\nEnglish: ${engText}\nUrdu: ${urdText}\n\nRead on Maktaba Tul Muslim: https://maktabatulmuslim.com`;
    if (navigator.share) {
      navigator.share({
        title: `Surah ${activeSurahMeta.name} Verse ${ayahNumber}`,
        text: fullText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(fullText);
      alert(`Surah ${activeSurahMeta.name} Verse ${ayahNumber} copied to clipboard!`);
    }
  };

  const speakTranslationText = (text, langCode = 'en-US') => {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  // Play Scenario: First Arabic Quran MP3 in selected Qari's voice, then automatically speak translation voices (English, Urdu, Brahui) in sequence
  const playAyahAudioAndSpokenTranslation = (ayah, index) => {
    const activeMeta = surahsList.find(s => s.number === selectedSurah) || { name: `Surah ${selectedSurah}` };
    const qariObj = QARI_LIST.find(q => q.id === selectedQari) || QARI_LIST[0];

    const speakTranslationAfterTilawat = () => {
      if (!autoSpeakTranslation || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      const speechQueue = [];

      // 1. English Spoken Voice (if checked)
      if (translations.en && translationData.en && translationData.en[index]) {
        const enText = translationData.en[index].text;
        if (enText) {
          const uEn = new SpeechSynthesisUtterance(enText);
          uEn.lang = 'en-US';
          uEn.rate = 0.9;
          speechQueue.push(uEn);
        }
      }

      // 2. Urdu Spoken Voice (if checked)
      if (translations.ur && translationData.ur && translationData.ur[index]) {
        const urText = translationData.ur[index].text;
        if (urText) {
          const uUr = new SpeechSynthesisUtterance(urText);
          uUr.lang = 'ur-PK';
          uUr.rate = 0.9;
          speechQueue.push(uUr);
        }
      }

      // 3. Brahui Spoken Voice (if checked)
      if (translations.br) {
        const brText = getBrahuiTranslationText(index, ayah.text);
        if (brText) {
          const uBr = new SpeechSynthesisUtterance(brText);
          uBr.lang = 'ur-PK';
          uBr.rate = 0.85;
          speechQueue.push(uBr);
        }
      }

      // Chain speech utterances one by one seamlessly
      if (speechQueue.length > 0) {
        for (let i = 0; i < speechQueue.length - 1; i++) {
          speechQueue[i].onend = () => {
            window.speechSynthesis.speak(speechQueue[i + 1]);
          };
        }
        window.speechSynthesis.speak(speechQueue[0]);
      }
    };

    // Play Arabic Quran MP3 first in selected Qari's voice
    playTrack(
      `https://cdn.islamic.network/quran/audio/128/${selectedQari}/${ayah.number}.mp3`,
      `Surah ${activeMeta.name} (${selectedSurah}:${ayah.numberInSurah})`,
      `${qariObj.name} (Tilawat)`,
      speakTranslationAfterTilawat
    );
  };

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

    // Sync last read position to backend user profile if logged in
    if (user) {
      fetch('/api/user/preferences/update/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ last_read_surah: selectedSurah, last_read_ayah: ayahNumber })
      });
    }

    alert(`Saved last read position: Surah ${pos.surahName} (Ayah ${ayahNumber}) to your account!`);
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
  const currentQariObj = QARI_LIST.find(q => q.id === selectedQari) || QARI_LIST[0];

  return (
    <div className="container" style={{ margin: '1.5rem auto' }}>

      {/* ===== TOP SECTION: MAIN MODE SELECTION BUTTONS ===== */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem', background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', color: '#fff', border: '2px solid var(--accent-gold)', borderRadius: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
              <i className="fas fa-quran"></i> {t('quranPortalTitle')}
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: '0.25rem', lineHeight: '1.4' }}>
              {t('readQuranSub')}
            </p>
          </div>

          {/* Main Mode Buttons - Unified Website Gold/Emerald Styling & Hover */}
          <div className="quran-mode-btn-container">
            <button
              className={`quran-mode-btn ${readMode === 'only_quran' ? 'active' : 'inactive'}`}
              onClick={() => setReadMode('only_quran')}
            >
              <i className="fas fa-book-open"></i>
              <span>{t('readQuranOnly')}</span>
            </button>

            <button
              className={`quran-mode-btn ${readMode === 'with_translation' ? 'active' : 'inactive'}`}
              onClick={() => setReadMode('with_translation')}
            >
              <i className="fas fa-language"></i>
              <span>{t('quranWithTarjuma')}</span>
            </button>
          </div>
        </div>

        {/* Translation Sub-Modes (Shown when 'with_translation' is active) */}
        {readMode === 'with_translation' && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.18)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <i className="fas fa-sliders-h"></i> Translation Options:
            </span>

            {/* Side-by-Side Option Pills - Unified Button Styling */}
            <div className="quran-submode-btn-container">
              {/* Sub-Mode 2A: Multi-Qari Voice + Spoken Translation */}
              <button
                className={`quran-submode-btn ${translationSubMode === 'audio_and_text' ? 'active' : 'inactive'}`}
                onClick={() => setTranslationSubMode('audio_and_text')}
              >
                <i className="fas fa-headphones-alt"></i>
                <span>{t('audioAndSpoken')}</span>
              </button>

              {/* Sub-Mode 2B: Text + Translation Only (No Audio MP3) */}
              <button
                className={`quran-submode-btn ${translationSubMode === 'text_only_translation' ? 'active' : 'inactive'}`}
                onClick={() => setTranslationSubMode('text_only_translation')}
              >
                <i className="fas fa-file-alt"></i>
                <span>{t('textOnlyTarjuma')}</span>
              </button>
            </div>

            {/* Qari Selection Bar (Compact Width on PC) */}
            {translationSubMode === 'audio_and_text' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  <i className="fas fa-user-circle" style={{ color: 'var(--accent-gold)' }}></i> {t('selectQariLabel')}
                </span>
                <select
                  value={selectedQari}
                  onChange={(e) => setSelectedQari(e.target.value)}
                  className="qari-select-dropdown"
                  style={{
                    width: 'auto',
                    minWidth: '220px',
                    maxWidth: '280px',
                    padding: '0.38rem 0.75rem',
                    borderRadius: '14px',
                    border: '1px solid var(--accent-gold)',
                    background: '#011c16',
                    color: 'var(--accent-gold)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {QARI_LIST.map(q => (
                    <option key={q.id} value={q.id}>{q.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="read-view-layout">
        {/* Left Sidebar: Surah Selector */}
        <div className="card" style={{ padding: '1rem', maxHeight: '800px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}><i className="fas fa-list"></i> {t('selectSurahLabel')}</h3>

          <input
            type="text"
            className="form-input"
            placeholder={t('searchSurahAudioPlaceholder')}
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
          {/* Reader Controls Bar */}
          <div className="card read-controls-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.25rem', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>Surah {activeSurahMeta.name} ({activeSurahMeta.englishName})</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {activeSurahMeta.type} &bull; {activeSurahMeta.ayahs} Verses &bull; Mode: {readMode === 'only_quran' ? (quranSubMode === 'page_view' ? 'Continuous Mushaf Page View (Pure Quran)' : 'Verse-by-Verse (Pure Quran)') : (translationSubMode === 'audio_and_text' ? `Audio MP3 (${currentQariObj.name}) + Spoken Translation` : 'Text & Translation Only')}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Quran Only Sub-Mode Toggle (Page View vs Verse View) */}
              {readMode === 'only_quran' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '20px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Layout:</span>
                  <button
                    onClick={() => setQuranSubMode('page_view')}
                    style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, border: 'none', background: quranSubMode === 'page_view' ? 'var(--primary-dark)' : 'transparent', color: quranSubMode === 'page_view' ? 'var(--accent-gold)' : '#1e293b', cursor: 'pointer' }}
                  >
                    <i className="fas fa-file-alt"></i> {t('pageViewContinuous')}
                  </button>
                  <button
                    onClick={() => setQuranSubMode('ayah_view')}
                    style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, border: 'none', background: quranSubMode === 'ayah_view' ? 'var(--primary-dark)' : 'transparent', color: quranSubMode === 'ayah_view' ? 'var(--accent-gold)' : '#1e293b', cursor: 'pointer' }}
                  >
                    <i className="fas fa-list-ol"></i> {t('verseByVerseView')}
                  </button>
                </div>
              )}

              {/* Reading Theme Selector (Light, Sepia, Dark) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Theme:</span>
                <button
                  onClick={() => handleSetTheme('light')}
                  style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: theme === 'light' ? '#ffffff' : 'transparent', color: '#1e293b', cursor: 'pointer' }}
                >Light</button>
                <button
                  onClick={() => handleSetTheme('sepia')}
                  style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: theme === 'sepia' ? '#fbf0d9' : 'transparent', color: '#432818', cursor: 'pointer' }}
                >Sepia</button>
                <button
                  onClick={() => handleSetTheme('dark')}
                  style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: theme === 'dark' ? '#0f172a' : 'transparent', color: '#f8fafc', cursor: 'pointer' }}
                >Dark</button>
              </div>

              {/* Custom Background Color Picker */}
              <div className="color-picker-badge" title="Change Reader Background Color">
                <i className="fas fa-fill-drip" style={{ color: 'var(--accent-gold)' }}></i>
                <span>BG:</span>
                <input
                  type="color"
                  className="color-picker-input"
                  value={readerBgColor}
                  onChange={(e) => { setReaderBgColor(e.target.value); setTheme('custom'); }}
                />
              </div>

              {/* Custom Translation Color Picker */}
              <div className="color-picker-badge" title="Change Translation Text Color">
                <i className="fas fa-font" style={{ color: 'var(--primary-emerald)' }}></i>
                <span>Translation:</span>
                <input
                  type="color"
                  className="color-picker-input"
                  value={translationTextColor}
                  onChange={(e) => setTranslationTextColor(e.target.value)}
                />
              </div>

              {/* Custom Arabic Text Color Picker */}
              <div className="color-picker-badge" title="Change Arabic Text Color">
                <i className="fas fa-palette" style={{ color: 'var(--accent-gold-dark)' }}></i>
                <span>Arabic:</span>
                <input
                  type="color"
                  className="color-picker-input"
                  value={arabicTextColor}
                  onChange={(e) => setArabicTextColor(e.target.value)}
                />
              </div>

              {/* Font Size Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Font:</span>
                <button className="verse-btn" style={{ width: '26px', height: '26px' }} onClick={() => setFontSize(Math.max(18, fontSize - 2))}>-</button>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 4px' }}>{fontSize}px</span>
                <button className="verse-btn" style={{ width: '26px', height: '26px' }} onClick={() => setFontSize(Math.min(46, fontSize + 2))}>+</button>
              </div>

              {/* Translation Languages Selection (English, Urdu, Brahui) */}
              {readMode === 'with_translation' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', flexWrap: 'wrap', background: '#f8fafc', padding: '4px 10px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>Translations:</span>
                  <label style={{ cursor: 'pointer', fontWeight: 600, color: '#1e293b' }}>
                    <input type="checkbox" checked={translations.en} onChange={(e) => setTranslations({ ...translations, en: e.target.checked })} /> English
                  </label>
                  <label style={{ cursor: 'pointer', fontWeight: 600, color: '#047857' }}>
                    <input type="checkbox" checked={translations.ur} onChange={(e) => setTranslations({ ...translations, ur: e.target.checked })} /> Urdu
                  </label>
                  <label style={{ cursor: 'pointer', fontWeight: 700, color: '#b45309' }}>
                    <input type="checkbox" checked={translations.br} onChange={(e) => setTranslations({ ...translations, br: e.target.checked })} /> Brahui (براہوئی)
                  </label>
                </div>
              )}

              {/* Play Surah Full Audio Button (Shown only when in translation mode with audio) */}
              {readMode === 'with_translation' && translationSubMode === 'audio_and_text' && (
                <button
                  className="btn-play"
                  onClick={() => playTrack(`https://server8.mp3quran.net/afs/${selectedSurah < 10 ? '00' + selectedSurah : (selectedSurah < 100 ? '0' + selectedSurah : selectedSurah)}.mp3`, `Surah ${activeSurahMeta.name}`, currentQariObj.name)}
                >
                  <i className="fas fa-play"></i> Play Full Surah ({currentQariObj.name.split(' ')[0]})
                </button>
              )}
            </div>
          </div>

          {/* ===== CONTINUOUS MUSHAF PAGE VIEW (EXACTLY LIKE IMAGE 3) ===== */}
          {readMode === 'only_quran' && quranSubMode === 'page_view' ? (
            <div className="card mushaf-page-container" style={{ background: readerBgColor, color: arabicTextColor, padding: '2.5rem 2rem', borderRadius: '16px', border: theme === 'dark' ? '1px solid rgba(245,158,11,0.4)' : '1px solid #cbd5e1', boxShadow: '0 12px 40px rgba(0,0,0,0.25)', transition: 'all 0.3s ease' }}>
              {/* Surah Header Title */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: theme === 'dark' ? '1px solid rgba(245,158,11,0.3)' : '1px solid #e2e8f0' }}>
                <h2 className="arabic-font" style={{ fontSize: '2.2rem', fontWeight: 800, color: theme === 'dark' ? 'var(--accent-gold)' : 'var(--primary-dark)' }}>
                  سُورَةُ {activeSurahMeta.arabic}
                </h2>
                <p style={{ fontSize: '0.85rem', color: theme === 'dark' ? '#cbd5e1' : 'var(--text-muted)' }}>
                  Surah {activeSurahMeta.name} ({activeSurahMeta.englishName}) &bull; {activeSurahMeta.type} &bull; {activeSurahMeta.ayahs} Verses
                </p>
              </div>

              {/* Bismillah Header (if not Surah 9) */}
              {selectedSurah !== 9 && selectedSurah !== 1 && (
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                  <p className="arabic-font" style={{ fontSize: `${Math.min(fontSize + 6, 44)}px`, color: theme === 'dark' ? 'var(--accent-gold)' : 'var(--primary-emerald)', fontWeight: 700 }}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
              )}

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1.5rem 0' }}>
                  <div className="skeleton-line-title skeleton-shimmer" style={{ margin: '0 auto', width: '45%' }}></div>
                  <div className="skeleton-line skeleton-shimmer"></div>
                  <div className="skeleton-line skeleton-shimmer"></div>
                  <div className="skeleton-line skeleton-shimmer" style={{ width: '85%' }}></div>
                  <div className="skeleton-line skeleton-shimmer"></div>
                  <div className="skeleton-line skeleton-shimmer" style={{ width: '70%' }}></div>
                </div>
              ) : (
                /* Continuous Mushaf Flowing Text (Matching Image 3!) */
                <div
                  className="arabic-font mushaf-continuous-text dark-word-black"
                  style={{
                    fontSize: `${fontSize}px`,
                    color: arabicTextColor,
                    lineHeight: '2.5',
                    textAlign: 'justify',
                    direction: 'rtl',
                    fontWeight: 700,
                    wordSpacing: '2px'
                  }}
                >
                  {surahData && surahData.ayahs && surahData.ayahs.map((ayah) => (
                    <span key={ayah.numberInSurah} style={{ display: 'inline' }}>
                      {ayah.text}{' '}
                      <span
                        className="mushaf-verse-badge"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-gold)',
                          fontSize: `${Math.max(16, fontSize - 6)}px`,
                          margin: '0 6px',
                          fontWeight: 800,
                          fontFamily: "'Amiri', serif"
                        }}
                      >
                        {`﴿${toArabicNumerals(ayah.numberInSurah)}﴾`}
                      </span>{' '}
                    </span>
                  ))}
                </div>
              )}

              {/* Page Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0' }}>
                <button
                  className="btn-play"
                  disabled={selectedSurah <= 1}
                  onClick={() => setSelectedSurah(selectedSurah - 1)}
                  style={{ opacity: selectedSurah <= 1 ? 0.5 : 1, padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                >
                  <i className="fas fa-arrow-right"></i> Previous Surah
                </button>

                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: theme === 'dark' ? 'var(--accent-gold)' : 'var(--primary-dark)' }}>
                  Page View &bull; Surah {selectedSurah} of 114
                </span>

                <button
                  className="btn-play"
                  disabled={selectedSurah >= 114}
                  onClick={() => setSelectedSurah(selectedSurah + 1)}
                  style={{ opacity: selectedSurah >= 114 ? 0.5 : 1, padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Next Surah <i className="fas fa-arrow-left"></i>
                </button>
              </div>
            </div>
          ) : (
            /* ===== VERSE-BY-VERSE TRANSLATION / READING VIEW ===== */
            <div className="verse-by-verse-container">
              {/* Bismillah Header if not Surah 9 */}
              {selectedSurah !== 9 && selectedSurah !== 1 && (
                <div style={{ textAlign: 'center', padding: '1.5rem', background: readerBgColor, color: arabicTextColor, borderRadius: '12px', marginBottom: '1rem', border: '1px solid #cbd5e1' }}>
                  <p className="arabic-font" style={{ fontSize: '2.2rem', color: theme === 'dark' ? 'var(--accent-gold)' : 'var(--primary-emerald)', fontWeight: 700 }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                </div>
              )}

              <div className="card" style={{ background: readerBgColor, color: arabicTextColor, border: '1px solid #cbd5e1', transition: 'all 0.3s ease' }}>
                {loading ? (
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="skeleton-card">
                        <div className="skeleton-line-title skeleton-shimmer"></div>
                        <div className="skeleton-line skeleton-shimmer" style={{ height: '24px' }}></div>
                        <div className="skeleton-line skeleton-shimmer"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  surahData && surahData.ayahs && surahData.ayahs.map((ayah, index) => {
                    const isLastRead = lastReadPosition && lastReadPosition.surahNumber === selectedSurah && lastReadPosition.ayahNumber === ayah.numberInSurah;
                    const brTranslationText = getBrahuiTranslationText(index, ayah.text);

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
                              title="Copy Ayah & Translation"
                              onClick={() => copyVerse(ayah.text, ayah.numberInSurah, index)}
                            >
                              <i className="far fa-copy"></i>
                            </button>

                            <button
                              className="verse-btn"
                              title="Share Ayah & Translation"
                              onClick={() => shareVerse(ayah.text, ayah.numberInSurah, index)}
                            >
                              <i className="fas fa-share-alt"></i>
                            </button>

                            {/* Play MP3 Ayah & Spoken Translation (Only shown in Audio Translation Mode) */}
                            {readMode === 'with_translation' && translationSubMode === 'audio_and_text' && (
                              <button
                                className="verse-btn"
                                title={`Play Verse MP3 (${currentQariObj.name}) & Spoken Translation`}
                                onClick={() => playAyahAudioAndSpokenTranslation(ayah, index)}
                              >
                                <i className="fas fa-play"></i>
                              </button>
                            )}

                            <button
                              className="verse-btn"
                              title="Report Error"
                              onClick={() => openReportModal('ayah', `Surah ${selectedSurah}:${ayah.numberInSurah}`)}
                            >
                              <i className="far fa-flag"></i>
                            </button>
                          </div>
                        </div>

                        {/* Arabic Verse Text */}
                        <p className="arabic-font arabic-text-render dark-word-black" style={{ fontSize: `${fontSize}px`, color: arabicTextColor, fontWeight: 800, lineSpacing: '1.8' }}>
                          {ayah.text}
                        </p>

                        {/* Translation Section (Only shown when readMode === 'with_translation') */}
                        {readMode === 'with_translation' && (
                          <div className="translations-list" style={{ marginTop: '0.85rem' }}>
                            {/* English Translation */}
                            {translations.en && (
                              <p className="translation-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: translationTextColor }}>
                                <span className="lang-tag" style={{ background: '#0284c7', color: '#fff' }}>EN</span>
                                <span style={{ flex: 1, color: translationTextColor }}>{getEnglishTranslationText(index)}</span>
                                {translationSubMode === 'audio_and_text' && (
                                  <button className="verse-btn" onClick={() => speakTranslationText(getEnglishTranslationText(index), 'en-US')} title="Listen to English voice">
                                    <i className="fas fa-volume-up"></i>
                                  </button>
                                )}
                              </p>
                            )}

                            {/* Urdu Translation */}
                            {translations.ur && (
                              <p className="translation-item arabic-font" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.15rem', color: translationTextColor }}>
                                <span className="lang-tag" style={{ background: '#047857', color: '#fff', fontSize: '0.7rem' }}>UR</span>
                                <span style={{ flex: 1, color: translationTextColor }}>{getUrduTranslationText(index)}</span>
                                {translationSubMode === 'audio_and_text' && (
                                  <button className="verse-btn" onClick={() => speakTranslationText(getUrduTranslationText(index), 'ur-PK')} title="Listen to Urdu voice">
                                    <i className="fas fa-volume-up"></i>
                                  </button>
                                )}
                              </p>
                            )}

                            {/* Brahui Translation */}
                            {translations.br && (
                              <p className="translation-item arabic-font" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.15rem', color: translationTextColor }}>
                                <span className="lang-tag" style={{ background: '#b45309', color: '#fff', fontSize: '0.7rem' }}>BR</span>
                                <span style={{ flex: 1, color: translationTextColor }}>{brTranslationText}</span>
                                {translationSubMode === 'audio_and_text' && (
                                  <button className="verse-btn" onClick={() => speakTranslationText(brTranslationText, 'ur-PK')} title="Listen to Brahui voice">
                                    <i className="fas fa-volume-up"></i>
                                  </button>
                                )}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
