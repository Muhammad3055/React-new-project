import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../utils/apiCache';

export default function Navbar({ activeTab, navigateToTab, user, setUser, openAuthModal }) {
  const { language, setLanguage, t } = useLanguage();
  const [mobileActive, setMobileActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExtrasMenu, setShowExtrasMenu] = useState(false);
  const [toast, setToast] = useState(null);

  // Global Website Theme Modes ('light' | 'sepia' | 'black' | 'auto')
  const [globalTheme, setGlobalTheme] = useState(() => {
    try {
      return localStorage.getItem('quran_portal_global_theme') || 'auto';
    } catch (e) {
      return 'auto';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-site-theme', globalTheme);
    try {
      localStorage.setItem('quran_portal_global_theme', globalTheme);
    } catch (e) { }
  }, [globalTheme]);

  const extraMenuItems = [
    { label: t('khatam'), icon: 'fas fa-calendar-check', action: () => { navigateToTab('khatam'); setShowExtrasMenu(false); } },
    { label: t('fazail'), icon: 'fas fa-book', action: () => { navigateToTab('fazail'); setShowExtrasMenu(false); } },
    { label: t('namesOfAllah'), icon: 'fas fa-star', action: () => { navigateToTab('namesOfAllah'); setShowExtrasMenu(false); } },
    { label: t('tasbeeh'), icon: 'fas fa-hand-holding-heart', action: () => { navigateToTab('tasbeeh'); setShowExtrasMenu(false); } },
    { label: t('duas'), icon: 'fas fa-hands', action: () => { navigateToTab('duas'); setShowExtrasMenu(false); } },
    { label: t('hadith'), icon: 'fas fa-scroll', action: () => { navigateToTab('hadith'); setShowExtrasMenu(false); } },
    { label: t('tafseer'), icon: 'fas fa-bookmark', action: () => { navigateToTab('tafseer'); setShowExtrasMenu(false); } },
    { label: t('books'), icon: 'fas fa-file-pdf', action: () => { navigateToTab('books'); setShowExtrasMenu(false); } },
    { label: t('aboutUs'), icon: 'fas fa-info-circle', action: () => { navigateToTab('about'); setShowExtrasMenu(false); } },
    { label: t('contact'), icon: 'fas fa-envelope', action: () => { navigateToTab('contact'); setShowExtrasMenu(false); } },
  ];


  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      fetch(getApiUrl(`/api/search/?q=${encodeURIComponent(searchQuery)}`))
        .then(res => res.json())
        .then(data => {
          setSearchResults(data.results || []);
          setShowDropdown(true);
        })
        .catch(() => setSearchResults([]));
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!showExtrasMenu) return;
    const handleClickOutside = () => setShowExtrasMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showExtrasMenu]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileActive]);

  const handleResultClick = (result) => {
    navigateToTab(result.tab || 'home');
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem('quran_portal_user');
    sessionStorage.clear();
    setUser(null);
    fetch(getApiUrl('/api/auth/logout/'), { method: 'POST', cache: 'no-store' })
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        window.location.reload();
      });
  };

  const navItems = [
    { id: 'home', label: t('home'), icon: 'fas fa-home' },
    { id: 'read', label: t('readQuran'), icon: 'fas fa-book-open' },
    { id: 'quran', label: t('mp3Audio'), icon: 'fas fa-headphones' },
    { id: 'about', label: t('aboutUs'), icon: 'fas fa-info-circle' },
  ];

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="navbar-toast">
          <span>{toast}</span>
        </div>
      )}

      <header className="navbar">
        <div className="nav-container">
          <div className="navbar-left-group">
            <div className="brand-logo" onClick={() => { navigateToTab('home'); setMobileActive(false); }}>
              <span className="brand-text">{t('brandName')}</span>
            </div>

            <ul className="nav-links desktop-nav">
              {navItems.map((item) => (
                <li key={item.id}>
                  <span
                    className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => navigateToTab(item.id)}
                  >
                    <i className={item.icon}></i>
                    <span className="nav-link-text">{item.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side controls group */}
          <div className="navbar-right-group">
            {/* Search */}
            <div className="search-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {showDropdown && searchResults.length > 0 && (
                <div className="search-results-dropdown">
                  {searchResults.map((item, idx) => (
                    <div key={idx} className="search-item" onClick={() => handleResultClick(item)}>
                      <span>{item.title}</span>
                      <span className="search-item-type">{item.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Global Language Selector (English, Urdu, Brahui) */}
            <div className="header-language-selector" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.45)' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)' }} title={t('selectLanguage')}>
                <i className="fas fa-globe"></i>
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: '#022c22',
                  color: 'var(--accent-gold)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: '12px'
                }}
                title="Select Website Language (English, Urdu, Brahui, Arabic)"
              >
                <option value="english">🇬🇧 English</option>
                <option value="urdu">🇵🇰 اردو</option>
                <option value="brahui">📜 براہوئی</option>
                <option value="arabic">🇸🇦 العربية</option>
              </select>
            </div>

            {/* Global Website Theme Selector (Light, Sepia, Black, Auto) */}
            <div className="header-theme-selector" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.35)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-gold)' }} title="Website Theme">
                <i className="fas fa-palette"></i>
              </span>
              <select
                value={globalTheme}
                onChange={(e) => setGlobalTheme(e.target.value)}
                style={{
                  background: '#022c22',
                  color: 'var(--accent-gold)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: '12px'
                }}
                title="Select Website Theme (Light, Sepia, Black, Auto)"
              >
                <option value="light">☀️ Light</option>
                <option value="sepia">📜 Sepia</option>
                <option value="black">🌙 Black</option>
                <option value="auto">🌓 Auto</option>
              </select>
            </div>

            {/* Desktop Extras Menu Toggle */}
            <div className="desktop-extras-menu">
              <button
                className={`extras-menu-toggle ${showExtrasMenu ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setShowExtrasMenu(!showExtrasMenu); }}
                aria-label="Open extras menu"
              >
                <i className="fas fa-th-large"></i>
                <span className="more-text">{t('more')}</span>
              </button>
              {showExtrasMenu && (
                <>
                  <div className="desktop-extras-overlay" onClick={() => setShowExtrasMenu(false)} />
                  <aside className="desktop-extras-sidepanel" onClick={(e) => e.stopPropagation()}>
                    <div className="desktop-extras-header">
                      <div>
                        <p className="extras-title">{t('exploreMore')}</p>
                        <p className="extras-subtitle">{t('subExploreSubtitle')}</p>
                      </div>
                      <button className="extras-close-btn" onClick={() => setShowExtrasMenu(false)} aria-label="Close menu">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>

                    <div className="desktop-extras-body">
                      {extraMenuItems.map((item) => (
                        <button key={item.label} className="desktop-extras-card" onClick={item.action}>
                          <div className="desktop-extras-card-icon"><i className={item.icon}></i></div>
                          <div>
                            <p>{item.label}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </aside>
                </>
              )}
            </div>

            {/* Persistent Header Auth Area */}
            <div className="desktop-auth-area">
              {user ? (
                <div className="desktop-user-menu" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigateToTab('dashboard')}
                    title={`Logged in as ${user.username} - ${t('dashboard')}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '25px',
                      border: '1.5px solid var(--accent-gold)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>{user.username}</span>
                  </button>

                  {user.is_staff && (
                    <button
                      className="nav-action-btn"
                      title="Upload"
                      onClick={() => navigateToTab('upload')}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <i className="fas fa-cloud-upload-alt"></i>
                    </button>
                  )}

                  <button
                    className="nav-action-btn logout"
                    title={t('logout')}
                    onClick={handleLogout}
                    style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              ) : (
                <div className="desktop-login-signup" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    className="auth-btn login-btn"
                    onClick={() => openAuthModal('login')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.42rem 0.9rem',
                      borderRadius: '20px',
                      border: '1.5px solid var(--accent-gold)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <i className="fas fa-sign-in-alt" style={{ color: 'var(--accent-gold)' }}></i>
                    <span className="auth-btn-text">{t('login')}</span>
                  </button>
                  <button
                    className="auth-btn signup-btn"
                    onClick={() => openAuthModal('signup')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.42rem 1rem',
                      borderRadius: '20px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#022c22',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 3px 12px rgba(245, 158, 11, 0.4)'
                    }}
                  >
                    <i className="fas fa-user-plus"></i>
                    <span className="auth-btn-text">{t('signup')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Mobile Auth Header Buttons (Always Visible on Mobile Header for iPhone, Samsung, Infinix, etc.) */}
            <div className="mobile-header-auth-bar" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {user ? (
                <button
                  className="mobile-header-user-btn"
                  onClick={() => navigateToTab('dashboard')}
                  title={`Logged in as ${user.username}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '16px',
                    border: '1px solid var(--accent-gold)',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-user-circle" style={{ color: 'var(--accent-gold)' }}></i>
                  <span>{user.username}</span>
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <button
                    className="mobile-header-login-btn"
                    onClick={() => openAuthModal('login')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '16px',
                      border: '1px solid var(--accent-gold)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-sign-in-alt" style={{ color: 'var(--accent-gold)' }}></i>
                    <span>{t('login')}</span>
                  </button>
                  <button
                    className="mobile-header-signup-btn"
                    onClick={() => openAuthModal('signup')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#022c22',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <i className="fas fa-user-plus"></i>
                    <span>{t('signup')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger Toggle */}
            <button
              className={`mobile-toggle-btn ${mobileActive ? 'is-open' : ''}`}
              onClick={() => setMobileActive(!mobileActive)}
              aria-label="Toggle navigation"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* ===== FULL-SCREEN MOBILE MENU OVERLAY ===== */}
        <div className={`mobile-menu-overlay ${mobileActive ? 'mobile-menu-open' : ''}`}>
          <button
            className="mobile-menu-close"
            onClick={() => setMobileActive(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="mobile-menu-brand" onClick={() => { navigateToTab('home'); setMobileActive(false); }}>
            <span>Quran <span style={{ color: 'var(--accent-gold)' }}>Al Kareem</span></span>
          </div>

          {/* Top Auth Section inside Mobile Drawer */}
          <div className="mobile-auth-area">
            {user ? (
              <div className="mobile-user-card">
                <div className="mobile-user-info">
                  <i className="fas fa-user-circle"></i>
                  <span>Logged in as <strong>{user.username}</strong></span>
                </div>
                <button className="mobile-auth-btn mobile-logout-btn" onClick={() => { handleLogout(); setMobileActive(false); }}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            ) : (
              <div className="mobile-auth-grid">
                <button className="mobile-auth-btn mobile-login-btn" onClick={() => { openAuthModal('login'); setMobileActive(false); }}>
                  <i className="fas fa-sign-in-alt"></i> Login
                </button>
                <button className="mobile-auth-btn mobile-signup-btn" onClick={() => { openAuthModal('signup'); setMobileActive(false); }}>
                  <i className="fas fa-user-plus"></i> Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Global Language & Theme Selectors inside Mobile Drawer */}
          <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ padding: '0.65rem 1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fas fa-globe"></i> {t('language')}:
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: '#022c22',
                  color: 'var(--accent-gold)',
                  border: '1px solid var(--accent-gold)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: '14px'
                }}
              >
                <option value="english">🇬🇧 English</option>
                <option value="urdu">🇵🇰 اردو</option>
                <option value="brahui">📜 براہوئی</option>
                <option value="arabic">🇸🇦 العربية</option>
              </select>
            </div>

            <div style={{ padding: '0.65rem 1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fas fa-palette"></i> {t('theme')}:
              </span>
              <select
                value={globalTheme}
                onChange={(e) => setGlobalTheme(e.target.value)}
                style={{
                  background: '#022c22',
                  color: 'var(--accent-gold)',
                  border: '1px solid var(--accent-gold)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: '14px'
                }}
              >
                <option value="light">☀️ Light</option>
                <option value="sepia">📜 Sepia</option>
                <option value="black">🌙 Black</option>
                <option value="auto">🌓 Auto</option>
              </select>
            </div>
          </div>

          {/* Main Navigation Items Grid */}
          <div className="mobile-section-title">{t('home')} & {t('readQuran')}</div>
          <nav className="mobile-nav-grid main-nav-grid">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`mobile-nav-item ${activeTab === item.id ? 'mobile-nav-active' : ''}`}
                onClick={() => { navigateToTab(item.id); setMobileActive(false); }}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Explore Features Grid */}
          <div className="mobile-section-title">{t('exploreMore')}</div>
          <nav className="mobile-nav-grid extra-nav-grid">
            {extraMenuItems.map((item) => (
              <button
                key={item.label}
                className="mobile-nav-item mobile-nav-extra"
                onClick={() => { item.action(); setMobileActive(false); }}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </button>
            ))}

            {user && (
              <button
                className={`mobile-nav-item ${activeTab === 'bookmarks' ? 'mobile-nav-active' : ''}`}
                onClick={() => { navigateToTab('bookmarks'); setMobileActive(false); }}
              >
                <i className="fas fa-star"></i>
                <span>{t('dashboard')}</span>
              </button>
            )}

            {user && user.is_staff && (
              <button
                className="mobile-nav-item mobile-nav-upload"
                onClick={() => { navigateToTab('upload'); setMobileActive(false); }}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                <span>Upload</span>
              </button>
            )}
          </nav>

          {/* Arabic calligraphy decoration */}
          <p className="mobile-menu-calligraphy">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        </div>
      </header>
    </>
  );
}

