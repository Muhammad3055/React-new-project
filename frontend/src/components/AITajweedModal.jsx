import React, { useState } from 'react';
import { Sparkles, X, Check, Mic, Volume2 } from 'lucide-react';

const TAJWEED_RULES = [
  {
    name: 'Ghunnah (غنة)',
    description: 'Nasal sound made when pronouncing Noon (ن) or Meem (م) with Tashdeed (ّ). Held for 2 beats.',
    exampleArabic: 'إِنَّ ٱلَّذِينَ آمَنُوا',
    exampleTrans: 'Inna alladhina amanu'
  },
  {
    name: 'Qalqalah (قلقلة)',
    description: 'Echoing or bouncing sound produced when one of the Qalqalah letters (ق, ط, ب, ج, د) has Sukoon.',
    exampleArabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    exampleTrans: 'Qul huwa Allahu Ahad'
  },
  {
    name: 'Madd Asli (مد اصلي)',
    description: 'Natural prolongation of Alif, Ya, or Waw for 2 counts.',
    exampleArabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    exampleTrans: 'Ar-Rahman Ar-Rahim'
  },
  {
    name: 'Ikhfa (إخفاء)',
    description: 'Concealing the sound of Noon Sakinah or Tanween when followed by one of the 15 Ikhfa letters.',
    exampleArabic: 'مِن قَبْلِكَ',
    exampleTrans: 'Min Qablik'
  }
];

export default function AITajweedModal({ isOpen, onClose }) {
  const [activeRule, setActiveRule] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleSimulateCheck = () => {
    setIsRecording(true);
    setFeedback(null);
    setTimeout(() => {
      setIsRecording(false);
      setFeedback({
        score: '96%',
        comment: 'Ma Sha Allah! Excellent pronunciation of Ghunnah (2 beats duration matched).',
        accuracy: 'High Precision'
      });
    }, 2000);
  };

  const rule = TAJWEED_RULES[activeRule];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #022c22 0%, #0f172a 100%)',
          border: '2px solid var(--accent-gold)',
          borderRadius: '24px',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(2, 44, 34, 0.95)', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>AI Tajweed Pronunciation Guide</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>Interactive Tajweed Rules & Voice Checker</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Rule Selection Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
            {TAJWEED_RULES.map((r, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveRule(idx); setFeedback(null); }}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '14px',
                  background: activeRule === idx ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' : 'rgba(255, 255, 255, 0.05)',
                  border: activeRule === idx ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* Active Rule Explanation Card */}
          <div style={{ padding: '1.25rem', borderRadius: '18px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rule Explanation</div>
            <h4 style={{ margin: 0, fontSize: '1.3rem', color: '#ffffff', fontWeight: 800 }}>{rule.name}</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>{rule.description}</p>
            
            <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginBottom: '0.35rem' }}>Example Ayah Text</div>
              <div style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', fontWeight: 700, fontFamily: "'Amiri', 'Traditional Arabic', serif", margin: '0.35rem 0' }}>{rule.exampleArabic}</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>"{rule.exampleTrans}"</div>
            </div>
          </div>

          {/* AI Voice Check Simulation Box */}
          <div style={{ padding: '1.25rem', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2) 0%, rgba(13, 148, 136, 0.15) 100%)', border: '1px solid var(--accent-gold)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-gold)' }}>🎤 AI Pronunciation Voice Check</div>
            <p style={{ fontSize: '0.82rem', color: '#e2e8f0', margin: 0 }}>Click below to simulate reading this Ayah and check your Tajweed accuracy:</p>
            
            <button
              onClick={handleSimulateCheck}
              disabled={isRecording}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '30px',
                background: isRecording ? '#ef4444' : 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                color: '#fff',
                border: '1.5px solid var(--accent-gold)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)'
              }}
            >
              <Mic size={18} />
              {isRecording ? 'Listening to Recitation...' : 'Start Voice Verification'}
            </button>

            {feedback && (
              <div style={{ padding: '0.85rem 1.1rem', borderRadius: '14px', background: 'rgba(0,0,0,0.5)', border: '1px solid #34d399', width: '100%', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 800, fontSize: '0.95rem' }}>
                  <Check size={18} /> Score: {feedback.score} ({feedback.accuracy})
                </div>
                <div style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: '0.35rem' }}>{feedback.comment}</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
