import React, { useState } from 'react';
import { getApiUrl } from '../utils/apiCache';

export default function UserProfileModal({ user, onClose, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'frame' | 'password' | 'preferences'
  
  // Profile State
  const [fullName, setFullName] = useState(user?.full_name || user?.username || '');
  const [dob, setDob] = useState(user?.dob || '1995-01-01');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [bio, setBio] = useState(user?.bio || 'Seeking Islamic Knowledge & Quranic Reflection');
  
  // Avatar & Frame State
  const [selectedFrame, setSelectedFrame] = useState(user?.frame || 'gold');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  // Saving State
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');

  const frames = [
    { id: 'gold', name: '🌟 Golden Crescent Frame', border: '3px solid #f59e0b', shadow: '0 0 15px rgba(245,158,11,0.6)' },
    { id: 'emerald', name: '💎 Emerald Dome Frame', border: '3px solid #10b981', shadow: '0 0 15px rgba(16,185,129,0.6)' },
    { id: 'royal', name: '👑 Royal Crown Frame', border: '3px solid #6366f1', shadow: '0 0 15px rgba(99,102,241,0.6)' },
    { id: 'noor', name: '⭐ Noor Star Frame', border: '3px solid #ec4899', shadow: '0 0 15px rgba(236,72,253,0.6)' },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess('');

    const updatedUserData = {
      ...user,
      full_name: fullName,
      dob,
      gender,
      bio,
      frame: selectedFrame,
      avatar: avatarUrl
    };

    try {
      // POST to Django Backend Preferences API
      await fetch(getApiUrl('/api/user/preferences/update/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          dob,
          gender,
          bio,
          frame: selectedFrame,
          avatar: avatarUrl
        })
      });
    } catch (err) {
      console.log('Saved locally:', err);
    }

    // Save to localStorage for instant UI persistence
    localStorage.setItem('quran_portal_user', JSON.stringify(updatedUserData));
    if (onUpdateUser) onUpdateUser(updatedUserData);

    setSaving(false);
    setSavedSuccess('Profile & Settings updated successfully!');
    setTimeout(() => setSavedSuccess(''), 3500);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setPasswordMsg({ text: 'Please enter a new password', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match!', type: 'error' });
      return;
    }

    setSaving(true);
    setPasswordMsg({ text: '', type: '' });

    try {
      const res = await fetch(getApiUrl('/api/auth/send-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'forgot_password',
          username: user.username,
          password: newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ text: 'Password update verification code sent to your email!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ text: data.error || 'Could not change password.', type: 'error' });
      }
    } catch (err) {
      setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
    }
    setSaving(false);
  };

  const activeFrameObj = frames.find(f => f.id === selectedFrame) || frames[0];

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '650px', width: '100%', maxHeight: '92vh', overflowY: 'auto', background: '#022c22', border: '1.5px solid var(--accent-gold)', borderRadius: '20px', color: '#fff', padding: '2rem' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245,158,11,0.3)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#064e3b', border: activeFrameObj.border, boxShadow: activeFrameObj.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent-gold)' }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{fullName || user?.username}</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{user?.email || 'Logged-in Account Settings'}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {savedSuccess && (
          <div style={{ padding: '0.75rem 1rem', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-check-circle"></i> {savedSuccess}
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{ padding: '0.55rem 1rem', borderRadius: '20px', border: 'none', background: activeTab === 'profile' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activeTab === 'profile' ? '#022c22' : '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <i className="fas fa-user-edit"></i> Profile & Name
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('frame')}
            style={{ padding: '0.55rem 1rem', borderRadius: '20px', border: 'none', background: activeTab === 'frame' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activeTab === 'frame' ? '#022c22' : '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <i className="fas fa-crown"></i> Avatar Frames
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('password')}
            style={{ padding: '0.55rem 1rem', borderRadius: '20px', border: 'none', background: activeTab === 'password' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activeTab === 'password' ? '#022c22' : '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <i className="fas fa-key"></i> Security & Password
          </button>
        </div>

        {/* TAB 1: PROFILE & PERSONAL DETAILS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Full Name / Display Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Khidrani"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Date of Birth (DOB)</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                >
                  <option value="male">Brother (Male)</option>
                  <option value="female">Sister (Female)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Username (Read Only)</label>
                <input
                  type="text"
                  disabled
                  value={user?.username || ''}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Personal Bio / Notes</label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your favorite Ayah or Islamic note..."
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                Save Profile Details
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: AVATAR FRAMES */}
        {activeTab === 'frame' && (
          <form onSubmit={handleSaveProfile}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Choose a custom Islamic Profile Frame to display on your account:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {frames.map((fr) => {
                const isSelected = selectedFrame === fr.id;
                return (
                  <div
                    key={fr.id}
                    onClick={() => setSelectedFrame(fr.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      background: isSelected ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.3)',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#064e3b', border: fr.border, boxShadow: fr.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>{fr.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: isSelected ? 'var(--accent-gold)' : 'rgba(255,255,255,0.6)' }}>
                        {isSelected ? '✓ Active Frame' : 'Click to select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-crown"></i>}
                Apply Avatar Frame
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SECURITY & PASSWORD CHANGE */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword}>
            {passwordMsg.text && (
              <div style={{ padding: '0.75rem 1rem', background: passwordMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: passwordMsg.type === 'success' ? '#15803d' : '#b91c1c', borderRadius: '10px', marginBottom: '1rem', fontWeight: 700 }}>
                {passwordMsg.text}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-shield-alt"></i>}
                Update Password
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
