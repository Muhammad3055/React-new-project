import React, { useState, useEffect } from 'react';
import { editContentItem } from '../utils/adminContentStore';
import { getApiUrl } from '../utils/apiCache';

export default function AdminEditModal({ item, onClose, onSuccess }) {
  const [title, setTitle] = useState(item?.title || '');
  const [authorSpeaker, setAuthorSpeaker] = useState(item?.author || item?.speaker || '');
  const [pagesCount, setPagesCount] = useState(item?.pages_count || 1);
  const [fileType, setFileType] = useState(item?.file_type || 'pdf');
  const [language, setLanguage] = useState(item?.language || 'urdu');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(item?.category_id || item?.category || '');
  const [description, setDescription] = useState(item?.description || '');
  const [fileUrl, setFileUrl] = useState(item?.pdf_url || item?.fileUrl || item?.document_url || '');
  const [coverUrl, setCoverUrl] = useState(item?.cover_url || item?.thumbnail_url || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(getApiUrl('/api/categories/'))
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setSaving(true);

    let finalFileUrl = fileUrl;
    if (selectedFile) {
      finalFileUrl = URL.createObjectURL(selectedFile);
    }

    let finalCoverUrl = coverUrl;
    if (selectedCoverFile) {
      finalCoverUrl = URL.createObjectURL(selectedCoverFile);
    }

    const updatedFields = {
      title,
      author: authorSpeaker,
      speaker: authorSpeaker,
      pages_count: Number(pagesCount) || 1,
      file_type: fileType,
      language,
      category_id: selectedCategory,
      category: selectedCategory,
      description,
      pdf_url: finalFileUrl,
      fileUrl: finalFileUrl,
      document_url: finalFileUrl,
      cover_url: finalCoverUrl,
      selectedFile,
      selectedCoverFile
    };

    const contentType = item?.contentType || item?.file_type || 'book';
    await editContentItem(item.id, updatedFields, contentType);

    setSaving(false);
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#022c22', border: '1.5px solid var(--accent-gold)', borderRadius: '20px', color: '#fff', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245,158,11,0.3)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-edit fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>Edit Document / Item</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Update title, author, category, cover image, language or reupload file</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title & Author */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Author / Speaker</label>
              <input
                type="text"
                value={authorSpeaker}
                onChange={(e) => setAuthorSpeaker(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>
          </div>

          {/* Pages Count, Format, Category & Language */}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Pages Count</label>
              <input
                type="number"
                min="1"
                value={pagesCount}
                onChange={(e) => setPagesCount(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Format</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              >
                <option value="pdf">📄 PDF Document</option>
                <option value="book">📚 Book (100+ Pages)</option>
                <option value="doc">📝 Word (.docx)</option>
                <option value="ppt">📊 Presentation (.pptx)</option>
              </select>
            </div>
          </div>

          {/* Cover Image Upload & Cover URL Box */}
          <div style={{ background: 'rgba(245,158,11,0.08)', padding: '1rem', borderRadius: '12px', border: '1px dashed rgba(245,158,11,0.3)', marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
              🖼 Cover Image / Book Thumbnail Option
            </label>

            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.25rem' }}>📸 Upload Cover Image File (.jpg, .png):</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedCoverFile(e.target.files[0])}
                style={{ width: '100%', padding: '0.4rem', background: '#064e3b', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.25rem' }}>🌐 OR External Cover Image URL:</span>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or /media/covers/..."
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>
          </div>

          {/* Reupload Document / Media File */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
              Document / Media File Source
            </label>

            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.25rem' }}>📁 Reupload File from Device:</span>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ width: '100%', padding: '0.4rem', background: '#064e3b', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.25rem' }}>🌐 Direct Document Web Link / URL:</span>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://pub-xxxx.r2.dev/book.pdf or /media/..."
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Description / Notes</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#064e3b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.75rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '10px', color: '#022c22', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

