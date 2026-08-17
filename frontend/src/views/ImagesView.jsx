import React, { useState, useEffect } from 'react';
import { fetchWithCache, getApiUrl } from '../utils/apiCache';
import { useLanguage } from '../context/LanguageContext';
import { Search, Download, Eye, X, Calendar, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';

export default function ImagesView() {
  const { t } = useLanguage();
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null); // Image currently viewed in lightbox

  // Debounce search query to prevent excessive backend API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Load Categories
  useEffect(() => {
    fetchWithCache('/api/categories/')
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  // Fetch only images from BookMedia endpoint (file_type=image)
  useEffect(() => {
    setLoading(true);
    const url = getApiUrl(
      `/api/books/?file_type=image&q=${encodeURIComponent(debouncedQuery)}&category=${encodeURIComponent(selectedCategory)}&page=${page}`
    );
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setImages(data.results || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch(() => {
        setImages([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedQuery, selectedCategory, page]);

  const handleDownload = (imageUrl, filename) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'islamic-image.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ background: '#fdfbf7', minHeight: '90vh', padding: '2rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* ── Title Banner ── */}
        <div style={{
          textAlign: 'center', marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          border: '2px solid var(--accent-gold, #f59e0b)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 15px', background: 'rgba(255,255,255,0.08)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Sparkles size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Islamic Visual Gallery
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
            Islamic Images &amp; Calligraphy
          </h1>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '1rem', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Browse, view, and download authentic Islamic wallpapers, Calligraphy, Quranic quotes, and educational image resources.
          </p>
        </div>

        {/* ── Filter Bar ── */}
        <div style={{
          background: '#ffffff', borderRadius: '20px', padding: '1.25rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0',
          marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search images by title, keywords..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '14px',
                border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#334155',
                transition: 'border-color 0.2s', background: '#f8fafc'
              }}
              onFocus={e => e.target.style.borderColor = '#0066FF'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ flex: '1 1 200px' }}>
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '14px',
                border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#334155',
                background: '#f8fafc', cursor: 'pointer'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Main Gallery Grid ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
            <RefreshCw size={36} style={{ color: '#0066FF', animation: 'spin 1.2s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.95rem' }}>Loading visual gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem', background: '#ffffff',
            borderRadius: '20px', border: '1px dashed #cbd5e1'
          }}>
            <ImageIcon size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', color: '#1e293b' }}>No Images Found</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              We couldn't find any images matching your filters. Try clearing search or category filters.
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem'
            }}>
              {images.map(img => {
                const imgUrl = img.pdf_url || img.cover_url;
                return (
                  <div
                    key={img.id}
                    style={{
                      background: '#ffffff', borderRadius: '18px', overflow: 'hidden',
                      border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    className="image-card"
                  >
                    {/* Hover effects handled in local CSS in style tag */}
                    <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '70%', background: '#f8fafc' }}>
                      <img
                        src={imgUrl}
                        alt={img.title}
                        style={{
                          position: 'absolute', inset: 0, width: '100%', height: '100%',
                          objectFit: 'cover', transition: 'transform 0.4s ease'
                        }}
                        className="card-img"
                      />
                      {/* Image Action Overlay */}
                      <div
                        className="card-overlay"
                        style={{
                          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                          opacity: 0, transition: 'opacity 0.25s ease'
                        }}
                      >
                        <button
                          onClick={() => setLightboxImg(img)}
                          style={{
                            background: '#ffffff', border: 'none', width: '38px', height: '38px',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', color: '#0066FF'
                          }}
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(imgUrl, img.title)}
                          style={{
                            background: '#ffffff', border: 'none', width: '38px', height: '38px',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', color: '#10b981'
                          }}
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Card Footer */}
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.35rem', fontSize: '0.98rem', fontWeight: 700, color: '#1e293b', lineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {img.title}
                      </h3>
                      {img.description && (
                        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.4rem', lineHeight: 1.5 }}>
                          {img.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#0066FF', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          {img.category || 'Islamic Resource'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={12} />
                          {img.created_at || 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{
                    padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid #cbd5e1',
                    background: page <= 1 ? '#e2e8f0' : '#ffffff', color: page <= 1 ? '#94a3b8' : '#334155',
                    cursor: page <= 1 ? 'default' : 'pointer', fontWeight: 600, fontSize: '0.88rem'
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  style={{
                    padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid #cbd5e1',
                    background: page >= totalPages ? '#e2e8f0' : '#ffffff', color: page >= totalPages ? '#94a3b8' : '#334155',
                    cursor: page >= totalPages ? 'default' : 'pointer', fontWeight: 600, fontSize: '0.88rem'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Lightbox Overlay ── */}
        {lightboxImg && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.95)',
              zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem', backdropFilter: 'blur(5px)'
            }}
            onClick={() => setLightboxImg(null)}
          >
            <button
              onClick={() => setLightboxImg(null)}
              style={{
                position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)',
                border: 'none', color: '#fff', width: '42px', height: '42px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={24} />
            </button>

            <div
              style={{
                maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '1rem'
              }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightboxImg.pdf_url || lightboxImg.cover_url}
                alt={lightboxImg.title}
                style={{
                  maxWidth: '100%', maxHeight: '72vh', borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.15)'
                }}
              />
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 700 }}>{lightboxImg.title}</h2>
                {lightboxImg.description && <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#cbd5e1', maxWidth: '600px' }}>{lightboxImg.description}</p>}
                
                <button
                  onClick={() => handleDownload(lightboxImg.pdf_url || lightboxImg.cover_url, lightboxImg.title)}
                  style={{
                    padding: '0.65rem 1.5rem', borderRadius: '30px', background: '#0066FF',
                    color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem',
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(0,102,255,0.3)'
                  }}
                >
                  <Download size={16} /> Download High Quality Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .image-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.08) !important;
          border-color: rgba(0, 102, 255, 0.3) !important;
        }
        .image-card:hover .card-img {
          transform: scale(1.05);
        }
        .image-card:hover .card-overlay {
          opacity: 1 !important;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
