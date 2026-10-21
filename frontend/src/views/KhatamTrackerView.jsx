import React, { useState, useEffect } from 'react';
import { ALL_30_JUZ } from '../data/juz_data';
import { useLanguage } from '../context/LanguageContext';
import { 
  Users, User, Share2, CheckCircle2, Clock, BookOpen, 
  Sparkles, RotateCcw, Plus, Trash2, Heart, Award, Copy, Check 
} from 'lucide-react';

export default function KhatamTrackerView({ navigateToTab, user }) {
  const { lang, t } = useLanguage();
  const [activeMode, setActiveMode] = useState('personal'); // 'personal' | 'group'
  const isRtl = lang === 'ur' || lang === 'ar' || lang === 'br';

  // ==========================================
  // 1. PERSONAL KHATAM STATE
  // ==========================================
  const [personalCompleted, setPersonalCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('khatam_quran_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('khatam_quran_progress', JSON.stringify(personalCompleted));
    } catch (e) {}
  }, [personalCompleted]);

  const togglePersonalJuz = (juzId) => {
    setPersonalCompleted(prev => ({
      ...prev,
      [juzId]: !prev[juzId]
    }));
  };

  const personalDoneCount = Object.keys(personalCompleted).filter(k => personalCompleted[k]).length;
  const personalProgressPercent = Math.round((personalDoneCount / 30) * 100);

  // ==========================================
  // 2. GROUP / FAMILY KHATAM ROOM STATE
  // ==========================================
  const [groupRoom, setGroupRoom] = useState(() => {
    try {
      const saved = localStorage.getItem('maktaba_group_khatam_room');
      return saved ? JSON.parse(saved) : {
        title: lang === 'ar' ? 'ختمة قرآن مباركة للأسرة والأحباب' : (lang === 'ur' || lang === 'br') ? 'خاندانی ختمِ قرآن برائے ایصالِ ثواب و برکت' : 'Family & Collective Khatam Quran',
        intention: lang === 'ar' ? 'نسأل الله القبول والمغفرة' : (lang === 'ur' || lang === 'br') ? 'اللہ تعالیٰ تمام پڑھنے والوں کے لیے دارین کی برکتیں عطا فرمائے۔' : 'May Allah accept our recitation and shower His infinite mercy.',
        creator: 'Admin',
        createdAt: new Date().toLocaleDateString(),
        juzAssignments: {} // { 1: { reader: "Fatima", status: "completed" }, 2: { reader: "Ali", status: "reading" } }
      };
    } catch (e) {
      return null;
    }
  });

  const [claimingJuzId, setClaimingJuzId] = useState(null);
  const [claimNameInput, setClaimNameInput] = useState('');
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomIntention, setNewRoomIntention] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDuaModal, setShowDuaModal] = useState(false);

  useEffect(() => {
    if (groupRoom) {
      try {
        localStorage.setItem('maktaba_group_khatam_room', JSON.stringify(groupRoom));
      } catch (e) {}
    }
  }, [groupRoom]);

  // Group stats
  const groupAssignments = groupRoom?.juzAssignments || {};
  const groupDoneCount = Object.values(groupAssignments).filter(a => a.status === 'completed').length;
  const groupReadingCount = Object.values(groupAssignments).filter(a => a.status === 'reading').length;
  const groupAvailableCount = 30 - Object.keys(groupAssignments).length;
  const groupProgressPercent = Math.round((groupDoneCount / 30) * 100);

  // Claim a Juz
  const handleClaimJuz = (juzId) => {
    if (!claimNameInput.trim()) return;
    setGroupRoom(prev => ({
      ...prev,
      juzAssignments: {
        ...prev.juzAssignments,
        [juzId]: {
          reader: claimNameInput.trim(),
          status: 'reading',
          claimedAt: new Date().toLocaleDateString()
        }
      }
    }));
    setClaimingJuzId(null);
    setClaimNameInput('');
  };

  // Mark Juz as Completed
  const handleMarkJuzCompleted = (juzId) => {
    setGroupRoom(prev => {
      const existing = prev.juzAssignments[juzId] || { reader: user?.name || 'Reciter' };
      return {
        ...prev,
        juzAssignments: {
          ...prev.juzAssignments,
          [juzId]: {
            ...existing,
            status: existing.status === 'completed' ? 'reading' : 'completed',
            completedAt: new Date().toLocaleDateString()
          }
        }
      };
    });
  };

  // Release Juz
  const handleReleaseJuz = (juzId) => {
    if (window.confirm(lang === 'ar' ? 'هل تريد إلغاء حجز هذا الجزء ليكون متاحاً لغيرك؟' : (lang === 'ur' || lang === 'br') ? 'کیا آپ اس پارے کو خالی کر کے دوسروں کے لیے دستیاب کرنا چاہتے ہیں؟' : 'Release this Juz to make it available for others?')) {
      setGroupRoom(prev => {
        const next = { ...prev.juzAssignments };
        delete next[juzId];
        return { ...prev, juzAssignments: next };
      });
    }
  };

  // Create or Reset Room
  const handleSaveRoomDetails = () => {
    if (!newRoomTitle.trim()) return;
    setGroupRoom(prev => ({
      ...prev,
      title: newRoomTitle.trim(),
      intention: newRoomIntention.trim(),
      createdAt: new Date().toLocaleDateString()
    }));
    setShowEditRoomModal(false);
  };

  const handleResetEntireGroupRoom = () => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من تصفير وإعادة تعيين الختمة الجماعية بالكامل؟' : (lang === 'ur' || lang === 'br') ? 'کیا آپ تمام 30 پارے ری سیٹ کر کے نئی ختمِ قرآن روم شروع کرنا چاہتے ہیں؟' : 'Reset all 30 Juz and start a fresh collective Khatam?')) {
      setGroupRoom(prev => ({
        ...prev,
        createdAt: new Date().toLocaleDateString(),
        juzAssignments: {}
      }));
    }
  };

  // WhatsApp Share Message Generator
  const shareOnWhatsApp = () => {
    const title = groupRoom?.title || 'Khatam Quran';
    const available = groupAvailableCount;
    const completed = groupDoneCount;

    let text = `🌙 *${title}* 📖\n\n`;
    if (isRtl) {
      text += `السلام علیکم ورحمۃ اللہ!\nہم نے مکتبۃ المسلم پر اجتماعی ختمِ قرآن شروع کیا ہے۔\n\n`;
      text += `✅ مکمل پارے: ${completed} / 30\n`;
      text += `📖 باقی دستیاب پارے: ${available}\n\n`;
      text += `برائے مہربانی اپنا پارہ منتخب کریں اور پڑھنے کے بعد اپڈیٹ کریں:\n`;
    } else {
      text += `Assalamu Alaikum!\nJoin our Family & Collective Khatam-ul-Quran room.\n\n`;
      text += `✅ Completed: ${completed} / 30\n`;
      text += `📖 Available Juz: ${available}\n\n`;
      text += `Claim your Juz and update your progress here:\n`;
    }
    text += window.location.href;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="islamic-tool-page" style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem', direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>

        {/* ── Hero Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 60%, #1e1b4b 100%)',
          borderRadius: '24px', padding: '2.5rem 2rem', color: '#ffffff',
          textAlign: 'center', marginBottom: '2rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Sparkles size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px' }}>
              {lang === 'ar' ? 'منصة ختم القرآن الكريم (الفردي والجماعي)' : (lang === 'ur' || lang === 'br') ? 'قرآن پاک تکمیل و اجتماعی ختمِ قرآن پورٹل' : 'HOLY QURAN COMPLETION & KHATAM HUB'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.6rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            {lang === 'ar' ? 'ختم القرآن الكريم: المخطط الفردي وختمة العائلة' : (lang === 'ur' || lang === 'br') ? 'اجتماعی و خاندانی ختمِ قرآن روم اور 30 روزہ ٹریکر' : 'Khatam-ul-Quran: Family Rooms & 30-Day Tracker'}
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            {lang === 'ar'
              ? 'أتم تلاوة كتاب الله بمفردك عبر خطة الـ 30 يوماً، أو أنشئ ختمة جماعية وشارك الرابط عبر واتساب مع عائلتك وأصدقائك لتوزيع أجزاء القرآن بسهولة.'
              : (lang === 'ur' || lang === 'br')
              ? 'انفرادی طور پر 30 دن میں روزانہ 1 پارہ پڑھ کر قرآن مکمل کریں، یا فیملی اور رشتہ داروں کے ساتھ اجتماعی ختمِ قرآن روم بنائیں اور واٹس ایپ پر پارے تقسیم کریں۔'
              : 'Complete the Quran individually in 30 days or create a collaborative Family Khatam room with instant WhatsApp sharing and 30 Juz distribution.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveMode('personal')}
              style={{
                padding: '10px 22px', borderRadius: '16px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none',
                background: activeMode === 'personal' ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                color: activeMode === 'personal' ? '#000' : '#ffffff',
                boxShadow: activeMode === 'personal' ? '0 4px 14px rgba(245,158,11,0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <User size={18} />
              <span>{lang === 'ar' ? '١. المخطط الفردي (٣٠ يوماً)' : (lang === 'ur' || lang === 'br') ? '1. انفرادی 30 روزہ ختم' : '1. Personal 30-Day Plan'}</span>
            </button>

            <button
              onClick={() => setActiveMode('group')}
              style={{
                padding: '10px 22px', borderRadius: '16px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none',
                background: activeMode === 'group' ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                color: activeMode === 'group' ? '#000' : '#ffffff',
                boxShadow: activeMode === 'group' ? '0 4px 14px rgba(245,158,11,0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Users size={18} />
              <span>{lang === 'ar' ? '٢. ختمة العائلة والأصدقاء (جماعي)' : (lang === 'ur' || lang === 'br') ? '2. اجتماعی و خاندانی ختمِ قرآن روم' : '2. Family & Collective Room'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODE 1: PERSONAL 30-DAY KHATAM PLANNER                   */}
        {/* ========================================================= */}
        {activeMode === 'personal' && (
          <div>
            {/* Stats Card */}
            <div style={{
              background: 'var(--surface-paper)', borderRadius: '20px', padding: '1.5rem',
              border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              marginBottom: '2rem', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem'
            }}>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {lang === 'ar' ? 'تقدمك في ختم القرآن الكريم' : (lang === 'ur' || lang === 'br') ? 'آپ کی ذاتی تلاوت و تکمیل کی پروگریس' : 'Your Personal Khatam Progress'}
                </h3>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {lang === 'ar'
                    ? `تمت قراءة ${personalDoneCount} من أصل 30 جزءاً (${personalProgressPercent}%)`
                    : (lang === 'ur' || lang === 'br')
                    ? `30 میں سے ${personalDoneCount} پارے مکمل ہو چکے ہیں (${personalProgressPercent}%)`
                    : `${personalDoneCount} of 30 Juz completed (${personalProgressPercent}%)`}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ flex: '1 1 280px', maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  <span style={{ color: '#059669' }}>{personalDoneCount} / 30 Juz</span>
                  <span style={{ color: '#059669' }}>{personalProgressPercent}%</span>
                </div>
                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${personalProgressPercent}%`, background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: '10px', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => navigateToTab('read')}
                  style={{
                    background: '#059669', color: '#fff', border: 'none',
                    padding: '10px 18px', borderRadius: '12px', fontWeight: 800,
                    fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex',
                    alignItems: 'center', gap: '6px'
                  }}
                >
                  <BookOpen size={16} />
                  <span>{lang === 'ar' ? 'اقرأ الآن' : (lang === 'ur' || lang === 'br') ? 'قرآن پڑھیں' : 'Read Quran'}</span>
                </button>

                {personalDoneCount === 30 && (
                  <button
                    onClick={() => setShowDuaModal(true)}
                    style={{
                      background: '#f59e0b', color: '#000', border: 'none',
                      padding: '10px 18px', borderRadius: '12px', fontWeight: 800,
                      fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex',
                      alignItems: 'center', gap: '6px'
                    }}
                  >
                    <Award size={16} />
                    <span>{lang === 'ar' ? 'دعاء الختم' : (lang === 'ur' || lang === 'br') ? 'دعائے ختمِ قرآن' : 'Khatam Dua'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* 30 Juz Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
              {ALL_30_JUZ.map((juz) => {
                const isDone = !!personalCompleted[juz.id];
                return (
                  <div
                    key={juz.id}
                    onClick={() => togglePersonalJuz(juz.id)}
                    style={{
                      background: isDone ? '#ecfdf5' : 'var(--surface-paper)',
                      border: isDone ? '2px solid #10b981' : '1px solid #e2e8f0',
                      borderRadius: '16px', padding: '1.25rem', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s ease', position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{
                        background: isDone ? '#10b981' : '#f1f5f9',
                        color: isDone ? '#ffffff' : '#64748b',
                        padding: '3px 10px', borderRadius: '10px',
                        fontSize: '0.75rem', fontWeight: 800
                      }}>
                        Juz {juz.id}
                      </span>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        border: isDone ? 'none' : '2px solid #cbd5e1',
                        background: isDone ? '#10b981' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {isDone && <Check size={14} style={{ color: '#fff' }} />}
                      </div>
                    </div>

                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', fontFamily: 'serif', marginBottom: '4px' }}>
                      {juz.nameArabic}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706', marginBottom: '6px' }}>
                      {juz.nameTranslit}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {juz.surahRange}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 2: FAMILY & COLLECTIVE KHATAM ROOM                  */}
        {/* ========================================================= */}
        {activeMode === 'group' && (
          <div>
            {/* Room Header Card */}
            <div style={{
              background: 'var(--surface-paper)', borderRadius: '24px', padding: '2rem',
              border: '2px solid #f59e0b', boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(245,158,11,0.15)', color: '#b45309', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    <Users size={14} />
                    <span>{lang === 'ar' ? 'غرفة الختمة الجماعية التفاعلية' : (lang === 'ur' || lang === 'br') ? 'لائیو فیملی ختمِ قرآن روم' : 'Live Collective Room'}</span>
                  </div>
                  <h2 style={{ margin: '0 0 6px', fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                    {groupRoom?.title}
                  </h2>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem', maxWidth: '650px' }}>
                    {groupRoom?.intention}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={shareOnWhatsApp}
                    style={{
                      background: '#25d366', color: '#ffffff', border: 'none',
                      padding: '10px 18px', borderRadius: '12px', fontWeight: 800,
                      fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex',
                      alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37,211,102,0.3)'
                    }}
                  >
                    <Share2 size={16} />
                    <span>{lang === 'ar' ? 'مشاركة عبر واتساب' : (lang === 'ur' || lang === 'br') ? 'واٹس ایپ پر شیئر کریں' : 'Share on WhatsApp'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setNewRoomTitle(groupRoom?.title || '');
                      setNewRoomIntention(groupRoom?.intention || '');
                      setShowEditRoomModal(true);
                    }}
                    style={{
                      background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1',
                      padding: '10px 16px', borderRadius: '12px', fontWeight: 700,
                      fontSize: '0.85rem', cursor: 'pointer'
                    }}
                  >
                    {t('editRoom', 'Edit Room')}
                  </button>

                  <button
                    onClick={handleResetEntireGroupRoom}
                    title={t('resetRoom', 'Reset Room')}
                    style={{
                      background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5',
                      padding: '10px', borderRadius: '12px', cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Counters */}
              <div style={{
                background: '#f8fafc', borderRadius: '16px', padding: '1.25rem',
                border: '1px solid #e2e8f0', marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                    {lang === 'ar' ? 'حالة الإنجاز الجماعي:' : (lang === 'ur' || lang === 'br') ? 'مجموعی خاندانی پیش رفت:' : 'Collective Progress:'}
                  </span>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', fontWeight: 700 }}>
                    <span style={{ color: '#059669' }}>🟢 {groupDoneCount} {lang === 'ar' ? 'مكتمل' : (lang === 'ur' || lang === 'br') ? 'مکمل' : 'Done'}</span>
                    <span style={{ color: '#d97706' }}>🟡 {groupReadingCount} {lang === 'ar' ? 'قيد القراءة' : (lang === 'ur' || lang === 'br') ? 'زیرِ تلاوت' : 'Reading'}</span>
                    <span style={{ color: '#64748b' }}>⚪ {groupAvailableCount} {lang === 'ar' ? 'متاح' : (lang === 'ur' || lang === 'br') ? 'دستیاب' : 'Available'}</span>
                  </div>
                </div>

                <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${groupProgressPercent}%`,
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    borderRadius: '10px', transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            </div>

            {/* 30 Juz Collective Board */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))', gap: '1.25rem' }}>
              {ALL_30_JUZ.map((juz) => {
                const assignment = groupAssignments[juz.id];
                const isClaimed = !!assignment;
                const isCompleted = assignment?.status === 'completed';

                return (
                  <div
                    key={juz.id}
                    style={{
                      background: isCompleted ? '#f0fdf4' : isClaimed ? '#fffbeb' : 'var(--surface-paper)',
                      border: isCompleted ? '2px solid #10b981' : isClaimed ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                      borderRadius: '18px', padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Top Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{
                          background: isCompleted ? '#10b981' : isClaimed ? '#f59e0b' : '#f1f5f9',
                          color: isCompleted || isClaimed ? '#ffffff' : '#64748b',
                          padding: '3px 10px', borderRadius: '10px',
                          fontSize: '0.75rem', fontWeight: 800
                        }}>
                          Juz {juz.id}
                        </span>

                        <span style={{
                          fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '8px',
                          background: isCompleted ? '#dcfce7' : isClaimed ? '#fef3c7' : '#f1f5f9',
                          color: isCompleted ? '#15803d' : isClaimed ? '#b45309' : '#64748b'
                        }}>
                          {isCompleted 
                            ? (lang === 'ar' ? '✓ تم إتمامه' : (lang === 'ur' || lang === 'br') ? '✓ مکمل ہو گیا' : '✓ Completed')
                            : isClaimed 
                            ? (lang === 'ar' ? '⏳ قيد القراءة' : (lang === 'ur' || lang === 'br') ? '⏳ زیرِ تلاوت' : '⏳ In Progress')
                            : (lang === 'ar' ? '⚪ متاح للاختيار' : (lang === 'ur' || lang === 'br') ? '⚪ دستیاب پارہ' : '⚪ Available')}
                        </span>
                      </div>

                      {/* Arabic Title */}
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', fontFamily: 'serif', margin: '4px 0' }}>
                        {juz.nameArabic}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706', marginBottom: '4px' }}>
                        {juz.nameTranslit}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                        {juz.surahRange}
                      </div>

                      {/* Reader Info */}
                      {isClaimed && (
                        <div style={{
                          background: 'rgba(255,255,255,0.7)', padding: '6px 10px',
                          borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)',
                          marginBottom: '1rem', fontSize: '0.84rem'
                        }}>
                          <span style={{ color: '#64748b' }}>{lang === 'ar' ? 'القارئ: ' : (lang === 'ur' || lang === 'br') ? 'پڑھنے والے: ' : 'Reader: '}</span>
                          <strong style={{ color: '#0f172a' }}>{assignment.reader}</strong>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div>
                      {isClaimed ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleMarkJuzCompleted(juz.id)}
                            style={{
                              flex: 1, padding: '8px 12px', borderRadius: '10px', border: 'none',
                              background: isCompleted ? '#059669' : '#10b981', color: '#fff',
                              fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                            }}
                          >
                            <Check size={14} />
                            {isCompleted ? t('done', 'Done') : t('markDone', 'Mark Done')}
                          </button>

                          <button
                            onClick={() => handleReleaseJuz(juz.id)}
                            title={t('releaseJuz', 'Release Juz')}
                            style={{
                              padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1',
                              background: 'var(--surface-paper)', color: '#dc2626', cursor: 'pointer'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : claimingJuzId === juz.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder={lang === 'ar' ? 'اكتب اسمك هنا...' : (lang === 'ur' || lang === 'br') ? 'اپنا نام درج کریں...' : 'Enter your name...'}
                            value={claimNameInput}
                            onChange={(e) => setClaimNameInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleClaimJuz(juz.id)}
                            autoFocus
                            style={{
                              padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #f59e0b',
                              fontSize: '0.85rem', outline: 'none'
                            }}
                          />
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => handleClaimJuz(juz.id)}
                              style={{
                                flex: 1, padding: '6px', borderRadius: '8px', border: 'none',
                                background: '#f59e0b', color: '#000', fontWeight: 800,
                                fontSize: '0.78rem', cursor: 'pointer'
                              }}
                            >
                              {lang === 'ar' ? 'تأكيد' : (lang === 'ur' || lang === 'br') ? 'تصدیق' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setClaimingJuzId(null)}
                              style={{
                                padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1',
                                background: '#f1f5f9', color: '#64748b', fontSize: '0.78rem', cursor: 'pointer'
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setClaimingJuzId(juz.id); setClaimNameInput(user?.name || ''); }}
                          style={{
                            width: '100%', padding: '9px 12px', borderRadius: '10px',
                            border: '1.5px dashed #cbd5e1', background: '#f8fafc',
                            color: '#0f172a', fontWeight: 800, fontSize: '0.82rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
                          }}
                        >
                          <Plus size={15} style={{ color: '#f59e0b' }} />
                          <span>{lang === 'ar' ? 'سأقرأ هذا الجزء' : (lang === 'ur' || lang === 'br') ? 'یہ پارہ میں پڑھوں گا' : 'I will read this Juz'}</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Khatam Dua Banner */}
            <div style={{
              marginTop: '3rem', background: 'var(--surface-paper)', borderRadius: '20px',
              padding: '2rem', border: '1.5px solid #10b981', textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.03)'
            }}>
              <Award size={36} style={{ color: '#059669', margin: '0 auto 0.75rem' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 800, color: '#064e3b' }}>
                {lang === 'ar' ? 'دعاء ختم القرآن الكريم المستجاب' : (lang === 'ur' || lang === 'br') ? 'دعائے ختمِ قرآن کریم (مستجاب دعائیں)' : 'Supplication for Khatam Quran Completion'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 1.25rem' }}>
                {lang === 'ar'
                  ? 'عند ختم القرآن تنزل الرحمة والسكينة وتستجاب الدعوات. اضغط لقراءة دعاء الختم المأثور.'
                  : (lang === 'ur' || lang === 'br')
                  ? 'قرآن پاک کے ختم کے وقت ساٹھ ہزار فرشتے دعا پر آمین کہتے ہیں اور دعائیں قبول ہوتی ہیں۔'
                  : 'Upon completing the Quran, mercy descends and prayers are answered.'}
              </p>
              <button
                onClick={() => setShowDuaModal(true)}
                style={{
                  background: '#059669', color: '#fff', border: 'none',
                  padding: '11px 24px', borderRadius: '14px', fontWeight: 800,
                  fontSize: '0.92rem', cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', gap: '8px'
                }}
              >
                <BookOpen size={18} />
                <span>{lang === 'ar' ? 'عرض دعاء ختم القرآن' : (lang === 'ur' || lang === 'br') ? 'دعائے ختمِ قرآن پڑھیں' : 'View Khatam Dua'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Edit Room Modal ── */}
      {showEditRoomModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{ background: 'var(--surface-paper)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px', direction: isRtl ? 'rtl' : 'ltr' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {lang === 'ar' ? 'تعديل بيانات الغرفة' : (lang === 'ur' || lang === 'br') ? 'ختمِ قرآن روم کی تفصیلات' : 'Edit Khatam Room'}
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>
                {lang === 'ar' ? 'عنوان الختمة:' : (lang === 'ur' || lang === 'br') ? 'ختمِ قرآن کا عنوان:' : 'Room Title:'}
              </label>
              <input
                type="text"
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>
                {lang === 'ar' ? 'النية والرسالة للأحباب:' : (lang === 'ur' || lang === 'br') ? 'نیت یا پیغام:' : 'Intention / Note:'}
              </label>
              <textarea
                value={newRoomIntention}
                onChange={(e) => setNewRoomIntention(e.target.value)}
                rows={3}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEditRoomModal(false)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'إلغاء' : (lang === 'ur' || lang === 'br') ? 'منسوخ' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveRoomDetails}
                style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'حفظ التعديل' : (lang === 'ur' || lang === 'br') ? 'محفوظ کریں' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Khatam Dua Modal ── */}
      {showDuaModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '1rem', overflowY: 'auto'
        }}>
          <div style={{
            background: 'var(--surface-paper)', borderRadius: '24px', padding: '2rem', width: '100%',
            maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto', direction: isRtl ? 'rtl' : 'ltr',
            border: '2px solid #10b981', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
                🤲 {lang === 'ar' ? 'دعاء ختم القرآن الكريم' : (lang === 'ur' || lang === 'br') ? 'دعائے ختمِ قرآن مجید' : 'Dua Khatam-ul-Quran'}
              </h3>
              <button
                onClick={() => setShowDuaModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {/* Arabic Supplication */}
            <div style={{
              background: '#f8fafc', padding: '1.5rem', borderRadius: '16px',
              border: '1px solid #e2e8f0', marginBottom: '1.25rem', textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.35rem', lineHeight: 2.1, color: '#0f172a',
                fontFamily: 'Amiri, Scheherazade, serif', margin: 0
              }}>
                اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ، وَاجْعَلْهُ لِي إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ، وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ، وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ.
              </p>
            </div>

            {/* Urdu / English Translation */}
            <div style={{ background: '#ecfdf5', padding: '1.25rem', borderRadius: '14px', border: '1px solid #10b981', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 6px', color: '#065f46', fontSize: '0.95rem', fontWeight: 800 }}>
                {lang === 'ar' ? 'المعنى والترجمة' : (lang === 'ur' || lang === 'br') ? 'اردو ترجمہ:' : 'English Meaning:'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#166534' }}>
                {lang === 'en'
                  ? 'O Allah! Have mercy upon me by the Quran, and make it for me a guide, a light, a guidance, and a mercy. O Allah! Remind me of it what I have forgotten, teach me of it what I am ignorant of, and grant me its recitation during the hours of night and day, and make it a plea for me, O Lord of the Worlds.'
                  : 'اے اللہ! قرآنِ پاک کے صدقے مجھ پر رحم فرما، اور اسے میرے لیے پیشوا، نور، ہدایت اور رحمت بنا۔ اے اللہ! اس میں سے جو میں بھول گیا ہوں مجھے یاد دلا دے، اور جو میں نہیں جانتا مجھے سکھا دے، اور مجھے رات کی گھڑیوں اور دن کے کناروں میں اس کی تلاوت کی توفیق عطا فرما، اور اسے میرے لیے قیامت کے دن حجت بنا، اے رب العالمین!'}
              </p>
            </div>

            <button
              onClick={() => setShowDuaModal(false)}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                background: '#059669', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'آمين يا رب العالمين' : (lang === 'ur' || lang === 'br') ? 'آمین یا رب العالمین' : 'Ameen'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
