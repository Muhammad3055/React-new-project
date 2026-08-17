import React, { useState } from 'react';
import { X, Star, BookOpen, Volume2, ChevronDown, ChevronUp } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Friday Surah Data — Ayat, Tarjuma, Fazeelat (authentic Hadith references)
// ─────────────────────────────────────────────────────────────────────────────
const FRIDAY_SURAHS = [
  {
    id: 1,
    surah_number: 18,
    name_arabic: 'سُورَةُ الْكَهْف',
    name_english: "Surah Al-Kahf",
    importance: 'Most Important',
    importanceColor: '#f59e0b',
    audio_url: 'https://server8.mp3quran.net/afs/018.mp3',
    reciter: 'Mishary Rashid Alafasy',
    fazeelat: [
      {
        arabic: 'مَنْ قَرَأَ سُورَةَ الْكَهْفِ يَوْمَ الْجُمُعَةِ، أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ',
        urdu: 'جو شخص جمعہ کے دن سورۂ الکہف پڑھے، اس کے لیے دو جمعوں کے درمیان نور روشن کر دیا جاتا ہے۔',
        english: 'Whoever reads Surah Al-Kahf on Friday, light will shine for him from one Friday to the next.',
        source: 'Sunan Al-Bayhaqi — Sahih'
      }
    ],
    ayat: [
      {
        number: '18:1',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا',
        urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے اپنے بندے پر کتاب نازل فرمائی اور اس میں کوئی کجی نہیں رکھی۔',
        english: 'All praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.'
      },
      {
        number: '18:10',
        arabic: 'إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
        urdu: 'جب ان نوجوانوں نے غار میں پناہ لی تو کہا: اے ہمارے رب! ہمیں اپنی بارگاہ سے رحمت عطا فرما اور ہمارے معاملے میں ہدایت عطا فرما۔',
        english: '[mention] when the youths retreated to the cave and said: Our Lord, grant us mercy and guide us in our affair.'
      },
      {
        number: '18:107',
        arabic: 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا',
        urdu: 'بے شک جو لوگ ایمان لائے اور نیک اعمال کیے، ان کی مہمانی کے لیے جنت الفردوس ہوگا۔',
        english: 'Indeed, those who have believed and done righteous deeds — they will have the Gardens of Paradise as a lodging.'
      }
    ]
  },
  {
    id: 2,
    surah_number: 62,
    name_arabic: 'سُورَةُ الْجُمُعَة',
    name_english: "Surah Al-Jumu'ah",
    importance: 'Recommended',
    importanceColor: '#10b981',
    audio_url: 'https://server8.mp3quran.net/afs/062.mp3',
    reciter: 'Mishary Rashid Alafasy',
    fazeelat: [
      {
        arabic: 'كَانَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقْرَأُ فِي صَلَاةِ الْجُمُعَةِ سُورَةَ الْجُمُعَةِ',
        urdu: 'نبی کریم صلی اللہ علیہ وسلم جمعہ کی نماز میں سورۂ الجمعہ کی تلاوت فرمایا کرتے تھے۔',
        english: "The Prophet (peace be upon him) used to recite Surah Al-Jumu'ah in the Friday prayer.",
        source: 'Sahih Muslim — Book 4, Hadith 1827'
      }
    ],
    ayat: [
      {
        number: '62:9',
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ',
        urdu: 'اے ایمان والو! جب جمعہ کے دن نماز کے لیے اذان دی جائے تو اللہ کے ذکر کی طرف دوڑو اور خرید و فروخت چھوڑ دو، یہ تمہارے لیے بہتر ہے اگر تم جانتے ہو۔',
        english: 'O you who have believed, when you are called to the Friday prayer, then proceed to the remembrance of Allah and leave trade. That is better for you, if you only knew.'
      },
      {
        number: '62:10',
        arabic: 'فَإِذَا قُضِيَتِ الصَّلَاةُ فَانتَشِرُوا فِي الْأَرْضِ وَابْتَغُوا مِن فَضْلِ اللَّهِ وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ',
        urdu: 'پھر جب نماز پوری ہو جائے تو زمین میں پھیل جاؤ اور اللہ کا فضل تلاش کرو اور اللہ کو کثرت سے یاد کرو تاکہ تم کامیاب ہو جاؤ۔',
        english: 'And when the prayer has been concluded, disperse within the land and seek from the bounty of Allah, and remember Allah often that you may succeed.'
      }
    ]
  },
  {
    id: 3,
    surah_number: 36,
    name_arabic: 'سُورَةُ يس',
    name_english: 'Surah Ya-Sin',
    importance: 'Sunnah',
    importanceColor: '#8b5cf6',
    audio_url: 'https://server7.mp3quran.net/s_gmd/036.mp3',
    reciter: 'Saad Al-Ghamdi',
    fazeelat: [
      {
        arabic: 'إِنَّ لِكُلِّ شَيْءٍ قَلْبًا، وَقَلْبُ الْقُرْآنِ يس',
        urdu: 'بے شک ہر چیز کا ایک دل ہوتا ہے، اور قرآن کا دل سورۂ یٰسین ہے۔',
        english: 'Verily, for everything there is a heart, and the heart of the Quran is Ya-Sin.',
        source: 'Sunan Al-Tirmidhi — Hadith 2887'
      }
    ],
    ayat: [
      {
        number: '36:1-2',
        arabic: 'يس ۝ وَالْقُرْآنِ الْحَكِيمِ',
        urdu: 'یٰسین۔ حکمت والے قرآن کی قسم!',
        english: 'Ya-Sin. By the wise Quran.'
      },
      {
        number: '36:58',
        arabic: 'سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ',
        urdu: '(اہلِ جنت کو) رحیم پروردگار کی طرف سے "سلام" کا کلمہ ہوگا۔',
        english: '[And] "Peace!" — a word from a Merciful Lord.'
      }
    ]
  }
];

export default function FridaySpecialModal({ isOpen, onClose, playTrack }) {
  const [openSurah, setOpenSurah] = useState(0);
  const [tabState, setTabState] = useState({});

  if (!isOpen) return null;

  const getTab = (idx) => tabState[idx] || 'fazeelat';
  const setTabFor = (idx, val) => setTabState(prev => ({ ...prev, [idx]: val }));

  const handlePlay = (surah) => {
    if (playTrack) {
      playTrack(surah.audio_url, surah.name_english, surah.reciter);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999998,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%', maxWidth: '700px', maxHeight: '92vh',
          background: 'linear-gradient(160deg, #0d1f14 0%, #0f172a 60%, #1a0a2e 100%)',
          border: '2px solid rgba(245,158,11,0.6)',
          borderRadius: '24px',
          color: '#fff',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 60px rgba(245,158,11,0.08)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.1rem 1.5rem',
          background: 'linear-gradient(90deg, rgba(5,150,105,0.25) 0%, rgba(245,158,11,0.12) 100%)',
          borderBottom: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(5,150,105,0.3))',
              border: '1.5px solid rgba(245,158,11,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem'
            }}>☀️</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b' }}>
                  یوم الجمعہ — Friday Special
                </h3>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '8px',
                  background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.5)',
                  color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase'
                }}>Jumu'ah</span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                Surahs to recite · Key Ayat · Fazeelat (Virtues)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', width: '34px', height: '34px', borderRadius: '50%',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          ><X size={16} /></button>
        </div>

        {/* Intro Banner */}
        <div style={{
          margin: '1rem 1.25rem 0', padding: '0.85rem 1.1rem', borderRadius: '14px',
          background: 'linear-gradient(90deg, rgba(245,158,11,0.12), rgba(5,150,105,0.10))',
          border: '1px solid rgba(245,158,11,0.25)',
          display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0
        }}>
          <Star size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '0.87rem', color: '#e2e8f0', lineHeight: 1.6 }}>
            <strong style={{ color: '#f59e0b' }}>Yawm al-Jumu'ah</strong> is the best day of the week.
            The Prophet (SAW) said:{' '}
            <em style={{ color: '#fcd34d' }}>"The best day the sun rises over is Friday."</em>
            <span style={{ color: '#94a3b8' }}> — Sahih Muslim</span>
          </p>
        </div>

        {/* Surah Accordion */}
        <div style={{ padding: '1rem 1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {FRIDAY_SURAHS.map((surah, idx) => {
            const isExpanded = openSurah === idx;
            const activeTab = getTab(idx);
            return (
              <div key={surah.id} style={{
                borderRadius: '16px',
                background: isExpanded
                  ? 'linear-gradient(135deg, rgba(5,150,105,0.12) 0%, rgba(13,148,136,0.08) 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${isExpanded ? surah.importanceColor + '60' : 'rgba(255,255,255,0.09)'}`,
                overflow: 'hidden', transition: 'all 0.3s ease'
              }}>
                {/* Accordion Header */}
                <div
                  onClick={() => setOpenSurah(isExpanded ? null : idx)}
                  style={{ padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: `${surah.importanceColor}20`, border: `1.5px solid ${surah.importanceColor}60`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.95rem', fontWeight: 800, color: surah.importanceColor
                    }}>{surah.surah_number}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#f1f5f9' }}>
                          {surah.name_english}
                        </span>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 700, padding: '1px 7px', borderRadius: '8px',
                          background: `${surah.importanceColor}20`, border: `1px solid ${surah.importanceColor}50`,
                          color: surah.importanceColor
                        }}>{surah.importance}</span>
                      </div>
                      <div style={{ fontSize: '1rem', color: '#fcd34d', fontFamily: 'serif', marginTop: '2px' }}>
                        {surah.name_arabic}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={e => { e.stopPropagation(); handlePlay(surah); }}
                      title="Play audio"
                      style={{
                        background: 'rgba(5,150,105,0.2)', border: '1px solid rgba(5,150,105,0.5)',
                        color: '#34d399', width: '32px', height: '32px', borderRadius: '50%',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    ><Volume2 size={14} /></button>
                    {isExpanded ? <ChevronUp size={18} style={{ color: '#94a3b8' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0 1.1rem 1.1rem' }}>
                    {/* Tab Switcher */}
                    <div style={{ display: 'flex', gap: '0.5rem', margin: '0.85rem 0 0.9rem' }}>
                      {[['fazeelat', '✨ Fazeelat'], ['ayat', '📖 Key Ayat']].map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setTabFor(idx, key)}
                          style={{
                            padding: '0.4rem 1rem', borderRadius: '10px',
                            fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                            border: `1.5px solid ${activeTab === key ? surah.importanceColor : 'rgba(255,255,255,0.12)'}`,
                            background: activeTab === key ? `${surah.importanceColor}20` : 'transparent',
                            color: activeTab === key ? surah.importanceColor : '#94a3b8',
                            transition: 'all 0.2s'
                          }}
                        >{label}</button>
                      ))}
                    </div>

                    {/* Fazeelat */}
                    {activeTab === 'fazeelat' && surah.fazeelat.map((f, fi) => (
                      <div key={fi} style={{
                        padding: '1rem', borderRadius: '12px',
                        background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(245,158,11,0.2)',
                        marginBottom: fi < surah.fazeelat.length - 1 ? '0.75rem' : 0
                      }}>
                        <p style={{ margin: '0 0 0.6rem', textAlign: 'right', direction: 'rtl', fontSize: '1.1rem', lineHeight: 2, color: '#fcd34d', fontFamily: 'serif' }}>
                          {f.arabic}
                        </p>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.7, direction: 'rtl', textAlign: 'right' }}>
                          {f.urdu}
                        </p>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                          {f.english}
                        </p>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: '8px',
                          background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)'
                        }}>📚 {f.source}</span>
                      </div>
                    ))}

                    {/* Key Ayat */}
                    {activeTab === 'ayat' && surah.ayat.map((ayah, ai) => (
                      <div key={ai} style={{
                        padding: '1rem', borderRadius: '12px',
                        background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)',
                        marginBottom: ai < surah.ayat.length - 1 ? '0.75rem' : 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                          <BookOpen size={13} style={{ color: surah.importanceColor }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: surah.importanceColor }}>{ayah.number}</span>
                        </div>
                        <p style={{ margin: '0 0 0.7rem', textAlign: 'right', direction: 'rtl', fontSize: '1.25rem', lineHeight: 2.1, color: '#fde68a', fontFamily: 'serif' }}>
                          {ayah.arabic}
                        </p>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.7, direction: 'rtl', textAlign: 'right' }}>
                          {ayah.urdu}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                          {ayah.english}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Footer Reminder */}
          <div style={{
            padding: '0.85rem 1rem', borderRadius: '14px',
            background: 'rgba(245,158,11,0.06)', border: '1px dashed rgba(245,158,11,0.3)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#fcd34d' }}>
              🤲 Also recite <strong>Salawat</strong> abundantly on Fridays —{' '}
              <em style={{ color: '#94a3b8' }}>"The best of your days is Friday." — Sunan Abu Dawood</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
