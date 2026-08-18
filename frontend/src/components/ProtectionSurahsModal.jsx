import React, { useState } from 'react';
import { X, ShieldAlert, BookOpen, Volume2, Copy, Check, Heart, Shield } from 'lucide-react';

const PROTECTION_DATA = [
  {
    id: 'ayat-al-kursi',
    name_arabic: 'آية الكرسي',
    name_english: 'Ayat al-Kursi',
    reference: 'Surah Al-Baqarah (2:255)',
    audio_url: 'https://server8.mp3quran.net/afs/002255.mp3',
    virtue_urdu: 'اس کی تلاوت کرنے والے کی حفاظت کے لیے اللہ کی طرف سے ایک فرشتہ مقرر ہوتا ہے اور شیطان صبح تک اس کے قریب نہیں آ سکتا۔',
    virtue_english: 'Reciting it provides divine protection from Allah; a guardian angel is appointed to protect you, and shaytan cannot approach you until morning.',
    source: 'Sahih al-Bukhari (3275)',
    ayat: [
      {
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnihi? Ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bishay'im-min 'ilmihi illa bima sha'. Wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifdhuhuma, wa Huwal-'Aliyyul-'Adheem.",
        urdu: 'اللہ، اس کے سوا کوئی عبادت کے لائق نہیں، وہ ہمیشہ زندہ رہنے والا اور سب کا نگہبان ہے۔ اسے نہ تو اونگھ آتی ہے اور نہ نیند۔ جو کچھ آسمانوں میں ہے اور جو کچھ زمین میں ہے، سب اسی کا ہے۔ کون ہے جو اس کی اجازت کے بغیر اس کے حضور سفارش کر سکے؟ وہ سب کچھ جانتا ہے جو ان کے سامنے ہے اور جو ان کے پیچھے ہے۔ اور وہ اس کے علم میں سے کسی چیز کا احاطہ نہیں کر سکتے مگر جتنا وہ چاہے۔ اس کی کرسی کی وسعت نے آسمانوں اور زمین کو گھیر رکھا ہے، اور ان دونوں کی حفاظت اسے تھکاتی نہیں، اور وہی سب سے بلند، سب سے بڑا ہے۔',
        english: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.'
      }
    ]
  },
  {
    id: 'al-falaq',
    name_arabic: 'سُورةُ الْفَلَق',
    name_english: 'Surah Al-Falaq',
    reference: 'Surah 113',
    audio_url: 'https://server8.mp3quran.net/afs/113.mp3',
    virtue_urdu: 'حاسد کے حسد، جادوگرنیوں کے پھونک مارنے اور تمام مخلوق کے شر اور نظرِ بد (عین) سے حفاظت کے لیے سب سے بہترین اور لاجواب سورت ہے۔',
    virtue_english: 'Best Surah for protection against the envy of enviers, the mischief of sorcerers (black magic), the evil eye (Nazar), and the harms of all creation.',
    source: 'Tafseer Ibn Kathir / Sunan an-Nasa\'i (5440)',
    ayat: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', transliteration: 'Qul a\'udhu bi rabbil-falaq', urdu: 'کہہ دیجیے کہ میں صبح کے رب کی پناہ مانگتا ہوں۔', english: 'Say, "I seek refuge in the Lord of daybreak' },
      { arabic: 'مِن شَرِّ مَا خَلَقَ', transliteration: 'Min sharri ma khalaq', urdu: 'ہر اس چیز کے شر سے جو اس نے پیدا کی ہے۔', english: 'From the evil of that which He created' },
      { arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', transliteration: 'Wa min sharri ghasiqin idha waqab', urdu: 'اور اندھیری رات کے شر سے جب اس کا اندھیرا چھا جائے۔', english: 'And from the evil of darkness when it settles' },
      { arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', transliteration: 'Wa min sharrin-naffathati fil-\'uqad', urdu: 'اور گرہوں میں پھونک مارنے والیوں (جادوگرنیوں) کے شر سے۔', english: 'And from the evil of the blowers in knots' },
      { arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', transliteration: 'Wa min sharri hasidin idha hasad', urdu: 'اور حسد کرنے والے کے شر سے جب وہ حسد کرے۔', english: 'And from the evil of an envier when he envies."' }
    ]
  },
  {
    id: 'an-nas',
    name_arabic: 'سُورةُ النَّاس',
    name_english: 'Surah An-Nas',
    reference: 'Surah 114',
    audio_url: 'https://server8.mp3quran.net/afs/114.mp3',
    virtue_urdu: 'وسوسے ڈالنے والے شیطانوں، جنات اور حاسد انسانوں کے تمام پوشیدہ اور ظاہری شر سے پناہ مانگنے کی سب سے بہترین اور طاقتور ترین سورت ہے۔',
    virtue_english: 'Provides ultimate protection against hidden whisperings, negative suggestions of Shaytan, and all evils originating from Jinns and Humans.',
    source: 'Sahih al-Bukhari (5016)',
    ayat: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', transliteration: 'Qul a\'udhu bi rabbin-nas', urdu: 'آپ کہہ دیجیے کہ میں انسانوں کے پروردگار کی پناہ میں آتا ہوں۔', english: 'Say, "I seek refuge in the Lord of mankind,' },
      { arabic: 'مَلِكِ النَّاسِ', transliteration: 'Malikin-nas', urdu: 'انسانوں کے مالک کی (پناہ میں)۔', english: 'The Sovereign of mankind,' },
      { arabic: 'إِلَٰهِ النَّاسِ', transliteration: 'Ilahin-nas', urdu: 'انسانوں کے سچے معبود کی (پناہ میں)۔', english: 'The God of mankind,' },
      { arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', transliteration: 'Min sharril-waswasil-khannas', urdu: 'وسوسہ ڈالنے والے، پیچھے ہٹ جانے والے (شیطان) کے شر سے۔', english: 'From the evil of the retreating whisperer -' },
      { arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', transliteration: 'Alladhi yuwaswisu fi sudurin-nas', urdu: 'جو لوگوں کے سینوں میں وسوسے ڈالتا ہے۔', english: 'Who whispers [evil] into the breasts of mankind -' },
      { arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', transliteration: 'Minal-jinnati wan-nas', urdu: 'خواہ وہ جنات میں سے ہو یا انسانوں میں سے۔', english: 'From among the jinn and mankind."' }
    ]
  },
  {
    id: 'al-ikhlas',
    name_arabic: 'سُورةُ الْإِخْلَاص',
    name_english: 'Surah Al-Ikhlas',
    reference: 'Surah 112',
    audio_url: 'https://server8.mp3quran.net/afs/112.mp3',
    virtue_urdu: 'تہائی قرآن کے برابر فضیلت رکھتی ہے۔ توحیدِ باری تعالیٰ کی کامل گواہی ہے جس کی وجہ سے تمام برے اثرات، نحوست اور شیطانی حملوں سے حفاظت ہوتی ہے۔',
    virtue_english: 'Equivalent to one-third of the Holy Quran. Reciting it solidifies absolute monotheism, acting as a spiritual shield against malice and demonic forces.',
    source: 'Sahih al-Bukhari (5015)',
    ayat: [
      { arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', transliteration: 'Qul huwal-lahu ahad', urdu: 'کہہ دیجیے کہ وہ اللہ ایک ہی ہے۔', english: 'Say, "He is Allah, [who is] One,' },
      { arabic: 'اللَّهُ الصَّمَدُ', transliteration: 'Allahu-samad', urdu: 'اللہ بے نیاز (اور سب کا سہارا) ہے۔', english: 'Allah, the Eternal Refuge.' },
      { arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', transliteration: 'Lam yalid wa lam yulad', urdu: 'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی سے پیدا ہوا ہے۔', english: 'He neither begets nor is born,' },
      { arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', transliteration: 'Wa lam yakul-lahu kufuwan ahad', urdu: 'اور نہ ہی کوئی اس کے برابر کا ہے۔', english: 'And there is none co-equal or comparable to Him."' }
    ]
  }
];

export default function ProtectionSurahsModal({ isOpen, onClose, playTrack }) {
  const [selectedSurahId, setSelectedSurahId] = useState('ayat-al-kursi');
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const currentSurah = PROTECTION_DATA.find((s) => s.id === selectedSurahId) || PROTECTION_DATA[0];

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePlayAudio = () => {
    if (playTrack && currentSurah.audio_url) {
      playTrack(currentSurah.audio_url, `${currentSurah.name_english} (${currentSurah.name_arabic})`, 'Mishary Rashid Alafasy');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      {/* Blur Backdrop */}
      <div 
        onClick={onClose} 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.75)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease'
        }} 
      />

      {/* Main Responsive Modal Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        background: 'linear-gradient(135deg, var(--primary-emerald) 0%, var(--primary-dark) 100%)',
        border: '2px solid var(--accent-gold, #f59e0b)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#ffffff',
        zIndex: 1,
        boxSizing: 'border-box',
        animation: 'modalEntrance 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      }}>
        {/* Style definitions for animations & scrollbars */}
        <style>{`
          @keyframes modalEntrance {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.15);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--accent-gold, #f59e0b);
            border-radius: 4px;
          }
          @media (max-width: 640px) {
            .modal-title-container {
              flex-direction: column;
              align-items: flex-start !important;
              gap: 0.5rem;
            }
            .surah-tab-list {
              overflow-x: auto;
              white-space: nowrap;
              padding-bottom: 8px;
              width: 100%;
              justify-content: flex-start !important;
            }
            .surah-tab-btn {
              padding: 6px 14px !important;
              font-size: 0.8rem !important;
              flex-shrink: 0;
            }
            .verse-block {
              padding: 0.85rem !important;
            }
            .arabic-verse-text {
              font-size: clamp(1.4rem, 5vw, 1.8rem) !important;
              line-height: 2.1 !important;
            }
          }
        `}</style>

        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.15)',
          flexShrink: 0
        }}>
          <div className="modal-title-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-gold, #f59e0b)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--accent-gold, #f59e0b)' }}>
                Daily Protection & Nazar Surahs
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 600 }}>
                Mu'awwidhatayn & Ayat al-Kursi against Evil Eye, Magic & Harm (العين والشرور)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Tabs Selection */}
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          flexShrink: 0
        }}>
          <div className="surah-tab-list" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            {PROTECTION_DATA.map((s) => (
              <button
                key={s.id}
                className="surah-tab-btn"
                onClick={() => setSelectedSurahId(s.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: selectedSurahId === s.id ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.1)',
                  background: selectedSurahId === s.id ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.05)',
                  color: selectedSurahId === s.id ? 'var(--primary-dark)' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
              >
                {s.name_english} ({s.name_arabic})
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="custom-scrollbar" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
          boxSizing: 'border-box'
        }}>
          
          {/* Virtue Description Panel */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.06)',
            borderLeft: '4px solid var(--accent-gold, #f59e0b)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShieldAlert size={16} style={{ color: 'var(--accent-gold, #f59e0b)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-gold, #f59e0b)', letterSpacing: '0.5px' }}>
                Benefits & Protection Virtues (فضائل و برکات)
              </span>
            </div>
            
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', lineHeight: 1.5, color: '#fef3c7', fontWeight: 700, direction: 'rtl', textAlign: 'right', fontFamily: 'system-ui, sans-serif' }}>
              {currentSurah.virtue_urdu}
            </p>
            <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.88rem', lineHeight: 1.5, color: '#e2e8f0' }}>
              {currentSurah.virtue_english}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 700 }}>
              <span>📚 Source: {currentSurah.source}</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>{currentSurah.reference}</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <button
              onClick={handlePlayAudio}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'var(--accent-gold, #f59e0b)',
                color: '#022c22',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Volume2 size={15} /> Play Recitation MP3 (تلاوت سنیں)
            </button>

            <button
              onClick={() => setShowTransliteration(!showTransliteration)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '6px 14px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.15)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {showTransliteration ? 'Hide English Transliteration' : 'Show Transliteration'}
            </button>
          </div>

          {/* Verses Render Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {currentSurah.ayat.map((a, index) => (
              <div 
                key={index} 
                className="verse-block"
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: 'rgba(0, 0, 0, 0.22)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxSizing: 'border-box',
                  position: 'relative'
                }}
              >
                {/* Ayah Index & Copy Button */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 700
                }}>
                  <span>Verse {index + 1} of {currentSurah.ayat.length}</span>
                  <button
                    onClick={() => handleCopyText(`${a.arabic}\n\nUrdu: ${a.urdu}\nEnglish: ${a.english}`, index)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedIndex === index ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontWeight: 700
                    }}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={12} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy Verse
                      </>
                    )}
                  </button>
                </div>

                {/* Arabic Script */}
                <p 
                  className="arabic-verse-text"
                  style={{
                    margin: '0 0 1rem 0',
                    textAlign: 'right',
                    direction: 'rtl',
                    fontSize: '1.75rem',
                    lineHeight: 2.1,
                    color: '#fef3c7',
                    fontFamily: "'Amiri', serif",
                    wordWrap: 'break-word',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))'
                  }}
                >
                  {a.arabic}
                </p>

                {/* Transliteration */}
                {showTransliteration && (
                  <p style={{
                    margin: '0 0 0.85rem 0',
                    fontSize: '0.82rem',
                    color: '#a7f3d0',
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    borderLeft: '2px solid rgba(16, 185, 129, 0.4)',
                    paddingLeft: '8px'
                  }}>
                    {a.transliteration}
                  </p>
                )}

                {/* Urdu Tarjuma */}
                <p style={{
                  margin: '0 0 0.6rem 0',
                  textAlign: 'right',
                  direction: 'rtl',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  <span style={{ fontSize: '0.72rem', background: '#047857', color: '#fff', padding: '1px 5px', borderRadius: '4px', marginLeft: '6px', display: 'inline-block', verticalAlign: 'middle' }}>UR</span>
                  {a.urdu}
                </p>

                {/* English Translation */}
                <p style={{
                  margin: 0,
                  fontSize: '0.86rem',
                  lineHeight: 1.6,
                  color: '#cbd5e1'
                }}>
                  <span style={{ fontSize: '0.72rem', background: '#3b82f6', color: '#fff', padding: '1px 5px', borderRadius: '4px', marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>EN</span>
                  {a.english}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Reminder */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px dashed rgba(245, 158, 11, 0.25)',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a7f3d0', lineHeight: 1.5 }}>
              🛡️ <strong>Sunnah Tip:</strong> Recite these three Quls three times in the morning and evening. They will suffice you against everything (including Nazar/evil eye, harm, magic).
              <br />
              <em style={{ color: '#cbd5e1', fontSize: '0.74rem' }}>"Recite them three times in the evening and in the morning, and they will protect you from everything." — Sunan at-Tirmidhi (3575)</em>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
