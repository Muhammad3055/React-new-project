import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function QuizView() {
  const { lang } = useLanguage();
  
  const [dailyQuestions, setDailyQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizLocked, setQuizLocked] = useState(false);
  const [streak, setStreak] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Translation helpers
  const getTrans = (obj) => {
    if (!obj) return "";
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['en'] || obj['ur'] || obj['ar'];
  };

  const getTransArray = (arrObj) => {
    if (!arrObj) return [];
    if (Array.isArray(arrObj)) return arrObj;
    return arrObj[lang] || arrObj['en'] || arrObj['ur'] || arrObj['ar'];
  };

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem('maktaba_quiz_streak') || '0', 10);
    const lastDate = localStorage.getItem('maktaba_quiz_last_date');
    const currentDateStr = new Date().toISOString().split('T')[0];

    // Streak logic
    if (lastDate === currentDateStr) {
      setQuizLocked(true); // Already played today
      setStreak(savedStreak);
      setLoading(false);
      return;
    } else {
      // Check if streak is broken (missed yesterday)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastDate === yesterdayStr) {
        setStreak(savedStreak);
      } else if (lastDate && lastDate !== yesterdayStr) {
        setStreak(0); // broken streak
        localStorage.setItem('maktaba_quiz_streak', '0');
      } else {
        setStreak(savedStreak);
      }
    }

    // Fetch the automatic daily quiz from the API
    const fetchDailyQuiz = async () => {
      try {
        const response = await fetch('/api/quiz/daily/');
        if (!response.ok) {
          throw new Error('Failed to load quiz');
        }
        const data = await response.json();
        setDailyQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load today's quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyQuiz();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#f59e0b' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⏳</div>
        <style>
          {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
        </style>
        <h2>Generating Today's Quiz...</h2>
        <p style={{ color: '#94a3b8' }}>Our AI is preparing fresh Islamic questions for you. This might take a few seconds!</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#ef4444' }}>
        <h2>Oops!</h2>
        <p>{error}</p>
      </div>
    );
  }

  // If locked, we don't need questions
  if (!quizLocked && dailyQuestions.length === 0) return null;

  const currentQ = dailyQuestions[currentIndex];

  const handleSelectOption = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < dailyQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('maktaba_quiz_streak', newStreak.toString());
      localStorage.setItem('maktaba_quiz_last_date', new Date().toISOString().split('T')[0]);
    }
  };

  const handleRestartQuiz = () => {
    setQuizLocked(true);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem', color: 'var(--text-main)', direction: lang === 'ur' || lang === 'ar' ? 'rtl' : 'ltr' }}>
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

      {quizLocked ? (
         <div style={{
          background: '#09090b', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '20px',
          padding: '3rem 2rem', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.7)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ color: '#10b981', fontSize: '2rem', fontWeight: '800', margin: '0 0 1rem 0' }}>
            Come Back Tomorrow!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
            You have already completed your daily 10 questions. Take a rest, review what you learned, and come back tomorrow for a new set of questions!
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '0.8rem 1.5rem', color: '#f59e0b', fontWeight: '700' }}>
             Current Streak: {streak} Days 🔥
          </div>
        </div>
      ) : !quizCompleted && currentQ ? (
        <div style={{
          background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
          padding: '2rem', boxShadow: '0 15px 35px rgba(0,0,0,0.6)'
        }}>
          {/* Progress Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: '#94a3b8', fontSize: '0.88rem', fontWeight: '600', direction: 'ltr' }}>
            <span>Question {currentIndex + 1} of {dailyQuestions.length}</span>
            <span>Current Score: <strong style={{ color: '#f59e0b' }}>{score}</strong></span>
          </div>
          <div style={{ height: '8px', background: '#18181b', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.75rem', direction: 'ltr' }}>
            <div style={{ height: '100%', width: `${((currentIndex + 1) / dailyQuestions.length) * 100}%`, background: 'linear-gradient(90deg, #f59e0b, #10b981)', transition: 'width 0.3s ease' }}></div>
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1.5rem', lineHeight: '1.4' }}>
            {getTrans(currentQ.question)}
          </h3>

          {/* Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {getTransArray(currentQ.options).map((option, idx) => {
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
                    color: color, fontWeight: '600', fontSize: '1rem', textAlign: lang === 'ur' || lang === 'ar' ? 'right' : 'left', cursor: selectedOption === null ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s ease',
                    fontFamily: lang === 'ur' ? 'Jameel Noori Nastaleeq, sans-serif' : lang === 'ar' ? 'Amiri, serif' : 'inherit'
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
              {getTrans(currentQ.explanation)}
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
              {currentIndex < dailyQuestions.length - 1 ? 'Next Question ▶' : 'View Quiz Summary 🏆'}
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
            You scored <strong style={{ color: '#10b981', fontSize: '1.4rem' }}>{score}</strong> out of <strong style={{ color: '#fff' }}>{dailyQuestions.length}</strong> ({Math.round((score / dailyQuestions.length) * 100)}%)
          </p>

          <div style={{
            display: 'inline-flex', gap: '1rem', background: '#18181b', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '1rem 2rem', marginBottom: '2rem', direction: 'ltr'
          }}>
            <div>
              <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem' }}>Badge Earned</span>
              <strong style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
                {score >= 8 ? '🏅 Scholar' : score >= 5 ? '⭐ Explorer' : '🌱 Seeker'}
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
                padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                fontWeight: '700', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.95rem'
              }}
            >
              <i className="fas fa-check"></i> Finish for Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
