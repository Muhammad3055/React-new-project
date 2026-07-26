import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import ReportModal from './components/ReportModal';
import VideoModal from './components/VideoModal';
import AuthModal from './components/AuthModal';

import HomeView from './views/HomeView';
import ReadView from './views/ReadView';
import QuranView from './views/QuranView';
import QarisView from './views/QarisView';
import VideosView from './views/VideosView';
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

import UserDashboardView from './views/UserDashboardView';

export default function App() {
  const tabPathMap = {
    home: '/',
    read: '/read',
    quran: '/quran',
    qaris: '/qaris',
    videos: '/videos',
    books: '/books',
    tafseer: '/tafseer',
    hadith: '/hadith',
    fazail: '/fazail',
    namesOfAllah: '/names-of-allah',
    tasbeeh: '/tasbeeh',
    duas: '/duas',
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
  const [videoModalData, setVideoModalData] = useState(null);
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

  // Dynamic SEO Page Title update (English, Urdu & Brahui SEO)
  useEffect(() => {
    const seoTitles = {
      home: 'Quran Portal - Read Quran Online in English, Urdu (اردو) & Brahui (براہوئی) | MP3 Recitations',
      read: 'Read Holy Quran Online - 114 Surahs with English, Urdu & Brahui Translations',
      quran: 'Quran MP3 Recitations - Listen to 20 World-Renowned Qaris in HD Audio',
      qaris: '20 Famous Qaris & Reciters - Quran Audio MP3 Downloads',
      tafseer: 'Tafseer Quran - Detailed Verse Explanations & Commentary (تفسیر ابن کثیر)',
      hadith: 'Hadith Collection - Sahih al-Bukhari, Sahih Muslim & Sunan (احادیث مبارکہ)',
      fazail: 'Fazail & Virtues of Quran & Good Deeds (فضائل الاعمال - اردو و انگریزی)',
      books: 'Islamic PDF Books & Library - Free Digital Islamic Literature & E-Books',
      namesOfAllah: '99 Names of Allah (Asma ul Husna - أسماء الله الحسنى)',
      tasbeeh: 'Digital Tasbeeh Counter & Daily Dhikr (ڈیجیٹل تسبیح)',
      duas: 'Masnoon Duas & Supplications (مسنون دعائیں)',
      contact: 'Contact Us & Feedback - Quran Portal',
      about: 'About Us & Developer Profile - Quran Al Kareem',
      bookmarks: 'My Bookmarks - Quran Portal',
      upload: 'Admin Upload Content - Quran Portal'
    };
    document.title = seoTitles[activeTab] || 'Quran Portal - Read Quran Online (English, Urdu, Brahui)';
  }, [activeTab]);

  // Check auth status on mount (with localStorage fallback for Netlify)
  useEffect(() => {
    fetch('/api/auth/status/', { cache: 'no-store', headers: { 'Pragma': 'no-cache' } })
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

  const openVideoModal = (title, url) => {
    setVideoModalData({ title, url });
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
            openVideoModal={openVideoModal}
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
          <QuranView playTrack={playTrack} />
        )}

        {activeTab === 'qaris' && (
          <QarisView playTrack={playTrack} />
        )}

        {activeTab === 'videos' && (
          <VideosView
            openVideoModal={openVideoModal}
            openReportModal={openReportModal}
          />
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
          <DuasView />
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

      {videoModalData && (
        <VideoModal
          videoData={videoModalData}
          onClose={() => setVideoModalData(null)}
        />
      )}

      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          setUser={setUser}
        />
      )}
    </div>
  );
}
