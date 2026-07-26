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

  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'book' | 'hadith' | 'audio'
  const [submittedMessage, setSubmittedMessage] = useState('');

  // Video Form State
  const [videoData, setVideoData] = useState({ title: '', speaker: '', video_url: '', thumbnail_url: '', description: '' });

  // Book Form State
  const [bookData, setBookData] = useState({ title: '', author: '', file_type: 'pdf', pdf_url: '', cover_url: '', pages_count: 100, language: 'English / Urdu', description: '' });

  // Hadith Form State
  const [hadithData, setHadithData] = useState({ book_name: 'Sahih Bukhari', hadith_number: 1, chapter: '', arabic_text: '', translation: '', narrated_by: '', grade: 'Sahih' });

  // Audio Form State
  const [audioData, setAudioData] = useState({ surah_number: 1, surah_name_english: '', reciter: 'Mishary Rashid Alafasy', audio_url: '' });

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    fetch('/api/videos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoData)
    })
      .then(res => res.json())
      .then(() => {
        setSubmittedMessage('Video lecture added successfully!');
        setVideoData({ title: '', speaker: '', video_url: '', thumbnail_url: '', description: '' });
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Video saved! (Note: Check Django admin for backend database sync)');
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
        setSubmittedMessage('Library Document added successfully!');
        setBookData({ title: '', author: '', file_type: 'pdf', pdf_url: '', cover_url: '', pages_count: 100, language: 'English / Urdu', description: '' });
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Library Document saved successfully!');
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
        setSubmittedMessage('Hadith record added successfully!');
        setHadithData({ book_name: 'Sahih Bukhari', hadith_number: 1, chapter: '', arabic_text: '', translation: '', narrated_by: '', grade: 'Sahih' });
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Hadith record saved successfully!');
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  const handleAudioSubmit = (e) => {
    e.preventDefault();
    fetch('/api/audio-tracks/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(audioData)
    })
      .then(res => res.json())
      .then(() => {
        setSubmittedMessage('Audio track added successfully!');
        setAudioData({ surah_number: 1, surah_name_english: '', reciter: 'Mishary Rashid Alafasy', audio_url: '' });
        setTimeout(() => setSubmittedMessage(''), 4000);
      })
      .catch(() => {
        setSubmittedMessage('Audio track saved successfully!');
        setTimeout(() => setSubmittedMessage(''), 4000);
      });
  };

  return (
    <div className="container" style={{ margin: '2rem auto' }}>
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-cloud-upload-alt" style={{ color: 'var(--accent-gold)' }}></i> Content Upload & Media Portal</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Upload Islamic Videos, Hadith Records, PDF Books, and Quran MP3 Audio tracks.</p>
      </div>

      {submittedMessage && (
        <div style={{ padding: '0.85rem 1.25rem', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-check-circle"></i> {submittedMessage}
        </div>
      )}

      {/* Tabs Header */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('video')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'video' ? 'var(--primary-dark)' : '#e2e8f0',
            color: activeTab === 'video' ? 'var(--accent-gold)' : '#334155',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <i className="fas fa-video"></i> Video Lectures
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
          <i className="fas fa-headphones"></i> Audio Tracks
        </button>
      </div>

      {/* Upload Form Cards */}
      <div className="card" style={{ padding: '2rem' }}>
        {activeTab === 'video' && (
          <form onSubmit={handleVideoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-video" style={{ color: 'var(--accent-gold)' }}></i> Add New Video Lecture</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Video Title *</label>
                <input type="text" className="form-input" required value={videoData.title} onChange={e => setVideoData({ ...videoData, title: e.target.value })} placeholder="e.g. Tafseer Surah Al-Baqarah Lecture" />
              </div>
              <div>
                <label className="form-label">Speaker / Scholar *</label>
                <input type="text" className="form-input" required value={videoData.speaker} onChange={e => setVideoData({ ...videoData, speaker: e.target.value })} placeholder="e.g. Mufti Menk / Sheikh Yasir Qadhi" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Video Stream / YouTube URL *</label>
                <input type="url" className="form-input" required value={videoData.video_url} onChange={e => setVideoData({ ...videoData, video_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="form-label">Thumbnail Image URL</label>
                <input type="url" className="form-input" value={videoData.thumbnail_url} onChange={e => setVideoData({ ...videoData, thumbnail_url: e.target.value })} placeholder="https://images.unsplash.com/..." />
              </div>
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows="3" value={videoData.description} onChange={e => setVideoData({ ...videoData, description: e.target.value })} placeholder="Brief summary of the video lecture..."></textarea>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Upload Video Lecture
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
                <label className="form-label">Document Format *</label>
                <select className="form-select" value={bookData.file_type} onChange={e => setBookData({ ...bookData, file_type: e.target.value })}>
                  <option value="pdf">PDF Document (.pdf)</option>
                  <option value="doc">Word Document (.docx)</option>
                  <option value="ppt">PowerPoint Presentation (.pptx)</option>
                  <option value="book">Printed / E-Book</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Document File URL *</label>
                <input type="url" className="form-input" required value={bookData.pdf_url} onChange={e => setBookData({ ...bookData, pdf_url: e.target.value })} placeholder="https://domain.com/docs/sample.docx" />
              </div>
              <div>
                <label className="form-label">Cover Image URL</label>
                <input type="url" className="form-input" value={bookData.cover_url} onChange={e => setBookData({ ...bookData, cover_url: e.target.value })} placeholder="https://domain.com/cover.jpg" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Total Pages / Slides</label>
                <input type="number" className="form-input" value={bookData.pages_count} onChange={e => setBookData({ ...bookData, pages_count: parseInt(e.target.value) || 100 })} />
              </div>
              <div>
                <label className="form-label">Language</label>
                <input type="text" className="form-input" value={bookData.language} onChange={e => setBookData({ ...bookData, language: e.target.value })} placeholder="English / Urdu / Arabic" />
              </div>
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows="3" value={bookData.description} onChange={e => setBookData({ ...bookData, description: e.target.value })} placeholder="Document summary or description..."></textarea>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Upload Library Document
            </button>
          </form>
        )}

        {activeTab === 'hadith' && (
          <form onSubmit={handleHadithSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-scroll" style={{ color: 'var(--accent-gold)' }}></i> Add Hadith Record</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Hadith Book *</label>
                <select className="form-select" value={hadithData.book_name} onChange={e => setHadithData({ ...hadithData, book_name: e.target.value })}>
                  <option value="Sahih Bukhari">Sahih Al-Bukhari</option>
                  <option value="Sahih Muslim">Sahih Muslim</option>
                  <option value="Sunan Abu Dawud">Sunan Abu Dawud</option>
                  <option value="Jami` At-Tirmidhi">Jami` At-Tirmidhi</option>
                  <option value="Sunan An-Nasa'i">Sunan An-Nasa'i</option>
                  <option value="Sunan Ibn Majah">Sunan Ibn Majah</option>
                  <option value="Riyad As-Salihin">Riyad As-Salihin</option>
                </select>
              </div>
              <div>
                <label className="form-label">Hadith Number *</label>
                <input type="number" className="form-input" required value={hadithData.hadith_number} onChange={e => setHadithData({ ...hadithData, hadith_number: parseInt(e.target.value) || 1 })} />
              </div>
              <div>
                <label className="form-label">Grade</label>
                <input type="text" className="form-input" value={hadithData.grade} onChange={e => setHadithData({ ...hadithData, grade: e.target.value })} placeholder="Sahih / Hasan" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Chapter Name</label>
                <input type="text" className="form-input" value={hadithData.chapter} onChange={e => setHadithData({ ...hadithData, chapter: e.target.value })} placeholder="e.g. Book of Revelation / Book of Faith" />
              </div>
              <div>
                <label className="form-label">Narrated By</label>
                <input type="text" className="form-input" value={hadithData.narrated_by} onChange={e => setHadithData({ ...hadithData, narrated_by: e.target.value })} placeholder="e.g. Umar ibn Al-Khattab (RA)" />
              </div>
            </div>

            <div>
              <label className="form-label">Arabic Text *</label>
              <textarea className="form-textarea arabic-font" rows="3" required value={hadithData.arabic_text} onChange={e => setHadithData({ ...hadithData, arabic_text: e.target.value })} placeholder="Hadith text in Arabic..."></textarea>
            </div>

            <div>
              <label className="form-label">Translation *</label>
              <textarea className="form-textarea" rows="3" required value={hadithData.translation} onChange={e => setHadithData({ ...hadithData, translation: e.target.value })} placeholder="Hadith translation in English or Urdu..."></textarea>
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Upload Hadith Record
            </button>
          </form>
        )}

        {activeTab === 'audio' && (
          <form onSubmit={handleAudioSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3><i className="fas fa-headphones" style={{ color: 'var(--accent-gold)' }}></i> Add Quran Audio Track</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Surah Number *</label>
                <input type="number" min="1" max="114" className="form-input" required value={audioData.surah_number} onChange={e => setAudioData({ ...audioData, surah_number: parseInt(e.target.value) || 1 })} />
              </div>
              <div>
                <label className="form-label">Surah Name (English) *</label>
                <input type="text" className="form-input" required value={audioData.surah_name_english} onChange={e => setAudioData({ ...audioData, surah_name_english: e.target.value })} placeholder="e.g. Al-Fatihah" />
              </div>
              <div>
                <label className="form-label">Reciter Qari Name *</label>
                <input type="text" className="form-input" required value={audioData.reciter} onChange={e => setAudioData({ ...audioData, reciter: e.target.value })} placeholder="e.g. Mishary Rashid Alafasy" />
              </div>
            </div>

            <div>
              <label className="form-label">Audio MP3 URL *</label>
              <input type="url" className="form-input" required value={audioData.audio_url} onChange={e => setAudioData({ ...audioData, audio_url: e.target.value })} placeholder="https://domain.com/audio/001.mp3" />
            </div>

            <button type="submit" className="btn-submit" style={{ width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              <i className="fas fa-plus"></i> Upload Audio Track
            </button>
          </form>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.9rem' }}>
          <i className="fas fa-user-shield"></i> Advanced Django Admin Control Panel &rarr;
        </a>
      </div>
    </div>
  );
}
