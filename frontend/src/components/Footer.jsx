import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ navigateToTab, user, openAuthModal }) {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Col 1: Brand & Mission */}
          <div className="footer-col brand-col">
            <div className="brand-logo" style={{ marginBottom: '0.75rem', cursor: 'pointer' }} onClick={() => navigateToTab('home')}>
              <i className="fas fa-quran"></i>
              <span>{t('brandName')}</span>
            </div>
            <p className="footer-desc">{t('footerTagline')}</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" title="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" title="YouTube"><i className="fab fa-youtube"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" title="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" title="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* Col 2: Quran Studies */}
          <div className="footer-col">
            <h4 className="footer-title">{t('readQuran')}</h4>
            <ul className="footer-links">
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('read')}><i className="fas fa-book-open"></i> {t('readQuran')}</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('quran')}><i className="fas fa-headphones"></i> {t('mp3Audio')}</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('qaris')}><i className="fas fa-microphone"></i> {t('qaris')}</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('tafseer')}><i className="fas fa-bookmark"></i> {t('tafseer')}</a></li>
            </ul>
          </div>

          {/* Col 3: Media & Books */}
          <div className="footer-col">
            <h4 className="footer-title">{t('books')}</h4>
            <ul className="footer-links">
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('quran')}><i className="fas fa-bullhorn"></i> {t('mp3Audio')}</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('books')}><i className="fas fa-book"></i> {t('books')}</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('hadith')}><i className="fas fa-scroll"></i> {t('hadith')}</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('fazail')}><i className="fas fa-star"></i> {t('fazail')}</a></li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation & Account */}
          <div className="footer-col">
            <h4 className="footer-title">{t('home')}</h4>
            <ul className="footer-links">
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('home')}><i className="fas fa-home"></i> {t('home')}</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('about')}><i className="fas fa-info-circle"></i> {t('aboutUs')}</a></li>
              <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('contact')}><i className="fas fa-envelope"></i> {t('contact')}</a></li>
              {user ? (
                <>
                  <li><a style={{ cursor: 'pointer' }} onClick={() => navigateToTab('bookmarks')}><i className="fas fa-star"></i> {t('dashboard')}</a></li>
                </>
              ) : (
                <>
                  <li><a style={{ cursor: 'pointer' }} onClick={() => openAuthModal && openAuthModal('login')}><i className="fas fa-sign-in-alt"></i> {t('login')}</a></li>
                  <li><a style={{ cursor: 'pointer' }} onClick={() => openAuthModal && openAuthModal('signup')}><i className="fas fa-user-plus"></i> {t('signup')}</a></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="arabic-font calligraphy-footer">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          <p className="copyright-text">&copy; {new Date().getFullYear()} {t('brandName')} (مكتبة المسلم). {t('rightsReserved')}</p>

          {/* Search Engine Optimization (SEO) Keywords Block */}
          <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5', textAlign: 'center' }}>
            <span><strong>Maktaba tul Muslim (مكتبة المسلم)</strong> &bull; Muslim Maktaba &bull; Makatab Muslim &bull; Quran &bull; Qari Sudais MP3 &bull; Mishary Alafasy &bull; Saud Al-Shuraim &bull; Maher Al-Muaiqly &bull; Abdul Basit &bull; Brohi / Brahui Tarjuma Quran &bull; Urdu Quran &bull; Islam Library &bull; Islamic PDF Books</span>
          </div>


        </div>
      </div>
    </footer>

  );
}

