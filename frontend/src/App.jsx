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

  // Dynamic SEO Page Title & Meta Tags Handler for All Pages
  useEffect(() => {
    const pageSeoData = {
      home: {
        title: 'Maktaba tul Muslim (مكتبة المسلم) - Read Quran Online (English, Urdu, Brahui / Brohi) | MP3 & Taqreer Library',
        desc: 'Explore Holy Quran online with 114 Surahs, Prophet Muhammad (PBUH) teachings, Stories of Prophets (Adam, Nuh, Ibrahim, Musa, Isa, Muhammad SAW), multi-language Brahui / Urdu / English translations, 20 Qaris MP3 audio recitations, Tafseer Ibn Kathir, Sahih Hadith, Islamic PDF Books, 99 Names of Allah, and Masnoon Duas.',
        keywords: 'Islam, Muslim, Quran, Prophet, Muhammad, Prophet Muhammad, Prophet Adam, Prophet Nuh, Prophet Ibrahim, Prophet Musa, Prophet Isa, Islamic Books, Sahih Al Bukhari, Sahih Muslim, Tafseer Ibn Kathir, Brahui Quran, Brohi Tarjuma, Urdu Quran, English Quran, Maktaba tul Muslim'
      },
      read: {
        title: 'Read Holy Quran Online - 114 Surahs with English, Urdu & Brahui (Brohi) Tarjuma | Maktaba tul Muslim',
        desc: 'Read the complete Holy Quran online with word-by-word translations in English, Urdu, and Brahui (Brohi). Explore 114 Surahs, Arabic script, audio playback, bookmarks, and search capabilities.',
        keywords: 'Read Quran Online, Quran 114 Surahs, Surah Fatiha, Surah Yaseen, Surah Baqarah, Urdu Quran Tarjuma, Brahui Quran Translation, Brohi Quran Online, Arabic Quran Text'
      },
      quran: {
        title: 'Quran & Taqreer MP3 Audio Portal - Qaris Tilawat & Scholar Lectures | Maktaba tul Muslim',
        desc: 'Listen to and download high quality MP3 audio tilawat by 20 world renowned Qaris (Qari Sudais, Mishary Alafasy, Shuraim, Abdul Basit) and Islamic scholar taqreer lectures in Brahui, Urdu, and English.',
        keywords: 'Quran MP3 Audio, Quran Tilawat MP3, Qari Sudais MP3, Mishary Alafasy, Qari Shuraim, Qari Abdul Basit, Islamic Taqreer Audio, Brahui Taqreer MP3, Scholar Speeches'
      },
      qaris: {
        title: 'Famous Quran Qaris & Reciters - Play & Download Recitations | Maktaba tul Muslim',
        desc: 'Listen to world famous Quran Qaris and reciters including Qari Abdul Rahman Al-Sudais, Mishary Rashid Alafasy, Saud Al-Shuraim, Maher Al-Muaiqly, Abdul Basit, Saad Al-Ghamdi, and Yasser Al-Dosari.',
        keywords: 'Famous Qaris, Qari Sudais, Mishary Alafasy, Saud Shuraim, Maher Muaiqly, Abdul Basit, Saad Ghamdi, Minshawi, Hussary, Quran Reciters MP3'
      },
      books: {
        title: 'Islamic Digital Library - Free PDF Books & Documents | Maktaba tul Muslim',
        desc: 'Browse and download authentic Islamic PDF books, Hadith collections (Bukhari, Muslim, Tirmidhi, Abu Dawood), Tafseer commentary, Seerah of Prophet Muhammad (SAW), and Brahui/Urdu Islamic literature.',
        keywords: 'Islamic Books PDF, Sahih Bukhari PDF, Sahih Muslim PDF, Tafseer Ibn Kathir PDF, Free Islamic PDF Books, Urdu Islamic Books, Brahui Islamic Literature'
      },
      tafseer: {
        title: 'Authentic Quran Tafseer Commentary & Explanation | Maktaba tul Muslim',
        desc: 'Study authentic Quran Tafseer commentary including Tafseer Ibn Kathir with verse by verse Tashreeh, Urdu and English explanations, and scholarly insights.',
        keywords: 'Tafseer Ibn Kathir, Quran Tafseer Commentary, Quran Tashreeh, Urdu Tafseer, Verse Explanation, Authentic Quran Commentary'
      },
      hadith: {
        title: 'Sahih Hadith Collections & Translations | Maktaba tul Muslim',
        desc: 'Explore authentic Sahih Hadith collections including Sahih Al-Bukhari, Sahih Muslim, Sunan Abu Dawood, Jami at-Tirmidhi, Sunan An-Nasa\'i, and Sunan Ibn Majah with English and Urdu translations.',
        keywords: 'Sahih Bukhari, Sahih Muslim, Sunan Abu Dawood, Tirmidhi, Hadith Collections, Hadith in Urdu, Hadith in English, Sunnah of Prophet Muhammad'
      },
      qibla: {
        title: 'Live Qibla Finder & Accurate Prayer Times | Maktaba tul Muslim',
        desc: 'Find accurate Qibla direction online using GPS compass and view live daily Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for any location worldwide.',
        keywords: 'Qibla Finder Online, Qibla Compass, Live Prayer Times, Namaz Timing Today, Fajr Asr Maghrib Isha Times, Kaaba Direction'
      },
      fazail: {
        title: 'Virtues of Quran & Dhikr (فضائل قرآن) | Maktaba tul Muslim',
        desc: 'Read authentic virtues of Quran recitation, Fazail-e-Quran, Fazail-e-Dhikr, and blessings of daily remembrance of Allah SWT.',
        keywords: 'Fazail e Quran, Virtues of Quran Recitation, Virtues of Dhikr, فضائل قرآن, Blessings of Quran, Islamic Virtues'
      },
      namesOfAllah: {
        title: '99 Beautiful Names of Allah (Asma ul Husna) | Maktaba tul Muslim',
        desc: 'Learn 99 Beautiful Names of Allah (Asma ul Husna) with Arabic text, English transliteration, Urdu & English meanings, benefits, and audio pronunciation.',
        keywords: '99 Names of Allah, Asma ul Husna, Names of Allah Meaning in Urdu, Allah Names English, Asmaul Husna Audio'
      },
      tasbeeh: {
        title: 'Digital Tasbeeh Counter & Daily Dhikr | Maktaba tul Muslim',
        desc: 'Use virtual digital Tasbeeh counter for daily Zikr, SubhanAllah, Alhamdulillah, AllahuAkbar, Salawat on Prophet Muhammad (PBUH), and custom dhikr tallies.',
        keywords: 'Digital Tasbeeh Counter, Virtual Tasbeeh Online, Daily Zikr Counter, SubhanAllah Counter, Salawat Counter'
      },
      duas: {
        title: 'Masnoon Duas & Daily Supplications | Maktaba tul Muslim',
        desc: 'Access authentic Masnoon Duas, daily supplications from Fortress of the Muslim (Hisn al-Muslim), morning and evening Adhkar with Arabic, Urdu, and English audio.',
        keywords: 'Masnoon Duas, Daily Islamic Duas, Hisn al Muslim, Morning Evening Adhkar, Dua for Forgiveness, Urdu Masnoon Duas'
      },
      khatam: {
        title: 'Quran Khatam Progress Tracker & Goal Planner | Maktaba tul Muslim',
        desc: 'Track your daily Quran reading progress, set 30-day Ramadan Quran Khatam goals, and manage completed Juz and Surahs with personalized progress analytics.',
        keywords: 'Quran Khatam Tracker, Ramadan Quran Goal, Quran Reading Progress, Daily Juz Tracker'
      },
      contact: {
        title: 'Contact Us & Send Feedback | Maktaba tul Muslim',
        desc: 'Contact Maktaba tul Muslim team for questions, suggestions, feedback, or content submissions for our authentic Islamic portal.',
        keywords: 'Contact Maktaba tul Muslim, Islamic Portal Support, Submit Content'
      },
      about: {
        title: 'About Maktaba tul Muslim - Free Authentic Islamic Resource Platform',
        desc: 'Learn about Maktaba tul Muslim mission to provide free, authentic multi-language Quran, Hadith, Tafseer, Audio recitations, and Brahui Islamic literature to Muslims worldwide.',
        keywords: 'About Maktaba tul Muslim, Free Islamic Portal, Islamic Digital Resource'
      }
    };

    const currentSeo = pageSeoData[activeTab] || pageSeoData.home;
    document.title = currentSeo.title;

    // Dynamically set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', currentSeo.desc);

    // Dynamically set Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute('content', currentSeo.keywords);

    // Dynamically set OpenGraph Title, Description, Image & URL
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', currentSeo.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', currentSeo.desc);

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', 'https://maktabatulmuslim.com/logo.png');

    let twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', 'https://maktabatulmuslim.com/logo.png');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://maktabatulmuslim.com${tabPathMap[activeTab] || '/'}`);
  }, [activeTab]);

  // Check Auth Status on Load
  useEffect(() => {
    fetch(getApiUrl('/api/auth/status/'), { cache: 'no-store', headers: { 'Pragma': 'no-cache' } })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.google_client_id) {
          window.GOOGLE_OAUTH_CLIENT_ID = data.google_client_id;
        }
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
