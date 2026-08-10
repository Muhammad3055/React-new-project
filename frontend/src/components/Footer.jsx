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
            <div className="brand-logo" style={{ marginBottom: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }} onClick={() => navigateToTab('home')}>
              <img src="/favicon.svg" alt="Maktaba tul Muslim Logo" style={{ width: '36px', height: '36px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)', flexShrink: 0 }} />
              <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.25rem' }}>{t('brandName')}</span>

            </div>


            <div className="social-links">
              <a href="https://facebook.com/maktabatulmuslim" target="_blank" rel="noopener noreferrer" className="social-btn" title="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://youtube.com/maktabatulmuslim" target="_blank" rel="noopener noreferrer" className="social-btn" title="YouTube"><i className="fab fa-youtube"></i></a>
              <a href="https://instagram.com/maktabatulmuslim" target="_blank" rel="noopener noreferrer" className="social-btn" title="Instagram"><i className="fab fa-instagram"></i></a>
            </div>

          </div>

          {/* Col 2: Quran Studies */}
          <div className="footer-col">
            <h4 className="footer-title">{t('readQuran')}</h4>
            <ul className="footer-links">
              <li><a href="/read" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('read'); }}><i className="fas fa-book-open"></i> {t('readQuran')}</a></li>
              <li><a href="/quran" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('quran'); }}><i className="fas fa-headphones"></i> {t('mp3Audio')}</a></li>
              <li><a href="/qaris" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('qaris'); }}><i className="fas fa-microphone"></i> {t('qaris')}</a></li>
              <li><a href="/tafseer" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('tafseer'); }}><i className="fas fa-bookmark"></i> {t('tafseer')}</a></li>
            </ul>
          </div>

          {/* Col 3: Media & Books */}
          <div className="footer-col">
            <h4 className="footer-title">{t('books')}</h4>
            <ul className="footer-links">
              <li><a href="/quran" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('quran'); }}><i className="fas fa-bullhorn"></i> {t('mp3Audio')}</a></li>
              <li><a href="/books" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('books'); }}><i className="fas fa-book"></i> {t('books')}</a></li>
              <li><a href="/hadith" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('hadith'); }}><i className="fas fa-scroll"></i> {t('hadith')}</a></li>
              <li><a href="/fazail" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('fazail'); }}><i className="fas fa-star"></i> {t('fazail')}</a></li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation & Account */}
          <div className="footer-col">
            <h4 className="footer-title">{t('home')}</h4>
            <ul className="footer-links">
              <li><a href="/" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('home'); }}><i className="fas fa-home"></i> {t('home')}</a></li>
              <li><a href="/about" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('about'); }}><i className="fas fa-info-circle"></i> {t('aboutUs')}</a></li>
              <li><a href="/contact" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('contact'); }}><i className="fas fa-envelope"></i> {t('contact')}</a></li>
              {user ? (
                <>
                  <li><a href="/dashboard" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateToTab('bookmarks'); }}><i className="fas fa-star"></i> {t('dashboard')}</a></li>
                </>
              ) : (
                <>
                  <li><a href="/login" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); openAuthModal && openAuthModal('login'); }}><i className="fas fa-sign-in-alt"></i> {t('login')}</a></li>
                  <li><a href="/signup" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); openAuthModal && openAuthModal('signup'); }}><i className="fas fa-user-plus"></i> {t('signup')}</a></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="arabic-font calligraphy-footer">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          <p className="copyright-text">&copy; {new Date().getFullYear()} {t('brandName')} (مكتبة المسلم). {t('rightsReserved')}</p>
        </div>

      </div>
    </footer>

  );
}

