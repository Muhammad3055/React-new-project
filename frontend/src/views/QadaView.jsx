import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  CheckCircle2, Clock, Calendar, Calculator, Sparkles, 
  RotateCcw, BookOpen, AlertCircle, Plus, Minus, ArrowRight,
  TrendingUp, Award, ShieldCheck, Sun, Moon
} from 'lucide-react';

export default function QadaView({ navigateToTab }) {
  const { t, lang } = useLanguage();

  // Tab State: 'tracker' | 'calculator' | 'fiqh'
  const [activeTab, setActiveTab] = useState('tracker');

  // Daily Makeup Pace: e.g. 1 day per day (1 with each Fard) or 2 days/day
  const [dailyPace, setDailyPace] = useState(() => {
    try {
      return parseInt(localStorage.getItem('maktaba_qada_daily_pace') || '1', 10);
    } catch (e) {
      return 1;
    }
  });

  // Default Initial Data
  const defaultQadaData = {
    fajr: { total: 365, completed: 42 },
    dhuhr: { total: 365, completed: 42 },
    asr: { total: 365, completed: 40 },
    maghrib: { total: 365, completed: 45 },
    isha: { total: 365, completed: 38 },
    witr: { total: 365, completed: 35 },
    fasts: { total: 30, completed: 6 }
  };

  const [qadaData, setQadaData] = useState(() => {
    try {
      const saved = localStorage.getItem('maktaba_qada_data_v2');
      return saved ? JSON.parse(saved) : defaultQadaData;
    } catch (e) {
      return defaultQadaData;
    }
  });

  // Calculator Inputs
  const [calcInputs, setCalcInputs] = useState({
    currentAge: 25,
    bulughAge: 14,
    regularStartAge: 21,
    customMissedYears: 0,
    customMissedMonths: 0,
    gender: 'male',
    extraMissedFasts: 0
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('maktaba_qada_data_v2', JSON.stringify(qadaData));
      localStorage.setItem('maktaba_qada_daily_pace', dailyPace.toString());
      // Also sync single fasts key used by user dashboard
      const remainingFasts = Math.max(0, (qadaData.fasts?.total || 0) - (qadaData.fasts?.completed || 0));
      localStorage.setItem('maktaba_qada_fasts', remainingFasts.toString());
    } catch (e) {}
  }, [qadaData, dailyPace]);

  // Update specific prayer count
  const updateCompleted = (prayerKey, delta) => {
    setQadaData(prev => {
      const item = prev[prayerKey] || { total: 0, completed: 0 };
      const nextCompleted = Math.max(0, Math.min(item.total, item.completed + delta));
      return {
        ...prev,
        [prayerKey]: {
          ...item,
          completed: nextCompleted
        }
      };
    });
  };

  // Quick Action: Log 1 full day of Qaza (all 6 prayers)
  const logFullDayBatch = (daysCount = 1) => {
    setQadaData(prev => {
      const updated = { ...prev };
      const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'];
      prayers.forEach(p => {
        const item = updated[p] || { total: 0, completed: 0 };
        updated[p] = {
          ...item,
          completed: Math.min(item.total, item.completed + daysCount)
        };
      });
      return updated;
    });
  };

  // Run Calculator Wizard
  const handleCalculateQada = (e) => {
    e.preventDefault();
    let missedYears = 0;

    if (calcInputs.customMissedYears > 0 || calcInputs.customMissedMonths > 0) {
      missedYears = parseFloat(calcInputs.customMissedYears || 0) + (parseFloat(calcInputs.customMissedMonths || 0) / 12);
    } else {
      const diff = Math.max(0, calcInputs.regularStartAge - calcInputs.bulughAge);
      missedYears = diff;
    }

    const totalDays = Math.round(missedYears * 365);
    const totalFasts = Math.round(missedYears * 30) + (parseInt(calcInputs.extraMissedFasts, 10) || 0);

    setQadaData({
      fajr: { total: totalDays, completed: 0 },
      dhuhr: { total: totalDays, completed: 0 },
      asr: { total: totalDays, completed: 0 },
      maghrib: { total: totalDays, completed: 0 },
      isha: { total: totalDays, completed: 0 },
      witr: { total: totalDays, completed: 0 },
      fasts: { total: totalFasts, completed: 0 }
    });

    setActiveTab('tracker');
  };

  const resetAllQada = () => {
    if (window.confirm('Are you sure you want to reset all Qaza tracker records to zero?')) {
      setQadaData({
        fajr: { total: 0, completed: 0 },
        dhuhr: { total: 0, completed: 0 },
        asr: { total: 0, completed: 0 },
        maghrib: { total: 0, completed: 0 },
        isha: { total: 0, completed: 0 },
        witr: { total: 0, completed: 0 },
        fasts: { total: 0, completed: 0 }
      });
    }
  };

  // Calculations & Progress Statistics
  const prayersList = [
    { key: 'fajr', name: 'Fajr', urdu: 'فجر', rakats: '2 Fard', icon: <Sun size={20} style={{ color: '#d97706' }} /> },
    { key: 'dhuhr', name: 'Dhuhr', urdu: 'ظہر', rakats: '4 Fard', icon: <Sun size={20} style={{ color: '#059669' }} /> },
    { key: 'asr', name: 'Asr', urdu: 'عصر', rakats: '4 Fard', icon: <Sun size={20} style={{ color: '#2563eb' }} /> },
    { key: 'maghrib', name: 'Maghrib', urdu: 'مغرب', rakats: '3 Fard', icon: <Moon size={20} style={{ color: '#dc2626' }} /> },
    { key: 'isha', name: 'Isha', urdu: 'عشاء', rakats: '4 Fard', icon: <Moon size={20} style={{ color: '#7c3aed' }} /> },
    { key: 'witr', name: 'Witr', urdu: 'وتر واجب', rakats: '3 Wajib', icon: <Sparkles size={20} style={{ color: '#f59e0b' }} /> }
  ];

  let totalPrayersOwed = 0;
  let totalPrayersDone = 0;

  prayersList.forEach(p => {
    const item = qadaData[p.key] || { total: 0, completed: 0 };
    totalPrayersOwed += item.total;
    totalPrayersDone += item.completed;
  });

  const totalPrayersRemaining = Math.max(0, totalPrayersOwed - totalPrayersDone);
  const overallPrayerPercent = totalPrayersOwed > 0 
    ? Math.round((totalPrayersDone / totalPrayersOwed) * 100) 
    : 100;

  // Estimated Days to Debt Freedom
  // 1 full day of Qaza = 6 prayers
  const remainingDaysEquivalent = Math.ceil(totalPrayersRemaining / 6);
  const calendarDaysToFinish = dailyPace > 0 ? Math.ceil(remainingDaysEquivalent / dailyPace) : 0;

  const estimatedEndDate = new Date();
  estimatedEndDate.setDate(estimatedEndDate.getDate() + calendarDaysToFinish);

  const formattedEta = calendarDaysToFinish > 0 
    ? estimatedEndDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Fully Complete!';

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #1e1b4b 100%)',
          borderRadius: '24px', padding: '2.75rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Clock size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px' }}>
              {t('qadaTrackerTitle', 'قضائے عمری (Spiritual Debt Clearance)')}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            {t('qadaTrackerTitle', 'Qaza-e-Umri (Missed Salah & Fasting) Tracker')}
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.02rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            {t('qadaSubtitle', 'Fulfill your divine obligations with peace of mind. Calculate past missed prayers, log daily makeups, and track your steady path to spiritual debt freedom.')}
          </p>

          {/* Navigation Sub-Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('tracker')}
              style={{
                padding: '10px 22px', borderRadius: '16px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none',
                background: activeTab === 'tracker' ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'tracker' ? '#000' : '#ffffff',
                boxShadow: activeTab === 'tracker' ? '0 4px 14px rgba(245,158,11,0.4)' : 'none'
              }}
            >
              <CheckCircle2 size={18} />
              <span>{t('qadaTabTracker', '1. Active Qaza Tracker')}</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              style={{
                padding: '10px 22px', borderRadius: '16px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none',
                background: activeTab === 'calculator' ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'calculator' ? '#000' : '#ffffff',
                boxShadow: activeTab === 'calculator' ? '0 4px 14px rgba(245,158,11,0.4)' : 'none'
              }}
            >
              <Calculator size={18} />
              <span>{t('qadaTabCalculator', '2. Qaza Calculator Wizard')}</span>
            </button>

            <button
              onClick={() => setActiveTab('fiqh')}
              style={{
                padding: '10px 22px', borderRadius: '16px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none',
                background: activeTab === 'fiqh' ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'fiqh' ? '#000' : '#ffffff',
                boxShadow: activeTab === 'fiqh' ? '0 4px 14px rgba(245,158,11,0.4)' : 'none'
              }}
            >
              <BookOpen size={18} />
              <span>{t('qadaTabFiqh', '3. Method & Fiqh Rulings')}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ACTIVE QAZA TRACKER                                */}
        {/* ========================================================= */}
        {activeTab === 'tracker' && (
          <div>
            {/* Top Stat Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              
              {/* Total Completed */}
              <div style={statCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={statLabelStyle}>{t('completedPrayers', 'Total Prayers Made Up')}</span>
                  <Award size={20} style={{ color: '#059669' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669' }}>
                  {totalPrayersDone.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                  {totalPrayersOwed.toLocaleString()} ({overallPrayerPercent}%)
                </div>
              </div>

              {/* Remaining */}
              <div style={statCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={statLabelStyle}>{t('remainingDebt', 'Remaining Balance')}</span>
                  <Clock size={20} style={{ color: '#d97706' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#d97706' }}>
                  {totalPrayersRemaining.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                  ≈ {remainingDaysEquivalent.toLocaleString()} {t('daysOfFasting', 'days')}
                </div>
              </div>

              {/* Projected Completion Date */}
              <div style={statCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={statLabelStyle}>{t('estimatedDebtFree', 'Estimated Completion Date')}</span>
                  <Calendar size={20} style={{ color: '#2563eb' }} />
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1e293b' }}>
                  {formattedEta}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                  {dailyPace} {t('daysRemaining', 'days/day')}
                </div>
              </div>

            </div>

            {/* Quick Batch Actions & Pace Selector */}
            <div style={{
              background: '#ffffff', borderRadius: '20px', padding: '1.5rem',
              border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              marginBottom: '2rem', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem'
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  ⚡ {t('batchLog1Day', 'Quick Daily Makeup Batch Actions')}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  {t('qadaSubtitle', 'Conveniently log complete days of Qaza in a single tap instead of logging each prayer individually.')}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => logFullDayBatch(1)}
                  style={{
                    background: '#059669', color: '#fff', border: 'none',
                    padding: '10px 18px', borderRadius: '12px', fontWeight: 800,
                    fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex',
                    alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(5,150,105,0.25)'
                  }}
                >
                  <Plus size={16} /> {t('batchLog1Day', 'Log 1 Full Day (All 6 Prayers)')}
                </button>

                <button
                  type="button"
                  onClick={() => logFullDayBatch(5)}
                  style={{
                    background: '#022c22', color: '#fcd34d', border: '1px solid #f59e0b',
                    padding: '10px 16px', borderRadius: '12px', fontWeight: 800,
                    fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex',
                    alignItems: 'center', gap: '6px'
                  }}
                >
                  <Plus size={16} /> {t('batchLog5Days', 'Log 5 Days Batch')}
                </button>

                {/* Daily Target Pace Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '6px 12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>{t('dailyMakeupPace', 'Target Pace')}:</span>
                  <select
                    value={dailyPace}
                    onChange={e => setDailyPace(parseInt(e.target.value, 10))}
                    style={{ background: 'transparent', border: 'none', fontWeight: 800, color: '#059669', cursor: 'pointer', outline: 'none' }}
                  >
                    <option value={1}>1 day / day (+1 with each Fard)</option>
                    <option value={2}>2 days / day (+2 with each Fard)</option>
                    <option value={3}>3 days / day (+3 with each Fard)</option>
                    <option value={5}>5 days / day (Fast track)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Individual Prayer Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {prayersList.map(prayer => {
                const item = qadaData[prayer.key] || { total: 0, completed: 0 };
                const remaining = Math.max(0, item.total - item.completed);
                const percent = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 100;

                return (
                  <div
                    key={prayer.key}
                    style={{
                      background: '#ffffff', borderRadius: '20px', padding: '1.5rem',
                      border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {prayer.icon}
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                              {prayer.name} ({prayer.urdu})
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{prayer.rakats}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                            {remaining.toLocaleString()}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Remaining</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>
                          <span>Done: {item.completed.toLocaleString()} / {item.total.toLocaleString()}</span>
                          <span style={{ color: '#059669' }}>{percent}%</span>
                        </div>
                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #10b981)', borderRadius: '6px', transition: 'width 0.3s ease' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Increment Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => updateCompleted(prayer.key, 1)}
                        style={{
                          flex: 2, padding: '8px 12px', borderRadius: '10px',
                          background: '#059669', color: '#ffffff', border: 'none',
                          fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                        }}
                      >
                        <Plus size={16} /> +1 {t('completed', 'Made Up')}
                      </button>

                      <button
                        type="button"
                        onClick={() => updateCompleted(prayer.key, 5)}
                        style={{
                          flex: 1, padding: '8px 10px', borderRadius: '10px',
                          background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1',
                          fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                        }}
                      >
                        +5
                      </button>

                      <button
                        type="button"
                        onClick={() => updateCompleted(prayer.key, -1)}
                        style={{
                          padding: '8px 12px', borderRadius: '10px',
                          background: '#fee2e2', color: '#dc2626', border: 'none',
                          fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                        }}
                        title="Undo"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ramadan Missed Fasts (Roza) Card */}
            <div style={{
              background: '#ffffff', borderRadius: '20px', padding: '1.75rem',
              border: '2px solid #f59e0b', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              marginBottom: '2rem', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontSize: '1.5rem' }}>
                  <Moon size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {t('fastsMissed', 'Ramadan Missed Fasts (قضاء روزے)')}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    {t('qadaSubtitle', 'Keep track of past missed Ramadan fasts due to illness, travel, or negligence.')}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#b45309' }}>
                    {Math.max(0, (qadaData.fasts?.total || 0) - (qadaData.fasts?.completed || 0))}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>{t('remainingDebt', 'Fasts Remaining')}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => updateCompleted('fasts', 1)}
                    style={{
                      background: '#059669', color: '#ffffff', border: 'none',
                      padding: '10px 18px', borderRadius: '12px', fontWeight: 800,
                      fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex',
                      alignItems: 'center', gap: '4px'
                    }}
                  >
                    <Plus size={16} /> +1 {t('completed', 'Fast Made Up')}
                  </button>

                  <button
                    type="button"
                    onClick={() => updateCompleted('fasts', -1)}
                    style={{
                      background: '#fee2e2', color: '#dc2626', border: 'none',
                      padding: '10px 14px', borderRadius: '12px', fontWeight: 800,
                      fontSize: '0.88rem', cursor: 'pointer'
                    }}
                    title="Undo"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                style={{
                  background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1',
                  padding: '10px 18px', borderRadius: '12px', fontWeight: 700,
                  fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', gap: '6px'
                }}
              >
                <Calculator size={16} /> Re-calculate with Wizard
              </button>

              <button
                type="button"
                onClick={resetAllQada}
                style={{
                  background: 'transparent', color: '#ef4444', border: '1px solid #fecaca',
                  padding: '8px 16px', borderRadius: '12px', fontWeight: 700,
                  fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', gap: '6px'
                }}
              >
                <RotateCcw size={16} /> Reset All Qaza Data
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CALCULATOR WIZARD                                  */}
        {/* ========================================================= */}
        {activeTab === 'calculator' && (
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div style={{
              background: '#ffffff', borderRadius: '24px', padding: '2.5rem 2rem',
              border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(5,150,105,0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Calculator size={30} />
                </div>
                <h2 style={{ margin: '0 0 6px', fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                  {t('qadaCalcTitle', 'Qaza-e-Umri Calculation Wizard')}
                </h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
                  {t('qadaCalcDesc', 'Estimate your total missed prayers accurately based on your age of puberty (Bulugh) and when you began praying regularly.')}
                </p>
              </div>

              <form onSubmit={handleCalculateQada} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>{t('currentAge', 'Your Current Age (Years)')}</label>
                    <input
                      type="number"
                      min="15"
                      max="100"
                      value={calcInputs.currentAge}
                      onChange={e => setCalcInputs({ ...calcInputs, currentAge: parseInt(e.target.value, 10) || 0 })}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>{t('bulughAge', 'Age of Puberty / Bulugh (Defaults: 14 Boys, 12 Girls)')}</label>
                    <input
                      type="number"
                      min="10"
                      max="18"
                      value={calcInputs.bulughAge}
                      onChange={e => setCalcInputs({ ...calcInputs, bulughAge: parseInt(e.target.value, 10) || 14 })}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{t('regularAge', 'Age When You Began Praying All 5 Daily Prayers Regularly')}</label>
                  <input
                    type="number"
                    min={calcInputs.bulughAge}
                    max={calcInputs.currentAge}
                    value={calcInputs.regularStartAge}
                    onChange={e => setCalcInputs({ ...calcInputs, regularStartAge: parseInt(e.target.value, 10) || calcInputs.bulughAge })}
                    style={inputStyle}
                    required
                  />
                  <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    {t('yearsMissed', 'Years missed without regular Salah')}: <strong>{Math.max(0, calcInputs.regularStartAge - calcInputs.bulughAge)} {t('yearsMissed', 'years')}</strong>
                  </span>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                  <label style={{ ...labelStyle, color: '#0f172a', fontWeight: 800 }}>
                    {t('yearsMissed', 'OR Enter Direct Custom Missed Time (Optional Override)')}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>{t('yearsMissed', 'Exact Missed Years')}</label>
                      <input
                        type="number"
                        min="0"
                        value={calcInputs.customMissedYears}
                        onChange={e => setCalcInputs({ ...calcInputs, customMissedYears: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 3"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{t('monthsMissed', 'Additional Missed Months')}</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={calcInputs.customMissedMonths}
                        onChange={e => setCalcInputs({ ...calcInputs, customMissedMonths: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 6"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{t('fastsMissed', 'Extra Missed Ramadan Fasts (Travel, Sickness, Postnatal, etc.)')}</label>
                  <input
                    type="number"
                    min="0"
                    value={calcInputs.extraMissedFasts}
                    onChange={e => setCalcInputs({ ...calcInputs, extraMissedFasts: parseInt(e.target.value, 10) || 0 })}
                    placeholder="e.g. 15 days"
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#059669', color: '#ffffff', border: 'none',
                    padding: '12px 24px', borderRadius: '14px', fontWeight: 800,
                    fontSize: '1rem', cursor: 'pointer', marginTop: '1rem',
                    boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  <Calculator size={18} /> {t('calculateMyQada', 'Apply Calculated Totals to Tracker')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: METHOD & FIQH RULINGS                              */}
        {/* ========================================================= */}
        {activeTab === 'fiqh' && (
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{
              background: '#ffffff', borderRadius: '24px', padding: '2.5rem 2rem',
              border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064e3b', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                {t('qadaFiqhTitle', 'Islamic Jurisprudence (Fiqh) of Qaza-e-Umri')}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#334155', lineHeight: 1.7, fontSize: '0.94rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px', color: '#0f172a', fontSize: '1.05rem', fontWeight: 800 }}>
                    1. Is Qaza-e-Umri Obligatory in Islam?
                  </h4>
                  <p style={{ margin: 0 }}>
                    Yes. All four recognized schools of Islamic Sunni jurisprudence (Hanafi, Maliki, Shafi'i, and Hanbali) hold that missed obligatory prayers remain a debt upon the person until prayed or forgiven by Allah. Prophet Muhammad (PBUH) stated: <em>"A debt owed to Allah has more right to be paid."</em> (Sahih al-Bukhari).
                  </p>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 6px', color: '#0f172a', fontSize: '1.05rem', fontWeight: 800 }}>
                    2. Method to Pray Qaza Quickly &amp; Efficiently
                  </h4>
                  <p style={{ margin: 0 }}>
                    To make fulfilling years of missed prayers achievable without burnout, Islamic scholars have outlined permissible sunnah facilitations:
                  </p>
                  <ul style={{ margin: '6px 0 0', paddingLeft: '22px' }}>
                    <li><strong>Only Fard &amp; Witr:</strong> In Qaza-e-Umri, only the 17 obligatory Rakats of the day are made up: Fajr (2 Fard), Dhuhr (4 Fard), Asr (4 Fard), Maghrib (3 Fard), Isha (4 Fard), and Witr (3 Wajib). Sunnah Mu'akkadah from the past are not made up.</li>
                    <li><strong>3rd &amp; 4th Rakat:</strong> In the 3rd and 4th Rakat of Fard prayers, reciting only Surah Al-Fatiha or simply saying <em>"SubhanAllah"</em> three times is permissible according to Hanafi jurists.</li>
                    <li><strong>Ruku &amp; Sujud:</strong> Recite <em>"Subhana Rabbiyal Azeem"</em> and <em>"Subhana Rabbiyal A'la"</em> exactly 3 times without prolonging.</li>
                    <li><strong>Tashahhud:</strong> In the final sitting, recite the standard Tashahhud (Attahiyyat), brief Durood-e-Ibrahim, and a short supplication (e.g. <em>"Rabbana Atina fid-dunya hasanah"</em>).</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 6px', color: '#0f172a', fontSize: '1.05rem', fontWeight: 800 }}>
                    3. Prohibited Times for Praying Qaza
                  </h4>
                  <p style={{ margin: 0 }}>
                    Qaza Salah may be prayed at any hour of the day or night, except during the <strong>three strictly forbidden times</strong>:
                  </p>
                  <ul style={{ margin: '6px 0 0', paddingLeft: '22px' }}>
                    <li>During Sunrise (from when the sun begins to rise until it is above the horizon, approx. 15 minutes).</li>
                    <li>At exact solar noon / Zenith (Zawal - when the sun is at its highest meridian, approx. 5-10 minutes before Dhuhr begins).</li>
                    <li>During Sunset (when the sun turns pale yellow until it sets, except for that day's Maghrib).</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 6px', color: '#0f172a', fontSize: '1.05rem', fontWeight: 800 }}>
                    4. Practical Strategy: "+1 With Each Fard"
                  </h4>
                  <p style={{ margin: 0 }}>
                    The easiest, most consistent method recommended by scholars is to pray <strong>one Qaza prayer with every corresponding daily Fard prayer</strong>:
                    e.g. after today's Fajr prayer, pray 2 Rakats of Qaza Fajr. After Dhuhr, pray 4 Rakats of Qaza Dhuhr. In this manner, you effortlessly complete 1 full year of missed Salah every single calendar year!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  borderRadius: '12px',
  border: '1.5px solid #cbd5e1',
  outline: 'none',
  fontSize: '0.9rem',
  background: '#ffffff',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '#475569',
  marginBottom: '4px'
};

const statCardStyle = {
  background: '#ffffff',
  borderRadius: '20px',
  padding: '1.5rem',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
};

const statLabelStyle = {
  fontSize: '0.82rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: '#64748b'
};
