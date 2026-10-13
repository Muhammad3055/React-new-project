import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function AsanNimazView({ navigateToTab }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('nimaz');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Tabs definition
  const tabs = [
    { id: 'nimaz', label: 'نماز کا طریقہ و رکعتیں', labelEn: 'Namaz Method & Rak\'ats', icon: 'fas fa-mosque' },
    { id: 'wudu_ghusl', label: 'وضو، غسل و طہارت', labelEn: 'Wudu, Ghusl & Purity', icon: 'fas fa-hands-wash' },
    { id: 'mayat_janaza', label: 'میت، جنازہ و قبرستان', labelEn: 'Funeral, Janaza & Graves', icon: 'fas fa-star-and-crescent' },
    { id: 'daily_duas', label: 'دن و رات کی دعائیں', labelEn: 'Daily Day & Night Duas', icon: 'fas fa-praying-hands' },
    { id: 'masael', label: 'ضروری مسائل، قضا و سہو', labelEn: 'Fiqh Masail, Qaza & Sahw', icon: 'fas fa-balance-scale' },
    { id: 'special_prayers', label: 'دیگر مسنون و نفل نمازیں', labelEn: 'Special & Nafl Prayers', icon: 'fas fa-heart' },
  ];

  return (
    <div style={{ minHeight: '85vh', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Page Hero Header */}
        <div style={{
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
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', backdropFilter: 'blur(8px)' }}>
                <span>📖 مستند اسلامی فقہی انسائیکلوپیڈیا</span>
              </div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, fontFamily: "'Amiri', serif" }}>
                آسان نماز اور مکمل مسنون احکام
              </h1>
              <p style={{ margin: 0, fontSize: '1.05rem', color: '#d1fae5', maxWidth: '750px', lineHeight: 1.6 }}>
                نماز کے ارکان، پنج وقتہ رکعتیں، طریقہ، مرد و عورت کا فرق، وضو و غسل، تجہیز و تکفین، نمازِ جنازہ، قبرستان کی دعائیں، ضروری مسائل اور روزمرہ کی مسنون دعائیں
              </p>
            </div>

            {/* In-Page Quick Search */}
            <div style={{ minWidth: '280px', flex: '1', maxWidth: '380px' }}>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="کوئی بھی دعا، مسئلہ یا نماز تلاش کریں..."
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    outline: 'none',
                    direction: 'rtl',
                    textAlign: 'right'
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
                background: activeTab === tab.id ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#ffffff',
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
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: نماز کا مکمل طریقہ اور رکعتیں */}
        {activeTab === 'nimaz' && (
          <NimazTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} />
        )}

        {/* Tab 2: وضو، غسل اور طہارت */}
        {activeTab === 'wudu_ghusl' && (
          <WuduGhuslTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} />
        )}

        {/* Tab 3: میت، جنازہ، تدفین و قبرستان */}
        {activeTab === 'mayat_janaza' && (
          <MayatJanazaTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} />
        )}

        {/* Tab 4: دن اور رات کی مسنون دعائیں */}
        {activeTab === 'daily_duas' && (
          <DailyDuasTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} />
        )}

        {/* Tab 5: ضروری مسائل، قضا اور سجدہ سہو */}
        {activeTab === 'masael' && (
          <MasaelTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} />
        )}

        {/* Tab 6: دیگر مخصوص و نفل نمازیں */}
        {activeTab === 'special_prayers' && (
          <SpecialPrayersTab copyToClipboard={copyToClipboard} copiedId={copiedId} searchQuery={searchQuery} />
        )}

      </div>
    </div>
  );
}

// ==============================================================================
// TAB 1: نماز (Salah Guide, Rak'ats, Pillars, Step-by-Step, Men vs Women)
// ==============================================================================
function NimazTab({ copyToClipboard, copiedId, searchQuery }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1.1: روزانہ کی ۵ نمازیں اور کل رکعتیں */}
      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#ecfdf5', color: '#059669', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-calendar-day" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064e3b' }}>
              روزانہ کی ۵ نمازیں اور کل رکعتوں کی تفصیل
            </h2>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              فرض، سنتِ مؤکدہ، سنتِ غیر مؤکدہ، واجب اور نفل رکعتوں کا مستند شیڈول
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', direction: 'rtl', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #059669' }}>
                <th style={{ padding: '12px 14px', color: '#064e3b', fontWeight: 800 }}>نماز</th>
                <th style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 800 }}>پہلے سنتیں</th>
                <th style={{ padding: '12px 14px', color: '#dc2626', fontWeight: 800 }}>فرض</th>
                <th style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 800 }}>بعد کی سنتیں</th>
                <th style={{ padding: '12px 14px', color: '#7c3aed', fontWeight: 800 }}>وتر واجب</th>
                <th style={{ padding: '12px 14px', color: '#059669', fontWeight: 800 }}>نفل</th>
                <th style={{ padding: '12px 14px', color: '#064e3b', fontWeight: 900 }}>کل رکعتیں</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>فجر (Fajr)</td>
                <td style={{ padding: '12px 14px' }}>۲ سنت مؤکدہ</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>۲ فرض</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>۴ رکعتیں</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>ظہر (Zuhr)</td>
                <td style={{ padding: '12px 14px' }}>۴ سنت مؤکدہ</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>۴ فرض</td>
                <td style={{ padding: '12px 14px' }}>۲ سنت مؤکدہ</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px' }}>۲ نفل</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>۱۲ رکعتیں</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>عصر (Asr)</td>
                <td style={{ padding: '12px 14px' }}>۴ سنت غیر مؤکدہ</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>۴ فرض</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>۸ رکعتیں</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>مغرب (Maghrib)</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>۳ فرض</td>
                <td style={{ padding: '12px 14px' }}>۲ سنت مؤکدہ</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px' }}>۲ نفل</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>۷ رکعتیں</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>عشاء (Isha)</td>
                <td style={{ padding: '12px 14px' }}>۴ سنت غیر مؤکدہ</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>۴ فرض</td>
                <td style={{ padding: '12px 14px' }}>۲ سنت مؤکدہ</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#7c3aed' }}>۳ وتر واجب</td>
                <td style={{ padding: '12px 14px' }}>۲ نفل + ۲ نفل</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>۱۷ رکعتیں</td>
              </tr>
              <tr style={{ background: '#ecfdf5' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#065f46' }}>جمعہ المبارک (Jumu'ah)</td>
                <td style={{ padding: '12px 14px' }}>۴ سنت مؤکدہ</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#dc2626' }}>۲ فرض</td>
                <td style={{ padding: '12px 14px' }}>۴ سنت + ۲ سنت</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8' }}>-</td>
                <td style={{ padding: '12px 14px' }}>۲ نفل</td>
                <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669', fontSize: '1.05rem' }}>۱۴ رکعتیں</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 1.2: نماز کے فرائض (شرائط و ارکان) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* ۷ شرائط (خارجی فرائض) */}
        <div style={{ background: '#ffffff', border: '1.5px solid #fed7aa', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ background: '#ffedd5', color: '#c2410c', padding: '6px 10px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem' }}>خارجی فرائض</span>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#9a3412' }}>نماز کی ۷ شرائط (نماز شروع ہونے سے پہلے)</h3>
          </div>
          <ol style={{ margin: 0, paddingRight: '1.25rem', direction: 'rtl', color: '#334155', lineHeight: 2, fontSize: '0.94rem' }}>
            <li><strong>بدن کا پاک ہونا:</strong> حدثِ اصغر (بے وضو ہونا) اور حدثِ اکبر (ناپاکی) سے پاک ہونا۔</li>
            <li><strong>کپڑوں کا پاک ہونا:</strong> پہننے والے لباس کا نجاست سے پاک ہونا۔</li>
            <li><strong>جگہ کا پاک ہونا:</strong> جہاں سجدہ اور قیام کریں وہ جگہ پاک ہو۔</li>
            <li><strong>سترِ عورت:</strong> مرد کا ناف سے گھٹنوں تک، عورت کا چہرہ و ہاتھوں کے سوا تمام جسم ڈھانپنا۔</li>
            <li><strong>استقبالِ قبلہ:</strong> خانہ کعبہ کی سمت رخ کرنا۔</li>
            <li><strong>وقت کا ہونا:</strong> جس نماز کو ادا کر رہے ہیں اس کا مقررہ وقت داخل ہو چکا ہو۔</li>
            <li><strong>نیت کرنا:</strong> دل میں پختہ ارادہ کرنا کہ میں فلاں نماز ادا کر رہا ہوں۔</li>
          </ol>
        </div>

        {/* ۶ ارکان (داخلی فرائض) */}
        <div style={{ background: '#ffffff', border: '1.5px solid #a7f3d0', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ background: '#ecfdf5', color: '#047857', padding: '6px 10px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem' }}>داخلی فرائض</span>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#065f46' }}>نماز کے ۶ ارکان (نماز کے اندر کے فرائض)</h3>
          </div>
          <ol style={{ margin: 0, paddingRight: '1.25rem', direction: 'rtl', color: '#334155', lineHeight: 2, fontSize: '0.94rem' }}>
            <li><strong>تکبیرِ تحریمہ:</strong> زبان سے 'اللَّهُ أَكْبَرُ' کہہ کر نماز شروع کرنا۔</li>
            <li><strong>قیام:</strong> فرض و واجب نمازوں میں سیدھا کھڑا ہونا (بغیر عذر بیٹھ کر پڑھنا جائز نہیں)۔</li>
            <li><strong>قراءت:</strong> کم از کم ایک بڑی آیت یا تین چھوٹی آیات قرآن مجید کی پڑھنا۔</li>
            <li><strong>رکوع:</strong> اس قدر جھکنا کہ ہاتھ گھٹنوں تک پہنچ جائیں اور پیٹھ برابر ہو۔</li>
            <li><strong>دونوں سجدے:</strong> پیشانی، ناک، دونوں ہاتھوں، گھٹنوں اور پاؤں کی انگلیوں کو زمین پر جمانا۔</li>
            <li><strong>قعدہ اخیرہ:</strong> آخری رکعت کے اختتام پر تشہد (التحیات) پڑھنے کی مقدار بیٹھنا۔</li>
          </ol>
        </div>
      </div>

      {/* 1.3: نماز کا مرحلہ وار طریقہ مع عربی دعائیں و ترجمہ */}
      <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>
          نماز کا مکمل مسنون طریقہ (Step-by-Step Complete Method)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* مرحلہ ۱: نیت و تکبیرِ تحریمہ */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>مرحلہ ۱</span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>نیت اور تکبیرِ تحریمہ</h4>
            </div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569', direction: 'rtl' }}>
              قبلہ رخ کھڑے ہو کر نیت کریں۔ مرد دونوں ہاتھ کانوں کی لو تک اٹھائیں اور عورتیں سینے تک، پھر کہیں:
            </p>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                اللَّهُ أَكْبَرُ
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>اللہ سب سے بڑا ہے</p>
            </div>
          </div>

          {/* مرحلہ ۲: ہاتھ باندھنا اور ثناء پڑھنا */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>مرحلہ ۲</span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>ثناء (سبحانک اللھم) پڑھنا</h4>
            </div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569', direction: 'rtl' }}>
              مرد دائیں ہاتھ سے بائیں کلائی پکڑ کر ناف کے نیچے باندھیں اور عورتیں سینے پر ہاتھ رکھیں، پھر ثناء پڑھیں:
            </p>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 1.8 }}>
                سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَـٰهَ غَيْرُكَ
              </p>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#334155', direction: 'rtl' }}>
                "اے اللہ! تو پاک ہے اپنی تعریفوں کے ساتھ، تیرا نام بابرکت ہے، تیری شان بلند و برتر ہے، اور تیرے سوا کوئی معبود نہیں۔"
              </p>
            </div>
          </div>

          {/* مرحلہ ۳: تعوذ، تسمیہ، سورۃ الفاتحہ و سورت */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>مرحلہ ۳</span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>تعوذ، تسمیہ اور سورۃ الفاتحہ</h4>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center', lineHeight: 2 }}>
              <p style={{ margin: 0, fontSize: '1.25rem', fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ • بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '1.25rem', fontFamily: "'Amiri', serif", color: '#0f172a' }}>
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (آمین)
              </p>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                سورۃ الفاتحہ کے بعد کوئی بھی سورت (جیسے سورۃ الاخلاص یا کم از کم ۳ چھوٹی آیات) ملائیں۔
              </p>
            </div>
          </div>

          {/* مرحلہ ۴: رکوع اور قومہ */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>مرحلہ ۴</span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>رکوع اور قومہ (سیدھا کھڑے ہونا)</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem' }}>رکوع کی تسبیح (۳ بار):</span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  سُبْحَانَ رَبِّيَ الْعَظِيمِ
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>"میرا عظمت والا رب پاک ہے"</p>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem' }}>قومہ (رکوع سے اٹھتے وقت):</span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ • رَبَّنَا لَكَ الْحَمْدُ
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>"اللہ نے اس کی سن لی جس نے اس کی تعریف کی۔ اے ہمارے رب! تیرے ہی لیے سب تعریف ہے۔"</p>
              </div>
            </div>
          </div>

          {/* مرحلہ ۵: سجدہ اور جلسہ */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>مرحلہ ۵</span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>سجدہ اور جلسہ (دو سجدوں کے درمیان بیٹھنا)</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem' }}>سجدے کی تسبیح (۳ بار):</span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  سُبْحَانَ رَبِّيَ الْأَعْلَىٰ
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>"میرا بلند و برتر رب پاک ہے"</p>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem' }}>دو سجدوں کے درمیان دعا:</span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>"اے میرے رب! مجھے بخش دے، اے میرے رب! مجھے بخش دے"</p>
              </div>
            </div>
          </div>

          {/* مرحلہ ۶: تشہد (التحیات) */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>مرحلہ ۶</span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>قعدہ میں تشہد (التحیات)</h4>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 2 }}>
                التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#334155', direction: 'rtl', lineHeight: 1.7 }}>
                "تمام زبانی، بدنی اور مالی عبادتیں اللہ کے لیے ہیں۔ اے نبی! آپ پر سلامتی ہو اور اللہ کی رحمت اور اس کی برکتیں ہوں۔ سلام ہو ہم پر اور اللہ کے نیک بندوں پر۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اس کے بندے اور رسول ہیں۔"
              </p>
            </div>
          </div>

          {/* مرحلہ ۷: درودِ ابراہیمی */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>مرحلہ ۷</span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>درودِ ابراہیمی</h4>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 2 }}>
                اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#334155', direction: 'rtl', lineHeight: 1.7 }}>
                "اے اللہ! محمد ﷺ اور ان کی آل پر رحمت نازل فرما جیسا کہ تو نے ابراہیم علیہ السلام اور ان کی آل پر رحمت نازل فرمائی، بے شک تو تعریف کیا گیا بزرگی والا ہے۔ اے اللہ! محمد ﷺ اور ان کی آل پر برکت نازل فرما جیسا کہ تو نے ابراہیم علیہ السلام اور ان کی آل پر برکت نازل فرمائی، بے شک تو تعریف کیا گیا بزرگی والا ہے۔"
              </p>
            </div>
          </div>

          {/* مرحلہ ۸: دعائے ماثورہ اور سلام */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '2px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>مرحلہ ۸</span>
              <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>دعائے ماثورہ اور سلام</h4>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 2 }}>
                اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ
              </p>
              <p style={{ margin: '6px 0 12px 0', fontSize: '0.9rem', color: '#334155', direction: 'rtl' }}>
                "اے اللہ! میں نے اپنی جان پر بہت ظلم کیا اور تیرے سوا گناہوں کو کوئی نہیں بخش سکتا، پس اپنی خاص بخشش سے میری مغفرت فرما اور مجھ پر رحم فرما، بے شک تو ہی بخشنے والا نہایت رحم کرنے والا ہے۔"
              </p>
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.85rem' }}>پھر دائیں اور بائیں طرف سلام پھیریں:</span>
                <p style={{ margin: '6px 0 0 0', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                  السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 1.4: مرد اور عورت کی نماز میں مستند فرق */}
      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#fdf2f8', color: '#db2777', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-venus-mars" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#831843' }}>
              مرد اور عورت کی نماز میں فقہی و مسنون فرق
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              اہل سنت والجماعت کے حنفی و جمہور فقہاء کے مطابق ستر اور حیاء کے تقاضے
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', direction: 'rtl' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #db2777' }}>
                <th style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 800, width: '25%' }}>رکن / حالت</th>
                <th style={{ padding: '12px 14px', color: '#0284c7', fontWeight: 800, width: '37%' }}>مرد کی ہیئت</th>
                <th style={{ padding: '12px 14px', color: '#db2777', fontWeight: 800, width: '38%' }}>عورت کی ہیئت</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>تکبیرِ تحریمہ پر ہاتھ اٹھانا</td>
                <td style={{ padding: '12px 14px' }}>کانوں کی لو تک ہاتھ اٹھائیں گے اور چادر سے ہاتھ باہر نکالیں گے۔</td>
                <td style={{ padding: '12px 14px' }}>صرف کندھوں یا سینے تک ہاتھ اٹھائیں گی اور چادر کے اندر ہی رکھیں گی۔</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>ہاتھ باندھنے کی جگہ</td>
                <td style={{ padding: '12px 14px' }}>ناف کے نیچے دائیں ہاتھ سے بائیں کلائی کا حلقہ بنا کر باندھیں گے۔</td>
                <td style={{ padding: '12px 14px' }}>سینے پر دایاں ہاتھ بائیں ہاتھ کی پشت پر بغیر حلقہ بنائے رکھیں گی۔</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>رکوع کی کیفیت</td>
                <td style={{ padding: '12px 14px' }}>پیٹھ بالکل سیدھی رکھیں گے، انگلیاں کشادہ کر کے گھٹنوں کو مضبوط پکڑیں گے۔</td>
                <td style={{ padding: '12px 14px' }}>صرف اس قدر جھکیں گی کہ ہاتھ گھٹنوں تک پہنچ جائیں، انگلیاں ملا کر رکھیں گی اور پیٹھ کمان کی طرح رہے گی۔</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>سجدے کی کیفیت</td>
                <td style={{ padding: '12px 14px' }}>پیٹ رانوں سے اور کہنیاں زمین اور پسلیوں سے بالکل الگ رکھیں گے۔</td>
                <td style={{ padding: '12px 14px' }}>بالکل سمٹ کر، پیٹ رانوں سے ملا کر اور کہنیاں زمین پر بچھا کر سجدہ کریں گی۔</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800 }}>قعدہ میں بیٹھنا</td>
                <td style={{ padding: '12px 14px' }}>بایاں پاؤں بچھا کر اس پر بیٹھیں گے اور دایاں پاؤں کھڑا رکھیں گے۔</td>
                <td style={{ padding: '12px 14px' }}>دونوں پاؤں دائیں طرف نکال کر زمین (چوتڑ) پر سمٹ کر بیٹھیں گی (تورّک)۔</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ==============================================================================
// TAB 2: وضو، غسل، طہارت و تیمم
// ==============================================================================
function WuduGhuslTab({ copyToClipboard, copiedId, searchQuery }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 2.1: وضو کے ۴ فرائض اور طریقہ */}
      <div style={{ background: '#ffffff', border: '1.5px solid #0284c7', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 4px 16px rgba(2,132,199,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-water" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0369a1' }}>
              وضو کے ۴ فرائض اور مکمل مسنون طریقہ
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              قرآن مجید (سورۃ المائدہ: 6) کے احکام کے عین مطابق
            </p>
          </div>
        </div>

        {/* ۴ فرائض کارڈز */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { num: '۱', title: 'چہرہ دھونا', desc: 'پیشانی کے بالوں سے ٹھوڑی کے نیچے تک اور ایک کان کی لو سے دوسرے کان کی لو تک ایک بار دھونا فرض ہے۔' },
            { num: '۲', title: 'دونوں ہاتھ کہنیوں سمیت دھونا', desc: 'انگلیوں کے پوروں سے لے کر کہنیوں سمیت دونوں ہاتھوں کو ایک بار دھونا فرض ہے۔' },
            { num: '۳', title: 'چوتھائی سر کا مسح کرنا', desc: 'کم از کم ایک چوتھائی سر پر بھیگا ہوا ہاتھ پھیرنا فرض ہے۔' },
            { num: '۴', title: 'دونوں پاؤں ٹخنوں سمیت دھونا', desc: 'دونوں پاؤں انگلیوں سے ٹخنوں سمیت اچھی طرح دھونا فرض ہے۔' },
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '1.25rem', direction: 'rtl', textAlign: 'right' }}>
              <span style={{ background: '#0284c7', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>فرض {item.num}</span>
              <h4 style={{ margin: '0.5rem 0 0.35rem 0', color: '#0369a1', fontSize: '1.05rem', fontWeight: 800 }}>{item.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* وضو کی دعائیں */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.15rem', fontWeight: 800, textAlign: 'center' }}>
            وضو کی مسنون دعائیں (مع فضیلت)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.8rem' }}>وضو شروع کرتے وقت:</span>
              <p style={{ margin: '6px 0 0 0', fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
                بِسْمِ اللَّهِ وَالْحَمْدُ لِلَّهِ
              </p>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>"اللہ کے نام سے اور تمام تعریفیں اللہ کے لیے ہیں"</p>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.8rem' }}>وضو کے بعد کی دعا (جنت کے آٹھوں دروازے کھل جاتے ہیں - مسلم: 234):</span>
              <p style={{ margin: '6px 0 0 0', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 1.8 }}>
                أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.88rem', color: '#334155', direction: 'rtl' }}>
                "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اور محمد ﷺ اس کے بندے اور رسول ہیں۔ اے اللہ! مجھے خوب توبہ کرنے والوں اور خوب پاکیزگی اختیار کرنے والوں میں بنا دے۔"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2.2: غسل کے ۳ فرائض اور مسنون طریقہ */}
      <div style={{ background: '#ffffff', border: '1.5px solid #059669', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#ecfdf5', color: '#059669', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-shower" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064e3b' }}>
              غسل کے ۳ فرائض اور مسنون طریقہ (جنابت، حیض و نفاس)
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              پاکیزگی حاصل کرنے کا مکمل شرعی طریقہ
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '1.25rem', direction: 'rtl', textAlign: 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>فرض ۱</span>
            <h4 style={{ margin: '0.5rem 0 0.35rem 0', color: '#064e3b', fontSize: '1.1rem' }}>غرغرہ کے ساتھ کلی کرنا</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>حلق کی جڑ تک پانی پہنچانا (روزے کی حالت میں غرغرہ نہ کریں)۔</p>
          </div>
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '1.25rem', direction: 'rtl', textAlign: 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>فرض ۲</span>
            <h4 style={{ margin: '0.5rem 0 0.35rem 0', color: '#064e3b', fontSize: '1.1rem' }}>ناک میں نرم ہڈی تک پانی چڑھانا</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>ناک کے دونوں نتھنوں کو نرم ہڈی تک اچھی طرح صاف کرنا۔</p>
          </div>
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '1.25rem', direction: 'rtl', textAlign: 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>فرض ۳</span>
            <h4 style={{ margin: '0.5rem 0 0.35rem 0', color: '#064e3b', fontSize: '1.1rem' }}>پورے جسم پر پانی بہانا</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>سر سے پاؤں تک اس طرح پانی بہانا کہ بال برابر جگہ بھی خشک نہ رہے۔</p>
          </div>
        </div>

        {/* غسل کا مسنون طریقہ */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', direction: 'rtl' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#065f46', fontSize: '1.05rem', fontWeight: 800 }}>غسل کا مرحلہ وار مسنون طریقہ:</h4>
          <ol style={{ margin: 0, paddingRight: '1.25rem', color: '#334155', lineHeight: 2, fontSize: '0.92rem' }}>
            <li>دل میں پاکی حاصل کرنے کی نیت کریں۔</li>
            <li>دونوں ہاتھوں کو کلائیوں تک ۳ بار دھوئیں اور جسم سے نجاست دور کریں۔</li>
            <li>استنجا کریں خواہ نجاست لگی ہو یا نہ لگی ہو۔</li>
            <li>نماز جیسا مکمل وضو کریں (پاؤں غسل کے آخر میں دھوئیں اگر پانی جمع ہو رہا ہو)۔</li>
            <li>تین بار سر پر پانی ڈالیں کہ بالوں کی جڑوں تک پانی پہنچ جائے۔</li>
            <li>تین بار دائیں کندھے پر اور تین بار بائیں کندھے پر پانی ڈال کر پورے بدن کو مل کر دھوئیں کہ کہیں خشک نہ رہے۔</li>
          </ol>
        </div>
      </div>

      {/* 2.3: تیمم کا طریقہ اور شرائط */}
      <div style={{ background: '#ffffff', border: '1.5px solid #f59e0b', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <span style={{ background: '#fef3c7', color: '#d97706', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-mountain" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#92400e' }}>
              تیمم کا طریقہ اور شرائط (پانی نہ ملنے پر)
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              بیماری کی صورت میں یا پانی ایک میل کی دوری پر دستیاب نہ ہونے کی صورت میں
            </p>
          </div>
        </div>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '1.25rem', direction: 'rtl', lineHeight: 1.9, fontSize: '0.93rem', color: '#78350f' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}><strong>تیمم کے ۳ فرائض ہیں:</strong></p>
          <ol style={{ margin: 0, paddingRight: '1.25rem' }}>
            <li><strong>نیت:</strong> ناپاکی دور کرنے اور نماز کو حلال کرنے کی نیت کرنا۔</li>
            <li><strong>چہرے کا مسح:</strong> پاک مٹی یا پتھر پر دونوں ہاتھ مار کر، جھاڑ کر پورے چہرے پر ملنا۔</li>
            <li><strong>دونوں ہاتھوں کا کہنیوں سمیت مسح:</strong> دوبارہ پاک مٹی پر ہاتھ مار کر دائیں ہاتھ سے بائیں بازو کا اور بائیں ہاتھ سے دائیں بازو کا کہنیوں سمیت مسح کرنا۔</li>
          </ol>
        </div>
      </div>

    </div>
  );
}

// ==============================================================================
// TAB 3: میت، تجہیز و تکفین، نمازِ جنازہ اور قبرستان کی دعائیں
// ==============================================================================
function MayatJanazaTab({ copyToClipboard, copiedId, searchQuery }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 3.1: نمازِ جنازہ کا طریقہ */}
      <div style={{ background: '#ffffff', border: '1.5px solid #059669', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#ecfdf5', color: '#059669', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-users" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064e3b' }}>
              نمازِ جنازہ کا مسنون طریقہ (۴ تکبیرات)
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              نمازِ جنازہ فرضِ کفایہ ہے، اس میں نہ اذان ہے، نہ اقامت، نہ رکوع اور نہ سجدہ
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.1rem', direction: 'rtl', textAlign: 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>تکبیر ۱</span>
            <h4 style={{ margin: '0.4rem 0', color: '#065f46', fontSize: '1rem' }}>ثناء پڑھنا</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>پہلی تکبیر پر ہاتھ کانوں تک اٹھا کر باندھ لیں اور ثناء (مع 'وَجَلَّ ثَنَاؤُكَ') پڑھیں۔</p>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.1rem', direction: 'rtl', textAlign: 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>تکبیر ۲</span>
            <h4 style={{ margin: '0.4rem 0', color: '#065f46', fontSize: '1rem' }}>درودِ ابراہیمی پڑھنا</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>بغیر ہاتھ اٹھائے دوسری تکبیر کہہ کر نماز والا درودِ ابراہیمی پڑھیں۔</p>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.1rem', direction: 'rtl', textAlign: 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>تکبیر ۳</span>
            <h4 style={{ margin: '0.4rem 0', color: '#065f46', fontSize: '1rem' }}>میت کے لیے دعا پڑھنا</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>بغیر ہاتھ اٹھائے تیسری تکبیر کہہ کر میت کی مخصوص مسنون دعا پڑھیں۔</p>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.1rem', direction: 'rtl', textAlign: 'right' }}>
            <span style={{ background: '#059669', color: '#ffffff', padding: '2px 9px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>تکبیر ۴</span>
            <h4 style={{ margin: '0.4rem 0', color: '#065f46', fontSize: '1rem' }}>سلام پھیرنا</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>چوتھی تکبیر کہہ کر دائیں اور بائیں جانب سلام پھیر کر ہاتھ کھول دیں۔</p>
          </div>
        </div>
      </div>

      {/* 3.2: نمازِ جنازہ کی ۳ مستند دعائیں */}
      <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>
          نمازِ جنازہ کی مسنون دعائیں (Adult & Children Janaza Duas)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* دعا ۱: بالغ مرد اور عورت کی دعا */}
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ background: '#059669', color: '#ffffff', padding: '3px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800 }}>
                ۱. بالغ مرد اور عورت کا جنازہ
              </span>
              <span style={{ color: '#065f46', fontSize: '0.8rem', fontWeight: 700 }}>📚 سنن ابو داؤد: 3201 • سنن ترمذی: 1024 (صحیح)</span>
            </div>
            <p style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', textAlign: 'center', lineHeight: 2.1, direction: 'rtl' }}>
              اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا، اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الْإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الْإِيمَانِ
            </p>
            <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '0.85rem 1.15rem', marginTop: '0.85rem', direction: 'rtl' }}>
              <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>اردو ترجمہ:</span>
              <p style={{ margin: 0, fontSize: '0.98rem', color: '#1e293b', lineHeight: 1.7 }}>
                "اے اللہ! ہمارے زندوں اور ہمارے مُردوں کو بخش دے، ہمارے حاضرین اور ہمارے غائبین کو، ہمارے چھوٹوں اور ہمارے بڑوں کو، اور ہمارے مردوں اور ہماری عورتوں کو۔ اے اللہ! تو ہم میں سے جس کو زندہ رکھے اسے اسلام پر زندہ رکھ، اور جس کو موت دے اسے ایمان پر موت دے۔"
              </p>
            </div>
          </div>

          {/* دعا ۲: نابالغ لڑکے (بچے) کی دعا */}
          <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ background: '#0284c7', color: '#ffffff', padding: '3px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800 }}>
                ۲. نابالغ لڑکے (بچے) کا جنازہ
              </span>
              <span style={{ color: '#0369a1', fontSize: '0.8rem', fontWeight: 700 }}>📚 مصنف ابن ابی شیبہ: 11496 • صحیح بخاری تعلیقاً</span>
            </div>
            <p style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#0369a1', textAlign: 'center', lineHeight: 2.1, direction: 'rtl' }}>
              اللَّهُمَّ اجْعَلْهُ لَنَا فَرَطًا، وَاجْعَلْهُ لَنَا أَجْرًا وَذُخْرًا، وَاجْعَلْهُ لَنَا شَافِعًا وَمُشَفَّعًا
            </p>
            <div style={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '0.85rem 1.15rem', marginTop: '0.85rem', direction: 'rtl' }}>
              <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>اردو ترجمہ:</span>
              <p style={{ margin: 0, fontSize: '0.98rem', color: '#1e293b', lineHeight: 1.7 }}>
                "اے اللہ! اس بچے کو ہمارے لیے آگے پہنچ کر سامانِ راحت مہیا کرنے والا بنا، اور اس کو ہمارے لیے اجر و ثواب اور ذخیرۂ آخرت بنا، اور اس کو ہمارے حق میں سفارش کرنے والا اور مقبول الشفاعت بنا۔"
              </p>
            </div>
          </div>

          {/* دعا ۳: نابالغ لڑکی (بچی) کی دعا */}
          <div style={{ background: '#fdf2f8', border: '1.5px solid #fbcfe8', borderRadius: '16px', padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ background: '#db2777', color: '#ffffff', padding: '3px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800 }}>
                ۳. نابالغ لڑکی (بچی) کا جنازہ
              </span>
              <span style={{ color: '#9d174d', fontSize: '0.8rem', fontWeight: 700 }}>📚 کتب فقہ و سنن</span>
            </div>
            <p style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#831843', textAlign: 'center', lineHeight: 2.1, direction: 'rtl' }}>
              اللَّهُمَّ اجْعَلْهَا لَنَا فَرَطًا، وَاجْعَلْهَا لَنَا أَجْرًا وَذُخْرًا، وَاجْعَلْهَا لَنَا شَافِعَةً وَمُشَفَّعَةً
            </p>
            <div style={{ background: '#ffffff', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '0.85rem 1.15rem', marginTop: '0.85rem', direction: 'rtl' }}>
              <span style={{ color: '#db2777', fontWeight: 800, fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>اردو ترجمہ:</span>
              <p style={{ margin: 0, fontSize: '0.98rem', color: '#1e293b', lineHeight: 1.7 }}>
                "اے اللہ! اس بچی کو ہمارے لیے آگے پہنچ کر سامانِ راحت مہیا کرنے والی بنا، اور اس کو ہمارے لیے اجر و ثواب اور ذخیرۂ آخرت بنا، اور اس کو ہمارے حق میں سفارش کرنے والی اور مقبول الشفاعت بنا۔"
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3.3: تدفین اور قبرستان کی دعائیں */}
      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#064e3b', textAlign: 'center' }}>
          میت کو قبر میں اتارنے، مٹی ڈالنے اور قبرستان کی دعائیں
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          
          {/* میت کو قبر میں اتارتے وقت */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ background: '#ecfdf5', color: '#065f46', padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>میت کو قبر میں اتارنے کی دعا</span>
            <p style={{ margin: '0.75rem 0', fontSize: '1.35rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b' }}>
              بِسْمِ اللَّهِ وَعَلَىٰ مِلَّةِ رَسُولِ اللَّهِ
            </p>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', direction: 'rtl' }}>
              "اللہ کے نام سے اور رسول اللہ ﷺ کے طریقے (ملت) پر اتارتے ہیں۔" (ابو داؤد: 3213)
            </p>
          </div>

          {/* قبر پر مٹی ڈالتے وقت */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>قبر پر ۳ مٹھی مٹی ڈالتے وقت</span>
            <p style={{ margin: '0.5rem 0', fontSize: '1.15rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#92400e', lineHeight: 1.8 }}>
              ۱. مِنْهَا خَلَقْنَاكُمْ <br />
              ۲. وَفِيهَا نُعِيدُكُمْ <br />
              ۳. وَمِنْهَا نُخْرِجُكُمْ تَارَةً أُخْرَىٰ
            </p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', direction: 'rtl' }}>
              (ہم نے اسی مٹی سے تمہیں پیدا کیا، اسی میں لوٹائیں گے، اور اسی سے دوبارہ نکالیں گے)
            </p>
          </div>

          {/* قبرستان میں داخل ہونے کی دعا */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', gridColumn: '1 / -1' }}>
            <span style={{ background: '#f0fdf4', color: '#047857', padding: '3px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800 }}>قبرستان میں داخل ہونے کی مسنون دعا (صحیح مسلم: 975)</span>
            <p style={{ margin: '0.75rem 0', fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 1.9 }}>
              السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ، أَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ
            </p>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', direction: 'rtl' }}>
              "سلامتی ہو تم پر اے بستی والوں، مومنوں اور مسلمانوں میں سے! اور ہم بھی، اگر اللہ نے چاہا، تمہارے ساتھ ضرور ملنے والے ہیں۔ میں اللہ تعالیٰ سے اپنے لیے اور تمہارے لیے عافیت و سلامتی مانگتا ہوں۔"
            </p>
          </div>

        </div>
      </div>

      {/* 3.4: کفن کا طریقہ (Mard & Aurat) */}
      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#065f46', fontSize: '1.25rem', fontWeight: 800 }}>
          کفن کے مسنون کپڑے اور احکام:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', direction: 'rtl' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0284c7' }}>مرد کے لیے ۳ کپڑے مسنون ہیں:</h4>
            <ol style={{ margin: 0, paddingRight: '1.25rem', lineHeight: 1.9, fontSize: '0.9rem', color: '#334155' }}>
              <li><strong>لفافہ (بڑی چادر):</strong> سر سے پاؤں تک جس سے دونوں طرف گرہ لگ سکے۔</li>
              <li><strong>ازار (تہبند):</strong> سر کی چوٹی سے پاؤں تک۔</li>
              <li><strong>قمیص (کرتہ):</strong> گردن سے گھٹنوں سے نیچے۔</li>
            </ol>
          </div>
          <div style={{ background: '#fdf2f8', padding: '1.25rem', borderRadius: '14px', border: '1px solid #fbcfe8', direction: 'rtl' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#db2777' }}>عورت کے لیے ۵ کپڑے مسنون ہیں:</h4>
            <ol style={{ margin: 0, paddingRight: '1.25rem', lineHeight: 1.9, fontSize: '0.9rem', color: '#334155' }}>
              <li><strong>لفافہ:</strong> سر سے پاؤں تک بڑی چادر۔</li>
              <li><strong>ازار:</strong> چوٹی سے پاؤں تک۔</li>
              <li><strong>قمیص:</strong> گردن سے پاؤں تک کرتہ۔</li>
              <li><strong>اوڑھنی (سر بند):</strong> سر اور بالوں کو ڈھانپنے کے لیے۔</li>
              <li><strong>سینہ بند:</strong> سینے سے رانوں تک لپیٹنے کے لیے۔</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
}

// ==============================================================================
// TAB 4: دن اور رات کی مسنون دعائیں (Daily Day & Night Duas)
// ==============================================================================
function DailyDuasTab({ copyToClipboard, copiedId, searchQuery }) {
  const duasList = [
    {
      id: 'dua_sleep_wake',
      title: 'صبح بیدار ہونے کی دعا',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف اٹھ کر جانا ہے۔',
      ref: 'صحیح بخاری: 6312'
    },
    {
      id: 'dua_sleep_night',
      title: 'رات سونے کی دعا',
      arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
      urdu: 'اے اللہ! میں تیرے ہی نام کے ساتھ مرتا ہوں (سوتا ہوں) اور جیتا ہوں (جاگتا ہوں)۔',
      ref: 'صحیح بخاری: 6314'
    },
    {
      id: 'dua_washroom_enter',
      title: 'بیت الخلاء (واش روم) جانے کی دعا',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
      urdu: 'اے اللہ! میں خبیث جنوں (نر) اور خبیث جننیوں (مادہ) کی برائی سے تیری پناہ مانگتا ہوں۔',
      ref: 'صحیح بخاری: 142 • صحیح مسلم: 375'
    },
    {
      id: 'dua_washroom_exit',
      title: 'بیت الخلاء سے نکلنے کی دعا',
      arabic: 'غُفْرَانَكَ، الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَىٰ وَعَافَانِي',
      urdu: 'اے اللہ! میں تیری بخشش مانگتا ہوں۔ تمام تعریفیں اس اللہ کے لیے ہیں جس نے مجھ سے تکلیف دہ چیز کو دور کیا اور مجھے عافیت بخشی۔',
      ref: 'سنن ابو داؤد: 17 • ابن ماجہ: 300'
    },
    {
      id: 'dua_food_before',
      title: 'کھانا شروع کرنے کی دعا',
      arabic: 'بِسْمِ اللَّهِ وَعَلَىٰ بَرَكَةِ اللَّهِ',
      urdu: 'اللہ کے نام سے اور اللہ کی برکت کے ساتھ (کھانا شروع کرتا ہوں)۔',
      ref: 'مستدرک حاکم: 7084'
    },
    {
      id: 'dua_food_after',
      title: 'کھانے کے بعد کی دعا',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ',
      urdu: 'تمام تعریفیں اس اللہ کے لیے ہیں جس نے ہمیں کھلایا، پلایا اور ہمیں مسلمانوں میں سے بنایا۔',
      ref: 'سنن ابو داؤد: 3850 • ترمذی: 3457'
    },
    {
      id: 'dua_house_exit',
      title: 'گھر سے نکلتے وقت کی دعا',
      arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      urdu: 'اللہ کے نام کے ساتھ، میں نے اللہ ہی پر بھروسہ کیا، برائی سے بچنے اور نیکی کرنے کی طاقت صرف اللہ ہی کی توفیق سے ہے۔',
      ref: 'سنن ابو داؤد: 5095 • ترمذی: 3426'
    },
    {
      id: 'dua_house_enter',
      title: 'گھر میں داخل ہونے کی دعا',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
      urdu: 'اے اللہ! میں تجھ سے اندر آنے کی بھلائی اور باہر نکلنے کی بھلائی کا سوال کرتا ہوں۔ اللہ کے نام کے ساتھ ہم داخل ہوئے اور اللہ کے نام کے ساتھ نکلے اور اپنے رب اللہ پر ہم نے بھروسہ کیا۔',
      ref: 'سنن ابو داؤد: 5096'
    },
    {
      id: 'dua_masjid_enter',
      title: 'مسجد میں داخل ہونے کی دعا',
      arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
      urdu: 'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔',
      ref: 'صحیح مسلم: 713'
    },
    {
      id: 'dua_masjid_exit',
      title: 'مسجد سے نکلنے کی دعا',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
      urdu: 'اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔',
      ref: 'صحیح مسلم: 713'
    },
    {
      id: 'dua_travel',
      title: 'سفر کی مسنون دعا',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
      urdu: 'پاک ہے وہ ذات جس نے اس (سواری) کو ہمارے قابو میں کر دیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے، اور بے شک ہم اپنے رب ہی کی طرف لوٹنے والے ہیں۔',
      ref: 'صحیح مسلم: 1342'
    },
    {
      id: 'dua_anxiety_debt',
      title: 'پریشانی، غم اور قرض سے نجات کی دعا',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
      urdu: 'اے اللہ! میں غم اور فکر سے تیری پناہ مانگتا ہوں، اور عاجزی اور سستی سے تیری پناہ مانگتا ہوں، اور بزدلی اور بخل سے تیری پناہ مانگتا ہوں، اور قرض کے غلبے اور لوگوں کے دباؤ سے تیری پناہ مانگتا ہوں۔',
      ref: 'صحیح بخاری: 2893 • ابو داؤد: 1555'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#064e3b' }}>
          صبح و شام اور روزمرہ کی اہم ترین مسنون دعائیں
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
          صحیح احادیثِ نبویہ سے ماخوذ دعائیں مع اردو ترجمہ و حوالہ
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {duasList.map(item => (
          <div
            key={item.id}
            style={{
              background: '#ffffff',
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
                  {item.title}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`${item.title}\n\n${item.arabic}\n\nترجمہ: ${item.urdu}\n\nحوالہ: ${item.ref}`, item.id)}
                  style={{
                    background: copiedId === item.id ? '#10b981' : '#f8fafc',
                    color: copiedId === item.id ? '#ffffff' : '#64748b',
                    border: '1px solid #cbd5e1',
                    padding: '4px 9px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <i className={copiedId === item.id ? "fas fa-check" : "fas fa-copy"} /> {copiedId === item.id ? 'کاپی ہو گئی' : 'Copy'}
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#064e3b', lineHeight: 1.8 }}>
                  {item.arabic}
                </p>
              </div>

              <p style={{ margin: 0, fontSize: '0.92rem', color: '#1e293b', direction: 'rtl', textAlign: 'right', fontFamily: "'Amiri', serif", lineHeight: 1.6 }}>
                "{item.urdu}"
              </p>
            </div>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>📚 {item.ref}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// TAB 5: ضروری مسائل، قضا اور سجدہ سہو (Fiqh Masail, Qaza & Sajda-e-Sahw)
// ==============================================================================
function MasaelTab({ copyToClipboard, copiedId, searchQuery }) {
  const masaelList = [
    {
      title: 'سجدہ سہو کا طریقہ اور واجب ہونے کے اسباب',
      badge: 'سجدہ سہو',
      badgeColor: '#c2410c',
      bgLight: '#fff7ed',
      desc: 'اگر نماز میں بھولے سے کوئی واجب چھوٹ جائے یا کسی واجب یا فرض میں تاخیر ہو جائے تو سجدہ سہو واجب ہو جاتا ہے۔',
      steps: [
        'قعدہ اخیرہ میں صرف تشہد (التحیات) پڑھیں۔',
        'دائیں طرف سلام پھیریں۔',
        'تکبیر کہہ کر معمول کے مطابق دو سجدے کریں اور تسبیحات پڑھیں۔',
        'دوبارہ تشہد، درودِ ابراہیمی اور دعائے ماثورہ پڑھ کر دونوں طرف سلام پھیریں۔'
      ]
    },
    {
      title: 'قضا نمازوں کا حساب اور ادا کرنے کا آسان طریقہ',
      badge: 'قضا نمازیں',
      badgeColor: '#059669',
      bgLight: '#ecfdf5',
      desc: 'جو نمازیں غفلت یا کسی عذر سے چھوٹ گئیں ان کی قضا فرض ہے، توبہ کے ساتھ قضا ادا کرنا ضروری ہے۔',
      steps: [
        'ایک اندازہ لگائیں کہ کل کتنی نمازیں قضا ہوئیں (مثلاً ۲ سال یا ۳ سال کی)۔',
        'روزانہ ہر وقتی نماز کے ساتھ اسی وقت کی ایک قضا نماز پڑھیں (مثلاً ظہر کے ساتھ ایک قضا ظہر)۔',
        'قضا نماز میں صرف فرض اور وتر پڑھے جاتے ہیں (سنتیں قضا نہیں ہوتیں سوائے فجر کی سنتوں کے اسی دن زوال سے پہلے)۔',
        'نیت یوں کریں: "میری سب سے پہلی فوت شدہ نماز جو باقی ہے وہ ادا کرتا ہوں۔"'
      ]
    },
    {
      title: 'مسافر کی نماز (قصر کے فقہی احکام)',
      badge: 'مسافر و قصر',
      badgeColor: '#0284c7',
      bgLight: '#f0f9ff',
      desc: 'جب کوئی شخص اپنے شہر یا آبادی سے 48 میل (تقریباً 77.5 کلومیٹر) کی دوری کے ارادے سے نکلے تو وہ مسافر بن جاتا ہے۔',
      steps: [
        'مسافر کے لیے ظہر، عصر اور عشاء کے ۴ فرضوں کو ۲ رکعت پڑھنا (قصر کرنا) واجب ہے۔',
        'فجر (۲ فرض)، مغرب (۳ فرض) اور عشاء کے وتر (۳ رکعت) میں کوئی قصر نہیں، وہ پورے پڑھے جائیں گے۔',
        'اگر سفر میں جلدی اور مشقت ہو تو سنتیں چھوڑنے کی اجازت ہے، ورنہ پڑھ لینا بہتر ہے۔',
        'اگر کسی جگہ ۱۵ دن یا اس سے زیادہ ٹھہرنے کی نیت ہو تو وہ مقیم بن جائے گا اور پوری نماز پڑھے گا۔'
      ]
    },
    {
      title: 'مریض کی نماز (بیٹھ کر اور اشارے سے)',
      badge: 'مریض کی نماز',
      badgeColor: '#7c3aed',
      bgLight: '#f5f3ff',
      desc: 'اسلام میں بیماری کے وقت بھی نماز معاف نہیں کی گئی بلکہ آسانی فراہم کی گئی ہے۔',
      steps: [
        'اگر کھڑے ہونے پر قادر نہ ہو یا شدید تکلیف اور بیماری بڑھنے کا خطرہ ہو تو بیٹھ کر رکوع و سجدہ کر کے پڑھے۔',
        'اگر سجدہ کرنے پر قادر نہ ہو تو اشارے سے رکوع اور سجدہ کرے، اور سجدے کے لیے رکوع کی نسبت زیادہ جھکے۔',
        'اگر بیٹھنے پر بھی قادر نہ ہو تو چت لیٹ کر (پاؤں قبلہ رخ کر کے گھٹنے کھڑے کر کے) اشارے سے نماز پڑھے۔'
      ]
    },
    {
      title: 'نماز توڑنے والی چیزیں (مفسداتِ نماز)',
      badge: 'مفسداتِ نماز',
      badgeColor: '#dc2626',
      bgLight: '#fef2f2',
      desc: 'ان چیزوں کے پیش آنے سے نماز ٹوٹ جاتی ہے اور دوبارہ پڑھنا واجب ہوتا ہے:',
      steps: [
        'جان بوجھ کر یا بھول کر نماز میں بولنا۔',
        'کسی کو سلام کرنا یا سلام کا جواب دینا۔',
        'درد یا مصیبت کی وجہ سے ہائے، آہ یا اونچی آواز سے رونا (خوفِ خدا کے سوا)۔',
        'نماز میں کھلکھلا کر قہقہہ مار کر ہنسنا (اس سے وضو بھی ٹوٹ جاتا ہے)۔',
        'سینے کا قبلہ کے رخ سے پھر جانا۔',
        'عملِ کثیر (ایسا عمل جس کو دیکھ کر دور سے دیکھنے والا سمجھے کہ یہ نماز میں نہیں ہے)۔'
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#064e3b' }}>
          اہم فقہی مسائل، قضا نمازیں اور سجدہ سہو کے احکام
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
          روزمرہ پیش آنے والے فقہی احکام کی مستند وضاحت
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {masaelList.map((item, idx) => (
          <div key={idx} style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem 1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ background: item.bgLight, color: item.badgeColor, border: `1px solid ${item.badgeColor}40`, padding: '3px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800 }}>
                {item.badge}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</h3>
            </div>
            <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.93rem', color: '#475569', direction: 'rtl', lineHeight: 1.6 }}>
              {item.desc}
            </p>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', direction: 'rtl' }}>
              <ol style={{ margin: 0, paddingRight: '1.25rem', color: '#1e293b', lineHeight: 2, fontSize: '0.9rem' }}>
                {item.steps.map((st, sidx) => (
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
// TAB 6: دیگر مخصوص و نفل نمازیں (Witr, Qunoot, Eidain, Tahajjud, Tasbeeh)
// ==============================================================================
function SpecialPrayersTab({ copyToClipboard, copiedId, searchQuery }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 6.1: نمازِ وتر اور دعائے قنوت */}
      <div style={{ background: '#ffffff', border: '1.5px solid #7c3aed', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 4px 16px rgba(124,58,237,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '8px 12px', borderRadius: '12px', fontSize: '1.2rem' }}>
            <i className="fas fa-moon" />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#5b21b6' }}>
              نمازِ وتر اور دعائے قنوت (مکمل اعراب اور ترجمہ)
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              عشاء کی نماز کے بعد ۳ رکعت وتر واجب ہیں
            </p>
          </div>
        </div>

        <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: '#334155', direction: 'rtl', lineHeight: 1.7 }}>
          <strong>وتر کا طریقہ:</strong> پہلی دو رکعتیں عام نماز کی طرح پڑھ کر قعدہ اولیٰ میں صرف التحیات پڑھ کر تیسری رکعت کے لیے کھڑے ہوں۔ سورۃ الفاتحہ اور سورت پڑھنے کے بعد رکوع میں جانے سے پہلے 'اللہ اکبر' کہتے ہوئے دونوں ہاتھ کانوں تک اٹھائیں اور پھر ہاتھ باندھ کر دعائے قنوت پڑھیں:
        </p>

        <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', border: '1.5px solid #c4b5fd', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#4c1d95', lineHeight: 2.2, direction: 'rtl' }}>
            اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ، وَنُثْنِي عَلَيْكَ الْخَيْرَ، وَنَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ، اللَّهُمَّ إِيَّاكَ نَعْبُدُ، وَلَكَ نُصَلِّي وَنَسْجُدُ، وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ، نَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ، إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحَقٌ
          </p>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.1rem 1.4rem', direction: 'rtl' }}>
          <span style={{ color: '#7c3aed', fontWeight: 800, fontSize: '0.82rem', display: 'block', marginBottom: '4px' }}>اردو ترجمہ:</span>
          <p style={{ margin: 0, fontSize: '1rem', color: '#1e293b', lineHeight: 1.8 }}>
            "اے اللہ! ہم تجھ ہی سے مدد مانگتے ہیں اور تجھ ہی سے بخشش چاہتے ہیں، تجھ پر ایمان لاتے ہیں اور تجھ پر بھروسہ کرتے ہیں، اور تیری بہترین تعریف بیان کرتے ہیں، اور تیرا شکر ادا کرتے ہیں اور تیری ناشکری نہیں کرتے، اور جو تیری نافرمانی کرے ہم اس سے الگ ہوتے ہیں اور اسے چھوڑتے ہیں۔ اے اللہ! ہم تیری ہی عبادت کرتے ہیں اور تیرے ہی لیے نماز پڑھتے اور سجدہ کرتے ہیں، اور تیری ہی طرف دوڑتے اور حاضر ہوتے ہیں، ہم تیری رحمت کے امیدوار ہیں اور تیرے عذاب سے ڈرتے ہیں، بے شک تیرا عذاب کافروں کو پہنچنے والا ہے۔"
          </p>
        </div>
      </div>

      {/* 6.2: نمازِ عیدین کا طریقہ */}
      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h3 style={{ margin: '0 0 0.85rem 0', color: '#065f46', fontSize: '1.25rem', fontWeight: 800 }}>
          نمازِ عیدین (عید الفطر و عید الاضحیٰ) کا طریقہ:
        </h3>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: '#475569', direction: 'rtl', lineHeight: 1.7 }}>
          عیدین کی نماز میں کل ۶ زائد تکبیریں ہوتی ہیں جو واجب ہیں:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '14px', direction: 'rtl' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>پہلی رکعت میں ۳ زائد تکبیریں:</h4>
            <ol style={{ margin: 0, paddingRight: '1.25rem', lineHeight: 1.8, fontSize: '0.88rem', color: '#334155' }}>
              <li>تکبیرِ تحریمہ کہہ کر ہاتھ باندھیں اور ثناء پڑھیں۔</li>
              <li>پھر ۳ بار 'اللہ اکبر' کہتے ہوئے کانوں تک ہاتھ اٹھائیں گے۔ پہلی دو تکبیروں پر ہاتھ کھلے چھوڑیں گے اور تیسری پر ہاتھ باندھ لیں گے۔</li>
              <li>اس کے بعد امام قرأت کرے گا اور رکوع و سجود ادا ہوں گے۔</li>
            </ol>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '14px', direction: 'rtl' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>دوسری رکعت میں ۳ زائد تکبیریں:</h4>
            <ol style={{ margin: 0, paddingRight: '1.25rem', lineHeight: 1.8, fontSize: '0.88rem', color: '#334155' }}>
              <li>دوسری رکعت میں پہلے امام قرأت کرے گا۔</li>
              <li>قرأت کے بعد رکوع میں جانے سے پہلے ۳ بار کانوں تک ہاتھ اٹھا کر 'اللہ اکبر' کہیں گے اور ہاتھ چھوڑ دیں گے۔</li>
              <li>چوتھی تکبیر پر بغیر ہاتھ اٹھائے رکوع میں چلے جائیں گے۔</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 6.3: صلوٰۃ التسبیح کا طریقہ */}
      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem 2rem' }}>
        <h3 style={{ margin: '0 0 0.85rem 0', color: '#0284c7', fontSize: '1.25rem', fontWeight: 800 }}>
          صلوٰۃ التسبیح کا مسنون طریقہ (۴ رکعتوں میں ۳۰۰ بار تسبیح):
        </h3>
        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#334155', direction: 'rtl' }}>
          رسول اللہ ﷺ نے حضرت عباس رضی اللہ عنہ سے فرمایا کہ اگر ہو سکے تو روزانہ، نہیں تو ہفتے میں ایک بار، نہیں تو مہینے میں، ورنہ سال میں، ورنہ زندگی میں ایک بار ضرور پڑھیں (ابو داؤد: 1297)۔
        </p>
        <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '12px', border: '1px solid #bae6fd', textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, fontFamily: "'Amiri', serif", color: '#0369a1' }}>
            سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَـٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ
          </p>
        </div>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', direction: 'rtl', fontSize: '0.88rem', lineHeight: 1.9, color: '#334155' }}>
          <strong>ہر رکعت میں ۷۵ مرتبہ تسبیح یوں پڑھی جاتی ہے:</strong>
          <ul style={{ margin: 0, paddingRight: '1.25rem' }}>
            <li>ثناء کے بعد سورت ملانے سے پہلے: ۱۵ مرتبہ</li>
            <li>قرأت کے بعد رکوع میں جانے سے پہلے: ۱۰ مرتبہ</li>
            <li>رکوع کی تسبیح کے بعد: ۱۰ مرتبہ</li>
            <li>قومہ میں (رکوع سے سیدھا کھڑے ہو کر): ۱۰ مرتبہ</li>
            <li>پہلے سجدے کی تسبیح کے بعد: ۱۰ مرتبہ</li>
            <li>جلسہ میں (دونوں سجدوں کے درمیان بیٹھ کر): ۱۰ مرتبہ</li>
            <li>دوسرے سجدے کی تسبیح کے بعد: ۱۰ مرتبہ</li>
            <li>(کل ۷۵ مرتبہ فی رکعت، ۴ رکعتوں میں کل ۳۰۰ مرتبہ مکمل)</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
