import React, { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../utils/apiCache';
import { ALL_114_SURAHS } from '../data/quran_data';
import { useLanguage } from '../context/LanguageContext';

export default function UserDashboardView({ user, openAuthModal, navigateToTab, playTrack }) {
  const { t, lang } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reflections' | 'saved' | 'collections' | 'history' | 'namaz' | 'duas' | 'achievements' | 'calendar' | 'notifications' | 'preferences'
  
  // Search & Filtering for Saved Content
  const [savedSearch, setSavedSearch] = useState('');
  const [savedCategory, setSavedCategory] = useState('all'); // 'all' | 'quran' | 'books' | 'tafseer' | 'audio'
  const [savedSort, setSavedSort] = useState('recent'); // 'recent' | 'az'
  
  // Custom Collections states
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [selectedCollectionForViewing, setSelectedCollectionForViewing] = useState(null);
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(null); // item to add: { type, id/surah/ayah, title }

  // Avatar Upload states
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarFileRef = useRef(null);

  // Khatm Quran Modal & Search states
  const [showKhatmModal, setShowKhatmModal] = useState(false);
  const [khatmSurahSearch, setKhatmSurahSearch] = useState('');

  // Danger Zone / Account Deletion states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Settings & Security states
  const [passwordOld, setPasswordOld] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [securityMessage, setSecurityMessage] = useState(null);

  // Daily Quotes & Tools
  const dailyVerse = {
    surah: "Surah Ash-Sharh (94:5-6)",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    note: "Patience and trust in Allah bring victory and peace to every heart."
  };

  const dailyHadith = {
    book: "Sahih al-Bukhari 1",
    arabic: "إنَّما الأعْمالُ بالنِّيَّاتِ، وإنَّما لِكُلِّ امْرِئٍ ما نَوَى",
    translation: "Actions are judged by intentions, and every person will get what they intended.",
    grade: "Sahih (Muttafaq 'Alayh)"
  };

  const dailyDua = {
    title: "Dua for Increase in Knowledge",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi Zidni 'Ilma",
    translation: "O my Lord, Increase me in Knowledge.",
    source: "Surah Taha (20:114)"
  };

  // Morning/Evening Adhkar Checklist
  const [adhkarState, setAdhkarState] = useState({
    subhanAllah: 0,
    alhamdulillah: 0,
    allahuAkbar: 0,
    astaghfirullah: 0
  });

  const incrementAdhkar = (key, max = 33) => {
    setAdhkarState(prev => ({
      ...prev,
      [key]: prev[key] >= max ? 0 : prev[key] + 1
    }));
  };

  const [qadaFasts, setQadaFasts] = useState(() => {
    return parseInt(localStorage.getItem('maktaba_qada_fasts') || '0', 10);
  });

  const [reflections, setReflections] = useState(() => {
    return JSON.parse(localStorage.getItem('maktaba_user_reflections') || '[]');
  });

  const updateQada = (delta) => {
    const nextVal = Math.max(0, qadaFasts + delta);
    setQadaFasts(nextVal);
    localStorage.setItem('maktaba_qada_fasts', nextVal.toString());
  };

  // Fetch Dashboard Data from API
  const fetchDashboardData = () => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch(getApiUrl('/api/user/dashboard/'))
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setDashboardData(data);
          
          // Seed initial system notification if user_notifications is empty
          if (!data.user_notifications || data.user_notifications.length === 0) {
            const defaultNotifs = [
              {
                id: 'notif_welcome',
                title: 'Welcome to Maktaba tul Muslim!',
                message: 'Explore Quran recitations, Tafseer commentary, and authentic books. Add books to your saved list and start studying.',
                date: new Date().toLocaleDateString(),
                is_read: false
              }
            ];
            // Sync to backend
            fetch(getApiUrl('/api/user/preferences/update/'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_notifications: defaultNotifs })
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleToggleNamaz = (prayer) => {
    if (!user) return;
    fetch(getApiUrl('/api/user/namaz/toggle/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prayer })
    })
      .then(res => res.json())
      .then(() => fetchDashboardData());
  };

  const handleSavePreferences = (newPrefs) => {
    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dashboardData?.preferences, ...newPrefs })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Preferences updated!');
        fetchDashboardData();
      });
  };

  // Avatar Upload Handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size cannot exceed 5MB.');
      return;
    }
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar_file', file);
    try {
      const res = await fetch(getApiUrl('/api/user/avatar/upload/'), {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        setDashboardData(prev => ({
          ...prev,
          preferences: { ...prev?.preferences, avatar: data.avatar_url }
        }));
        alert('Profile picture updated successfully! 🕌');
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to upload photo.');
      }
    } catch {
      alert('Network error while uploading photo.');
    } finally {
      setAvatarUploading(false);
      if (avatarFileRef.current) avatarFileRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;
    handleSavePreferences({ avatar: '' });
  };

  // Toggle Surah Completed in Khatam Planner
  const handleToggleSurahCompleted = (surahNum) => {
    if (!dashboardData) return;
    const currentList = dashboardData.preferences?.completed_surahs || [];
    let updated;
    if (currentList.includes(surahNum)) {
      updated = currentList.filter(n => n !== surahNum);
    } else {
      updated = [...currentList, surahNum].sort((a, b) => a - b);
    }

    // Optimistic UI update
    setDashboardData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        completed_surahs: updated,
        khatm_percent: Math.round((updated.length / 114) * 100)
      }
    }));

    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed_surahs: updated })
    });
  };

  // Export User Study Data Backup (JSON)
  const handleExportData = () => {
    if (!dashboardData) return;
    const prefs = dashboardData.preferences || {};
    const exportPayload = {
      export_version: "2.0",
      generated_at: new Date().toISOString(),
      platform: "Maktaba tul Muslim (maktabatulmuslim.com)",
      user_profile: {
        username: user?.username,
        email: user?.email,
        full_name: prefs.full_name || '',
        city: prefs.location_city || '',
        streak_days: dashboardData.namaz_streak || 0,
        preferred_qari: prefs.preferred_qari,
        preferred_language: prefs.preferred_language
      },
      khatm_progress: {
        khatm_target_days: prefs.khatm_target_days || 30,
        completed_surahs_count: (prefs.completed_surahs || []).length,
        completed_surahs: prefs.completed_surahs || [],
        last_read_quran: { surah: prefs.last_read_surah || 1, ayah: prefs.last_read_ayah || 1 }
      },
      saved_bookmarks: dashboardData.bookmarks || [],
      saved_books: dashboardData.saved_books || [],
      saved_tafseers: dashboardData.saved_tafseers || [],
      favorite_recitations: dashboardData.favorite_recitations || [],
      ayah_reflections_journal: dashboardData.ayah_notes || [],
      study_collections: dashboardData.personal_collections || [],
      reading_history: {
        quran: dashboardData.quran_history || [],
        books: dashboardData.book_history || [],
        tafseer: dashboardData.tafseer_history || [],
        audio: dashboardData.audio_history || []
      },
      namaz_records_7_days: dashboardData.namaz_days || [],
      qada_fasts_count: qadaFasts
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Maktaba_Islamic_Backup_${user?.username || 'user'}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Delete Account Handler
  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm account deletion.');
      return;
    }
    setDeleteLoading(true);
    setDeleteError('');

    fetch(getApiUrl('/api/user/delete/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: deletePassword })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Your account and all associated data have been permanently removed.');
          window.location.reload();
        } else {
          setDeleteError(data.message || 'Incorrect password. Account was not deleted.');
          setDeleteLoading(false);
        }
      })
      .catch(() => {
        setDeleteError('Server connection error. Please try again.');
        setDeleteLoading(false);
      });
  };

  // Detect Client Browser and OS
  const getClientDeviceInfo = () => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let os = 'Windows OS';
    if (ua.indexOf('Win') !== -1) os = 'Windows 10/11';
    else if (ua.indexOf('Mac') !== -1) os = 'Apple macOS';
    else if (ua.indexOf('Android') !== -1) os = 'Android Mobile';
    else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) os = 'Apple iOS';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux OS';

    let browser = 'Web Browser';
    if (ua.indexOf('Chrome') !== -1 && ua.indexOf('Edg') === -1) browser = 'Google Chrome';
    else if (ua.indexOf('Edg') !== -1) browser = 'Microsoft Edge';
    else if (ua.indexOf('Firefox') !== -1) browser = 'Mozilla Firefox';
    else if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) browser = 'Apple Safari';

    return { os, browser };
  };

  // Delete Individual History Item
  const handleDeleteHistoryItem = (type, index) => {
    if (!dashboardData) return;
    const bodyKey = `${type}_history`;
    const currentList = dashboardData[bodyKey] || [];
    const updated = currentList.filter((_, idx) => idx !== index);

    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [bodyKey]: updated })
    })
      .then(res => res.json())
      .then(() => fetchDashboardData());
  };

  // Clear Entire History Type
  const handleClearHistory = (type) => {
    const bodyKey = `${type}_history`;
    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [bodyKey]: [] })
    })
      .then(res => res.json())
      .then(() => {
        alert(`${type.toUpperCase()} history cleared.`);
        fetchDashboardData();
      });
  };

  // Custom Collections Management
  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (!newCollectionName.trim() || !dashboardData) return;

    const existing = dashboardData.personal_collections || [];
    const newCollection = {
      id: 'coll_' + Date.now(),
      name: newCollectionName.trim(),
      description: newCollectionDesc.trim(),
      items: []
    };
    const updated = [...existing, newCollection];

    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personal_collections: updated })
    })
      .then(res => res.json())
      .then(() => {
        setNewCollectionName('');
        setNewCollectionDesc('');
        setShowNewCollectionForm(false);
        alert('New collection created!');
        fetchDashboardData();
      });
  };

  const handleDeleteCollection = (collId) => {
    if (!window.confirm("Are you sure you want to delete this study collection?") || !dashboardData) return;
    const updated = (dashboardData.personal_collections || []).filter(c => c.id !== collId);

    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personal_collections: updated })
    })
      .then(res => res.json())
      .then(() => {
        setSelectedCollectionForViewing(null);
        fetchDashboardData();
      });
  };

  const handleRemoveFromCollection = (collId, index) => {
    if (!dashboardData) return;
    const collections = [...(dashboardData.personal_collections || [])];
    const collIndex = collections.findIndex(c => c.id === collId);
    if (collIndex > -1) {
      collections[collIndex].items = collections[collIndex].items.filter((_, idx) => idx !== index);
      
      fetch(getApiUrl('/api/user/preferences/update/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personal_collections: collections })
      })
        .then(res => res.json())
        .then(() => {
          setSelectedCollectionForViewing(collections[collIndex]);
          fetchDashboardData();
        });
    }
  };

  const handleAddItemToCollection = (collId) => {
    if (!showAddToCollectionModal || !dashboardData) return;
    const collections = [...(dashboardData.personal_collections || [])];
    const collIndex = collections.findIndex(c => c.id === collId);
    
    if (collIndex > -1) {
      const items = collections[collIndex].items || [];
      // Avoid duplicate item in same collection
      const isDuplicate = items.some(i => i.type === showAddToCollectionModal.type && (i.id === showAddToCollectionModal.id || (i.surah === showAddToCollectionModal.surah && i.ayah === showAddToCollectionModal.ayah)));
      
      if (isDuplicate) {
        alert("This item is already added to this collection.");
        setShowAddToCollectionModal(null);
        return;
      }
      
      const updatedItems = [...items, showAddToCollectionModal];
      collections[collIndex].items = updatedItems;
      
      fetch(getApiUrl('/api/user/preferences/update/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personal_collections: collections })
      })
        .then(res => res.json())
        .then(() => {
          alert(`Added to "${collections[collIndex].name}" collection!`);
          setShowAddToCollectionModal(null);
          fetchDashboardData();
        });
    }
  };

  // Saved Bookmarking toggles
  const handleRemoveSavedBook = (bookId) => {
    if (!dashboardData) return;
    const updated = (dashboardData.saved_books || []).filter(b => b.book_id !== bookId);
    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saved_books: updated })
    })
      .then(res => res.json())
      .then(() => fetchDashboardData());
  };

  const handleRemoveSavedTafseer = (surah, ayah) => {
    if (!dashboardData) return;
    const updated = (dashboardData.saved_tafseers || []).filter(t => !(t.surah === surah && t.ayah === ayah));
    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saved_tafseers: updated })
    })
      .then(res => res.json())
      .then(() => fetchDashboardData());
  };

  // Change Password API Call
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordNew !== passwordConfirm) {
      setSecurityMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        change_password: true,
        old_password: passwordOld,
        new_password: passwordNew
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSecurityMessage({ type: 'success', text: 'Password updated successfully!' });
          setPasswordOld('');
          setPasswordNew('');
          setPasswordConfirm('');
        } else {
          setSecurityMessage({ type: 'error', text: data.message || 'Failed to update password.' });
        }
      })
      .catch(() => setSecurityMessage({ type: 'error', text: 'Server connection error.' }));
  };

  // Notification actions
  const handleToggleNotificationRead = (notifId) => {
    if (!dashboardData) return;
    const updated = (dashboardData.user_notifications || []).map(n => {
      if (n.id === notifId) {
        return { ...n, is_read: !n.is_read };
      }
      return n;
    });
    
    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_notifications: updated })
    })
      .then(() => fetchDashboardData());
  };

  const handleClearNotifications = () => {
    fetch(getApiUrl('/api/user/preferences/update/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_notifications: [] })
    })
      .then(() => {
        alert('All notifications cleared.');
        fetchDashboardData();
      });
  };

  // Get active greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Sabah al-Khair 🌅 (Good Morning)' : hour < 17 ? 'Masa’ al-Khair ☀️ (Good Afternoon)' : 'Assalamu Alaikum 🌙 (Good Evening)';

  // Loading or Guest view
  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem', borderRadius: '24px', border: '2px solid var(--accent-gold)', background: 'linear-gradient(135deg, var(--primary-emerald) 0%, var(--primary-dark) 100%)', color: '#fff' }}>
          <i className="fas fa-user-lock fa-4x" style={{ color: 'var(--accent-gold)', marginBottom: '1.25rem' }}></i>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
            Personal Islamic Portal & Dashboard
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Guests can freely read Quran, Hadith, Tafseer & listen to Qaris. Sign in to unlock your personal Islamic Profile, save books, track reading history, create private study collections, and sync reading progress!
          </p>
          <button
            onClick={() => openAuthModal ? openAuthModal('login') : null}
            className="btn-play"
            style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem', background: 'var(--accent-gold)', color: 'var(--primary-dark)', fontWeight: 800, margin: '0 auto', borderRadius: '30px' }}
          >
            <i className="fas fa-sign-in-alt"></i> Sign In to Your Islamic Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading || !dashboardData) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
        <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Loading Your Personalized Islamic Experience...</p>
      </div>
    );
  }

  const prefs = dashboardData.preferences || {};
  const namazDays = dashboardData.namaz_days || [];
  const todayNamaz = namazDays[0] || {};
  const completedNamazCount = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].filter(p => todayNamaz[p]).length;
  
  // Filtered Saved Content
  const rawSavedBooks = (dashboardData.saved_books || []).map(b => ({ ...b, type: 'books', title: b.title, saved_at: b.saved_at }));
  const rawSavedQuran = (dashboardData.bookmarks || []).map(q => ({ ...q, type: 'quran', title: `Surah ${q.surah_number} (Ayah ${q.ayah_number})`, saved_at: q.created_at }));
  const rawSavedTafseers = (dashboardData.saved_tafseers || []).map(t => ({ ...t, type: 'tafseer', title: `Tafseer of Surah ${t.surah}:${t.ayah}`, saved_at: t.saved_at }));
  const rawSavedAudios = (dashboardData.favorite_recitations || []).map(a => ({ ...a, type: 'audio', title: `${a.reciter} - Surah ${a.surah_number}`, saved_at: a.saved_at }));
  
  let allSavedItems = [...rawSavedBooks, ...rawSavedQuran, ...rawSavedTafseers, ...rawSavedAudios];
  
  // Filter by category
  if (savedCategory !== 'all') {
    allSavedItems = allSavedItems.filter(item => item.type === savedCategory);
  }
  
  // Filter by search query
  if (savedSearch.trim()) {
    const q = savedSearch.toLowerCase();
    allSavedItems = allSavedItems.filter(item => item.title.toLowerCase().includes(q) || (item.author && item.author.toLowerCase().includes(q)));
  }
  
  // Sort saved items
  if (savedSort === 'az') {
    allSavedItems.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    allSavedItems.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
  }

  // Count unread notifications
  const unreadNotifsCount = (dashboardData.user_notifications || []).filter(n => !n.is_read).length;

  // Khatm-ul-Quran calculations
  const completedSurahsList = prefs.completed_surahs || [];
  const completedSurahsCount = completedSurahsList.length;
  const remainingSurahsCount = Math.max(0, 114 - completedSurahsCount);
  const khatmPercent = Math.min(100, Math.round((completedSurahsCount / 114) * 100));
  const dailySurahTarget = Math.max(1, Math.ceil(remainingSurahsCount / Math.max(1, prefs.khatm_target_days || 30)));

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={avatarFileRef}
        accept="image/*"
        onChange={handleAvatarUpload}
        style={{ display: 'none' }}
      />
      
      {/* 🌟 HERO DASHBOARD HEADER */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem', background: 'linear-gradient(135deg, var(--primary-emerald) 0%, var(--primary-dark) 100%)', color: '#fff', border: '2px solid var(--accent-gold)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {/* 📷 Avatar with Direct Upload Badge */}
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--accent-gold)', boxShadow: '0 6px 20px rgba(0,0,0,0.3)', background: '#022c22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {prefs.avatar ? (
                  <img src={prefs.avatar} alt="Profile Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
                    {prefs.full_name ? prefs.full_name.charAt(0).toUpperCase() : (user.username ? user.username.charAt(0).toUpperCase() : 'U')}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarFileRef.current && avatarFileRef.current.click()}
                title="Change Profile Picture"
                disabled={avatarUploading}
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  color: '#022c22',
                  border: '2px solid #022c22',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {avatarUploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
              </button>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {timeGreeting}
              </span>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0' }}>
                Welcome back, {prefs.full_name || user.username}! 🕌
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                📅 <strong>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> &bull; Private Islamic Dashboard
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ background: 'rgba(245,158,11,0.2)', border: '1.5px solid var(--accent-gold)', padding: '0.5rem 1rem', borderRadius: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'block' }}>READING STREAK</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>🔥 {dashboardData.namaz_streak || 7} Days</strong>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.2)', border: '1.5px solid #10b981', padding: '0.5rem 1rem', borderRadius: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'block' }}>SAVED ITEMS</span>
              <strong style={{ fontSize: '1.2rem', color: '#34d399' }}>⭐ {allSavedItems.length} Saved</strong>
            </div>
            
            <button
              onClick={() => navigateToTab('read')}
              style={{ background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '16px', fontWeight: 800, padding: '0.75rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
            >
              <i className="fas fa-book-open"></i> Resume Quran {prefs.last_read_surah || 1}:{prefs.last_read_ayah || 1}
            </button>
          </div>
        </div>
      </div>

      {/* 📌 PREMIUM NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: '🏠 ' + t('accountOverview', "Today's Overview"), icon: 'fas fa-home' },
          { id: 'saved', label: '⭐ ' + t('savedItems', 'Saved & Bookmarks'), icon: 'fas fa-star' },
          { id: 'collections', label: '📁 ' + t('collections', 'Study Collections'), icon: 'fas fa-folder-open' },
          { id: 'reflections', label: '✍️ ' + t('myReflections', 'Reflections Journal'), icon: 'fas fa-pen-nib' },
          { id: 'history', label: '⌛ ' + t('history', 'Private History'), icon: 'fas fa-history' },
          { id: 'namaz', label: '🕌 ' + t('namazTracker', 'Prayer Streak') + ' (' + completedNamazCount + '/5)', icon: 'fas fa-pray' },
          { id: 'duas', label: '🤲 ' + t('duasCollection', 'Daily Adhkar & Tasbeeh'), icon: 'fas fa-hands' },
          { id: 'calendar', label: '📅 ' + t('islamicCalendar', 'Islamic Events'), icon: 'fas fa-calendar-alt' },
          { id: 'notifications', label: '🔔 ' + t('notifications', 'Notifications') + ` (${unreadNotifsCount})`, icon: 'fas fa-bell' },
          { id: 'preferences', label: '⚙️ ' + t('settings', 'Settings & Privacy'), icon: 'fas fa-cog' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.65rem 1.2rem',
                borderRadius: '20px',
                border: 'none',
                background: isActive ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
                color: isActive ? '#022c22' : '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <i className={tab.icon}></i> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 🏠 TAB: OVERVIEW (CONTINUE LEARNING + DAILY QUOTES) */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* ⚡ CONTINUE LEARNING BAR */}
          <div className="card" style={{ padding: '1.5rem', background: '#09090b', border: '1.5px solid var(--accent-gold)', borderRadius: '20px', color: '#fff' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-gold)', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-play-circle"></i> Continue Learning
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1rem' }}>
              
              {/* Quran Tracker */}
              <div style={{ background: '#18181b', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>LAST READ QURAN</span>
                <strong style={{ fontSize: '1rem', color: '#fff', display: 'block', margin: '0.2rem 0' }}>Surah {prefs.last_read_surah || 1} (Ayah {prefs.last_read_ayah || 1})</strong>
                <button
                  onClick={() => navigateToTab('read')}
                  style={{ background: 'transparent', border: 'none', color: '#10b981', padding: 0, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}
                >
                  Resume Reader <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              {/* Book progress */}
              <div style={{ background: '#18181b', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>LAST BOOK PROGRESS</span>
                {dashboardData.saved_books && dashboardData.saved_books.length > 0 ? (
                  <>
                    <strong style={{ fontSize: '0.95rem', color: '#fff', display: 'block', margin: '0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dashboardData.saved_books[0].title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Page {dashboardData.saved_books[0].progress_page} of {dashboardData.saved_books[0].pages_count}</span>
                  </>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginTop: '0.2rem' }}>No books reading in progress</span>
                )}
                <button
                  onClick={() => navigateToTab('books')}
                  style={{ background: 'transparent', border: 'none', color: '#6366f1', padding: 0, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}
                >
                  Browse Library <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              {/* Tafseer progress */}
              <div style={{ background: '#18181b', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>LAST READ TAFSEER</span>
                {dashboardData.tafseer_history && dashboardData.tafseer_history.length > 0 ? (
                  <strong style={{ fontSize: '0.95rem', color: '#fff', display: 'block', margin: '0.2rem 0' }}>
                    Surah {dashboardData.tafseer_history[0].surah}:{dashboardData.tafseer_history[0].ayah}
                  </strong>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginTop: '0.2rem' }}>No recently read Tafseer</span>
                )}
                <button
                  onClick={() => navigateToTab('tafseer')}
                  style={{ background: 'transparent', border: 'none', color: '#ec4899', padding: 0, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}
                >
                  Open Tafseer <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              {/* Audio progress */}
              <div style={{ background: '#18181b', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.72rem', color: '#eab308', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>LAST PLAYED AUDIO</span>
                {dashboardData.audio_history && dashboardData.audio_history.length > 0 ? (
                  <>
                    <strong style={{ fontSize: '0.92rem', color: '#fff', display: 'block', margin: '0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dashboardData.audio_history[0].track_title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{dashboardData.audio_history[0].reciter}</span>
                  </>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginTop: '0.2rem' }}>No recently played audio</span>
                )}
                {dashboardData.audio_history && dashboardData.audio_history.length > 0 && (
                  <button
                    onClick={() => playTrack(dashboardData.audio_history[0].url, dashboardData.audio_history[0].track_title, dashboardData.audio_history[0].reciter)}
                    style={{ background: 'transparent', border: 'none', color: '#eab308', padding: 0, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}
                  >
                    Resume Audio <i className="fas fa-play"></i>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* 🌟 KHATM-UL-QURAN PLANNER & VISUAL PROGRESS */}
          <div className="card" style={{ padding: '1.75rem', background: '#09090b', border: '1.5px solid var(--accent-gold)', borderRadius: '20px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  HOLY QURAN COMPLETION PLANNER
                </span>
                <h3 style={{ margin: '0.2rem 0', color: '#fff', fontSize: '1.35rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-quran" style={{ color: 'var(--accent-gold)' }}></i> Khatm-ul-Quran Goal Tracker
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#a1a1aa' }}>
                  Track completed Surahs, set your target pace, and achieve your Khatm milestone.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowKhatmModal(true)}
                  style={{
                    background: 'var(--accent-gold)',
                    color: '#022c22',
                    border: 'none',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.88rem',
                    boxShadow: '0 4px 15px rgba(245,158,11,0.25)'
                  }}
                >
                  <i className="fas fa-list-check"></i> Manage 114 Surahs ({completedSurahsCount}/114)
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
                <span style={{ color: '#e4e4e7' }}>
                  Overall Progress: <strong style={{ color: 'var(--accent-gold)', fontSize: '1.05rem' }}>{khatmPercent}%</strong> ({completedSurahsCount} of 114 Surahs Completed)
                </span>
                <span style={{ color: '#a1a1aa' }}>
                  {remainingSurahsCount} Surahs Remaining
                </span>
              </div>
              <div style={{ width: '100%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', padding: '2px', border: '1px solid rgba(245,158,11,0.3)' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${khatmPercent}%`,
                    background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #eab308 100%)',
                    borderRadius: '10px',
                    transition: 'width 0.4s ease',
                    boxShadow: '0 0 12px rgba(245,158,11,0.5)'
                  }}
                />
              </div>
            </div>

            {/* Pace & Statistics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#18181b', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.72rem', color: '#a1a1aa', display: 'block', fontWeight: 700 }}>TARGET DURATION</span>
                <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{prefs.khatm_target_days || 30} Days Plan</strong>
              </div>

              <div style={{ background: '#18181b', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.72rem', color: '#a1a1aa', display: 'block', fontWeight: 700 }}>DAILY READING PACE</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-gold)' }}>~{dailySurahTarget} Surahs / Day</strong>
              </div>

              <div style={{ background: '#18181b', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.72rem', color: '#a1a1aa', display: 'block', fontWeight: 700 }}>TOTAL VERSES IN QURAN</span>
                <strong style={{ fontSize: '1.1rem', color: '#34d399' }}>6,236 Ayahs</strong>
              </div>
            </div>

            {/* Quick Target Pace Preset Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 700, marginRight: '0.25rem' }}>
                Adjust Target Pace:
              </span>
              {[
                { days: 30, label: '30 Days (Ramadan Pace)' },
                { days: 60, label: '60 Days (2 Months)' },
                { days: 90, label: '90 Days (Quarterly)' },
                { days: 180, label: '6 Months' },
                { days: 365, label: '1 Year' },
              ].map(preset => {
                const isSelected = (prefs.khatm_target_days || 30) === preset.days;
                return (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => handleSavePreferences({ khatm_target_days: preset.days })}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '20px',
                      border: isSelected ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.15)',
                      background: isSelected ? 'rgba(245,158,11,0.2)' : 'transparent',
                      color: isSelected ? 'var(--accent-gold)' : '#d4d4d8',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily 3-Grid: Verse, Hadith & Dua */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.25rem' }}>
            {/* Daily Quran Verse */}
            <div className="card" style={{ padding: '1.5rem', background: 'var(--primary-dark)', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.4)', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, background: 'rgba(245,158,11,0.2)', color: 'var(--accent-gold)', padding: '3px 10px', borderRadius: '12px' }}>
                  📖 DAILY QURAN VERSE
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{dailyVerse.surah}</span>
              </div>
              <p style={{ fontSize: '1.3rem', fontFamily: "'Amiri', serif", color: 'var(--accent-gold)', direction: 'rtl', textAlign: 'right', margin: '0.75rem 0', lineHeight: '1.8' }}>
                {dailyVerse.arabic}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.5', margin: '0 0 0.75rem 0' }}>
                "{dailyVerse.translation}"
              </p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                💡 Reflection: {dailyVerse.note}
              </p>
            </div>

            {/* Daily Hadith */}
            <div className="card" style={{ padding: '1.5rem', background: 'var(--primary-emerald)', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.4)', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '3px 10px', borderRadius: '12px' }}>
                  📜 DAILY HADITH
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{dailyHadith.book}</span>
              </div>
              <p style={{ fontSize: '1.2rem', fontFamily: "'Amiri', serif", color: '#818cf8', direction: 'rtl', textAlign: 'right', margin: '0.75rem 0', lineHeight: '1.7' }}>
                {dailyHadith.arabic}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.5', margin: 0 }}>
                "{dailyHadith.translation}"
              </p>
            </div>

            {/* Daily Dua */}
            <div className="card" style={{ padding: '1.5rem', background: '#0f172a', borderRadius: '20px', border: '1px solid rgba(236,72,153,0.4)', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, background: 'rgba(236,72,153,0.2)', color: '#f472b6', padding: '3px 10px', borderRadius: '12px' }}>
                  🤲 DAILY DUA
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{dailyDua.source}</span>
              </div>
              <p style={{ fontSize: '1.3rem', fontFamily: "'Amiri', serif", color: '#f472b6', direction: 'rtl', textAlign: 'right', margin: '0.75rem 0' }}>
                {dailyDua.arabic}
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)', margin: '0 0 0.25rem 0' }}>
                {dailyDua.transliteration}
              </p>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0 }}>
                "{dailyDua.translation}"
              </p>
            </div>
          </div>

          {/* Live Prayer Times countdown checklist */}
          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', borderRadius: '20px', border: '1px solid var(--accent-gold)', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-clock"></i> Today's Prayer Schedule
                </h3>
              </div>
              <button
                onClick={() => navigateToTab('qibla')}
                style={{ padding: '0.55rem 1.1rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <i className="fas fa-compass"></i> Qibla Compass
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
              {[
                { name: 'Fajr', time: '4:15 AM', active: false },
                { name: 'Dhuhr', time: '12:30 PM', active: false },
                { name: 'Asr', time: '4:45 PM', active: true },
                { name: 'Maghrib', time: '7:15 PM', active: false },
                { name: 'Isha', time: '8:45 PM', active: false },
              ].map(p => (
                <div key={p.name} style={{ padding: '0.85rem 0.5rem', borderRadius: '14px', background: p.active ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)', border: p.active ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.8rem', color: p.active ? 'var(--accent-gold)' : '#a1a1aa', fontWeight: 700, display: 'block' }}>{p.name}</span>
                  <strong style={{ fontSize: '1rem', color: '#fff', marginTop: '0.2rem', display: 'block' }}>{p.time}</strong>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ⭐ TAB: MY SAVED & BOOKMARKS */}
      {/* ========================================================================= */}
      {activeTab === 'saved' && (
        <div className="card" style={{ padding: '2rem', background: '#09090b', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.3)', color: '#fff' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ color: '#f59e0b', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-bookmark"></i> My Saved & Bookmarks Portal
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                All your saved books, Quran bookmarks, recitations and Tafseer commentaries in one secure location.
              </p>
            </div>
          </div>

          {/* Search, Filter, Sort Controls */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', background: '#18181b', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ flex: '2 1 240px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search saved items by title or author..."
                value={savedSearch}
                onChange={e => setSavedSearch(e.target.value)}
                style={{ background: '#09090b', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
              />
            </div>
            
            <div style={{ flex: '1 1 150px' }}>
              <select
                className="form-select"
                value={savedCategory}
                onChange={e => setSavedCategory(e.target.value)}
                style={{ background: '#09090b', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <option value="all">📁 All Categories</option>
                <option value="quran">📖 Quran Bookmarks</option>
                <option value="books">📚 Saved Books</option>
                <option value="tafseer">🖋️ Saved Tafseers</option>
                <option value="audio">🎧 Recitations</option>
              </select>
            </div>

            <div style={{ flex: '1 1 120px' }}>
              <select
                className="form-select"
                value={savedSort}
                onChange={e => setSavedSort(e.target.value)}
                style={{ background: '#09090b', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <option value="recent">⏱️ Recently Saved</option>
                <option value="az">🔤 Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Saved Items List */}
          {allSavedItems.length === 0 ? (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', background: '#18181b', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.15)' }}>
              <i className="fas fa-folder-open fa-3x" style={{ color: '#cbd5e1', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#e2e8f0', margin: 0 }}>No Saved Items Found</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.4rem' }}>
                Search books or read Quran and bookmark items to build your personal library!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {allSavedItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: '1rem' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
                    <span style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: '8px',
                      background: item.type === 'quran' ? 'rgba(16,185,129,0.15)' : item.type === 'books' ? 'rgba(99,102,241,0.15)' : item.type === 'tafseer' ? 'rgba(236,72,153,0.15)' : 'rgba(245,158,11,0.15)',
                      color: item.type === 'quran' ? '#34d399' : item.type === 'books' ? '#818cf8' : item.type === 'tafseer' ? '#f472b6' : '#fbbf24',
                      fontSize: '0.85rem',
                      fontWeight: 800
                    }}>
                      {item.type.toUpperCase()}
                    </span>
                    <div>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{item.title}</h4>
                      {item.author && <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>By {item.author} &bull; </span>}
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Saved on {item.saved_at}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    
                    {/* Add to Collection folder */}
                    <button
                      onClick={() => setShowAddToCollectionModal(item)}
                      style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      title="Add to Collection folder"
                    >
                      <i className="fas fa-folder-plus"></i> Add to Folder
                    </button>

                    {item.type === 'books' && (
                      <button
                        onClick={() => navigateToTab('books')}
                        style={{ background: 'var(--primary-emerald)', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Read Book
                      </button>
                    )}

                    {item.type === 'quran' && (
                      <button
                        onClick={() => navigateToTab('read')}
                        style={{ background: 'var(--primary-emerald)', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Read Ayah
                      </button>
                    )}

                    {item.type === 'tafseer' && (
                      <button
                        onClick={() => navigateToTab('tafseer')}
                        style={{ background: 'var(--primary-emerald)', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Open Tafseer
                      </button>
                    )}

                    {item.type === 'audio' && (
                      <button
                        onClick={() => playTrack(item.url || '', item.title, item.reciter || '')}
                        style={{ background: 'var(--accent-gold)', border: 'none', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Play Audio
                      </button>
                    )}

                    {/* Remove Save */}
                    <button
                      onClick={() => {
                        if (item.type === 'books') handleRemoveSavedBook(item.book_id);
                        if (item.type === 'tafseer') handleRemoveSavedTafseer(item.surah, item.ayah);
                        if (item.type === 'quran') handleToggleNamaz('fajr'); // Stub or toggle bookmark
                      }}
                      style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }}
                      title="Remove Bookmark"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>

                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 📁 TAB: STUDY COLLECTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'collections' && (
        <div className="card" style={{ padding: '2rem', background: '#09090b', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.3)', color: '#fff' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ color: '#f59e0b', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-folder-open"></i> Private Study Collections ({dashboardData.personal_collections?.length || 0})
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                Organize books, verses, and Tafseer commentary into custom private study folders (e.g. "Ramadan Reading", "Quran Study").
              </p>
            </div>
            
            <button
              onClick={() => setShowNewCollectionForm(!showNewCollectionForm)}
              style={{ background: 'linear-gradient(135deg, var(--accent-gold), #d97706)', border: 'none', color: '#000', padding: '0.55rem 1.25rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              <i className="fas fa-plus"></i> Create New Folder
            </button>
          </div>

          {/* New Collection Form */}
          {showNewCollectionForm && (
            <form onSubmit={handleCreateCollection} style={{ background: '#18181b', padding: '1.25rem', borderRadius: '14px', marginBottom: '1.5rem', border: '1.5px dashed var(--accent-gold)' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-gold)', fontSize: '1.05rem' }}>Create Study Collection</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa' }}>Collection Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Ramadan Reading, Seerah Studies"
                    value={newCollectionName}
                    onChange={e => setNewCollectionName(e.target.value)}
                    style={{ marginTop: '0.2rem', background: '#09090b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa' }}>Description</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    placeholder="Brief description of what you are organizing here..."
                    value={newCollectionDesc}
                    onChange={e => setNewCollectionDesc(e.target.value)}
                    style={{ marginTop: '0.2rem', background: '#09090b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowNewCollectionForm(false)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', padding: '0.4rem 1rem', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ background: 'var(--primary-emerald)', color: '#fff', border: 'none', padding: '0.4rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Save Folder</button>
                </div>
              </div>
            </form>
          )}

          {/* List Collections */}
          {selectedCollectionForViewing ? (
            // VIEW SINGLE COLLECTION ITEMS
            <div>
              <button
                onClick={() => setSelectedCollectionForViewing(null)}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginBottom: '1.25rem' }}
              >
                <i className="fas fa-arrow-left"></i> Back to Collections
              </button>
              
              <div style={{ background: '#18181b', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1.3rem' }}>📁 Folder: {selectedCollectionForViewing.name}</h3>
                <p style={{ margin: '0.3rem 0 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>{selectedCollectionForViewing.description || 'No description provided.'}</p>
                <button
                  onClick={() => handleDeleteCollection(selectedCollectionForViewing.id)}
                  style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.75rem' }}
                >
                  <i className="fas fa-trash-alt"></i> Delete Folder
                </button>
              </div>

              {/* Items list inside Collection */}
              {(!selectedCollectionForViewing.items || selectedCollectionForViewing.items.length === 0) ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: '#18181b', borderRadius: '12px' }}>
                  <p style={{ color: '#94a3b8', margin: 0 }}>This study folder is empty. Go to "Saved & Bookmarks" tab and click "Add to Folder" to organize items here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedCollectionForViewing.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#1c1917', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block' }}>{item.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700 }}>{item.type}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCollection(selectedCollectionForViewing.id, idx)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                        title="Remove from collection"
                      >
                        <i className="fas fa-minus-circle"></i> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // LIST ALL COLLECTIONS
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
              {(dashboardData.personal_collections || []).length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '3rem 1rem', textAlign: 'center', background: '#18181b', borderRadius: '16px' }}>
                  <i className="fas fa-folder fa-3x" style={{ color: 'var(--accent-gold)', opacity: 0.6, marginBottom: '1rem' }}></i>
                  <h4 style={{ color: '#cbd5e1', margin: 0 }}>No Collections Created</h4>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Click "Create New Folder" to start organizing your study materials.</p>
                </div>
              ) : (
                (dashboardData.personal_collections || []).map((coll) => (
                  <div
                    key={coll.id}
                    onClick={() => setSelectedCollectionForViewing(coll)}
                    style={{ background: '#18181b', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.2s', hover: { transform: 'translateY(-2px)' } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.5rem' }}>📁</span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                        {coll.items ? coll.items.length : 0} ITEMS
                      </span>
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: '0.75rem 0 0.25rem 0' }}>{coll.name}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0, height: '36px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{coll.description || 'Study collection folder.'}</p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ⌛ TAB: HISTORY */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="card" style={{ padding: '2rem', background: '#09090b', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.3)', color: '#fff' }}>
          
          <h2 style={{ color: '#f59e0b', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-history"></i> My Learning & Study History
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Keep track of your study sessions. All reading history and listening logs are completely private to your profile.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. Quran Reading History */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1.1rem' }}><i className="fas fa-book-open"></i> Quran Reading History</h3>
                {dashboardData.quran_history && dashboardData.quran_history.length > 0 && (
                  <button onClick={() => handleClearHistory('quran')} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Clear Quran History</button>
                )}
              </div>
              {(!dashboardData.quran_history || dashboardData.quran_history.length === 0) ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No recent Quran history logged.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {dashboardData.quran_history.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', background: '#18181b', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Read <strong>Surah {h.surah} (Ayah {h.ayah})</strong></span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{h.timestamp}</span>
                        <button onClick={() => handleDeleteHistoryItem('quran', idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-times-circle"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Library Books History */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1.1rem' }}><i className="fas fa-book"></i> Library Books History</h3>
                {dashboardData.book_history && dashboardData.book_history.length > 0 && (
                  <button onClick={() => handleClearHistory('book')} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Clear Books History</button>
                )}
              </div>
              {(!dashboardData.book_history || dashboardData.book_history.length === 0) ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No recent book reading logged.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {dashboardData.book_history.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', background: '#18181b', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Opened <strong>{h.title}</strong> (Page {h.page})</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{h.timestamp}</span>
                        <button onClick={() => handleDeleteHistoryItem('book', idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-times-circle"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Audio Recitation History */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1.1rem' }}><i className="fas fa-headphones"></i> Audio Recitation History</h3>
                {dashboardData.audio_history && dashboardData.audio_history.length > 0 && (
                  <button onClick={() => handleClearHistory('audio')} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Clear Audio History</button>
                )}
              </div>
              {(!dashboardData.audio_history || dashboardData.audio_history.length === 0) ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No recent audio playback logged.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {dashboardData.audio_history.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', background: '#18181b', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Listened: <strong>{h.track_title}</strong> ({h.reciter})</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{h.timestamp}</span>
                        <button onClick={() => handleDeleteHistoryItem('audio', idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-times-circle"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔔 TAB: NOTIFICATIONS PANEL */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="card" style={{ padding: '2rem', background: '#09090b', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.3)', color: '#fff' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: '#f59e0b', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-bell"></i> Website Events & Notifications
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                Stay updated with system announcements, voluntary fasting alerts, and library uploads.
              </p>
            </div>
            
            {dashboardData.user_notifications && dashboardData.user_notifications.length > 0 && (
              <button
                onClick={handleClearNotifications}
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Clear All
              </button>
            )}
          </div>

          {(!dashboardData.user_notifications || dashboardData.user_notifications.length === 0) ? (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', background: '#18181b', borderRadius: '16px' }}>
              <i className="far fa-bell-slash fa-3x" style={{ color: '#64748b', marginBottom: '1rem' }}></i>
              <h4 style={{ color: '#e2e8f0', margin: 0 }}>No Notifications</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>You are all caught up with Maktaba tul Muslim alerts!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dashboardData.user_notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '1rem 1.25rem',
                    background: n.is_read ? '#18181b' : 'rgba(245,158,11,0.06)',
                    borderRadius: '12px',
                    borderLeft: n.is_read ? '4px solid #64748b' : '4px solid var(--accent-gold)',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    borderRight: '1px solid rgba(255,255,255,0.04)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1rem', color: n.is_read ? '#cbd5e1' : '#fff' }}>{n.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{n.date}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0.5rem 0 0 0', lineHeight: '1.5' }}>{n.message}</p>
                  
                  <button
                    onClick={() => handleToggleNotificationRead(n.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', padding: 0, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}
                  >
                    {n.is_read ? 'Mark Unread' : 'Mark as Read'}
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ✍️ TAB: MY REFLECTIONS JOURNAL */}
      {/* ========================================================================= */}
      {activeTab === 'reflections' && (
        <div className="card" style={{ padding: '2rem', background: '#09090b', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.3)', color: '#fff' }}>
          <h2 style={{ color: '#f59e0b', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-pen-nib"></i> My Tadabbur Personal Reflections & Notes ({reflections.length})
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Private notes and spiritual reflections attached to Ayahs while reading the Holy Quran.
          </p>

          {reflections.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', background: '#18181b', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.15)' }}>
              <i className="fas fa-edit fa-3x" style={{ color: '#f59e0b', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#e2e8f0', margin: '0 0 0.5rem 0' }}>No Reflections Saved Yet</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Go to "Read Quran" view and click the pen icon (✍️) next to any Ayah to save your personal reflections here!
              </p>
              <button onClick={() => navigateToTab('read')} style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: 700, borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
                Open Quran Reader ▶
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {reflections.map((item) => (
                <div key={item.id} style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                      Surah {item.surahName} [{item.surah}:{item.ayah}]
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{item.date}</span>
                  </div>
                  <p className="arabic-font" style={{ fontSize: '1.15rem', color: '#6ee7b7', direction: 'rtl', margin: '0.5rem 0', background: '#09090b', padding: '0.6rem', borderRadius: '8px' }}>
                    {item.textArabic}
                  </p>
                  <p style={{ color: '#f8fafc', fontSize: '0.95rem', margin: '0.75rem 0 0 0', lineHeight: '1.5', background: 'rgba(245,158,11,0.08)', padding: '0.75rem', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
                    💭 <strong>Reflection:</strong> {item.note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🕌 TAB: PRAYER TRACKER & FASTING */}
      {/* ========================================================================= */}
      {activeTab === 'namaz' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px', border: '1.5px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                <i className="fas fa-pray" style={{ color: 'var(--accent-gold)' }}></i> Daily 5 Namaz Tracker
              </h3>
              <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#b45309', fontWeight: 800, padding: '3px 10px', borderRadius: '12px' }}>
                🔥 {dashboardData.namaz_streak || 7} Day Streak
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Check off your prayers for today ({todayNamaz.date || 'Today'}):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => (
                <label key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', background: todayNamaz[p] ? '#ecfdf5' : '#f8fafc', borderRadius: '12px', border: todayNamaz[p] ? '1.5px solid #10b981' : '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'capitalize', color: todayNamaz[p] ? '#065f46' : '#334155' }}>
                    {p === 'fajr' && '🌅 Fajr (Dawn)'}
                    {p === 'dhuhr' && '☀️ Dhuhr (Noon)'}
                    {p === 'asr' && '🌤️ Asr (Afternoon)'}
                    {p === 'maghrib' && '🌆 Maghrib (Sunset)'}
                    {p === 'isha' && '🌙 Isha (Night)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={!!todayNamaz[p]}
                    onChange={() => handleToggleNamaz(p)}
                    style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Fasting (Sawm) & Qada Tracker Card */}
          <div className="card" style={{ padding: '1.5rem', background: '#09090b', borderRadius: '20px', color: '#fff', border: '1.5px solid rgba(245,158,11,0.4)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <i className="fas fa-moon"></i> Fasting (Sawm) & Qada Tracker
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Track voluntary Sunnah fasts and manage remaining Qada fasts to make up.
            </p>

            <div style={{ background: '#18181b', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>REMAINING QADA FASTS</span>
                <strong style={{ fontSize: '1.6rem', color: '#f59e0b' }}>{qadaFasts} Days</strong>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => updateQada(-1)} style={{ padding: '0.4rem 0.8rem', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>-1 Made Up</button>
                <button onClick={() => updateQada(1)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>+1 Added</button>
              </div>
            </div>

            <div style={{ background: 'rgba(6,78,59,0.3)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#6ee7b7', marginBottom: '1rem' }}>
              <i className="fas fa-star"></i> <strong>Recommended Sunnah Fasts:</strong> Mondays & Thursdays, 13th, 14th, 15th of Hijri month (White Days).
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#27272a', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(245,158,11,0.3)' }}>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#fcd34d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fas fa-history"></i> Qaza-e-Umri (Missed Salah) Tracker
                </strong>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Full calculator & daily makeup tracker for missed prayers (Fajr to Witr).
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateToTab && navigateToTab('qada')}
                style={{ background: '#f59e0b', color: '#000000', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Open Tracker →
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🤲 TAB: DAILY ADHKAR & TASBEEH COUNTER */}
      {/* ========================================================================= */}
      {activeTab === 'duas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem' }}>
              <i className="fas fa-hand-holding-heart" style={{ color: 'var(--accent-gold)' }}></i> Daily Tasbeeh & Dhikr Counter
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
              {[
                { key: 'subhanAllah', name: 'سُبْحَانَ اللَّهِ', trans: 'SubhanAllah (Glory be to Allah)', count: adhkarState.subhanAllah, max: 33 },
                { key: 'alhamdulillah', name: 'الْحَمْدُ لِلَّهِ', trans: 'Alhamdulillah (Praise be to Allah)', count: adhkarState.alhamdulillah, max: 33 },
                { key: 'allahuAkbar', name: 'اللَّهُ أَكْبَرُ', trans: 'Allahu Akbar (Allah is Great)', count: adhkarState.allahuAkbar, max: 34 },
                { key: 'astaghfirullah', name: 'أَسْتَغْفِرُ اللَّهَ', trans: 'Astaghfirullah (I seek forgiveness)', count: adhkarState.astaghfirullah, max: 100 },
              ].map(item => (
                <div key={item.key} style={{ padding: '1.25rem', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.3rem', fontFamily: "'Amiri', serif", color: 'var(--primary-dark)' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.trans}</span>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      {item.count} / {item.max} Completed
                    </div>
                  </div>

                  <button
                    onClick={() => incrementAdhkar(item.key, item.max)}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#022c22', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}
                  >
                    +1
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 📅 TAB: ISLAMIC EVENTS & COUNTDOWNS */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', background: 'var(--primary-emerald)', borderRadius: '20px', color: '#fff', border: '1.5px solid var(--accent-gold)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
              <i className="fas fa-moon"></i> Ramadan 1448 AH Countdown
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>
              182 Days Left
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
              Expected Start: <strong>February 2027</strong> &bull; Prepare your Khatm goal in advance!
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'var(--primary-dark)', borderRadius: '20px', color: '#fff', border: '1.5px solid var(--accent-gold)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
              <i className="fas fa-star"></i> Eid al-Adha Countdown
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '0.5rem 0' }}>
              284 Days Left
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
              10 Dhul Hijjah 1448 AH &bull; May Allah accept your sacrifices & prayers!
            </p>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚙️ TAB: PREFERENCES, THEME, SECURITY */}
      {/* ========================================================================= */}
      {activeTab === 'preferences' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
          
          {/* Profile & Customization */}
          <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <i className="fas fa-user-edit" style={{ color: 'var(--accent-gold)' }}></i> Edit Profile & Settings
            </h3>

            {/* Profile Avatar Upload & Manage */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }}>
                <div style={{ width: '76px', height: '76px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--accent-gold)', background: '#022c22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {prefs.avatar ? (
                    <img src={prefs.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
                      {prefs.full_name ? prefs.full_name.charAt(0).toUpperCase() : (user.username ? user.username.charAt(0).toUpperCase() : 'U')}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-dark)' }}>Profile Avatar / Photo</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Upload JPG, PNG or WEBP (Max 5MB). Syncs automatically across the platform.</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => avatarFileRef.current && avatarFileRef.current.click()}
                    disabled={avatarUploading}
                    style={{
                      background: 'var(--primary-dark)',
                      color: 'var(--accent-gold)',
                      border: 'none',
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {avatarUploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-upload"></i>}
                    {avatarUploading ? 'Uploading...' : 'Upload Photo'}
                  </button>

                  {prefs.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={prefs.full_name || ''}
                  onChange={e => handleSavePreferences({ full_name: e.target.value })}
                  placeholder="e.g. Muhammad Al-Brahui"
                  style={{ marginTop: '0.35rem' }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={prefs.contact_phone || ''}
                  onChange={e => handleSavePreferences({ contact_phone: e.target.value })}
                  placeholder="e.g. +923001234567"
                  style={{ marginTop: '0.35rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Personal Bio</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={prefs.bio || ''}
                onChange={e => handleSavePreferences({ bio: e.target.value })}
                placeholder="Write a brief introduction about your study journey..."
                style={{ marginTop: '0.35rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Preferred Language</label>
                <select
                  className="form-input"
                  value={prefs.preferred_language || 'ur'}
                  onChange={(e) => handleSavePreferences({ preferred_language: e.target.value })}
                  style={{ marginTop: '0.35rem' }}
                >
                  <option value="br">Brahui (براہوئی)</option>
                  <option value="ur">Urdu (اردو)</option>
                  <option value="en">English</option>
                  <option value="ar">Arabic (عربي)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Preferred Qari Reciter</label>
                <select
                  className="form-input"
                  value={prefs.preferred_qari || 'ar.alafasy'}
                  onChange={(e) => handleSavePreferences({ preferred_qari: e.target.value })}
                  style={{ marginTop: '0.35rem' }}
                >
                  <option value="ar.alafasy">Mishary Rashid Alafasy</option>
                  <option value="ar.sudais">Sheikh Abdul Rahman Al-Sudais</option>
                  <option value="ar.ghamdi">Saad Al-Ghamdi</option>
                  <option value="ar.mahermuaiqly">Sheikh Maher Al-Muaiqly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Notification Settings */}
          <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <i className="fas fa-sliders-h" style={{ color: 'var(--accent-gold)' }}></i> Notification & Privacy Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={prefs.notif_new_content !== false}
                  onChange={e => handleSavePreferences({ notif_new_content: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-emerald)' }}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Receive notifications for new books and Islamic media uploads</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={prefs.notif_system_announcements !== false}
                  onChange={e => handleSavePreferences({ notif_system_announcements: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-emerald)' }}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Receive system announcements and platform updates</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={prefs.privacy_show_activity !== false}
                  onChange={e => handleSavePreferences({ privacy_show_activity: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-emerald)' }}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Maintain reading history and progress tracking logs (highly recommended)</span>
              </label>
            </div>
          </div>

          {/* Account Security (Change Password) */}
          <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <i className="fas fa-shield-alt" style={{ color: 'var(--accent-gold)' }}></i> Account Security
            </h3>

            {securityMessage && (
              <div style={{ padding: '0.75rem 1rem', background: securityMessage.type === 'success' ? '#dcfce7' : '#fee2e2', color: securityMessage.type === 'success' ? '#15803d' : '#b91c1c', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>
                {securityMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Old Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={passwordOld}
                  onChange={e => setPasswordOld(e.target.value)}
                  style={{ marginTop: '0.3rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>New Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={passwordNew}
                    onChange={e => setPasswordNew(e.target.value)}
                    style={{ marginTop: '0.3rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    style={{ marginTop: '0.3rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ background: 'var(--primary-dark)', color: 'var(--accent-gold)', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '10px', fontWeight: 800, alignSelf: 'flex-start', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.88rem' }}
              >
                Change Password
              </button>
            </form>
          </div>

          {/* 📥 Data Portability & Offline Backup */}
          <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <i className="fas fa-cloud-download-alt" style={{ color: 'var(--accent-gold)' }}></i> Data Portability & Offline Backup
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Own your learning journey! Download a full offline backup of all your Quran bookmarks, reflection journal notes, reading history, prayer streak, and custom study collections in JSON format.
            </p>
            <button
              type="button"
              onClick={handleExportData}
              style={{
                background: 'linear-gradient(135deg, var(--primary-emerald) 0%, var(--primary-dark) 100%)',
                color: '#fff',
                border: '1.5px solid var(--accent-gold)',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
            >
              <i className="fas fa-file-download" style={{ color: 'var(--accent-gold)' }}></i> Download Islamic Study Backup (JSON)
            </button>
          </div>

          {/* 💻 Active Sessions & Connected Devices */}
          <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <i className="fas fa-laptop-house" style={{ color: 'var(--accent-gold)' }}></i> Active Sessions & Security
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Review your currently active login sessions across devices.
            </p>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <i className="fas fa-desktop"></i>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--primary-dark)' }}>{getClientDeviceInfo().os} &bull; {getClientDeviceInfo().browser}</strong>
                    <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span> Active Now
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Maktaba Secure Session &bull; Contabo VPS TLS Encrypted</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Do you want to log out from all devices?")) {
                    fetch(getApiUrl('/api/auth/logout/'), { method: 'POST' }).then(() => window.location.reload());
                  }
                }}
                style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Log Out All Other Devices
              </button>
            </div>
          </div>

          {/* ⚠️ Danger Zone */}
          <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '20px', border: '1.5px solid #fca5a5' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <i className="fas fa-exclamation-triangle"></i> Danger Zone
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Permanently erase your account, study history, bookmarks, and reflections journal. Once confirmed, this data cannot be recovered.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              style={{
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '0.65rem 1.4rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(220,38,38,0.2)'
              }}
            >
              <i className="fas fa-trash-alt"></i> Delete My Account & Wipe Data
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 📁 ADD TO COLLECTION MODAL DIALOG */}
      {/* ========================================================================= */}
      {showAddToCollectionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#09090b', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '20px', maxWidth: '450px', width: '100%', padding: '1.5rem', color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#f59e0b', fontSize: '1.25rem', fontWeight: 700 }}>
              📁 Add to Collection Folder
            </h3>
            
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.25rem' }}>
              Select which private folder to add <strong>"{showAddToCollectionModal.title}"</strong> to:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {(!dashboardData.personal_collections || dashboardData.personal_collections.length === 0) ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '1rem 0' }}>No folders created yet. Please create a folder first.</p>
              ) : (
                dashboardData.personal_collections.map((coll) => (
                  <button
                    key={coll.id}
                    onClick={() => handleAddItemToCollection(coll.id)}
                    style={{ padding: '0.75rem 1rem', background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', textAlign: 'left', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span>Folder: {coll.name}</span>
                    <i className="fas fa-chevron-right" style={{ color: 'var(--accent-gold)', fontSize: '0.8rem' }}></i>
                  </button>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddToCollectionModal(null)}
                style={{ padding: '0.55rem 1.25rem', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📖 KHATM-UL-QURAN 114 SURAHS CHECKLIST MODAL */}
      {/* ========================================================================= */}
      {showKhatmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#09090b', border: '1.5px solid var(--accent-gold)', borderRadius: '24px', maxWidth: '720px', width: '100%', maxHeight: '88vh', display: 'flex', flexDirection: 'column', color: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.85)', overflow: 'hidden' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(2,44,34,0.8) 0%, rgba(9,9,11,0.95) 100%)' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-quran"></i> 114 Surahs Completion Checklist
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#a1a1aa' }}>
                  Completed: <strong style={{ color: 'var(--accent-gold)' }}>{completedSurahsCount} / 114 Surahs</strong> ({khatmPercent}%)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowKhatmModal(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Controls: Search & Select All/Reset */}
            <div style={{ padding: '1rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', background: '#121214' }}>
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a', fontSize: '0.8rem' }}></i>
                <input
                  type="text"
                  placeholder="Search Surah by name or number (e.g. Baqarah, Yasin, 36)..."
                  value={khatmSurahSearch}
                  onChange={e => setKhatmSurahSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#18181b',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    padding: '0.5rem 0.8rem 0.5rem 2rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    const allNumbers = Array.from({ length: 114 }, (_, i) => i + 1);
                    setDashboardData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, completed_surahs: allNumbers, khatm_percent: 100 }
                    }));
                    fetch(getApiUrl('/api/user/preferences/update/'), {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ completed_surahs: allNumbers })
                    });
                  }}
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Mark All 114
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Do you want to reset your Surah completion checklist?")) {
                      setDashboardData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, completed_surahs: [], khatm_percent: 0 }
                      }));
                      fetch(getApiUrl('/api/user/preferences/update/'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ completed_surahs: [] })
                      });
                    }
                  }}
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Surahs Scrollable Grid */}
            <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto', flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: '0.75rem' }}>
              {ALL_114_SURAHS
                .filter(s => {
                  if (!khatmSurahSearch.trim()) return true;
                  const q = khatmSurahSearch.toLowerCase().trim();
                  return s.name.toLowerCase().includes(q) || s.englishName.toLowerCase().includes(q) || s.arabic.includes(q) || s.number.toString() === q;
                })
                .map(s => {
                  const isDone = (prefs.completed_surahs || []).includes(s.number);
                  return (
                    <label
                      key={s.number}
                      style={{
                        padding: '0.65rem 0.85rem',
                        background: isDone ? 'rgba(16,185,129,0.12)' : '#18181b',
                        border: isDone ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => handleToggleSurahCompleted(s.number)}
                          style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: isDone ? '#34d399' : '#fff', display: 'block' }}>
                            {s.number}. {s.name}
                          </strong>
                          <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>{s.ayahs} Verses &bull; {s.type}</span>
                        </div>
                      </div>

                      <span style={{ fontFamily: "'Amiri', serif", fontSize: '1.05rem', color: isDone ? 'var(--accent-gold)' : '#a1a1aa', direction: 'rtl' }}>
                        {s.arabic}
                      </span>
                    </label>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#121214' }}>
              <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                All changes are automatically saved to your cloud profile.
              </span>
              <button
                type="button"
                onClick={() => setShowKhatmModal(false)}
                style={{ padding: '0.55rem 1.4rem', background: 'var(--accent-gold)', color: '#022c22', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚠️ DELETE ACCOUNT DANGER ZONE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#09090b', border: '2px solid #ef4444', borderRadius: '24px', maxWidth: '460px', width: '100%', padding: '2rem', color: '#fff', boxShadow: '0 25px 60px rgba(239,68,68,0.25)' }}>
            
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>

            <h3 style={{ margin: '0 0 0.5rem 0', color: '#ef4444', fontSize: '1.3rem', fontWeight: 900 }}>
              Permanently Delete Account?
            </h3>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              This will permanently delete your Maktaba account <strong>({user?.username})</strong>, all bookmarks, tadabbur reflection notes, reading history, and study collections.
              <strong> This action is irreversible.</strong>
            </p>

            {deleteError && (
              <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5', fontSize: '0.82rem', marginBottom: '1rem', fontWeight: 600 }}>
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e4e4e7', display: 'block', marginBottom: '0.35rem' }}>
                  Enter Your Password to Confirm:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Your current password"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#18181b',
                    border: '1.5px solid rgba(239,68,68,0.4)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }}
                  style={{ padding: '0.65rem 1.25rem', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={deleteLoading}
                  style={{ padding: '0.65rem 1.4rem', background: '#dc2626', color: '#fff', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {deleteLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash-alt"></i>}
                  {deleteLoading ? 'Deleting...' : 'Confirm Deletion'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
