import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import ReportModal from './components/ReportModal';
import AuthModal from './components/AuthModal';
import AdminFloatingBar from './components/AdminFloatingBar';


import ErrorBoundary from './components/ErrorBoundary';

import HomeView from './views/HomeView';
import ReadView from './views/ReadView';
import QuranView from './views/QuranView';
import QarisView from './views/QarisView';
import BooksView from './views/BooksView';
import TafseerView from './views/TafseerView';
import HadithView from './views/HadithView';
import QiblaView from './views/QiblaView';
import BookmarksView from './views/BookmarksView';
import UploadView from './views/UploadView';
import ContactView from './views/ContactView';
import AboutView from './views/AboutView';
import FazailView from './views/FazailView';
import NamesOfAllahView from './views/NamesOfAllahView';
import TasbeehView from './views/TasbeehView';
import DuasView from './views/DuasView';
import KhatamTrackerView from './views/KhatamTrackerView';

import UserDashboardView from './views/UserDashboardView';

import { getApiUrl } from './utils/apiCache';

import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

function MainAppContent() {
  const tabPathMap = {
    home: '/',
    read: '/read',
    quran: '/quran',
    qaris: '/qaris',
    books: '/books',
    tafseer: '/tafseer',
    hadith: '/hadith',
    qibla: '/qibla',
    fazail: '/fazail',
    namesOfAllah: '/names-of-allah',
    tasbeeh: '/tasbeeh',
    duas: '/duas',
    khatam: '/khatam-tracker',
    contact: '/contact',
    about: '/about',
    bookmarks: '/bookmarks',
    dashboard: '/dashboard',
    upload: '/upload',
  };

  const getTabFromPath = (path) => {
    const clean = path.replace(/\/+$|^\//g, '') || 'home';
    return Object.keys(tabPathMap).find((tab) => tabPathMap[tab] === `/${clean}`) || 'home';
  };

  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  
  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Modal States
  const [reportData, setReportData] = useState(null);
  const [authModalMode, setAuthModalMode] = useState(null);

  // Keep UI in sync with browser URL and history
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath(window.location.pathname));
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO Page Title update
  useEffect(() => {
    const seoTitles = {
      home: 'Maktaba tul Muslim (مكتبة المسلم) - Read Quran Online (English, Urdu, Brahui / Brohi) | MP3 & Taqreer Library',
      read: 'Read Holy Quran Online - 114 Surahs with English, Urdu & Brahui (Brohi) Tarjuma | Maktaba tul Muslim',
      quran: 'Quran & Taqreer MP3 Audio Portal - Qaris Tilawat & Scholar Lectures | Maktaba tul Muslim',
      qaris: '20 Famous Qaris & Reciters - Quran Audio MP3 Downloads | Maktaba tul Muslim',
      tafseer: 'Tafseer Quran & Verse Explanations - Maktaba tul Muslim',
      hadith: 'Hadith Collection - Sahih al-Bukhari, Sahih Muslim & Sunan | Maktaba tul Muslim',
      fazail: 'Fazail & Virtues of Quran & Good Deeds - Maktaba tul Muslim',
      books: 'Maktaba tul Muslim - Free Islamic PDF Books & Library (Brohi / Urdu / English)',
      namesOfAllah: '99 Names of Allah (Asma ul Husna) - Maktaba tul Muslim',
      tasbeeh: 'Digital Tasbeeh Counter & Daily Dhikr - Maktaba tul Muslim',
      duas: 'Masnoon Duas & Supplications - Maktaba tul Muslim',
      khatam: 'Khatam Quran Progress Tracker - Maktaba tul Muslim',
      contact: 'Contact Us & Feedback - Maktaba tul Muslim (مكتبة المسلم)',
      about: 'About Us & Portal Profile - Maktaba tul Muslim',
      bookmarks: 'My Saved Bookmarks - Maktaba tul Muslim',
      upload: 'Admin Upload Content Studio - Maktaba tul Muslim'
    };
    document.title = seoTitles[activeTab] || 'Maktaba tul Muslim (مكتبة المسلم) - Digital Islamic Library & Quran Portal';
  }, [activeTab]);



  // Check auth status on mount
  useEffect(() => {
    fetch(getApiUrl('/api/auth/status/'), { cache: 'no-store', headers: { 'Pragma': 'no-cache' } })
      .then(res => res.json())
      .then(data => {
        if (data && data.is_authenticated) {
          const userObj = { username: data.username, email: data.email, is_staff: data.is_staff };
          setUser(userObj);
          localStorage.setItem('quran_portal_user', JSON.stringify(userObj));
        } else {
          const savedUser = localStorage.getItem('quran_portal_user');
          if (savedUser) {
            try { setUser(JSON.parse(savedUser)); } catch (e) { setUser(null); }
          } else {
            setUser(null);
          }
        }
      })
      .catch(() => {
        const savedUser = localStorage.getItem('quran_portal_user');
        if (savedUser) {
          try { setUser(JSON.parse(savedUser)); } catch (e) { setUser(null); }
        } else {
          setUser(null);
        }
      });
  }, []);

  const playTrack = (url, title, reciter, onEnded = null) => {
    setCurrentTrack({ url, title, reciter, onEnded });
    setIsPlaying(true);
  };

  const navigateToTab = (tab) => {
    setActiveTab(tab);
    const targetPath = tabPathMap[tab] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  const openReportModal = (contentType, contentId) => {
    setReportData({ contentType, contentId });
  };

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        navigateToTab={navigateToTab}
        user={user}
        setUser={setUser}
        openAuthModal={openAuthModal}
        openReportModal={openReportModal}
      />

      <main className="main-content">
        {activeTab === 'home' && (
          <HomeView
            navigateToTab={navigateToTab}
            playTrack={playTrack}
            user={user}
            openAuthModal={openAuthModal}
          />
        )}

        {activeTab === 'read' && (
          <ReadView
            user={user}
            playTrack={playTrack}
            openReportModal={openReportModal}
          />
        )}

        {activeTab === 'quran' && (
          <QuranView playTrack={playTrack} user={user} navigateToTab={navigateToTab} />
        )}

        {activeTab === 'qaris' && (
          <QarisView playTrack={playTrack} />
        )}

        {activeTab === 'books' && (
          <BooksView openReportModal={openReportModal} user={user} />
        )}

        {activeTab === 'tafseer' && (
          <TafseerView openReportModal={openReportModal} />
        )}

        {activeTab === 'hadith' && (
          <HadithView openReportModal={openReportModal} user={user} />
        )}

        {activeTab === 'qibla' && (
          <QiblaView />
        )}

        {activeTab === 'fazail' && (
          <FazailView />
        )}

        {activeTab === 'namesOfAllah' && (
          <NamesOfAllahView />
        )}

        {activeTab === 'tasbeeh' && (
          <TasbeehView />
        )}

        {activeTab === 'duas' && (
          <DuasView playTrack={playTrack} user={user} />
        )}

        {activeTab === 'khatam' && (
          <KhatamTrackerView navigateToTab={navigateToTab} user={user} openAuthModal={openAuthModal} />
        )}

        {activeTab === 'contact' && (
          <ContactView />
        )}

        {activeTab === 'about' && (
          <AboutView navigateToTab={navigateToTab} />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksView user={user} navigateToTab={navigateToTab} />
        )}

        {activeTab === 'dashboard' && (
          <UserDashboardView user={user} openAuthModal={openAuthModal} navigateToTab={navigateToTab} playTrack={playTrack} />
        )}

        {activeTab === 'upload' && (
          <UploadView user={user} />
        )}
      </main>

      <Footer navigateToTab={navigateToTab} user={user} openAuthModal={openAuthModal} />

      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        setCurrentTrack={setCurrentTrack}
      />

      {reportData && (
        <ReportModal
          reportData={reportData}
          onClose={() => setReportData(null)}
        />
      )}

      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          setUser={setUser}
        />
      )}

      {/* Floating Admin Studio Bar (Only visible when logged in as admin) */}
      <AdminFloatingBar user={user} navigateToTab={navigateToTab} />
    </div>
  );
}
