import React, { useState, useEffect } from 'react';
import { getAdminCustomFolders, saveCustomFolder, addAdminItem } from '../utils/adminContentStore';
import { getApiUrl } from '../utils/apiCache';

export default function AdminUploadModal({ onClose, onSuccess }) {
  const [folders, setFolders] = useState(() => getAdminCustomFolders());
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [contentType, setContentType] = useState('book'); // 'book' | 'audio' | 'hadith' | 'tafseer' | 'post' | 'button'
  const [destination, setDestination] = useState('books'); // folder id
  const [newFolderName, setNewFolderName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  // General Form Fields
  const [title, setTitle] = useState('');
  const [authorSpeaker, setAuthorSpeaker] = useState('');
  const [language, setLanguage] = useState('urdu'); // 'english' | 'urdu' | 'brahui' | 'arabic' | 'sindhi' | 'pashto' | 'balochi'
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [duration, setDuration] = useState('15:00');
  const [pagesCount, setPagesCount] = useState(100);
  const [docFormat, setDocFormat] = useState('pdf'); // 'pdf' | 'book' | 'doc' | 'ppt' | 'image'
  const [buttonLabel, setButtonLabel] = useState('Read / Open Link');
  const [buttonIcon, setButtonIcon] = useState('fas fa-external-link-alt');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);

  // Hadith Fields (Direct Text)
  const [hadithBookName, setHadithBookName] = useState('Sahih Bukhari');
  const [hadithNumber, setHadithNumber] = useState(1);
  const [hadithChapter, setHadithChapter] = useState('Book of Revelation');
  const [hadithArabicText, setHadithArabicText] = useState('');
  const [hadithTranslation, setHadithTranslation] = useState('');
  const [hadithNarratedBy, setHadithNarratedBy] = useState('Abu Hurairah (R.A)');
  const [hadithGrade, setHadithGrade] = useState('Sahih');

  // Tafseer Fields (Direct Text)
  const [tafseerSurahNumber, setTafseerSurahNumber] = useState(1);
  const [tafseerSurahName, setTafseerSurahName] = useState('Al-Fatihah');
  const [tafseerAyahNumber, setTafseerAyahNumber] = useState(1);
  const [tafseerArabicText, setTafseerArabicText] = useState('');
  const [tafseerTranslation, setTafseerTranslation] = useState('');
  const [tafseerText, setTafseerText] = useState('');
  const [tafseerScholarName, setTafseerScholarName] = useState('Ibn Kathir');

  // Article / Text Post Content
  const [postContent, setPostContent] = useState('');

  const defaultCategoriesList = [
    { id: 1, name: 'Tafseer & Quranic Studies' },
    { id: 2, name: 'Hadith & Sunnah' },
    { id: 3, name: 'Islamic Fiqh & Laws' },
    { id: 4, name: 'Seerah & Islamic History' },
    { id: 5, name: 'Duas, Azkar & Supplications' },
    { id: 6, name: 'Video Lectures & Reminders' },
    { id: 7, name: 'General Islamic E-Books' },
  ];

  // Fetch categories from Django API
  useEffect(() => {
    fetch(getApiUrl('/api/categories/'))
      .then(res => res.json())
      .then(data => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(defaultCategoriesList);
        }
      })
      .catch(() => setCategories(defaultCategoriesList));
  }, []);

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const newId = saveCustomFolder(newFolderName.trim());
    setFolders(getAdminCustomFolders());
    setDestination(newId);
    setNewFolderName('');
    alert(`New Custom Folder "${newFolderName}" Created Successfully!`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && contentType !== 'hadith' && contentType !== 'tafseer') {
      alert('Please enter a title');
      return;
    }

    setUploading(true);

    const activeFileType = contentType === 'book' ? docFormat : contentType;

    let finalFileUrl = fileUrl || linkUrl;
    let finalCoverUrl = coverUrl;

    if (selectedFile) {
      finalFileUrl = URL.createObjectURL(selectedFile);
    }
    if (selectedCoverFile) {
      finalCoverUrl = URL.createObjectURL(selectedCoverFile);
    }

    const itemTitle = title || (contentType === 'hadith' ? `${hadithBookName} #${hadithNumber}` : `${tafseerSurahName} (${tafseerSurahNumber}:${tafseerAyahNumber})`);

    const newItem = {
      title: itemTitle,
      author: authorSpeaker,
      speaker: authorSpeaker,
      pages_count: Number(pagesCount) || 1,
      file_type: activeFileType,
      destination,
      contentType,
      language,
      description,
      category_id: selectedCategory,
      fileUrl: finalFileUrl,
      pdf_url: contentType === 'book' ? finalFileUrl : undefined,
      audio_url: contentType === 'audio' ? finalFileUrl : undefined,
      link_url: linkUrl || finalFileUrl,
      cover_url: finalCoverUrl,
      duration,
      buttonLabel,
      buttonIcon,
      // Hadith specific fields
      hadithBookName,
      hadithNumber,
      hadithChapter,
      hadithArabicText,
      hadithTranslation,
      hadithNarratedBy,
      hadithGrade,
      // Tafseer specific fields
      tafseerSurahNumber,
      tafseerSurahName,
      tafseerAyahNumber,
      tafseerArabicText,
      tafseerTranslation,
      tafseerText,
      tafseerScholarName,
      // Article / Text content
      postContent,
      text_content: postContent || hadithTranslation || tafseerText || description,
      addedByAdmin: true,
      created_at: new Date().toISOString()
    };

    const formData = new FormData();
    formData.append('title', itemTitle);
    formData.append('author', authorSpeaker);
    formData.append('speaker', authorSpeaker);
    formData.append('pages_count', pagesCount);
    formData.append('file_type', activeFileType);
    formData.append('destination', destination);
    formData.append('language', language);
    formData.append('description', description);
    formData.append('content_type', contentType);
    formData.append('pdf_url', finalFileUrl);
    formData.append('cover_url', finalCoverUrl);
    formData.append('link_url', linkUrl || finalFileUrl);
    formData.append('text_content', postContent || hadithTranslation || tafseerText || description);

    if (selectedCategory) {
      formData.append('category_id', selectedCategory);
    }
    if (selectedFile) {
      formData.append('file', selectedFile);
      formData.append('pdf_file', selectedFile);
      formData.append('audio_file', selectedFile);
    }
    if (selectedCoverFile) {
      formData.append('cover_image', selectedCoverFile);
    }

    // Determine Backend API endpoint based on content type
    let apiEndpoint = '/api/books/';
    let jsonBody = null;

    if (contentType === 'audio') {
      apiEndpoint = '/api/taqreer/';
    } else if (contentType === 'hadith') {
      apiEndpoint = '/api/hadith/';
      jsonBody = JSON.stringify({
        book_name: hadithBookName,
        hadith_number: hadithNumber,
        chapter: hadithChapter,
        arabic_text: hadithArabicText,
        translation: hadithTranslation,
        narrated_by: hadithNarratedBy,
        grade: hadithGrade
      });
    } else if (contentType === 'tafseer') {
      apiEndpoint = '/api/tafseer/';
      jsonBody = JSON.stringify({
        surah_number: tafseerSurahNumber,
        surah_name: tafseerSurahName,
        ayah_number: tafseerAyahNumber,
        arabic_text: tafseerArabicText,
        translation: tafseerTranslation,
        tafseer_text: tafseerText,
        scholar_name: tafseerScholarName
      });
    }

    const fetchOptions = jsonBody ? {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonBody
    } : {
      method: 'POST',
      body: formData
    };

    fetch(getApiUrl(apiEndpoint), fetchOptions)
      .then(res => res.json())
      .then((data) => {
        if (data && (data.document_url || data.audio_url || data.id)) {
          addAdminItem({
            ...newItem,
            id: data.id || newItem.id,
            fileUrl: data.document_url || data.audio_url || newItem.fileUrl,
            pdf_url: data.document_url || newItem.pdf_url,
            audio_url: data.audio_url || newItem.audio_url
          });
        } else {
          addAdminItem(newItem);
        }
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
      })
      .catch(() => {
        addAdminItem(newItem);
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
      });

    setUploading(false);
    setSubmitted(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '720px', width: '100%', maxHeight: '92vh', overflowY: 'auto', background: '#022c22', border: '1.5px solid var(--accent-gold)', borderRadius: '20px', color: '#fff', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245,158,11,0.3)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/favicon.svg" alt="Maktaba tul Muslim Logo" style={{ width: '42px', height: '42px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.5)', flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-gold)' }}>Admin Content & Upload Studio</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Publish MP3 Audio, Hadith Text, Tafseer, Articles & Links</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <i className="fas fa-check-circle fa-4x" style={{ color: '#10b981', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 800 }}>Content Published Successfully!</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Added to <strong>{destination}</strong> library for all users.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* 1. Destination Category / Folder Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
                1. Select Destination Folder / Section
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{ flex: 1, padding: '0.75rem 1rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name} ({f.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Create Custom Folder Box */}
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="+ Create new Custom Folder Name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem 0.85rem', background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(245,158,11,0.5)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  style={{ padding: '0.5rem 1rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  + Add Folder
                </button>
              </div>
            </div>

            {/* 2. Content Type Selector Grid */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
                2. Select Content Type to Add
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setContentType('audio')}
                  style={{ padding: '0.65rem 0.3rem', borderRadius: '10px', border: contentType === 'audio' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'audio' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                >
                  <i className="fas fa-headphones fa-lg" style={{ color: '#10b981' }}></i>
                  <span>MP3 Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('book')}
                  style={{ padding: '0.65rem 0.3rem', borderRadius: '10px', border: contentType === 'book' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'book' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                >
                  <i className="fas fa-file-pdf fa-lg" style={{ color: '#ef4444' }}></i>
                  <span>Book/PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('hadith')}
                  style={{ padding: '0.65rem 0.3rem', borderRadius: '10px', border: contentType === 'hadith' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'hadith' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                >
                  <i className="fas fa-scroll fa-lg" style={{ color: '#6366f1' }}></i>
                  <span>Hadith Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('tafseer')}
                  style={{ padding: '0.65rem 0.3rem', borderRadius: '10px', border: contentType === 'tafseer' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'tafseer' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                >
                  <i className="fas fa-bookmark fa-lg" style={{ color: '#ec4899' }}></i>
                  <span>Tafseer Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('post')}
                  style={{ padding: '0.65rem 0.3rem', borderRadius: '10px', border: contentType === 'post' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'post' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                >
                  <i className="fas fa-file-alt fa-lg" style={{ color: '#f59e0b' }}></i>
                  <span>Article/Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('button')}
                  style={{ padding: '0.65rem 0.3rem', borderRadius: '10px', border: contentType === 'button' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'button' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                >
                  <i className="fas fa-link fa-lg" style={{ color: '#3b82f6' }}></i>
                  <span>Web Link</span>
                </button>
              </div>
            </div>

            {/* Title / Main Name Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {contentType === 'hadith' ? 'Hadith Title / Topic *' : contentType === 'tafseer' ? 'Tafseer Subject / Title *' : 'Title *'}
              </label>
              <input
                type="text"
                required={contentType !== 'hadith' && contentType !== 'tafseer'}
                placeholder={contentType === 'hadith' ? 'e.g. Actions are judged by intentions' : contentType === 'tafseer' ? 'e.g. Tafseer Surah Al-Kahf - The Cave' : 'e.g. Holy Quran Brahui Translation'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>

            {/* Contextual Fields depending on Content Type */}

            {/* --- SEPARATE SECTION 1: MP3 AUDIO --- */}
            {contentType === 'audio' && (
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-headphones"></i> MP3 Audio Upload & Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Speaker / Reciter / Qari</label>
                    <input
                      type="text"
                      placeholder="e.g. Maulana Muhammad Brahui"
                      value={authorSpeaker}
                      onChange={(e) => setAuthorSpeaker(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Duration (mm:ss)</label>
                    <input
                      type="text"
                      placeholder="15:30"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>📁 Choose MP3 File from Device</label>
                  <input
                    type="file"
                    accept=".mp3,.wav,.m4a,.aac"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    style={{ width: '100%', padding: '0.4rem', background: '#064e3b', borderRadius: '6px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>🌐 OR External Audio File URL (MP3/SoundCloud)</label>
                  <input
                    type="url"
                    placeholder="https://pub-xxxx.r2.dev/lecture.mp3 or https://..."
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>
            )}

            {/* --- SEPARATE SECTION 2: HADITH DIRECT TEXT --- */}
            {contentType === 'hadith' && (
              <div style={{ background: 'rgba(99,102,241,0.1)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-scroll"></i> Hadith Text & Book References
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Hadith Book</label>
                    <select
                      value={hadithBookName}
                      onChange={(e) => setHadithBookName(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    >
                      <option value="Sahih Bukhari">Sahih Bukhari</option>
                      <option value="Sahih Muslim">Sahih Muslim</option>
                      <option value="Sunan Abu Dawud">Sunan Abu Dawud</option>
                      <option value="Jami at-Tirmidhi">Jami at-Tirmidhi</option>
                      <option value="Sunan an-Nasa'i">Sunan an-Nasa'i</option>
                      <option value="Sunan Ibn Majah">Sunan Ibn Majah</option>
                      <option value="Muwatta Malik">Muwatta Malik</option>
                      <option value="Riyad as-Salihin">Riyad as-Salihin</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Hadith No.</label>
                    <input
                      type="number"
                      value={hadithNumber}
                      onChange={(e) => setHadithNumber(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Grade / Authenticity</label>
                    <select
                      value={hadithGrade}
                      onChange={(e) => setHadithGrade(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    >
                      <option value="Sahih">Sahih (صحيح)</option>
                      <option value="Hasan">Hasan (حسن)</option>
                      <option value="Muttafaq Alayh">Muttafaq Alayh (متفق عليه)</option>
                      <option value="Da'if">Da'if (ضعيف)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Arabic Text (الحديث الشريف)</label>
                  <textarea
                    rows="3"
                    dir="rtl"
                    placeholder="إنما الأعمال بالنيات وإنما لكل امرئ ما نوى..."
                    value={hadithArabicText}
                    onChange={(e) => setHadithArabicText(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontFamily: "'Traditional Arabic', 'Amiri', serif", fontSize: '1.15rem' }}
                  ></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Translation & Commentary Text</label>
                  <textarea
                    rows="4"
                    placeholder="Enter Hadith translation and benefits/notes..."
                    value={hadithTranslation}
                    onChange={(e) => setHadithTranslation(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                  ></textarea>
                </div>
              </div>
            )}

            {/* --- SEPARATE SECTION 3: TAFSEER DIRECT TEXT --- */}
            {contentType === 'tafseer' && (
              <div style={{ background: 'rgba(236,72,153,0.1)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(236,72,153,0.3)', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#f472b6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-bookmark"></i> Tafseer & Quranic Commentary
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Surah No.</label>
                    <input
                      type="number"
                      min="1" max="114"
                      value={tafseerSurahNumber}
                      onChange={(e) => setTafseerSurahNumber(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Surah Name</label>
                    <input
                      type="text"
                      value={tafseerSurahName}
                      onChange={(e) => setTafseerSurahName(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Ayah No.</label>
                    <input
                      type="number"
                      value={tafseerAyahNumber}
                      onChange={(e) => setTafseerAyahNumber(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Ayah Arabic Text</label>
                  <textarea
                    rows="2"
                    dir="rtl"
                    placeholder="الحمد لله رب العالمين..."
                    value={tafseerArabicText}
                    onChange={(e) => setTafseerArabicText(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontFamily: "'Amiri', serif", fontSize: '1.1rem' }}
                  ></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Tafseer & Explanation Content</label>
                  <textarea
                    rows="5"
                    placeholder="Enter detailed Tafseer explanation..."
                    value={tafseerText}
                    onChange={(e) => setTafseerText(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                  ></textarea>
                </div>
              </div>
            )}

            {/* --- SEPARATE SECTION 4: ARTICLE / TEXT POST --- */}
            {contentType === 'post' && (
              <div style={{ background: 'rgba(245,158,11,0.1)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-file-alt"></i> Article & Rich Text Content
                </h4>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Author / Writer</label>
                  <input
                    type="text"
                    placeholder="e.g. Maktaba tul Muslim Research Department"
                    value={authorSpeaker}
                    onChange={(e) => setAuthorSpeaker(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Article Full Text Content</label>
                  <textarea
                    rows="6"
                    placeholder="Write or paste your article text content here..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.95rem', lineHeight: '1.6' }}
                  ></textarea>
                </div>
              </div>
            )}

            {/* --- SEPARATE SECTION 5: EXTERNAL WEB LINK --- */}
            {contentType === 'button' && (
              <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(59,130,246,0.3)', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-link"></i> External Web Link & Button Configuration
                </h4>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>🌐 Target Web Link URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/pdf or https://archive.org/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Button Action Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Read Online / Download PDF"
                      value={buttonLabel}
                      onChange={(e) => setButtonLabel(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Button Icon</label>
                    <select
                      value={buttonIcon}
                      onChange={(e) => setButtonIcon(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    >
                      <option value="fas fa-external-link-alt">🔗 External Link</option>
                      <option value="fas fa-download">📥 Download File</option>
                      <option value="fas fa-book">📚 Read Book</option>
                      <option value="fas fa-headphones">🎧 Listen Audio</option>
                      <option value="fas fa-play-circle">▶️ Play Video</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* --- SEPARATE SECTION 6: BOOK / DOCUMENT UPLOAD --- */}
            {contentType === 'book' && (
              <div style={{ background: 'rgba(239,68,68,0.1)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-file-pdf"></i> Document / Book Format & File Options
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Author / Compiler</label>
                    <input
                      type="text"
                      placeholder="e.g. Allama Ibn Hajar"
                      value={authorSpeaker}
                      onChange={(e) => setAuthorSpeaker(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Pages Count</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="120"
                      value={pagesCount}
                      onChange={(e) => setPagesCount(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>📁 Choose File (PDF / Word .docx / PPT / Image)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.epub,.ppt,.pptx,.png,.jpg,.jpeg"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    style={{ width: '100%', padding: '0.4rem', background: '#064e3b', borderRadius: '6px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>🌐 OR External Document File URL</label>
                  <input
                    type="url"
                    placeholder="https://pub-xxxx.r2.dev/book.pdf"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>
            )}

            {/* Language & Category Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                >
                  <option value="brahui">📜 Brahui / Brohi (براہوئی)</option>
                  <option value="urdu">🇵🇰 Urdu (اردو)</option>
                  <option value="english">🇬🇧 English</option>
                  <option value="arabic">🇸🇦 Arabic (عربي)</option>
                  <option value="sindhi">🇵🇰 Sindhi (سنڌي)</option>
                  <option value="pashto">🇵🇰 Pashto (پښتو)</option>
                  <option value="balochi">🇵🇰 Balochi (بلوچی)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Category (Database)</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cover Image Upload Option */}
            <div style={{ background: 'rgba(245,158,11,0.08)', padding: '1rem', borderRadius: '12px', border: '1px dashed rgba(245,158,11,0.3)', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
                🖼 Cover Image / Card Thumbnail (Optional)
              </label>

              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.25rem' }}>📸 Upload Cover File (.jpg, .png)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedCoverFile(e.target.files[0])}
                  style={{ width: '100%', padding: '0.4rem', background: '#064e3b', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.25rem' }}>🌐 OR External Cover Image URL</span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            {/* General Description / Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Summary Notes / Description</label>
              <textarea
                rows="2"
                placeholder="Enter summary or notes for this item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', color: '#022c22', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-upload-alt"></i>}
                <span>{uploading ? 'Publishing...' : 'Publish Content'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
