import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAdminContent } from '../utils/adminContentStore';
import { createPortal } from 'react-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CATEGORIES = [
  { id: 'mix', name: 'Mix' },
  { id: 'prophets', name: 'Prophets and Sahaba' },
  { id: 'hadith', name: 'Hadith & Sunnah' },
  { id: 'islam', name: 'Islam' },
  { id: 'quran', name: 'Quran' },
  { id: 'religion', name: 'Religion' },
];

export default function ImagesView({ user }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('mix');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [previewImage, setPreviewImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', category: 'mix', description: '', file: null });

  const { t } = useLanguage();
  const { deleteContentItem } = useAdminContent();

  const isAdmin = user?.is_staff || user?.is_superuser;

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [selectedCategory, page]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/images/?category=${selectedCategory === 'mix' ? '' : selectedCategory}&page=${page}`;
      const response = await fetch(url);
      const data = await response.json();
      setImages(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.file) return alert("Title and image file are required.");

    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('category', uploadData.category);
    formData.append('description', uploadData.description);
    formData.append('image_file', uploadData.file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/images/`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setShowUploadModal(false);
        setUploadData({ title: '', category: 'mix', description: '', file: null });
        fetchImages(); // Refresh
        alert("Image uploaded successfully!");
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  const handleDelete = async (id, title) => {
    const success = await deleteContentItem(id, 'image', title);
    if (success) {
      fetchImages();
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          <i className="fas fa-images" style={{ color: 'var(--accent-gold)', marginRight: '0.75rem' }}></i>
          Islamic Images Gallery
        </h1>
        {isAdmin && (
          <button onClick={() => setShowUploadModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#059669', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '50px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            <i className="fas fa-cloud-upload-alt"></i> Upload Image
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '50px',
              border: '1px solid',
              borderColor: selectedCategory === cat.id ? 'var(--primary-dark)' : '#e2e8f0',
              background: selectedCategory === cat.id ? 'var(--primary-dark)' : '#ffffff',
              color: selectedCategory === cat.id ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 600 }}>Loading Images...</p>
        </div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <i className="fas fa-image fa-3x" style={{ color: '#cbd5e1', marginBottom: '1rem' }}></i>
          <h3 style={{ color: '#334155' }}>No images found in this category</h3>
          <p style={{ color: '#64748b' }}>Check back later or try another category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {images.map(img => (
            <div key={img.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}>
              <div 
                style={{ height: '220px', position: 'relative', background: '#f1f5f9', cursor: 'pointer' }}
                onClick={() => setPreviewImage(img.image_url)}
              >
                <img src={img.image_url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                  <i className="fas fa-expand-arrows-alt" style={{ color: '#fff', fontSize: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}></i>
                </div>
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0f172a' }}>{img.title}</h3>
                {img.description && <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b', flex: 1 }}>{img.description}</p>}
                
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <a href={img.image_url} download target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="Download Image">
                    <i className="fas fa-download"></i>
                  </a>
                  {isAdmin && (
                    <button onClick={() => handleDelete(img.id, img.title)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Delete Image">
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '3rem 0' }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid #e2e8f0', background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}>
            <i className="fas fa-chevron-left"></i> Prev
          </button>
          <span style={{ fontWeight: 600, color: '#64748b' }}>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid #e2e8f0', background: '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}>
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {previewImage && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setPreviewImage(null)}>
          <button onClick={() => setPreviewImage(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', width: '48px', height: '48px', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', zIndex: 100001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-times"></i>
          </button>
          <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()} />
        </div>,
        document.body
      )}

      {/* Admin Upload Modal */}
      {showUploadModal && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a' }}>Upload New Image</h2>
            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Image Title *</label>
                <input type="text" required value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Category *</label>
                <select value={uploadData.category} onChange={e => setUploadData({...uploadData, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Image File *</label>
                <input type="file" accept="image/*" required onChange={e => setUploadData({...uploadData, file: e.target.files[0]})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Description (Optional)</label>
                <textarea rows="3" value={uploadData.description} onChange={e => setUploadData({...uploadData, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#059669', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Upload</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
