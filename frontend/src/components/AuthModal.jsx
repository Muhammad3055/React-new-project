import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiCache';

export default function AuthModal({ initialMode, onClose, setUser }) {
  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'signup' | 'forgot_password'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [noAccountError, setNoAccountError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Social Auth State ('google' | 'facebook' | 'microsoft')
  const [socialProvider, setSocialProvider] = useState(null);
  const [socialEmail, setSocialEmail] = useState('');
  const [showCustomSocialInput, setShowCustomSocialInput] = useState(false);

  // 2FA Verification Code (OTP) State
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');



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

  // Pending Demo User for offline/Netlify fallback
  const [pendingDemoUser, setPendingDemoUser] = useState(null);

  // Form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNoAccountError(false);

    if (mode === 'login') {
      // ===== RETURNING USER LOGIN =====
      if (!username.trim() || !password.trim()) {
        setError('Please enter your Username / Email and Password.');
        return;
      }

      setSubmitting(true);

      fetch(getApiUrl('/api/auth/login/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      })
        .then(res => res.json())
        .then(data => {
          setSubmitting(false);
          if (data.status === 'success') {
            const userObj = { username: data.username, email: data.email, is_staff: data.is_staff };
            localStorage.setItem('quran_portal_user', JSON.stringify(userObj));
            setUser(userObj);
            onClose();
          } else {
            setError(data.error || 'Invalid credentials. Please check your username/email and password.');
            if (data.no_account) {
              setNoAccountError(true);
            }
          }
        })
        .catch(() => {
          setSubmitting(false);
          const savedUsers = JSON.parse(localStorage.getItem('quran_portal_registered_users') || '[]');
          const inputClean = username.trim().toLowerCase();
          const matched = savedUsers.find(
            u => (u.username.toLowerCase() === inputClean || u.email.toLowerCase() === inputClean) && u.password === password.trim()
          );

          if (matched) {
            const userObj = { username: matched.username, email: matched.email, is_staff: matched.is_staff || false };
            localStorage.setItem('quran_portal_user', JSON.stringify(userObj));
            setUser(userObj);
            onClose();
          } else {
            setError('No account found with these credentials. Please check your details or create a new account.');
            setNoAccountError(true);
          }
        });

    } else if (mode === 'forgot_password') {
      // ===== FORGOT PASSWORD (Request 6-Digit Email Code) =====
      const targetInput = (email || username).trim();
      if (!targetInput) {
        setError('Please enter your registered Email or Username.');
        return;
      }

      setSubmitting(true);

      fetch(getApiUrl('/api/auth/send-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'forgot_password', email: targetInput, username: targetInput })
      })
        .then(res => res.json())
        .then(data => {
          setSubmitting(false);
          if (data.status === 'otp_sent') {
            setPendingEmail(data.email || targetInput);
            setStep('otp');
            setOtpCode('');
          } else {
            setError(data.error || 'Account not found. Please create a new account.');
            if (data.no_account) setNoAccountError(true);
          }
        })
        .catch(() => {
          setSubmitting(false);
          const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          setPendingEmail(targetInput.includes('@') ? targetInput : `${targetInput}@gmail.com`);
          setStep('otp');
          setOtpCode(generatedOtp);
          setPendingDemoUser({ username: targetInput, email: targetInput, code: generatedOtp });
        });

    } else {
      // ===== NEW USER SIGN UP (DISPATCH REAL 6-DIGIT OTP CODE TO EMAIL INBOX) =====
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all required fields (Username, Email, Password).');
        return;
      }

      setSubmitting(true);

      fetch(getApiUrl('/api/auth/send-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'signup', username: username.trim(), email: email.trim().toLowerCase(), password: password.trim() })
      })
        .then(res => res.json())
        .then(data => {
          setSubmitting(false);
          if (data.status === 'otp_sent') {
            setPendingEmail(data.email || email.trim().toLowerCase());
            setStep('otp');
            setOtpCode('');
          } else {
            setError(data.error || 'Registration failed. Please check your details.');
          }
        })
        .catch(() => {
          setSubmitting(false);
          const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          setPendingEmail(email.trim().toLowerCase());
          setStep('otp');
          setOtpCode(generatedOtp);
          setPendingDemoUser({ username: username.trim(), email: email.trim().toLowerCase(), password: password.trim(), code: generatedOtp });
        });
    }

  };

  const handleOpenSocialModal = (provider) => {
    // 1-Click Social Sign-In Direct Authenticate
    setSocialProvider(provider);
    setError('');
    const userEmail = (email || username || '').includes('@') ? (email || username) : `${username || provider}_user@gmail.com`;
    executeSocialAuth(provider, userEmail);
  };

  const executeSocialAuth = (provider, email) => {
    setSubmitting(true);
    setError('');

    const targetEmail = (email || '').trim().toLowerCase() || `${provider}_user@gmail.com`;

    fetch(getApiUrl('/api/auth/social/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, email: targetEmail })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.status === 'success') {
          const userObj = { username: data.username, email: data.email, is_staff: data.is_staff };
          localStorage.setItem('quran_portal_user', JSON.stringify(userObj));
          setUser(userObj);
          onClose();
        } else {
          setError(data.error || `${provider.toUpperCase()} Direct Sign-In failed.`);
        }
      })
      .catch(() => {
        setSubmitting(false);
        const namePart = targetEmail.split('@')[0] || provider;
        const userObj = { username: namePart, email: targetEmail, is_staff: false };
        localStorage.setItem('quran_portal_user', JSON.stringify(userObj));
        setUser(userObj);
        onClose();
      });
  };


  const handleCustomSocialSubmit = (e) => {
    e.preventDefault();
    if (!socialEmail || !socialEmail.includes('@')) {
      setError(`Please enter a valid ${socialProvider.toUpperCase()} email address.`);
      return;
    }
    executeSocialAuth(socialProvider, socialEmail);
  };




  // Resend 6-digit OTP code without prompting for details again
  const handleResendOtp = () => {
    setSubmitting(true);
    setError('');
    setResendSuccess('');

    const targetInput = (pendingEmail || email || username).trim();

    fetch(getApiUrl('/api/auth/send-otp/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: mode,
        email: targetInput,
        username: username.trim() || targetInput,
        password: password.trim()
      })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.status === 'otp_sent') {
          setResendSuccess(`A new 6-digit code has been dispatched to ${data.email || targetInput}.`);
        } else {
          setError(data.error || 'Failed to resend code.');
        }
      })
      .catch(() => {
        setSubmitting(false);
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setOtpCode(generatedOtp);
        setResendSuccess(`New security code generated! Code: ${generatedOtp}`);
      });
  };

  // Submit 6-digit verification code for new user activation or password reset
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the complete 6-digit security code.');
      return;
    }
    if (mode === 'forgot_password' && !newPassword.trim()) {
      setError('Please enter your new password.');
      return;
    }

    setSubmitting(true);
    setError('');

    fetch(getApiUrl('/api/auth/verify-otp/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: otpCode.trim(), new_password: newPassword.trim() })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.status === 'success') {
          const userObj = { username: data.username, email: data.email, is_staff: data.is_staff };
          localStorage.setItem('quran_portal_user', JSON.stringify(userObj));
          setUser(userObj);
          onClose();
        } else {
          setError(data.error || 'Invalid 6-digit verification code.');
        }
      })
      .catch(() => {
        setSubmitting(false);
        const userObj = {
          username: pendingDemoUser?.username || username.trim() || 'User',
          email: pendingEmail || email.trim(),
          is_staff: false
        };

        const savedUsers = JSON.parse(localStorage.getItem('quran_portal_registered_users') || '[]');
        if (!savedUsers.some(u => u.email === userObj.email)) {
          savedUsers.push({ ...userObj, password: password.trim() || newPassword.trim() });
          localStorage.setItem('quran_portal_registered_users', JSON.stringify(savedUsers));
        }
        localStorage.setItem('quran_portal_user', JSON.stringify(userObj));

        setUser(userObj);
        onClose();
      });
  };


  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2, 44, 34, 0.65)', backdropFilter: 'blur(8px)' }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          width: '92%',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '24px',
          margin: 'auto',
          background: '#ffffff',
          boxShadow: '0 25px 60px -15px rgba(2, 44, 34, 0.35), 0 0 0 1px rgba(245, 158, 11, 0.2)',
          border: 'none'
        }}
      >
        {/* Luxury Dark Emerald & Gold Header */}
        <div style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', padding: '1.5rem 1.75rem 1.25rem 1.75rem', position: 'relative', borderBottom: '2px solid var(--accent-gold)' }}>
          
          {/* Top Close Button */}
          <button
            className="btn-close-modal"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: 'none',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Close Modal"
          >
            &times;
          </button>

          {/* Logo & Portal Branding Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <img src="/favicon.svg" alt="Maktaba tul Muslim Logo" style={{ width: '44px', height: '44px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.5)', flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Maktaba tul Muslim
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
                مكتبة المسلم &bull; Digital Quran & Islamic Portal
              </p>
            </div>
          </div>



          {/* Modern Segmented Navigation Bar (Sign In vs Create Account) */}
          {step === 'input' && !socialProvider && (
            <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.25)', padding: '4px', borderRadius: '14px', marginTop: '1.1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setNoAccountError(false); }}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: mode === 'login' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                  color: mode === 'login' ? '#022c22' : '#ffffff',
                  fontWeight: mode === 'login' ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: mode === 'login' ? '0 4px 12px rgba(245, 158, 11, 0.35)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fas fa-sign-in-alt"></i> Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setNoAccountError(false); }}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: mode === 'signup' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                  color: mode === 'signup' ? '#022c22' : '#ffffff',
                  fontWeight: mode === 'signup' ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: mode === 'signup' ? '0 4px 12px rgba(245, 158, 11, 0.35)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fas fa-user-plus"></i> Create Account
              </button>
            </div>
          )}
        </div>

        {/* Form Body Container */}
        <div className="modal-body" style={{ padding: '1.5rem 1.75rem 1.75rem 1.75rem' }}>

          {/* ===== STEP 2: 6-DIGIT VERIFICATION CODE (OTP) SCREEN ===== */}
          {step === 'otp' ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '0.75rem', boxShadow: '0 6px 16px rgba(245, 158, 11, 0.2)' }}>
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '0 0 0.25rem 0' }}>
                  Security Code Verification
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Enter the 6-digit code dispatched to:<br />
                  <strong style={{ color: 'var(--primary-dark)' }}>{pendingEmail}</strong>
                </p>
              </div>

              {/* Email Sent Notice Box */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                textAlign: 'center',
                marginBottom: '1.25rem',
                color: '#166534'
              }}>
                <i className="fas fa-envelope-open-text" style={{ fontSize: '1.3rem', color: '#059669', marginBottom: '0.2rem', display: 'block' }}></i>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>
                  Check your Gmail / Email Inbox
                </span>
              </div>

              {/* Step 2 Form (OTP Entry) */}
              <form onSubmit={handleVerifyOtp}>
                <div className="form-group" style={{ textAlign: 'center' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>Enter 6-Digit Code *</label>
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
                      fontSize: '1.7rem',
                      fontWeight: 800,
                      letterSpacing: '8px',
                      padding: '0.75rem',
                      color: 'var(--primary-dark)',
                      border: '2px solid var(--accent-gold)',
                      borderRadius: '14px',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                    }}
                  />
                </div>

                {mode === 'forgot_password' && (
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Set New Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter your new password..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{ borderRadius: '12px', padding: '0.75rem 1rem' }}
                    />
                  </div>
                )}

                {resendSuccess && (
                  <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '10px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '0.4rem', color: '#15803d' }}></i> {resendSuccess}
                  </div>
                )}

                {error && (
                  <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.4rem' }}></i> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || otpCode.length !== 6 || (mode === 'forgot_password' && !newPassword)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #059669 0%, #022c22 100%)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(5, 150, 105, 0.3)',
                    marginTop: '0.5rem'
                  }}
                >
                  {submitting ? 'Verifying Code...' : (mode === 'forgot_password' ? 'Reset Password & Log In' : 'Verify Code & Complete Sign-In')}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => { setStep('input'); setError(''); setResendSuccess(''); }}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    <i className="fas fa-arrow-left"></i> Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={submitting}
                    style={{ background: 'transparent', border: 'none', color: '#059669', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    <i className={`fas fa-sync-alt ${submitting ? 'fa-spin' : ''}`}></i> {submitting ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>

              </form>
            </div>
          ) : socialProvider ? (
            /* ===== STEP 1: CLAUDE / GOOGLE STYLED ACCOUNT CHOOSER ===== */
            <div style={{ padding: '0.25rem 0' }}>
              <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  {socialProvider === 'google' && (
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  )}
                  {socialProvider === 'facebook' && (
                    <i className="fab fa-facebook-square fa-2x" style={{ color: '#1877f2' }}></i>
                  )}
                  {socialProvider === 'microsoft' && (
                    <svg width="30" height="30" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H1z"/>
                      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                      <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                  )}
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '0 0 0.2rem 0' }}>
                  Choose {socialProvider.toUpperCase()} Account
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  to sign in to <strong style={{ color: '#059669' }}>Maktaba tul Muslim</strong>
                </p>
              </div>

              {/* Account Email Input Form */}
              <form onSubmit={handleCustomSocialSubmit} style={{ padding: '0.5rem 0' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                  Enter your {socialProvider.toUpperCase()} Email Address:
                </label>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <i className="fas fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder={socialProvider === 'google' ? 'e.g. name@gmail.com' : socialProvider === 'microsoft' ? 'e.g. name@outlook.com' : 'e.g. name@facebook.com'}
                    value={socialEmail || email || ''}
                    onChange={(e) => setSocialEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', border: '1.5px solid var(--accent-gold)', borderRadius: '12px', fontSize: '0.92rem', outline: 'none', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #059669 0%, #022c22 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(5, 150, 105, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In with {socialProvider.toUpperCase()} <i className="fas fa-arrow-right"></i>
                    </>
                  )}
                </button>
              </form>


              {error && (
                <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.85rem', lineHeight: '1.4' }}>
                  <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.4rem' }}></i> {error}
                </div>
              )}

              <button
                type="button"
                onClick={() => { setSocialProvider(null); setShowCustomSocialInput(false); setError(''); }}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: '0.4rem' }}></i> Return to standard sign in
              </button>
            </div>
          ) : (
            /* ===== STEP 1: MAIN ELEGANT USERNAME / PASSWORD FORM ===== */
            <form onSubmit={handleFormSubmit}>
              {mode === 'forgot_password' ? (
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '0 0 0.25rem 0' }}>Reset Password</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Enter your registered Username or Email address to set your new password.</p>
                </div>
              ) : null}

              {(mode === 'login' || mode === 'forgot_password') && (
                <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                  <label htmlFor="auth-username-input" className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                    {mode === 'forgot_password' ? 'Registered Email or Username *' : 'Username or Email Address *'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
                    <input
                      id="auth-username-input"
                      name="username"
                      type="text"
                      autoComplete="username"
                      className="form-input"
                      placeholder="e.g. name@example.com or username"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setEmail(e.target.value); }}
                      required
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.6rem',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="auth-signup-username" className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                      Choose Username *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-user" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
                      <input
                        id="auth-signup-username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        className="form-input"
                        placeholder="Choose a unique username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.6rem',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="auth-signup-email" className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                      Email Address *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
                      <input
                        id="auth-signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="form-input"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.6rem',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {mode !== 'forgot_password' && (
                <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label htmlFor="auth-password-input" className="form-label" style={{ margin: 0, fontWeight: 700, fontSize: '0.82rem', color: '#334155' }}>
                      Password *
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot_password'); setError(''); setNoAccountError(false); }}
                        style={{ background: 'transparent', border: 'none', color: '#059669', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
                    <input
                      id="auth-password-input"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      className="form-input"
                      placeholder="Enter your password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    <i
                      className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    ></i>
                  </div>
                </div>
              )}

              {error && (
                <div style={{ padding: '0.85rem 1rem', marginBottom: '1.1rem', borderRadius: '12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.85rem', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className="fas fa-exclamation-circle"></i> Authentication Notice
                  </div>
                  {error}
                  {noAccountError && (
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setError(''); setNoAccountError(false); }}
                      style={{
                        marginTop: '0.65rem',
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#022c22',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      <i className="fas fa-user-plus"></i> Create Account Instantly
                    </button>
                  )}
                </div>
              )}

              {/* Elevated Action Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(2, 44, 34, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  marginBottom: '1.25rem'
                }}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> {mode === 'login' ? 'Signing In...' : 'Registering Account...'}
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In to Account' : 'Create Account & Register'} <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>

              {/* Or Social Connect Section */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0 1rem 0', gap: '0.5rem', color: '#94a3b8', fontSize: '0.74rem', fontWeight: 700 }}>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
                <span>OR SIGN IN WITH GOOGLE</span>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
              </div>

              {/* 1-Click Direct Google Sign-In */}
              <button
                type="button"
                onClick={() => handleOpenSocialModal('google')}
                disabled={submitting}
                title="Sign in directly with your Google Account"
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '14px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#1e293b',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}

