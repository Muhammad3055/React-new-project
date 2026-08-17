import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, ChevronLeft, ChevronRight, Sparkles, RefreshCw, Copy, Check, Mic, MicOff, Paperclip, FileText, Image, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../utils/apiCache';

const QUICK_PROMPTS = [
  { icon: '📖', label: 'Surah Al-Fatiha', prompt: 'What is the Tafsir and meaning of Surah Al-Fatiha?' },
  { icon: '🤲', label: 'Virtues of Sabr', prompt: 'What does Islam say about patience (Sabr)?' },
  { icon: '🕌', label: 'How to pray Fajr', prompt: 'How do I perform Fajr prayer step by step?' },
  { icon: '🌙', label: 'Ramadan virtues', prompt: 'What are the special virtues and acts in Ramadan?' },
  { icon: '🕋', label: 'Hajj guide', prompt: 'Explain the step by step guide to perform Hajj.' },
  { icon: '☪️', label: 'Halal & Haram', prompt: 'What does Islam say about halal earning and riba (interest)?' },
];

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB

function renderText(rawText) {
  if (!rawText) return null;
  const html = String(rawText)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#059669;text-decoration:underline;">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ChatbotSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentStep, setAgentStep] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [lang, setLang] = useState('auto');

  // File upload state
  const [attachedFile, setAttachedFile] = useState(null); // { name, type, size, base64, preview }
  const [fileError, setFileError] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // ── File handling ──
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
      const base64 = ev.target.result; // full data URL: "data:image/png;base64,..."
      const preview = file.type.startsWith('image/') ? base64 : null;
      setAttachedFile({ name: file.name, type: file.type, size: file.size, base64, preview });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeFile = () => { setAttachedFile(null); setFileError(''); };

  // ── Send message (with or without file) ──
  const handleSend = async (overridePrompt = null) => {
    const query = (overridePrompt ?? inputText).trim();
    if ((!query && !attachedFile) || isLoading) return;

    const displayText = query || (attachedFile ? `[Attached: ${attachedFile.name}]` : '');
    const userMsg = {
      id: Date.now(), sender: 'user', text: displayText,
      file: attachedFile ? { name: attachedFile.name, type: attachedFile.type, preview: attachedFile.preview } : null
    };
    setMessages(prev => [...prev, userMsg]);
    if (!overridePrompt) setInputText('');

    const fileToSend = attachedFile;
    setAttachedFile(null);
    setIsLoading(true);
    setAgentStep('Analyzing your request…');
    setTimeout(() => setAgentStep(fileToSend ? 'Reading file content…' : 'Searching Islamic knowledge base…'), 900);
    setTimeout(() => setAgentStep('Synthesizing answer…'), 1800);

    try {
      let data;
      if (fileToSend) {
        // File upload — use multipart form or base64 JSON endpoint
        const res = await fetch(getApiUrl('/api/ai-assistant/file/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            prompt: query || 'Please analyze this file. If it contains Hadith, verify its authenticity. If it contains Arabic text, translate it. Summarize the content.',
            language: lang === 'auto' ? '' : lang,
            file_data: fileToSend.base64,
            file_name: fileToSend.name,
            file_type: fileToSend.type,
          })
        });
        if (!res.ok) throw new Error('file analysis failed');
        data = await res.json();
      } else {
        // Regular text query
        const res = await fetch(getApiUrl('/api/ai-assistant/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ prompt: query, language: lang === 'auto' ? '' : lang })
        });
        if (!res.ok) throw new Error('failed');
        data = await res.json();
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'ai',
        text: data.answer || 'I could not process this request.',
        language: data.language,
        quran: data.quran || [],
        hadith: data.hadith || [],
        suggested: data.suggested_questions || [],
        file_analysis: data.file_analysis || null,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'ai',
        text: '⚠️ Network error. Please check your connection and try again.'
      }]);
    } finally {
      setIsLoading(false);
      setAgentStep('');
    }
  };

  // ── Voice input ──
  const toggleVoice = () => {
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported.'); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.lang = lang === 'ur' ? 'ur-PK' : lang === 'ar' ? 'ar-SA' : 'en-US';
    rec.onstart = () => setIsRecording(true);
    rec.onresult = e => { setInputText(e?.results?.[0]?.[0]?.transcript || ''); setIsRecording(false); };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => { setMessages([]); setAttachedFile(null); setFileError(''); };

  const formatFileSize = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)}KB` : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

  return (
    <>
      {/* ── Tab handle (left edge) ── */}
      <div style={{
        position: 'fixed',
        left: isOpen ? '360px' : 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 99990,
        transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <button
          onClick={() => setIsOpen(o => !o)}
          title={isOpen ? 'Close AI Assistant' : 'Open AI Islamic Assistant'}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '5px', width: '36px', minHeight: '110px', padding: '14px 0',
            background: 'linear-gradient(180deg, #059669 0%, #0d9488 100%)',
            border: 'none', borderRadius: '0 14px 14px 0', color: '#fff',
            cursor: 'pointer', boxShadow: '4px 0 20px rgba(5,150,105,0.45)',
            transition: 'all 0.3s ease',
          }}
        >
          <Bot size={17} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', userSelect: 'none' }}>
            AI Chat
          </span>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b', flexShrink: 0 }} />
          {isOpen ? <ChevronLeft size={13} style={{ flexShrink: 0 }} /> : <ChevronRight size={13} style={{ flexShrink: 0 }} />}
        </button>
      </div>

      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 99988, backdropFilter: 'blur(2px)' }} />
      )}

      {/* ── Sidebar panel ── */}
      <aside style={{
        position: 'fixed', top: 0, left: isOpen ? 0 : '-360px', width: '360px', height: '100vh',
        zIndex: 99989, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(160deg, #0a1a12 0%, #0f172a 100%)',
        borderRight: '2px solid rgba(5,150,105,0.5)',
        boxShadow: isOpen ? '8px 0 40px rgba(0,0,0,0.7)' : 'none',
        transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{ padding: '0.9rem 1.1rem', background: 'linear-gradient(90deg, rgba(5,150,105,0.3), rgba(13,148,136,0.2))', borderBottom: '1px solid rgba(5,150,105,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #059669, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(5,150,105,0.4)' }}>
              <Bot size={19} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f1f5f9' }}>Islamic AI Assistant</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: '#34d399' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                Live · Groq + Gemini Vision
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', fontSize: '0.7rem', fontWeight: 700, borderRadius: '8px', padding: '3px 5px', cursor: 'pointer', outline: 'none' }} title="Chat language">
              <option value="auto">🌐 Auto</option>
              <option value="en">🇬🇧 EN</option>
              <option value="ur">🇵🇰 UR</option>
              <option value="ar">🇸🇦 AR</option>
            </select>
            {messages.length > 0 && (
              <button onClick={handleClear} title="Clear chat" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', width: '26px', height: '26px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={12} />
              </button>
            )}
            <button onClick={() => setIsOpen(false)} title="Close" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', width: '26px', height: '26px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '0.75rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 0.85rem', background: 'linear-gradient(135deg, rgba(5,150,105,0.3), rgba(13,148,136,0.2))', border: '2px solid rgba(5,150,105,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={24} color="#34d399" />
              </div>
              <h3 style={{ margin: '0 0 0.3rem', fontSize: '0.97rem', fontWeight: 800, color: '#f1f5f9' }}>As-salamu alaykum! 🌙</h3>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                Ask about Quran, Hadith, Islamic rulings, or upload a file to translate, check, or verify Hadith authenticity.
              </p>
              {/* Upload hint */}
              <div style={{ margin: '0 0 1rem', padding: '0.6rem 0.85rem', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px dashed rgba(245,158,11,0.3)', fontSize: '0.75rem', color: '#fcd34d', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Paperclip size={13} />
                <span>Upload PDF/Image (up to 30MB) to translate, check content, or verify Hadith</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', textAlign: 'left' }}>
                {QUICK_PROMPTS.map((q, i) => (
                  <button key={i} onClick={() => handleSend(q.prompt)} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.55rem 0.8rem', borderRadius: '11px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, textAlign: 'left', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(5,150,105,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                    <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{q.icon}</span>
                    <span>{q.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: '0.55rem' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, background: msg.sender === 'user' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #059669, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                  {msg.sender === 'user' ? '👤' : <Bot size={13} color="#fff" />}
                </div>
                <div style={{ maxWidth: '84%', padding: '0.65rem 0.85rem', borderRadius: msg.sender === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', background: msg.sender === 'user' ? 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.2))' : 'rgba(255,255,255,0.06)', border: `1px solid ${msg.sender === 'user' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`, fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.65, wordBreak: 'break-word' }}>
                  {/* File attachment preview */}
                  {msg.file && (
                    <div style={{ marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '10px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {msg.file.preview ? (
                        <img src={msg.file.preview} alt={msg.file.name} style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                          <FileText size={14} color="#f59e0b" />
                          {msg.file.name}
                        </div>
                      )}
                    </div>
                  )}
                  {renderText(msg.text)}

                  {/* File analysis result badge */}
                  {msg.file_analysis && (
                    <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.65rem', borderRadius: '8px', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)', fontSize: '0.72rem', color: '#34d399' }}>
                      📄 {msg.file_analysis}
                    </div>
                  )}

                  {msg.quran && msg.quran.length > 0 && (
                    <div style={{ marginTop: '0.5rem', padding: '0.45rem 0.65rem', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      {msg.quran.map((q, qi) => <div key={qi} style={{ fontSize: '0.73rem', color: '#fcd34d', fontWeight: 600 }}>📖 {q.surah} {q.ayah && `(${q.ayah})`}</div>)}
                    </div>
                  )}

                  {msg.hadith && msg.hadith.length > 0 && (
                    <div style={{ marginTop: '0.45rem' }}>
                      {msg.hadith.map((h, hi) => <div key={hi} style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 600 }}>📚 {h.book} #{h.number}</div>)}
                    </div>
                  )}

                  {msg.suggested && msg.suggested.length > 0 && (
                    <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {msg.suggested.slice(0, 2).map((sq, si) => (
                        <button key={si} onClick={() => handleSend(sq)} style={{ fontSize: '0.71rem', padding: '0.3rem 0.6rem', borderRadius: '8px', background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.3)', color: '#34d399', cursor: 'pointer', textAlign: 'left' }}>
                          ↗ {sq}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.sender === 'ai' && (
                    <div style={{ marginTop: '0.45rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleCopy(msg.id, msg.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === msg.id ? '#34d399' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '6px' }} title="Copy">
                        {copiedId === msg.id ? <Check size={10} /> : <Copy size={10} />}
                        {copiedId === msg.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Loading */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #059669, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={13} color="#fff" />
              </div>
              <div style={{ padding: '0.65rem 0.85rem', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: '0.28rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', animation: `chatDot 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
                </div>
                {agentStep && <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>{agentStep}</p>}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File attachment preview strip */}
        {attachedFile && (
          <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            {attachedFile.preview
              ? <img src={attachedFile.preview} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
              : <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FileText size={18} color="#f59e0b" /></div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attachedFile.name}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{formatFileSize(attachedFile.size)}</div>
            </div>
            <button onClick={removeFile} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <X size={12} />
            </button>
          </div>
        )}

        {/* File error */}
        {fileError && (
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', borderTop: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <AlertCircle size={13} color="#f87171" />
            <span style={{ fontSize: '0.72rem', color: '#f87171' }}>{fileError}</span>
          </div>
        )}

        {/* Input area */}
        <div style={{ padding: '0.75rem 0.9rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(5,150,105,0.4)', borderRadius: '16px', padding: '0.45rem 0.6rem' }}>
            {/* File upload button */}
            <button onClick={() => fileInputRef.current?.click()} title="Attach image or PDF (max 30MB)" style={{ background: attachedFile ? 'rgba(245,158,11,0.2)' : 'none', border: 'none', cursor: 'pointer', color: attachedFile ? '#f59e0b' : '#64748b', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              <Paperclip size={15} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" style={{ display: 'none' }} onChange={handleFileSelect} />

            <textarea
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={attachedFile ? 'Add a question about this file… (or just send)' : 'Ask about Quran, Hadith, duas…'}
              rows={1}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '0.83rem', resize: 'none', lineHeight: 1.5, maxHeight: '90px', overflowY: 'auto', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
              <button onClick={toggleVoice} title={isRecording ? 'Stop' : 'Voice input'} style={{ width: '30px', height: '30px', borderRadius: '9px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isRecording ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)', color: isRecording ? '#f87171' : '#94a3b8', transition: 'all 0.2s' }}>
                {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
              <button onClick={() => handleSend()} disabled={(!inputText.trim() && !attachedFile) || isLoading} title="Send (Enter)" style={{ width: '30px', height: '30px', borderRadius: '9px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (inputText.trim() || attachedFile) && !isLoading ? 'linear-gradient(135deg, #059669, #0d9488)' : 'rgba(255,255,255,0.05)', color: (inputText.trim() || attachedFile) && !isLoading ? '#fff' : '#4b5563', transition: 'all 0.2s' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
          <p style={{ margin: '0.35rem 0 0', textAlign: 'center', fontSize: '0.65rem', color: '#475569' }}>
            📎 PDF/Image ≤30MB · Translate · Verify Hadith · ⚡ Groq · Gemini · GPT-4
          </p>
        </div>
      </aside>

      <style>{`
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
