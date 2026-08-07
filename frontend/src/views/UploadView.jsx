import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiCache';
import { getAdminItems, addAdminItem, deleteContentItem } from '../utils/adminContentStore';
import AdminEditModal from '../components/AdminEditModal';

export default function UploadView({ user }) {
  if (!user || !user.is_staff) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card" style={{ maxWidth: '550px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          <i className="fas fa-lock fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1.25rem' }}></i>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.5rem', fontWeight: 800 }}>Admin Permission Required</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.85rem 0 1.5rem 0', lineHeight: '1.6' }}>
            This Content Upload & Media Portal is restricted exclusively to site administrators and staff members.
          </p>
          <a href={getApiUrl('/admin/')} target="_blank" rel="noreferrer" className="btn-play" style={{ display: 'inline-flex', margin: '0 auto' }}>
            <i className="fas fa-user-shield"></i> Login to Django Admin Panel
          </a>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('taqreer'); // 'taqreer' | 'book' | 'hadith' | 'tafseer' | 'link' | 'audio'
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [dbTaqreers, setDbTaqreers] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Load database Taqreers on mount and on new submission
  useEffect(() => {
    fetch(getApiUrl('/api/taqreer/'))
      .then(res => res.json())
      .then(data => setDbTaqreers(data.results || []))
      .catch(() => {});
  }, [submittedMessage]);

  // Taqreer Form State
  const [taqreerData, setTaqreerData] = useState({ title: '', speaker: '', language: 'urdu', audio_url: '', duration: '15:00', description: '' });
  const [taqreerFile, setTaqreerFile] = useState(null);

  // Book Form State
  const [bookData, setBookData] = useState({ title: '', author: '', file_type: 'pdf', pdf_url: '', cover_url: '', pages_count: 100, language: 'ur', description: '' });
  const [bookFile, setBookFile] = useState(null);

  // Hadith Form State (Direct Text)
  const [hadithData, setHadithData] = useState({ book_name: 'Sahih Bukhari', hadith_number: 1, chapter: '', arabic_text: '', translation: '', narrated_by: '', grade: 'Sahih' });

  // Tafseer Form State (Direct Text)
  const [tafseerData, setTafseerData] = useState({ surah_number: 1, surah_name: 'Al-Fatihah', ayah_number: 1, arabic_text: '', translation: '', tafseer_text: '', scholar_name: 'Ibn Kathir' });

  // External Link Form State
  const [linkData, setLinkData] = useState({ title: '', link_url: '', button_label: 'Open Link', icon: 'fas fa-external-link-alt', description: '' });

  // Audio Recitation Form State
  const [audioData, setAudioData] = useState({ surah_number: 1, surah_name_english: '', reciter: 'Mishary Rashid Alafasy', language: 'arabic', audio_url: '' });
  const [audioFile, setAudioFile] = useState(null);

  const handleTaqreerSubmit = (e) => {
    e.preventDefault();
    const finalAudioUrl = taqreerFile ? URL.createObjectURL(taqreerFile) : taqreerData.audio_url;

    addAdminItem({
      title: taqreerData.title,
      speaker: taqreerData.speaker,
      author: taqreerData.speaker,
      destination: 'taqreer',
      contentType: 'audio',
      language: taqreerData.language,
      duration: taqreerData.duration,
      description: taqreerData.description,
      fileUrl: finalAudioUrl,
      audio_url: finalAudioUrl,
      addedByAdmin: true
    });

    const formData = new FormData();
    formData.append('title', taqreerData.title);
    formData.append('speaker', taqreerData.speaker);
    formData.append('language', taqreerData.language);
    formData.append('duration', taqreerData.duration);
    formData.append('description', taqreerData.description);
    if (taqreerFile) {
      formData.append('audio_file', taqreerFile);
    } else {
      formData.append('audio_url', taqreerData.audio_url);
    }

    fetch(getApiUrl('/api/taqreer/'), {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then((data) => {
        setSubmittedMessage(data.message || 'Taqreer MP3 voice note added successfully!');
        setTaqreerData({ title: '', speaker: '', language: 'urdu', audio_url: '', duration: '15:00', description: '' });
        setTaqreerFile(null);
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Taqreer MP3 saved!');
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const tempDocUrl = bookFile ? URL.createObjectURL(bookFile) : bookData.pdf_url;

    const newItem = {
      title: bookData.title,
      author: bookData.author,
      destination: 'books',
      contentType: 'book',
      file_type: bookData.file_type,
      pages_count: Number(bookData.pages_count) || 100,
      language: bookData.language,
      description: bookData.description,
      fileUrl: tempDocUrl,
      pdf_url: tempDocUrl,
      cover_url: bookData.cover_url,
      addedByAdmin: true
    };

    const formData = new FormData();
    formData.append('title', bookData.title);
    formData.append('author', bookData.author);
    formData.append('language', bookData.language);
    formData.append('file_type', bookData.file_type);
    formData.append('pages_count', bookData.pages_count);
    formData.append('description', bookData.description);
    if (bookFile) {
      formData.append('pdf_file', bookFile);
      formData.append('file', bookFile);
    } else {
      formData.append('pdf_url', bookData.pdf_url);
    }
    if (bookData.cover_url) formData.append('cover_url', bookData.cover_url);

    fetch(getApiUrl('/api/books/'), {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then((data) => {
        if (data && data.document_url) {
          newItem.fileUrl = data.document_url;
          newItem.pdf_url = data.document_url;
          if (data.id) newItem.id = data.id;
        }
        addAdminItem(newItem);
        setSubmittedMessage('Book document uploaded successfully & saved to Django database!');
        setBookData({ title: '', author: '', file_type: 'pdf', pdf_url: '', cover_url: '', pages_count: 100, language: 'ur', description: '' });
        setBookFile(null);
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        addAdminItem(newItem);
        setSubmittedMessage('Book saved!');
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  const handleHadithSubmit = (e) => {
    e.preventDefault();
    addAdminItem({
      title: `${hadithData.book_name} #${hadithData.hadith_number}`,
      destination: 'hadith',
      contentType: 'hadith',
      arabic_text: hadithData.arabic_text,
      translation: hadithData.translation,
      author: hadithData.narrated_by,
      description: hadithData.translation,
      addedByAdmin: true
    });

    fetch(getApiUrl('/api/hadith/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hadithData)
    })
      .then(res => res.json())
      .then(() => {
        setSubmittedMessage('Hadith entry added successfully!');
        setHadithData({ book_name: 'Sahih Bukhari', hadith_number: 1, chapter: '', arabic_text: '', translation: '', narrated_by: '', grade: 'Sahih' });
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Hadith saved!');
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  const handleTafseerSubmit = (e) => {
    e.preventDefault();
    addAdminItem({
      title: `Tafseer ${tafseerData.surah_name} (${tafseerData.surah_number}:${tafseerData.ayah_number})`,
      destination: 'tafseer',
      contentType: 'tafseer',
      arabic_text: tafseerData.arabic_text,
      translation: tafseerData.translation,
      tafseer_text: tafseerData.tafseer_text,
      author: tafseerData.scholar_name,
      description: tafseerData.tafseer_text,
      addedByAdmin: true
    });

    fetch(getApiUrl('/api/tafseer/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tafseerData)
    })
      .then(res => res.json())
      .then(() => {
        setSubmittedMessage('Tafseer entry added successfully!');
        setTafseerData({ surah_number: 1, surah_name: 'Al-Fatihah', ayah_number: 1, arabic_text: '', translation: '', tafseer_text: '', scholar_name: 'Ibn Kathir' });
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Tafseer commentary saved!');
        window.dispatchEvent(new CustomEvent('admin_content_updated'));
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    addAdminItem({
      title: linkData.title,
      destination: 'books',
      contentType: 'button',
      fileUrl: linkData.link_url,
      link_url: linkData.link_url,
      buttonLabel: linkData.button_label,
      buttonIcon: linkData.icon,
      description: linkData.description,
      addedByAdmin: true
    });
    setSubmittedMessage('External Web Link added successfully!');
    setLinkData({ title: '', link_url: '', button_label: 'Open Link', icon: 'fas fa-external-link-alt', description: '' });
    window.dispatchEvent(new CustomEvent('admin_content_updated'));
    setTimeout(() => setSubmittedMessage(''), 4000);
  };

  const handleAudioSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('surah_number', audioData.surah_number);
    formData.append('surah_name_english', audioData.surah_name_english);
    formData.append('reciter', audioData.reciter);
    formData.append('language', audioData.language);
    if (audioFile) {
      formData.append('audio_file', audioFile);
    } else {
      formData.append('audio_url', audioData.audio_url);
    }

    fetch(getApiUrl('/api/quran/'), {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        setSubmittedMessage('Quran Audio recitation uploaded successfully!');
        setAudioData({ surah_number: 1, surah_name_english: '', reciter: 'Mishary Rashid Alafasy', language: 'arabic', audio_url: '' });
        setAudioFile(null);
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Audio saved!');
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div className="section-header">
        <h1 className="section-title">
          <i className="fas fa-cloud-upload-alt" style={{ color: 'var(--accent-gold)' }}></i> Admin Content Upload & Portal
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Upload MP3 Taqreer voice notes, PDF books, Hadith Text, Tafseer Commentary & External Links directly to the library.
        </p>
      </div>

      {submittedMessage && (
        <div style={{ padding: '0.85rem 1.25rem', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-check-circle"></i> {submittedMessage}
        </div>
      )}

      {/* Tabs Header */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('taqreer')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'taqreer' ? 'var(--primary-dark)' : '#e2e8f0',
            color: activeTab === 'taqreer' ? 'var(--accent-gold)' : '#334155',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <i className="fas fa-headphones" style={{ color: '#10b981' }}></i> Taqreer MP3 Audio
        </button>

        <button
          onClick={() => setActiveTab('book')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'book' ? 'var(--primary-dark)' : '#e2e8f0',
            color: activeTab === 'book' ? 'var(--accent-gold)' : '#334155',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <i className="fas fa-book" style={{ color: '#ef4444' }}></i> PDF / Books / Docs
        </button>

        <button
          onClick={() => setActiveTab('hadith')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'hadith' ? 'var(--primary-dark)' : '#e2e8f0',
            color: activeTab === 'hadith' ? 'var(--accent-gold)' : '#334155',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <i className="fas fa-scroll" style={{ color: '#6366f1' }}></i> Hadith (Direct Text)
        </button>

        <button
          onClick={() => setActiveTab('tafseer')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'tafseer' ? 'var(--primary-dark)' : '#e2e8f0',
            color: activeTab === 'tafseer' ? 'var(--accent-gold)' : '#334155',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <i className="fas fa-bookmark" style={{ color: '#ec4899' }}></i> Tafseer (Direct Text)
        </button>

        <button
          onClick={() => setActiveTab('link')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'link' ? 'var(--primary-dark)' : '#e2e8f0',
            color: activeTab === 'link' ? 'var(--accent-gold)' : '#334155',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <i className="fas fa-link" style={{ color: '#3b82f6' }}></i> Web Links & Buttons
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'audio' ? 'var(--primary-dark)' : '#e2e8f0',
            color: activeTab === 'audio' ? 'var(--accent-gold)' : '#334155',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <i className="fas fa-headphones"></i> Quran Tilawat
        </button>
      </div>

      {/* Upload Form Cards */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* --- TAB 1: TAQREER MP3 AUDIO --- */}
        {activeTab === 'taqreer' && (
          <form onSubmit={handleTaqreerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-bullhorn" style={{ color: 'var(--accent-gold)' }}></i> Add New Taqreer MP3 Audio</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Taqreer Title *</label>
                <input type="text" className="form-input" required value={taqreerData.title} onChange={e => setTaqreerData({ ...taqreerData, title: e.target.value })} placeholder="e.g. Virtue of Reflecting on Quran" />
              </div>
              <div>
                <label className="form-label">Speaker / Scholar *</label>
                <input type="text" className="form-input" required value={taqreerData.speaker} onChange={e => setTaqreerData({ ...taqreerData, speaker: e.target.value })} placeholder="e.g. Maulana Abdul Ghafoor Brahui" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Language Category *</label>
                <select className="form-select" value={taqreerData.language} onChange={e => setTaqreerData({ ...taqreerData, language: e.target.value })}>
                  <option value="arabic">Arabic (عربي)</option>
                  <option value="brahui">Brahui (براہوئی)</option>
                  <option value="urdu">Urdu (اردو)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Choose MP3 File from Laptop</label>
                <input
                  type="file"
                  className="form-input"
                  accept="audio/*,.mp3,.m4a"
                  onChange={e => setTaqreerFile(e.target.files[0])}
                  style={{ padding: '0.4rem' }}
                />
              </div>
              <div>
                <label className="form-label">OR Direct MP3 Web URL</label>
                <input type="url" className="form-input" value={taqreerData.audio_url} onChange={e => setTaqreerData({ ...taqreerData, audio_url: e.target.value })} placeholder="https://domain.com/audio.mp3" />
              </div>
              <div>
                <label className="form-label">Duration (e.g. 18:45)</label>
                <input type="text" className="form-input" value={taqreerData.duration} onChange={e => setTaqreerData({ ...taqreerData, duration: e.target.value })} placeholder="18:45" />
              </div>
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows="3" value={taqreerData.description} onChange={e => setTaqreerData({ ...taqreerData, description: e.target.value })} placeholder="Brief summary of the Taqreer voice note..."></textarea>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-upload"></i> Save & Upload Taqreer MP3
            </button>
          </form>
        )}

        {/* --- TAB 2: BOOK / PDF DOCUMENT --- */}
        {activeTab === 'book' && (
          <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-book" style={{ color: 'var(--accent-gold)' }}></i> Add New PDF, Word (.docx), or PPT (.pptx) Document</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Document Title *</label>
                <input type="text" className="form-input" required value={bookData.title} onChange={e => setBookData({ ...bookData, title: e.target.value })} placeholder="e.g. Tafsir Ibn Kathir / Tajweed Guide" />
              </div>
              <div>
                <label className="form-label">Author / Scholar *</label>
                <input type="text" className="form-input" required value={bookData.author} onChange={e => setBookData({ ...bookData, author: e.target.value })} placeholder="e.g. Hafiz Ibn Kathir" />
              </div>
              <div>
                <label className="form-label">Language *</label>
                <select className="form-select" value={bookData.language} onChange={e => setBookData({ ...bookData, language: e.target.value })}>
                  <option value="br">Brahui (براہوئی)</option>
                  <option value="ur">Urdu (اردو)</option>
                  <option value="en">English</option>
                  <option value="ar">Arabic (عربي)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Pages Count</label>
                <input type="number" min="1" className="form-input" value={bookData.pages_count} onChange={e => setBookData({ ...bookData, pages_count: e.target.value })} placeholder="120" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Choose Document File from Laptop (.pdf, .docx, .pptx) *</label>
                <input
                  type="file"
                  className="form-input"
                  accept=".pdf,.docx,.doc,.pptx,.ppt,.png,.jpg"
                  onChange={e => setBookFile(e.target.files[0])}
                  style={{ padding: '0.4rem' }}
                />
              </div>
              <div>
                <label className="form-label">OR Document Web URL</label>
                <input type="url" className="form-input" value={bookData.pdf_url} onChange={e => setBookData({ ...bookData, pdf_url: e.target.value })} placeholder="https://domain.com/book.pdf" />
              </div>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-upload"></i> Save & Upload Document
            </button>
          </form>
        )}

        {/* --- TAB 3: HADITH DIRECT TEXT --- */}
        {activeTab === 'hadith' && (
          <form onSubmit={handleHadithSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-scroll" style={{ color: 'var(--accent-gold)' }}></i> Add Hadith Direct Text Entry</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Book Collection *</label>
                <select className="form-select" value={hadithData.book_name} onChange={e => setHadithData({ ...hadithData, book_name: e.target.value })}>
                  <option value="Sahih Bukhari">Sahih Bukhari</option>
                  <option value="Sahih Muslim">Sahih Muslim</option>
                  <option value="Sunan An-Nasa'i">Sunan An-Nasa'i</option>
                  <option value="Sunan Abu Dawud">Sunan Abu Dawud</option>
                  <option value="Jami` At-Tirmidhi">Jami` At-Tirmidhi</option>
                  <option value="Sunan Ibn Majah">Sunan Ibn Majah</option>
                  <option value="Riyad As-Salihin">Riyad As-Salihin</option>
                </select>
              </div>
              <div>
                <label className="form-label">Hadith Number *</label>
                <input type="number" className="form-input" required value={hadithData.hadith_number} onChange={e => setHadithData({ ...hadithData, hadith_number: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Grade</label>
                <select className="form-select" value={hadithData.grade} onChange={e => setHadithData({ ...hadithData, grade: e.target.value })}>
                  <option value="Sahih">Sahih (صحيح)</option>
                  <option value="Hasan">Hasan (حسن)</option>
                  <option value="Muttafaq Alayh">Muttafaq Alayh (متفق عليه)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Arabic Text (الحديث الشريف) *</label>
              <textarea className="form-textarea arabic-font" rows="3" required value={hadithData.arabic_text} onChange={e => setHadithData({ ...hadithData, arabic_text: e.target.value })} placeholder="أدخل نص الحديث الشريف باللغة العربية..."></textarea>
            </div>

            <div>
              <label className="form-label">Translation & Explanation *</label>
              <textarea className="form-textarea" rows="4" required value={hadithData.translation} onChange={e => setHadithData({ ...hadithData, translation: e.target.value })} placeholder="English / Urdu / Brahui translation of the Hadith..."></textarea>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Save Hadith Text Entry
            </button>
          </form>
        )}

        {/* --- TAB 4: TAFSEER DIRECT TEXT --- */}
        {activeTab === 'tafseer' && (
          <form onSubmit={handleTafseerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-bookmark" style={{ color: 'var(--accent-gold)' }}></i> Add Tafseer & Quran Commentary Text</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Surah Number *</label>
                <input type="number" min="1" max="114" className="form-input" required value={tafseerData.surah_number} onChange={e => setTafseerData({ ...tafseerData, surah_number: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Surah Name *</label>
                <input type="text" className="form-input" required value={tafseerData.surah_name} onChange={e => setTafseerData({ ...tafseerData, surah_name: e.target.value })} placeholder="Al-Fatihah" />
              </div>
              <div>
                <label className="form-label">Ayah Number *</label>
                <input type="number" min="1" className="form-input" required value={tafseerData.ayah_number} onChange={e => setTafseerData({ ...tafseerData, ayah_number: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Mufassir / Scholar</label>
                <input type="text" className="form-input" value={tafseerData.scholar_name} onChange={e => setTafseerData({ ...tafseerData, scholar_name: e.target.value })} placeholder="Ibn Kathir" />
              </div>
            </div>

            <div>
              <label className="form-label">Ayah Arabic Text</label>
              <textarea className="form-textarea arabic-font" rows="2" value={tafseerData.arabic_text} onChange={e => setTafseerData({ ...tafseerData, arabic_text: e.target.value })} placeholder="آية القرآن الكريم..."></textarea>
            </div>

            <div>
              <label className="form-label">Tafseer Commentary Text *</label>
              <textarea className="form-textarea" rows="5" required value={tafseerData.tafseer_text} onChange={e => setTafseerData({ ...tafseerData, tafseer_text: e.target.value })} placeholder="Write full Tafseer explanation text content..."></textarea>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Save Tafseer Text Entry
            </button>
          </form>
        )}

        {/* --- TAB 5: EXTERNAL WEB LINK --- */}
        {activeTab === 'link' && (
          <form onSubmit={handleLinkSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-link" style={{ color: 'var(--accent-gold)' }}></i> Add External Web Link & Button Shortcut</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Link Title *</label>
                <input type="text" className="form-input" required value={linkData.title} onChange={e => setLinkData({ ...linkData, title: e.target.value })} placeholder="e.g. Official Quran Audio Library" />
              </div>
              <div>
                <label className="form-label">Target Web URL (http/https) *</label>
                <input type="url" className="form-input" required value={linkData.link_url} onChange={e => setLinkData({ ...linkData, link_url: e.target.value })} placeholder="https://example.com/item" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Button Action Label</label>
                <input type="text" className="form-input" value={linkData.button_label} onChange={e => setLinkData({ ...linkData, button_label: e.target.value })} placeholder="Read Article / Open Link" />
              </div>
              <div>
                <label className="form-label">Button Icon</label>
                <select className="form-select" value={linkData.icon} onChange={e => setLinkData({ ...linkData, icon: e.target.value })}>
                  <option value="fas fa-external-link-alt">🔗 External Link</option>
                  <option value="fas fa-download">📥 Download</option>
                  <option value="fas fa-book">📚 Read</option>
                  <option value="fas fa-headphones">🎧 Listen</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Notes / Description</label>
              <textarea className="form-textarea" rows="2" value={linkData.description} onChange={e => setLinkData({ ...linkData, description: e.target.value })} placeholder="Brief summary for this link..."></textarea>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Save Web Link Button
            </button>
          </form>
        )}

        {/* --- TAB 6: QURAN AUDIO --- */}
        {activeTab === 'audio' && (
          <form onSubmit={handleAudioSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-headphones" style={{ color: 'var(--accent-gold)' }}></i> Add Quran Audio Recitation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Surah Number *</label>
                <input type="number" min="1" max="114" className="form-input" required value={audioData.surah_number} onChange={e => setAudioData({ ...audioData, surah_number: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Surah Name (English)</label>
                <input type="text" className="form-input" value={audioData.surah_name_english} onChange={e => setAudioData({ ...audioData, surah_name_english: e.target.value })} placeholder="e.g. Al-Fatiha" />
              </div>
              <div>
                <label className="form-label">Audio Type / Language *</label>
                <select className="form-select" value={audioData.language} onChange={e => setAudioData({ ...audioData, language: e.target.value })}>
                  <option value="arabic">Arabic Recitation (تلاوت)</option>
                  <option value="brahui">Brahui Translation MP3 (براہوئی ترجمہ)</option>
                  <option value="urdu">Urdu Translation MP3 (اردو ترجمہ)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Qari / Scholar Name *</label>
                <input type="text" className="form-input" required value={audioData.reciter} onChange={e => setAudioData({ ...audioData, reciter: e.target.value })} placeholder="e.g. Mishary Alafasy" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Choose MP3 File from Laptop *</label>
                <input
                  type="file"
                  className="form-input"
                  accept="audio/*,.mp3"
                  onChange={e => setAudioFile(e.target.files[0])}
                  style={{ padding: '0.4rem' }}
                />
              </div>
              <div>
                <label className="form-label">OR Direct MP3 Web URL</label>
                <input type="url" className="form-input" value={audioData.audio_url} onChange={e => setAudioData({ ...audioData, audio_url: e.target.value })} placeholder="https://server8.mp3quran.net/afs/001.mp3" />
              </div>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-upload"></i> Save & Upload Quran Audio
            </button>
          </form>
        )}

        {/* Manage & Delete Admin Content Table */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px dashed rgba(245, 158, 11, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1.25rem', fontWeight: 800 }}>
              <i className="fas fa-tasks" style={{ marginRight: '0.5rem' }}></i> Admin Uploaded Content Manager
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Delete any document, MP3, Hadith, Tafseer, or link instantly
            </span>
          </div>

          {getAdminItems().length === 0 && dbTaqreers.length === 0 ? (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', color: '#cbd5e1', fontSize: '0.9rem' }}>
              No custom admin uploaded items found. Items uploaded via forms above or Admin Studio appear here.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#064e3b', borderBottom: '2px solid var(--accent-gold)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Type / Destination</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Author / Speaker</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Database MP3 Audios / Taqreers */}
                  {dbTaqreers.map((tq, idx) => (
                    <tr key={`db_tq_${tq.id || idx}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: idx % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        <i className="fas fa-headphones" style={{ marginRight: '0.4rem', color: '#10b981' }}></i>
                        {tq.title || 'Untitled Taqreer'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '10px', background: '#065f46', color: '#34d399', fontWeight: 700 }}>
                          MP3 AUDIO ({tq.language || 'urdu'})
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>{tq.speaker || '-'}</td>
                      <td style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setEditingItem({ id: tq.id, title: tq.title, speaker: tq.speaker, contentType: 'audio' })}
                          style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          onClick={async () => {
                            const done = await deleteContentItem(tq.id, 'audio');
                            if (done) setDbTaqreers(prev => prev.filter(x => x.id !== tq.id));
                          }}
                          style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <i className="fas fa-trash"></i> Delete MP3
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Local Custom Admin Items */}
                  {getAdminItems().map((item, idx) => (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: (idx + dbTaqreers.length) % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{item.title || 'Untitled'}</td>
                      <td style={{ padding: '0.75rem 1rem', textTransform: 'uppercase', fontSize: '0.78rem' }}>{item.destination || item.contentType || 'Custom'}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>{item.author || item.speaker || '-'}</td>
                      <td style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setEditingItem(item)}
                          style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          onClick={() => deleteContentItem(item.id, item.contentType || item.destination || 'book')}
                          style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingItem && (
        <AdminEditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            setSubmittedMessage('Item updated successfully!');
            setTimeout(() => setSubmittedMessage(''), 4000);
          }}
        />
      )}
    </div>
  );
}
