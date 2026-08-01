import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import ReportModal from './components/ReportModal';
import AuthModal from './components/AuthModal';
import AdminFloatingBar from './components/AdminFloatingBar';


import HomeView from './views/HomeView';
import ReadView from './views/ReadView';
import QuranView from './views/QuranView';
import QarisView from './views/QarisView';
import BooksView from './views/BooksView';
import TafseerView from './views/TafseerView';
import HadithView from './views/HadithView';
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

export default function App() {
  const tabPathMap = {
    home: '/',
    read: '/read',
    quran: '/quran',
    qaris: '/qaris',
    books: '/books',
    tafseer: '/tafseer',
    hadith: '/hadith',
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
      home: 'Quran Portal - Read Quran Online in English, Urdu & Brahui | MP3 Recitations & Taqreers',
      read: 'Read Holy Quran Online - 114 Surahs with English, Urdu & Brahui Translations',
      quran: 'Quran & Taqreer MP3 Audio Portal - Listen to Qaris & Lectures in Arabic, Brahui & Urdu',
      qaris: '20 Famous Qaris & Reciters - Quran Audio MP3 Downloads',
      tafseer: 'Tafseer Quran - Detailed Verse Explanations & Commentary',
      hadith: 'Hadith Collection - Sahih al-Bukhari, Sahih Muslim & Sunan',
      fazail: 'Fazail & Virtues of Quran & Good Deeds',
      books: 'Islamic PDF Books & Library - Free Digital Islamic Literature & E-Books',
      namesOfAllah: '99 Names of Allah (Asma ul Husna)',
      tasbeeh: 'Digital Tasbeeh Counter & Daily Dhikr',
      duas: 'Masnoon Duas & Supplications',
      khatam: 'Khatam Quran 30-Day Progress Tracker & Schedule Planner',
      contact: 'Contact Us & Feedback - Quran Portal',
      about: 'About Us & Developer Profile - Quran Al Kareem',
      bookmarks: 'My Bookmarks - Quran Portal',
      upload: 'Admin Upload Content - Quran Portal'
    };
    document.title = seoTitles[activeTab] || 'Quran Portal - Read Quran & MP3 Taqreers';
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
          <BooksView openReportModal={openReportModal} />
        )}

        {activeTab === 'tafseer' && (
          <TafseerView openReportModal={openReportModal} />
        )}

        {activeTab === 'hadith' && (
          <HadithView openReportModal={openReportModal} />
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
