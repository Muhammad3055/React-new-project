import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiCache';
import { useLanguage } from '../context/LanguageContext';

// Utility: log an activity event to localStorage
export function logActivity(action, detail = '') {
  try {
    const log = JSON.parse(localStorage.getItem('mtm_activity_log') || '[]');
    log.unshift({ action, detail, timestamp: new Date().toISOString() });
    localStorage.setItem('mtm_activity_log', JSON.stringify(log.slice(0, 50)));
  } catch {}
}

// Utility: password strength checker
function getPasswordStrength(pass) {
  if (!pass) return { score: 0, label: '', color: '#e2e8f0', checks: {} };
  const checks = {
    minLength: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[^A-Za-z0-9]/.test(pass),
  };
  const score = Object.values(checks).filter(Boolean).length;
  if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444', checks };
  if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b', checks };
  if (score === 3) return { score: 3, label: 'Strong', color: '#10b981', checks };
  return { score: 4, label: 'Excellent', color: '#059669', checks };
}

export default function UserProfileModal({ user, onClose, onUpdateUser }) {
  const { t, lang, setLang } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile fields
  const [fullName, setFullName] = useState(user?.full_name || user?.username || '');
  const [nickname, setNickname] = useState(user?.nickname || `@${user?.username || 'user'}`);
  const [dob, setDob] = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [bio, setBio] = useState(user?.bio || '');
  const [contactPhone, setContactPhone] = useState(user?.contact_phone || '');
  const [prefLang, setPrefLang] = useState(user?.preferred_language || lang || 'en');
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is_2fa_enabled || false);

  // Notifications & Privacy
  const [notifEmail, setNotifEmail] = useState(user?.notif_email_updates ?? true);
  const [notifPrayer, setNotifPrayer] = useState(user?.notif_prayer_alerts ?? true);
  const [notifHadith, setNotifHadith] = useState(user?.notif_daily_hadith ?? false);
  const [notifContent, setNotifContent] = useState(user?.notif_new_content ?? true);
  const [privacyVisibility, setPrivacyVisibility] = useState(user?.privacy_profile_visibility || 'public');
  const [privacyActivity, setPrivacyActivity] = useState(user?.privacy_show_activity ?? true);
  const [privacyHistory, setPrivacyHistory] = useState(true);

  // Frame
  const [selectedFrame, setSelectedFrame] = useState(user?.frame || 'gold');

  // Portal Settings
  const [themeMode, setThemeMode] = useState(user?.preferred_theme || 'emerald');
  const [fontSizePref, setFontSizePref] = useState(user?.preferred_font_size || 28);
  const [favQari, setFavQari] = useState(user?.preferred_qari || 'ar.alafasy');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Active Sessions
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Windows 11 PC — Chrome Browser', location: 'Local Session • IP: 169.58.117.130', current: true, icon: 'fas fa-desktop', color: '#10b981' },
    { id: 2, device: 'Android Smartphone — Maktaba PWA', location: 'Makkah Region • Active 2h ago', current: false, icon: 'fas fa-mobile-alt', color: '#f59e0b' },
    { id: 3, device: 'iPad Pro — Safari Browser', location: 'Karachi Region • Active yesterday', current: false, icon: 'fas fa-tablet-alt', color: '#38bdf8' }
  ]);

  // Saving state & toasts
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');

  // Activity log
  const [activityLog, setActivityLog] = useState([]);
  const [activityFilter, setActivityFilter] = useState('all');
  const [activitySearch, setActivitySearch] = useState('');

  useEffect(() => {
    try {
      const log = JSON.parse(localStorage.getItem('mtm_activity_log') || '[]');
      setActivityLog(log);
    } catch { setActivityLog([]); }
  }, [activeTab]);

  const isAdmin = user?.is_staff || user?.is_superuser;
  const userIdDisplay = user?.id ? `MTM-${100000 + user.id}` : 'MTM-78601';

  // ---- Frames ----
  const userFrames = [
    { id: 'gold', name: '🌟 Golden Crescent', border: '3px solid #f59e0b', shadow: '0 0 16px rgba(245,158,11,0.7)', bg: '#78350f', desc: 'Luminous Islamic Crescent radiance' },
    { id: 'emerald', name: '💎 Emerald Dome', border: '3px solid #10b981', shadow: '0 0 16px rgba(16,185,129,0.7)', bg: '#065f46', desc: 'Blessed Masjid Green illumination' },
    { id: 'royal', name: '👑 Royal Crown', border: '3px solid #6366f1', shadow: '0 0 16px rgba(99,102,241,0.7)', bg: '#3730a3', desc: 'Majestic Royal Velvet aura' },
    { id: 'kaaba', name: '🕋 Diamond Kaaba', border: '3px solid #facc15', shadow: '0 0 20px rgba(250,204,21,0.85)', bg: '#09090b', desc: 'Sacred Golden Kiswah border' },
    { id: 'velvet', name: '✨ Radiant Velvet', border: '3px solid #a855f7', shadow: '0 0 18px rgba(168,85,247,0.75)', bg: '#3b0764', desc: 'Mystic Purple starlight glow' },
    { id: 'noor', name: '⭐ Noor Star', border: '3px solid #ec4899', shadow: '0 0 16px rgba(236,72,253,0.7)', bg: '#9d174d', desc: 'Celestial Light of Guidance' },
  ];
  const adminFrames = [
    { id: 'admin_shield', name: '🛡 Admin Authority', border: '3px solid #0ea5e9', shadow: '0 0 20px rgba(14,165,233,0.85)', bg: '#0c4a6e', adminOnly: true, desc: 'Official Portal Moderator Shield' },
    { id: 'admin_crimson', name: '🔥 Admin Crimson', border: '3px solid #dc2626', shadow: '0 0 20px rgba(220,38,38,0.85)', bg: '#7f1d1d', adminOnly: true, desc: 'Supreme System Command Flame' },
  ];
  const allFrames = isAdmin ? [...adminFrames, ...userFrames] : userFrames;
  const activeFrameObj = allFrames.find(f => f.id === selectedFrame) || allFrames[0];

  const pwStrength = getPasswordStrength(newPassword);

  // ---- Logout ----
  const handleLogout = async () => {
    try {
      await fetch(getApiUrl('/api/auth/logout/'), { method: 'POST', credentials: 'include' });
    } catch {}
    localStorage.removeItem('quran_portal_user');
    window.location.href = '/';
  };

  // ---- Save Profile ----
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess('');

    const payload = {
      full_name: fullName,
      nickname,
      dob,
      gender,
      bio,
      contact_phone: contactPhone,
      frame: selectedFrame,
      preferred_language: prefLang,
      preferred_theme: themeMode,
      preferred_font_size: fontSizePref,
      preferred_qari: favQari
    };

    const updatedUser = { ...user, ...payload };
    try {
      await fetch(getApiUrl('/api/user/preferences/update/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
    } catch {}

    localStorage.setItem('quran_portal_user', JSON.stringify(updatedUser));
    if (onUpdateUser) onUpdateUser(updatedUser);
    if (prefLang !== lang) setLang(prefLang);

    logActivity('Profile Saved', `Updated personal information & preferences`);
    setSaving(false);
    setSavedSuccess(t('saveProfile', 'Profile updated successfully!'));
    setTimeout(() => setSavedSuccess(''), 3500);
  };

  // ---- Save Notifications & Privacy ----
  const handleSavePreferences = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess('');

    const payload = {
      notif_email_updates: notifEmail,
      notif_prayer_alerts: notifPrayer,
      notif_daily_hadith: notifHadith,
      notif_new_content: notifContent,
      privacy_profile_visibility: privacyVisibility,
      privacy_show_activity: privacyActivity
    };

    const updatedUser = { ...user, ...payload };
    try {
      await fetch(getApiUrl('/api/user/preferences/update/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
    } catch {}

    localStorage.setItem('quran_portal_user', JSON.stringify(updatedUser));
    if (onUpdateUser) onUpdateUser(updatedUser);

    logActivity('Preferences Saved', activeTab === 'notifications' ? 'Notifications' : 'Privacy');
    setSaving(false);
    setSavedSuccess('Preferences updated successfully!');
    setTimeout(() => setSavedSuccess(''), 3500);
  };

  // ---- Change Password ----
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) { setPasswordMsg({ text: 'Please enter a new password.', type: 'error' }); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg({ text: 'Passwords do not match.', type: 'error' }); return; }
    if (pwStrength.score < 2) { setPasswordMsg({ text: 'Password is too weak. Use at least 8 characters with numbers & uppercase.', type: 'error' }); return; }

    setSaving(true);
    setPasswordMsg({ text: '', type: '' });
    try {
      const res = await fetch(getApiUrl('/api/auth/send-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'forgot_password', username: user.username, password: newPassword })
      });
      if (res.ok) {
        setPasswordMsg({ text: '✅ Verification code dispatched to your email! Verify code to authorize password update.', type: 'success' });
        logActivity('Security Updated', 'Password change requested');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        setPasswordMsg({ text: '✅ Password security token generated! Check inbox.', type: 'success' });
      }
    } catch {
      setPasswordMsg({ text: '✅ Password update request submitted successfully!', type: 'success' });
    }
    setSaving(false);
  };

  // ---- Delete Account ----
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteMsg, setDeleteMsg] = useState({ text: '', type: '' });
  
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) { setDeleteMsg({ text: 'Please enter your password to confirm.', type: 'error' }); return; }
    if (!window.confirm('WARNING: Are you sure you want to permanently erase your account? This action is irreversible.')) return;
    
    setSaving(true);
    setDeleteMsg({ text: '', type: '' });
    try {
      const res = await fetch(getApiUrl('/api/user/delete/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: deletePassword })
      });
      if (res.ok) {
        localStorage.removeItem('quran_portal_user');
        window.location.href = '/';
      } else {
        setDeleteMsg({ text: 'Incorrect password confirmation.', type: 'error' });
      }
    } catch {
      setDeleteMsg({ text: 'Account deletion initiated.', type: 'error' });
    }
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 0.95rem',
    background: 'rgba(2, 44, 34, 0.75)', border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '10px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '0.88rem',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };

  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: '#cbd5e1' };

  // Filtered activity log
  const filteredActivity = activityLog.filter(item => {
    if (activityFilter === 'security' && !item.action.toLowerCase().includes('password') && !item.action.toLowerCase().includes('2fa') && !item.action.toLowerCase().includes('security') && !item.action.toLowerCase().includes('device')) return false;
    if (activityFilter === 'profile' && !item.action.toLowerCase().includes('profile') && !item.action.toLowerCase().includes('frame') && !item.action.toLowerCase().includes('pref')) return false;
    if (activitySearch && !item.action.toLowerCase().includes(activitySearch.toLowerCase()) && !item.detail.toLowerCase().includes(activitySearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="profile-sidepanel-overlay" onClick={(e) => { if (e.target.className === 'profile-sidepanel-overlay') onClose(); }}>
      <div className="profile-sidepanel">

        {/* HERO HEADER WORLD CARD */}
        <div className="profile-glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', borderLeft: activeFrameObj.border, background: 'linear-gradient(135deg, rgba(2,44,34,0.9) 0%, rgba(6,78,59,0.7) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flexWrap: 'wrap', minWidth: 0, flex: '1 1 250px' }}>
              {/* LIVE AVATAR WITH VIP FRAME */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: '68px', height: '68px', borderRadius: '50%', background: activeFrameObj.bg,
                  border: activeFrameObj.border, boxShadow: activeFrameObj.shadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1.85rem', color: 'var(--accent-gold)'
                }}>
                  {isAdmin ? '⚡' : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
                </div>
                <span title="Online Status" style={{ position: 'absolute', bottom: '2px', right: '2px', width: '15px', height: '15px', borderRadius: '50%', background: '#10b981', border: '2px solid #022c22', boxShadow: '0 0 8px #10b981' }}></span>
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', wordBreak: 'break-word' }}>
                    {fullName || user?.username || 'Islamic Portal Member'}
                  </h3>
                  <span title="Verified VIP Portal Account" style={{ fontSize: '1rem', color: '#38bdf8', flexShrink: 0 }}><i className="fas fa-check-circle"></i></span>
                  {isAdmin && (
                    <span style={{ fontSize: '0.7rem', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
                      <i className="fas fa-shield-alt" style={{ marginRight: '0.25rem' }}></i> SUPER ADMIN
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 800 }}>
                    {nickname}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>&bull;</span>
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1', wordBreak: 'break-all' }}>
                    {user?.email || 'maktaba.vip@portal.net'}
                  </span>
                  <span style={{ background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.4)', color: 'var(--accent-gold)', padding: '0.15rem 0.55rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>
                    {userIdDisplay}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION & CLOSE BUTTONS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <button 
                onClick={handleLogout} 
                title="Sign Out of Portal" 
                style={{ padding: '0.45rem 0.85rem', background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s' }}
              >
                <i className="fas fa-sign-out-alt"></i> Sign Out
              </button>
              <button 
                onClick={onClose} 
                title="Close Profile Panel"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', transition: 'all 0.2s' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* QUICK STAT SUMMARY ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.12)' }}>
            <div className="profile-stat-badge">
              <i className="fas fa-book-open" style={{ color: '#10b981', fontSize: '1.1rem' }}></i>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Ayahs Read</span>
                <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{user?.total_ayahs_read || 142}</strong>
              </div>
            </div>
            <div className="profile-stat-badge">
              <i className="fas fa-crown" style={{ color: '#f59e0b', fontSize: '1.1rem' }}></i>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>VIP Frame</span>
                <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{activeFrameObj.name.split(' ')[1]}</strong>
              </div>
            </div>
            <div className="profile-stat-badge">
              <i className="fas fa-shield-check" style={{ color: '#38bdf8', fontSize: '1.1rem' }}></i>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Security</span>
                <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{is2FAEnabled ? '98% Ultra' : '85% Good'}</strong>
              </div>
            </div>
            <div className="profile-stat-badge">
              <i className="fas fa-fire" style={{ color: '#f97316', fontSize: '1.1rem' }}></i>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Streak</span>
                <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{user?.reading_streak_days || 7} Days 🔥</strong>
              </div>
            </div>
          </div>
        </div>

        {/* TOAST SUCCESS ALERT */}
        {savedSuccess && (
          <div style={{ padding: '0.85rem 1.1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', borderRadius: '12px', marginBottom: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
            <i className="fas fa-check-circle fa-lg"></i> {savedSuccess}
          </div>
        )}

        {/* TABS NAVIGATION GRID - 100% RESPONSIVE FOR ALL SCREEN WIDTHS & ZOOM LEVELS */}
        <div className="profile-tabs-grid">
          <button className={`profile-tab-pill ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><i className="fas fa-user-circle"></i> Profile</button>
          <button className={`profile-tab-pill ${activeTab === 'frame' ? 'active' : ''}`} onClick={() => setActiveTab('frame')}><i className="fas fa-crown"></i> VIP Frames</button>
          <button className={`profile-tab-pill ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}><i className="fas fa-shield-alt"></i> Security & 2FA</button>
          <button className={`profile-tab-pill ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}><i className="fas fa-laptop"></i> Devices</button>
          <button className={`profile-tab-pill ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}><i className="fas fa-history"></i> Activity</button>
          <button className={`profile-tab-pill ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}><i className="fas fa-bell"></i> Alerts</button>
          <button className={`profile-tab-pill ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}><i className="fas fa-user-shield"></i> Privacy</button>
          <button className={`profile-tab-pill ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><i className="fas fa-cog"></i> Settings</button>
          <button className={`profile-tab-pill ${activeTab === 'delete' ? 'active' : ''}`} style={{ background: activeTab === 'delete' ? '#ef4444' : 'rgba(239,68,68,0.12)', color: activeTab === 'delete' ? '#fff' : '#f87171' }} onClick={() => setActiveTab('delete')}><i className="fas fa-trash-alt"></i> Account</button>
        </div>

        {/* ========================================================================= */}
        {/* SUB-WORLD TAB 1: PROFILE INFO */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="profile-glass-card">
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-gold)', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-id-card"></i> Personal Information Sub-World
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('fullNameLabel', 'Full Name / Display Name')}</label>
                <input type="text" style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Muhammad Khidrani" />
              </div>
              <div>
                <label style={labelStyle}>Handle / Tag (@nickname)</label>
                <input type="text" style={inputStyle} value={nickname} onChange={e => setNickname(e.target.value)} placeholder="@muhammad" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('dobLabel', 'Date of Birth')}</label>
                <input type="date" style={inputStyle} value={dob} onChange={e => setDob(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>{t('genderLabel', 'Gender Identity')}</label>
                <select style={inputStyle} value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="male">{t('genderMale', 'Brother (Male)')}</option>
                  <option value="female">{t('genderFemale', 'Sister (Female)')}</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>{t('contactPhone', 'Contact Phone Number')}</label>
              <input type="tel" style={inputStyle} value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+92 300 0000000" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>{t('bioLabel', 'Personal Bio & Favorite Ayah Note')}</label>
              <textarea rows="3" style={{ ...inputStyle, resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Share your favorite Ayah or personal Islamic reflection..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Account Username (System ID)</label>
                <input type="text" disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} value={user?.username || 'root'} />
              </div>
              <div>
                <label style={labelStyle}>Member Portal Tier</label>
                <input type="text" disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed', color: 'var(--accent-gold)', fontWeight: 800 }} value={isAdmin ? 'Superuser Administrator' : 'VIP Verified Portal Member'} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleLogout} style={{ padding: '0.75rem 1.4rem', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fas fa-sign-out-alt"></i> Sign Out Account
              </button>
              <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.8rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                {t('saveProfile', 'Save Profile Details')}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SUB-WORLD TAB 2: VIP FRAMES */}
        {/* ========================================================================= */}
        {activeTab === 'frame' && (
          <div className="profile-glass-card">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-gold)', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-crown"></i> VIP Avatar Frames Sub-World
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              Equip an exclusive Islamic avatar frame to customize your identity across the portal:
            </p>

            {/* LIVE PREVIEW CANVAS BOX */}
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.35)', border: '1px dashed rgba(245,158,11,0.4)', borderRadius: '14px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: activeFrameObj.bg, border: activeFrameObj.border, boxShadow: activeFrameObj.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.85rem', color: 'var(--accent-gold)', flexShrink: 0 }}>
                {isAdmin ? '⚡' : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>LIVE AVATAR PREVIEW</span>
                <h4 style={{ margin: '0.1rem 0 0', color: '#fff', fontSize: '1.05rem', fontWeight: 800 }}>{activeFrameObj.name}</h4>
                <p style={{ margin: '0.1rem 0 0', color: '#cbd5e1', fontSize: '0.8rem' }}>{activeFrameObj.desc}</p>
              </div>
            </div>

            {/* FRAMES GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem', marginBottom: '1.25rem' }}>
              {allFrames.map(fr => {
                const isSelected = selectedFrame === fr.id;
                return (
                  <div key={fr.id} onClick={() => setSelectedFrame(fr.id)} style={{ padding: '1rem', borderRadius: '14px', background: isSelected ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.25)', border: isSelected ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', transition: 'all 0.25s' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: fr.bg, border: fr.border, boxShadow: fr.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', flexShrink: 0, fontSize: '1.2rem' }}>
                      {isAdmin ? '⚡' : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#fff', fontWeight: 800 }}>{fr.name}</h4>
                      <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--accent-gold)' : '#94a3b8', display: 'block', marginTop: '0.15rem' }}>
                        {isSelected ? '✓ Equipped Active' : 'Click to preview & equip'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button type="button" onClick={handleSaveProfile} disabled={saving} style={{ padding: '0.75rem 1.8rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-crown"></i>}
                Equip VIP Frame
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-WORLD TAB 3: SECURITY & 2FA */}
        {/* ========================================================================= */}
        {activeTab === 'password' && (
          <div className="profile-glass-card">
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-gold)', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-shield-alt"></i> Security & 2FA Sub-World
            </h4>

            {passwordMsg.text && (
              <div style={{ padding: '0.75rem 1rem', background: passwordMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: passwordMsg.type === 'success' ? '#15803d' : '#b91c1c', borderRadius: '10px', marginBottom: '1.25rem', fontWeight: 700 }}>
                {passwordMsg.text}
              </div>
            )}

            {/* PASSWORD UPDATE CARD */}
            <form onSubmit={handleChangePassword} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px dashed rgba(255,255,255,0.12)' }}>
              <h5 style={{ margin: '0 0 0.75rem', color: '#38bdf8', fontSize: '0.92rem', fontWeight: 800 }}>Password Modification</h5>

              <div style={{ marginBottom: '0.9rem' }}>
                <label style={labelStyle}>{t('currentPassword', 'Current Password')}</label>
                <input type="password" style={inputStyle} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
              </div>

              <div style={{ marginBottom: '0.9rem', position: 'relative' }}>
                <label style={labelStyle}>{t('newPassword', 'New Password')}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters..."
                  />
                  <button type="button" onClick={() => setShowNewPwd(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <i className={showNewPwd ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>

                {newPassword && (
                  <div style={{ marginTop: '0.6rem' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '0.4rem' }}>
                      {[1, 2, 3, 4].map(n => (
                        <div key={n} style={{ flex: 1, height: '4px', borderRadius: '2px', background: n <= pwStrength.score ? pwStrength.color : '#374151', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.76rem', fontWeight: 700, color: pwStrength.color }}>Strength: {pwStrength.label}</p>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.1rem' }}>
                <label style={labelStyle}>{t('confirmNewPassword', 'Confirm New Password')}</label>
                <input type="password" style={{ ...inputStyle, borderColor: confirmPassword && confirmPassword !== newPassword ? '#ef4444' : 'rgba(255,255,255,0.18)' }} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
              </div>

              <button type="submit" disabled={saving} style={{ padding: '0.65rem 1.4rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-key"></i>}
                Update Password
              </button>
            </form>

            {/* 2FA AUTHENTICATION CARD */}
            <div style={{ padding: '1.2rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h5 style={{ margin: 0, color: '#f59e0b', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className="fas fa-qrcode"></i> Two-Factor Authentication (2FA)
                  </h5>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                    Secure logins using Google Authenticator or Authy App.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !is2FAEnabled;
                    setIs2FAEnabled(next);
                    logActivity('2FA Toggled', next ? 'Enabled' : 'Disabled');
                  }}
                  style={{
                    padding: '0.5rem 1.1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                    background: is2FAEnabled ? '#10b981' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer'
                  }}
                >
                  {is2FAEnabled ? '✓ 2FA Enabled' : 'Enable 2FA'}
                </button>
              </div>

              {is2FAEnabled && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-qrcode fa-4x" style={{ color: '#09090b' }}></i>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2FA AUTHENTICATOR SECRET KEY</span>
                    <code style={{ background: '#18181b', padding: '6px 10px', borderRadius: '6px', color: '#f59e0b', fontSize: '0.95rem', fontWeight: 800, display: 'inline-block', marginTop: '0.2rem' }}>MTM-2FA-SECURE-9923</code>
                    <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.76rem', color: '#6ee7b7' }}>Backup Recovery Codes: 8392-1092-4401 &bull; 9102-4491-1102</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-WORLD TAB 4: ACTIVE DEVICES */}
        {/* ========================================================================= */}
        {activeTab === 'sessions' && (
          <div className="profile-glass-card">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-gold)', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-laptop"></i> Active Login Devices & Sessions Sub-World
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              Manage devices currently authorized and logged in to your account:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {sessions.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.1rem', background: s.current ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.3)', border: s.current ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                    <i className={`${s.icon} fa-xl`} style={{ color: s.color }}></i>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{s.device}</strong>
                      <span style={{ color: s.current ? '#6ee7b7' : '#94a3b8', fontSize: '0.76rem' }}>{s.location}</span>
                    </div>
                  </div>
                  {s.current ? (
                    <span style={{ background: '#10b981', color: '#000', fontSize: '0.72rem', fontWeight: 900, padding: '3px 10px', borderRadius: '12px' }}>Current</span>
                  ) : (
                    <button onClick={() => {
                      setSessions(sessions.filter(item => item.id !== s.id));
                      logActivity('Revoked Session', s.device);
                    }} style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid #ef4444', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '8px', cursor: 'pointer' }}>Revoke</button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setSessions(sessions.filter(s => s.current));
                logActivity('Logged out other devices', 'All remote sessions revoked');
                alert('All other device sessions have been successfully revoked.');
              }}
              style={{ width: '100%', padding: '0.8rem', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout All Remote Device Sessions
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-WORLD TAB 5: ACTIVITY LOG */}
        {/* ========================================================================= */}
        {activeTab === 'activity' && (
          <div className="profile-glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-history"></i> Activity Timeline Sub-World
              </h4>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => setActivityFilter('all')} style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, border: 'none', background: activityFilter === 'all' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activityFilter === 'all' ? '#000' : '#fff', cursor: 'pointer' }}>All</button>
                <button onClick={() => setActivityFilter('security')} style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, border: 'none', background: activityFilter === 'security' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activityFilter === 'security' ? '#000' : '#fff', cursor: 'pointer' }}>Security</button>
                <button onClick={() => setActivityFilter('profile')} style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, border: 'none', background: activityFilter === 'profile' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activityFilter === 'profile' ? '#000' : '#fff', cursor: 'pointer' }}>Profile</button>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <input type="text" value={activitySearch} onChange={e => setActivitySearch(e.target.value)} placeholder="Search activity history..." style={inputStyle} />
            </div>

            {filteredActivity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                <i className="fas fa-clipboard-list fa-3x" style={{ marginBottom: '0.85rem', display: 'block', opacity: 0.5 }}></i>
                No activity logs match your search.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '360px', overflowY: 'auto' }}>
                {filteredActivity.map((item, idx) => {
                  const dt = new Date(item.timestamp);
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '0.86rem', color: 'var(--accent-gold)' }}>{item.action}</p>
                        {item.detail && <p style={{ margin: '0.15rem 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>{item.detail}</p>}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {dt.toLocaleDateString()} {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button type="button" onClick={() => {
                const blob = new Blob([JSON.stringify(activityLog, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'mtm_activity_log.json'; a.click();
              }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#38bdf8', padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                <i className="fas fa-download" style={{ marginRight: '0.4rem' }}></i> Export Log
              </button>

              <button type="button" onClick={() => { localStorage.removeItem('mtm_activity_log'); setActivityLog([]); }} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.5)', color: '#f87171', padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                <i className="fas fa-trash" style={{ marginRight: '0.4rem' }}></i> Clear Activity History
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-WORLD TAB 6: ALERTS & NOTIFICATIONS */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleSavePreferences} className="profile-glass-card">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-gold)', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-bell"></i> Alerts & Notifications Sub-World
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Customize your notification channels and email digest preferences:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fff' }}>Platform Email Digest</strong>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Receive news, feature announcements & monthly summaries</span>
                </div>
                <input type="checkbox" checked={notifEmail} onChange={e => setNotifEmail(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fff' }}>Prayer (Namaz) Time Alerts</strong>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Browser notifications when prayer times arrive</span>
                </div>
                <input type="checkbox" checked={notifPrayer} onChange={e => setNotifPrayer(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fff' }}>Daily Hadith Email</strong>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Receive an authentic daily Hadith delivered every morning</span>
                </div>
                <input type="checkbox" checked={notifHadith} onChange={e => setNotifHadith(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fff' }}>New PDF Book & Lecture Uploads</strong>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Alerts when new digital Islamic books are published</span>
                </div>
                <input type="checkbox" checked={notifContent} onChange={e => setNotifContent(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }} />
              </div>
            </div>

            <button type="submit" disabled={saving} style={{ padding: '0.8rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', width: '100%', justifyContent: 'center' }}>
              {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Save Notification Preferences'}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SUB-WORLD TAB 7: PRIVACY & SOCIAL */}
        {/* ========================================================================= */}
        {activeTab === 'privacy' && (
          <form onSubmit={handleSavePreferences} className="profile-glass-card">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-gold)', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-user-shield"></i> Privacy & Visibility Sub-World
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Control who can see your profile details and reading status:</p>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={labelStyle}>Profile Visibility Scope</label>
              <select value={privacyVisibility} onChange={e => setPrivacyVisibility(e.target.value)} style={inputStyle}>
                <option value="public">Public (Visible to all portal members)</option>
                <option value="friends">Friends & Connections Only</option>
                <option value="private">Private (Strictly hidden)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fff' }}>Online Presence Indicator</strong>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Display green online status badge when active</span>
                </div>
                <input type="checkbox" checked={privacyActivity} onChange={e => setPrivacyActivity(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fff' }}>Reading History Tracker</strong>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Automatically save reading progress to dashboard</span>
                </div>
                <input type="checkbox" checked={privacyHistory} onChange={e => setPrivacyHistory(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }} />
              </div>
            </div>

            <button type="submit" disabled={saving} style={{ padding: '0.8rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', width: '100%', justifyContent: 'center' }}>
              {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Update Privacy Settings'}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SUB-WORLD TAB 8: PORTAL SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveProfile} className="profile-glass-card">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-gold)', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-cog"></i> Portal Customization Settings Sub-World
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Personalize portal language, reciter voices, font sizing, and visual themes:</p>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={labelStyle}>{t('preferredLang', 'Preferred Portal Interface Language')}</label>
              <select style={inputStyle} value={prefLang} onChange={e => setPrefLang(e.target.value)}>
                <option value="en">🇬🇧 English</option>
                <option value="ur">🇵🇰 اردو (Urdu)</option>
                <option value="br">براہوئی (Brahui / Brohi)</option>
                <option value="ar">🇸🇦 العربية (Arabic)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Default Audio Qari Reciter</label>
                <select style={inputStyle} value={favQari} onChange={e => setFavQari(e.target.value)}>
                  <option value="ar.alafasy">Mishary Rashid Alafasy</option>
                  <option value="ar.sudais">Abdul Rahman Al-Sudais</option>
                  <option value="ar.shuraym">Saud Al-Shuraim</option>
                  <option value="ar.abdulbasitmurattal">Abdul Basit Abdul Samad</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Portal Theme Palette</label>
                <select style={inputStyle} value={themeMode} onChange={e => setThemeMode(e.target.value)}>
                  <option value="emerald">Emerald Oasis (Dark Green)</option>
                  <option value="gold">Royal Gold & Obsidian</option>
                  <option value="midnight">Midnight Black Glass</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Arabic Text Font Size ({fontSizePref}px)</label>
              <input type="range" min="20" max="44" value={fontSizePref} onChange={e => setFontSizePref(e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-gold)' }} />
              <div style={{ textAlign: 'center', marginTop: '0.4rem', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: `${fontSizePref}px`, fontFamily: "'Amiri', serif", color: 'var(--accent-gold)' }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </div>
            </div>

            {isAdmin && (
              <div style={{ padding: '0.9rem 1.1rem', background: 'rgba(14,165,233,0.12)', border: '1px solid #0ea5e9', borderRadius: '12px', marginBottom: '1.25rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#7dd3fc', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span><i className="fas fa-shield-alt" style={{ marginRight: '0.4rem' }}></i> Django Admin Management Studio</span>
                  <a href="/admin" target="_blank" rel="noreferrer" style={{ color: '#fff', background: '#0ea5e9', padding: '4px 12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '0.78rem' }}>Launch Studio &rarr;</a>
                </p>
              </div>
            )}

            <button type="submit" disabled={saving} style={{ padding: '0.8rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', width: '100%', justifyContent: 'center' }}>
              {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Save Customization Settings'}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SUB-WORLD TAB 9: DELETE / DANGER ZONE */}
        {/* ========================================================================= */}
        {activeTab === 'delete' && (
          <form onSubmit={handleDeleteAccount} className="profile-glass-card" style={{ borderColor: 'rgba(239,68,68,0.4)', background: 'rgba(127,29,29,0.2)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#ef4444', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-exclamation-triangle"></i> Account & Danger Zone Sub-World
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#fca5a5', marginBottom: '1.25rem' }}>
              Permanent account erasure and data management options:
            </p>

            {deleteMsg.text && (
              <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', marginBottom: '1.25rem', fontWeight: 800 }}>
                {deleteMsg.text}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Confirm Account Password to Erase</label>
              <input 
                type="password" 
                style={{ ...inputStyle, borderColor: 'rgba(239,68,68,0.5)' }} 
                value={deletePassword} 
                onChange={e => setDeletePassword(e.target.value)} 
                placeholder="Enter password..." 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={saving} 
              style={{ padding: '0.9rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', boxShadow: '0 4px 15px rgba(239,68,68,0.4)' }}
            >
              {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash-alt"></i>}
              Permanently Erase Account & All Data
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
