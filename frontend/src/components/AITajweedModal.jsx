import React, { useState } from 'react';
import { Volume2, Sparkles, X, Check, Mic, BookOpen, AlertCircle, Play } from 'lucide-react';

const TAJWEED_RULES = [
  {
    name: 'Ghunnah (غنة)',
    description: 'Nasal sound made when pronouncing Noon (ن) or Meem (م) with Tashdeed (ّ). Held for 2 beats.',
    exampleArabic: 'إِنَّ ٱلَّذِينَ مَنُوا',
    exampleTrans: 'Inna alladhina amanu',
    color: 'border-emerald-500/40 bg-emerald-950/40'
  },
  {
    name: 'Qalqalah (قلقلة)',
    description: 'Echoing or bouncing sound produced when one of the Qalqalah letters (ق, ط, ب, ج, د) has Sukoon.',
    exampleArabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    exampleTrans: 'Qul huwa Allahu Ahad',
    color: 'border-teal-500/40 bg-teal-950/40'
  },
  {
    name: 'Madd Asli (مد اصلي)',
    description: 'Natural prolongation of Alif, Ya, or Waw for 2 counts.',
    exampleArabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    exampleTrans: 'Ar-Rahman Ar-Rahim',
    color: 'border-amber-500/40 bg-amber-950/40'
  },
  {
    name: 'Ikhfa (إخفاء)',
    description: 'Concealing the sound of Noon Sakinah or Tanween when followed by one of the 15 Ikhfa letters.',
    exampleArabic: 'مِن قَبْلِكَ',
    exampleTrans: 'Min Qablik',
    color: 'border-cyan-500/40 bg-cyan-950/40'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-emerald-500/30 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900/40 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-emerald-100 font-serif">AI Tajweed Pronunciation Guide</h3>
              <p className="text-xs text-emerald-400/80">Interactive Tajweed Rules & Recitation Voice Checker</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Tajweed Selector */}
          <div className="grid grid-cols-2 gap-2">
            {TAJWEED_RULES.map((rule, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveRule(idx); setFeedback(null); }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeRule === idx
                    ? 'border-emerald-400 bg-emerald-900/60 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <h5 className="font-semibold text-sm font-serif text-emerald-100">{rule.name}</h5>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">{rule.description}</p>
              </button>
            ))}
          </div>

          {/* Active Rule Details */}
          <div className={`p-5 rounded-2xl border ${TAJWEED_RULES[activeRule].color} space-y-4`}>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Rule Explanation</span>
              <h4 className="text-xl font-bold font-serif text-emerald-100 mt-1">{TAJWEED_RULES[activeRule].name}</h4>
              <p className="text-sm text-slate-200 mt-2 leading-relaxed">{TAJWEED_RULES[activeRule].description}</p>
            </div>

            {/* Example Ayah */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <span className="text-xs text-emerald-400/80 font-mono">Example Ayah Text</span>
              <p className="text-2xl font-serif text-amber-300 leading-loose" dir="rtl">
                {TAJWEED_RULES[activeRule].exampleArabic}
              </p>
              <p className="text-xs text-slate-300 italic">
                "{TAJWEED_RULES[activeRule].exampleTrans}"
              </p>
            </div>

            {/* Voice Recitation Test */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSimulateCheck}
                disabled={isRecording}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-lg shadow-emerald-600/30"
              >
                <Mic className={`w-4 h-4 ${isRecording ? 'animate-bounce text-red-300' : ''}`} />
                <span>{isRecording ? 'Listening to Recitation...' : 'Practice Voice Recitation'}</span>
              </button>

              {feedback && (
                <div className="flex items-center space-x-2 text-xs text-emerald-300 font-semibold bg-emerald-950/90 border border-emerald-500/40 px-3 py-2 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Score: {feedback.score} ({feedback.accuracy})</span>
                </div>
              )}
            </div>

            {feedback && (
              <p className="text-xs text-emerald-200 italic bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-500/20">
                {feedback.comment}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
