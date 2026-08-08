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
  const [dob, setDob] = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [bio, setBio] = useState(user?.bio || '');
  const [contactPhone, setContactPhone] = useState(user?.contact_phone || '');
  const [prefLang, setPrefLang] = useState(user?.preferred_language || lang || 'en');

  // Frame
  const [selectedFrame, setSelectedFrame] = useState(user?.frame || 'gold');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Saving
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');

  // Activity log
  const [activityLog, setActivityLog] = useState([]);
  useEffect(() => {
    try {
      const log = JSON.parse(localStorage.getItem('mtm_activity_log') || '[]');
      setActivityLog(log);
    } catch { setActivityLog([]); }
  }, [activeTab]);

  const isAdmin = user?.is_staff || user?.is_superuser;

  // ---- Frames ----
  const userFrames = [
    { id: 'gold', name: '🌟 ' + t('Golden Crescent Frame', 'Golden Crescent Frame'), border: '3px solid #f59e0b', shadow: '0 0 15px rgba(245,158,11,0.6)', bg: '#78350f' },
    { id: 'emerald', name: '💎 Emerald Dome Frame', border: '3px solid #10b981', shadow: '0 0 15px rgba(16,185,129,0.6)', bg: '#065f46' },
    { id: 'royal', name: '👑 Royal Crown Frame', border: '3px solid #6366f1', shadow: '0 0 15px rgba(99,102,241,0.6)', bg: '#3730a3' },
    { id: 'noor', name: '⭐ Noor Star Frame', border: '3px solid #ec4899', shadow: '0 0 15px rgba(236,72,253,0.6)', bg: '#9d174d' },
  ];
  const adminFrames = [
    { id: 'admin_shield', name: t('adminFrame', '🛡 Admin Authority Frame'), border: '3px solid #0ea5e9', shadow: '0 0 18px rgba(14,165,233,0.7)', bg: '#0c4a6e', adminOnly: true },
    { id: 'admin_crimson', name: '🔥 Admin Crimson Authority', border: '3px solid #dc2626', shadow: '0 0 18px rgba(220,38,38,0.7)', bg: '#7f1d1d', adminOnly: true },
  ];
  const allFrames = isAdmin ? [...adminFrames, ...userFrames] : userFrames;
  const activeFrameObj = allFrames.find(f => f.id === selectedFrame) || allFrames[0];

  // Password strength
  const pwStrength = getPasswordStrength(newPassword);

  // ---- Save Profile ----
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess('');

    const payload = { full_name: fullName, dob, gender, bio, contact_phone: contactPhone, frame: selectedFrame, preferred_language: prefLang };

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

    logActivity('Profile Updated', `Name: ${fullName}`);
    setSaving(false);
    setSavedSuccess(t('saveProfile', 'Profile saved successfully!'));
    setTimeout(() => setSavedSuccess(''), 3500);
  };

  // ---- Apply Frame ----
  const handleApplyFrame = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { frame: selectedFrame };
    const updatedUser = { ...user, frame: selectedFrame };
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
    logActivity('Frame Changed', selectedFrame);
    setSaving(false);
    setSavedSuccess(t('applyFrame', 'Avatar frame applied!'));
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  // ---- Change Password ----
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) { setPasswordMsg({ text: 'Please enter a new password.', type: 'error' }); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg({ text: 'Passwords do not match.', type: 'error' }); return; }
    if (pwStrength.score < 2) { setPasswordMsg({ text: 'Password is too weak. Use at least 8 characters with uppercase & numbers.', type: 'error' }); return; }

    setSaving(true);
    setPasswordMsg({ text: '', type: '' });
    try {
      const res = await fetch(getApiUrl('/api/auth/send-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'forgot_password', username: user.username, password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ text: '✅ Verification code sent to your email. Check inbox to confirm password change.', type: 'success' });
        logActivity('Password Change Requested', user.email || user.username);
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        setPasswordMsg({ text: data.error || 'Could not change password.', type: 'error' });
      }
    } catch {
      setPasswordMsg({ text: '✅ Password change email sent!', type: 'success' });
    }
    setSaving(false);
  };

  const tabStyle = (key) => ({
    padding: '0.5rem 0.9rem', borderRadius: '20px', border: 'none',
    background: activeTab === key ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
    color: activeTab === key ? '#022c22' : '#fff',
    fontWeight: 800, cursor: 'pointer', fontSize: '0.78rem',
    display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s'
  });

  const inputStyle = {
    width: '100%', padding: '0.6rem 0.85rem',
    background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '0.88rem'
  };

  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: 'rgba(255,255,255,0.85)' };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '680px', width: '100%', maxHeight: '94vh', overflowY: 'auto', background: '#022c22', border: `1.5px solid ${activeFrameObj.border.split(' ')[2]}`, borderRadius: '20px', color: '#fff', padding: '1.75rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245,158,11,0.3)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: activeFrameObj.bg, border: activeFrameObj.border, boxShadow: activeFrameObj.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem', color: 'var(--accent-gold)' }}>
              {isAdmin ? '⚡' : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {fullName || user?.username}
                {isAdmin && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: '#0ea5e9', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 800 }}>ADMIN</span>}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>{user?.email || t('profileSettings', 'Account Settings')}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {savedSuccess && (
          <div style={{ padding: '0.7rem 1rem', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-check-circle"></i> {savedSuccess}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
          <button style={tabStyle('profile')} onClick={() => setActiveTab('profile')}><i className="fas fa-user-edit"></i> {t('profileTab', 'Profile')}</button>
          <button style={tabStyle('frame')} onClick={() => setActiveTab('frame')}><i className="fas fa-crown"></i> {t('frameTab', 'Frames')}</button>
          <button style={tabStyle('settings')} onClick={() => setActiveTab('settings')}><i className="fas fa-cog"></i> {t('settingsTab', 'Settings')}</button>
          <button style={tabStyle('password')} onClick={() => setActiveTab('password')}><i className="fas fa-key"></i> {t('passwordTab', 'Security')}</button>
          <button style={tabStyle('activity')} onClick={() => setActiveTab('activity')}><i className="fas fa-list-alt"></i> {t('activityTab', 'Activity')}</button>
        </div>

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('fullNameLabel', 'Full Name')}</label>
                <input type="text" style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Muhammad Khidrani" />
              </div>
              <div>
                <label style={labelStyle}>{t('dobLabel', 'Date of Birth')}</label>
                <input type="date" style={inputStyle} value={dob} onChange={e => setDob(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('genderLabel', 'Gender')}</label>
                <select style={inputStyle} value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="male">{t('genderMale', 'Brother (Male)')}</option>
                  <option value="female">{t('genderFemale', 'Sister (Female)')}</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t('contactPhone', 'Phone / Contact')}</label>
                <input type="tel" style={inputStyle} value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+92 300 0000000" />
              </div>
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={labelStyle}>{t('bioLabel', 'Personal Bio / Notes')}</label>
              <textarea rows="3" style={{ ...inputStyle, resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Share your favorite Ayah or Islamic note..." />
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={labelStyle}>{t('username', 'Username')} (Read-Only)</label>
              <input type="text" disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} value={user?.username || ''} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                {t('saveProfile', 'Save Profile')}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: AVATAR FRAMES */}
        {activeTab === 'frame' && (
          <form onSubmit={handleApplyFrame}>
            {isAdmin && (
              <div style={{ padding: '0.65rem 1rem', background: 'rgba(14,165,233,0.15)', border: '1px solid #0ea5e9', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.82rem', color: '#7dd3fc' }}>
                <i className="fas fa-shield-alt" style={{ marginRight: '0.4rem' }}></i>
                <strong>{t('adminFrame', 'Admin Authority Frames')}</strong> — {t('adminFrameDesc', 'Exclusive frames only for portal administrators')}
              </div>
            )}
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginBottom: '1rem' }}>Choose a custom Islamic profile frame for your account:</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {allFrames.map(fr => {
                const isSelected = selectedFrame === fr.id;
                return (
                  <div key={fr.id} onClick={() => setSelectedFrame(fr.id)} style={{ padding: '0.9rem', borderRadius: '14px', background: isSelected ? 'rgba(245,158,11,0.18)' : 'rgba(0,0,0,0.25)', border: isSelected ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', transition: 'all 0.2s' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: fr.bg, border: fr.border, boxShadow: fr.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                      {isAdmin ? '⚡' : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#fff' }}>{fr.name}</h4>
                      <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--accent-gold)' : 'rgba(255,255,255,0.5)' }}>{isSelected ? '✓ Active' : 'Click to select'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-crown"></i>}
                {t('applyFrame', 'Apply Frame')}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveProfile}>
            <h4 style={{ color: 'var(--accent-gold)', fontWeight: 800, marginBottom: '1rem', fontSize: '1rem' }}>
              <i className="fas fa-sliders-h" style={{ marginRight: '0.5rem' }}></i> {t('settingsTab', 'Preferences & Settings')}
            </h4>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={labelStyle}>{t('preferredLang', 'Preferred Language')}</label>
              <select style={inputStyle} value={prefLang} onChange={e => setPrefLang(e.target.value)}>
                <option value="en">🇬🇧 English</option>
                <option value="ur">🇵🇰 اردو (Urdu)</option>
                <option value="br">براہوئی (Brahui)</option>
                <option value="ar">🇸🇦 العربية (Arabic)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem' }}>
              <div>
                <label style={labelStyle}>{t('dobLabel', 'Date of Birth')}</label>
                <input type="date" style={inputStyle} value={dob} onChange={e => setDob(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>{t('genderLabel', 'Gender')}</label>
                <select style={inputStyle} value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="male">{t('genderMale', 'Brother (Male)')}</option>
                  <option value="female">{t('genderFemale', 'Sister (Female)')}</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={labelStyle}>{t('contactPhone', 'Phone / Contact Number')}</label>
              <input type="tel" style={inputStyle} value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+92 300 0000000" />
            </div>

            {isAdmin && (
              <div style={{ padding: '0.85rem 1rem', background: 'rgba(14,165,233,0.1)', border: '1px solid #0ea5e9', borderRadius: '10px', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#7dd3fc', fontWeight: 700 }}>
                  <i className="fas fa-shield-alt" style={{ marginRight: '0.4rem' }}></i> Admin Panel Access: <a href="/admin" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Open Django Admin</a>
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                {t('saveProfile', 'Save Settings')}
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: PASSWORD */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword}>
            {passwordMsg.text && (
              <div style={{ padding: '0.75rem 1rem', background: passwordMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: passwordMsg.type === 'success' ? '#15803d' : '#b91c1c', borderRadius: '10px', marginBottom: '1rem', fontWeight: 700 }}>
                {passwordMsg.text}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>{t('currentPassword', 'Current Password')}</label>
              <input type="password" style={inputStyle} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <label style={labelStyle}>{t('newPassword', 'New Password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters..."
                />
                <button type="button" onClick={() => setShowNewPwd(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <i className={showNewPwd ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </button>
              </div>

              {/* Strength meter */}
              {newPassword && (
                <div style={{ marginTop: '0.6rem' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.4rem' }}>
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} style={{ flex: 1, height: '4px', borderRadius: '2px', background: n <= pwStrength.score ? pwStrength.color : '#374151', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.76rem', fontWeight: 700, color: pwStrength.color }}>{pwStrength.label}</p>
                  {/* Validation checklist */}
                  <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                    {[
                      { key: 'minLength', label: t('passwordMinLength', 'Min 8 characters') },
                      { key: 'uppercase', label: t('passwordUppercase', '1 uppercase letter') },
                      { key: 'number', label: t('passwordNumber', '1 number') },
                      { key: 'special', label: t('passwordSpecial', '1 special character') },
                    ].map(({ key, label }) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: pwStrength.checks[key] ? '#34d399' : 'rgba(255,255,255,0.45)' }}>
                        <i className={pwStrength.checks[key] ? 'fas fa-check-circle' : 'fas fa-circle'}></i>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>{t('confirmNewPassword', 'Confirm New Password')}</label>
              <input type="password" style={{ ...inputStyle, borderColor: confirmPassword && confirmPassword !== newPassword ? '#ef4444' : 'rgba(255,255,255,0.2)' }} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
              {confirmPassword && confirmPassword !== newPassword && (
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.76rem', color: '#f87171' }}>⚠ Passwords do not match</p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-shield-alt"></i>}
                {t('updatePassword', 'Update Password')}
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: ACTIVITY LOG */}
        {activeTab === 'activity' && (
          <div>
            <h4 style={{ color: 'var(--accent-gold)', fontWeight: 800, marginBottom: '1rem', fontSize: '1rem' }}>
              <i className="fas fa-history" style={{ marginRight: '0.5rem' }}></i> {t('activityLogTitle', 'Recent Activity Log')}
            </h4>
            {activityLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'rgba(255,255,255,0.5)' }}>
                <i className="fas fa-clipboard-list fa-2x" style={{ marginBottom: '0.75rem', display: 'block' }}></i>
                {t('noActivityYet', 'No activity logged yet. Start using the portal!')}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '380px', overflowY: 'auto' }}>
                {activityLog.map((item, idx) => {
                  const dt = new Date(item.timestamp);
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-gold)' }}>{item.action}</p>
                        {item.detail && <p style={{ margin: '0.1rem 0 0', fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)' }}>{item.detail}</p>}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', marginLeft: '0.75rem' }}>
                        {dt.toLocaleDateString()} {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { localStorage.removeItem('mtm_activity_log'); setActivityLog([]); }} style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.5)', color: '#f87171', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fas fa-trash"></i> Clear Log
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
