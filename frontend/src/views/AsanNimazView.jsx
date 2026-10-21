import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function AsanNimazView({ navigateToTab }) {
  const { lang, setLang } = useLanguage();

  // Page language state: defaults to global lang ('en', 'ur', or 'ar')
  const [pageLang, setPageLang] = useState(() => (lang === 'ar' ? 'ar' : lang === 'en' ? 'en' : 'ur'));
  const [activeTab, setActiveTab] = useState('nimaz');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Sync with global site language if it changes
  useEffect(() => {
    if (lang === 'ar' || lang === 'en' || lang === 'ur') {
      setPageLang(lang);
    }
  }, [lang]);

  const switchLanguage = (newLang) => {
    setPageLang(newLang);
    if (setLang) {
      setLang(newLang);
    }
  };

  const copyToClipboard = (text, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const isAr = pageLang === 'ar';
  const isEn = pageLang === 'en';
  const dir = isEn ? 'ltr' : 'rtl';

  // Tabs definition for 3 languages
  const tabs = [
    {
      id: 'nimaz',
      labelUr: 'نماز کا طریقہ و رکعتیں',
      labelAr: 'صفة الصلاة وعدد الركعات',
      labelEn: 'Salah Method & Rak\'ats',
      icon: 'fas fa-mosque'
    },
    {
      id: 'wudu_ghusl',
      labelUr: 'وضو، غسل و طہارت',
      labelAr: 'الوضوء والغسل والتيمم',
      labelEn: 'Wudu, Ghusl & Purity',
      icon: 'fas fa-hands-wash'
    },
    {
      id: 'mayat_janaza',
      labelUr: 'میت، جنازہ و قبرستان',
      labelAr: 'الجنائز وصلاة الجنازة والقبور',
      labelEn: 'Funeral, Janaza & Graves',
      icon: 'fas fa-star-and-crescent'
    },
    {
      id: 'daily_duas',
      labelUr: 'دن و رات کی دعائیں',
      labelAr: 'أذكار اليوم والليلة المأثورة',
      labelEn: 'Daily Day & Night Duas',
      icon: 'fas fa-praying-hands'
    },
    {
      id: 'masael',
      labelUr: 'ضروری مسائل، قضا و سہو',
      labelAr: 'المسائل الفقهية وسجود السهو',
      labelEn: 'Essential Fiqh & Sahw',
      icon: 'fas fa-balance-scale'
    },
    {
      id: 'special_prayers',
      labelUr: 'دیگر مسنون و نفل نمازیں',
      labelAr: 'السنن والنوافل وصلاة الوتر',
      labelEn: 'Special & Nafl Prayers',
      icon: 'fas fa-heart'
    },
  ];

  return (
    <div className="asan-nimaz-page" style={{ minHeight: '85vh', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', padding: '2rem 1rem', direction: dir }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Page Hero Header */}
        <div className="asan-nimaz-hero" style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 12px 36px rgba(6,78,59,0.22)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-50px', left: '-20px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(245,158,11,0.08)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            <div className="asan-nimaz-hero-main" style={{ flex: '1', minWidth: '300px' }}>
              
              {/* Language Switcher Bar: English, Urdu & Arabic */}
              <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.18)', padding: '4px', borderRadius: '16px', gap: '4px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.25)', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => switchLanguage('en')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background: isEn ? 'var(--surface-paper)' : 'transparent',
                    color: isEn ? '#065f46' : '#ffffff',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>🇬🇧</span>
                  <span>English (Meanings)</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchLanguage('ur')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background: (!isEn && !isAr) ? 'var(--surface-paper)' : 'transparent',
                    color: (!isEn && !isAr) ? '#065f46' : '#ffffff',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>🇵🇰</span>
                  <span>اردو (ترجمہ و احکام)</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchLanguage('ar')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background: isAr ? 'var(--surface-paper)' : 'transparent',
                    color: isAr ? '#065f46' : '#ffffff',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>🇸🇦</span>
                  <span>العربية (المعنى والبيان)</span>
                </button>
              </div>

              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, fontFamily: isEn ? '"Outfit", sans-serif' : "'Amiri', serif" }}>
                {isEn
                  ? 'Asan Nimaz & Comprehensive Authentic Salah Guide'
                  : isAr
                    ? 'الميسر في أحكام الصلاة والأدعية المأثورة'
                    : 'آسان نماز اور مکمل مسنون احکام'
                }
              </h1>
              <p style={{ margin: 0, fontSize: '1.02rem', color: '#d1fae5', maxWidth: '780px', lineHeight: 1.7 }}>
                {isEn
                  ? 'Pillars and conditions of Salah, 5 daily prayers & total rak\'ats schedule, step-by-step illustrated method, differences between men and women, Wudu & Ghusl purity, Janaza funeral & grave Duas, essential Fiqh rules, and daily day & night Masnoon Duas.'
                  : isAr
                    ? 'أركان الصلاة وشروطها، عدد الركعات، كيفية أداء الصلاة خطوة بخطوة، الفرق بين صلاة الرجل والمرأة، أحكام الوضوء والغسل والتيمم، صلاة الجنازة وأدعية المقابر، سجود السهو وقضاء الفوائت والأذكار اليومية.'
                    : 'نماز کے ارکان، پنج وقتہ رکعتیں، طریقہ، مرد و عورت کا فرق، وضو و غسل، تجہیز و تکفین، نمازِ جنازہ، قبرستان کی دعائیں، ضروری مسائل اور روزمرہ کی مسنون دعائیں۔'
                }
              </p>
            </div>

            {/* In-Page Quick Search */}
            <div className="asan-nimaz-hero-search" style={{ minWidth: '280px', flex: '1', maxWidth: '380px' }}>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-search" style={{ position: 'absolute', [isEn ? 'left' : 'right']: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Search any Dua, prayer rule, or Salah step...'
                      : isAr
                        ? 'ابحث عن أي دعاء، حكم، أو صلاة...'
                        : 'کوئی بھی دعا، مسئلہ یا نماز تلاش کریں...'
                  }
                  style={{
                    width: '100%',
                    padding: isEn ? '12px 14px 12px 42px' : '12px 42px 12px 14px',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    background: 'var(--surface-paper)',
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    outline: 'none',
                    direction: dir,
                    textAlign: isEn ? 'left' : 'right'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: '0.65rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          scrollbarWidth: 'thin'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'var(--surface-paper)',
                color: activeTab === tab.id ? '#ffffff' : '#334155',
                border: activeTab === tab.id ? '2px solid #059669' : '1.5px solid #e2e8f0',
                padding: '11px 18px',
                borderRadius: '16px',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === tab.id ? '0 6px 18px rgba(5,150,105,0.25)' : '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <i className={tab.icon} style={{ color: activeTab === tab.id ? '#fde68a' : '#059669' }} />
              <span>{isEn ? tab.labelEn : isAr ? tab.labelAr : tab.labelUr}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: نماز کا مکمل طریقہ اور رکعتیں / صفة الصلاة / Salah Guide */}
        {activeTab === 'nimaz' && (
          <NimazTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} isAr={isAr} isEn={isEn} dir={dir} />
        )}

        {/* Tab 2: وضو، غسل اور طہارت / الوضوء والغسل / Wudu & Ghusl */}
        {activeTab === 'wudu_ghusl' && (
          <WuduGhuslTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} isAr={isAr} isEn={isEn} dir={dir} />
        )}

        {/* Tab 3: میت، جنازہ، تدفین و قبرستان / الجنائز والقبور / Janaza & Graves */}
        {activeTab === 'mayat_janaza' && (
          <MayatJanazaTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} isAr={isAr} isEn={isEn} dir={dir} />
        )}

        {/* Tab 4: دن اور رات کی مسنون دعائیں / أذكار اليوم والليلة / Daily Duas */}
        {activeTab === 'daily_duas' && (
          <DailyDuasTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} isAr={isAr} isEn={isEn} dir={dir} />
        )}

        {/* Tab 5: ضروری مسائل، قضا اور سجدہ سہو / المسائل وسجود السهو / Essential Fiqh */}
        {activeTab === 'masael' && (
          <MasaelTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} isAr={isAr} isEn={isEn} dir={dir} />
        )}

        {/* Tab 6: دیگر مخصوص و نفل نمازیں / السنن والنوافل / Special Prayers */}
        {activeTab === 'special_prayers' && (
          <SpecialPrayersTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} isAr={isAr} isEn={isEn} dir={dir} />
        )}

      </div>
    </div>
  );
}

// ==============================================================================
// TAB 1: نماز / صفة الصلاة / Salah Guide & Rak'ats
// ==============================================================================
function NimazTab({ copyToClipboard, copiedId, searchQuery, isAr, isEn, dir }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1.1: روزانہ کی ۵ نمازیں اور کل رکعتیں / جدول ركعات الصلوات الخمس / 5 Daily Prayers Breakdown */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#ecfdf5', color: '#059669', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-calendar-day" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064e3b' }}>
              {isEn ? '5 Daily Prayers & Total Rak\'ats Breakdown' : isAr ? 'تفصيل ركعات الصلوات الخمس وصلاة الجمعة' : 'روزانہ کی ۵ نمازیں اور کل رکعتوں کی تفصیل'}
            </h2>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              {isEn ? 'Authentic schedule of Fard, Sunnah Muakkadah, Sunnah Ghair-Muakkadah, Wajib, and Nafl rak\'ats' : isAr ? 'الفرائض، السنن المؤكدة وغير المؤكدة، الوتر والنوافل' : 'فرض، سنتِ مؤکدہ، سنتِ غیر مؤکدہ، واجب اور نفل رکعتوں کا مستند شیڈول'}
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', direction: dir, minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #059669' }}>
                <th style={{ padding: '12px 14px', color: '#064e3b', fontWeight: 800 }}>{isEn ? 'Prayer' : isAr ? 'الصلاة' : 'نماز'}</th>
                <th style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 800 }}>{isEn ? 'Sunnah (Pre)' : isAr ? 'السنة القبلية' : 'پہلے سنتیں'}</th>
                <th style={{ padding: '12px 14px', color: '#dc2626', fontWeight: 800 }}>{isEn ? 'Fard (Obligatory)' : isAr ? 'الفرض' : 'فرض'}</th>
                <th style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 800 }}>{isEn ? 'Sunnah (Post)' : isAr ? 'السنة البعدية' : 'بعد کی سنتیں'}</th>
                <th style={{ padding: '12px 14px', color: '#7c3aed', fontWeight: 800 }}>{isEn ? 'Witr Wajib' : isAr ? 'الوتر الواجب' : 'وتر واجب'}</th>
                <th style={{ padding: '12px 14px', color: '#059669', fontWeight: 800 }}>{isEn ? 'Nafl' : isAr ? 'النوافل' : 'نفل'}</th>
                <th style={{ padding: '12px 14px', color: '#064e3b', fontWeight: 900 }}>{isEn ? 'Total' : isAr ? 'المجموع' : 'کل رکعتیں'}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>{isEn ? 'Fajr' : isAr ? 'صلاة الفجر' : 'فجر'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '2 Sunnah' : isAr ? '٢ سنة مؤكدة' : '۲ سنت مؤکدہ'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>{isEn ? '2 Fard' : isAr ? '٢ فرض' : '۲ فرض'}</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>{isEn ? '4 Rak\'ats' : isAr ? '٤ ركعات' : '۴ رکعتیں'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>{isEn ? 'Dhuhr' : isAr ? 'صلاة الظهر' : 'ظہر'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '4 Sunnah' : isAr ? '٤ سنة مؤكدة' : '۴ سنت مؤکدہ'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>{isEn ? '4 Fard' : isAr ? '٤ فرض' : '۴ فرض'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '2 Sunnah' : isAr ? '٢ سنة مؤكدة' : '۲ سنت مؤکدہ'}</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '2 Nafl' : isAr ? '٢ نفل' : '۲ نفل'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>{isEn ? '12 Rak\'ats' : isAr ? '١٢ ركعة' : '۱۲ رکعتیں'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>{isEn ? 'Asr' : isAr ? 'صلاة العصر' : 'عصر'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '4 Sunnah' : isAr ? '٤ سنة غير مؤكدة' : '۴ سنت غیر مؤکدہ'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>{isEn ? '4 Fard' : isAr ? '٤ فرض' : '۴ فرض'}</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>{isEn ? '8 Rak\'ats' : isAr ? '٨ ركعات' : '۸ رکعتیں'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>{isEn ? 'Maghrib' : isAr ? 'صلاة المغرب' : 'مغرب'}</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>{isEn ? '3 Fard' : isAr ? '٣ فرض' : '۳ فرض'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '2 Sunnah' : isAr ? '٢ سنة مؤكدة' : '۲ سنت مؤکدہ'}</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '2 Nafl' : isAr ? '٢ نفل' : '۲ نفل'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>{isEn ? '7 Rak\'ats' : isAr ? '٧ ركعات' : '۷ رکعتیں'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>{isEn ? 'Isha' : isAr ? 'صلاة العشاء' : 'عشاء'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '4 Sunnah' : isAr ? '٤ سنة غير مؤكدة' : '۴ سنت غیر مؤکدہ'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>{isEn ? '4 Fard' : isAr ? '٤ فرض' : '۴ فرض'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '2 Sunnah' : isAr ? '٢ سنة مؤكدة' : '۲ سنت مؤکدہ'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#7c3aed' }}>{isEn ? '3 Witr' : isAr ? '٣ وتر واجب' : '۳ وتر واجب'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '4 Nafl' : isAr ? '٤ نفل' : '۴ نفل'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>{isEn ? '17 Rak\'ats' : isAr ? '١٧ ركعة' : '۱۷ رکعتیں'}</td>
              </tr>
              <tr style={{ background: '#ecfdf5' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>{isEn ? 'Jumu\'ah (Friday)' : isAr ? 'صلاة الجمعة المباركة' : 'جمعہ المبارک'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '4 Sunnah' : isAr ? '٤ سنة مؤكدة' : '۴ سنت مؤکدہ'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>{isEn ? '2 Fard' : isAr ? '٢ فرض' : '۲ فرض'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '4+2 Sunnah' : isAr ? '٤+٢ سنة بعدية' : '۴+۲ سنتیں'}</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? '2 Nafl' : isAr ? '٢ نفل' : '۲ نفل'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>{isEn ? '14 Rak\'ats' : isAr ? '١٤ ركعة' : '۱۴ رکعتیں'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 1.2: نماز کے فرائض (شرائط و ارکان) / Pre-requisites & Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.25rem' }}>
        
        {/* ۷ شرائط (خارجی فرائض) / 7 Conditions */}
        <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #fed7aa', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ background: '#ffedd5', color: '#c2410c', padding: '6px 10px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem' }}>
              {isEn ? 'Pre-requisites' : isAr ? 'شروط الصلاة' : 'خارجی فرائض'}
            </span>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#9a3412' }}>
              {isEn ? '7 External Conditions (Before starting Salah)' : isAr ? 'شروط الصلاة السبعة (قبل الشروع في الصلاة)' : 'نماز کی ۷ شرائط (نماز شروع ہونے سے پہلے)'}
            </h3>
          </div>
          <ol style={{ margin: 0, [isEn ? 'paddingLeft' : 'paddingRight']: '1.25rem', direction: dir, color: '#334155', lineHeight: 2, fontSize: '0.94rem' }}>
            <li><strong>{isEn ? 'Purity of Body:' : isAr ? 'طهارة البدن:' : 'بدن کا پاک ہونا:'}</strong> {isEn ? 'Purification from minor and major impurities (Wudu/Ghusl).' : isAr ? 'التطهر من الحدث الأصغر بالوضوء ومن الحدث الأكبر بالغسل.' : 'حدثِ اصغر (بے وضو ہونا) اور حدثِ اکبر (ناپاکی) سے پاک ہونا۔'}</li>
            <li><strong>{isEn ? 'Purity of Clothes:' : isAr ? 'طهارة الثياب:' : 'کپڑوں کا پاک ہونا:'}</strong> {isEn ? 'Wearing clean clothes free from all physical impurities.' : isAr ? 'خلو ملابس المصلي تماماً من النجاسات الحقيقية.' : 'پہننے والے لباس کا نجاست سے پاک ہونا۔'}</li>
            <li><strong>{isEn ? 'Purity of Place:' : isAr ? 'طهارة المكان:' : 'جگہ کا پاک ہونا:'}</strong> {isEn ? 'The ground on which standing and prostrating must be pure.' : isAr ? 'طهارة الموضع الذي يقف ويسجد عليه المصلي.' : 'جہاں سجدہ اور قیام کریں وہ جگہ پاک ہو۔'}</li>
            <li><strong>{isEn ? 'Covering Satr/Awrah:' : isAr ? 'ستر العورة:' : 'سترِ عورت:'}</strong> {isEn ? 'For men from navel to knees; for women whole body except face and hands.' : isAr ? 'للرجل ما بين السرة إلى الركبة، وللمرأة جميع بدنها عدا الوجه والكفين.' : 'مرد کا ناف سے گھٹنوں تک، عورت کا چہرہ و ہاتھوں کے سوا تمام جسم ڈھانپنا۔'}</li>
            <li><strong>{isEn ? 'Facing the Qiblah:' : isAr ? 'استقبال القبلة:' : 'استقبالِ قبلہ:'}</strong> {isEn ? 'Facing in the direction of the Holy Ka\'bah in Makkah.' : isAr ? 'التوجه تلقاء المسجد الحرام والكعبة المشرفة.' : 'خانہ کعبہ کی سمت رخ کرنا۔'}</li>
            <li><strong>{isEn ? 'Entry of Prayer Time:' : isAr ? 'دخول الوقت:' : 'وقت کا ہونا:'}</strong> {isEn ? 'Praying within the prescribed allocated time window.' : isAr ? 'التأكد من دخول الوقت المحدد لكل صلاة.' : 'جس نماز کو ادا کر رہے ہیں اس کا مقررہ وقت داخل ہو چکا ہو۔'}</li>
            <li><strong>{isEn ? 'Sincere Intention (Niyyah):' : isAr ? 'النية:' : 'نیت کرنا:'}</strong> {isEn ? 'Making firm intention in the heart for the specific prayer.' : isAr ? 'قصد أداء الصلاة المعينة بالقلب مخلصاً لله تعالى.' : 'دل میں پختہ ارادہ کرنا کہ میں فلاں نماز ادا کر رہا ہوں۔'}</li>
          </ol>
        </div>

        {/* ۶ ارکان (داخلی فرائض) / 6 Pillars */}
        <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #a7f3d0', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ background: '#ecfdf5', color: '#047857', padding: '6px 10px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem' }}>
              {isEn ? 'Internal Pillars' : isAr ? 'أركان الصلاة' : 'داخلی فرائض'}
            </span>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#065f46' }}>
              {isEn ? '6 Internal Pillars of Salah' : isAr ? 'أركان الصلاة الستة (داخل الصلاة)' : 'نماز کے ۶ ارکان (نماز کے اندر کے فرائض)'}
            </h3>
          </div>
          <ol style={{ margin: 0, [isEn ? 'paddingLeft' : 'paddingRight']: '1.25rem', direction: dir, color: '#334155', lineHeight: 2, fontSize: '0.94rem' }}>
            <li><strong>{isEn ? 'Takbeer Tahreemah:' : isAr ? 'تكبيرة الإحرام:' : 'تکبیرِ تحریمہ:'}</strong> {isEn ? 'Commencing the prayer by verbally pronouncing "Allahu Akbar".' : isAr ? 'قول المصلي: "اللَّهُ أَكْبَرُ" عند ابتداء الصلاة.' : 'زبان سے "اللَّهُ أَكْبَرُ" کہہ کر نماز شروع کرنا۔'}</li>
            <li><strong>{isEn ? 'Qiyam (Standing):' : isAr ? 'القيام في الفرض:' : 'قیام:'}</strong> {isEn ? 'Standing upright in obligatory and Wajib prayers for capable individuals.' : isAr ? 'الوقوف منتصباً للقادر عليه في الصلوات المفروضة.' : 'فرض و واجب نمازوں میں سیدھا کھڑا ہونا (بغیر عذر بیٹھنا جائز نہیں)۔'}</li>
            <li><strong>{isEn ? 'Qira\'at (Quran Recitation):' : isAr ? 'القراءة:' : 'قراءت:'}</strong> {isEn ? 'Reciting Surah Al-Fatiha and at least 1 long verse or 3 short verses.' : isAr ? 'قراءة ما تيسر من القرآن الحكيم (الفاتحة وسورة).' : 'کم از کم ایک بڑی آیت یا تین چھوٹی آیات قرآن مجید کی پڑھنا۔'}</li>
            <li><strong>{isEn ? 'Ruku\' (Bowing):' : isAr ? 'الركوع:' : 'رکوع:'}</strong> {isEn ? 'Bowing so that hands grasp the knees and back is straight.' : isAr ? 'الانحناء حتى تبلغ اليدان الركبتين وتستوي الظهر.' : 'اس قدر جھکنا کہ ہاتھ گھٹنوں تک پہنچ جائیں اور پیٹھ برابر ہو۔'}</li>
            <li><strong>{isEn ? 'Sujood (Prostrations):' : isAr ? 'السجود:' : 'دونوں سجدے:'}</strong> {isEn ? 'Prostrating firmly on 7 limbs: forehead, nose, palms, knees, and toes.' : isAr ? 'السجود على سبعة أعظم: الجبهة والأنف واليدين والركبتين وأطراف القدمين.' : 'پیشانی، ناک، دونوں ہاتھوں، گھٹنوں اور پاؤں کی انگلیوں کو زمین پر جمانا۔'}</li>
            <li><strong>{isEn ? 'Qa\'dah Akheerah (Final Sitting):' : isAr ? 'القعود الأخير:' : 'قعدہ اخیرہ:'}</strong> {isEn ? 'Sitting at the end of the final rak\'ah for the duration of reciting Tashahhud.' : isAr ? 'الجلوس في نهاية الصلاة بمقدار قراءة التشهد.' : 'آخری رکعت کے اختتام پر تشہد (التحیات) پڑھنے کی مقدار بیٹھنا۔'}</li>
          </ol>
        </div>
      </div>

      {/* 1.3: Step-by-Step Illustrated Method */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>
          {isEn ? 'Step-by-Step Complete Illustrated Salah Method' : isAr ? 'صفة الصلاة خطوة بخطوة مع الأذكار والمعاني' : 'نماز کا مکمل مسنون طریقہ مع دعائیں و ترجمہ'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Step 1 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {isEn ? 'Step 1' : isAr ? 'الخطوة الأولى' : 'مرحلہ ۱'}
              </span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
                {isEn ? 'Intention & Takbeer Tahreemah' : isAr ? 'النية وتكبيرة الإحرام' : 'نیت اور تکبیرِ تحریمہ'}
              </h4>
            </div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569', direction: dir }}>
              {isEn
                ? 'Stand facing the Qiblah with sincere intention. Men raise hands to earlobes, women raise hands to chest level, then pronounce:'
                : isAr
                  ? 'استقبل القبلة مع النية، وارفع يديك حذو الأذنين (وللمرأة حذو المنكبين)، ثم كبّر قائلاً:'
                  : 'قبلہ رخ کھڑے ہو کر نیت کریں۔ مرد دونوں ہاتھ کانوں کی لو تک اٹھائیں اور عورتیں سینے تک، پھر کہیں:'
              }
            </p>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                اللَّهُ أَكْبَرُ
              </p>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                {isEn ? 'Meaning: "Allah is the Greatest"' : isAr ? 'المعنى: "اللَّهُ أَعْظَمُ وَأَجَلُّ وَأَكْبَرُ مِنْ كُلِّ شَيْءٍ فِي الْوُجُودِ."' : 'ترجمہ: "اللہ سب سے بڑا ہے"'}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {isEn ? 'Step 2' : isAr ? 'الخطوة الثانية' : 'مرحلہ ۲'}
              </span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
                {isEn ? 'Thana (Opening Supplication)' : isAr ? 'دعاء الاستفتاح (الثناء)' : 'ثناء (سبحانک اللھم) پڑھنا'}
              </h4>
            </div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569', direction: dir }}>
              {isEn
                ? 'Men fold right hand over left below the navel, women place hands on chest, then recite:'
                : isAr
                  ? 'ضع اليد اليمنى على اليسرى تحت السرة (وللمرأة على الصدر) ثم اقرأ دعاء الاستفتاح:'
                  : 'مرد دائیں ہاتھ سے بائیں کلائی پکڑ کر ناف کے نیچے باندھیں اور عورتیں سینے پر ہاتھ رکھیں، پھر ثناء پڑھیں:'
              }
            </p>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.1rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 1.9 }}>
                سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَـٰهَ غَيْرُكَ
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.92rem', color: '#334155', direction: dir, lineHeight: 1.7 }}>
                {isEn
                  ? 'Meaning: "Glory be to You, O Allah, and all praise is for You. Blessed is Your name, exalted is Your majesty, and there is no deity worthy of worship besides You."'
                  : isAr
                    ? 'المعنى: "أُنَزِّهُكَ يَا اللهُ عَنْ كُلِّ عَيْبٍ وَنَقْصٍ مُصَاحِبًا لِحَمْدِكَ، وَكَثُرَتْ بَرَكَاتُ اسْمِكَ، وَعَلَتْ عَظَمَتُكَ وَجَلَالُكَ، وَلَا مَعْبُودَ بِحَقٍّ سِوَاكَ."'
                    : 'ترجمہ: "اے اللہ! تو پاک ہے اپنی تعریفوں کے ساتھ، تیرا نام بابرکت ہے، تیری شان بلند و برتر ہے، اور تیرے سوا کوئی معبود نہیں۔"'
                }
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {isEn ? 'Step 3' : isAr ? 'الخطوة الثالثة' : 'مرحلہ ۳'}
              </span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
                {isEn ? 'Surah Al-Fatiha & Quran Recitation' : isAr ? 'التعوذ والتسمية وقراءة سورة الفاتحة' : 'تعوذ، تسمیہ اور سورۃ الفاتحہ'}
              </h4>
            </div>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.1rem', textAlign: 'center', lineHeight: 2.1 }}>
              <p style={{ margin: 0, fontSize: '1.25rem', fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ • بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '1.25rem', fontFamily: "'Amiri', serif", color: '#0f172a' }}>
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (آمین)
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                {isEn
                  ? 'Then recite another Surah or portion of the Quran (e.g. Surah Al-Ikhlas or at least 3 short verses).'
                  : isAr
                    ? 'ثم اقرأ ما تيسر من القرآن بعدها (كسورة الإخلاص أو ثلاث آيات قصار على الأقل).'
                    : 'سورۃ الفاتحہ کے بعد کوئی بھی سورت (جیسے سورۃ الاخلاص یا کم از کم ۳ چھوٹی آیات) ملائیں۔'
                }
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {isEn ? 'Step 4' : isAr ? 'الخطوة الرابعة' : 'مرحلہ ۴'}
              </span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
                {isEn ? 'Ruku\' (Bowing) & Qawmah (Standing)' : isAr ? 'الركوع والاعتدال منه (القومـة)' : 'رکوع اور قومہ (سیدھا کھڑے ہونا)'}
              </h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '0.75rem' }}>
              <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem' }}>
                  {isEn ? 'Tasbeeh of Ruku\' (3 times):' : isAr ? 'تسبيح الركوع (٣ مرات):' : 'رکوع کی تسبیح (۳ بار):'}
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  سُبْحَانَ رَبِّيَ الْعَظِيمِ
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#475569' }}>
                  {isEn ? 'Meaning: "Glory be to my Lord, the Magnificent"' : isAr ? 'المعنى: "أُنَزِّهُ رَبِّيَ صَاحِبَ الْعَظَمَةِ وَالْكِبْرِيَاءِ عَنْ كُلِّ عَيْبٍ."' : 'ترجمہ: "میرا عظمت والا رب پاک ہے"'}
                </p>
              </div>
              <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem' }}>
                  {isEn ? 'Standing Up (Qawmah):' : isAr ? 'عند الرفع من الركوع (القومـة):' : 'قومہ (رکوع سے اٹھتے وقت):'}
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ • رَبَّنَا لَكَ الْحَمْدُ
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#475569' }}>
                  {isEn
                    ? 'Meaning: "Allah hears whoever praises Him. Our Lord, all praise belongs to You."'
                    : isAr
                      ? 'المعنى: "اسْتَجَابَ اللَّهُ تَعَالَى وَقَبِلَ حَمْدَ مَنْ حَمِدَهُ، وَلَكَ يَا رَبَّنَا الْحَمْدُ كُلُّهُ."'
                      : 'ترجمہ: "اللہ نے اس کی سن لی جس نے اس کی تعریف کی۔ اے ہمارے رب! تیرے ہی لیے سب تعریف ہے۔"'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {isEn ? 'Step 5' : isAr ? 'الخطوة الخامسة' : 'مرحلہ ۵'}
              </span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
                {isEn ? 'Sujood (Prostration) & Jalsah' : isAr ? 'السجود والجلوس بين السجدتين' : 'سجدہ اور جلسہ (دو سجدوں کے درمیان بیٹھنا)'}
              </h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '0.75rem' }}>
              <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem' }}>
                  {isEn ? 'Tasbeeh of Sujood (3 times):' : isAr ? 'تسبيح السجود (٣ مرات):' : 'سجدے کی تسبیح (۳ بار):'}
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  سُبْحَانَ رَبِّيَ الْأَعْلَىٰ
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#475569' }}>
                  {isEn ? 'Meaning: "Glory be to my Lord, the Most High"' : isAr ? 'المعنى: "أُنَزِّهُ رَبِّيَ الْعَلِيَّ الْأَعْلَى فِي ذَاتِهِ وَصِفَاتِهِ عَنْ كُلِّ نَقْصٍ."' : 'ترجمہ: "میرا بلند و برتر رب پاک ہے"'}
                </p>
              </div>
              <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem' }}>
                  {isEn ? 'Supplication Between Prostrations (Jalsah):' : isAr ? 'الدعاء بين السجدتين (الجلسة):' : 'دو سجدوں کے درمیان دعا:'}
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#475569' }}>
                  {isEn ? 'Meaning: "My Lord, forgive me. My Lord, forgive me."' : isAr ? 'المعنى: "سُؤَالُ اللَّهِ مَغْفِرَةَ الذُّنُوبِ وَالتَّجَاوُزَ عَنِ الزَّلَّاتِ."' : 'ترجمہ: "اے میرے رب! مجھے بخش دے، اے میرے رب! مجھے بخش دے"'}
                </p>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {isEn ? 'Step 6' : isAr ? 'الخطوة السادسة' : 'مرحلہ ۶'}
              </span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
                {isEn ? 'Tashahhud (At-Tahiyyat)' : isAr ? 'التشهد في القعود (التحيات لله)' : 'قعدہ میں تشہد (التحیات)'}
              </h4>
            </div>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 2.1 }}>
                التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.92rem', color: '#334155', direction: dir, lineHeight: 1.8 }}>
                {isEn
                  ? 'Meaning: "All verbal, physical, and financial worships are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is His servant and messenger."'
                  : isAr
                    ? 'المعنى: "جَمِيعُ التَّعْظِيمَاتِ الْقَوْلِيَّةِ وَالْبَدَنِيَّةِ وَالْمَالِيَّةِ خَالِصَةٌ لِلَّهِ، وَالدُّعَاءُ بِالسَّلَامَةِ وَالرَّحْمَةِ لِلنَّبِيِّ ﷺ وَلِعِبَادِ اللَّهِ الصَّالِحِينَ، وَتَجْدِيدُ شَهَادَةِ التَّوْحِيدِ وَالرِّسَالَةِ."'
                    : 'ترجمہ: "تمام زبانی، بدنی اور مالی عبادتیں اللہ کے لیے ہیں۔ اے نبی! آپ پر سلامتی ہو اور اللہ کی رحمت اور اس کی برکتیں ہوں۔ سلام ہو ہم پر اور اللہ کے نیک بندوں پر۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اس کے بندے اور رسول ہیں۔"'
                }
              </p>
            </div>
          </div>

          {/* Step 7 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {isEn ? 'Step 7' : isAr ? 'الخطوة السابعة' : 'مرحلہ ۷'}
              </span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
                {isEn ? 'Durood-e-Ibrahimi (Salawat upon the Prophet)' : isAr ? 'الصلاة الإبراهيمية المباركة' : 'درودِ ابراہیمی'}
              </h4>
            </div>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 2.1 }}>
                اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.92rem', color: '#334155', direction: dir, lineHeight: 1.8 }}>
                {isEn
                  ? 'Meaning: "O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy, Full of Glory. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy, Full of Glory."'
                  : isAr
                    ? 'المعنى: "الصَّلَاةُ مِنَ اللَّهِ ثَنَاؤُهُ عَلَى نَبِيِّهِ فِي الْمَلَإِ الْأَعْلَى وَتَعْظِيمُ شَأْنِهِ فِي الدُّنْيَا وَالْآخِرَةِ، وَالْبَرَكَةُ طَلَبُ نَمَاءِ الْخَيْرِ وَدَوَامِهِ لِلنَّبِيِّ ﷺ وَلِآلِهِ."'
                    : 'ترجمہ: "اے اللہ! محمد ﷺ اور ان کی آل پر رحمت نازل فرما جیسا کہ تو نے ابراہیم علیہ السلام اور ان کی آل پر رحمت نازل فرمائی، بے شک تو تعریف کیا گیا بزرگی والا ہے۔ اے اللہ! محمد ﷺ اور ان کی آل پر برکت نازل فرما جیسا کہ تو نے ابراہیم علیہ السلام اور ان کی آل پر برکت نازل فرمائی، بے شک تو تعریف کیا گیا بزرگی والا ہے۔"'
                }
              </p>
            </div>
          </div>

          {/* Step 8 */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {isEn ? 'Step 8' : isAr ? 'الخطوة الثامنة' : 'مرحلہ ۸'}
              </span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>
                {isEn ? 'Dua Ma\'thoora & Tasleem (Concluding the Prayer)' : isAr ? 'الدعاء المأثور والتسليم' : 'دعائے ماثورہ اور سلام'}
              </h4>
            </div>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 2.1 }}>
                اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ
              </p>
              <p style={{ margin: '6px 0 12px 0', fontSize: '0.92rem', color: '#334155', direction: dir, lineHeight: 1.8 }}>
                {isEn
                  ? 'Meaning: "O Allah, I have wronged myself greatly, and none forgives sins except You. Forgive me with forgiveness from Yourself, and have mercy upon me. Indeed, You are the Forgiving, the Merciful."'
                  : isAr
                    ? 'المعنى: "اعْتِرَافٌ بِالتَّقْصِيرِ وَالذُّنُوبِ بَيْنَ يَدَيِ اللَّهِ، وَطَلَبٌ لِلْمَغْفِرَةِ الشَّامِلَةِ وَالرَّحْمَةِ الْوَاسِعَةِ الَّتِي لَا يَمْلِكُهَا إِلَّا هُوَ سُبْحَانَهُ."'
                    : 'ترجمہ: "اے اللہ! میں نے اپنی جان پر بہت ظلم کیا اور تیرے سوا گناہوں کو کوئی نہیں بخش سکتا، پس اپنی خاص بخشش سے میری مغفرت فرما اور مجھ پر رحم فرما، بے شک تو ہی بخشنے والا نہایت رحم کرنے والا ہے۔"'
                }
              </p>
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.85rem' }}>
                  {isEn ? 'Then turn your face right and left saying:' : isAr ? 'ثم يُسلّم يمنة ويسرة قائلاً:' : 'پھر دائیں اور بائیں طرف سلام پھیریں:'}
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 1.4: مرد اور عورت کی نماز میں مستند فرق / Differences Between Men & Women */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#fdf2f8', color: '#db2777', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-venus-mars" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#831843' }}>
              {isEn ? 'Fiqh Differences Between Men and Women in Salah' : isAr ? 'الفروق الفقهية المسنونة بين صلاة الرجل وصلاة المرأة' : 'مرد اور عورت کی نماز میں فقہی و مسنون فرق'}
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              {isEn ? 'Safeguarding modesty, modesty standards, and traditional Sunni jurisprudence' : isAr ? 'مراعاة الستر والحياء بحسب ما قرره فقهاء أهل السنة' : 'اہل سنت والجماعت کے حنفی و جمہور فقہاء کے مطابق ستر اور حیاء کے تقاضے'}
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isEn ? 'left' : 'right', direction: dir }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #db2777' }}>
                <th style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 800, width: '25%' }}>{isEn ? 'Posture / Action' : isAr ? 'الهيئة / الركن' : 'رکن / حالت'}</th>
                <th style={{ padding: '12px 14px', color: '#0284c7', fontWeight: 800, width: '37%' }}>{isEn ? 'Men\'s Posture' : isAr ? 'صلاة الرجل' : 'مرد کی ہیئت'}</th>
                <th style={{ padding: '12px 14px', color: '#db2777', fontWeight: 800, width: '38%' }}>{isEn ? 'Women\'s Posture' : isAr ? 'صلاة المرأة' : 'عورت کی ہیئت'}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>{isEn ? 'Raising hands for Takbeer' : isAr ? 'رفع اليدين في تكبيرة الإحرام' : 'تکبیرِ تحریمہ پر ہاتھ اٹھانا'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Raise hands up to earlobes, bringing hands out of garment.' : isAr ? 'يرفع يديه حتى تبلغ إبهاماه شحمتي أذنيه.' : 'کانوں کی لو تک ہاتھ اٹھائیں گے اور چادر سے ہاتھ باہر نکالیں گے۔'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Raise hands only to shoulder or chest level, staying beneath garment.' : isAr ? 'ترفع يديها حذو منكبيها أو صدرها تحت ثيابها ستراً لها.' : 'صرف کندھوں یا سینے تک ہاتھ اٹھائیں گی اور چادر کے اندر ہی رکھیں گی۔'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>{isEn ? 'Position of folded hands' : isAr ? 'موضع وضع اليدين في القيام' : 'ہاتھ باندھنے کی جگہ'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Grasp left wrist below the navel forming a circle.' : isAr ? 'يضع يده اليمنى على اليسرى تحت السرة.' : 'ناف کے نیچے دائیں ہاتھ سے بائیں کلائی کا حلقہ بنا کر باندھیں گے۔'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Place right hand over left palm upon the chest without forming a grip.' : isAr ? 'تضع يدها اليمنى على ظهر اليسرى على صدرها.' : 'سینے پر دایاں ہاتھ بائیں ہاتھ کی پشت پر بغیر حلقہ بنائے رکھیں گی۔'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>{isEn ? 'Ruku\' (Bowing) posture' : isAr ? 'هيئة الركوع' : 'رکوع کی کیفیت'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Back is straight and horizontal; fingers spread wide gripping knees.' : isAr ? 'يسوي ظهره ويفرج بين أصابعه قابضاً على ركبتيه.' : 'پیٹھ بالکل سیدھی رکھیں گے، انگلیاں کشادہ کر کے گھٹنوں کو مضبوط پکڑیں گے۔'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Bend slightly until hands touch knees; fingers joined, keeping compact.' : isAr ? 'تنحني يسيراً لتصل يداها إلى ركبتيها وتضم أصابعها.' : 'صرف اس قدر جھکیں گی کہ ہاتھ گھٹنوں تک پہنچ جائیں، انگلیاں ملا کر رکھیں گی اور پیٹھ کمان کی طرح رہے گی۔'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>{isEn ? 'Sujood (Prostration)' : isAr ? 'هيئة السجود' : 'سجدے کی کیفیت'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Keep stomach away from thighs, and elbows raised off the floor.' : isAr ? 'يجافي بطنه عن فخذيه وعضديه عن جنبيه.' : 'پیٹ رانوں سے اور کہنیاں زمین اور پسلیوں سے بالکل الگ رکھیں گے۔'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Stay compact; abdomen touching thighs, and forearms flat on ground.' : isAr ? 'تنضم وتلصق بطنها بفخذيها وتبسط ذراعيها على الأرض.' : 'بالکل سمٹ کر، پیٹ رانوں سے ملا کر اور کہنیاں زمین پر بچھا کر سجدہ کریں گی۔'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>{isEn ? 'Sitting in Tashahhud' : isAr ? 'الجلوس في التشهد' : 'قعدہ میں بیٹھنا'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Sit upon left foot with right foot upright (Iftirash).' : isAr ? 'يفترش رجله اليسرى ويجلس عليها وينصب اليمنى (الافتراش).' : 'بایاں پاؤں بچھا کر اس پر بیٹھیں گے اور دایاں پاؤں کھڑا رکھیں گے۔'}</td>
                <td style={{ padding: '12px 14px' }}>{isEn ? 'Shift both feet to the right side and sit directly on the ground (Tawarruk).' : isAr ? 'تخرج رجليها من الجانب الأيمن وتجلس على أليتها (التورك).' : 'دونوں پاؤں دائیں طرف نکال کر زمین پر سمٹ کر بیٹھیں گی (تورّک)۔'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ==============================================================================
// TAB 2: وضو، غسل و طہارت / Wudu & Ghusl
// ==============================================================================
function WuduGhuslTab({ copyToClipboard, copiedId, searchQuery, isAr, isEn, dir }) {
  const wuduFaraiz = [
    {
      num: '1',
      titleUr: 'چہرہ دھونا',
      titleAr: 'غسل الوجه',
      titleEn: 'Washing the entire face',
      descUr: 'پیشانی کے بالوں سے ٹھوڑی کے نیچے تک اور ایک کان کی لو سے دوسرے کان کی لو تک ایک بار دھونا فرض ہے۔',
      descAr: 'غسل الوجه كاملاً من منابت شعر الرأس المعتاد إلى أسفل الذقن، ومن شحمة الأذن إلى شحمة الأذن الأخرى.',
      descEn: 'Washing from the hairline of the forehead to beneath the chin, and from one earlobe to the other.'
    },
    {
      num: '2',
      titleUr: 'دونوں ہاتھ کہنیوں سمیت دھونا',
      titleAr: 'غسل اليدين مع المرفقين',
      titleEn: 'Washing both arms including elbows',
      descUr: 'انگلیوں کے پوروں سے لے کر کہنیوں سمیت دونوں ہاتھوں کو ایک بار دھونا فرض ہے۔',
      descAr: 'غسل اليدين من أطراف الأصابع إلى المرفقين وإدخال المرفقين في الغسل.',
      descEn: 'Washing both hands and arms from the fingertips up to and including the elbows.'
    },
    {
      num: '3',
      titleUr: 'چوتھائی سر کا مسح کرنا',
      titleAr: 'مسح ربع الرأس',
      titleEn: 'Wiping a quarter of the head (Masah)',
      descUr: 'کم از کم ایک چوتھائی سر پر بھیگا ہوا ہاتھ پھیرنا فرض ہے۔',
      descAr: 'إمرار اليد المبتلة بالماء على ربع الرأس على الأقل.',
      descEn: 'Passing wet hands over at least one-fourth of the head.'
    },
    {
      num: '4',
      titleUr: 'دونوں پاؤں ٹخنوں سمیت دھونا',
      titleAr: 'غسل الرجلين مع الكعبين',
      titleEn: 'Washing both feet including ankles',
      descUr: 'دونوں پاؤں انگلیوں سے ٹخنوں سمیت اچھی طرح دھونا فرض ہے۔',
      descAr: 'غسل الرجلين مع الكعبين وتعميم الماء عليهما حتى ينقى.',
      descEn: 'Thoroughly washing both feet from the toes up to and including both ankle bones.'
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 2.1: فرائض الوضوء / 4 Fard of Wudu */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #0284c7', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 4px 16px rgba(2,132,199,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-water" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0369a1' }}>
              {isEn ? '4 Obligatory Pillars (Fard) of Wudu & Sunnah Method' : isAr ? 'فرائض الوضوء الأربعة والصفة المسنونة' : 'وضو کے ۴ فرائض اور مکمل مسنون طریقہ'}
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              {isEn ? 'In accordance with Surah Al-Ma\'idah (5:6)' : isAr ? 'لقوله تعالى في سورة المائدة: {يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ...}' : 'قرآن مجید (سورۃ المائدہ: 6) کے احکام کے عین مطابق'}
            </p>
          </div>
        </div>

        {/* 4 Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {wuduFaraiz.map((item, idx) => (
            <div key={idx} style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '1.25rem', direction: dir, textAlign: isEn ? 'left' : 'right' }}>
              <span style={{ background: '#0284c7', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>
                {isEn ? `Fard ${item.num}` : isAr ? `الفرض ${item.num}` : `فرض ${item.num}`}
              </span>
              <h4 style={{ margin: '0.5rem 0 0.35rem 0', color: '#0369a1', fontSize: '1.05rem', fontWeight: 800 }}>
                {isEn ? item.titleEn : isAr ? item.titleAr : item.titleUr}
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                {isEn ? item.descEn : isAr ? item.descAr : item.descUr}
              </p>
            </div>
          ))}
        </div>

        {/* Wudu Duas */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.15rem', fontWeight: 800, textAlign: 'center' }}>
            {isEn ? 'Masnoon Duas of Wudu (with Virtues)' : isAr ? 'الأدعية المأثورة في الوضوء مع المعاني والفضائل' : 'وضو کی مسنون دعائیں مع ترجمہ و فضیلت'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.8rem' }}>
                {isEn ? 'Before Starting Wudu:' : isAr ? 'عند ابتداء الوضوء:' : 'وضو شروع کرتے وقت:'}
              </span>
              <p style={{ margin: '6px 0 0 0', fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                بِسْمِ اللَّهِ وَالْحَمْدُ لِلَّهِ
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#475569' }}>
                {isEn ? 'Meaning: "In the name of Allah, and all praise is for Allah."' : isAr ? 'المعنى: "الابْتِدَاءُ بِذِكْرِ اسْمِ اللَّهِ تَعَالَى تَبَرُّكًا، وَحَمْدُهُ سُبْحَانَهُ عَلَى نِعْمَةِ الْإِسْلَامِ وَالْمَاءِ الطَّهُورِ."' : 'ترجمہ: "اللہ کے نام سے اور تمام تعریفیں اللہ کے لیے ہیں"'}
              </p>
            </div>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.8rem' }}>
                {isEn ? 'Supplication After Finishing Wudu (All 8 gates of Jannah open - Sahih Muslim: 234):' : isAr ? 'الدعاء بعد الفراغ من الوضوء (تُفتح له أبواب الجنة الثمانية - صحيح مسلم: 234):' : 'وضو کے بعد کی دعا (جنت کے آٹھوں دروازے کھل جاتے ہیں - مسلم: 234):'}
              </span>
              <p style={{ margin: '6px 0 0 0', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 1.9 }}>
                أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ
              </p>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.92rem', color: '#334155', direction: dir, lineHeight: 1.7 }}>
                {isEn
                  ? 'Meaning: "I bear witness that there is no deity worthy of worship except Allah alone, without partner; and I bear witness that Muhammad is His servant and messenger. O Allah, make me of those who repent continually and make me of those who purify themselves."'
                  : isAr
                    ? 'المعنى: "إِعْلَانُ التَّوْحِيدِ الْخَالِصِ وَالرِّسَالَةِ، وَسُؤَالُ اللَّهِ أَنْ يَجْعَلَ الْعَبْدَ مُتَطَهِّرًا بَاطِنًا بِالتَّوْبَةِ كَمَا تَطَهَّرَ ظَاهِرًا بِالْمَاءِ."'
                    : 'ترجمہ: "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اور محمد ﷺ اس کے بندے اور رسول ہیں۔ اے اللہ! مجھے خوب توبہ کرنے والوں اور خوب پاکیزگی اختیار کرنے والوں میں بنا دے۔"'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2.2: فرائض الغسل / 3 Fard of Ghusl */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #059669', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#ecfdf5', color: '#059669', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-shower" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064e3b' }}>
              {isEn ? '3 Obligatory Pillars (Fard) of Ghusl & Complete Sunnah Method' : isAr ? 'فرائض الغسل الثلاثة والصفة المسنونة (الجنابة والحيض)' : 'غسل کے ۳ فرائض اور مسنون طریقہ (جنابت، حیض و نفاس)'}
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              {isEn ? 'Method of purifying from major ritual impurities (Janabat, Menses, Post-natal)' : isAr ? 'الصفة الشرعية الكاملة للتطهر ورفع الحدث الأكبر' : 'پاکیزگی حاصل کرنے کا مکمل شرعی طریقہ'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '1.25rem', direction: dir, textAlign: isEn ? 'left' : 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>{isEn ? 'Fard 1' : isAr ? 'الفرض ١' : 'فرض ۱'}</span>
            <h4 style={{ margin: '0.5rem 0 0.35rem 0', color: '#064e3b', fontSize: '1.1rem' }}>{isEn ? 'Rinsing mouth with gargling' : isAr ? 'المضمضة مع المبالغة' : 'غرغرہ کے ساتھ کلی کرنا'}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>{isEn ? 'Ensuring water reaches the throat (except when fasting).' : isAr ? 'إيصال الماء إلى أصل الفم والحلق (لغير الصائم).' : 'حلق کی جڑ تک پانی پہنچانا (روزے کی حالت میں غرغرہ نہ کریں)۔'}</p>
          </div>
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '1.25rem', direction: dir, textAlign: isEn ? 'left' : 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>{isEn ? 'Fard 2' : isAr ? 'الفرض ٢' : 'فرض ۲'}</span>
            <h4 style={{ margin: '0.5rem 0 0.35rem 0', color: '#064e3b', fontSize: '1.1rem' }}>{isEn ? 'Sniffing water deep into nostrils' : isAr ? 'الاستنشاق إلى المارن' : 'ناک میں نرم ہڈی تک پانی چڑھانا'}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>{isEn ? 'Washing both nostrils up to the soft nasal bone.' : isAr ? 'جذب الماء حتى يصل إلى أقصى عظم الأنف اللين.' : 'ناک کے دونوں نتھنوں کو نرم ہڈی تک اچھی طرح صاف کرنا۔'}</p>
          </div>
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '1.25rem', direction: dir, textAlign: isEn ? 'left' : 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>{isEn ? 'Fard 3' : isAr ? 'الفرض ٣' : 'فرض ۳'}</span>
            <h4 style={{ margin: '0.5rem 0 0.35rem 0', color: '#064e3b', fontSize: '1.1rem' }}>{isEn ? 'Pouring water over whole body' : isAr ? 'تعميم الجسد كله بالماء' : 'پورے جسم پر پانی بہانا'}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>{isEn ? 'Pouring water so not even a single hair\'s width remains dry.' : isAr ? 'إفاضة الماء على جميع البدن من شعر الرأس إلى أخمص القدمين دون ترك موضع شعرة.' : 'سر سے پاؤں تک اس طرح پانی بہانا کہ بال برابر جگہ بھی خشک نہ رہے۔'}</p>
          </div>
        </div>
      </div>

      {/* 2.3: التيمم / Tayammum */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #f59e0b', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <span style={{ background: '#fef3c7', color: '#d97706', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-mountain" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#92400e' }}>
              {isEn ? 'Tayammum (Dry Purification) Rules & Method' : isAr ? 'أحكام التيمم وصفته (عند تعذر وجود الماء أو المرض)' : 'تیمم کا طریقہ اور شرائط (پانی نہ ملنے پر)'}
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              {isEn ? 'Permissible when water is absent or using it causes serious harm or sickness' : isAr ? 'رخصة شرعية عند العجز عن استعمال الماء لمرض أو بعده مسافة ميل فأكثر' : 'بیماری کی صورت میں یا پانی ایک میل کی دوری پر دستیاب نہ ہونے کی صورت میں'}
            </p>
          </div>
        </div>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '1.25rem', direction: dir, lineHeight: 1.9, fontSize: '0.93rem', color: '#78350f' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>{isEn ? '3 Faraiz of Tayammum:' : isAr ? 'فرائض التيمم ثلاثة:' : 'تیمم کے ۳ فرائض ہیں:'}</strong>
          </p>
          <ol style={{ margin: 0, [isEn ? 'paddingLeft' : 'paddingRight']: '1.25rem' }}>
            <li><strong>{isEn ? 'Niyyah (Intention):' : isAr ? 'النية:' : 'نیت:'}</strong> {isEn ? 'Intending purification to make prayer permissible.' : isAr ? 'نية استباحة الصلاة ورفع الحدث.' : 'ناپاکی دور کرنے اور نماز کو حلال کرنے کی نیت کرنا۔'}</li>
            <li><strong>{isEn ? 'Wiping the Face:' : isAr ? 'مسح الوجه:' : 'چہرے کا مسح:'}</strong> {isEn ? 'Striking clean earth/stone, blowing off excess, and wiping the whole face.' : isAr ? 'ضرب اليدين على صعيد طاهر ثم نفضهما ومسح كامل الوجه بهما.' : 'پاک مٹی یا پتھر پر دونوں ہاتھ مار کر، جھاڑ کر پورے چہرے پر ملنا۔'}</li>
            <li><strong>{isEn ? 'Wiping Both Arms:' : isAr ? 'مسح اليدين إلى المرفقين:' : 'دونوں ہاتھوں کا مسح:'}</strong> {isEn ? 'Striking again and wiping both arms up to and including the elbows.' : isAr ? 'ضربة ثانية لمسح الذراعين واليدين إلى المرفقين.' : 'دوبارہ مٹی پر ہاتھ مار کر دائیں اور بائیں بازو کا کہنیوں سمیت مسح کرنا۔'}</li>
          </ol>
        </div>
      </div>

    </div>
  );
}

// ==============================================================================
// TAB 3: میت، جنازہ و قبرستان / Janaza & Graves
// ==============================================================================
function MayatJanazaTab({ copyToClipboard, copiedId, searchQuery, isAr, isEn, dir }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 3.1: صلاة الجنازة / Funeral Prayer Method */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #059669', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#ecfdf5', color: '#059669', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-users" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064e3b' }}>
              {isEn ? 'Funeral Prayer (Janaza) Method (4 Takbeerat)' : isAr ? 'صفة صلاة الجنازة (أربع تكبيرات)' : 'نمازِ جنازہ کا مسنون طریقہ (۴ تکبیرات)'}
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              {isEn ? 'Salat al-Janaza is Fard Kifayah; it has no Adhan, Iqamah, Ruku\', or Sujood' : isAr ? 'صلاة الجنازة فرض كفاية، ليس فيها أذان ولا إقامة ولا ركوع ولا سجود' : 'نمازِ جنازہ فرضِ کفایہ ہے، اس میں نہ اذان ہے، نہ اقامت، نہ رکوع اور نہ سجدہ'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.1rem', direction: dir, textAlign: isEn ? 'left' : 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>{isEn ? '1st Takbeer' : isAr ? 'التكبيرة الأولى' : 'تکبیر ۱'}</span>
            <h4 style={{ margin: '0.4rem 0', color: '#065f46', fontSize: '1rem' }}>{isEn ? 'Thana & Fatiha' : isAr ? 'الثناء والفاتحة' : 'ثناء پڑھنا'}</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>{isEn ? 'Raise hands to ears, fold hands, and recite Thana (including "Wa Jalla Thana\'uk").' : isAr ? 'يرفع يديه ويكبر ثم يعقد يديه ويقرأ الثناء وسورة الفاتحة.' : 'پہلی تکبیر پر ہاتھ کانوں تک اٹھا کر باندھ لیں اور ثناء (مع وَجَلَّ ثَنَاؤُكَ) پڑھیں۔'}</p>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.1rem', direction: dir, textAlign: isEn ? 'left' : 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>{isEn ? '2nd Takbeer' : isAr ? 'التكبيرة الثانية' : 'تکبیر ۲'}</span>
            <h4 style={{ margin: '0.4rem 0', color: '#065f46', fontSize: '1rem' }}>{isEn ? 'Durood Ibrahimi' : isAr ? 'الصلاة الإبراهيمية' : 'درودِ ابراہیمی پڑھنا'}</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>{isEn ? 'Say Allahu Akbar without raising hands and recite Durood-e-Ibrahimi.' : isAr ? 'يكبر دون رفع اليدين ويصلي على النبي ﷺ الصلاة الإبراهيمية.' : 'بغیر ہاتھ اٹھائے دوسری تکبیر کہہ کر نماز والا درودِ ابراہیمی پڑھیں۔'}</p>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.1rem', direction: dir, textAlign: isEn ? 'left' : 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>{isEn ? '3rd Takbeer' : isAr ? 'التكبيرة الثالثة' : 'تکبیر ۳'}</span>
            <h4 style={{ margin: '0.4rem 0', color: '#065f46', fontSize: '1rem' }}>{isEn ? 'Dua for the Deceased' : isAr ? 'الدعاء للميت' : 'میت کے لیے دعا پڑھنا'}</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>{isEn ? 'Say Allahu Akbar without raising hands and recite the specific Janaza Dua.' : isAr ? 'يكبر ويدعو للميت بالأدعية النبوية المأثورة بحسب حاله.' : 'بغیر ہاتھ اٹھائے تیسری تکبیر کہہ کر میت کی مخصوص مسنون دعا پڑھیں۔'}</p>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.1rem', direction: dir, textAlign: isEn ? 'left' : 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>{isEn ? '4th Takbeer' : isAr ? 'التكبيرة الرابعة' : 'تکبیر ۴'}</span>
            <h4 style={{ margin: '0.4rem 0', color: '#065f46', fontSize: '1rem' }}>{isEn ? 'Tasleem (Salam)' : isAr ? 'التسليم' : 'سلام پھیرنا'}</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>{isEn ? 'Say Allahu Akbar and turn face right and left for Salam, lowering hands.' : isAr ? 'يكبر ويسلم عن يمينه وعن شماله ويسدل يديه.' : 'چوتھی تکبیر کہہ کر دائیں اور بائیں جانب سلام پھیر کر ہاتھ کھول دیں۔'}</p>
          </div>
        </div>
      </div>

      {/* 3.2: 3 Authentic Janaza Duas */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>
          {isEn ? '3 Authentic Janaza Supplications (with Meanings)' : isAr ? 'الأدعية المأثورة في صلاة الجنازة مع المعنى والبيان' : 'نمازِ جنازہ کی مسنون دعائیں مع ترجمہ'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Dua 1: Adult */}
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '3px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800 }}>
                {isEn ? '1. Janaza Dua for Adults (Male or Female)' : isAr ? '١. دعاء الجنازة للبالغ (رجلاً كان أو امرأة)' : '۱. بالغ مرد اور عورت کا جنازہ'}
              </span>
              <span style={{ color: '#065f46', fontSize: '0.8rem', fontWeight: 700 }}>
                {isEn ? 'Sunan Abi Dawud: 3201 • Tirmidhi: 1024 (Sahih)' : isAr ? 'سنن أبي داود: 3201 • الترمذي: 1024 (صحيح)' : 'سنن ابو داؤد: 3201 • سنن ترمذی: 1024 (صحیح)'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', textAlign: 'center', lineHeight: 2.1, direction: 'rtl' }}>
              اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا، اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الْإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الْإِيمَانِ
            </p>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '0.85rem 1.15rem', marginTop: '0.85rem', direction: dir }}>
              <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>
                {isEn ? 'Meaning / Translation:' : isAr ? 'المعنى والتفسير:' : 'اردو ترجمہ:'}
              </span>
              <p style={{ margin: 0, fontSize: '0.98rem', color: '#1e293b', lineHeight: 1.7 }}>
                {isEn
                  ? '"O Allah, forgive our living and our dead, those present and those absent, our young and our old, our males and our females. O Allah, whomsoever You keep alive among us, keep him alive upon Islam, and whomsoever You cause to die, cause him to die upon Faith."'
                  : isAr
                    ? 'دُعَاءٌ جَامِعٌ لِجَمِيعِ أُمَّةِ الْإِسْلَامِ أَحْيَائِهِمْ وَأَمْوَاتِهِمْ بِالْمَغْفِرَةِ وَالرَّحْمَةِ، وَسُؤَالُ اللَّهِ أَنْ يُثَبِّتَنَا عَلَى شَرَائِعِ الْإِسْلَامِ فِي الْحَيَاةِ، وَأَنْ يَخْتِمَ لَنَا بِكَمَالِ الْإِيمَانِ عِنْدَ الْمَمَاتِ.'
                    : '"اے اللہ! ہمارے زندوں اور ہمارے مُردوں کو بخش دے، ہمارے حاضرین اور ہمارے غائبین کو، ہمارے چھوٹوں اور ہمارے بڑوں کو، اور ہمارے مردوں اور ہماری عورتوں کو۔ اے اللہ! تو ہم میں سے جس کو زندہ رکھے اسے اسلام پر زندہ رکھ، اور جس کو موت دے اسے ایمان پر موت دے۔"'
                }
              </p>
            </div>
          </div>

          {/* Dua 2: Boy child */}
          <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ background: '#0284c7', color: '#ffffff', padding: '3px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800 }}>
                {isEn ? '2. Janaza Dua for a Male Child' : isAr ? '٢. دعاء الجنازة للصبي غير البالغ' : '۲. نابالغ لڑکے (بچے) کا جنازہ'}
              </span>
              <span style={{ color: '#0369a1', fontSize: '0.8rem', fontWeight: 700 }}>
                {isEn ? 'Ibn Abi Shaybah: 11496 • Bukhari (Ta\'liq)' : isAr ? 'مصنف ابن أبي شيبة: 11496 • البخاري تعليقاً' : 'مصنف ابن ابی شیبہ: 11496 • صحیح بخاری تعلیقاً'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#0369a1', textAlign: 'center', lineHeight: 2.1, direction: 'rtl' }}>
              اللَّهُمَّ اجْعَلْهُ لَنَا فَرَطًا، وَاجْعَلْهُ لَنَا أَجْرًا وَذُخْرًا، وَاجْعَلْهُ لَنَا شَافِعًا وَمُشَفَّعًا
            </p>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '0.85rem 1.15rem', marginTop: '0.85rem', direction: dir }}>
              <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>
                {isEn ? 'Meaning / Translation:' : isAr ? 'المعنى والتفسير:' : 'اردو ترجمہ:'}
              </span>
              <p style={{ margin: 0, fontSize: '0.98rem', color: '#1e293b', lineHeight: 1.7 }}>
                {isEn
                  ? '"O Allah, make him for us a forerunner, and make him for us a source of reward and treasure, and make him for us an intercessor whose intercession is accepted."'
                  : isAr
                    ? 'الْفَرَطُ هُوَ السَّابِقُ الَّذِي يَتَقَدَّمُ الْقَوْمَ لِيُهَيِّئَ لَهُمْ الْمَنْزِلَ، فَيَكُونُ هَذَا الصَّغِيرُ سَابِقًا لِوَالِدَيْهِ لِيَكُونَ لَهُمَا ذُخْرًا وَأَجْرًا مُضَاعَفًا عِنْدَ اللَّهِ، وَشَافِعًا مَقْبُولَ الشَّفَاعَةِ يَوْمَ الْقِيَامَةِ.'
                    : '"اے اللہ! اس بچے کو ہمارے لیے آگے پہنچ کر سامانِ راحت مہیا کرنے والا بنا، اور اس کو ہمارے لیے اجر و ثواب اور ذخیرۂ آخرت بنا، اور اس کو ہمارے حق میں سفارش کرنے والا اور مقبول الشفاعت بنا۔"'
                }
              </p>
            </div>
          </div>

          {/* Dua 3: Girl child */}
          <div style={{ background: '#fdf2f8', border: '1.5px solid #fbcfe8', borderRadius: '16px', padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ background: '#db2777', color: '#ffffff', padding: '3px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800 }}>
                {isEn ? '3. Janaza Dua for a Female Child' : isAr ? '٣. دعاء الجنازة للصبية غير البالغة' : '۳. نابالغ لڑکی (بچی) کا جنازہ'}
              </span>
              <span style={{ color: '#9d174d', fontSize: '0.8rem', fontWeight: 700 }}>
                {isEn ? 'Sunan & Fiqh Compendiums' : isAr ? 'كتب الفقه والسنة' : 'کتب فقہ و سنن'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#831843', textAlign: 'center', lineHeight: 2.1, direction: 'rtl' }}>
              اللَّهُمَّ اجْعَلْهَا لَنَا فَرَطًا، وَاجْعَلْهَا لَنَا أَجْرًا وَذُخْرًا، وَاجْعَلْهَا لَنَا شَافِعَةً وَمُشَفَّعَةً
            </p>
            <div style={{ background: 'var(--surface-paper)', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '0.85rem 1.15rem', marginTop: '0.85rem', direction: dir }}>
              <span style={{ color: '#db2777', fontWeight: 800, fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>
                {isEn ? 'Meaning / Translation:' : isAr ? 'المعنى والتفسير:' : 'اردو ترجمہ:'}
              </span>
              <p style={{ margin: 0, fontSize: '0.98rem', color: '#1e293b', lineHeight: 1.7 }}>
                {isEn
                  ? '"O Allah, make her for us a forerunner, and make her for us a source of reward and treasure, and make her for us an intercessor whose intercession is accepted."'
                  : isAr
                    ? 'الدُّعَاءُ لِلْبِنْتِ الصَّغِيرَةِ بِأَنْ يَجْعَلَهَا اللَّهُ سَابِقَةً لِأَهْلِهَا إِلَى الْجَنَّةِ، وَذُخْرًا وَأَجْرًا صَالِحًا، وَشَافِعَةً مُشَفَّعَةً لِوَالِدَيْهَا.'
                    : '"اے اللہ! اس بچی کو ہمارے لیے آگے پہنچ کر سامانِ راحت مہیا کرنے والی بنا، اور اس کو ہمارے لیے اجر و ثواب اور ذخیرۂ آخرت بنا، اور اس کو ہمارے حق میں سفارش کرنے والی اور مقبول الشفاعت بنا۔"'
                }
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3.3: Grave Duas */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#064e3b', textAlign: 'center' }}>
          {isEn ? 'Lowering into Grave, Burial Earth, and Visiting Graves' : isAr ? 'أدعية إنزال الميت، إهالة التراب، وزيارة المقابر' : 'میت کو قبر میں اتارنے، مٹی ڈالنے اور قبرستان کی دعائیں'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
          
          {/* Lowering into grave */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ background: '#ecfdf5', color: '#065f46', padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>
              {isEn ? 'When Lowering into Grave (Abu Dawud: 3213)' : isAr ? 'دعاء إنزال الميت في اللحد (أبو داود: 3213)' : 'میت کو قبر میں اتارنے کی دعا'}
            </span>
            <p style={{ margin: '0.75rem 0', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
              بِسْمِ اللَّهِ وَعَلَىٰ مِلَّةِ رَسُولِ اللَّهِ
            </p>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', direction: dir }}>
              {isEn ? 'Meaning: "In the name of Allah, and upon the religion and tradition of the Messenger of Allah ﷺ."' : isAr ? 'المعنى: "إِيدَاعُ الْمَيِّتِ فِي قَبْرِهِ بِاسْمِ اللَّهِ وَعَلَى هَدْيِ وَسُنَّةِ وَشَرِيعَةِ نَبِيِّهِ مُحَمَّدٍ ﷺ."' : 'ترجمہ: "اللہ کے نام سے اور رسول اللہ ﷺ کے طریقے (ملت) پر اتارتے ہیں۔"'}
            </p>
          </div>

          {/* 3 Handfuls of Dirt */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>
              {isEn ? 'Quranic Verses with 3 Handfuls of Earth' : isAr ? 'الآيات عند إهالة الحثيات الثلاث من التراب' : 'قبر پر ۳ مٹھی مٹی ڈالتے وقت'}
            </span>
            <p style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#92400e', lineHeight: 1.8 }}>
              ١. مِنْهَا خَلَقْنَاكُمْ <br />
              ٢. وَفِيهَا نُعِيدُكُمْ <br />
              ٣. وَمِنْهَا نُخْرِجُكُمْ تَارَةً أُخْرَىٰ
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', direction: dir }}>
              {isEn ? 'Meaning: "From it We created you, and into it We will return you, and from it We will bring you out once again."' : isAr ? 'المعنى: "تَذَكُّرُ أَصْلِ خَلْقِ الْإِنْسَانِ مِنَ التُّرَابِ، وَعَوْدَتِهِ إِلَيْهِ عِنْدَ الْمَوْتِ، وَبَعْثِهِ مِنْهُ يَوْمَ الْقِيَامَةِ."' : 'ترجمہ: (ہم نے اسی مٹی سے تمہیں پیدا کیا، اسی میں لوٹائیں گے، اور اسی سے دوبارہ نکالیں گے)'}
            </p>
          </div>

          {/* Visiting Cemetery */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', gridColumn: '1 / -1' }}>
            <span style={{ background: '#f0fdf4', color: '#047857', padding: '3px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800 }}>
              {isEn ? 'Visiting the Cemetery & Graves (Sahih Muslim: 975)' : isAr ? 'دعاء دخول المقابر والسلام على أهل القبور (صحيح مسلم: 975)' : 'قبرستان میں داخل ہونے کی مسنون دعا (صحیح مسلم: 975)'}
            </span>
            <p style={{ margin: '0.75rem 0', fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 1.9 }}>
              السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ، أَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ
            </p>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', direction: dir }}>
              {isEn
                ? 'Meaning: "Peace be upon you, O dwellers of this place among the believers and Muslims! And indeed we, if Allah wills, shall surely join you. I ask Allah for well-being for us and for you."'
                : isAr
                  ? 'المعنى: "إِلْقَاءُ السَّلَامِ عَلَى أَهْلِ الْقُبُورِ مِنَ الْمُؤْمِنِينَ، وَتَذَكُّرُ اللِّحَاقِ بِهِمْ قَرِيبًا، وَسُؤَالُ اللَّهِ الْعَفْوَ وَالْعَافِيَةَ وَالسَّلَامَةَ مِنَ الْعَذَابِ."'
                  : 'ترجمہ: "سلامتی ہو تم پر اے بستی والوں، مومنوں اور مسلمانوں میں سے! اور ہم بھی، اگر اللہ نے چاہا، تمہارے ساتھ ضرور ملنے والے ہیں۔ میں اللہ تعالیٰ سے اپنے لیے اور تمہارے لیے عافیت و سلامتی مانگتا ہوں۔"'
              }
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

// ==============================================================================
// TAB 4: Daily Duas / أذكار اليوم والليلة / دن اور رات کی مسنون دعائیں
// ==============================================================================
function DailyDuasTab({ copyToClipboard, copiedId, searchQuery, isAr, isEn, dir }) {
  const duasList = [
    {
      id: 'dua_sleep_wake',
      titleUr: 'صبح بیدار ہونے کی دعا',
      titleAr: 'أذكار الاستيقاظ من النوم',
      titleEn: 'Upon Waking Up from Sleep',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      meaningUr: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف اٹھ کر جانا ہے۔',
      meaningAr: 'الحمد والشكر لله الذي رد إلينا أرواحنا بعد النوم، وإليه المرجع والبعث والنشور يوم القيامة.',
      meaningEn: 'All praise is due to Allah who gave us life after giving us death, and unto Him is the resurrection.',
      refUr: 'صحیح بخاری: 6312',
      refAr: 'صحيح البخاري: 6312',
      refEn: 'Sahih Al-Bukhari: 6312'
    },
    {
      id: 'dua_sleep_night',
      titleUr: 'رات سونے کی دعا',
      titleAr: 'دعاء النوم عند الاضطجاع',
      titleEn: 'Before Sleeping at Night',
      arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
      meaningUr: 'اے اللہ! میں تیرے ہی نام کے ساتھ مرتا ہوں (سوتا ہوں) اور جیتا ہوں (جاگتا ہوں)۔',
      meaningAr: 'أنام وأستيقظ باسمك وبركتك ورعايتك يا الله.',
      meaningEn: 'O Allah, in Your name I die and I live.',
      refUr: 'صحیح بخاری: 6314',
      refAr: 'صحيح البخاري: 6314',
      refEn: 'Sahih Al-Bukhari: 6314'
    },
    {
      id: 'dua_washroom_enter',
      titleUr: 'بیت الخلاء (واش روم) جانے کی دعا',
      titleAr: 'دعاء دخول الخلاء',
      titleEn: 'Entering the Restroom / Washroom',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
      meaningUr: 'اے اللہ! میں خبیث جنوں (نر) اور خبیث جننیوں (مادہ) کی برائی سے تیری پناہ مانگتا ہوں۔',
      meaningAr: 'الاستعاذة بالله من ذكور الشياطين وإناثهم ومن كل شر ونجاسة.',
      meaningEn: 'O Allah, I seek refuge in You from impure male and female spirits.',
      refUr: 'صحیح بخاری: 142 • صحیح مسلم: 375',
      refAr: 'صحيح البخاري: 142 • صحيح مسلم: 375',
      refEn: 'Bukhari: 142 • Muslim: 375'
    },
    {
      id: 'dua_washroom_exit',
      titleUr: 'بیت الخلاء سے نکلنے کی دعا',
      titleAr: 'دعاء الخروج من الخلاء',
      titleEn: 'Leaving the Restroom / Washroom',
      arabic: 'غُفْرَانَكَ، الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَىٰ وَعَافَانِي',
      meaningUr: 'اے اللہ! میں تیری بخشش مانگتا ہوں۔ تمام تعریفیں اس اللہ کے لیے ہیں جس نے مجھ سے تکلیف دہ چیز کو دور کیا اور مجھے عافیت بخشی۔',
      meaningAr: 'طلب مغفرة الله وشكره على نعمة إخراج الفضلات المؤذية وتفضل العافية والصحة.',
      meaningEn: 'I seek Your forgiveness. All praise is for Allah who removed harm from me and relieved me.',
      refUr: 'سنن ابو داؤد: 17 • ابن ماجہ: 300',
      refAr: 'سنن أبي داود: 17 • ابن ماجه: 300',
      refEn: 'Abu Dawud: 17 • Ibn Majah: 300'
    },
    {
      id: 'dua_food_before',
      titleUr: 'کھانا شروع کرنے کی دعا',
      titleAr: 'الدعاء عند ابتداء الطعام',
      titleEn: 'Before Eating Food',
      arabic: 'بِسْمِ اللَّهِ وَعَلَىٰ بَرَكَةِ اللَّهِ',
      meaningUr: 'اللہ کے نام سے اور اللہ کی برکت کے ساتھ (کھانا شروع کرتا ہوں)۔',
      meaningAr: 'التسمية وطلب بركة الله تعالى ونمائها في الرزق والطعام.',
      meaningEn: 'In the name of Allah and upon the blessing of Allah (I begin eating).',
      refUr: 'مستدرک حاکم: 7084',
      refAr: 'مستدرك الحاكم: 7084',
      refEn: 'Mustadrak Al-Hakim: 7084'
    },
    {
      id: 'dua_food_after',
      titleUr: 'کھانے کے بعد کی دعا',
      titleAr: 'دعاء الفراغ من الطعام',
      titleEn: 'After Finishing the Meal',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ',
      meaningUr: 'تمام تعریفیں اس اللہ کے لیے ہیں جس نے ہمیں کھلایا، پلایا اور ہمیں مسلمانوں میں سے بنایا۔',
      meaningAr: 'شكر المنعم سبحانه على نعم الرزق والطعام والشراب وأجل نعمة: نعمة الإسلام.',
      meaningEn: 'All praise is due to Allah who fed us, gave us drink, and made us of the Muslims.',
      refUr: 'سنن ابو داؤد: 3850 • ترمذی: 3457',
      refAr: 'سنن أبي داود: 3850 • الترمذي: 3457',
      refEn: 'Abu Dawud: 3850 • Tirmidhi: 3457'
    },
    {
      id: 'dua_house_exit',
      titleUr: 'گھر سے نکلتے وقت کی دعا',
      titleAr: 'دعاء الخروج من المنزل',
      titleEn: 'Leaving the House',
      arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      meaningUr: 'اللہ کے نام کے ساتھ، میں نے اللہ ہی پر بھروسہ کیا، برائی سے بچنے اور نیکی کرنے کی طاقت صرف اللہ ہی کی توفیق سے ہے۔',
      meaningAr: 'تفويض الأمور لله تعالى والاعتماد عليه وحده؛ يقال له: كفيت وهديت ووقيت وتنحى عنه الشيطان.',
      meaningEn: 'In the name of Allah, I rely upon Allah; there is no might and no power except with Allah.',
      refUr: 'سنن ابو داؤد: 5095 • ترمذی: 3426',
      refAr: 'سنن أبي داود: 5095 • الترمذي: 3426',
      refEn: 'Abu Dawud: 5095 • Tirmidhi: 3426'
    },
    {
      id: 'dua_house_enter',
      titleUr: 'گھر میں داخل ہونے کی دعا',
      titleAr: 'دعاء الدخول إلى المنزل',
      titleEn: 'Entering the House',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
      meaningUr: 'اے اللہ! میں تجھ سے اندر آنے کی بھلائی اور باہر نکلنے کی بھلائی کا سوال کرتا ہوں۔ اللہ کے نام کے ساتھ ہم داخل ہوئے اور اللہ کے نام کے ساتھ نکلے اور اپنے رب اللہ پر ہم نے بھروسہ کیا۔',
      meaningAr: 'سؤال الله البركة والسلامة في الدخول والخروج والاعتماد على حفظه.',
      meaningEn: 'O Allah, I ask You for the good of entering and the good of exiting. In the name of Allah we enter, in the name of Allah we exit, and upon Allah our Lord we rely.',
      refUr: 'سنن ابو داؤد: 5096',
      refAr: 'سنن أبي داود: 5096',
      refEn: 'Abu Dawud: 5096'
    },
    {
      id: 'dua_masjid_enter',
      titleUr: 'مسجد میں داخل ہونے کی دعا',
      titleAr: 'دعاء دخول المسجد',
      titleEn: 'Entering the Mosque (Masjid)',
      arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
      meaningUr: 'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔',
      meaningAr: 'سؤال الله تعالى أن ينزل رحمته وفيوضاته وتوفيقه في بيته الحرام.',
      meaningEn: 'O Allah, open for me the gates of Your mercy.',
      refUr: 'صحیح مسلم: 713',
      refAr: 'صحيح مسلم: 713',
      refEn: 'Sahih Muslim: 713'
    },
    {
      id: 'dua_masjid_exit',
      titleUr: 'مسجد سے نکلنے کی دعا',
      titleAr: 'دعاء الخروج من المسجد',
      titleEn: 'Exiting the Mosque (Masjid)',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
      meaningUr: 'اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔',
      meaningAr: 'طلب الرزق الحلال والخير والفضل عند الخروج لمشاغل الدنيا.',
      meaningEn: 'O Allah, I ask You of Your bounty and favor.',
      refUr: 'صحیح مسلم: 713',
      refAr: 'صحيح مسلم: 713',
      refEn: 'Sahih Muslim: 713'
    },
    {
      id: 'dua_travel',
      titleUr: 'سفر کی مسنون دعا',
      titleAr: 'دعاء السفر وركوب الدابة',
      titleEn: 'Supplication for Travel & Riding',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
      meaningUr: 'پاک ہے وہ ذات جس نے اس (سواری) کو ہمارے قابو میں کر دیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے، اور بے شک ہم اپنے رب ہی کی طرف لوٹنے والے ہیں۔',
      meaningAr: 'تسبيح الله على تيسير وسائل الركوب والسفر وتذكر سفر الآخرة والرجوع إلى الله.',
      meaningEn: 'Glory be to Him who has subjected this to us, whereas we were not able to overcome it by ourselves; and indeed, to our Lord we shall return.',
      refUr: 'صحیح مسلم: 1342',
      refAr: 'صحيح مسلم: 1342',
      refEn: 'Sahih Muslim: 1342'
    },
    {
      id: 'dua_anxiety_debt',
      titleUr: 'پریشانی، غم اور قرض سے نجات کی دعا',
      titleAr: 'دعاء تفريج الهم والحزن وقضاء الدين',
      titleEn: 'Relief from Anxiety, Grief & Debt',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
      meaningUr: 'اے اللہ! میں غم اور فکر سے تیری پناہ مانگتا ہوں، اور عاجزی اور سستی سے تیری پناہ مانگتا ہوں، اور بزدلی اور بخل سے تیری پناہ مانگتا ہوں، اور قرض کے غلبے اور لوگوں کے دباؤ سے تیری پناہ مانگتا ہوں۔',
      meaningAr: 'الاستعاذة الشاملة بالله من الآفات النفسية والمادية، وتفريج الكرب وقضاء الديون وغلبة الظالمين.',
      meaningEn: 'O Allah, I seek refuge in You from anxiety and grief, weakness and laziness, cowardice and stinginess, and the burden of debt and subjugation by men.',
      refUr: 'صحیح بخاری: 2893 • ابو داؤد: 1555',
      refAr: 'صحيح البخاري: 2893 • سنن أبي داود: 1555',
      refEn: 'Bukhari: 2893 • Abu Dawud: 1555'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#064e3b' }}>
          {isEn ? 'Essential Daily Day & Night Masnoon Supplications' : isAr ? 'أذكار اليوم والليلة والأدعية النبوية المأثورة' : 'صبح و شام اور روزمرہ کی اہم ترین مسنون دعائیں'}
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
          {isEn ? 'Derived from authentic Sahih Hadith collections with meanings and citations' : isAr ? 'أدعية من صحيح السنة النبوية مع بيان المعاني والمصادر' : 'صحیح احادیثِ نبویہ سے ماخوذ دعائیں مع اردو ترجمہ و حوالہ'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1rem' }}>
        {duasList.map(item => {
          const title = isEn ? item.titleEn : isAr ? item.titleAr : item.titleUr;
          const meaning = isEn ? item.meaningEn : isAr ? item.meaningAr : item.meaningUr;
          const ref = isEn ? item.refEn : isAr ? item.refAr : item.refUr;

          return (
            <div
              key={item.id}
              style={{
                background: 'var(--surface-paper)',
                border: '1.5px solid #e2e8f0',
                borderRadius: '18px',
                padding: '1.35rem 1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800 }}>
                    {title}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${title}\n\n${item.arabic}\n\n${meaning}\n\n${ref}`, item.id)}
                    style={{
                      background: copiedId === item.id ? '#10b981' : '#f8fafc',
                      color: copiedId === item.id ? '#ffffff' : '#64748b',
                      border: '1px solid #cbd5e1',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <i className={copiedId === item.id ? "fas fa-check" : "fas fa-copy"} /> {copiedId === item.id ? (isEn ? 'Copied' : isAr ? 'تم النسخ' : 'کاپی ہو گئی') : (isEn ? 'Copy' : isAr ? 'نسخ' : 'کاپی')}
                  </button>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 1.9 }}>
                    {item.arabic}
                  </p>
                </div>

                <p style={{ margin: 0, fontSize: '0.92rem', color: '#1e293b', direction: dir, textAlign: isEn ? 'left' : 'right', lineHeight: 1.7 }}>
                  "{meaning}"
                </p>
              </div>

              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: isEn ? 'flex-start' : 'flex-end' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>📚 {ref}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==============================================================================
// TAB 5: المسائل وسجود السهو والقضاء / Essential Fiqh Masail
// ==============================================================================
function MasaelTab({ copyToClipboard, copiedId, searchQuery, isAr, isEn, dir }) {
  const masaelList = [
    {
      titleUr: 'سجدہ سہو کا طریقہ اور واجب ہونے کے اسباب',
      titleAr: 'أحكام سجود السهو وموجباته وكيفيته',
      titleEn: 'Sajda-e-Sahw (Prostration of Forgetfulness) Method & Causes',
      badgeUr: 'سجدہ سہو',
      badgeAr: 'سجود السهو',
      badgeEn: 'Sajda Sahw',
      badgeColor: '#c2410c',
      bgLight: '#fff7ed',
      descUr: 'اگر نماز میں بھولے سے کوئی واجب چھوٹ جائے یا کسی واجب یا فرض میں تاخیر ہو جائے تو سجدہ سہو واجب ہو جاتا ہے۔',
      descAr: 'يجب سجود السهو عند ترك واجب من واجبات الصلاة سهواً أو تأخير ركن أو واجب.',
      descEn: 'Sajda-e-Sahw becomes obligatory if an essential Wajib of Salah is missed inadvertently or delayed.',
      stepsUr: [
        'قعدہ اخیرہ میں صرف تشہد (التحیات) پڑھیں۔',
        'دائیں طرف سلام پھیریں۔',
        'تکبیر کہہ کر معمول کے مطابق دو سجدے کریں اور تسبیحات پڑھیں۔',
        'دوبارہ تشہد، درودِ ابراہیمی اور دعائے ماثورہ پڑھ کر دونوں طرف سلام پھیریں۔'
      ],
      stepsAr: [
        'الجلوس في القعود الأخير وقراءة التشهد فقط.',
        'التسليم عن اليمين تسليمة واحدة.',
        'التكبير وسجود سجدتين كسجود الصلاة مع التسبيح فيهما.',
        'إعادة قراءة التشهد والصلاة الإبراهيمية والدعاء المأثور ثم التسليم عن اليمين واليسار.'
      ],
      stepsEn: [
        'In the final sitting (Qa\'dah Akheerah), recite only the Tashahhud (At-Tahiyyat).',
        'Turn face to the right side only and pronounce one Salam.',
        'Say "Allahu Akbar" and perform two normal prostrations with their regular glorifications.',
        'Sit again and recite Tashahhud, Durood-e-Ibrahimi, and Dua Ma\'thoora, then perform Salam to both sides.'
      ]
    },
    {
      titleUr: 'قضا نمازوں کا حساب اور ادا کرنے کا آسان طریقہ',
      titleAr: 'كيفية قضاء الصلوات الفائتة وجدولها',
      titleEn: 'Missed Prayers (Qaza): Calculation & Daily Makeup Routine',
      badgeUr: 'قضا نمازیں',
      badgeAr: 'قضاء الفوائت',
      badgeEn: 'Qaza Prayers',
      badgeColor: '#059669',
      bgLight: '#ecfdf5',
      descUr: 'جو نمازیں غفلت یا کسی عذر سے چھوٹ گئیں ان کی قضا فرض ہے، توبہ کے ساتھ قضا ادا کرنا ضروری ہے۔',
      descAr: 'الصلوات التي فاتت المسلم لعذر أو تهاون يجب قضاؤها باتفاق الفقهاء مع التوبة والاستغفار.',
      descEn: 'Prayers missed due to negligence or valid excuses must be made up (Qaza) alongside sincere repentance.',
      stepsUr: [
        'ایک اندازہ لگائیں کہ کل کتنی نمازیں قضا ہوئیں (مثلاً ۲ سال یا ۳ سال کی)۔',
        'روزانہ ہر وقتی نماز کے ساتھ اسی وقت کی ایک قضا نماز پڑھیں (مثلاً ظہر کے ساتھ ایک قضا ظہر)۔',
        'قضا نماز میں صرف فرض اور وتر پڑھے جاتے ہیں (سنتیں قضا نہیں ہوتیں)۔',
        'نیت یوں کریں: "میری سب سے پہلی فوت شدہ نماز جو باقی ہے وہ ادا کرتا ہوں۔"'
      ],
      stepsAr: [
        'تقدير عدد الصلوات الفائتة بالتقريب والتحوط.',
        'أداء صلاة فائتة مع كل صلاة حاضرة يومياً (كقضاء ظهر مع الظهر).',
        'يُقضى الفرض والوتر فقط دون السنن الرواتب.',
        'النية: "أنوي قضاء أول صلاة ظهر فاتتني ولم أؤدها".'
      ],
      stepsEn: [
        'Estimate total missed prayers conservatively (e.g. 1 year, 2 years).',
        'Pray one missed prayer alongside each daily timely prayer (e.g., 1 Qaza Dhuhr with Dhuhr).',
        'Only Fard and Witr prayers are made up; Sunnah prayers are not made up.',
        'Make intention: "I intend to make up the earliest missed prayer of this type due upon me."'
      ]
    },
    {
      titleUr: 'مسافر کی نماز (قصر کے فقہی احکام)',
      titleAr: 'صلاة المسافر وأحكام القصر في السفر',
      titleEn: 'Traveler\'s Prayer (Qasr Shortening Rules in Fiqh)',
      badgeUr: 'مسافر و قصر',
      badgeAr: 'قصر الصلاة',
      badgeEn: 'Musafir Qasr',
      badgeColor: '#0284c7',
      bgLight: '#f0f9ff',
      descUr: 'جب کوئی شخص اپنے شہر یا آبادی سے 48 میل (تقریباً 77.5 کلومیٹر) کی دوری کے ارادے سے نکلے تو وہ مسافر بن جاتا ہے۔',
      descAr: 'إذا خرج المسلم قاصداً مسافة السفر (نحو 77.5 كم فأكثر) شُرع له قصر الصلاة الرباعية.',
      descEn: 'A person traveling outside their city with intention to travel at least 48 miles (~77.5 km) is classified as a Musafir.',
      stepsUr: [
        'مسافر کے لیے ظہر، عصر اور عشاء کے ۴ فرضوں کو ۲ رکعت پڑھنا (قصر کرنا) واجب ہے۔',
        'فجر (۲ فرض)، مغرب (۳ فرض) اور عشاء کے وتر (۳ رکعت) میں کوئی قصر نہیں، وہ پورے پڑھے جائیں گے۔',
        'اگر سفر میں جلدی اور مشقت ہو تو سنتیں چھوڑنے کی اجازت ہے، ورنہ پڑھ لینا بہتر ہے۔',
        'اگر کسی جگہ ۱۵ دن یا اس سے زیادہ ٹھہرنے کی نیت ہو تو وہ مقیم بن جائے گا اور پوری نماز پڑھے گا۔'
      ],
      stepsAr: [
        'يقصر المسافر الصلاة الرباعية (الظهر والعصر والعشاء) إلى ركعتين.',
        'لا قصر في الفجر (ركعتان) والمغرب (ثلاث) والوتر.',
        'يجوز ترك السنن الرواتب في السفر تخفيفاً باستثناء سنة الفجر.',
        'إذا نوى الإقامة في بلد 15 يوماً فأكثر أتم صلاته كالمقيم.'
      ],
      stepsEn: [
        'A traveler shortens 4-rak\'ah Fard prayers (Dhuhr, Asr, Isha) into 2 rak\'ats (Qasr).',
        'There is no shortening in Fajr (2 Fard), Maghrib (3 Fard), and Witr (3 rak\'ats).',
        'Sunnah prayers may be omitted during journey hardship, though recommended during calm rest.',
        'If staying in one destination for 15 days or longer, the traveler becomes a resident (Muqeem) and prays full.'
      ]
    },
    {
      titleUr: 'مریض کی نماز (بیٹھ کر اور اشارے سے)',
      titleAr: 'صلاة المريض بالقعود والإيماء',
      titleEn: 'Prayer of the Sick (Sitting or Lying Down)',
      badgeUr: 'مریض کی نماز',
      badgeAr: 'صلاة المريض',
      badgeEn: 'Sick Prayer',
      badgeColor: '#7c3aed',
      bgLight: '#f5f3ff',
      descUr: 'اسلام میں بیماری کے وقت بھی نماز معاف نہیں کی گئی بلکہ آسانی فراہم کی گئی ہے۔',
      descAr: 'لا تسقط الصلاة عن المريض ما دام عقله ثابتاً، وإنما يصلي بحسب طاقته واستطاعته.',
      descEn: 'In Islam, prayer is not excused during illness; instead, ease is granted based on ability.',
      stepsUr: [
        'اگر کھڑے ہونے پر قادر نہ ہو یا شدید تکلیف اور بیماری بڑھنے کا خطرہ ہو تو بیٹھ کر رکوع و سجدہ کر کے پڑھے۔',
        'اگر سجدہ کرنے پر قادر نہ ہو تو اشارے سے رکوع اور سجدہ کرے، اور سجدے کے لیے رکوع کی نسبت زیادہ جھکے۔',
        'اگر بیٹھنے پر بھی قادر نہ ہو تو چت لیٹ کر (پاؤں قبلہ رخ کر کے گھٹنے کھڑے کر کے) اشارے سے نماز پڑھے۔'
      ],
      stepsAr: [
        'فإن لم يستطع القيام صلى قاعداً بركوع وسجود.',
        'فإن عجز عن السجود أومأ برأسه وجعل سجوده أخفض من ركوعه.',
        'فإن عجز عن القعود صلى مستلقياً على ظهره موجهاً رجليه إلى القبلة مومئاً برأسه.'
      ],
      stepsEn: [
        'If unable to stand due to severe pain or harm, pray sitting down with normal bowing and prostrating.',
        'If unable to prostrate, pray by nodding head gestures, making the prostration gesture lower than bowing.',
        'If unable to sit, pray lying on back with feet toward the Qiblah and knees bent, gesturing with head.'
      ]
    },
    {
      titleUr: 'نماز توڑنے والی چیزیں (مفسداتِ نماز)',
      titleAr: 'مفسدات الصلاة ومبطلاتها',
      titleEn: 'Invalidators of Prayer (Mufsidat-e-Salah)',
      badgeUr: 'مفسداتِ نماز',
      badgeAr: 'مبطلات الصلاة',
      badgeEn: 'Invalidators',
      badgeColor: '#dc2626',
      bgLight: '#fef2f2',
      descUr: 'ان چیزوں کے پیش آنے سے نماز ٹوٹ جاتی ہے اور دوبارہ پڑھنا واجب ہوتا ہے:',
      descAr: 'الأفعال والأمور التي تبطل الصلاة وتوجب إعادتها:',
      descEn: 'Actions and occurrences that invalidate Salah and necessitate repeating it:',
      stepsUr: [
        'جان بوجھ کر یا بھول کر نماز میں بولنا۔',
        'کسی کو سلام کرنا یا سلام کا جواب دینا۔',
        'درد یا مصیبت کی وجہ سے ہائے، آہ یا اونچی آواز سے رونا (خوفِ خدا کے سوا)۔',
        'نماز میں کھلکھلا کر قہقہہ مار کر ہنسنا (اس سے وضو بھی ٹوٹ جاتا ہے)۔',
        'سینے کا قبلہ کے رخ سے پھر جانا۔',
        'عملِ کثیر (ایسا عمل جس کو دیکھ کر دور سے دیکھنے والا سمجھے کہ یہ نماز میں نہیں ہے)۔'
      ],
      stepsAr: [
        'الكلام العمد أو السهو في الصلاة لغير مصلحتها.',
        'السلام على أحد أو رد السلام أثناء الصلاة.',
        'الأكل أو الشرب عمداً.',
        'الضحك بصوت عالٍ والقهقهة (تنقض الوضوء أيضاً).',
        'الانحراف بالصدر عن جهة القبلة.',
        'العمل الكثير الذي يوهم الناظر أن فاعله ليس في صلاة.'
      ],
      stepsEn: [
        'Speaking intentionally or unintentionally in Salah.',
        'Greeting someone or replying to a greeting during Salah.',
        'Eating or drinking anything while in prayer.',
        'Audible laughing out loud (which also invalidates Wudu).',
        'Turning the chest away from the Qiblah direction.',
        'Excessive unrelated movements (Amal Katheer) that make an onlooker assume one is not praying.'
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#064e3b' }}>
          {isEn ? 'Essential Fiqh Rulings, Qaza Prayers, and Sajda-e-Sahw' : isAr ? 'أهم المسائل الفقهية وسجود السهو وصلاة المسافر' : 'اہم فقہی مسائل، قضا نمازیں اور سجدہ سہو کے احکام'}
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
          {isEn ? 'Clear practical jurisprudence guidelines based on authentic Sunni Islamic scholarship' : isAr ? 'أحكام فقهية معتمدة وميسرة لكل مسلم ومسلمة' : 'روزمرہ پیش آنے والے فقہی احکام کی مستند وضاحت'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {masaelList.map((item, idx) => (
          <div key={idx} style={{ background: 'var(--surface-paper)', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem 1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ background: item.bgLight, color: item.badgeColor, border: `1px solid ${item.badgeColor}40`, padding: '3px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800 }}>
                {isEn ? item.badgeEn : isAr ? item.badgeAr : item.badgeUr}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                {isEn ? item.titleEn : isAr ? item.titleAr : item.titleUr}
              </h3>
            </div>
            <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.93rem', color: '#475569', direction: dir, lineHeight: 1.6 }}>
              {isEn ? item.descEn : isAr ? item.descAr : item.descUr}
            </p>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', direction: dir }}>
              <ol style={{ margin: 0, [isEn ? 'paddingLeft' : 'paddingRight']: '1.25rem', color: '#1e293b', lineHeight: 2, fontSize: '0.9rem' }}>
                {(isEn ? item.stepsEn : isAr ? item.stepsAr : item.stepsUr).map((st, sidx) => (
                  <li key={sidx}>{st}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// TAB 6: Special & Nafl Prayers / السنن والنوافل / دیگر مسنون و نفل نمازیں
// ==============================================================================
function SpecialPrayersTab({ copyToClipboard, copiedId, searchQuery, isAr, isEn, dir }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 6.1: صلاة الوتر ودعاء القنوت */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #7c3aed', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 4px 16px rgba(124,58,237,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-moon" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#5b21b6' }}>
              {isEn ? 'Witr Prayer & Dua-e-Qunoot (with Tashkeel & Meaning)' : isAr ? 'صلاة الوتر ودعاء القنوت المأثور بالتشكيل والمعنى' : 'نمازِ وتر اور دعائے قنوت (مکمل اعراب اور ترجمہ)'}
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              {isEn ? '3 Rak\'ats Wajib prayer offered after Isha prayer' : isAr ? 'ثلاث ركعات واجبة بعد صلاة العشاء' : 'عشاء کی نماز کے بعد ۳ رکعت وتر واجب ہیں'}
            </p>
          </div>
        </div>

        <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: '#334155', direction: dir, lineHeight: 1.7 }}>
          {isEn ? (
            <strong>Witr Method: Pray first two rak\'ats like normal Salah, sit for Tashahhud, then stand for the 3rd rak\'ah. Recite Surah Al-Fatiha and another Surah. Before bowing into Ruku\', say "Allahu Akbar" while raising hands to ears, then fold hands and recite Dua-e-Qunoot:</strong>
          ) : isAr ? (
            <strong>صفة صلاة الوتر: يصلي ركعتين ثم يجلس للتشهد، ثم يقوم للثالثة فيقرأ الفاتحة وسورة، وقبل الركوع يرفع يديه مكبراً ثم يعقد يديه ويقنت بهذا الدعاء المبارك:</strong>
          ) : (
            <strong>وتر کا طریقہ: پہلی دو رکعتیں پڑھ کر قعدہ اولیٰ میں صرف التحیات پڑھ کر تیسری رکعت کے لیے کھڑے ہوں۔ سورۃ الفاتحہ اور سورت پڑھنے کے بعد رکوع میں جانے سے پہلے 'اللہ اکبر' کہتے ہوئے دونوں ہاتھ کانوں تک اٹھائیں اور پھر ہاتھ باندھ کر دعائے قنوت پڑھیں:</strong>
          )}
        </p>

        <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', border: '1.5px solid #c4b5fd', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#4c1d95', lineHeight: 2.2, direction: 'rtl' }}>
            اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ، وَنُثْنِي عَلَيْكَ الْخَيْرَ، وَنَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ، اللَّهُمَّ إِيَّاكَ نَعْبُدُ، وَلَكَ نُصَلِّي وَنَسْجُدُ، وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ، نَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ، إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحَقٌ
          </p>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.1rem 1.4rem', direction: dir }}>
          <span style={{ color: '#7c3aed', fontWeight: 800, fontSize: '0.82rem', display: 'block', marginBottom: '4px' }}>
            {isEn ? 'Meaning / Translation:' : isAr ? 'المعنى والتفسير:' : 'اردو ترجمہ:'}
          </span>
          <p style={{ margin: 0, fontSize: '1rem', color: '#1e293b', lineHeight: 1.8 }}>
            {isEn
              ? '"O Allah, we seek Your help and ask for Your forgiveness, we believe in You and rely upon You, we praise You for all good, we thank You and are not ungrateful to You, and we abandon and reject whoever disobeys You. O Allah, You alone we worship, to You we pray and prostrate, towards You we strive and serve. We hope for Your mercy and fear Your punishment. Indeed, Your punishment encompasses the disbelievers."'
              : isAr
                ? 'نَطْلُبُ عَوْنَكَ وَمَغْفِرَتَكَ، وَنُؤْمِنُ بِكَ وَنَفَوِّضُ أُمُورَنَا إِلَيْكَ، وَنُثْنِي عَلَيْكَ أَحْسَنَ الثَّنَاءِ، وَنَشْكُرُ أَيَادِيَكَ وَنَبْرَأُ مِمَّنْ يَعْصِيكَ وَيَكْفُرُ بِكَ، نَخُصُّكَ وَحْدَكَ بِالْعِبَادَةِ وَالسُّجُودِ وَنَسْعَى فِي طَاعَتِكَ، طَمَعًا فِي رَحْمَتِكَ وَخَوْفًا مِنْ عَذَابِكَ الْوَاقِعِ بِالْكَافِرِينَ.'
                : '"اے اللہ! ہم تجھ ہی سے مدد مانگتے ہیں اور تجھ ہی سے بخشش چاہتے ہیں، تجھ پر ایمان لاتے ہیں اور تجھ پر بھروسہ کرتے ہیں، اور تیری بہترین تعریف بیان کرتے ہیں، اور تیرا شکر ادا کرتے ہیں اور تیری ناشکری نہیں کرتے، اور جو تیری نافرمانی کرے ہم اس سے الگ ہوتے ہیں اور اسے چھوڑتے ہیں۔ اے اللہ! ہم تیری ہی عبادت کرتے ہیں اور تیرے ہی لیے نماز پڑھتے اور سجدہ کرتے ہیں، اور تیری ہی طرف دوڑتے اور حاضر ہوتے ہیں، ہم تیری رحمت کے امیدوار ہیں اور تیرے عذاب سے ڈرتے ہیں، بے شک تیرا عذاب کافروں کو پہنچنے والا ہے۔"'
            }
          </p>
        </div>
      </div>

      {/* 6.2: Eidain Prayer */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h3 style={{ margin: '0 0 0.85rem 0', color: '#065f46', fontSize: '1.25rem', fontWeight: 800 }}>
          {isEn ? 'Eidain Prayer Method (Eid ul-Fitr & Eid ul-Adha - 6 Extra Takbeerat):' : isAr ? 'صفة صلاة العيدين (ست تكبيرات زوائد واجبة):' : 'نمازِ عیدین (عید الفطر و عید الاضحیٰ) کا طریقہ:'}
        </h3>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: '#475569', direction: dir, lineHeight: 1.7 }}>
          {isEn ? 'Eid prayer consists of 2 rak\'ats with 6 extra obligatory Takbeerat:' : isAr ? 'صلاة العيد ركعتان بـ ٦ تكبيرات زوائد واجبة:' : 'عیدین کی نماز میں کل ۶ زائد تکبیریں ہوتی ہیں جو واجب ہیں:'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '14px', direction: dir }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>
              {isEn ? 'First Rak\'ah (3 Extra Takbeerat):' : isAr ? 'في الركعة الأولى (٣ تكبيرات زوائد):' : 'پہلی رکعت میں ۳ زائد تکبیریں:'}
            </h4>
            <ol style={{ margin: 0, [isEn ? 'paddingLeft' : 'paddingRight']: '1.25rem', lineHeight: 1.8, fontSize: '0.88rem', color: '#334155' }}>
              {isEn ? (
                <>
                  <li>Pronounce Takbeer Tahreemah, fold hands, and recite Thana.</li>
                  <li>Raise hands for 3 extra Takbeerat: leave hands at sides on 1st & 2nd, fold hands on 3rd.</li>
                  <li>Imam recites Surah Al-Fatiha and a Surah, followed by normal Ruku\' and Sujood.</li>
                </>
              ) : isAr ? (
                <>
                  <li>تكبيرة الإحرام وعقد اليدين وقراءة دعاء الاستفتاح.</li>
                  <li>رفع اليدين والتكبير ٣ مرات زوائد: يرسل يديه في الأولى والثانية ويعقدهما في الثالثة.</li>
                  <li>قراءة الفاتحة وسورة ثم الركوع والسجود.</li>
                </>
              ) : (
                <>
                  <li>تکبیرِ تحریمہ کہہ کر ہاتھ باندھیں اور ثناء پڑھیں۔</li>
                  <li>پھر ۳ بار 'اللہ اکبر' کہتے ہوئے کانوں تک ہاتھ اٹھائیں گے۔ پہلی دو تکبیروں پر ہاتھ کھلے چھوڑیں گے اور تیسری پر ہاتھ باندھ لیں گے۔</li>
                  <li>اس کے بعد امام قرأت کرے گا اور رکوع و سجود ادا ہوں گے۔</li>
                </>
              )}
            </ol>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '14px', direction: dir }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>
              {isEn ? 'Second Rak\'ah (3 Extra Takbeerat):' : isAr ? 'في الركعة الثانية (٣ تكبيرات زوائد):' : 'دوسری رکعت میں ۳ زائد تکبیریں:'}
            </h4>
            <ol style={{ margin: 0, [isEn ? 'paddingLeft' : 'paddingRight']: '1.25rem', lineHeight: 1.8, fontSize: '0.88rem', color: '#334155' }}>
              {isEn ? (
                <>
                  <li>Imam begins by reciting Surah Al-Fatiha and another Surah first.</li>
                  <li>After Quran recitation and before Ruku\', say Allahu Akbar 3 times raising and releasing hands.</li>
                  <li>On the 4th Takbeer, go straight down into Ruku\' without raising hands.</li>
                </>
              ) : isAr ? (
                <>
                  <li>يبدأ الإمام بقراءة الفاتحة وسورة أولاً.</li>
                  <li>بعد القراءة وقبل الركوع يكبر ٣ مرات زوائد رافعاً يديه ومرسلاً لهما.</li>
                  <li>يكبر التكبيرة الرابعة للركوع دون رفع اليدين.</li>
                </>
              ) : (
                <>
                  <li>دوسری رکعت میں پہلے امام قرأت کرے گا۔</li>
                  <li>قرأت کے بعد رکوع میں جانے سے پہلے ۳ بار کانوں تک ہاتھ اٹھا کر 'اللہ اکبر' کہیں گے اور ہاتھ چھوڑ دیں گے۔</li>
                  <li>چوتھی تکبیر پر بغیر ہاتھ اٹھائے رکوع میں چلے جائیں گے۔</li>
                </>
              )}
            </ol>
          </div>
        </div>
      </div>

      {/* 6.3: صلاة التسابيح / Salat al-Tasbeeh */}
      <div style={{ background: 'var(--surface-paper)', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h3 style={{ margin: '0 0 0.85rem 0', color: '#0284c7', fontSize: '1.25rem', fontWeight: 800 }}>
          {isEn ? 'Salat al-Tasbeeh Method (4 Rak\'ats with 300 Glorifications):' : isAr ? 'صفة صلاة التسابيح (٤ ركعات بـ ٣٠٠ تسبيحة):' : 'صلوٰۃ التسبیح کا مسنون طریقہ (۴ رکعتوں میں ۳۰۰ بار تسبیح):'}
        </h3>
        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#334155', direction: dir }}>
          {isEn ? (
            'Prophet Muhammad ﷺ recommended to his uncle Abbas (RA) to pray it daily, or once a week, or once a month, or once a year, or at least once in a lifetime for complete forgiveness of sins (Abu Dawud: 1297).'
          ) : isAr ? (
            'وصية النبي ﷺ لعمه العباس رضي الله عنه أن يصليها كل يوم، أو في كل جمعة، أو في كل شهر، أو في كل سنة، أو في العمر مرة تكفيراً للذنوب (سنن أبي داود: 1297).'
          ) : (
            'رسول اللہ ﷺ نے حضرت عباس رضی اللہ عنہ سے فرمایا کہ اگر ہو سکے تو روزانہ، نہیں تو ہفتے میں ایک بار، نہیں تو مہینے میں، ورنہ سال میں، ورنہ زندگی میں ایک بار ضرور پڑھیں (ابو داؤد: 1297)۔'
          )}
        </p>
        <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '12px', border: '1px solid #bae6fd', textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#0369a1' }}>
            سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَـٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ
          </p>
        </div>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', direction: dir, fontSize: '0.88rem', lineHeight: 1.9, color: '#334155' }}>
          <strong>{isEn ? 'Schedule of 75 Tasbeehs in each Rak\'ah:' : isAr ? 'توزيع ٧٥ تسبيحة في كل ركعة:' : 'ہر رکعت میں ۷۵ مرتبہ تسبیح یوں پڑھی جاتی ہے:'}</strong>
          <ul style={{ margin: 0, [isEn ? 'paddingLeft' : 'paddingRight']: '1.25rem' }}>
            {isEn ? (
              <>
                <li>After Thana before Surah recitation: 15 times</li>
                <li>After Quran recitation before Ruku\': 10 times</li>
                <li>In Ruku\' after the regular tasbeeh: 10 times</li>
                <li>In Qawmah (standing after Ruku\'): 10 times</li>
                <li>In the 1st Sujood after regular tasbeeh: 10 times</li>
                <li>In Jalsah (sitting between prostrations): 10 times</li>
                <li>In the 2nd Sujood after regular tasbeeh: 10 times</li>
                <li>(Total = 75 times per rak\'ah; 300 times across 4 rak\'ats)</li>
              </>
            ) : isAr ? (
              <>
                <li>بعد دعاء الاستفتاح وقبل القراءة: ١٥ مرة</li>
                <li>بعد القراءة وقبل الركوع: ١٠ مرات</li>
                <li>في الركوع بعد تسبيحاته: ١٠ مرات</li>
                <li>في الاعتدال من الركوع (القومـة): ١٠ مرات</li>
                <li>في السجدة الأولى بعد تسبيحاتها: ١٠ مرات</li>
                <li>في الجلوس بين السجدتين: ١٠ مرات</li>
                <li>في السجدة الثانية بعد تسبيحاتها: ١٠ مرات</li>
                <li>(المجموع: ٧٥ تسبيحة في كل ركعة، و٣٠٠ تسبيحة في ٤ ركعات)</li>
              </>
            ) : (
              <>
                <li>ثناء کے بعد سورت ملانے سے پہلے: ۱۵ مرتبہ</li>
                <li>قرأت کے بعد رکوع میں جانے سے پہلے: ۱۰ مرتبہ</li>
                <li>رکوع کی تسبیح کے بعد: ۱۰ مرتبہ</li>
                <li>قومہ میں (رکوع سے سیدھا کھڑے ہو کر): ۱۰ مرتبہ</li>
                <li>پہلے سجدے کی تسبیح کے بعد: ۱۰ مرتبہ</li>
                <li>جلسہ میں (دونوں سجدوں کے درمیان بیٹھ کر): ۱۰ مرتبہ</li>
                <li>دوسرے سجدے کی تسبیح کے بعد: ۱۰ مرتبہ</li>
                <li>(کل ۷۵ مرتبہ فی رکعت، ۴ رکعتوں میں کل ۳۰۰ مرتبہ مکمل)</li>
              </>
            )}
          </ul>
        </div>
      </div>

    </div>
  );
}
