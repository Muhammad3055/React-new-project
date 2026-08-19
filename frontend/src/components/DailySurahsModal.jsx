import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, Volume2, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DAILY_WAZAIF = [
  {
    id: 0,
    day: { en: "Sunday", ur: "اتوار", ar: "الأحد", br: "یک شنبے" },
    surah_number: 36,
    surah_name: { en: "Surah Ya-Sin", ur: "سورۃ یس", ar: "سورة يس", br: "سورة يس" },
    themeColor: '#8b5cf6',
    icon: <Heart size={18} />,
    purpose: {
      en: "For all needs, forgiveness, and solving difficulties.",
      ur: "ہر حاجت کی تکمیل، بخشش اور مشکلات کے حل کے لیے۔",
      ar: "لقضاء الحوائج والمغفرة وحل الصعوبات.",
      br: "ہر حاجت نا پورو مننگ، بخشش و مشکل آتا حل کن."
    },
    audio_url: 'https://server7.mp3quran.net/s_gmd/036.mp3',
    reciter: 'Saad Al-Ghamdi',
  },
  {
    id: 1,
    day: { en: "Monday", ur: "پیر", ar: "الاثنين", br: "دوشنبے" },
    surah_number: 56,
    surah_name: { en: "Surah Al-Waqi'ah", ur: "سورۃ الواقعۃ", ar: "سورة الواقعة", br: "سورة الواقعة" },
    themeColor: '#10b981',
    icon: <Sparkles size={18} />,
    purpose: {
      en: "For protection against poverty and increasing sustenance (Rizq).",
      ur: "غربت سے بچاؤ اور رزق میں برکت و فراوانی کے لیے۔",
      ar: "للحماية من الفقر وزيادة الرزق والبركة.",
      br: "نیزگاری آن رکھ و رزق اٹی برکت و ودکی کن."
    },
    audio_url: 'https://server8.mp3quran.net/afs/056.mp3',
    reciter: 'Mishary Rashid Alafasy',
  },
  {
    id: 2,
    day: { en: "Tuesday", ur: "منگل", ar: "الثلاثاء", br: "سہ شنبے" },
    surah_number: 55,
    surah_name: { en: "Surah Ar-Rahman", ur: "سورۃ الرحمٰن", ar: "سورة الرحمن", br: "سورة الرحمن" },
    themeColor: '#ec4899',
    icon: <Heart size={18} />,
    purpose: {
      en: "For gaining Allah's mercy, gratitude, and inner peace.",
      ur: "اللہ کی رحمت، شکرگزاری اور دلی سکون حاصل کرنے کے لیے۔",
      ar: "لنيل رحمة الله والشكر وطمأنينة القلب.",
      br: "اللہ نا رحمت، شکر گزاری و است نا سکون کن."
    },
    audio_url: 'https://server8.mp3quran.net/afs/055.mp3',
    reciter: 'Mishary Rashid Alafasy',
  },
  {
    id: 3,
    day: { en: "Wednesday", ur: "بدھ", ar: "الأربعاء", br: "چار شنبے" },
    surah_number: 73,
    surah_name: { en: "Surah Al-Muzzammil", ur: "سورۃ المزمل", ar: "سورة المزمل", br: "سورة المزمل" },
    themeColor: '#3b82f6',
    icon: <ShieldCheck size={18} />,
    purpose: {
      en: "For spiritual strength, ease in matters, and reducing hardships.",
      ur: "روحانی طاقت، معاملات میں آسانی اور مشکلات کو کم کرنے کے لیے۔",
      ar: "للقوة الروحية وتيسير الأمور وتخفيف الصعوبات.",
      br: "روحانی طاقت، کاریم تے ٹی آسانی و مشکل آتے کم کننگ کن."
    },
    audio_url: 'https://server8.mp3quran.net/afs/073.mp3',
    reciter: 'Mishary Rashid Alafasy',
  },
  {
    id: 4,
    day: { en: "Thursday", ur: "جمعرات", ar: "الخميس", br: "پنج شنبے" },
    surah_number: 44,
    surah_name: { en: "Surah Ad-Dukhan", ur: "سورۃ الدخان", ar: "سورة الدخان", br: "سورة الدخان" },
    themeColor: '#f59e0b',
    icon: <Sparkles size={18} />,
    purpose: {
      en: "For forgiveness of sins and protection. 70,000 angels pray for forgiveness.",
      ur: "گناہوں کی معافی اور حفاظت کے لیے۔ 70 ہزار فرشتے مغفرت کی دعا کرتے ہیں۔",
      ar: "لمغفرة الذنوب والحفظ. يستغفر له ٧٠ ألف ملك.",
      br: "گناہ تا معافی و رکھ کن. 70 ہزار فرشتہ معافی نا دعا کیرہ."
    },
    audio_url: 'https://server8.mp3quran.net/afs/044.mp3',
    reciter: 'Mishary Rashid Alafasy',
  },
  {
    id: 5,
    day: { en: "Friday", ur: "جمعہ", ar: "الجمعة", br: "جمعہ" },
    surah_number: 18,
    surah_name: { en: "Surah Al-Kahf", ur: "سورۃ الکہف", ar: "سورة الكهف", br: "سورة الكهف" },
    themeColor: '#059669',
    icon: <ShieldCheck size={18} />,
    purpose: {
      en: "Protection from Dajjal and a light shining between the two Fridays.",
      ur: "دجال کے فتنے سے حفاظت اور دو جمعوں کے درمیان نور کی چمک کے لیے۔",
      ar: "للحماية من الدجال ونور يضيء له ما بين الجمعتين.",
      br: "دجال نا فتنہ غان رکھ و اِرا جمعہ نا دریان اٹی نور نا چمک کن."
    },
    audio_url: 'https://server8.mp3quran.net/afs/018.mp3',
    reciter: 'Mishary Rashid Alafasy',
  },
  {
    id: 6,
    day: { en: "Saturday", ur: "ہفتہ", ar: "السبت", br: "ہفتہ" },
    surah_number: 67,
    surah_name: { en: "Surah Al-Mulk", ur: "سورۃ الملک", ar: "سورة الملك", br: "سورة الملك" },
    themeColor: '#6366f1',
    icon: <ShieldCheck size={18} />,
    purpose: {
      en: "Intercedes for the reciter and protects from the punishment of the grave.",
      ur: "تلاوت کرنے والے کی شفاعت کرتی ہے اور عذابِ قبر سے بچاتی ہے۔",
      ar: "تشفع لقارئها وتنجيه من عذاب القبر.",
      br: "خوانوک نا شفاعت ءِ کیک و قبر نا عذاب آن بچائفک."
    },
    audio_url: 'https://server8.mp3quran.net/afs/067.mp3',
    reciter: 'Mishary Rashid Alafasy',
  }
];

export default function DailySurahsModal({ isOpen, onClose, playTrack }) {
  const { lang } = useLanguage();
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // 0 = Sunday, 1 = Monday, ... 6 = Saturday
      const currentDay = new Date().getDay();
      setActiveDay(currentDay);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTrans = (obj) => {
    if (!obj) return "";
    return obj[lang] || obj['en'] || obj['ur'] || obj['ar'];
  };

  const handlePlay = (surah) => {
    if (playTrack) {
      playTrack(surah.audio_url, getTrans(surah.surah_name), surah.reciter);
    }
  };

  const isRtl = lang === 'ur' || lang === 'ar' || lang === 'br';
  const fontFam = lang === 'ur' || lang === 'br' ? 'Jameel Noori Nastaleeq, sans-serif' : lang === 'ar' ? 'Amiri, serif' : 'inherit';

  const currentSurah = DAILY_WAZAIF.find(s => s.id === activeDay);

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999998,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%', maxWidth: '650px', maxHeight: '92vh',
          background: 'linear-gradient(145deg, #0f172a 0%, #09090b 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          color: '#fff',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          direction: isRtl ? 'rtl' : 'ltr'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Calendar size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', fontFamily: fontFam }}>
                {getTrans({
                  en: "Daily Recommended Surahs",
                  ur: "روزانہ کی مسنون سورتیں",
                  ar: "السور اليومية الموصى بها",
                  br: "ہر دے نا مسنون آ سورت آک"
                })}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontFamily: fontFam }}>
                {getTrans({
                  en: "Read a specific Surah each day for immense blessings",
                  ur: "بے پناہ برکات کے لیے ہر روز ایک مخصوص سورت پڑھیں",
                  ar: "اقرأ سورة معينة كل يوم لنيل البركات العظيمة",
                  br: "بے کچ برکت آتا کن ہر دے اسہ خاص سورت اس خوانبو"
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0.5rem'
            }}
          ><X size={20} /></button>
        </div>

        {/* Days Navigator */}
        <div style={{
          display: 'flex', overflowX: 'auto', padding: '1rem',
          gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.2)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {DAILY_WAZAIF.map((dayItem) => {
            const isActive = activeDay === dayItem.id;
            return (
              <button
                key={dayItem.id}
                onClick={() => setActiveDay(dayItem.id)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  background: isActive ? `${dayItem.themeColor}25` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? dayItem.themeColor : 'transparent'}`,
                  color: isActive ? dayItem.themeColor : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: fontFam
                }}
              >
                {getTrans(dayItem.day)}
              </button>
            );
          })}
        </div>

        {/* Active Day Content */}
        <div style={{ padding: '2rem 1.5rem', flex: 1, overflowY: 'auto' }}>
          {currentSurah && (
            <div style={{
              background: `linear-gradient(145deg, rgba(255,255,255,0.03) 0%, ${currentSurah.themeColor}10 100%)`,
              border: `1px solid ${currentSurah.themeColor}40`,
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background Glow */}
              <div style={{
                position: 'absolute', top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
                background: `radial-gradient(circle at center, ${currentSurah.themeColor}15 0%, transparent 60%)`,
                pointerEvents: 'none', zIndex: 0
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: `${currentSurah.themeColor}25`,
                  color: currentSurah.themeColor,
                  marginBottom: '1rem',
                  boxShadow: `0 0 20px ${currentSurah.themeColor}30`
                }}>
                  <BookOpen size={28} />
                </div>
                
                <h4 style={{
                  color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem',
                  fontFamily: fontFam
                }}>
                  {getTrans({ en: "Surah of the Day", ur: "آج کی سورت", ar: "سورة اليوم", br: "اینو نا سورت" })}
                </h4>
                
                <h2 style={{
                  margin: '0 0 1.5rem 0', fontSize: '2.5rem', fontWeight: 800, color: '#fff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)', fontFamily: fontFam
                }}>
                  {getTrans(currentSurah.surah_name)}
                </h2>

                <div style={{
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: currentSurah.themeColor, marginBottom: '0.75rem', fontWeight: 700 }}>
                    {currentSurah.icon}
                    <span style={{ fontFamily: fontFam }}>
                      {getTrans({ en: "Virtues & Purpose", ur: "فضیلت اور مقصد", ar: "الفضائل والمقاصد", br: "فضیلت و مقصد" })}
                    </span>
                  </div>
                  <p style={{
                    margin: 0, color: '#e2e8f0', fontSize: '1.1rem', lineHeight: 1.6, fontFamily: fontFam
                  }}>
                    {getTrans(currentSurah.purpose)}
                  </p>
                </div>

                <button
                  onClick={() => handlePlay(currentSurah)}
                  style={{
                    background: `linear-gradient(135deg, ${currentSurah.themeColor}, ${currentSurah.themeColor}dd)`,
                    color: '#fff', border: 'none', borderRadius: '12px',
                    padding: '0.9rem 2rem', fontSize: '1.05rem', fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                    cursor: 'pointer', boxShadow: `0 8px 20px ${currentSurah.themeColor}40`,
                    fontFamily: fontFam
                  }}
                >
                  <Volume2 size={20} />
                  {getTrans({ en: "Listen Now", ur: "ابھی سنیں", ar: "استمع الآن", br: "داسہ بنگبو" })}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
