import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Flame, Award, CheckCircle, Calendar, Trophy, Sparkles, 
  Plus, Trash2, Heart, BookOpen, Clock, Moon, Sun, Shield 
} from 'lucide-react';

const DEFAULT_HABITS = [
  { id: 'fajr', icon: 'fas fa-cloud-sun', labelEn: 'Fajr Prayer (On Time / In Jama\'ah)', labelUr: 'نمازِ فجر (باجماعت / وقت پر)', labelAr: 'صلاة الفجر (في وقتها / جماعة)', category: 'prayers' },
  { id: 'dhuhr', icon: 'fas fa-sun', labelEn: 'Dhuhr Prayer', labelUr: 'نمازِ ظہر', labelAr: 'صلاة الظهر', category: 'prayers' },
  { id: 'asr', icon: 'fas fa-sun', labelEn: 'Asr Prayer', labelUr: 'نمازِ عصر', labelAr: 'صلاة العصر', category: 'prayers' },
  { id: 'maghrib', icon: 'fas fa-sunset', labelEn: 'Maghrib Prayer', labelUr: 'نمازِ مغرب', labelAr: 'صلاة المغرب', category: 'prayers' },
  { id: 'isha', icon: 'fas fa-moon', labelEn: 'Isha & Witr Prayer', labelUr: 'نمازِ عشاء و وتر واجب', labelAr: 'صلاة العشاء والوتر', category: 'prayers' },
  { id: 'quran', icon: 'fas fa-book-open', labelEn: 'Recite Holy Quran (1 Page / 1 Ruku)', labelUr: 'تلاوتِ قرآن پاک (کم از کم 1 صفحہ / 1 رکوع)', labelAr: 'تلاوة القرآن الكريم (صفحة أو ركوع)', category: 'quran' },
  { id: 'azkar', icon: 'fas fa-pray', labelEn: 'Morning & Evening Masnoon Azkar', labelUr: 'صبح و شام کے مسنون اذکار', labelAr: 'أذكار الصباح والمساء المأثورة', category: 'dhikr' },
  { id: 'sadaqah', icon: 'fas fa-hand-holding-heart', labelEn: 'Daily Sadaqah (Charity, Helping, Smile)', labelUr: 'روزانہ صدقہ (خیرات، کسی کی مدد، مسکراہٹ)', labelAr: 'الصدقة اليومية (إحسان، مساعدة، تبسم)', category: 'charity' },
  { id: 'mulk', icon: 'fas fa-star-and-crescent', labelEn: 'Surah Al-Mulk before sleeping', labelUr: 'سونے سے قبل سورۃ الملک کی تلاوت', labelAr: 'قراءة سورة الملك قبل النوم', category: 'sunnah' }
];

export default function MuhasabaView() {
  const { lang, t } = useLanguage();
  const isRtl = lang === 'ur' || lang === 'ar' || lang === 'br';
  const todayKey = new Date().toISOString().split('T')[0];

  // Saved Data: { "2026-10-16": { fajr: true, dhuhr: true, ... }, customHabits: [...] }
  const [dataStore, setDataStore] = useState(() => {
    try {
      const saved = localStorage.getItem('maktaba_muhasaba_v2');
      if (saved) return JSON.parse(saved);
      // Migrate old data if present
      const old = localStorage.getItem('maktaba_muhasaba');
      if (old) {
        const oldParsed = JSON.parse(old);
        return { logs: oldParsed, customHabits: [] };
      }
      return { logs: {}, customHabits: [] };
    } catch (e) {
      return { logs: {}, customHabits: [] };
    }
  });

  const [todayTasks, setTodayTasks] = useState(() => {
    return dataStore.logs?.[todayKey] || {};
  });

  const [customHabits, setCustomHabits] = useState(() => {
    return dataStore.customHabits || [];
  });

  const [newHabitInput, setNewHabitInput] = useState('');

  // Save to localStorage
  useEffect(() => {
    try {
      const updatedStore = {
        logs: {
          ...dataStore.logs,
          [todayKey]: todayTasks
        },
        customHabits
      };
      localStorage.setItem('maktaba_muhasaba_v2', JSON.stringify(updatedStore));
    } catch (e) {}
  }, [todayTasks, customHabits, dataStore.logs, todayKey]);

  const toggleTask = (taskId) => {
    setTodayTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleAddCustomHabit = () => {
    if (!newHabitInput.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newHabit = {
      id: newId,
      icon: 'fas fa-heart',
      labelEn: newHabitInput.trim(),
      labelUr: newHabitInput.trim(),
      labelAr: newHabitInput.trim(),
      category: 'custom'
    };
    setCustomHabits(prev => [...prev, newHabit]);
    setNewHabitInput('');
  };

  const handleDeleteCustomHabit = (id) => {
    setCustomHabits(prev => prev.filter(h => h.id !== id));
  };

  const allHabits = useMemo(() => {
    return [...DEFAULT_HABITS, ...customHabits];
  }, [customHabits]);

  // Today Score
  const completedCount = allHabits.filter(h => todayTasks[h.id]).length;
  const totalCount = allHabits.length;
  const percentage = Math.round((completedCount / (totalCount || 1)) * 100);

  // Calculate Streak
  const streakStats = useMemo(() => {
    const logs = dataStore.logs || {};
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check sorted dates backwards starting from yesterday or today
    const now = new Date();
    let checkDate = new Date(now);

    // If today is completed >= 40%, count today in current streak
    if (percentage >= 40) {
      currentStreak++;
    }

    // Go back day by day
    for (let i = 1; i <= 365; i++) {
      const prevDate = new Date(now);
      prevDate.setDate(prevDate.getDate() - i);
      const dateStr = prevDate.toISOString().split('T')[0];
      const dayLog = logs[dateStr] || {};
      const done = Object.values(dayLog).filter(Boolean).length;

      if (done >= 3) {
        currentStreak++;
      } else {
        break; // Streak broken
      }
    }

    // Best record
    const allDates = Object.keys(logs).sort();
    for (let d of allDates) {
      const done = Object.values(logs[d]).filter(Boolean).length;
      if (done >= 3) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    return {
      current: currentStreak,
      best: Math.max(longestStreak, currentStreak)
    };
  }, [dataStore.logs, percentage]);

  // 30 Days History for Heatmap
  const historyList = useMemo(() => {
    const list = [];
    const logs = dataStore.logs || {};
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = dateStr === todayKey ? todayTasks : (logs[dateStr] || {});
      const completed = Object.values(dayTasks).filter(Boolean).length;
      list.push({ date: dateStr, completed });
    }
    return list;
  }, [dataStore.logs, todayTasks, todayKey]);

  return (
    <div style={{ background: 'var(--bg-main, #f8fafc)', minHeight: '90vh', padding: '2rem 1rem', direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Header Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #1e1b4b 100%)',
          borderRadius: '24px', padding: '2.5rem 2rem', color: '#ffffff',
          marginBottom: '2rem', border: '2px solid #10b981', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '30px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(16,185,129,0.4)', marginBottom: '0.75rem' }}>
                <Sparkles size={15} style={{ color: '#34d399' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#a7f3d0', letterSpacing: '0.5px' }}>
                  {lang === 'ar' ? 'المحاسبة الإيمانية والاستقامة' : (lang === 'ur' || lang === 'br') ? 'محاسبہ نفس و روزانہ اعمال نامہ' : 'DAILY SPIRITUAL MUHASABA & HABITS'}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
                {lang === 'ar' ? 'متابعة العبادات والأوراد اليومية' : (lang === 'ur' || lang === 'br') ? 'روزانہ نیکیوں کا اسٹریک و ہیبٹ ٹریکر' : 'Daily Islamic Habit & Streak Tracker'}
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '620px', margin: 0, lineHeight: 1.6 }}>
                {lang === 'ar'
                  ? 'قال رسول الله ﷺ: «أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ». حافظ على وردك اليومي ونمِّ استقامتك خطوة بخطوة.'
                  : (lang === 'ur' || lang === 'br')
                  ? 'فرمانِ نبوی ﷺ: «اللہ کو سب سے زیادہ محبوب وہ عمل ہے جس پر ہمیشگی کی جائے اگرچہ تھوڑا ہو» (صحیح بخاری)۔ اپنی روزانہ کی نیکیوں پر استقلال پیدا کریں۔'
                  : 'The Prophet ﷺ said: "The deeds most loved by Allah are those done consistently, even if small." Build steady spiritual consistency daily.'}
              </p>
            </div>

            {/* Streak & Today Progress Widget */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Flame Streak Pill */}
              <div style={{
                background: 'rgba(0,0,0,0.3)', border: '1.5px solid #f59e0b',
                borderRadius: '20px', padding: '1.25rem 1.5rem', textAlign: 'center', minWidth: '110px'
              }}>
                <Flame size={28} style={{ color: '#f59e0b', margin: '0 auto 4px', filter: 'drop-shadow(0 2px 8px rgba(245,158,11,0.5))' }} />
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fcd34d' }}>
                  {streakStats.current} {lang === 'ar' ? 'يوم' : (lang === 'ur' || lang === 'br') ? 'دن' : 'Days'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  {lang === 'ar' ? 'سلسلة الاستمرار' : (lang === 'ur' || lang === 'br') ? 'لائیو اسٹریک' : 'Current Streak'}
                </div>
              </div>

              {/* Today Percentage Ring */}
              <div style={{
                background: 'rgba(0,0,0,0.3)', border: '1.5px solid #10b981',
                borderRadius: '20px', padding: '1.25rem 1.5rem', textAlign: 'center', minWidth: '110px'
              }}>
                <Award size={28} style={{ color: '#10b981', margin: '0 auto 4px' }} />
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399' }}>
                  {percentage}%
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  {completedCount} / {totalCount} {lang === 'ar' ? 'منجز' : (lang === 'ur' || lang === 'br') ? 'مکمل' : 'Done'}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Main Two Column Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))', gap: '1.75rem' }}>
          
          {/* Column 1: Today's Interactive Checklist */}
          <div style={{
            background: 'var(--surface-paper)', borderRadius: '20px', padding: '1.75rem',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                ✓ {lang === 'ar' ? 'قائمة أوراد اليوم' : (lang === 'ur' || lang === 'br') ? 'آج کے اعمال و معمولات' : 'Today\'s Spiritual Checklist'}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {allHabits.map((habit) => {
                const isDone = !!todayTasks[habit.id];
                return (
                  <label
                    key={habit.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: '14px', cursor: 'pointer',
                      background: isDone ? '#ecfdf5' : '#f8fafc',
                      border: isDone ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleTask(habit.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
                      />
                      <i className={habit.icon} style={{ color: isDone ? '#059669' : '#94a3b8', fontSize: '1.1rem', width: '22px', textAlign: 'center' }} />
                      <span style={{
                        fontSize: '0.92rem', fontWeight: isDone ? 700 : 500,
                        color: isDone ? '#065f46' : '#334155',
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}>
                        {lang === 'ar' ? habit.labelAr : (lang === 'ur' || lang === 'br') ? habit.labelUr : habit.labelEn}
                      </span>
                    </div>

                    {habit.category === 'custom' && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleDeleteCustomHabit(habit.id); }}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Add Custom Habit Form */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newHabitInput}
                onChange={(e) => setNewHabitInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomHabit()}
                placeholder={lang === 'ar' ? 'أضف ورداً خاصاً (مثل: درود 100 مرة)...' : (lang === 'ur' || lang === 'br') ? 'نیا ذاتی معمول شامل کریں (مثلاً: درود شریف 100 بار)...' : 'Add custom habit (e.g. 100x Salawat)...'}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: '10px',
                  border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomHabit}
                style={{
                  background: '#059669', color: '#fff', border: 'none',
                  padding: '9px 16px', borderRadius: '10px', fontWeight: 800,
                  fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', gap: '4px'
                }}
              >
                <Plus size={16} />
                <span>{lang === 'ar' ? 'إضافة' : (lang === 'ur' || lang === 'br') ? 'شامل کریں' : 'Add'}</span>
              </button>
            </div>
          </div>

          {/* Column 2: 30-Day Heatmap & Spiritual Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* 30-Day Activity Heatmap */}
            <div style={{
              background: 'var(--surface-paper)', borderRadius: '20px', padding: '1.75rem',
              border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                📅 {lang === 'ar' ? 'سجل الالتزام (آخر ٣٠ يوماً)' : (lang === 'ur' || lang === 'br') ? 'گزشتہ 30 ایام کا استقلال و سرگرمی' : '30-Day Consistency Heatmap'}
              </h3>
              <p style={{ margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.82rem' }}>
                {lang === 'ar' ? 'كلما كان المربع أكثر اخضراراً دلّ على كثرة الطاعات المنجزة.' : (lang === 'ur' || lang === 'br') ? 'جتنا گہرا سبز خانہ ہوگا اتنا زیادہ آپ نے اس دن اپنے معمولات پورے کیے۔' : 'Darker green indicates higher spiritual habit completion.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
                {historyList.map((day, idx) => {
                  let bg = '#f1f5f9';
                  if (day.completed > 0) bg = '#bbf7d0';
                  if (day.completed >= 3) bg = '#4ade80';
                  if (day.completed >= 6) bg = '#16a34a';
                  if (day.completed >= 8) bg = '#15803d';

                  return (
                    <div
                      key={idx}
                      title={`${day.date}: ${day.completed} habits done`}
                      style={{
                        aspectRatio: '1/1', borderRadius: '8px', background: bg,
                        border: '1px solid rgba(0,0,0,0.05)', transition: 'transform 0.15s',
                        cursor: 'help'
                      }}
                    />
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>{lang === 'ar' ? 'أقل' : (lang === 'ur' || lang === 'br') ? 'کم' : 'Less'}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f1f5f9' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#bbf7d0' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#4ade80' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#16a34a' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#15803d' }} />
                </div>
                <span>{lang === 'ar' ? 'أكثر' : (lang === 'ur' || lang === 'br') ? 'زیادہ' : 'More'}</span>
              </div>
            </div>

            {/* Spiritual Achievement Badges */}
            <div style={{
              background: 'var(--surface-paper)', borderRadius: '20px', padding: '1.75rem',
              border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                🏆 {lang === 'ar' ? 'الأوسمة الإيمانية' : (lang === 'ur' || lang === 'br') ? 'روحانی تمغے اور اسناد' : 'Spiritual Achievement Badges'}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  {
                    titleEn: 'Fajr Champion',
                    titleUr: 'فجر کا استقلال',
                    titleAr: 'فارس الفجر',
                    descEn: 'Fajr prayer logged today',
                    descUr: 'آج نمازِ فجر ادا کی',
                    descAr: 'صلاة الفجر في موعدها',
                    icon: 'fas fa-sun',
                    unlocked: !!todayTasks.fajr
                  },
                  {
                    titleEn: 'Quran Devotee',
                    titleUr: 'صاحبِ قرآن',
                    titleAr: 'أهل القرآن',
                    descEn: 'Daily Quran recitation done',
                    descUr: 'تلاوتِ قرآن مکمل کی',
                    descAr: 'تلاوة ورد القرآن',
                    icon: 'fas fa-book-open',
                    unlocked: !!todayTasks.quran
                  },
                  {
                    titleEn: 'Dhikr Guardian',
                    titleUr: 'ذاکرین الہیٰ',
                    titleAr: 'حصن الذاكرين',
                    descEn: 'Morning & evening azkar done',
                    descUr: 'صبح و شام کے اذکار',
                    descAr: 'أذكار الصباح والمساء',
                    icon: 'fas fa-shield-alt',
                    unlocked: !!todayTasks.azkar
                  },
                  {
                    titleEn: '7-Day Streak',
                    titleUr: 'ہفتہ وار استقامت',
                    titleAr: 'استقامة ٧ أيام',
                    descEn: '7+ consecutive days logged',
                    descUr: '7 دن مسلسل استقلال',
                    descAr: 'مواظبة أسبوعية',
                    icon: 'fas fa-fire',
                    unlocked: streakStats.current >= 7
                  }
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: badge.unlocked ? '#ecfdf5' : '#f8fafc',
                      border: badge.unlocked ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                      borderRadius: '14px', padding: '12px', textAlign: 'center',
                      opacity: badge.unlocked ? 1 : 0.6
                    }}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: badge.unlocked ? '#10b981' : '#cbd5e1',
                      color: '#ffffff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', margin: '0 auto 6px', fontSize: '1rem'
                    }}>
                      <i className={badge.icon} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: badge.unlocked ? '#065f46' : '#64748b' }}>
                      {lang === 'ar' ? badge.titleAr : (lang === 'ur' || lang === 'br') ? badge.titleUr : badge.titleEn}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                      {lang === 'ar' ? badge.descAr : (lang === 'ur' || lang === 'br') ? badge.descUr : badge.descEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
