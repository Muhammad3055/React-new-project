import React, { useState, useEffect } from 'react';

export default function Navbar({ activeTab, navigateToTab, user, setUser, openAuthModal }) {
  const [mobileActive, setMobileActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExtrasMenu, setShowExtrasMenu] = useState(false);
  const [toast, setToast] = useState(null);

  const extraMenuItems = [
    { label: 'Fazail (Virtues)', icon: 'fas fa-book', action: () => { navigateToTab('fazail'); setShowExtrasMenu(false); } },
    { label: '99 Names', icon: 'fas fa-star', action: () => { navigateToTab('namesOfAllah'); setShowExtrasMenu(false); } },
    { label: 'Tasbeeh Counter', icon: 'fas fa-hand-holding-heart', action: () => { navigateToTab('tasbeeh'); setShowExtrasMenu(false); } },
    { label: "Du'as Library", icon: 'fas fa-hands', action: () => { navigateToTab('duas'); setShowExtrasMenu(false); } },
    { label: 'Hadith', icon: 'fas fa-scroll', action: () => { navigateToTab('hadith'); setShowExtrasMenu(false); } },
    { label: 'Tafseer', icon: 'fas fa-bookmark', action: () => { navigateToTab('tafseer'); setShowExtrasMenu(false); } },
    { label: 'Books Library', icon: 'fas fa-file-pdf', action: () => { navigateToTab('books'); setShowExtrasMenu(false); } },
    { label: 'About Us', icon: 'fas fa-info-circle', action: () => { navigateToTab('about'); setShowExtrasMenu(false); } },
    { label: 'Contact', icon: 'fas fa-envelope', action: () => { navigateToTab('contact'); setShowExtrasMenu(false); } },
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      fetch(`/api/search/?q=${encodeURIComponent(searchQuery)}`)
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
    fetch('/api/auth/logout/', { method: 'POST', cache: 'no-store' })
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        window.location.reload();
      });
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'read', label: 'Read Quran', icon: 'fas fa-book-open' },
    { id: 'quran', label: 'Quran MP3', icon: 'fas fa-headphones' },
    { id: 'fazail', label: 'Fazail', icon: 'fas fa-book' },
    { id: 'about', label: 'About Us', icon: 'fas fa-info-circle' },
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
              <span className="brand-text">Quran <span className="gold-text">Al Kareem</span></span>
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
                placeholder="Search..."
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

            {/* Desktop Extras Menu Toggle */}
            <div className="desktop-extras-menu">
              <button
                className={`extras-menu-toggle ${showExtrasMenu ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setShowExtrasMenu(!showExtrasMenu); }}
                aria-label="Open extras menu"
              >
                <i className="fas fa-th-large"></i>
                <span className="more-text">More</span>
              </button>
              {showExtrasMenu && (
                <>
                  <div className="desktop-extras-overlay" onClick={() => setShowExtrasMenu(false)} />
                  <aside className="desktop-extras-sidepanel" onClick={(e) => e.stopPropagation()}>
                    <div className="desktop-extras-header">
                      <div>
                        <p className="extras-title">Explore More</p>
                        <p className="extras-subtitle">Hadith, Tafseer, 99 Names & more</p>
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
                <div className="desktop-user-menu">
                  <span className="user-greeting" onClick={() => navigateToTab('dashboard')} style={{ cursor: 'pointer' }}>
                    <i className="fas fa-user-circle"></i> Hi, {user.username}
                  </span>
                  <button className="nav-action-btn" title="My Progress & Dashboard" onClick={() => navigateToTab('dashboard')} style={{ background: 'var(--accent-gold)', color: 'var(--primary-dark)' }}>
                    <i className="fas fa-tasks"></i> <span className="logout-text" style={{ color: 'var(--primary-dark)', fontWeight: 800 }}>Dashboard</span>
                  </button>
                  {user.is_staff && (
                    <button className="nav-action-btn" title="Upload" onClick={() => navigateToTab('upload')}>
                      <i className="fas fa-cloud-upload-alt"></i>
                    </button>
                  )}
                  <button className="nav-action-btn" title="Bookmarks" onClick={() => navigateToTab('bookmarks')}>
                    <i className="fas fa-star"></i>
                  </button>
                  <button className="nav-action-btn logout" title="Logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> <span className="logout-text">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="desktop-login-signup">
                  <button className="auth-btn login-btn" onClick={() => openAuthModal('login')}>
                    <i className="fas fa-sign-in-alt"></i> <span className="auth-btn-text">Login</span>
                  </button>
                  <button className="auth-btn signup-btn" onClick={() => openAuthModal('signup')}>
                    <i className="fas fa-user-plus"></i> <span className="auth-btn-text">Sign Up</span>
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

          {/* Main Navigation Items Grid */}
          <div className="mobile-section-title">Main Navigation</div>
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
          <div className="mobile-section-title">Explore Features</div>
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
                <span>Bookmarks</span>
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

