import React, { useState, useEffect } from 'react';

export default function AuthModal({ initialMode, onClose, setUser }) {
  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Social Auth State ('google' | 'microsoft')
  const [socialProvider, setSocialProvider] = useState(null);
  const [socialEmail, setSocialEmail] = useState('');

  // 2FA Verification Code (OTP) State
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Request 6-digit verification code from server
  const handleRequestOtp = (payload) => {
    setSubmitting(true);
    setError('');

    fetch('/api/auth/send-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.status === 'otp_sent') {
          setPendingEmail(data.email);
          setStep('otp');
          setOtpCode('');
        } else {
          setError(data.error || 'Authentication failed. Please check your details.');
        }
      })
      .catch(() => {
        setSubmitting(false);
        setError('Network error connecting to authentication server.');
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = mode === 'login'
      ? { type: 'login', username, password }
      : { type: 'signup', username, email, password };
    handleRequestOtp(payload);
  };

  const handleOpenSocialModal = (provider) => {
    setSocialProvider(provider);
    setSocialEmail('');
    setError('');
  };

  const handleSocialSubmit = (e) => {
    e.preventDefault();
    const targetEmail = socialEmail.trim().toLowerCase();

    // Client-side domain validation
    if (socialProvider === 'google') {
      const msDomains = ['@outlook.', '@hotmail.', '@live.', '@msn.', '@microsoft.'];
      if (msDomains.some(dom => targetEmail.includes(dom))) {
        setError('Invalid Google Account! Outlook/Hotmail addresses cannot be used for Google Sign-In.');
        return;
      }
      if (!targetEmail.includes('@gmail.com') && !targetEmail.includes('@googlemail.com')) {
        setError('Invalid Google Account! Please enter a valid Gmail address.');
        return;
      }
    }

    if (socialProvider === 'microsoft') {
      if (targetEmail.includes('@gmail.com') || targetEmail.includes('@googlemail.com')) {
        setError('Invalid Microsoft Account! Gmail addresses cannot be used for Microsoft Sign-In.');
        return;
      }
      const validMs = ['@outlook.', '@hotmail.', '@live.', '@msn.', '@microsoft.'];
      if (!validMs.some(dom => targetEmail.includes(dom))) {
        setError('Invalid Microsoft Account! Please enter a valid Microsoft email.');
        return;
      }
    }

    handleRequestOtp({
      type: 'social',
      provider: socialProvider,
      email: targetEmail
    });
  };

  // Submit 6-digit verification code
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the complete 6-digit security code.');
      return;
    }

    setSubmitting(true);
    setError('');

    fetch('/api/auth/verify-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: otpCode.trim() })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.status === 'success') {
          setUser({ username: data.username, email: data.email, is_staff: data.is_staff });
          onClose();
          window.location.reload();
        } else {
          setError(data.error || 'Invalid 6-digit verification code.');
        }
      })
      .catch(() => {
        setSubmitting(false);
        setError('Verification failed. Server connection error.');
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '450px', borderRadius: '16px', overflow: 'hidden' }}
      >
        {/* Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', alignItems: 'center' }}>
          <button
            onClick={() => { setMode('login'); setStep('input'); setError(''); setSocialProvider(null); }}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              background: mode === 'login' && !socialProvider && step === 'input' ? '#ffffff' : 'transparent',
              color: mode === 'login' && !socialProvider && step === 'input' ? 'var(--primary-dark)' : 'var(--text-muted)',
              fontWeight: mode === 'login' && !socialProvider && step === 'input' ? 800 : 600,
              fontSize: '0.95rem',
              borderBottom: mode === 'login' && !socialProvider && step === 'input' ? '3px solid var(--accent-gold)' : 'none',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-sign-in-alt" style={{ marginRight: '0.4rem' }}></i> Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setStep('input'); setError(''); setSocialProvider(null); }}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              background: mode === 'signup' && !socialProvider && step === 'input' ? '#ffffff' : 'transparent',
              color: mode === 'signup' && !socialProvider && step === 'input' ? 'var(--primary-dark)' : 'var(--text-muted)',
              fontWeight: mode === 'signup' && !socialProvider && step === 'input' ? 800 : 600,
              fontSize: '0.95rem',
              borderBottom: mode === 'signup' && !socialProvider && step === 'input' ? '3px solid var(--accent-gold)' : 'none',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-user-plus" style={{ marginRight: '0.4rem' }}></i> Create Account
          </button>
          
          {/* Top Right Close Button */}
          <button
            className="btn-close-modal"
            onClick={onClose}
            style={{ padding: '0.75rem 1rem', fontSize: '1.4rem', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            title="Cancel"
          >
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>

          {/* ===== STEP 2: 6-DIGIT VERIFICATION CODE (OTP) SCREEN ===== */}
          {step === 'otp' ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '0 0 0.25rem 0' }}>
                  Security Verification Code
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  A 6-digit authentication security code has been sent to:<br />
                  <strong style={{ color: 'var(--primary-dark)' }}>{pendingEmail}</strong>
                </p>
              </div>

              {/* Email Sent Notice Box */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                marginBottom: '1.25rem',
                color: '#166534'
              }}>
                <i className="fas fa-envelope-open-text" style={{ fontSize: '1.4rem', color: 'var(--primary-emerald)', marginBottom: '0.3rem', display: 'block' }}></i>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block' }}>
                  Code sent to your personal email inbox!
                </span>
                <span style={{ fontSize: '0.78rem', color: '#15803d', display: 'block', marginTop: '0.2rem' }}>
                  Please check your Gmail / Email app to copy your 6-digit code.
                </span>
              </div>

              <form onSubmit={handleVerifyOtp}>
                <div className="form-group" style={{ textAlign: 'center' }}>
                  <label className="form-label">Enter 6-Digit Security Code *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 749201"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    autoFocus
                    style={{
                      textAlign: 'center',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      letterSpacing: '8px',
                      padding: '0.75rem',
                      color: 'var(--primary-dark)',
                      border: '2px solid var(--accent-gold)'
                    }}
                  />
                </div>

                {error && (
                  <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.4rem' }}></i> {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={submitting || otpCode.length !== 6}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginBottom: '0.75rem' }}
                >
                  {submitting ? 'Verifying Code...' : 'Verify Code & Complete Sign-In'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => { setStep('input'); setError(''); }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    <i className="fas fa-arrow-left"></i> Change Email / Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestOtp(mode === 'login' ? { type: 'login', username, password } : { type: 'signup', username, email, password })}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary-light)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    <i className="fas fa-sync-alt"></i> Resend Code
                  </button>
                </div>
              </form>
            </div>
          ) : socialProvider ? (
            /* ===== STEP 1: SOCIAL AUTH PROVIDER SUB-MODAL ===== */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <i
                  className={socialProvider === 'google' ? 'fab fa-google' : 'fab fa-microsoft'}
                  style={{
                    fontSize: '2.5rem',
                    color: socialProvider === 'google' ? '#ea4335' : '#00a4ef',
                    marginBottom: '0.5rem'
                  }}
                ></i>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>
                  Sign in with {socialProvider === 'google' ? 'Google' : 'Microsoft'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {socialProvider === 'google'
                    ? 'Enter your official @gmail.com address to receive your verification code.'
                    : 'Enter your official @outlook.com address to receive your verification code.'}
                </p>
              </div>

              <form onSubmit={handleSocialSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    {socialProvider === 'google' ? 'Google / Gmail Address' : 'Microsoft Account Email'}
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={socialProvider === 'google' ? 'yourname@gmail.com' : 'yourname@outlook.com'}
                    value={socialEmail}
                    onChange={(e) => setSocialEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.4rem' }}></i> {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    className="btn-play"
                    style={{ flex: 1, background: '#e2e8f0', color: '#334155', justifyContent: 'center' }}
                    onClick={() => { setSocialProvider(null); setError(''); }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    style={{
                      flex: 2,
                      background: socialProvider === 'google' ? '#ea4335' : '#00a4ef'
                    }}
                    disabled={submitting}
                  >
                    {submitting ? 'Sending Code...' : `Send Code to Email`}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ===== STEP 1: MAIN USERNAME / PASSWORD FORM ===== */
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">{mode === 'login' ? 'Username or Email' : 'Username'}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={mode === 'login' ? 'Enter username or email...' : 'Choose a unique username...'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {mode === 'signup' && (
                <div className="form-group">
                  <label className="form-label">Email Address (for Verification Code)</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <i
                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  ></i>
                </div>
              </div>

              {error && (
                <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.85rem', lineHeight: '1.4' }}>
                  <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.4rem' }}></i> {error}
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={submitting} style={{ width: '100%', marginBottom: '1rem' }}>
                {submitting ? 'Authenticating & Sending Code...' : (mode === 'login' ? 'Send 6-Digit Code & Sign In' : 'Send 6-Digit Code & Register')}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0 1rem 0', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
                <span>OR CONNECT WITH SOCIAL ACCOUNT</span>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
              </div>

              {/* Social Connect Logos (Only Google & Microsoft) */}
              <div className="auth-social-container" style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="auth-social-card google-card"
                  onClick={() => handleOpenSocialModal('google')}
                  disabled={submitting}
                  title="Sign in with Google"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className="auth-social-card microsoft-card"
                  onClick={() => handleOpenSocialModal('microsoft')}
                  disabled={submitting}
                  title="Sign in with Microsoft"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 23 23" style={{ flexShrink: 0 }}>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H1z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>

              {/* Bottom Cancel & Return Button */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <i className="fas fa-arrow-left"></i> Cancel & Return to Portal
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
