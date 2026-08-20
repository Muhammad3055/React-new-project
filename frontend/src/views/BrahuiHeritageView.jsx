import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Volume2, Sparkles, Download, Play, Shield, Globe } from 'lucide-react';

export default function BrahuiHeritageView() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('tafseer');

  const brahuiWorks = [
    { title: 'Brahui Tarjuma Quran al-Kareem', author: 'Maulana Nabijan Brahui', type: 'Quran Translation', desc: 'Complete word-by-word authentic Brahui (Brohi) translation of the Holy Quran.' },
    { title: 'Brahui Tafseer-e-Mustafa', author: 'Allama Abdul Rahman Brahui', type: 'Tafseer Commentary', desc: 'Detailed scholarly Quranic commentary written in classical Brahui language.' },
    { title: 'Hamd & Naat Brahui Collection', author: 'Brahui Islamic Poets', type: 'Islamic Poetry', desc: 'Melodious Brahui Naat Sharif and Hamd praise recitations in MP3 format.' },
    { title: 'Brahui Fiqh & Masnoon Duas', author: 'Islamic Scholars Guild', type: 'Islamic Fiqh', desc: 'Daily supplicatory prayers and daily rulings translated into Brahui dialect.' }
  ];

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #1e1b4b 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Globe size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Brahui (Brohi) Digital Repository
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Brahui Islamic Heritage &amp; Literature Hub
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Preserving and digitizing authentic Brahui Quran translations, Tafseer manuscripts, Taqreer lectures, and classical Islamic literature.
          </p>
        </div>

        {/* ── Brahui Digital Works Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {brahuiWorks.map((work, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff', borderRadius: '20px', padding: '1.5rem',
                border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ padding: '3px 10px', borderRadius: '20px', background: '#d1fae5', color: '#047857', fontWeight: 800, fontSize: '0.75rem' }}>
                  {work.type}
                </span>
                <h3 style={{ margin: '0.5rem 0 4px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {work.title}
                </h3>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#d97706', marginBottom: '0.75rem' }}>
                  By {work.author}
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                  {work.desc}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.5rem' }}>
                <button style={{ flex: 1, padding: '8px', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <BookOpen size={14}/> Read Online
                </button>
                <button style={{ padding: '8px 12px', borderRadius: '10px', background: '#f1f5f9', color: '#334155', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                  <Download size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
