import React, { useState } from 'react';
import { getAdminCustomFolders, saveCustomFolder, addAdminItem } from '../utils/adminContentStore';
import { getApiUrl } from '../utils/apiCache';

export default function AdminUploadModal({ onClose, onSuccess }) {
  const [folders, setFolders] = useState(() => getAdminCustomFolders());
  const [contentType, setContentType] = useState('book'); // 'book' | 'audio' | 'button' | 'folder'
  const [destination, setDestination] = useState('books'); // folder id
  const [newFolderName, setNewFolderName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [authorSpeaker, setAuthorSpeaker] = useState('');
  const [language, setLanguage] = useState('urdu'); // 'english' | 'urdu' | 'brahui'
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [duration, setDuration] = useState('15:00');
  const [pagesCount, setPagesCount] = useState(100);
  const [buttonLabel, setButtonLabel] = useState('Read Now');
  const [buttonIcon, setButtonIcon] = useState('fas fa-external-link-alt');
  const [selectedFile, setSelectedFile] = useState(null);

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
    if (!title.trim() && contentType !== 'folder') {
      alert('Please enter a title');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', authorSpeaker);
    formData.append('speaker', authorSpeaker);
    formData.append('pages_count', pagesCount);
    formData.append('file_type', contentType === 'book' ? 'pdf' : contentType);
    formData.append('destination', destination);
    formData.append('language', language);
    formData.append('description', description);
    formData.append('content_type', contentType);
    formData.append('pdf_url', fileUrl);
    formData.append('cover_url', coverUrl);

    let finalFileUrl = fileUrl;

    if (selectedFile) {
      formData.append('file', selectedFile);
      formData.append('pdf_file', selectedFile);
      // In client mode, create object URL for instant preview
      finalFileUrl = URL.createObjectURL(selectedFile);
    }

    const newItem = {
      title,
      author: authorSpeaker,
      speaker: authorSpeaker,
      pages_count: Number(pagesCount) || 100,
      destination,
      contentType,
      language,
      description,
      fileUrl: finalFileUrl,
      pdf_url: contentType === 'book' ? finalFileUrl : undefined,
      audio_url: contentType === 'audio' ? finalFileUrl : undefined,
      cover_url: coverUrl,
      duration,
      buttonLabel,
      buttonIcon,
      addedByAdmin: true,
      created_at: new Date().toISOString()
    };

    // Attempt POST to backend API to save permanently in Django DB
    const apiEndpoint = contentType === 'book' ? '/api/books/' : contentType === 'audio' ? '/api/taqreer/' : '/api/upload/';
    fetch(getApiUrl(apiEndpoint), {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then((data) => {
        if (data && (data.document_url || data.audio_url || data.id)) {
          // Update item in local store with permanent DB URL & ID
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
      <div className="card" style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#022c22', border: '1.5px solid var(--accent-gold)', borderRadius: '20px', color: '#fff', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245,158,11,0.3)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-shield-alt fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>Admin Content & Upload Studio</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Add Books, MP3s, Custom Links & Folders Anywhere</p>
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
                1. Where do you wish to add this content? (Destination)
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

            {/* 2. Content Type Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
                2. Select Content Type to Add
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setContentType('book')}
                  style={{ padding: '0.65rem 0.4rem', borderRadius: '10px', border: contentType === 'book' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'book' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                >
                  <i className="fas fa-file-pdf fa-lg" style={{ color: '#ef4444' }}></i>
                  <span>Book/Doc</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('audio')}
                  style={{ padding: '0.65rem 0.4rem', borderRadius: '10px', border: contentType === 'audio' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'audio' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                >
                  <i className="fas fa-headphones fa-lg" style={{ color: '#10b981' }}></i>
                  <span>MP3 Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('hadith')}
                  style={{ padding: '0.65rem 0.4rem', borderRadius: '10px', border: contentType === 'hadith' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'hadith' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                >
                  <i className="fas fa-scroll fa-lg" style={{ color: '#6366f1' }}></i>
                  <span>Hadith/Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('post')}
                  style={{ padding: '0.65rem 0.4rem', borderRadius: '10px', border: contentType === 'post' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'post' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                >
                  <i className="fas fa-newspaper fa-lg" style={{ color: '#ec4899' }}></i>
                  <span>Post/Article</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('button')}
                  style={{ padding: '0.65rem 0.4rem', borderRadius: '10px', border: contentType === 'button' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)', background: contentType === 'button' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                >
                  <i className="fas fa-link fa-lg" style={{ color: '#3b82f6' }}></i>
                  <span>Link Button</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Holy Quran Brahui Translation PDF"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Author / Speaker / Qari</label>
                <input
                  type="text"
                  placeholder="e.g. Maulana Muhammad Brahui"
                  value={authorSpeaker}
                  onChange={(e) => setAuthorSpeaker(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                >
                  <option value="urdu">🇵🇰 Urdu (اردو)</option>
                  <option value="brahui">📜 Brahui (براہوئی)</option>
                  <option value="english">🇬🇧 English</option>
                  <option value="arabic">🇸🇦 Arabic</option>
                </select>
              </div>

              {contentType === 'book' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Pages Count</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="120"
                    value={pagesCount}
                    onChange={(e) => setPagesCount(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
              )}

              {contentType === 'audio' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Audio Duration</label>
                  <input
                    type="text"
                    placeholder="15:30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
              )}

              {contentType === 'button' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Button Action Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Open Book / Listen Audio"
                    value={buttonLabel}
                    onChange={(e) => setButtonLabel(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
              )}
            </div>

            {/* File Upload OR Direct URL Input */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
                File Source (Upload from Laptop or Paste Direct Link)
              </label>

              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.25rem' }}>📁 Option A: Upload File from Laptop / Mobile</span>
                <input
                  type="file"
                  accept={contentType === 'book' ? '.pdf,.doc,.docx,.epub' : contentType === 'audio' ? '.mp3,.wav,.m4a,.aac' : '*'}
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={{ width: '100%', padding: '0.4rem', background: '#064e3b', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.25rem' }}>🌐 Option B: External URL Link (Cloudflare R2, Archive.org, Direct Link)</span>
                <input
                  type="url"
                  placeholder="https://pub-xxxx.r2.dev/book.pdf or https://archive.org/..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Description / Notes</label>
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
