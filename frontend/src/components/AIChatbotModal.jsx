import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, X, BookOpen, Volume2, Copy, Check, User, RefreshCw
} from 'lucide-react';


const QUICK_PROMPTS = [
  { icon: '📖', label: 'Surah Al-Fatiha Tafsir', prompt: 'What is the Tafsir and meaning of Surah Al-Fatiha?' },
  { icon: '👑', label: 'Story of Prophet Musa (AS)', prompt: 'Tell me the story of Prophet Musa (AS) and Pharaoh in the Quran' },
  { icon: '🕋', label: 'Steps of Hajj & Umrah', prompt: 'Explain the step by step guide to perform Hajj and Umrah' },
  { icon: '🤲', label: 'Dua for Anxiety & Sabr', prompt: 'What is the Dua and Ayah for patience, anxiety, and peace of mind?' },
  { icon: '🕌', label: 'Raka\'ahs of Fajr & Isha', prompt: 'How many Raka\'ahs are in Fajr, Dhuhr, Asr, Maghrib, and Isha?' },
  { icon: '📚', label: 'Recommended Books on Seerah', prompt: 'What Islamic PDF books do you recommend for Seerah of Prophet Muhammad (ﷺ)?' },
  { icon: '🌙', label: 'Fasting Rules & Laylatul Qadr', prompt: 'What are the rules of Sawm (Fasting) in Ramadan and virtues of Laylatul Qadr?' },
  { icon: '💎', label: 'Virtue of Ayatul Kursi', prompt: 'What are the benefits and Hadith about Ayatul Kursi?' },
  { icon: '💰', label: 'Zakat & Nisab Calculation', prompt: 'What is the Nisab threshold and percentage for Zakat calculation?' },
  { icon: '✨', label: '99 Names of Allah (Asma ul Husna)', prompt: 'Tell me about the 99 Names of Allah and Tawheed' }
];

export default function AIChatbotModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Assalamu Alaikum! 🌙 Welcome to **Maktaba AI Islamic Knowledge Assistant**.\n\nI am dedicated strictly to authentic Islamic knowledge: Quran (114 Surahs), Sahih Hadith, Seerah of Prophet Muhammad (ﷺ), 25 Prophets, 5 Pillars, Salah, Zakat, Hajj, Fasting, Tafseer, Duas, and Islamic Books.\n\nHow may I guide you today?",
      references: "Maktaba tul Muslim Knowledge Engine",
      urls: ["https://maktabatulmuslim.com/read", "https://maktabatulmuslim.com/books"],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    try {
      const response = await fetch('/api/ai-assistant/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      const data = await response.json();
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.answer || "I apologize, I could not process your request right now. Please try again.",
        references: data.references || "",
        urls: data.urls || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Assalamu Alaikum. Network error connecting to Islamic Knowledge engine. Please verify your connection.",
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

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-emerald-500/30 w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-900/40 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-emerald-100 flex items-center gap-2 font-serif">
                Maktaba AI Assistant
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-sans font-normal">
                  Islamic Knowledge Engine
                </span>
              </h3>
              <p className="text-xs text-emerald-400/80">Search Quran, Hadith, Anbiya Stories & Fiqh</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto flex gap-2 no-scrollbar">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/30 border border-emerald-500/30 text-xs text-emerald-200 hover:bg-emerald-800/50 hover:border-emerald-400 transition-all whitespace-nowrap"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-900/90 border border-emerald-500/20 text-slate-200 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed font-sans">
                  {msg.text}
                </div>

                {msg.references && (
                  <div className="mt-3 pt-2 border-t border-emerald-500/20 text-xs text-emerald-400 font-mono space-y-1">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>References: {msg.references}</span>
                    </div>

                    {msg.urls && msg.urls.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.urls.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-teal-300 hover:text-emerald-200 underline font-sans bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30"
                          >
                            🔗 {url.replace('https://', '')}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}


                <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                  <span>{msg.time}</span>
                  {msg.sender === 'ai' && (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleSpeak(msg.text)}
                        className="hover:text-emerald-400 transition-colors p-1"
                        title="Listen to audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-emerald-400 transition-colors p-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3 text-emerald-400 text-xs italic bg-slate-900/60 border border-emerald-500/20 p-3 rounded-2xl max-w-xs">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Consulting Quran & Authentic Hadith Sources...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-emerald-500/20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask any question about Islam, Quran, Hadith, Prophets..."
              className="flex-1 bg-slate-900 border border-emerald-500/30 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
