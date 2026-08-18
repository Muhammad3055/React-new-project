import React, { useState, useEffect } from 'react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which Surah of the Holy Quran is known as 'The Heart of the Quran'?",
    options: ["Surah Yaseen", "Surah Al-Rahman", "Surah Al-Mulk", "Surah Al-Baqarah"],
    correctIndex: 0,
    explanation: "Surah Yaseen (36) is referred to as the heart of the Quran in famous Hadith literature due to its profound themes of Tawheed, Resurrection, and Prophethood."
  },
  {
    id: 2,
    question: "How many Surahs are there in the Holy Quran?",
    options: ["112", "114", "110", "120"],
    correctIndex: 1,
    explanation: "The Holy Quran contains 114 Surahs, starting with Surah Al-Fatiha and ending with Surah An-Nas."
  },
  {
    id: 3,
    question: "Which Prophet was swallowed by a large fish/whale and prayed inside its belly?",
    options: ["Prophet Yunus (AS)", "Prophet Musa (AS)", "Prophet Ibrahim (AS)", "Prophet Nuh (AS)"],
    correctIndex: 0,
    explanation: "Prophet Yunus (Jonah) AS prayed 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin' inside the fish and Allah rescued him."
  },
  {
    id: 4,
    question: "Which Sahabi was known as 'Saifullah' (The Sword of Allah)?",
    options: ["Khalid ibn al-Walid (RA)", "Ali ibn Abi Talib (RA)", "Umar ibn al-Khattab (RA)", "Hamza ibn Abdul-Muttalib (RA)"],
    correctIndex: 0,
    explanation: "Prophet Muhammad (PBUH) bestowed the title 'Saifullah' (The Drawn Sword of Allah) upon Khalid ibn al-Walid (RA)."
  },
  {
    id: 5,
    question: "In which Islamic month was the Holy Quran first revealed?",
    options: ["Ramadan", "Muharram", "Rabi al-Awwal", "Dhul Hijjah"],
    correctIndex: 0,
    explanation: "The Quran was revealed in the blessed month of Ramadan on Laylat al-Qadr (The Night of Decree)."
  },
  {
    id: 6,
    question: "Which Prophet is known as 'Khalilullah' (The Friend of Allah)?",
    options: ["Prophet Ibrahim (AS)", "Prophet Isa (AS)", "Prophet Musa (AS)", "Prophet Adam (AS)"],
    correctIndex: 0,
    explanation: "Prophet Ibrahim (Abraham) AS earned the noble status of Khalilullah (Friend of Allah)."
  },
  {
    id: 7,
    question: "What is the longest Surah in the Holy Quran?",
    options: ["Surah Al-Baqarah", "Surah Aal-Imran", "Surah An-Nisa", "Surah Al-Ma'idah"],
    correctIndex: 0,
    explanation: "Surah Al-Baqarah is the longest Surah in the Quran containing 286 verses."
  },
  {
    id: 8,
    question: "Which prayer is performed specifically during the night in the month of Ramadan?",
    options: ["Taraweeh", "Tahajjud", "Ishraq", "Chasht"],
    correctIndex: 0,
    explanation: "Taraweeh prayers are special sunnah prayers performed every night after Isha during Ramadan."
  },
  {
    id: 9,
    question: "How many Sajdahs (prostrations of recitation) are there in the Holy Quran?",
    options: ["14", "12", "15", "10"],
    correctIndex: 0,
    explanation: "There are 14 agreed-upon Ayahs of Sajdah (Sajdah Tilawat) in the Holy Quran."
  },
  {
    id: 10,
    question: "Which city is home to Al-Aqsa Mosque, the third holiest site in Islam?",
    options: ["Jerusalem (Al-Quds)", "Makkah", "Madinah", "Damascus"],
    correctIndex: 0,
    explanation: "Masjid Al-Aqsa is situated in Jerusalem (Al-Quds) and was the first Qibla of Muslims."
  }
];

export default function QuizView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem('maktaba_quiz_streak') || '1', 10);
    setStreak(savedStreak);
  }, []);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('maktaba_quiz_streak', newStreak.toString());
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem', color: 'var(--text-main)' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-emerald) 0%, var(--primary-dark) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '20px', padding: '1.75rem',
        marginBottom: '2rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', padding: '4px 14px', borderRadius: '20px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem' }}>
          <i className="fas fa-fire"></i> Daily Streak: {streak} Days
        </div>
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b', fontSize: '2rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
          🧠 Daily Islamic Knowledge Quiz
        </h1>
        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem' }}>
          Test and expand your knowledge of the Holy Quran, Prophet's Seerah, Authentic Hadith & Islamic History.
        </p>
      </div>

      {!quizCompleted ? (
        <div style={{
          background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
          padding: '2rem', boxShadow: '0 15px 35px rgba(0,0,0,0.6)'
        }}>
          {/* Progress Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: '#94a3b8', fontSize: '0.88rem', fontWeight: '600' }}>
            <span>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
            <span>Current Score: <strong style={{ color: '#f59e0b' }}>{score}</strong></span>
          </div>
          <div style={{ height: '8px', background: '#18181b', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.75rem' }}>
            <div style={{ height: '100%', width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`, background: 'linear-gradient(90deg, #f59e0b, #10b981)', transition: 'width 0.3s ease' }}></div>
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1.5rem', lineHeight: '1.4' }}>
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {currentQ.options.map((option, idx) => {
              let bg = '#18181b';
              let border = '1px solid rgba(255,255,255,0.1)';
              let color = '#e2e8f0';

              if (selectedOption !== null) {
                if (idx === currentQ.correctIndex) {
                  bg = 'rgba(16, 185, 129, 0.2)';
                  border = '2px solid #10b981';
                  color = '#10b981';
                } else if (idx === selectedOption) {
                  bg = 'rgba(239, 68, 68, 0.2)';
                  border = '2px solid #ef4444';
                  color = '#ef4444';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  style={{
                    padding: '1rem 1.25rem', borderRadius: '12px', background: bg, border: border,
                    color: color, fontWeight: '600', fontSize: '1rem', textAlign: 'left', cursor: selectedOption === null ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s ease'
                  }}
                >
                  <span>{option}</span>
                  {selectedOption !== null && idx === currentQ.correctIndex && <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>}
                  {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctIndex && <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i>}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div style={{
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px',
              padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#fef3c7', fontSize: '0.92rem', lineHeight: '1.5'
            }}>
              <strong style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <i className="fas fa-info-circle"></i> Explanation & Context:
              </strong>
              {currentQ.explanation}
            </div>
          )}

          {/* Next Button */}
          {selectedOption !== null && (
            <button
              onClick={handleNextQuestion}
              style={{
                width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000', fontWeight: '700', borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontSize: '1rem', boxShadow: '0 4px 15px rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              {currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question ▶' : 'View Quiz Summary 🏆'}
            </button>
          )}
        </div>
      ) : (
        /* Quiz Summary Screen */
        <div style={{
          background: '#09090b', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '20px',
          padding: '2.5rem', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.7)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎉</div>
          <h2 style={{ color: '#f59e0b', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
            Quiz Completed!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            You scored <strong style={{ color: '#10b981', fontSize: '1.4rem' }}>{score}</strong> out of <strong style={{ color: '#fff' }}>{QUIZ_QUESTIONS.length}</strong> ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
          </p>

          <div style={{
            display: 'inline-flex', gap: '1rem', background: '#18181b', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '1rem 2rem', marginBottom: '2rem'
          }}>
            <div>
              <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem' }}>Badge Earned</span>
              <strong style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
                {score >= 8 ? '🏅 Quran Scholar' : score >= 5 ? '⭐ Islamic Explorer' : '🌱 Knowledge Seeker'}
              </strong>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem' }}>Daily Streak</span>
              <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>🔥 {streak} Days</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={handleRestartQuiz}
              style={{
                padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000',
                fontWeight: '700', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.95rem'
              }}
            >
              <i className="fas fa-redo"></i> Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
