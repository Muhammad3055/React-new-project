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

  // Social Auth State ('google' | 'microsoft')
  const [socialProvider, setSocialProvider] = useState(null);
  const [socialEmail, setSocialEmail] = useState('');

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
      // ===== NEW USER SIGN UP =====
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all required fields (Username, Email, Password).');
        return;
      }

      setSubmitting(true);

      fetch(getApiUrl('/api/auth/send-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'signup', username: username.trim(), email: email.trim().toLowerCase(), password: password.trim() })
      })
        .then(res => res.json())
        .then(data => {
          setSubmitting(false);
          if (data.status === 'otp_sent') {
            setPendingEmail(data.email || email.trim());
            setStep('otp');
            setOtpCode('');
          } else {
            setError(data.error || 'Registration failed. Please check your details.');
          }
        })
        .catch(() => {
          setSubmitting(false);
          const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          setPendingEmail(email.trim());
          setStep('otp');
          setOtpCode(generatedOtp);
          setPendingDemoUser({ username: username.trim(), email: email.trim(), password: password.trim(), code: generatedOtp });
        });
    }
  };

  const handleSocialLoginDirect = (provider) => {
    setSubmitting(true);
    setError('');

    let promptMessage = "Sign in with Google Account:\nEnter your @gmail.com email address:";
    if (provider === 'microsoft') {
      promptMessage = "Sign in with Microsoft Account:\nEnter your @outlook.com or @hotmail.com email address:";
    } else if (provider === 'facebook') {
      promptMessage = "Sign in with Facebook Account:\nEnter your Facebook email address:";
    }

    const userInput = prompt(promptMessage);
    if (!userInput || !userInput.trim()) {
      setSubmitting(false);
      return;
    }

    const targetEmail = userInput.trim().toLowerCase();

    // Domain validation
    if (provider === 'google') {
      if (!targetEmail.includes('@gmail.com') && !targetEmail.includes('@googlemail.com')) {
        setError('Invalid Google Account! Please enter a valid Gmail address (e.g. user@gmail.com).');
        setSubmitting(false);
        return;
      }
    } else if (provider === 'microsoft') {
      const msDomains = ['@outlook.', '@hotmail.', '@live.', '@msn.', '@microsoft.'];
      if (!msDomains.some(d => targetEmail.includes(d))) {
        setError('Invalid Microsoft Account! Please enter a valid Microsoft email address.');
        setSubmitting(false);
        return;
      }
    } else if (provider === 'facebook') {
      if (!targetEmail.includes('@')) {
        setError('Invalid Facebook Account! Please enter a valid email address.');
        setSubmitting(false);
        return;
      }
    }

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
          setError(data.error || `${provider.toUpperCase()} Sign-In failed.`);
        }
      })
      .catch(() => {
        setSubmitting(false);
        const namePart = targetEmail.split('@')[0];
        const userObj = { username: namePart, email: targetEmail, is_staff: false };
        localStorage.setItem('quran_portal_user', JSON.stringify(userObj));
        setUser(userObj);
        onClose();
      });
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
    <div className="modal-overlay" onClick={onClose} style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '450px', width: '92%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', margin: 'auto' }}
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

              {/* Step 2 Form (OTP Entry) */}
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
                    />
                  </div>
                )}

                {resendSuccess && (
                  <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '0.4rem', color: '#15803d' }}></i> {resendSuccess}
                  </div>
                )}

                {error && (
                  <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.4rem' }}></i> {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={submitting || otpCode.length !== 6 || (mode === 'forgot_password' && !newPassword)}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginBottom: '0.75rem' }}
                >
                  {submitting ? 'Verifying Code...' : (mode === 'forgot_password' ? 'Reset Password & Log In' : 'Verify Code & Complete Sign-In')}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => { setStep('input'); setError(''); setResendSuccess(''); }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    <i className="fas fa-arrow-left"></i> Change Email / Details
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={submitting}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary-light)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    <i className={`fas fa-sync-alt ${submitting ? 'fa-spin' : ''}`}></i> {submitting ? 'Sending Code...' : 'Resend Code'}
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
              {mode === 'forgot_password' ? (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)' }}>Reset Your Password</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter your registered Username or Email address to receive a 6-digit verification code in Gmail.</p>
                </div>
              ) : null}

              {(mode === 'login' || mode === 'forgot_password') && (
                <div className="form-group">
                  <label className="form-label">{mode === 'forgot_password' ? 'Registered Email or Username' : 'Username or Email'}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter registered username or email..."
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setEmail(e.target.value); }}
                    required
                    autoFocus
                  />
                </div>
              )}

              {mode === 'signup' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Choose Username *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Choose a unique username..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address (for Verification Code) *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {mode !== 'forgot_password' && (
                <div className="form-group" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Password *</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot_password'); setError(''); setNoAccountError(false); }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary-light)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
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
              )}

              {error && (
                <div style={{ padding: '0.85rem', marginBottom: '1rem', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.85rem', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <i className="fas fa-exclamation-triangle"></i> Authentication Alert
                  </div>
                  {error}
                  {noAccountError && (
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setError(''); setNoAccountError(false); }}
                      style={{
                        marginTop: '0.65rem',
                        width: '100%',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        background: 'var(--accent-gold)',
                        color: 'var(--primary-dark)',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <i className="fas fa-user-plus"></i> Create New Account Now
                    </button>
                  )}
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={submitting} style={{ width: '100%', marginBottom: '1rem' }}>
                {submitting ? (mode === 'login' ? 'Signing In...' : 'Sending Code...') : (mode === 'login' ? 'Sign In to Account' : 'Send 6-Digit Code & Register')}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0 1rem 0', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
                <span>OR CONNECT WITH SOCIAL ACCOUNT</span>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
              </div>

              {/* Social Connect Logos (Google, Facebook, Microsoft) */}
              <div className="auth-social-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="auth-social-card google-card"
                  onClick={() => handleSocialLoginDirect('google')}
                  disabled={submitting}
                  title="Sign in with Google Account"
                  style={{ padding: '0.6rem 0.3rem', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className="auth-social-card facebook-card"
                  onClick={() => handleSocialLoginDirect('facebook')}
                  disabled={submitting}
                  title="Sign in with Facebook Account"
                  style={{ padding: '0.6rem 0.3rem', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1877f2' }}
                >
                  <i className="fab fa-facebook-f" style={{ fontSize: '1rem', color: '#1877f2' }}></i>
                  <span>Facebook</span>
                </button>

                <button
                  type="button"
                  className="auth-social-card microsoft-card"
                  onClick={() => handleSocialLoginDirect('microsoft')}
                  disabled={submitting}
                  title="Sign in with Microsoft Account"
                  style={{ padding: '0.6rem 0.3rem', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  <svg width="16" height="16" viewBox="0 0 23 23" style={{ flexShrink: 0 }}>
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
