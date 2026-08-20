import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  X,
  Volume2,
  Copy,
  Check,
  User,
  RefreshCw,
  Sparkles,
  BookOpen,
  Mic,
  MicOff,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Paperclip,
  FileText,
  Image,
  AlertCircle
} from 'lucide-react';

import { getApiUrl } from '../utils/apiCache';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'auto', label: '🌐 Auto Detect' },
  { code: 'ur', label: '🇵🇰 Urdu (اردو)' },
  { code: 'ar', label: '🇸🇦 Arabic (العربية)' },
  { code: 'en', label: '🇬🇧 English' }
];

const QUICK_PROMPTS = [
  { icon: '🤲', label: 'Virtues of Patience', prompt: 'What does Islam say about patience (Sabr)?' },
  { icon: '🕌', label: 'Salah Guide', prompt: 'How do I perform Fajr prayer step-by-step?' },
  { icon: '📖', label: 'Al-Fatiha Tafsir', prompt: 'What is the Tafsir and meaning of Surah Al-Fatiha?' },
  { icon: '🕋', label: 'Hajj & Umrah', prompt: 'Explain the step by step guide to perform Hajj and Umrah' },
];

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB


export default function AIChatbotModal({ isOpen, onClose }) {
  const { lang: siteLang } = useLanguage();
  const [selectedLang, setSelectedLang] = useState('auto');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('quran_portal_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
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

  // Automatically persist messages
  useEffect(() => {
    try {
      localStorage.setItem('quran_portal_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  const clearChatHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      setMessages([]);
      try {
        localStorage.removeItem('quran_portal_chat_history');
      } catch (e) {}
    }
  };


  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [messages, isLoading, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    
    // Support multi-language voice inputs
    let recognitionLang = 'en-US';
    if (selectedLang !== 'auto') {
      recognitionLang = selectedLang;
    } else {
      if (siteLang === 'ur' || siteLang === 'br') {
        recognitionLang = 'ur-PK';
      } else if (siteLang === 'ar') {
        recognitionLang = 'ar-SA';
      } else {
        recognitionLang = 'en-US';
      }
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

  const handleSpeak = (text, msgLang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove link syntax and bold syntax for clear synthesis speech
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

  // File selection handler
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
      setTimeout(scrollToBottom, 100);
    }
  };


  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const html = String(rawText)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #0066FF; text-decoration: underline;">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chatbot-container">
      {/* Header */}
      <div style={{
        padding: '16px', background: '#ffffff', borderBottom: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/favicon.svg" alt="Maktaba AI Logo" style={{ width: '38px', height: '38px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(245,158,11,0.4)', flexShrink: 0 }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              Maktaba tul Muslim AI
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#059669' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
              Online
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {messages.length > 0 && (
            <button onClick={clearChatHistory} title="Clear Chat History" style={{
              background: '#fef2f2', border: 'none', color: '#ef4444', borderRadius: '50%',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
            }}>
              <RefreshCw size={15} />
            </button>
          )}
          <button onClick={onClose} style={{
            background: '#f1f5f9', border: 'none', color: '#64748b', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px', background: '#f8fafc',
        display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{ 
              width: '64px', height: '64px', background: '#e0f2fe', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <Bot size={32} color="#0066FF" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              How can I help you?
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              Ask me about Quran, Hadith, or Islamic books.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUICK_PROMPTS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.prompt)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', background: '#ffffff', border: '1px solid #e2e8f0',
                    borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s', color: '#334155', fontSize: '14px', fontWeight: 500
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#0066FF'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{q.icon}</span> {q.label}
                  </span>
                  <ChevronRight size={16} color="#94a3b8" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '85%', padding: '12px 16px', fontSize: '14px', lineHeight: '1.5',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.sender === 'user' ? '#0066FF' : '#ffffff',
                color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: msg.sender === 'ai' ? '1px solid #f1f5f9' : 'none'
              }}>
                {/* File Attachment Render */}
                {msg.file && (
                  <div style={{ marginBottom: '8px', padding: '6px', borderRadius: '8px', background: msg.sender === 'user' ? 'rgba(0,0,0,0.15)' : '#f8fafc', border: '1px solid rgba(0,0,0,0.05)' }}>
                    {msg.file.preview ? (
                      <img src={msg.file.preview} alt={msg.file.name} style={{ maxWidth: '100%', maxHeight: '140px', borderRadius: '6px', objectFit: 'cover' }} />
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
                      onClick={() => handleSpeak(msg.text, msg.language || siteLang)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#0066FF'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                      title="Read response aloud"
                    >
                      <Volume2 size={16} />
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

                {/* Rich Components */}

                {msg.quran && msg.quran.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.quran.map((q, i) => (
                      <div key={i} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Quran {q.surah_name} {q.surah_number}:{q.ayah_number}</div>
                        <div style={{ fontSize: '18px', textAlign: 'right', marginBottom: '6px', fontFamily: '"Scheherazade New", serif' }}>{q.text || q.arabic_text}</div>
                        {q.translation && <div style={{ fontSize: '13px', color: '#334155' }}>{q.translation}</div>}
                      </div>
                    ))}
                  </div>
                )}
                
                {msg.hadith && msg.hadith.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.hadith.map((h, i) => (
                      <div key={i} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>{h.book_name} #{h.hadith_number} ({h.grade})</div>
                        <div style={{ fontSize: '13px', color: '#334155' }}>{h.translation}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {msg.books && msg.books.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Recommended Books</div>
                    {msg.books.map((b, i) => (
                      <div key={i} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                        <div style={{ width: '40px', height: '56px', background: '#e2e8f0', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={20} color="#94a3b8" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{b.title}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>By {b.author}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
              
              {/* Suggested Questions */}
              {msg.suggested && msg.suggested.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', justifyContent: 'flex-start' }}>
                  {msg.suggested.map((sq, i) => (
                    <button key={i} onClick={() => handleSend(sq)} style={{
                      background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd',
                      padding: '6px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer'
                    }}>
                      {sq}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ padding: '12px 16px', background: '#ffffff', borderRadius: '16px 16px 16px 4px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="lyro-dots" style={{ display: 'flex', gap: '4px' }}>
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

      {/* File error message banner */}
      {fileError && (
        <div style={{ padding: '6px 16px', background: '#fef2f2', borderTop: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <AlertCircle size={12} color="#ef4444" />
          <span style={{ fontSize: '11px', color: '#ef4444' }}>{fileError}</span>
        </div>
      )}

      {/* Input Area */}
      <div style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 16px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
          {/* File select paperclip button */}
          <button onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: attachedFile ? '#0066FF' : '#94a3b8', cursor: 'pointer', display: 'flex', padding: '4px' }} title="Attach image or PDF (max 30MB)">
            <Paperclip size={20} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" style={{ display: 'none' }} onChange={handleFileSelect} />

          <button onClick={toggleVoiceRecording} style={{ background: 'none', border: 'none', color: isRecording ? '#ef4444' : '#94a3b8', cursor: 'pointer', display: 'flex' }}>
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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

      
      <style dangerouslySetInnerHTML={{__html: `
        .ai-chatbot-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 360px;
          height: 550px;
          max-height: 80vh;
          z-index: 999999;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: system-ui, sans-serif;
          border: 1px solid rgba(226, 232, 240, 0.8);
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        @media (max-width: 640px) {
          .ai-chatbot-container {
            bottom: 12px;
            right: 12px;
            left: 12px;
            width: calc(100% - 24px);
            height: 480px;
            max-height: 70vh;
            border-radius: 14px;
          }
        }
      `}} />
    </div>
  );
}