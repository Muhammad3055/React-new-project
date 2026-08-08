import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Volume2, Copy, Check, User, RefreshCw, Sparkles, BookOpen, Mic, MicOff, ShieldCheck } from 'lucide-react';

const LANGUAGES = [
  { code: 'auto', label: '🌐 Auto Detect' },
  { code: 'ur', label: '🇵🇰 Urdu (اردو)' },
  { code: 'ar', label: '🇸🇦 Arabic (العربية)' },
  { code: 'brh', label: '🇵🇰 Brahui (براہوئی)' },
  { code: 'ps', label: '🇦ف Pashto (پښتو)' },
  { code: 'fa', label: '🇮🇷 Persian (فارسی)' },
  { code: 'bn', label: '🇧🇩 Bengali (বাংলা)' },
  { code: 'tr', label: '🇹🇷 Turkish (Türkçe)' },
  { code: 'fr', label: '🇫🇷 French (Français)' },
  { code: 'id', label: '🇮🇩 Indonesian (Bahasa)' },
  { code: 'es', label: '🇪🇸 Spanish (Español)' },
  { code: 'de', label: '🇩🇪 German (Deutsch)' },
  { code: 'en', label: '🇬🇧 English' }
];

const QUICK_PROMPTS = [
  { icon: '🤲', label: 'Virtues of Patience (Sabr)', prompt: 'What does Islam say about patience (Sabr)?' },
  { icon: '👑', label: 'Story of Prophet Ibrahim (AS)', prompt: 'Tell me about Prophet Ibrahim (AS) in the Quran' },
  { icon: '🕌', label: 'Step-by-Step Salah Guide', prompt: 'How do I perform Fajr prayer step-by-step?' },
  { icon: '📖', label: 'Surah Al-Fatiha Tafsir', prompt: 'What is the Tafsir and meaning of Surah Al-Fatiha?' },
  { icon: '🕋', label: 'Steps of Hajj & Umrah', prompt: 'Explain the step by step guide to perform Hajj and Umrah' },
  { icon: '💰', label: 'Zakat & Nisab Calculation', prompt: 'What is the Nisab threshold and percentage for Zakat calculation?' },
  { icon: '🌙', label: 'Fasting & Laylatul Qadr', prompt: 'What are the rules of Sawm (Fasting) in Ramadan and virtues of Laylatul Qadr?' },
  { icon: '✨', label: '99 Names of Allah', prompt: 'Tell me about the 99 Names of Allah and Tawheed' }
];

const AGENT_THINKING_STEPS = [
  "Searching local website database...",
  "Checking external verified APIs...",
  "Synthesizing authentic knowledge..."
];

export default function AIChatbotModal({ isOpen, onClose }) {
  const [selectedLang, setSelectedLang] = useState('auto');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Assalamu Alaikum! 🌙 Welcome to **Maktaba AI Islamic Knowledge Agent**.\n\nPowered by a 3-Tier Knowledge Engine:\n1. **Website Database** (Local Quran, Hadith & Books)\n2. **External Verified APIs** (Al-Quran Cloud)\n3. **Educational Knowledge Engine** (Strict Anti-Hallucination)\n\nAsk me anything regarding Quranic verses, Sahih Hadith, Seerah, Namaz guides, or Tafseer in 10+ languages!",
      references: "[Quran 20:114], [Sahih Bukhari]",
      tierBadge: "Level 1 — Website Database",
      suggested: [
        "What does Islam say about patience?",
        "Tell me about Prophet Ibrahim (AS)",
        "How do I perform Fajr prayer step-by-step?"
      ],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentStep, setAgentStep] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, agentStep, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser. Please type your message.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;

    const langLocales = { ur: 'ur-PK', ar: 'ar-SA', ps: 'ps-AF', fa: 'fa-IR', bn: 'bn-BD', tr: 'tr-TR', fr: 'fr-FR', es: 'es-ES', de: 'de-DE', en: 'en-US' };
    rec.lang = langLocales[selectedLang] || 'en-US';

    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e) => {
      setInputPrompt(e.results[0][0].transcript);
      setIsRecording(false);
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);

    recognitionRef.current = rec;
    rec.start();
  };

  const handleSend = async (customPrompt = null) => {
    const query = (customPrompt || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsLoading(true);
    setAgentStep(0);

    const stepInterval = setInterval(() => {
      setAgentStep(prev => {
        if (prev < AGENT_THINKING_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 350);

    try {
      const response = await fetch('/api/ai-assistant/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, language: selectedLang })
      });

      const data = await response.json();
      clearInterval(stepInterval);

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.answer || "I apologize, I could not process your request right now.",
        references: data.references || "",
        tierBadge: data.tier_badge || "Level 3 — Educational Synthesis",
        language: data.language || 'en',
        suggested: data.suggested_questions || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      clearInterval(stepInterval);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Assalamu Alaikum. Network connection issue to Maktaba Knowledge Engine.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text, langCode = 'en') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const locales = { ur: 'ur-PK', ar: 'ar-SA', fr: 'fr-FR', es: 'es-ES', de: 'de-DE', tr: 'tr-TR' };
      utterance.lang = locales[langCode] || 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    let html = rawText;
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color: #34d399; font-weight: 700; text-decoration: underline;">$1</a>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: var(--accent-gold);">$1</strong>');
    html = html.replace(/\n/g, '<br/>');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '85px',
        right: '25px',
        width: 'min(430px, calc(100vw - 30px))',
        height: 'min(620px, calc(100vh - 110px))',
        zIndex: 999999,
        background: 'linear-gradient(135deg, #022c22 0%, #0f172a 100%)',
        color: '#ffffff',
        border: '2px solid var(--accent-gold)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 25px rgba(16, 185, 129, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* Header */}
      <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(2, 44, 34, 0.95)', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', border: '1.5px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={22} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Maktaba AI Agent
              <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1px 6px', borderRadius: '10px' }}>Hybrid AI</span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1' }}>Website DB + Verified APIs + Gemini</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            style={{ padding: '3px 8px', borderRadius: '12px', background: '#064e3b', color: '#fcd34d', border: '1px solid var(--accent-gold)', fontSize: '0.72rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>

          <button 
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(0, 0, 0, 0.35)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', overflowX: 'auto', display: 'flex', gap: '0.4rem', whiteSpace: 'nowrap' }}>
        {QUICK_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.prompt)}
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              background: 'rgba(5, 150, 105, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '0.73rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
        {messages.map((msg) => {
          const isRtl = msg.language === 'ur' || msg.language === 'ar' || msg.language === 'brh' || msg.language === 'ps' || msg.language === 'fa';
          return (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                direction: isRtl ? 'rtl' : 'ltr'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: msg.sender === 'user' ? '#059669' : '#022c22',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.sender === 'user' ? <User size={14} style={{ color: '#fff' }} /> : <Bot size={14} style={{ color: '#f59e0b' }} />}
              </div>

              <div style={{
                maxWidth: '85%',
                padding: '0.75rem 0.95rem',
                borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' : 'rgba(255, 255, 255, 0.07)',
                border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                lineHeight: '1.6',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                textAlign: isRtl ? 'right' : 'left'
              }}>
                {/* Level Tier Badge */}
                {msg.sender === 'ai' && msg.tierBadge && (
                  <div style={{ marginBottom: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', background: 'rgba(5, 150, 105, 0.25)', border: '1px solid rgba(16, 185, 129, 0.5)', color: '#34d399', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    <ShieldCheck size={11} />
                    <span>{msg.tierBadge}</span>
                  </div>
                )}

                <div style={{ fontSize: isRtl ? '0.9rem' : '0.83rem', fontFamily: isRtl ? "'Jameel Noori Nastaleeq', 'Amiri', serif" : 'inherit' }}>
                  {renderFormattedText(msg.text)}
                </div>

                {/* Citations & Sources */}
                {msg.references && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '0.72rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <BookOpen size={12} />
                    <span>Sources: {msg.references}</span>
                  </div>
                )}

                {/* Suggested Questions */}
                {msg.sender === 'ai' && msg.suggested && msg.suggested.length > 0 && (
                  <div style={{ marginTop: '0.65rem', paddingTop: '0.45rem', borderTop: '1px dashed rgba(255,255,255,0.15)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={10} style={{ color: 'var(--accent-gold)' }} />
                      <span>{isRtl ? 'مزید سوالات:' : 'Suggested Questions:'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {msg.suggested.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(sug)}
                          style={{
                            textAlign: isRtl ? 'right' : 'left',
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#fcd34d',
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          ❓ {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', opacity: 0.7 }}>
                  <span>{msg.time}</span>
                  {msg.sender === 'ai' && (
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => handleSpeak(msg.text, msg.language)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }} title="Listen Voice Audio">
                        <Volume2 size={12} />
                      </button>
                      <button onClick={() => handleCopy(msg.id, msg.text)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }} title="Copy">
                        {copiedId === msg.id ? <Check size={12} style={{ color: '#34d399' }} /> : <Copy size={12} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Step Progress Bar */}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.78rem', background: 'rgba(0,0,0,0.4)', padding: '0.65rem 0.85rem', borderRadius: '14px', border: '1px solid rgba(52, 211, 153, 0.4)', maxWidth: '300px' }}>
            <RefreshCw size={14} className="animate-spin text-emerald-400" />
            <span style={{ fontWeight: 600 }}>{AGENT_THINKING_STEPS[agentStep]}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ padding: '0.65rem 0.85rem', background: 'rgba(0, 0, 0, 0.5)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}
      >
        <button
          type="button"
          onClick={toggleVoiceRecording}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isRecording ? '#ef4444' : 'rgba(255,255,255,0.1)',
            border: isRecording ? '1.5px solid #ef4444' : '1px solid rgba(255,255,255,0.2)',
            color: isRecording ? '#fff' : '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title={isRecording ? 'Listening... Speak now' : 'Click to Speak (Voice Mic)'}
        >
          {isRecording ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
        </button>

        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={isRecording ? "Listening to your voice..." : "Ask in any language (English, Urdu, Arabic)..."}
          style={{ flex: 1, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '20px', padding: '0.5rem 0.85rem', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
            border: '1px solid var(--accent-gold)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            opacity: (isLoading || !inputPrompt.trim()) ? 0.5 : 1
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
