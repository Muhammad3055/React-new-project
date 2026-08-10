import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import ReportModal from './components/ReportModal';
import AuthModal from './components/AuthModal';
import AdminFloatingBar from './components/AdminFloatingBar';
// Lazy load interactive feature modals to keep initial page load lightweight
const AIChatbotModal = lazy(() => import('./components/AIChatbotModal'));
const IslamicCalendarModal = lazy(() => import('./components/IslamicCalendarModal'));
const MemorizationTrackerModal = lazy(() => import('./components/MemorizationTrackerModal'));
const AITajweedModal = lazy(() => import('./components/AITajweedModal'));

import ErrorBoundary from './components/ErrorBoundary';
import HomeView from './views/HomeView'; // Statically imported for instant initial paint

// Lazy load remaining sub-views for performance & bundle splitting
const ReadView = lazy(() => import('./views/ReadView'));
const QuranView = lazy(() => import('./views/QuranView'));
const QarisView = lazy(() => import('./views/QarisView'));
const BooksView = lazy(() => import('./views/BooksView'));
const VideosView = lazy(() => import('./views/VideosView'));
const TafseerView = lazy(() => import('./views/TafseerView'));
const HadithView = lazy(() => import('./views/HadithView'));
const QiblaView = lazy(() => import('./views/QiblaView'));
const BookmarksView = lazy(() => import('./views/BookmarksView'));
const UploadView = lazy(() => import('./views/UploadView'));
const ContactView = lazy(() => import('./views/ContactView'));
const AboutView = lazy(() => import('./views/AboutView'));
const FazailView = lazy(() => import('./views/FazailView'));
const NamesOfAllahView = lazy(() => import('./views/NamesOfAllahView'));
const TasbeehView = lazy(() => import('./views/TasbeehView'));
const DuasView = lazy(() => import('./views/DuasView'));
const KhatamTrackerView = lazy(() => import('./views/KhatamTrackerView'));
const UserDashboardView = lazy(() => import('./views/UserDashboardView'));
const PrayersView = lazy(() => import('./views/PrayersView'));

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
    videos: '/videos',
    tafseer: '/tafseer',

    hadith: '/hadith',
    prayers: '/prayers',
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
          const savedUserStr = localStorage.getItem('quran_portal_user');
          let savedUser = {};
          try { savedUser = savedUserStr ? JSON.parse(savedUserStr) : {}; } catch (e) {}
          const userObj = { ...savedUser, username: data.username, email: data.email, is_staff: data.is_staff };
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

      <main key={activeTab} className="main-content fade-in" style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', flex: 1 }}>
            <div className="loading-spinner"></div>
          </div>
        }>
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
            <QuranView 
              playTrack={playTrack} 
              user={user} 
              navigateToTab={navigateToTab} 
              onOpenCalendar={() => setIsCalendarOpen(true)}
              onOpenTajweed={() => setIsTajweedOpen(true)}
            />
          )}


          {activeTab === 'qaris' && (
            <QarisView playTrack={playTrack} />
          )}

          {activeTab === 'books' && (
            <BooksView openReportModal={openReportModal} user={user} />
          )}

          {activeTab === 'videos' && (
            <VideosView />
          )}


          {activeTab === 'tafseer' && (
            <TafseerView openReportModal={openReportModal} />
          )}

          {activeTab === 'hadith' && (
            <HadithView openReportModal={openReportModal} user={user} />
          )}

          {activeTab === 'prayers' && (
            <PrayersView navigateToTab={navigateToTab} />
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
        </Suspense>
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

      {/* Interactive Feature Modals (Loaded lazily on demand) */}
      <Suspense fallback={null}>
        {isAIChatOpen && <AIChatbotModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />}
        {isCalendarOpen && <IslamicCalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />}
        {isHifzOpen && <MemorizationTrackerModal isOpen={isHifzOpen} onClose={() => setIsHifzOpen(false)} />}
        {isTajweedOpen && <AITajweedModal isOpen={isTajweedOpen} onClose={() => setIsTajweedOpen(false)} />}
      </Suspense>

      {/* Prominent Sticky Floating AI Islamic Assistant Chatbot Launcher Button */}
      {!isAIChatOpen && (
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
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              color: '#ffffff',
              border: '2px solid rgba(245, 158, 11, 0.7)',
              boxShadow: '0 10px 30px rgba(5, 150, 105, 0.6), 0 0 18px rgba(245, 158, 11, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            title="Open AI Islamic Assistant"
          >
            <i className="fas fa-robot" style={{ fontSize: '1.5rem', color: '#f59e0b' }}></i>
            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }}></span>
          </button>
        </div>
      )}

      {/* Floating Admin Studio Bar (Only visible when logged in as admin) */}
      <AdminFloatingBar user={user} navigateToTab={navigateToTab} />
    </div>


  );
}
