import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../utils/apiCache';

export default function DreamView() {
  const { lang, t } = useLanguage();
  const [dreamText, setDreamText] = useState('');
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [error, setError] = useState('');

  const handleInterpret = async () => {
    if (!dreamText.trim()) return;
    setLoading(true);
    setInterpretation('');
    setError('');

    try {
      const apiUrl = getApiUrl('/api/ai-assistant/');
      const prompt = `Act as an expert in Islamic dream interpretation, particularly drawing from classical works like Ibn Sirin. Analyze the following dream. Be highly respectful, add a disclaimer that only Allah knows the unseen and true meanings of dreams, and provide a wise, comforting, and Islamically grounded interpretation. 
      The dream is: "${dreamText}"`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt, language: lang })
      });

      if (!response.ok) throw new Error('Failed to get interpretation.');
      const data = await response.json();
      setInterpretation(data.answer || data.reply || 'No interpretation received.');
    } catch (err) {
      setError('Unable to reach the AI Dream Interpreter right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    return { __html: text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') };
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem', direction: lang === 'ur' || lang === 'ar' || lang === 'br' ? 'rtl' : 'ltr' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        borderRadius: '20px', padding: '2.5rem 1.5rem', textAlign: 'center', marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(245,158,11,0.05)', borderRadius: '50%' }}></div>
        
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <i className="fas fa-moon"></i> Islamic Dream Interpreter
        </h1>
        <p style={{ margin: 0, color: '#e0e7ff', fontSize: '1.05rem', maxWidth: '600px', marginInline: 'auto' }}>
          Share your dream, and our AI—guided by classical texts like Ibn Sirin—will offer a spiritually grounded interpretation.
        </p>
      </div>

      <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontWeight: 700 }}>
            Describe your dream in detail:
          </label>
          <textarea 
            rows="5" 
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="E.g., I saw myself walking in a beautiful green garden reciting the Quran..."
            style={{
              width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(99,102,241,0.3)', color: '#fff', fontSize: '1rem',
              outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          ></textarea>
        </div>

        <button 
          onClick={handleInterpret} 
          disabled={loading || !dreamText.trim()}
          style={{
            width: '100%', padding: '1rem', background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#fff', fontSize: '1.1rem', fontWeight: 800, border: 'none', borderRadius: '12px',
            cursor: loading || !dreamText.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)', opacity: loading || !dreamText.trim() ? 0.7 : 1
          }}
        >
          {loading ? <span><i className="fas fa-spinner fa-spin"></i> Interpreting...</span> : <span><i className="fas fa-magic"></i> Reveal Interpretation</span>}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#ef4444', textAlign: 'center', fontWeight: 700 }}>
          {error}
        </div>
      )}

      {interpretation && (
        <div style={{ marginTop: '2rem', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-15px', right: '2rem', background: '#f59e0b', color: '#022c22', padding: '4px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem' }}>
            AI Interpretation
          </div>
          <h3 style={{ marginTop: 0, color: '#fbbf24', fontSize: '1.4rem', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
            Meaning & Guidance
          </h3>
          <div style={{ color: '#f8fafc', fontSize: '1.05rem', lineHeight: '1.8' }} dangerouslySetInnerHTML={formatText(interpretation)}></div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <i className="fas fa-info-circle" style={{ marginTop: '3px' }}></i>
            <p style={{ margin: 0 }}><strong>Disclaimer:</strong> True knowledge of dreams lies only with Allah (SWT). This interpretation is generated by AI based on historical Islamic texts and should not be taken as absolute fatwa or certainty.</p>
          </div>
        </div>
      )}
    </div>
  );
}
