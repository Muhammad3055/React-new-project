import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchWithCache, getApiUrl } from '../utils/apiCache';
import { getAdminItems, deleteContentItem, filterOutDeleted } from '../utils/adminContentStore';
import { useLanguage } from '../context/LanguageContext';
import AdminEditModal from '../components/AdminEditModal';

export default function BooksView({ openReportModal, user }) {
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFileTypes, setSelectedFileTypes] = useState([]); // ['pdf', 'doc', 'ppt', 'book']
  const [selectedLanguages, setSelectedLanguages] = useState([]); // ['en', 'ur', 'ar', 'br']
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null); // Document selected for modal viewing
  const [editingBook, setEditingBook] = useState(null);
  const [viewerEngine, setViewerEngine] = useState('direct'); // 'direct' | 'office' | 'google'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fileTypeOptions = [
    { id: '', label: t('allFormats'), icon: 'fas fa-layer-group', color: '#475569' },
    { id: 'pdf', label: t('pdfDoc'), icon: 'fas fa-file-pdf', color: '#dc2626' },
    { id: 'doc', label: t('wordDoc'), icon: 'fas fa-file-word', color: '#2563eb' },
    { id: 'ppt', label: t('pptDoc'), icon: 'fas fa-file-powerpoint', color: '#ea580c' },
    { id: 'book', label: t('bookDoc'), icon: 'fas fa-book', color: '#d97706' },
  ];

  const languageOptions = [
    { id: '', label: t('allLanguages'), icon: 'fas fa-globe', color: '#6366f1' },
    { id: 'br', label: 'Brahui (براہوئی)', icon: 'fas fa-language', color: '#f59e0b' },
    { id: 'ur', label: 'Urdu (اردو)', icon: 'fas fa-language', color: '#10b981' },
    { id: 'en', label: 'English', icon: 'fas fa-language', color: '#0ea5e9' },
    { id: 'ar', label: 'Arabic (عربي)', icon: 'fas fa-language', color: '#8b5cf6' },
  ];

  const toggleLanguage = (langId) => {
    setPage(1);
    if (!langId) {
      setSelectedLanguages([]);
      return;
    }
    setSelectedLanguages(prev => {
      if (prev.includes(langId)) {
        return prev.filter(item => item !== langId);
      } else {
        return [...prev, langId];
      }
    });
  };

  const toggleFileType = (typeId) => {
    setPage(1);
    if (!typeId) {
      setSelectedFileTypes([]);
      return;
    }
    setSelectedFileTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(item => item !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedLanguages([]);
    setSelectedFileTypes([]);
    setSelectedCategory('');
    setQuery('');
    setPage(1);
  };

  // Debounce search query to prevent excessive backend API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Load Categories with caching
  useEffect(() => {
    fetchWithCache('/api/categories/')
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  // Fetch Books whenever filters change & merge client-side admin uploaded books
  useEffect(() => {
    setLoading(true);
    const langStr = selectedLanguages.join(',');
    const fileTypeStr = selectedFileTypes.join(',');

    fetch(getApiUrl(`/api/books/?q=${encodeURIComponent(debouncedQuery)}&category=${encodeURIComponent(selectedCategory)}&file_type=${encodeURIComponent(fileTypeStr)}&language=${encodeURIComponent(langStr)}&page=${page}`))
      .then(res => res.json())
      .then(data => {
        const apiBooks = data.results || [];
        const adminBooks = getAdminItems('books').map(item => ({
          id: item.id,
          title: item.title,
          author: item.author || 'Admin Upload',
          file_type: item.file_type || 'pdf',
          pdf_url: item.fileUrl || item.pdf_url || item.document_url,
          cover_url: item.cover_url || '',
          language: item.language || 'ur',
          description: item.description || 'Uploaded by Administrator'
        }));

        const filteredAdminBooks = adminBooks.filter(ab => {
          if (selectedFileTypes.length > 0 && !selectedFileTypes.includes(ab.file_type)) return false;
          if (selectedLanguages.length > 0) {
            const abLang = (ab.language || '').toLowerCase();
            const matches = selectedLanguages.some(l =>
              abLang.includes(l) ||
              (l === 'br' && abLang.includes('brahui')) ||
              (l === 'ur' && abLang.includes('urdu')) ||
              (l === 'en' && abLang.includes('english')) ||
              (l === 'ar' && abLang.includes('arabic'))
            );
            if (!matches) return false;
          }
          return true;
        });

        // Deduplicate local admin items if Django API already contains the item
        const uniqueAdminBooks = filteredAdminBooks.filter(ab => !apiBooks.some(db => (db.title || '').toLowerCase().trim() === (ab.title || '').toLowerCase().trim() || String(db.id) === String(ab.id)));
        setBooks(filterOutDeleted([...uniqueAdminBooks, ...apiBooks]));
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      })
      .catch(() => {
        const adminBooks = getAdminItems('books').map(item => ({
          id: item.id,
          title: item.title,
          author: item.author || 'Admin Upload',
          file_type: item.file_type || 'pdf',
          pdf_url: item.fileUrl || item.pdf_url,
          cover_url: item.cover_url || '',
          language: item.language || 'ur',
          description: item.description || 'Uploaded by Administrator'
        }));
        setBooks(filterOutDeleted(adminBooks));
        setLoading(false);
      });
  }, [debouncedQuery, selectedCategory, selectedFileTypes, selectedLanguages, page]);

  // Listen for admin content updates to refresh instantly
  useEffect(() => {
    const handleUpdate = () => {
      const langStr = selectedLanguages.join(',');
      const fileTypeStr = selectedFileTypes.join(',');

      fetch(getApiUrl(`/api/books/?q=${encodeURIComponent(debouncedQuery)}&category=${encodeURIComponent(selectedCategory)}&file_type=${encodeURIComponent(fileTypeStr)}&language=${encodeURIComponent(langStr)}&page=${page}`))
        .then(res => res.json())
        .then(data => {
          const apiBooks = data.results || [];
          const adminBooks = getAdminItems('books').map(item => ({
            id: item.id,
            title: item.title,
            author: item.author || 'Admin Upload',
            file_type: item.file_type || 'pdf',
            pdf_url: item.fileUrl || item.pdf_url || item.document_url,
            cover_url: item.cover_url || '',
            language: item.language || 'ur',
            description: item.description || 'Uploaded by Administrator'
          }));
          const uniqueAdminBooks = adminBooks.filter(ab => !apiBooks.some(db => (db.title || '').toLowerCase().trim() === (ab.title || '').toLowerCase().trim() || String(db.id) === String(ab.id)));
          setBooks(filterOutDeleted([...uniqueAdminBooks, ...apiBooks]));
        })
        .catch(() => {
          const adminBooks = getAdminItems('books').map(item => ({
            id: item.id,
            title: item.title,
            author: item.author || 'Admin Upload',
            file_type: item.file_type || 'pdf',
            pdf_url: item.fileUrl || item.pdf_url,
            cover_url: item.cover_url || '',
            language: item.language || 'ur',
            description: item.description || 'Uploaded by Administrator'
          }));
          setBooks(filterOutDeleted(adminBooks));
        });
    };

    window.addEventListener('admin_content_updated', handleUpdate);
    return () => window.removeEventListener('admin_content_updated', handleUpdate);
  }, [debouncedQuery, selectedCategory, selectedFileTypes, selectedLanguages, page]);


  const getFormatBadge = (fileType) => {
    switch (fileType) {
      case 'doc':
        return { label: 'Word (.docx)', icon: 'fas fa-file-word', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'ppt':
        return { label: 'PowerPoint (.pptx)', icon: 'fas fa-file-powerpoint', bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' };
      case 'book':
        return { label: 'Book (100+ pgs)', icon: 'fas fa-book', bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      default:
        return { label: 'PDF Document', icon: 'fas fa-file-pdf', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
    }
  };

  const isLocalUrl = (url) => {
    if (!url) return false;
    const l = String(url).toLowerCase();
    return l.includes('localhost') || l.includes('127.0.0.1') || l.startsWith('/') || l.startsWith('blob:') || l.startsWith('data:');
  };

  const getDocRawUrl = (doc) => {
    if (!doc) return '';
    return doc.document_url || doc.pdf_file || doc.pdf_url || doc.fileUrl || doc.file_url || '';
  };

  const getCleanDocumentUrl = (url) => {
    if (!url) return '';
    let clean = String(url).trim();
    clean = clean.replace(/^https?:\/\/(127\.0\.0\.1|localhost):(8000|3000)/, '');
    if (clean.startsWith('blob:') || clean.startsWith('data:')) {
      return clean;
    }
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }
    if (!clean.startsWith('/')) {
      clean = '/' + clean;
    }
    if (!clean.startsWith('/media/')) {
      clean = '/media' + clean;
    }
    const apiResolved = getApiUrl(clean);
    if (apiResolved.startsWith('http://') || apiResolved.startsWith('https://')) {
      return apiResolved;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return origin + apiResolved;
  };

  const isPdfFormat = (doc) => {
    if (!doc) return false;
    if (doc.file_type === 'pdf' || doc.file_type === 'book') return true;
    const url = getDocRawUrl(doc).toLowerCase();
    return url.endsWith('.pdf') || url.includes('.pdf');
  };

  const getEmbedViewerUrl = (doc) => {
    const rawUrl = getDocRawUrl(doc);
    if (!rawUrl) return '';
    
    const fullUrl = getCleanDocumentUrl(rawUrl);

    if (viewerEngine === 'google') {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
    }

    // Default Direct Native Mode for PDF / Local files
    return fullUrl;
  };

  const handleOpenDocModal = (doc) => {
    setPreviewDoc(doc);
    setIsFullscreen(false);
    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      setViewerEngine('google');
    } else {
      setViewerEngine('direct');
    }
  };



  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="section-title">
          <i className="fas fa-book-reader" style={{ color: 'var(--accent-gold)' }}></i> {t('libraryHeaderTitle')}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {t('libraryHeaderSubtitle')}
        </p>
      </div>

      {/* Language Multi-Select Toggle Pill Bar */}
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <i className="fas fa-language" style={{ color: '#0284c7' }}></i> {t('filterByLang')}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {languageOptions.map((opt) => {
            const isAll = opt.id === '';
            const isActive = isAll ? selectedLanguages.length === 0 : selectedLanguages.includes(opt.id);
            return (
              <button
                key={opt.id || 'all-lang'}
                className="filter-pill-btn"
                onClick={() => toggleLanguage(opt.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '30px',
                  border: isActive ? `2px solid ${opt.color}` : '1px solid #cbd5e1',
                  background: isActive ? opt.color : '#ffffff',
                  color: isActive ? '#ffffff' : '#334155',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 4px 12px ${opt.color}40` : 'none',
                }}
              >
                <i className={isActive && !isAll ? 'fas fa-check-circle' : opt.icon}></i> {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format Multi-Select Toggle Pill Bar */}
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <i className="fas fa-file-alt" style={{ color: '#059669' }}></i> {t('filterByFormat')}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {fileTypeOptions.map((opt) => {
            const isAll = opt.id === '';
            const isActive = isAll ? selectedFileTypes.length === 0 : selectedFileTypes.includes(opt.id);
            return (
              <button
                key={opt.id || 'all-format'}
                className="filter-pill-btn"
                onClick={() => toggleFileType(opt.id)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '30px',
                  border: isActive ? `2px solid ${opt.color}` : '1px solid #cbd5e1',
                  background: isActive ? opt.color : '#ffffff',
                  color: isActive ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <i className={isActive && !isAll ? 'fas fa-check-circle' : opt.icon} style={{ color: isActive ? '#ffffff' : opt.color }}></i>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Selection Summary Banner */}
      {(selectedLanguages.length > 0 || selectedFileTypes.length > 0 || selectedCategory || query) && (
        <div style={{ background: '#e0f2fe', border: '1px solid #7dd3fc', padding: '0.65rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <i className="fas fa-filter"></i>
            <span>{t('activeFiltersLabel')}</span>
            {selectedLanguages.length > 0 && (
              <span style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                Languages: {selectedLanguages.map(l => languageOptions.find(o => o.id === l)?.label || l).join(', ')}
              </span>
            )}
            {selectedFileTypes.length > 0 && (
              <span style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                Formats: {selectedFileTypes.map(f => fileTypeOptions.find(o => o.id === f)?.label || f).join(', ')}
              </span>
            )}
          </div>
          <button
            onClick={clearAllFilters}
            style={{ background: '#0284c7', color: '#ffffff', border: 'none', padding: '0.35rem 0.85rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            <i className="fas fa-times-circle"></i> {t('clearAllFilters')}
          </button>
        </div>
      )}

      {/* Search & Filter Bar + View Mode Switcher */}
      <div className="filter-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
          <div className="filter-group" style={{ flex: 2, minWidth: '220px' }}>
            <span className="filter-label"><i className="fas fa-search"></i> {t('searchLabel')}</span>
            <input
              type="text"
              className="filter-input"
              placeholder={t('searchBooksPlaceholder')}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          </div>

          <div className="filter-group" style={{ flex: 1, minWidth: '180px' }}>
            <span className="filter-label"><i className="fas fa-folder"></i> {t('categoryLabel')}</span>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Layout View Mode Switcher */}
        <div style={{ display: 'flex', gap: '0.3rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setViewMode('grid')}
            title="Grid Cards View"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'grid' ? '#ffffff' : 'transparent',
              color: viewMode === 'grid' ? 'var(--primary-dark)' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <i className="fas fa-th-large" style={{ marginRight: '0.35rem' }}></i> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="Compact List View"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'list' ? '#ffffff' : 'transparent',
              color: viewMode === 'list' ? 'var(--primary-dark)' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'list' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <i className="fas fa-list" style={{ marginRight: '0.35rem' }}></i> List
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fetching Library Documents...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', margin: '2rem 0' }}>
          <i className="fas fa-folder-open fa-3x" style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
          <h3 style={{ color: 'var(--primary-dark)' }}>No documents found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Try adjusting your format filter or search criteria to view more resources.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid-3">
          {books.map((bk) => {
            const badge = getFormatBadge(bk.file_type);
            return (
              <div key={bk.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                <div className="media-cover-wrapper" style={{ height: '210px', position: 'relative', background: '#0f172a' }}>
                  <img
                    src={bk.cover_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80"}
                    alt={bk.title}
                    className="media-cover-img"
                    loading="lazy"
                    decoding="async"
                    style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: 0.9 }}
                  />
                  {/* Format Badge Overlay */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '0.35rem 0.75rem',
                      background: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <i className={badge.icon}></i> {badge.label}
                  </span>
                </div>

                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.2rem' }}>
                  <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--primary-dark)', fontWeight: 700 }}>{bk.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0.5rem 0' }}>
                    <i className="fas fa-pen-nib" style={{ color: 'var(--accent-gold)' }}></i> {bk.author}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '0.6rem' }}>
                    <i className={bk.file_type === 'ppt' ? 'fas fa-file-powerpoint' : 'fas fa-file-alt'} style={{ marginRight: '0.3rem' }}></i>
                    {bk.file_type === 'ppt' ? `${bk.pages_count} Slides` : `${bk.pages_count} Pages`} &bull; {bk.language}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{bk.description}</p>
                </div>

                {/* Action Footer */}
                <div className="card-footer" style={{ padding: '0.85rem 1.2rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleOpenDocModal(bk)}
                    className="btn-play"
                    style={{ flex: 1, minWidth: '120px', justifyContent: 'center', background: 'var(--primary-dark)', borderColor: 'var(--primary-dark)', fontSize: '0.85rem' }}
                  >
                    <i className="fas fa-book-open" style={{ marginRight: '0.3rem' }}></i> Read Online
                  </button>

                  <a
                    href={getCleanDocumentUrl(getDocRawUrl(bk))}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="btn-play"
                    style={{ background: '#059669', borderColor: '#059669', color: '#fff', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                    title="Download File"
                  >
                    <i className="fas fa-download"></i>
                  </a>

                  <button
                    className="verse-btn"
                    title="Report Issue"
                    onClick={() => openReportModal('book', bk.title)}
                    style={{ padding: '0.5rem 0.7rem' }}
                  >
                    <i className="far fa-flag"></i>
                  </button>

                  {(user?.is_staff || user?.is_superuser || bk.addedByAdmin) && (
                    <>
                      <button
                        onClick={() => setEditingBook(bk)}
                        style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        title="Edit Document as Admin"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        onClick={() => deleteContentItem(bk.id, 'book', bk.title)}
                        style={{ background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        title="Delete Book as Admin"
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT LIST VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {books.map((bk) => {
            const badge = getFormatBadge(bk.file_type);
            return (
              <div key={bk.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', gap: '1rem', flexWrap: 'wrap', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '240px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    <i className={badge.icon}></i>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{bk.title}</h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>By {bk.author} • {bk.pages_count || 100} Pages</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => handleOpenDocModal(bk)}
                    className="btn-play"
                    style={{ background: 'var(--primary-dark)', borderColor: 'var(--primary-dark)', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    <i className="fas fa-book-open" style={{ marginRight: '0.35rem' }}></i> Read Online
                  </button>
                  <a
                    href={getCleanDocumentUrl(getDocRawUrl(bk))}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="btn-play"
                    style={{ background: '#059669', borderColor: '#059669', color: '#ffffff', fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
                  >
                    <i className="fas fa-download"></i> Download
                  </a>
                  <button
                    className="verse-btn"
                    title="Report Issue"
                    onClick={() => openReportModal('book', bk.title)}
                  >
                    <i className="far fa-flag"></i>
                  </button>

                  {(user?.is_staff || user?.is_superuser || bk.addedByAdmin) && (
                    <>
                      <button
                        onClick={() => setEditingBook(bk)}
                        style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        title="Edit Document as Admin"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        onClick={() => deleteContentItem(bk.id, 'book', bk.title)}
                        style={{ background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        title="Delete Book as Admin"
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '2.5rem 0' }}>
          <button className="btn-play" disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ opacity: page <= 1 ? 0.5 : 1 }}>
            <i className="fas fa-chevron-left"></i> Previous
          </button>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
          <button className="btn-play" disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ opacity: page >= totalPages ? 0.5 : 1 }}>
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* High-Clarity Online Document Reader Modal Overlay         */}
      {/* ========================================================= */}
      {previewDoc && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 100000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isFullscreen ? '0' : '0.5rem'
          }}
          onClick={() => setPreviewDoc(null)}
        >
          <div
            style={{
              width: isFullscreen ? '100vw' : '100%',
              maxWidth: isFullscreen ? '100vw' : '1150px',
              height: isFullscreen ? '100vh' : '94vh',
              background: '#ffffff',
              borderRadius: isFullscreen ? '0' : '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="pdf-modal-header"
              style={{
                padding: '0.5rem 0.85rem',
                background: 'var(--primary-dark)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid var(--accent-gold)',
                flexWrap: 'nowrap',
                gap: '0.5rem',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', minWidth: 0, flex: '1 1 auto' }}>
                <span
                  style={{
                    padding: '0.35rem 0.6rem',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className={getFormatBadge(previewDoc.file_type).icon}></i>
                </span>
                <div style={{ overflow: 'hidden', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1.2'
                    }}
                    title={previewDoc.title}
                  >
                    {previewDoc.title}
                  </h3>
                  <p
                    style={{
                      margin: '0.1rem 0 0 0',
                      fontSize: '0.68rem',
                      color: 'var(--accent-gold)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1.1'
                    }}
                  >
                    Author: {previewDoc.author || 'Islamic Scholar'} &bull; {previewDoc.file_type_display || previewDoc.file_type || 'PDF'} ({previewDoc.pages_count || previewDoc.pages || 1} Pages)

                  </p>
                </div>
              </div>

              {/* Right Action Toolbar Column: Save File on top, Fullscreen below */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'stretch' }}>
                  {/* Top: Save File Button */}
                  <a
                    href={previewDoc.document_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#059669',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      lineHeight: '1',
                      boxSizing: 'border-box'
                    }}
                  >
                    <i className="fas fa-download" style={{ fontSize: '0.68rem' }}></i> Save File
                  </a>

                  {/* Bottom: Fullscreen Button */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    style={{
                      background: 'rgba(255,255,255,0.18)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: '#ffffff',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      whiteSpace: 'nowrap',
                      lineHeight: '1'
                    }}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reader"}
                  >
                    <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} style={{ fontSize: '0.68rem' }}></i>
                    <span style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setPreviewDoc(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    padding: '0.2rem 0.35rem',
                    borderRadius: '6px',
                    lineHeight: '1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Close Viewer"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>



            {/* Sub-Header Toolbar: Engine Switcher & External Link */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.25rem 0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
              <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Engine:</span>
                <button
                  onClick={() => setViewerEngine('google')}
                  style={{ padding: '1px 6px', borderRadius: '10px', border: 'none', background: viewerEngine === 'google' ? 'var(--primary-emerald)' : '#e2e8f0', color: viewerEngine === 'google' ? '#fff' : '#475569', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Google
                </button>
                <button
                  onClick={() => setViewerEngine('direct')}
                  style={{ padding: '1px 6px', borderRadius: '10px', border: 'none', background: viewerEngine === 'direct' ? 'var(--primary-emerald)' : '#e2e8f0', color: viewerEngine === 'direct' ? '#fff' : '#475569', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Native
                </button>
              </div>


              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <a
                  href={getCleanDocumentUrl(getDocRawUrl(previewDoc))}
                  download
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="fas fa-download"></i> Download
                </a>
                <a
                  href={getCleanDocumentUrl(getDocRawUrl(previewDoc))}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.65rem', color: 'var(--primary-dark)', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  New Tab <i className="fas fa-external-link-alt" style={{ marginLeft: '0.1rem' }}></i>
                </a>
              </div>
            </div>

            {/* Modal Reader Frame Area */}
            <div style={{ flex: 1, background: '#f1f5f9', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {viewerEngine === 'direct' && (
                <div style={{ background: '#f8fafc', color: '#334155', borderBottom: '1px solid #e2e8f0', padding: '0.2rem 0.65rem', fontSize: '0.65rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem', flexWrap: 'wrap' }}>
                  <span>
                    <i className="fas fa-eye" style={{ marginRight: '0.2rem', color: '#059669' }}></i>
                    Native Browser Reader:
                  </span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => setViewerEngine('google')}
                      style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '1px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.63rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                    >
                      <i className="fab fa-google"></i> Google Viewer
                    </button>
                  </div>
                </div>
              )}


              <div style={{ flex: 1, width: '100%', height: '100%', background: '#ffffff', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <iframe
                  key={viewerEngine + '_' + getCleanDocumentUrl(getDocRawUrl(previewDoc))}
                  src={getEmbedViewerUrl(previewDoc)}
                  title={previewDoc.title || 'Document Reader'}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', width: '100%', height: '100%', flex: 1, background: '#ffffff' }}
                  allowFullScreen
                />
              </div>
            </div>

            {/* Modal Footer Bar */}
            <div
              style={{
                padding: '0.35rem 0.65rem',
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.7rem',
                color: '#475569',
                flexWrap: 'nowrap',
                gap: '0.35rem'
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                <i className="fas fa-book" style={{ color: 'var(--accent-gold)', marginRight: '0.2rem' }}></i>
                <strong>{previewDoc.title}</strong>
              </span>
              <a
                href={getCleanDocumentUrl(getDocRawUrl(previewDoc))}
                download
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className="fas fa-file-download"></i> Save File
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}


      {editingBook && (
        <AdminEditModal
          item={editingBook}
          onClose={() => setEditingBook(null)}
          onSuccess={() => {
            setEditingBook(null);
            window.dispatchEvent(new CustomEvent('admin_content_updated'));
          }}
        />
      )}
    </div>
  );
}
