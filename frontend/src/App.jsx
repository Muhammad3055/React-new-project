import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import ReportModal from './components/ReportModal';
import AuthModal from './components/AuthModal';
import AdminFloatingBar from './components/AdminFloatingBar';
import AIChatbotModal from './components/AIChatbotModal';
import IslamicCalendarModal from './components/IslamicCalendarModal';
import MemorizationTrackerModal from './components/MemorizationTrackerModal';
import AITajweedModal from './components/AITajweedModal';

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
import { Bot, Calendar as CalendarIcon, Award, Sparkles } from 'lucide-react';

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
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isHifzOpen, setIsHifzOpen] = useState(false);
  const [isTajweedOpen, setIsTajweedOpen] = useState(false);

  // Register PWA Service Worker & sync browser URL
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

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
      qaris: 'Famous Quran Qaris & Reciters - Play & Download Recitations | Maktaba tul Muslim',
      books: 'Islamic Digital Library - Free PDF Books & Documents | Maktaba tul Muslim',
      tafseer: 'Authentic Quran Tafseer Commentary & Explanation | Maktaba tul Muslim',
      hadith: 'Sahih Hadith Collections & Translations | Maktaba tul Muslim',
      qibla: 'Live Qibla Finder & Accurate Prayer Times | Maktaba tul Muslim',
      fazail: 'Virtues of Quran & Dhikr (فضائل قرآن) | Maktaba tul Muslim',
      namesOfAllah: '99 Beautiful Names of Allah (Asma ul Husna) | Maktaba tul Muslim',
      tasbeeh: 'Digital Tasbeeh Counter & Daily Dhikr | Maktaba tul Muslim',
      duas: 'Masnoon Duas & Daily Supplications | Maktaba tul Muslim',
      khatam: 'Quran Khatam Progress Tracker & Goal Planner | Maktaba tul Muslim',
      contact: 'Contact Us & Send Feedback | Maktaba tul Muslim',
      about: 'About Maktaba tul Muslim - Free Authentic Islamic Resource Platform',
      bookmarks: 'My Saved Bookmarks & Highlights | Maktaba tul Muslim',
      dashboard: 'User Profile & Personalized Dashboard | Maktaba tul Muslim',
      upload: 'Admin Media Upload Studio | Maktaba tul Muslim',
    };
    document.title = seoTitles[activeTab] || 'Maktaba tul Muslim - Islamic Portal';
  }, [activeTab]);

  // Check Auth Status on Load
  useEffect(() => {
    fetch(getApiUrl('/api/auth/status/'), { cache: 'no-store', headers: { 'Pragma': 'no-cache' } })
      .then((res) => res.json())
      .then((data) => {
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

  const navigateToTab = (tabName) => {
    setActiveTab(tabName);
    const path = tabPathMap[tabName] || '/';
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playTrack = (url, title, reciter, onEnded = null) => {
    setCurrentTrack({ url, title, reciter, onEnded });
    setIsPlaying(true);
  };

  const openReportModal = (contentType, contentId) => {
    setReportData({ contentType, contentId });
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative">
      <Navbar
        activeTab={activeTab}
        navigateToTab={navigateToTab}
        user={user}
        setUser={setUser}
        openAuthModal={openAuthModal}
        openCalendar={() => setIsCalendarOpen(true)}
        openHifz={() => setIsHifzOpen(true)}
        openTajweed={() => setIsTajweedOpen(true)}
        openAIChat={() => setIsAIChatOpen(true)}
      />

      <main className="flex-1">
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

      {/* Interactive Feature Modals */}
      <AIChatbotModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      <IslamicCalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
      <MemorizationTrackerModal isOpen={isHifzOpen} onClose={() => setIsHifzOpen(false)} />
      <AITajweedModal isOpen={isTajweedOpen} onClose={() => setIsTajweedOpen(false)} />

      {/* Prominent Sticky Floating AI Islamic Assistant Chatbot Launcher Button */}
      <div 
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <button
          onClick={() => setIsAIChatOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '12px 22px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
            color: '#ffffff',
            border: '2px solid rgba(245, 158, 11, 0.7)',
            boxShadow: '0 10px 30px rgba(5, 150, 105, 0.6), 0 0 18px rgba(245, 158, 11, 0.4)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 800,
            transition: 'all 0.3s ease',
            letterSpacing: '0.3px'
          }}
          title="Open AI Islamic Assistant"
        >
          <i className="fas fa-robot" style={{ fontSize: '1.25rem', color: '#f59e0b' }}></i>
          <span style={{ fontFamily: 'system-ui, sans-serif' }}>Ask AI Assistant</span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }}></span>
        </button>
      </div>

      {/* Floating Admin Studio Bar (Only visible when logged in as admin) */}
      <AdminFloatingBar user={user} navigateToTab={navigateToTab} />
    </div>


  );
}
