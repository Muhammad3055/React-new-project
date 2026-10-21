import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, BookOpen, Compass, Calculator, Scale, FileText, 
  Clock, ShieldCheck, Heart, Star, Sparkles, Moon, Sun, 
  ChevronRight, X, ArrowRight, CornerDownLeft 
} from 'lucide-react';

// Indexed Surah List for Instant Spotlight Navigation
const SURAHS_INDEX = [
  { num: 1, nameEn: "Al-Fatihah", nameAr: "الفاتحة", nameUr: "الفاتحہ", verses: 7, type: "Meccan" },
  { num: 2, nameEn: "Al-Baqarah", nameAr: "البقرة", nameUr: "البقرہ", verses: 286, type: "Medinan" },
  { num: 3, nameEn: "Ali 'Imran", nameAr: "آل عمران", nameUr: "آل عمران", verses: 200, type: "Medinan" },
  { num: 4, nameEn: "An-Nisa", nameAr: "النساء", nameUr: "النساء", verses: 176, type: "Medinan" },
  { num: 5, nameEn: "Al-Ma'idah", nameAr: "المائدة", nameUr: "المائدہ", verses: 120, type: "Medinan" },
  { num: 6, nameEn: "Al-An'am", nameAr: "الأنعام", nameUr: "الانعام", verses: 165, type: "Meccan" },
  { num: 7, nameEn: "Al-A'raf", nameAr: "الأعراف", nameUr: "الاعراف", verses: 206, type: "Meccan" },
  { num: 8, nameEn: "Al-Anfal", nameAr: "الأنفال", nameUr: "الانفال", verses: 75, type: "Medinan" },
  { num: 9, nameEn: "At-Tawbah", nameAr: "التوبة", nameUr: "التوبہ", verses: 129, type: "Medinan" },
  { num: 10, nameEn: "Yunus", nameAr: "يونس", nameUr: "یونس", verses: 109, type: "Meccan" },
  { num: 11, nameEn: "Hud", nameAr: "هود", nameUr: "ہود", verses: 123, type: "Meccan" },
  { num: 12, nameEn: "Yusuf", nameAr: "يوسف", nameUr: "یوسف", verses: 111, type: "Meccan" },
  { num: 18, nameEn: "Al-Kahf", nameAr: "الكهف", nameUr: "الکہف", verses: 110, type: "Meccan" },
  { num: 19, nameEn: "Maryam", nameAr: "مريم", nameUr: "مریم", verses: 98, type: "Meccan" },
  { num: 20, nameEn: "Ta-Ha", nameAr: "طه", nameUr: "طٰہٰ", verses: 135, type: "Meccan" },
  { num: 24, nameEn: "An-Nur", nameAr: "النور", nameUr: "النور", verses: 64, type: "Medinan" },
  { num: 36, nameEn: "Ya-Sin", nameAr: "يس", nameUr: "یٰسٓ", verses: 83, type: "Meccan" },
  { num: 49, nameEn: "Al-Hujurat", nameAr: "الحجرات", nameUr: "الحجرات", verses: 18, type: "Medinan" },
  { num: 55, nameEn: "Ar-Rahman", nameAr: "الرحمن", nameUr: "الرحمٰن", verses: 78, type: "Medinan" },
  { num: 56, nameEn: "Al-Waqi'ah", nameAr: "الواقعة", nameUr: "الواقعہ", verses: 96, type: "Meccan" },
  { num: 67, nameEn: "Al-Mulk", nameAr: "الملك", nameUr: "الملک", verses: 30, type: "Meccan" },
  { num: 78, nameEn: "An-Naba", nameAr: "النبأ", nameUr: "النباء (عم)", verses: 40, type: "Meccan" },
  { num: 112, nameEn: "Al-Ikhlas", nameAr: "الإخلاص", nameUr: "الاخلاص", verses: 4, type: "Meccan" },
  { num: 113, nameEn: "Al-Falaq", nameAr: "الفلق", nameUr: "الفلق", verses: 5, type: "Meccan" },
  { num: 114, nameEn: "An-Nas", nameAr: "الناس", nameUr: "الناس", verses: 6, type: "Meccan" },
];

export default function GlobalSearchModal({ isOpen, onClose, navigateToTab }) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Master Tools & Views Index
  const TOOLS_INDEX = useMemo(() => [
    {
      id: 'read',
      category: 'tools',
      titleEn: "Quran Reader & Multi-Tafseer",
      titleUr: "قرآن پاک تلاوت اور کثیر تفاسیر",
      titleAr: "المصحف الإلكتروني وتفاسير القرآن",
      descEn: "Read with Urdu, English & Brahui translations and verse commentaries",
      icon: "fas fa-book-open",
      color: "#059669",
      action: () => navigateToTab('read')
    },
    {
      id: 'qada',
      category: 'tools',
      titleEn: "Qaza-e-Umri (Missed Salah) Tracker",
      titleUr: "قضائے عمری - چھوٹ جانے والی نمازوں و روزوں کا حساب",
      titleAr: "حساب قضاء الصلوات الفائتة والصيام",
      descEn: "Lifelong debt calculator, daily makeup logger, and Fiqh rulings",
      icon: "fas fa-history",
      color: "#f59e0b",
      action: () => navigateToTab('qada')
    },
    {
      id: 'inheritance',
      category: 'tools',
      titleEn: "Mirath Inheritance & Wasiyyah Portal",
      titleUr: "اسلامی علم المواريث اور شرعی وصیت نامہ میکر",
      titleAr: "حساب المواريث الشرعية وصياغة الوصية",
      descEn: "Automatic Surah An-Nisa estate division and printable Shariah Will affidavit",
      icon: "fas fa-balance-scale",
      color: "#d97706",
      action: () => navigateToTab('inheritance')
    },
    {
      id: 'khatam',
      category: 'tools',
      titleEn: "Khatam-ul-Quran (Family & 30-Day Rooms)",
      titleUr: "اجتماعی و خاندانی ختمِ قرآن رومز اور 30 روزہ ٹریکر",
      titleAr: "ختم القرآن العائلي والجماعي والمخطط الشهري",
      descEn: "Share rooms on WhatsApp, claim Paras 1-30, and track collective progress",
      icon: "fas fa-calendar-check",
      color: "#0284c7",
      action: () => navigateToTab('khatam')
    },
    {
      id: 'muhasaba',
      category: 'tools',
      titleEn: "Daily Islamic Habits & Streak Tracker",
      titleUr: "روزانہ نیکیوں کا اسٹریک و محاسبہ نفس",
      titleAr: "المحاسبة اليومية ومتابعة العادات الإسلامية",
      descEn: "Track 5 prayers, daily Quran, Azkar, Sadaqah, and earn streak badges",
      icon: "fas fa-tasks",
      color: "#8b5cf6",
      action: () => navigateToTab('muhasaba')
    },
    {
      id: 'asanNimaz',
      category: 'tools',
      titleEn: "Asan Nimaz & Janazah Funeral Guide",
      titleUr: "آسان نماز، وضو، غسل اور نمازِ جنازہ مکمل گائیڈ",
      titleAr: "تعليم الصلاة والوضوء وصلاة الجنازة والسنن",
      descEn: "Step-by-step prayer postures, Takbeerat, Janaza duas, and Fiqh rules",
      icon: "fas fa-mosque",
      color: "#059669",
      action: () => navigateToTab('asanNimaz')
    },
    {
      id: 'zakat',
      category: 'tools',
      titleEn: "Shariah Compliant Zakat Calculator",
      titleUr: "زکوٰۃ و نصاب کیلکولیٹر (سونے، چاندی و نقدی)",
      titleAr: "حاسبة الزكاة الشرعية للذهب والفضة والأموال",
      descEn: "Exact Nisab rates for Gold & Silver with Shariah asset deductions",
      icon: "fas fa-calculator",
      color: "#eab308",
      action: () => navigateToTab('zakat')
    },
    {
      id: 'qibla',
      category: 'tools',
      titleEn: "Live Qibla Compass Direction",
      titleUr: "قبلہ نما (کعبہ شریف کی درست سمت)",
      titleAr: "بوصلة تحديد اتجاه القبلة الدقيقة",
      descEn: "GPS-powered accurate compass pointing towards Holy Kaaba in Makkah",
      icon: "fas fa-compass",
      color: "#ec4899",
      action: () => navigateToTab('qibla')
    },
    {
      id: 'live',
      category: 'tools',
      titleEn: "24/7 Makkah & Madinah Live Stream",
      titleUr: "مکہ مکرمہ اور مدینہ منورہ لائیو نشریات 24 گھنٹے",
      titleAr: "بث مباشر للحرم المكي والمسجد النبوي الشريف",
      descEn: "High-definition official Saudi Quran and Sunnah channels streaming live",
      icon: "fas fa-broadcast-tower",
      color: "#dc2626",
      action: () => navigateToTab('live')
    },
    {
      id: 'tasbeeh',
      category: 'tools',
      titleEn: "Digital Tasbeeh & Dhikr Counter",
      titleUr: "ڈیجیٹل تسبیح اور مسنون اذکار کاؤنٹر",
      titleAr: "السبحة الإلكترونية والأذكار المسنونة",
      descEn: "Count SubhanAllah, Alhamdulillah, Allahu Akbar with haptic feedback",
      icon: "fas fa-hand-holding-heart",
      color: "#14b8a6",
      action: () => navigateToTab('tasbeeh')
    },
    {
      id: 'duas',
      category: 'duas',
      titleEn: "Hisnul Muslim - 100+ Masnoon Duas",
      titleUr: "حصن المسلم - مسنون و قرآنی دعائیں",
      titleAr: "حصن المسلم - الأدعية المأثورة والأذكار",
      descEn: "Morning/Evening, Travel, Sleeping, Forgiveness, and Rizq supplications",
      icon: "fas fa-hands-wash",
      color: "#6366f1",
      action: () => navigateToTab('duas')
    },
    {
      id: 'cardCreator',
      category: 'tools',
      titleEn: "Quran Verse & Hadith Social Card Creator",
      titleUr: "قرآنی آیات و احادیث سوشل میڈیا کارڈ میکر",
      titleAr: "مصمم بطاقات الآيات والأحاديث النبوية",
      descEn: "Create beautiful calligraphy image cards for WhatsApp and Instagram",
      icon: "fas fa-palette",
      color: "#f97316",
      action: () => navigateToTab('cardCreator')
    },
    {
      id: 'hajjUmrah',
      category: 'tools',
      titleEn: "Hajj & Umrah Interactive Visual Guide",
      titleUr: "حج و عمرہ کا مکمل مسنون طریقہ و نقشہ جات",
      titleAr: "دليل مناسك الحج والعمرة التفاعلي",
      descEn: "Tawaf, Sa'ee, Ihram rules, and step-by-step checklist for pilgrims",
      icon: "fas fa-kaaba",
      color: "#1e293b",
      action: () => navigateToTab('hajjUmrah')
    }
  ], [navigateToTab]);

  // Combined Search Filtering
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Filter tools
    const matchedTools = TOOLS_INDEX.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (!q) return true;
      return (
        item.titleEn.toLowerCase().includes(q) ||
        item.titleUr.toLowerCase().includes(q) ||
        item.titleAr.toLowerCase().includes(q) ||
        item.descEn.toLowerCase().includes(q)
      );
    }).map(tool => ({ ...tool, resultType: 'tool' }));

    // 2. Filter Surahs
    let matchedSurahs = [];
    if (activeCategory === 'all' || activeCategory === 'surahs') {
      matchedSurahs = SURAHS_INDEX.filter(s => {
        if (!q) return true;
        const numStr = String(s.num);
        return (
          numStr === q ||
          s.nameEn.toLowerCase().includes(q) ||
          s.nameUr.toLowerCase().includes(q) ||
          s.nameAr.toLowerCase().includes(q)
        );
      }).map(s => ({
        id: `surah_${s.num}`,
        resultType: 'surah',
        category: 'surahs',
        titleEn: `Surah ${s.num}. ${s.nameEn}`,
        titleUr: `سورۃ نمبر ${s.num}: ${s.nameUr}`,
        titleAr: `سورة ${s.nameAr} (${s.num})`,
        descEn: `${s.verses} Verses • ${s.type} Revelation`,
        icon: "fas fa-quran",
        color: "#059669",
        action: () => {
          navigateToTab('read');
          // Dispatch custom event or URL update if supported
        }
      }));
    }

    return [...matchedTools, ...matchedSurahs];
  }, [query, activeCategory, TOOLS_INDEX]);

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          filteredResults[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose]);

  if (!isOpen) return null;

  const isRtl = lang === 'ur' || lang === 'ar' || lang === 'br';

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        background: 'rgba(2, 6, 23, 0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '5vh 1rem', overflowY: 'auto'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff', borderRadius: '24px', width: '100%',
          maxWidth: '680px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          overflow: 'hidden', border: '2px solid var(--accent-gold, #f59e0b)',
          direction: isRtl ? 'rtl' : 'ltr', animation: 'scaleUp 0.15s ease-out'
        }}
      >
        {/* ── Search Input Header ── */}
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc'
        }}>
          <Search size={22} style={{ color: '#d97706', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder={
              lang === 'ar' ? 'ابحث في القرآن، قضائے عمری، المواريث، الأدعية (Ctrl+K)...'
              : (lang === 'ur' || lang === 'br') ? 'قرآن سورت، قضائے عمری، وراثت، دعائیں (Ctrl+K)...'
              : 'Search Surahs, Qaza, Inheritance, Zakat, Duas (Ctrl+K)...'
            }
            style={{
              width: '100%', border: 'none', background: 'transparent',
              fontSize: '1.15rem', fontWeight: 600, color: '#0f172a',
              outline: 'none', fontFamily: 'inherit'
            }}
          />
          {query ? (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
            >
              <X size={18} />
            </button>
          ) : (
            <span style={{
              background: '#e2e8f0', color: '#64748b', fontSize: '0.72rem',
              fontWeight: 800, padding: '3px 8px', borderRadius: '6px'
            }}>
              ESC
            </span>
          )}
        </div>

        {/* ── Category Filter Pills ── */}
        <div style={{
          padding: '0.6rem 1.25rem', borderBottom: '1px solid #f1f5f9',
          display: 'flex', gap: '0.4rem', overflowX: 'auto', background: '#ffffff'
        }}>
          {[
            { id: 'all', label: lang === 'ar' ? 'الكل' : (lang === 'ur' || lang === 'br') ? 'تمام' : 'All' },
            { id: 'tools', label: lang === 'ar' ? 'الأدوات والفتاوى' : (lang === 'ur' || lang === 'br') ? 'ٹولز و احکام' : 'Tools & Services' },
            { id: 'surahs', label: lang === 'ar' ? 'السور القرآنية' : (lang === 'ur' || lang === 'br') ? 'سورتیں' : 'Surahs' },
            { id: 'duas', label: lang === 'ar' ? 'الأدعية والأذكار' : (lang === 'ur' || lang === 'br') ? 'دعائیں و اذکار' : 'Duas' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSelectedIndex(0); }}
              style={{
                padding: '4px 12px', borderRadius: '20px', border: 'none',
                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                background: activeCategory === cat.id ? '#022c22' : '#f1f5f9',
                color: activeCategory === cat.id ? '#fcd34d' : '#64748b',
                transition: 'all 0.15s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Search Results List ── */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => { item.action(); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    padding: '10px 14px', borderRadius: '14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem', transition: 'all 0.15s ease',
                    background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                    border: isSelected ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '12px',
                      background: `${item.color}15`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0
                    }}>
                      <i className={item.icon} style={{ color: item.color, fontSize: '1.1rem' }}></i>
                    </div>

                    <div style={{ overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '0.95rem', fontWeight: 800,
                        color: isSelected ? '#b45309' : '#0f172a',
                        whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
                      }}>
                        {lang === 'ar' ? item.titleAr : (lang === 'ur' || lang === 'br') ? item.titleUr : item.titleEn}
                      </div>
                      <div style={{
                        fontSize: '0.78rem', color: '#64748b',
                        whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
                      }}>
                        {item.descEn}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {isSelected && (
                      <span style={{
                        fontSize: '0.7rem', color: '#d97706', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: '3px'
                      }}>
                        <span>{lang === 'ar' ? 'افتح' : (lang === 'ur' || lang === 'br') ? 'کھولیں' : 'Jump'}</span>
                        <CornerDownLeft size={12} />
                      </span>
                    )}
                    <ChevronRight size={16} style={{ color: isSelected ? '#d97706' : '#cbd5e1' }} />
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                {lang === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : (lang === 'ur' || lang === 'br') ? 'کوئی نتیجہ نہیں ملا' : 'No matching items found.'}
              </p>
            </div>
          )}
        </div>

        {/* ── Modal Footer Shortcuts ── */}
        <div style={{
          padding: '0.75rem 1.25rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span><kbd style={{ background: '#e2e8f0', padding: '2px 5px', borderRadius: '4px', fontWeight: 700 }}>↑</kbd> <kbd style={{ background: '#e2e8f0', padding: '2px 5px', borderRadius: '4px', fontWeight: 700 }}>↓</kbd> {lang === 'ar' ? 'للتنقل' : (lang === 'ur' || lang === 'br') ? 'حرکت' : 'navigate'}</span>
            <span><kbd style={{ background: '#e2e8f0', padding: '2px 5px', borderRadius: '4px', fontWeight: 700 }}>↵</kbd> {lang === 'ar' ? 'للاختيار' : (lang === 'ur' || lang === 'br') ? 'منتخب کریں' : 'select'}</span>
          </div>
          <div>
            <span style={{ color: '#059669', fontWeight: 700 }}>⚡ Maktaba Spotlight</span>
          </div>
        </div>

      </div>
    </div>
  );
}
