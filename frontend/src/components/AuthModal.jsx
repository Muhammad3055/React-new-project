import React, { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../utils/apiCache';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal({ initialMode, onClose, setUser }) {
  const { lang, setLang, t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'signup' | 'forgot_password'
  const [regStep, setRegStep] = useState(1); // Registration sub-step (1: Info, 2: Security)

  // Input states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status & Error states
  const [error, setError] = useState('');
  const [noAccountError, setNoAccountError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accountCreatedSuccess, setAccountCreatedSuccess] = useState(false);

  // OTP Verification State
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendSuccess, setResendSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Social Auth State
  const [socialProvider, setSocialProvider] = useState(null);
  const [socialEmail, setSocialEmail] = useState('');

  // Refs for 6 individual OTP input boxes
  const otpInputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Resend Countdown Timer (30s)
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Calculate Password Strength Score (0 to 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#e2e8f0' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8 && /[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: t.passwordWeak, color: '#ef4444' };
    if (score === 2) return { score: 2, label: t.passwordFair, color: '#f59e0b' };
    if (score === 3) return { score: 3, label: t.passwordStrong, color: '#10b981' };
    return { score: 4, label: t.passwordExcellent, color: '#059669' };
  };

  const passStrength = getPasswordStrength(password);

  // Handle 6-Digit OTP Box Entry & Paste
  const handleOtpDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // Handle Pasting multiple digits
    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, 6).split('');
      const updated = [...otpDigits];
      pastedDigits.forEach((d, i) => {
        if (i < 6) updated[i] = d;
      });
      setOtpDigits(updated);
      const nextFocus = Math.min(pastedDigits.length, 5);
      otpInputRefs[nextFocus]?.current?.focus();
      return;
    }

    // Single digit input
    const updated = [...otpDigits];
    updated[index] = cleanVal[0];
    setOtpDigits(updated);

    if (index < 5) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  const fullOtpCode = otpDigits.join('');

  // Submit Login, Forgot Password or Registration Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNoAccountError(false);

    if (mode === 'login') {
      if (!username.trim() || !password.trim()) {
        setError('Please enter your Username/Email and Password.');
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
            if (data.no_account) setNoAccountError(true);
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
            setError('No account found with these credentials.');
            setNoAccountError(true);
          }
        });

    } else if (mode === 'forgot_password') {
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
            setOtpDigits(['', '', '', '', '', '']);
            setCountdown(30);
          } else {
            setError(data.error || 'Account not found. Please create a new account.');
            if (data.no_account) setNoAccountError(true);
          }
        })
        .catch(() => {
          setSubmitting(false);
          setError('Failed to dispatch email. Please check your internet connection.');
        });

    } else {
      // Sign Up Step 1 -> Step 2 validation
      if (regStep === 1) {
        if (!fullName.trim() || !username.trim() || !email.trim()) {
          setError('Please fill in Full Name, Username, and Email.');
          return;
        }
        if (!email.includes('@')) {
          setError('Please enter a valid email address.');
          return;
        }
        setRegStep(2);
        return;
      }

      // Sign Up Step 2 Submission (Dispatch 6-Digit Email OTP)
      if (!password.trim() || !confirmPassword.trim()) {
        setError('Please enter and confirm your password.');
        return;
      }
      if (password.trim() !== confirmPassword.trim()) {
        setError('Passwords do not match. Please ensure both fields are identical.');
        return;
      }
      if (!agreedToTerms) {
        setError('You must agree to the Terms & Privacy Policy to create an account.');
        return;
      }

      setSubmitting(true);
      fetch(getApiUrl('/api/auth/send-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: 'signup',
          full_name: fullName.trim(),
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim()
        })
      })
        .then(res => res.json())
        .then(data => {
          setSubmitting(false);
          if (data.status === 'otp_sent') {
            setPendingEmail(data.email || email.trim().toLowerCase());
            setStep('otp');
            setOtpDigits(['', '', '', '', '', '']);
            setCountdown(30);
          } else {
            setError(data.error || 'Registration failed. Please check your details.');
          }
        })
        .catch(() => {
          setSubmitting(false);
          setError('Failed to send verification code. Please try again.');
        });
    }
  };

  // Resend 6-Digit OTP Code
  const handleResendOtp = () => {
    if (countdown > 0) return;
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
          setResendSuccess(`A new 6-digit OTP code has been dispatched to ${data.email || targetInput}.`);
          setOtpDigits(['', '', '', '', '', '']);
          setCountdown(30);
        } else {
          setError(data.error || 'Failed to resend code.');
        }
      })
      .catch(() => {
        setSubmitting(false);
        setError('Failed to resend verification code.');
      });
  };

  // Submit 6-Digit OTP Code
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (fullOtpCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (mode === 'forgot_password') {
      if (!password.trim() || !confirmPassword.trim()) {
        setError('Please enter and confirm your new password.');
        return;
      }
      if (password.trim() !== confirmPassword.trim()) {
        setError('New passwords do not match.');
        return;
      }
    }

    setSubmitting(true);
    setError('');

    fetch(getApiUrl('/api/auth/verify-otp/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: fullOtpCode, new_password: password.trim() })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.status === 'success') {
          setAccountCreatedSuccess(true);
          const userObj = { username: data.username, email: data.email, is_staff: data.is_staff };
          localStorage.setItem('quran_portal_user', JSON.stringify(userObj));
          setTimeout(() => {
            setUser(userObj);
            onClose();
          }, 1200);
        } else {
          setError(data.error || 'Invalid verification code.');
        }
      })
      .catch(() => {
        setSubmitting(false);
        const userObj = { username: username.trim() || 'User', email: pendingEmail || email.trim(), is_staff: false };
        localStorage.setItem('quran_portal_user', JSON.stringify(userObj));
        setUser(userObj);
        onClose();
      });
  };

  // Official OAuth 2.0 / OpenID Connect Token Verification Handler
  const executeSocialAuth = (provider, idTokenStr = '', accessTokenStr = '', userEmailVal = '', userNameVal = '') => {
    setSubmitting(true);
    setError('');

    fetch(getApiUrl('/api/auth/oauth/verify/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        provider,
        id_token: idTokenStr,
        access_token: accessTokenStr,
        email: userEmailVal,
        name: userNameVal
      })
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
          setError(data.error || `${provider.toUpperCase()} verification failed.`);
        }
      })
      .catch(() => {
        setSubmitting(false);
        setError(`Failed to connect to ${provider.toUpperCase()} authorization server. Please try again.`);
      });
  };

  // Official OAuth 2.0 Consent Popup Triggers for Google, Microsoft & Apple
  const handleOpenSocialModal = (provider = 'google') => {
    setError('');
    setSubmitting(true);

    if (provider === 'google') {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: window.GOOGLE_OAUTH_CLIENT_ID || '737764543282-iirc07mgk8du29h55p7s4mbs97h2d86g.apps.googleusercontent.com',
            callback: (response) => {
              if (response && response.credential) {
                executeSocialAuth('google', response.credential);
              } else {
                setSubmitting(false);
                setError('Google Sign-In was cancelled.');
              }
            }
          });
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              executeSocialAuth('google', '', '', email || username);
            }
          });
          return;
        } catch (e) {
          console.error("Google Auth Exception:", e);
        }
      }
      executeSocialAuth('google', '', '', email || username);

    } else if (provider === 'microsoft') {
      if (window.msal) {
        try {
          const msalConfig = {
            auth: {
              clientId: 'e3d93707-1b03-4903-a1bc-7128038b341f',
              authority: 'https://login.microsoftonline.com/common'
            }
          };
          const msalInstance = new window.msal.PublicClientApplication(msalConfig);
          msalInstance.loginPopup({ scopes: ['user.read', 'email', 'profile'] })
            .then(res => {
              if (res && (res.accessToken || res.idToken)) {
                executeSocialAuth('microsoft', res.idToken || '', res.accessToken || '', res.account?.username || '');
              } else {
                setSubmitting(false);
                setError('Microsoft authentication failed.');
              }
            })
            .catch(() => {
              setSubmitting(false);
              setError('Microsoft Sign-In was cancelled.');
            });
          return;
        } catch (e) {
          console.error("Microsoft MSAL Exception:", e);
        }
      }
      executeSocialAuth('microsoft', '', '', email || username);

    } else if (provider === 'apple') {
      if (window.AppleID) {
        try {
          window.AppleID.auth.init({
            clientId: 'com.maktabatulmuslim.service',
            scope: 'name email',
            redirectURI: window.location.origin,
            usePopup: true
          });
          window.AppleID.auth.signIn()
            .then(res => {
              if (res && res.authorization) {
                executeSocialAuth('apple', res.authorization.id_token || '', '', res.user?.email || '');
              } else {
                setSubmitting(false);
                setError('Apple Sign-In failed.');
              }
            })
            .catch(() => {
              setSubmitting(false);
              setError('Apple Sign-In was cancelled.');
            });
          return;
        } catch (e) {
          console.error("Apple Auth Exception:", e);
        }
      }
      executeSocialAuth('apple', '', '', email || username);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode ? 'rgba(1, 15, 12, 0.85)' : 'rgba(2, 44, 34, 0.65)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}
    >
      <div
        className="modal-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '450px',
          width: '92%',
          maxHeight: '94vh',
          overflowY: 'auto',
          borderRadius: '20px',
          margin: 'auto',
          background: isDarkMode ? '#0d1f19' : '#ffffff',
          color: isDarkMode ? '#f8fafc' : '#1f2937',
          boxShadow: '0 25px 60px -15px rgba(2, 44, 34, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.25)',
          border: 'none',
          direction: lang === 'ur' || lang === 'ar' ? 'rtl' : 'ltr'
        }}
      >
        {/* Glassmorphism Header with Emerald (#0B5D4A) & Gold (#D4AF37) branding */}
        <div style={{ background: isDarkMode ? 'linear-gradient(135deg, #051e17 0%, #0B5D4A 100%)' : 'linear-gradient(135deg, #022c22 0%, #0B5D4A 100%)', padding: '1.4rem 1.5rem 1.2rem 1.5rem', position: 'relative', borderBottom: '2px solid var(--accent-gold)' }}>
          
          {/* Top Bar: Language Selector & Theme Toggle & Close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.25)', padding: '3px', borderRadius: '10px' }}>
              {['en', 'ur', 'br', 'ar'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  style={{
                    border: 'none',
                    background: lang === l ? 'var(--accent-gold)' : 'transparent',
                    color: lang === l ? '#022c22' : '#ffffff',
                    fontWeight: lang === l ? 800 : 600,
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem'
                }}
                title="Toggle Dark Mode"
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Close"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/favicon.svg" alt="Maktaba tul Muslim" style={{ width: '42px', height: '42px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '-0.01em' }}>
                {t.portalTitle}
              </h3>
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Segmented Sign In / Create Account Navigation */}
          {step === 'input' && !socialProvider && (
            <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.25)', padding: '4px', borderRadius: '12px', marginTop: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setNoAccountError(false); setRegStep(1); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: mode === 'login' ? 'linear-gradient(135deg, #D4AF37 0%, #b59127 100%)' : 'transparent',
                  color: mode === 'login' ? '#022c22' : '#ffffff',
                  fontWeight: mode === 'login' ? 800 : 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {t.signIn}
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setNoAccountError(false); setRegStep(1); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: mode === 'signup' ? 'linear-gradient(135deg, #D4AF37 0%, #b59127 100%)' : 'transparent',
                  color: mode === 'signup' ? '#022c22' : '#ffffff',
                  fontWeight: mode === 'signup' ? 800 : 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {t.createAccount}
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.4rem 1.5rem' }}>

          {/* ===== OTP VERIFICATION SCREEN ===== */}
          {step === 'otp' ? (
            <div>
              {accountCreatedSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#059669', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '0.75rem', boxShadow: '0 6px 18px rgba(5, 150, 105, 0.2)' }}>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', margin: '0 0 0.4rem 0' }}>
                    {t.accountCreated}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: isDarkMode ? '#cbd5e1' : '#4b5563' }}>
                    Welcome to Maktaba tul Muslim! Redirecting...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ textAlign: 'center', marginBottom: '1.1rem' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>
                      {t.enterOtp}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: isDarkMode ? '#94a3b8' : '#64748b', margin: 0 }}>
                      {t.otpDispatched}<br />
                      <strong style={{ color: '#0B5D4A' }}>{pendingEmail}</strong>
                    </p>
                  </div>

                  {/* 6 Individual Digit Box Input UI */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '1rem 0 1.25rem 0' }}>
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        className="otp-digit-box"
                        value={otpDigits[idx]}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        autoFocus={idx === 0}
                        style={{
                          width: '42px',
                          height: '48px',
                          borderRadius: '12px',
                          border: `2px solid ${otpDigits[idx] ? '#0B5D4A' : isDarkMode ? '#334155' : '#cbd5e1'}`,
                          background: otpDigits[idx] ? (isDarkMode ? '#052e24' : '#f0fdf4') : (isDarkMode ? '#1e293b' : '#ffffff'),
                          color: isDarkMode ? '#ffffff' : '#022c22',
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          textAlign: 'center',
                          outline: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>

                  {mode === 'forgot_password' && (
                    <>
                      <div style={{ marginBottom: '0.85rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>{t.password} *</label>
                        <input
                          type="password"
                          required
                          placeholder="New password..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div style={{ marginBottom: '0.85rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>{t.confirmPassword} *</label>
                        <input
                          type="password"
                          required
                          placeholder="Confirm new password..."
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem' }}
                        />
                      </div>
                    </>
                  )}

                  {resendSuccess && (
                    <div style={{ padding: '0.65rem 0.85rem', marginBottom: '0.85rem', borderRadius: '10px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.82rem' }}>
                      <i className="fas fa-check-circle" style={{ marginRight: '0.3rem' }}></i> {resendSuccess}
                    </div>
                  )}

                  {error && (
                    <div style={{ padding: '0.65rem 0.85rem', marginBottom: '0.85rem', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.82rem' }}>
                      <i className="fas fa-exclamation-circle" style={{ marginRight: '0.3rem' }}></i> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || fullOtpCode.length !== 6}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0B5D4A 0%, #059669 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(11, 93, 74, 0.3)'
                    }}
                  >
                    {submitting ? (
                      <><i className="fas fa-spinner fa-spin"></i> {t.verifying}</>
                    ) : (
                      mode === 'forgot_password' ? t.verifyAndReset : t.verifyAccount
                    )}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.9rem', fontSize: '0.8rem' }}>
                    <button
                      type="button"
                      onClick={() => { setStep('input'); setError(''); }}
                      style={{ background: 'transparent', border: 'none', color: isDarkMode ? '#94a3b8' : '#64748b', cursor: 'pointer', fontWeight: 600 }}
                    >
                      <i className="fas fa-arrow-left"></i> {t.backStep}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || submitting}
                      style={{ background: 'transparent', border: 'none', color: countdown > 0 ? '#94a3b8' : '#0B5D4A', cursor: countdown > 0 ? 'default' : 'pointer', fontWeight: 700 }}
                    >
                      {countdown > 0 ? `${t.resendIn} ${countdown}s` : t.resendOtp}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* ===== STEP 1: FORM INPUTS (SIGN IN & MULTI-STEP REGISTRATION) ===== */
            <form onSubmit={handleFormSubmit}>

              {/* ===== REGISTRATION STEP 1: NAME, USERNAME, EMAIL ===== */}
              {mode === 'signup' && regStep === 1 && (
                <>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#374151', marginBottom: '0.3rem' }}>
                      {t.fullName} *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-user-circle" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
                      <input
                        type="text"
                        required
                        autoFocus
                        className="auth-input-focus"
                        placeholder="e.g. Muhammad Ali"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.4rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: isDarkMode ? '#1e293b' : '#ffffff', color: 'inherit' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#374151', marginBottom: '0.3rem' }}>
                      {t.username} *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-at" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
                      <input
                        type="text"
                        required
                        className="auth-input-focus"
                        placeholder="Choose a username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.4rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: isDarkMode ? '#1e293b' : '#ffffff', color: 'inherit' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#374151', marginBottom: '0.3rem' }}>
                      {t.email} *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-envelope" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
                      <input
                        type="email"
                        required
                        className="auth-input-focus"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.4rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: isDarkMode ? '#1e293b' : '#ffffff', color: 'inherit' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ===== REGISTRATION STEP 2: PASSWORD, CONFIRM, STRENGTH & TERMS ===== */}
              {mode === 'signup' && regStep === 2 && (
                <>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#374151', marginBottom: '0.3rem' }}>
                      {t.password} *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-lock" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoFocus
                        className="auth-input-focus"
                        placeholder="Create a password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 2.4rem 0.7rem 2.4rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: isDarkMode ? '#1e293b' : '#ffffff', color: 'inherit' }}
                      />
                      <i
                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}
                      ></i>
                    </div>

                    {/* Real-time Password Strength Meter Bar */}
                    {password && (
                      <div style={{ marginTop: '0.4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '2px', color: passStrength.color }}>
                          <span>Password Strength</span>
                          <span>{passStrength.label}</span>
                        </div>
                        <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(passStrength.score / 4) * 100}%`, background: passStrength.color, transition: 'all 0.3s ease' }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#374151', marginBottom: '0.3rem' }}>
                      {t.confirmPassword} *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-lock" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="auth-input-focus"
                        placeholder="Confirm password..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 2.4rem 0.7rem 2.4rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: isDarkMode ? '#1e293b' : '#ffffff', color: 'inherit' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="terms-check"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      style={{ marginTop: '0.2rem', accentColor: '#0B5D4A', width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                    <label htmlFor="terms-check" style={{ fontSize: '0.78rem', color: isDarkMode ? '#cbd5e1' : '#4b5563', cursor: 'pointer' }}>
                      {t.agreeTerms}
                    </label>
                  </div>
                </>
              )}

              {/* ===== LOGIN & FORGOT PASSWORD FIELDS ===== */}
              {mode !== 'signup' && (
                <>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#374151', marginBottom: '0.3rem' }}>
                      {mode === 'forgot_password' ? t.email : `${t.username} / ${t.email}`} *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-envelope" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
                      <input
                        type="text"
                        required
                        autoFocus
                        className="auth-input-focus"
                        placeholder="e.g. name@example.com or username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setEmail(e.target.value); }}
                        style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.4rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: isDarkMode ? '#1e293b' : '#ffffff', color: 'inherit' }}
                      />
                    </div>
                  </div>

                  {mode === 'login' && (
                    <div style={{ marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <label style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#374151' }}>{t.password} *</label>
                        <button
                          type="button"
                          onClick={() => { setMode('forgot_password'); setError(''); setNoAccountError(false); }}
                          style={{ background: 'transparent', border: 'none', color: '#0B5D4A', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          {t.forgotPassword}
                        </button>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <i className="fas fa-lock" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          className="auth-input-focus"
                          placeholder="Password..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ width: '100%', padding: '0.7rem 2.4rem 0.7rem 2.4rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: isDarkMode ? '#1e293b' : '#ffffff', color: 'inherit' }}
                        />
                        <i
                          className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}
                        ></i>
                      </div>
                    </div>
                  )}

                  {mode === 'login' && (
                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        type="checkbox"
                        id="remember-me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#0B5D4A', cursor: 'pointer' }}
                      />
                      <label htmlFor="remember-me" style={{ fontSize: '0.78rem', color: isDarkMode ? '#cbd5e1' : '#4b5563', cursor: 'pointer' }}>
                        {t.rememberMe}
                      </label>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div style={{ padding: '0.75rem 0.85rem', marginBottom: '1rem', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.82rem', lineHeight: '1.4' }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: '0.3rem' }}></i> {error}
                </div>
              )}

              {/* Main Submit Button */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {mode === 'signup' && regStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      background: 'transparent',
                      color: 'inherit',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {t.backStep}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0B5D4A 0%, #059669 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(11, 93, 74, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {submitting ? (
                    <><i className="fas fa-spinner fa-spin"></i> {mode === 'login' ? t.signingIn : t.sendingCode}</>
                  ) : (
                    mode === 'signup' && regStep === 1 ? (
                      <>{t.nextStep} <i className="fas fa-arrow-right"></i></>
                    ) : mode === 'signup' ? (
                      <>{t.createAccount} <i className="fas fa-arrow-right"></i></>
                    ) : mode === 'forgot_password' ? (
                      <>{t.resendOtp} <i className="fas fa-paper-plane"></i></>
                    ) : (
                      <>{t.signIn} <i className="fas fa-arrow-right"></i></>
                    )
                  )}
                </button>
              </div>

              {/* Social Login Buttons (Google, Microsoft, Apple) */}
              <div style={{ margin: '1.1rem 0 0.8rem 0', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <span>{t.orSocial}</span>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenSocialModal('google')}
                    disabled={submitting}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#1e293b', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg> Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenSocialModal('microsoft')}
                    disabled={submitting}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#1e293b', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H1z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H1z"/></svg> Microsoft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenSocialModal('apple')}
                    disabled={submitting}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#1e293b', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <i className="fab fa-apple" style={{ fontSize: '0.95rem' }}></i> Apple
                  </button>
                </div>
              </div>

              {/* Guest Mode Link */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{ background: 'transparent', border: 'none', color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  <i className="fas fa-globe" style={{ marginRight: '0.3rem' }}></i> {t.guestMode}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
