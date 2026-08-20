import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, RotateCcw, Check, Sparkles, Volume2, ArrowRight } from 'lucide-react';

export default function QuranWordsView() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);

  const wordsData = [
    { arabic: 'ٱللَّه', trans: 'Allah', meaning: 'Allah (God Almighty)', root: 'ا-ل-ه', frequency: '2699 times in Quran', verse: 'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ' },
    { arabic: 'رَبّ', trans: 'Rabb', meaning: 'Lord, Sustainer, Cherisher', root: 'ر-ب-ب', frequency: '970 times in Quran', verse: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
    { arabic: 'آَمَنَ', trans: 'Aamana', meaning: 'He believed / Have faith', root: 'أ-م-ن', frequency: '537 times in Quran', verse: 'الَّذِينَ آَمَنُوا وَعَمِلُوا الصَّالِحَاتِ' },
    { arabic: 'عَلِيم', trans: 'Aleem', meaning: 'All-Knowing, Omniscient', root: 'ع-ل-م', frequency: '162 times in Quran', verse: 'وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ' },
    { arabic: 'رَحِيم', trans: 'Raheem', meaning: 'Most Merciful', root: 'ر-ح-م', frequency: '227 times in Quran', verse: 'إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ' },
    { arabic: 'سَمَاوَات', trans: 'Samawat', meaning: 'Heavens / Skies', root: 'س-م-و', frequency: '190 times in Quran', verse: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ' },
    { arabic: 'يَوْم', trans: 'Yawm', meaning: 'Day / Period', root: 'ي-و-م', frequency: '393 times in Quran', verse: 'مَالِكِ يَوْمِ الدِّينِ' },
    { arabic: 'عَبَدَ', trans: 'Abada', meaning: 'He worshipped / Served', root: 'ع-ب-د', frequency: '275 times in Quran', verse: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' }
  ];

  const currentCard = wordsData[currentIndex];

  const handleNext = (known) => {
    if (known) setScore(score + 1);
    setIsFlipped(false);
    setCurrentIndex((currentIndex + 1) % wordsData.length);
  };

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Sparkles size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              80% Most Repeated Vocabulary
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Quran Vocabulary Flashcard Trainer
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Master the most frequent words in the Holy Quran through interactive flashcards, root letters, and sample verses.
          </p>
        </div>

        {/* ── Progress Bar ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontWeight: 700, color: '#334155', fontSize: '0.92rem' }}>
          <span>Card {currentIndex + 1} of {wordsData.length}</span>
          <span style={{ color: '#059669', background: '#d1fae5', padding: '4px 14px', borderRadius: '20px' }}>Score: {score} Mastered</span>
        </div>

        {/* ── Main Interactive Flashcard Card ── */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            background: isFlipped ? '#0f172a' : '#ffffff',
            color: isFlipped ? '#ffffff' : '#0f172a',
            borderRadius: '24px', padding: '3.5rem 2rem',
            border: isFlipped ? '2px solid #38bdf8' : '2px solid #f59e0b',
            boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
            cursor: 'pointer', textAlign: 'center', transition: 'all 0.4s ease',
            minHeight: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            marginBottom: '2rem', position: 'relative'
          }}
        >
          <span style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', padding: '4px 12px', borderRadius: '14px' }}>
            {currentCard.frequency}
          </span>

          {!isFlipped ? (
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'Amiri, serif', color: '#059669', marginBottom: '1rem' }}>
                {currentCard.arabic}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d97706' }}>
                {currentCard.trans}
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                (Tap card to reveal meaning &amp; root)
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', marginBottom: '0.75rem' }}>
                {currentCard.meaning}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#fcd34d', fontWeight: 700, marginBottom: '1rem' }}>
                Root Letters: {currentCard.root}
              </div>
              <div style={{ fontSize: '1.2rem', fontFamily: 'Amiri, serif', color: '#a7f3d0', lineHeight: 1.6 }}>
                "{currentCard.verse}"
              </div>
            </div>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => handleNext(false)}
            style={{
              flex: 1, padding: '14px', borderRadius: '16px', background: '#ef4444', color: '#fff',
              fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239,68,68,0.3)'
            }}
          >
            Needs Review
          </button>
          <button
            onClick={() => handleNext(true)}
            style={{
              flex: 1, padding: '14px', borderRadius: '16px', background: '#10b981', color: '#fff',
              fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
            }}
          >
            Mastered ✓
          </button>
        </div>

      </div>
    </div>
  );
}
