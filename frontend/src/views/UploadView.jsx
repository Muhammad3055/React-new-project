import React, { useState } from 'react';

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
          <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" className="btn-play" style={{ display: 'inline-flex', margin: '0 auto' }}>
            <i className="fas fa-user-shield"></i> Login to Django Admin Panel
          </a>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('taqreer'); // 'taqreer' | 'book' | 'hadith' | 'audio'
  const [submittedMessage, setSubmittedMessage] = useState('');

  // Taqreer Form State
  const [taqreerData, setTaqreerData] = useState({ title: '', speaker: '', language: 'urdu', audio_url: '', duration: '15:00', description: '' });

  // Book Form State
  const [bookData, setBookData] = useState({ title: '', author: '', file_type: 'pdf', pdf_url: '', cover_url: '', pages_count: 100, language: 'English / Urdu', description: '' });

  // Hadith Form State
  const [hadithData, setHadithData] = useState({ book_name: 'Sahih Bukhari', hadith_number: 1, chapter: '', arabic_text: '', translation: '', narrated_by: '', grade: 'Sahih' });

  // Audio Form State
  const [audioData, setAudioData] = useState({ surah_number: 1, surah_name_english: '', reciter: 'Mishary Rashid Alafasy', audio_url: '' });

  const handleTaqreerSubmit = (e) => {
    e.preventDefault();
    fetch('/api/taqreer/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taqreerData)
    })
      .then(res => res.json())
      .then((data) => {
        setSubmittedMessage(data.message || 'Taqreer MP3 voice note added successfully!');
        setTaqreerData({ title: '', speaker: '', language: 'urdu', audio_url: '', duration: '15:00', description: '' });
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Taqreer MP3 saved successfully!');
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    fetch('/api/books/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    })
      .then(res => res.json())
      .then(() => {
        setSubmittedMessage('Book document added successfully!');
        setBookData({ title: '', author: '', file_type: 'pdf', pdf_url: '', cover_url: '', pages_count: 100, language: 'English / Urdu', description: '' });
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Book saved!');
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  const handleHadithSubmit = (e) => {
    e.preventDefault();
    fetch('/api/hadith/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hadithData)
    })
      .then(res => res.json())
      .then(() => {
        setSubmittedMessage('Hadith entry added successfully!');
        setHadithData({ book_name: 'Sahih Bukhari', hadith_number: 1, chapter: '', arabic_text: '', translation: '', narrated_by: '', grade: 'Sahih' });
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Hadith saved!');
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  const handleAudioSubmit = (e) => {
    e.preventDefault();
    fetch('/api/quran/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(audioData)
    })
      .then(res => res.json())
      .then(() => {
        setSubmittedMessage('Quran Audio recitation added successfully!');
        setAudioData({ surah_number: 1, surah_name_english: '', reciter: 'Mishary Rashid Alafasy', audio_url: '' });
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
          Upload MP3 Taqreer voice notes (Arabic, Brahui, Urdu), PDF books, Hadiths, and Quran recitations to the portal.
        </p>
      </div>

      {submittedMessage && (
        <div style={{ padding: '0.85rem 1.25rem', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-check-circle"></i> {submittedMessage}
        </div>
      )}

      {/* Tabs Header */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
          <i className="fas fa-bullhorn"></i> Taqreer Audio MP3
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
          <i className="fas fa-book"></i> PDF Books
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
          <i className="fas fa-scroll"></i> Hadiths
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
          <i className="fas fa-headphones"></i> Quran Tilawat Audio
        </button>
      </div>

      {/* Upload Form Cards */}
      <div className="card" style={{ padding: '2rem' }}>
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
                <input type="text" className="form-input" required value={taqreerData.speaker} onChange={e => setTaqreerData({ ...taqreerData, speaker: e.target.value })} placeholder="e.g. Maulana Abdul Ghafoor Brahui / Mufti Taqi Usmani" />
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
                <label className="form-label">Direct MP3 Audio Stream URL *</label>
                <input type="url" className="form-input" required value={taqreerData.audio_url} onChange={e => setTaqreerData({ ...taqreerData, audio_url: e.target.value })} placeholder="https://domain.com/audio.mp3" />
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
              <i className="fas fa-plus"></i> Upload Taqreer MP3 Audio
            </button>
          </form>
        )}

        {activeTab === 'book' && (
          <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-book" style={{ color: 'var(--accent-gold)' }}></i> Add New Library Document / Resource</h3>
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
                <label className="form-label">Language</label>
                <input type="text" className="form-input" value={bookData.language} onChange={e => setBookData({ ...bookData, language: e.target.value })} placeholder="e.g. Arabic / English / Urdu" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Document File URL *</label>
                <input type="url" className="form-input" required value={bookData.pdf_url} onChange={e => setBookData({ ...bookData, pdf_url: e.target.value })} placeholder="https://domain.com/book.pdf" />
              </div>
              <div>
                <label className="form-label">Cover Image URL</label>
                <input type="url" className="form-input" value={bookData.cover_url} onChange={e => setBookData({ ...bookData, cover_url: e.target.value })} placeholder="https://images.unsplash.com/..." />
              </div>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Upload Document
            </button>
          </form>
        )}

        {activeTab === 'hadith' && (
          <form onSubmit={handleHadithSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-scroll" style={{ color: 'var(--accent-gold)' }}></i> Add Hadith Entry</h3>
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
                <input type="text" className="form-input" value={hadithData.grade} onChange={e => setHadithData({ ...hadithData, grade: e.target.value })} placeholder="Sahih / Hasan" />
              </div>
            </div>

            <div>
              <label className="form-label">Arabic Text *</label>
              <textarea className="form-textarea arabic-font" rows="3" required value={hadithData.arabic_text} onChange={e => setHadithData({ ...hadithData, arabic_text: e.target.value })} placeholder="أدخل نص الحديث الشريف باللغة العربية..."></textarea>
            </div>

            <div>
              <label className="form-label">Translation *</label>
              <textarea className="form-textarea" rows="3" required value={hadithData.translation} onChange={e => setHadithData({ ...hadithData, translation: e.target.value })} placeholder="English / Urdu translation of the Hadith..."></textarea>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Save Hadith
            </button>
          </form>
        )}

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
                <label className="form-label">Qari / Reciter Name *</label>
                <input type="text" className="form-input" required value={audioData.reciter} onChange={e => setAudioData({ ...audioData, reciter: e.target.value })} placeholder="e.g. Mishary Rashid Alafasy" />
              </div>
            </div>

            <div>
              <label className="form-label">Direct MP3 Audio URL *</label>
              <input type="url" className="form-input" required value={audioData.audio_url} onChange={e => setAudioData({ ...audioData, audio_url: e.target.value })} placeholder="https://server8.mp3quran.net/afs/001.mp3" />
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Save Quran Audio
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
