import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Volume2, Sparkles, CheckCircle2, Mic, Play, Info } from 'lucide-react';

export default function TajweedView() {
  const { t } = useLanguage();
  const [selectedRule, setSelectedRule] = useState('ikhfa');

  const tajweedRules = [
    {
      id: 'ikhfa',
      name: 'Ikhfa (الإخفاء)',
      subtitle: 'Concealment / Nasal Sound',
      color: '#d97706',
      bgLight: '#fef3c7',
      desc: 'Hiding the sound of Noon Sakinah (نْ) or Tanween when followed by any of the 15 Ikhfa letters, pronouncing it with a light Ghunnah (nasalization) for 2 counts.',
      letters: ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'],
      exampleArabic: 'مِن قَبْلِكَ - أَنفُسَكُمْ',
      exampleTrans: 'Min Qablik - Anfusakum'
    },
    {
      id: 'idgham',
      name: 'Idgham (الإدغام)',
      subtitle: 'Merging / Assimilation',
      color: '#059669',
      bgLight: '#d1fae5',
      desc: 'Merging Noon Sakinah or Tanween into the following letter so that they become one doubled letter. Merged with Ghunnah for (ي ن م و) and without Ghunnah for (ل ر).',
      letters: ['ي', 'ر', 'م', 'ل', 'و', 'ن'],
      exampleArabic: 'مَن يَقُولُ - مِن رَّبِّهِمْ',
      exampleTrans: 'May Yaqool - Mir Rabbihim'
    },
    {
      id: 'iqlab',
      name: 'Iqlab (الإقلاب)',
      subtitle: 'Conversion to Meem',
      color: '#2563eb',
      bgLight: '#dbeafe',
      desc: 'Changing Noon Sakinah or Tanween into a Meem (م) sound with Ghunnah when followed by the letter Baa (ب).',
      letters: ['ب'],
      exampleArabic: 'مِن بَعْدِ - أَنۢبِئْهُم',
      exampleTrans: 'Mim Ba\'d - Ambi\'hum'
    },
    {
      id: 'izhar',
      name: 'Izhar (الإظهار)',
      subtitle: 'Clarity / Clear Pronunciation',
      color: '#7c3aed',
      bgLight: '#ede9fe',
      desc: 'Pronouncing Noon Sakinah or Tanween clearly without Ghunnah when followed by any of the 6 throat letters (Throat letters: ء هـ ع ح غ خ).',
      letters: ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ'],
      exampleArabic: 'مَنْ آمَنَ - مِنْ حَكِيمٍ',
      exampleTrans: 'Man Aamana - Min Hakeem'
    },
    {
      id: 'qalqalah',
      name: 'Qalqalah (القلقلة)',
      subtitle: 'Echoing / Bouncing Sound',
      color: '#dc2626',
      bgLight: '#fee2e2',
      desc: 'Producing a bouncing or echoing sound when any of the 5 Qalqalah letters (ق ط ب ج د) has a Sukoon or when stopping upon them at the end of a verse.',
      letters: ['ق', 'ط', 'ب', 'ج', 'د'],
      exampleArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ - فِي كَبَدٍ',
      exampleTrans: 'Qul Huwallahu Ahad - Fee Kabad'
    },
    {
      id: 'ghunnah',
      name: 'Ghunnah (الغُنَّة)',
      subtitle: 'Nasal Resonance (2 Counts)',
      color: '#0891b2',
      bgLight: '#cffaff',
      desc: 'A resonant nasal sound produced from the nasal cavity whenever Noon (نّ) or Meem (مّ) has a Shaddah, held for 2 full counts.',
      letters: ['نّ', 'مّ'],
      exampleArabic: 'إِنَّ اللَّهَ - ثُمَّ كَلاَّ',
      exampleTrans: 'Inna Allaha - Thumma Kalla'
    }
  ];

  const makharijList = [
    { name: 'Al-Jawf (الْجَوْفُ)', desc: 'The empty space in the mouth and throat (Vowel sounds: ا, و, ي)' },
    { name: 'Al-Halq (الْحَلْقُ)', desc: 'The throat (6 Throat letters: ء, هـ, ع, ح, غ, خ)' },
    { name: 'Al-Lisan (اللِّسَانُ)', desc: 'The tongue (18 letters: Qaf, Kaf, Jeem, Sheen, Ya, Dad, Lam, Noon, Ra, etc.)' },
    { name: 'Ash-Shafatayn (الشَّفَتَانِ)', desc: 'The two lips (4 letters: Ba, Ma, Waw, Fa)' },
    { name: 'Al-Khayshoom (الْخَيْشُومُ)', desc: 'The nasal passage (Source of Ghunnah nasal sound)' }
  ];

  const currentRuleObj = tajweedRules.find(r => r.id === selectedRule) || tajweedRules[0];

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Sparkles size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Quran Recitation Art
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Tajweed Rules &amp; Pronunciation Guide
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Recite the Holy Quran as it was revealed (*Tartila*). Learn rules of Noon Sakinah, Tanween, Qalqalah, Ghunnah, and makharij points.
          </p>
        </div>

        {/* ── Rules Navigation Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {tajweedRules.map(rule => (
            <button
              key={rule.id}
              onClick={() => setSelectedRule(rule.id)}
              style={{
                background: selectedRule === rule.id ? rule.color : '#ffffff',
                color: selectedRule === rule.id ? '#ffffff' : '#1e293b',
                borderRadius: '16px', padding: '1rem', border: '1px solid #e2e8f0',
                boxShadow: selectedRule === rule.id ? `0 8px 20px ${rule.color}40` : '0 2px 8px rgba(0,0,0,0.03)',
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{rule.name}</div>
              <div style={{ fontSize: '0.75rem', opacity: selectedRule === rule.id ? 0.9 : 0.6, marginTop: '2px' }}>{rule.subtitle}</div>
            </button>
          ))}
        </div>

        {/* ── Selected Rule Detail Section ── */}
        <div style={{
          background: '#ffffff', borderRadius: '24px', padding: '2rem',
          border: `2px solid ${currentRuleObj.color}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <div>
              <span style={{ background: currentRuleObj.bgLight, color: currentRuleObj.color, padding: '4px 12px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem' }}>
                Rule Spotlight
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0' }}>
                {currentRuleObj.name} — <span style={{ color: currentRuleObj.color }}>{currentRuleObj.subtitle}</span>
              </h2>
            </div>
          </div>

          <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {currentRuleObj.desc}
          </p>

          {/* Rule Letters Grid */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Associated Letters ({currentRuleObj.letters.length}):
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {currentRuleObj.letters.map((ltr, i) => (
                <div key={i} style={{
                  width: '42px', height: '42px', borderRadius: '12px', background: currentRuleObj.bgLight,
                  color: currentRuleObj.color, fontWeight: 900, fontSize: '1.3rem', fontFamily: 'Amiri, serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${currentRuleObj.color}40`
                }}>
                  {ltr}
                </div>
              ))}
            </div>
          </div>

          {/* Example Quranic Verse Box */}
          <div style={{
            background: '#f8fafc', borderRadius: '18px', padding: '1.5rem', border: '1px solid #cbd5e1',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: currentRuleObj.color }}>Example Verse Recitation</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Amiri, serif', color: '#022c22', margin: '4px 0' }}>
                {currentRuleObj.exampleArabic}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748b' }}>
                {currentRuleObj.exampleTrans}
              </div>
            </div>
          </div>
        </div>

        {/* ── Makharij Points Section ── */}
        <div style={{ background: '#0f172a', borderRadius: '24px', padding: '2rem', color: '#ffffff', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fcd34d', marginBottom: '1rem' }}>
            <BookOpen size={22} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>The 5 Major Makharij (Articulation Points)</h3>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            *Makhraj* refers to the exact physical place in the speech apparatus from which an Arabic letter sound originates.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {makharijList.map((m, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'Amiri, serif', marginBottom: '4px' }}>
                  {m.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {m.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
