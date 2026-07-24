import React from 'react';

export default function Footer({ navigateToTab, user, openAuthModal }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Col 1: Brand & Mission */}
          <div className="footer-col brand-col">
            <div className="brand-logo" style={{ marginBottom: '0.75rem', cursor: 'pointer' }} onClick={() => navigateToTab('home')}>
              <i className="fas fa-quran"></i>
              <span>Quran <span className="gold-text">Portal</span></span>
            </div>
            <p className="footer-desc">Your modern React + Django portal for reading, listening to authentic recitations, studying Tafseer, and exploring Hadith collections.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" title="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" title="YouTube"><i className="fab fa-youtube"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" title="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" title="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* Col 2: Quran Studies */}
          <div className="footer-col">
            <h4 className="footer-title">Quran Studies</h4>
            <ul className="footer-links">
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('read')}><i className="fas fa-book-open"></i> Read Quran (114 Surahs)</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('quran')}><i className="fas fa-headphones"></i> Quran Audio MP3</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('qaris')}><i className="fas fa-microphone"></i> 20+ Famous Qaris</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('tafseer')}><i className="fas fa-bookmark"></i> Tafseer Commentary</a></li>
            </ul>
          </div>

          {/* Col 3: Media & Books */}
          <div className="footer-col">
            <h4 className="footer-title">Media & Books</h4>
            <ul className="footer-links">
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('videos')}><i className="fas fa-play-circle"></i> Video Lectures</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('books')}><i className="fas fa-book"></i> PDF Books Library</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('hadith')}><i className="fas fa-scroll"></i> Hadith Collections</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('home')}><i className="fas fa-star"></i> Featured Spotlight</a></li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation & Account */}
          <div className="footer-col">
            <h4 className="footer-title">Account & Portal</h4>
            <ul className="footer-links">
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('home')}><i className="fas fa-home"></i> Home Portal</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('about')}><i className="fas fa-info-circle"></i> About Us</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('contact')}><i className="fas fa-envelope"></i> Contact Us</a></li>
              {user ? (
                <>
                  <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('bookmarks')}><i className="fas fa-star"></i> My Bookmarks</a></li>
                  {user.is_staff && (
                    <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('upload')}><i className="fas fa-cloud-upload-alt"></i> Upload Content</a></li>
                  )}
                </>
              ) : (
                <>
                  <li><a style={{ cursor: 'pointer' }} onClick={() => openAuthModal && openAuthModal('login')}><i className="fas fa-sign-in-alt"></i> Sign In to Account</a></li>
                  <li><a style={{ cursor: 'pointer' }} onClick={() => openAuthModal && openAuthModal('signup')}><i className="fas fa-user-plus"></i> Create Free Account</a></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="arabic-font calligraphy-footer">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          <p className="copyright-text">&copy; {new Date().getFullYear()} Quran Portal. Built with React & Django REST API.</p>
        </div>
      </div>
    </footer>
  );
}
