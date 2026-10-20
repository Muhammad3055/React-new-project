import React, { useEffect, useRef, useState } from 'react';
import { getApiUrl } from '../utils/apiCache';
import { useLanguage } from '../context/LanguageContext';

// Used by the sign-in flow as a local record of recent account actions.
export function logActivity(action, detail = '') {
  try {
    const log = JSON.parse(localStorage.getItem('mtm_activity_log') || '[]');
    log.unshift({ action, detail, timestamp: new Date().toISOString() });
    localStorage.setItem('mtm_activity_log', JSON.stringify(log.slice(0, 50)));
  } catch { /* Local storage may be unavailable. */ }
}

const sections = [
  { id: 'profile', label: 'Personal details', icon: 'fa-user' },
  { id: 'reading', label: 'Reading settings', icon: 'fa-book-open' },
  { id: 'preferences', label: 'Preferences', icon: 'fa-sliders-h' },
  { id: 'security', label: 'Security', icon: 'fa-shield-alt' },
];

const profileDefaults = (user) => ({
  full_name: user?.full_name || '',
  dob: user?.dob || '',
  gender: user?.gender || '',
  bio: user?.bio || '',
  contact_phone: user?.contact_phone || '',
});

const readingDefaults = (user, lang) => ({
  preferred_language: user?.preferred_language || lang || 'en',
  preferred_qari: user?.preferred_qari || 'ar.alafasy',
  preferred_font_size: user?.preferred_font_size || 28,
});

const preferenceDefaults = (user) => ({
  notif_email_updates: user?.notif_email_updates ?? true,
  notif_prayer_alerts: user?.notif_prayer_alerts ?? true,
  notif_daily_hadith: user?.notif_daily_hadith ?? false,
  notif_new_content: user?.notif_new_content ?? true,
  privacy_profile_visibility: user?.privacy_profile_visibility || 'public',
  privacy_show_activity: user?.privacy_show_activity ?? true,
});

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status !== 'success') {
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }
  return data;
}

function FormField({ label, hint, children, wide = false }) {
  return <label className={`account-field${wide ? ' account-field-wide' : ''}`}>
    <span className="account-field-label">{label}</span>
    {children}
    {hint && <small>{hint}</small>}
  </label>;
}

function PreferenceSwitch({ label, description, checked, onChange }) {
  return <label className="account-switch-row">
    <span><strong>{label}</strong><small>{description}</small></span>
    <input type="checkbox" checked={checked} onChange={onChange} />
  </label>;
}

export default function UserProfileModal({ user, onClose, onUpdateUser, navigateToTab }) {
  const { lang, setLang, supportedLanguages = [] } = useLanguage();
  const [section, setSection] = useState('profile');
  const [profile, setProfile] = useState(() => profileDefaults(user));
  const [reading, setReading] = useState(() => readingDefaults(user, lang));
  const [preferences, setPreferences] = useState(() => preferenceDefaults(user));
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const dialogRef = useRef(null);
  const closeButton = useRef(null);
  const fileInput = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled):not([hidden]), select:not(:disabled), textarea:not(:disabled)')]
        .filter(element => element.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch(getApiUrl('/api/user/dashboard/'), { credentials: 'include', signal: controller.signal })
      .then(readResponse)
      .then((data) => {
        if (cancelled) return;
        const saved = data.preferences || {};
        setProfile((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(prev).filter(k => saved[k] != null).map(k => [k, saved[k]])) }));
        setReading((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(prev).filter(k => saved[k] != null).map(k => [k, saved[k]])) }));
        setPreferences((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(prev).filter(k => saved[k] != null).map(k => [k, saved[k]])) }));
        if (saved.avatar) setAvatar(saved.avatar);
      })
      .catch(() => { /* The form still works with the signed-in user's cached details. */ })
      .finally(() => { clearTimeout(timeout); if (!cancelled) setLoading(false); });
    return () => { cancelled = true; clearTimeout(timeout); controller.abort(); };
  }, []);

  const displayName = profile.full_name.trim() || user?.username || 'Your account';
  const initials = displayName.charAt(0).toUpperCase();
  const updateUser = (fields) => {
    const updated = { ...user, ...fields };
    localStorage.setItem('quran_portal_user', JSON.stringify(updated));
    onUpdateUser?.(updated);
  };
  const save = async (event, fields, successMessage) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(getApiUrl('/api/user/preferences/update/'), {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      await readResponse(response);
      updateUser(fields);
      if (fields.preferred_language && fields.preferred_language !== lang) setLang(fields.preferred_language);
      logActivity('Account settings updated', section);
      setMessage({ type: 'success', text: successMessage });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Unable to save. Please try again.' });
    } finally { setBusy(false); }
  };
  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Choose a JPG, PNG, WebP or GIF image under 5 MB.' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const body = new FormData();
      body.append('avatar_file', file);
      const response = await fetch(getApiUrl('/api/user/avatar/upload/'), { method: 'POST', credentials: 'include', body });
      const data = await readResponse(response);
      setAvatar(data.avatar_url);
      updateUser({ avatar: data.avatar_url });
      setMessage({ type: 'success', text: 'Profile photo updated.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Photo upload failed.' });
    } finally { setBusy(false); }
  };
  const changePassword = async (event) => {
    event.preventDefault();
    if (newPassword.length < 8) { setMessage({ type: 'error', text: 'Use at least 8 characters for your new password.' }); return; }
    if (newPassword !== confirmPassword) { setMessage({ type: 'error', text: 'The new passwords do not match.' }); return; }
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(getApiUrl('/api/user/preferences/update/'), {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change_password: true, old_password: currentPassword, new_password: newPassword }),
      });
      await readResponse(response);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      logActivity('Password changed');
      setMessage({ type: 'success', text: 'Password changed successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Password could not be changed.' });
    } finally { setBusy(false); }
  };
  const deleteAccount = async (event) => {
    event.preventDefault();
    if (!window.confirm('Permanently delete your account and its saved data? This cannot be undone.')) return;
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(getApiUrl('/api/user/delete/'), {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });
      await readResponse(response);
      localStorage.removeItem('quran_portal_user');
      window.location.assign('/');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Account could not be deleted.' });
      setBusy(false);
    }
  };
  const signOut = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await readResponse(await fetch(getApiUrl('/api/auth/logout/'), { method: 'POST', credentials: 'include' }));
      localStorage.removeItem('quran_portal_user');
      window.location.assign('/');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Sign out failed. Please try again.' });
      setBusy(false);
    }
  };
  const openDashboard = () => { onClose(); navigateToTab?.('dashboard'); };
  const chooseSection = (id) => { setSection(id); setMessage(null); };

  return <div className="account-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialogRef} className="account-dialog" role="dialog" aria-modal="true" aria-label="Account settings">
      <aside className="account-sidebar">
        <div className="account-brand"><span className="account-brand-mark">م</span><span>MAKTABA TUL MUSLIM<small>ACCOUNT CENTER</small></span></div>
        <div className="account-identity">
          <div className="account-avatar">{avatar ? <img src={avatar} alt="Your profile" /> : initials}</div>
          <div><strong>{displayName}</strong><span>@{user?.username || 'member'}</span><small>{user?.is_staff ? 'Administrator' : 'Member account'}</small></div>
        </div>
        <nav className="account-nav" aria-label="Account settings">
          {sections.map((item) => <button key={item.id} type="button" className={section === item.id ? 'active' : ''} aria-current={section === item.id ? 'page' : undefined} onClick={() => chooseSection(item.id)}>
            <i className={`fas ${item.icon}`} aria-hidden="true" /><span>{item.label}</span>
          </button>)}
        </nav>
        <div className="account-sidebar-bottom">
          <button type="button" onClick={openDashboard}><i className="fas fa-chart-line" aria-hidden="true" /> Open my dashboard <i className="fas fa-arrow-up account-out-icon" aria-hidden="true" /></button>
          <button type="button" onClick={signOut} disabled={busy}><i className="fas fa-sign-out-alt" aria-hidden="true" /> Sign out</button>
        </div>
      </aside>
      <main className="account-main">
        <header className="account-topbar"><div><span>MY ACCOUNT</span><h2>{sections.find(s => s.id === section)?.label}</h2></div><button ref={closeButton} type="button" className="account-close" aria-label="Close account settings" onClick={onClose}><i className="fas fa-times" /></button></header>
        <div className="account-mobile-nav" role="navigation" aria-label="Account sections">{sections.map(item => <button key={item.id} type="button" className={section === item.id ? 'active' : ''} onClick={() => chooseSection(item.id)}>{item.label}</button>)}</div>
        <div className="account-scroll">
          {message && <div className={`account-message ${message.type}`} role="status">{message.text}</div>}
          {loading ? <div className="account-loading" role="status">Loading account details…</div> : <>
          {section === 'profile' && <>
            <div className="account-intro"><h3>Make your account yours.</h3><p>Keep your details and profile photo up to date.</p></div>
            <div className="account-card account-photo-card"><div className="account-avatar account-avatar-large">{avatar ? <img src={avatar} alt="Your profile" /> : initials}</div><div><strong>Profile photo</strong><p>JPG, PNG, WebP or GIF · up to 5 MB</p><button type="button" className="account-button account-button-secondary" onClick={() => fileInput.current?.click()} disabled={busy}>Change photo</button><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadAvatar} hidden /></div></div>
            <form className="account-card" onSubmit={(event) => save(event, profile, 'Personal details saved.')}>
              <div className="account-card-heading"><div><h3>Personal information</h3><p>Details associated with your account.</p></div></div>
              <div className="account-form-grid">
                <FormField label="Full name"><input maxLength={150} value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} placeholder="Your full name" /></FormField>
                <FormField label="Username" hint="Username cannot be changed here."><input value={user?.username || ''} readOnly /></FormField>
                <FormField label="Email address" hint="Email cannot be changed here."><input type="email" value={user?.email || ''} readOnly /></FormField>
                <FormField label="Phone number"><input type="tel" maxLength={20} value={profile.contact_phone} onChange={e => setProfile({ ...profile, contact_phone: e.target.value })} placeholder="Optional" /></FormField>
                <FormField label="Date of birth"><input type="date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })} /></FormField>
                <FormField label="Gender"><select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })}><option value="">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></FormField>
                <FormField label="About you" wide><textarea maxLength={1000} rows={4} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="A little about yourself" /></FormField>
              </div><div className="account-form-actions"><button className="account-button account-button-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div>
            </form>
          </>}
          {section === 'reading' && <>
            <div className="account-intro"><h3>A reading space that fits you.</h3><p>Choose your preferred language, reciter and Quran text size.</p></div>
            <form className="account-card" onSubmit={(event) => save(event, reading, 'Reading settings saved.')}>
              <div className="account-card-heading"><div><h3>Quran preferences</h3><p>These choices are saved to your account.</p></div></div>
              <div className="account-form-grid">
                <FormField label="Website language"><select value={reading.preferred_language} onChange={e => setReading({ ...reading, preferred_language: e.target.value })}>{supportedLanguages.map(item => <option key={item.code} value={item.code}>{item.name} · {item.nativeName}</option>)}</select></FormField>
                <FormField label="Preferred reciter"><select value={reading.preferred_qari} onChange={e => setReading({ ...reading, preferred_qari: e.target.value })}><option value="ar.alafasy">Mishary Rashid Alafasy</option><option value="ar.sudais">Abdul Rahman Al-Sudais</option><option value="ar.ghamdi">Saad Al-Ghamdi</option><option value="ar.mahermuaiqly">Maher Al-Muaiqly</option></select></FormField>
                <FormField label="Quran text size" hint={`${reading.preferred_font_size}px`} wide><input type="range" min="18" max="44" step="2" value={reading.preferred_font_size} onChange={e => setReading({ ...reading, preferred_font_size: Number(e.target.value) })} /></FormField>
              </div><div className="account-form-actions"><button className="account-button account-button-primary" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button></div>
            </form>
          </>}
          {section === 'preferences' && <>
            <div className="account-intro"><h3>Your preferences.</h3><p>Manage account choices for updates and future sharing features.</p></div>
            <form className="account-card" onSubmit={(event) => save(event, preferences, 'Preferences saved.')}>
              <div className="account-card-heading"><div><h3>Updates</h3><p>Your choices are saved; availability depends on the update service.</p></div></div>
              <PreferenceSwitch label="Email updates" description="News and updates by email" checked={preferences.notif_email_updates} onChange={e => setPreferences({ ...preferences, notif_email_updates: e.target.checked })} />
              <PreferenceSwitch label="Prayer reminders" description="Prayer alert preference" checked={preferences.notif_prayer_alerts} onChange={e => setPreferences({ ...preferences, notif_prayer_alerts: e.target.checked })} />
              <PreferenceSwitch label="Daily hadith" description="Hadith reminder preference" checked={preferences.notif_daily_hadith} onChange={e => setPreferences({ ...preferences, notif_daily_hadith: e.target.checked })} />
              <PreferenceSwitch label="New content" description="Content update preference" checked={preferences.notif_new_content} onChange={e => setPreferences({ ...preferences, notif_new_content: e.target.checked })} />
              <div className="account-card-heading account-subheading"><div><h3>Sharing preferences</h3><p>Saved for future public profile features. Your account details are not published from this page.</p></div></div>
              <div className="account-form-grid"><FormField label="Profile visibility preference"><select value={preferences.privacy_profile_visibility} onChange={e => setPreferences({ ...preferences, privacy_profile_visibility: e.target.value })}><option value="public">Public</option><option value="private">Private</option></select></FormField></div>
              <PreferenceSwitch label="Show activity preference" description="For future public profile features" checked={preferences.privacy_show_activity} onChange={e => setPreferences({ ...preferences, privacy_show_activity: e.target.checked })} />
              <div className="account-form-actions"><button className="account-button account-button-primary" disabled={busy}>{busy ? 'Saving…' : 'Save preferences'}</button></div>
            </form>
          </>}
          {section === 'security' && <>
            <div className="account-intro"><h3>Keep your account secure.</h3><p>Manage your password and account access.</p></div>
            <form className="account-card" onSubmit={changePassword}>
              <div className="account-card-heading"><div><h3>Change password</h3><p>Enter your current password to set a new one.</p></div></div>
              <div className="account-form-grid">
                <FormField label="Current password" wide><input type="password" autoComplete="current-password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></FormField>
                <FormField label="New password" hint="At least 8 characters"><input type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} /></FormField>
                <FormField label="Confirm new password"><input type="password" autoComplete="new-password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></FormField>
              </div><div className="account-form-actions"><button className="account-button account-button-primary" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button></div>
            </form>
            <form className="account-card account-danger-card" onSubmit={deleteAccount}>
              <div className="account-card-heading"><div><h3>Delete account</h3><p>Permanently removes your account. This action cannot be undone.</p></div></div>
              <div className="account-form-grid"><FormField label="Confirm with your password"><input type="password" autoComplete="current-password" required value={deletePassword} onChange={e => setDeletePassword(e.target.value)} /></FormField></div>
              <div className="account-form-actions"><button className="account-button account-button-danger" disabled={busy}>Delete account</button></div>
            </form>
          </>}
          </>}
        </div>
      </main>
    </div>
  </div>;
}
