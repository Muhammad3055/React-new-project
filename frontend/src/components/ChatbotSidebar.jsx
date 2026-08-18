import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Mic,
  MicOff,
  Paperclip,
  FileText,
  AlertCircle,
  Volume2,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { getApiUrl } from '../utils/apiCache';

const QUICK_PROMPTS = [
  { icon: '🤲', label: 'Virtues of Patience', prompt: 'What does Islam say about patience (Sabr)?' },
  { icon: '🕌', label: 'Salah Guide', prompt: 'How do I perform Fajr prayer step-by-step?' },
  { icon: '📖', label: 'Al-Fatiha Tafsir', prompt: 'What is the Tafsir and meaning of Surah Al-Fatiha?' },
  { icon: '🕋', label: 'Hajj & Umrah', prompt: 'Explain the step by step guide to perform Hajj and Umrah' },
];

const LANGUAGES = [
  { code: 'auto', label: '🌐 Auto Detect' },
  { code: 'ur', label: '🇵🇰 Urdu (اردو)' },
  { code: 'ar', label: '🇸🇦 Arabic (العربية)' },
  { code: 'en', label: '🇬🇧 English' }
];

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB

function renderFormattedText(rawText) {
  if (!rawText) return null;
  const html = String(rawText)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#0066FF;text-decoration:underline;">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ChatbotSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('auto');
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentStep, setAgentStep] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // File upload state
  const [attachedFile, setAttachedFile] = useState(null); // { name, type, size, base64, preview }
  const [fileError, setFileError] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Voice recording logic
  const toggleVoiceRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    
    let recognitionLang = 'en-US';
    if (selectedLang !== 'auto') {
      recognitionLang = selectedLang;
    } else {
      recognitionLang = 'en-US';
    }
    rec.lang = recognitionLang;
    
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (event) => {
      setInputPrompt(event?.results?.[0]?.[0]?.transcript || '');
      setIsRecording(false);
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);
    
    recognitionRef.current = rec;
    rec.start();
  };

  // TTS Read Aloud
  const handleSpeak = (text, msgLang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = String(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (msgLang === 'ur' || msgLang === 'ur_roman' || msgLang === 'brh') {
        utterance.lang = 'ur-PK';
      } else if (msgLang === 'ar') {
        utterance.lang = 'ar-SA';
      } else {
        utterance.lang = 'en-US';
      }
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-Speech is not supported in your browser.');
    }
  };

  // File selection logic
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError('');

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setFileError('Only images (JPG, PNG, WebP) and PDF files are supported.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File too large. Max size is 30MB. Your file: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      const preview = file.type.startsWith('image/') ? base64 : null;
      setAttachedFile({ name: file.name, type: file.type, size: file.size, base64, preview });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeFile = () => {
    setAttachedFile(null);
    setFileError('');
  };

  // Send message handler
  const handleSend = async (customPrompt = null) => {
    const query = (customPrompt ?? inputPrompt).trim();
    if ((!query && !attachedFile) || isLoading) return;

    const displayText = query || (attachedFile ? `[Attached: ${attachedFile.name}]` : '');
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: displayText,
      file: attachedFile ? { name: attachedFile.name, type: attachedFile.type, preview: attachedFile.preview } : null
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    
    const fileToSend = attachedFile;
    setAttachedFile(null);
    setIsLoading(true);
    setAgentStep(fileToSend ? 'Reading file content...' : 'Analyzing intent...');

    if (!fileToSend) {
      setTimeout(() => setAgentStep('Searching Islamic knowledge base...'), 800);
      setTimeout(() => setAgentStep('Synthesizing authentic answer...'), 1600);
    }

    try {
      let data;
      if (fileToSend) {
        const apiUrl = getApiUrl('/api/ai-assistant/file/');
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            prompt: query || 'Please analyze this file. If it contains Hadith, verify its authenticity. If it contains Arabic text, translate it. Summarize the content.',
            language: selectedLang === 'auto' ? '' : selectedLang,
            file_data: fileToSend.base64,
            file_name: fileToSend.name,
            file_type: fileToSend.type,
          })
        });
        if (!response.ok) throw new Error('AI file request failed');
        data = await response.json();
      } else {
        const apiUrl = getApiUrl('/api/ai-assistant/');
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ prompt: query, language: selectedLang === 'auto' ? '' : selectedLang })
        });
        if (!response.ok) throw new Error('AI request failed');
        data = await response.json();
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.answer || 'I apologize, I could not process your request.',
        intent: data.intent,
        language: data.language,
        quran: data.quran || [],
        hadith: data.hadith || [],
        tafseer: data.tafseer || [],
        books: data.books || [],
        actions: data.actions || [],
        suggested: data.suggested_questions || [],
        file_analysis: data.file_analysis || null,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: 'Network connection issue.' }]);
    } finally {
      setIsLoading(false);
      setAgentStep('');
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([]);
    setAttachedFile(null);
    setFileError('');
  };

  return (
    <>
      {/* ── Left tab handle button (always visible) ── */}
      <div style={{
        position: 'fixed',
        left: isOpen ? '360px' : 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 99990,
        transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <button
          onClick={() => setIsOpen(o => !o)}
          title={isOpen ? 'Close AI Assistant' : 'Open AI Islamic Assistant'}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '6px', width: '36px', minHeight: '110px', padding: '14px 0',
            background: 'linear-gradient(180deg, #0066FF 0%, #1e40af 100%)',
            border: 'none', borderRadius: '0 14px 14px 0', color: '#fff',
            cursor: 'pointer', boxShadow: '4px 0 20px rgba(0, 102, 255, 0.35)',
            transition: 'all 0.3s ease',
          }}
        >
          <Bot size={18} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', userSelect: 'none' }}>
            AI Chat
          </span>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b', flexShrink: 0 }} />
          {isOpen ? <ChevronLeft size={13} style={{ flexShrink: 0 }} /> : <ChevronRight size={13} style={{ flexShrink: 0 }} />}
        </button>
      </div>

      {/* ── Mobile/tablet screen backdrop overlay ── */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99988, backdropFilter: 'blur(1px)' }} />
      )}

      {/* ── Left Sliding Sidebar Panel (Styled exactly like the clean modal design) ── */}
      <aside style={{
        position: 'fixed', top: 0, left: isOpen ? 0 : '-360px', width: '360px', height: '100vh',
        zIndex: 99989, display: 'flex', flexDirection: 'column',
        background: '#ffffff',
        borderRight: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: isOpen ? '8px 0 32px rgba(0,0,0,0.1)' : 'none',
        transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif'
      }}>

        {/* Header */}
        <div style={{ padding: '16px', background: '#ffffff', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/favicon.svg" alt="Maktaba AI Logo" style={{ width: '36px', height: '36px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(245,158,11,0.4)', flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111827' }}>Maktaba tul Muslim AI</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#059669' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                Online
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {/* Language Selector */}
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              style={{
                background: '#f1f5f9', border: 'none', color: '#64748b', fontSize: '11px',
                fontWeight: 600, borderRadius: '8px', padding: '4px 6px', cursor: 'pointer', outline: 'none'
              }}
            >
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            {messages.length > 0 && (
              <button onClick={handleClear} title="Clear chat" style={{ background: '#f1f5f9', border: 'none', color: '#64748b', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={13} />
              </button>
            )}
            <button onClick={() => setIsOpen(false)} title="Close" style={{ background: '#f1f5f9', border: 'none', color: '#64748b', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div style={{ width: '64px', height: '64px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Bot size={32} color="#0066FF" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>How can I help you?</h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Ask me about Quran, Hadith, or Islamic books.</p>
              
              {/* Quick Prompts List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                {QUICK_PROMPTS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q.prompt)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', background: '#ffffff', border: '1px solid #e2e8f0',
                      borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s', color: '#334155', fontSize: '13px', fontWeight: 500
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#0066FF'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{q.icon}</span> {q.label}
                    </span>
                    <ChevronRight size={14} color="#94a3b8" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '12px 16px', fontSize: '14px', lineHeight: '1.5',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.sender === 'user' ? '#0066FF' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: msg.sender === 'ai' ? '1px solid #f1f5f9' : 'none'
                }}>
                  {/* Attached File Preview inside bubble */}
                  {msg.file && (
                    <div style={{ marginBottom: '8px', padding: '6px', borderRadius: '8px', background: msg.sender === 'user' ? 'rgba(0,0,0,0.15)' : '#f8fafc', border: '1px solid rgba(0,0,0,0.05)' }}>
                      {msg.file.preview ? (
                        <img src={msg.file.preview} alt={msg.file.name} style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '6px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: msg.sender === 'user' ? '#ffffff' : '#64748b' }}>
                          <FileText size={16} />
                          {msg.file.name}
                        </div>
                      )}
                    </div>
                  )}

                  {msg.sender === 'ai' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '8px', color: '#0066FF', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} /> AI Agent
                      </span>
                      <button
                        onClick={() => handleSpeak(msg.text, msg.language || selectedLang)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'inline-flex', padding: '4px', borderRadius: '4px', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#0066FF'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                        title="Read response aloud"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                  )}

                  {renderFormattedText(msg.text)}

                  {/* File analysis success tag */}
                  {msg.file_analysis && (
                    <div style={{ marginTop: '8px', padding: '6px 10px', borderRadius: '6px', background: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                      📄 {msg.file_analysis}
                    </div>
                  )}

                  {/* Quran references */}
                  {msg.quran && msg.quran.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.quran.map((q, i) => (
                        <div key={i} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Quran {q.surah_name} {q.surah_number}:{q.ayah_number}</div>
                          <div style={{ fontSize: '17px', textAlign: 'right', marginBottom: '6px', fontFamily: '"Scheherazade New", serif' }}>{q.text || q.arabic_text}</div>
                          {q.translation && <div style={{ fontSize: '12px', color: '#334155' }}>{q.translation}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hadith references */}
                  {msg.hadith && msg.hadith.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.hadith.map((h, i) => (
                        <div key={i} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>{h.book_name} #{h.hadith_number} ({h.grade})</div>
                          <div style={{ fontSize: '12px', color: '#334155' }}>{h.translation}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Book recommendations */}
                  {msg.books && msg.books.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Recommended Books</div>
                      {msg.books.map((b, i) => (
                        <div key={i} style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                          <div style={{ width: '32px', height: '46px', background: '#e2e8f0', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={16} color="#94a3b8" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>By {b.author}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Copy message button */}
                  {msg.sender === 'ai' && (
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleCopy(msg.id, msg.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === msg.id ? '#34d399' : '#64748b', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>
                        {copiedId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                        {copiedId === msg.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested Questions */}
                {msg.suggested && msg.suggested.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px', justifyContent: 'flex-start' }}>
                    {msg.suggested.map((sq, i) => (
                      <button key={i} onClick={() => handleSend(sq)} style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer' }}>
                        {sq}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading status */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ padding: '12px 16px', background: '#ffffff', borderRadius: '16px 16px 16px 4px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0066FF', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0066FF', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0066FF', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>{agentStep}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File attachment preview strip */}
        {attachedFile && (
          <div style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {attachedFile.preview ? (
              <img src={attachedFile.preview} alt="preview" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="#0066FF" />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attachedFile.name}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{(attachedFile.size / (1024*1024)).toFixed(1)}MB</div>
            </div>
            <button onClick={removeFile} style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#ef4444', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={12} />
            </button>
          </div>
        )}

        {/* File error banner */}
        {fileError && (
          <div style={{ padding: '6px 16px', background: '#fef2f2', borderTop: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <AlertCircle size={12} color="#ef4444" />
            <span style={{ fontSize: '11px', color: '#ef4444' }}>{fileError}</span>
          </div>
        )}

        {/* Input Area */}
        <div style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 16px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <button onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: attachedFile ? '#0066FF' : '#94a3b8', cursor: 'pointer', display: 'flex', padding: '4px' }} title="Attach image or PDF (max 30MB)">
              <Paperclip size={20} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" style={{ display: 'none' }} onChange={handleFileSelect} />

            <button onClick={toggleVoiceRecording} style={{ background: 'none', border: 'none', color: isRecording ? '#ef4444' : '#94a3b8', cursor: 'pointer', display: 'flex' }}>
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder={attachedFile ? "Ask about this file..." : "Type your message..."}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#334155' }}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={(!inputPrompt.trim() && !attachedFile) || isLoading}
              style={{
                background: (inputPrompt.trim() || attachedFile) ? '#0066FF' : '#e2e8f0', color: '#fff',
                border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (inputPrompt.trim() || attachedFile) ? 'pointer' : 'default',
                transition: 'background 0.2s'
              }}
            >
              <Send size={14} style={{ marginLeft: '2px' }} />
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <ShieldCheck size={12} /> Powered by Maktaba tul Muslim AI Agent
          </div>
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}} />
    </>
  );
}
