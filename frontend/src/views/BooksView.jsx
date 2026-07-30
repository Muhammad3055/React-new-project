import React, { useState, useEffect } from 'react';
import { fetchWithCache } from '../utils/apiCache';
import { getAdminItems } from '../utils/adminContentStore';

export default function BooksView({ openReportModal }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFileType, setSelectedFileType] = useState(''); // '' | 'pdf' | 'doc' | 'ppt' | 'book'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null); // Document selected for modal viewing
  const [viewerEngine, setViewerEngine] = useState('direct'); // 'direct' | 'office' | 'google'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fileTypeOptions = [
    { id: '', label: 'All Formats', icon: 'fas fa-layer-group', color: 'var(--primary-dark)' },
    { id: 'book', label: 'Books (100+ Pages)', icon: 'fas fa-book', color: '#d97706' },
    { id: 'pdf', label: 'PDF Documents', icon: 'fas fa-file-pdf', color: '#dc2626' },
    { id: 'doc', label: 'Word Documents', icon: 'fas fa-file-word', color: '#2563eb' },
    { id: 'ppt', label: 'PPT Presentations', icon: 'fas fa-file-powerpoint', color: '#ea580c' },
  ];

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
    fetch(`/api/books/?q=${encodeURIComponent(debouncedQuery)}&category=${encodeURIComponent(selectedCategory)}&file_type=${encodeURIComponent(selectedFileType)}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        const apiBooks = data.results || [];
        const adminBooks = getAdminItems('books').map(item => ({
          id: item.id,
          title: item.title,
          author: item.author || 'Admin Upload',
          file_type: 'pdf',
          pdf_url: item.fileUrl || item.pdf_url,
          cover_url: item.cover_url || '',
          language: item.language || 'Urdu / Brahui',
          description: item.description || 'Uploaded by Administrator'
        }));
        setBooks([...adminBooks, ...apiBooks]);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      })
      .catch(() => {
        const adminBooks = getAdminItems('books').map(item => ({
          id: item.id,
          title: item.title,
          author: item.author || 'Admin Upload',
          file_type: 'pdf',
          pdf_url: item.fileUrl || item.pdf_url,
          cover_url: item.cover_url || '',
          language: item.language || 'Urdu / Brahui',
          description: item.description || 'Uploaded by Administrator'
        }));
        setBooks(adminBooks);
        setLoading(false);
      });
  }, [debouncedQuery, selectedCategory, selectedFileType, page]);


  const getFormatBadge = (fileType) => {
    switch (fileType) {
      case 'doc':
        return { label: 'Word DOCX', icon: 'fas fa-file-word', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'ppt':
        return { label: 'PPT Presentation', icon: 'fas fa-file-powerpoint', bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' };
      case 'book':
        return { label: 'Book (100+ Pages)', icon: 'fas fa-book', bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'pdf':
      default:
        return { label: 'PDF Document', icon: 'fas fa-file-pdf', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
    }
  };

  const isLocalUrl = (url) => {
    if (!url) return true;
    return url.includes('127.0.0.1') || url.includes('localhost') || url.startsWith('/') || !url.startsWith('http');
  };

  const getCleanDocumentUrl = (url) => {
    if (!url) return '';
    let clean = url;
    clean = clean.replace(/^https?:\/\/(127\.0\.0\.1|localhost):8000\/media\//, '/media/');
    clean = clean.replace(/^https?:\/\/(127\.0\.0\.1|localhost):3000\/media\//, '/media/');
    if (clean.startsWith('/')) {
      return `${window.location.origin}${clean}`;
    }
    return clean;
  };

  const isPdfFormat = (doc) => {
    if (!doc) return false;
    if (doc.file_type === 'pdf' || doc.file_type === 'book') return true;
    const url = (doc.document_url || '').toLowerCase();
    return url.endsWith('.pdf') || url.includes('.pdf');
  };

  const getEmbedViewerUrl = (doc) => {
    if (!doc || !doc.document_url) return '';
    
    const fullUrl = getCleanDocumentUrl(doc.document_url);

    // For PDFs or Direct mode: browser native PDF renderer handles fullUrl directly
    if (isPdfFormat(doc) || viewerEngine === 'direct') {
      return fullUrl;
    }

    if (viewerEngine === 'google') {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
    }

    // Default Office Web Viewer for DOC and PPT
    if (doc.file_type === 'doc' || doc.file_type === 'ppt') {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;
    }

    return fullUrl;
  };

  const handleOpenDocModal = (doc) => {
    setPreviewDoc(doc);
    setIsFullscreen(false);
    // If PDF, use native direct viewer engine; if office doc, default to direct/office engine
    if (isPdfFormat(doc)) {
      setViewerEngine('direct');
    } else {
      setViewerEngine(isLocalUrl(doc.document_url) ? 'direct' : 'office');
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="section-title">
          <i className="fas fa-book-reader" style={{ color: 'var(--accent-gold)' }}></i> Islamic Library & Resource Center
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Read online in high clarity or download Islamic Books, PDF Documents, Word Files (.docx), and Presentation Slides (.pptx).
        </p>
      </div>

      {/* Format Toggle Pill Bar */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {fileTypeOptions.map((opt) => {
          const isActive = selectedFileType === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => { setSelectedFileType(opt.id); setPage(1); }}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '30px',
                border: isActive ? `2px solid ${opt.color}` : '1px solid #cbd5e1',
                background: isActive ? opt.color : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <i className={opt.icon} style={{ color: isActive ? '#ffffff' : opt.color }}></i>
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar + View Mode Switcher */}
      <div className="filter-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
          <div className="filter-group" style={{ flex: 2, minWidth: '220px' }}>
            <span className="filter-label"><i className="fas fa-search"></i> Search:</span>
            <input
              type="text"
              className="filter-input"
              placeholder="Search book title, author, topics..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          </div>

          <div className="filter-group" style={{ flex: 1, minWidth: '180px' }}>
            <span className="filter-label"><i className="fas fa-folder"></i> Category:</span>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
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
                    href={bk.document_url}
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
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT LIST VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {books.map((bk) => {
            const badge = getFormatBadge(bk.file_type);
            return (
              <div
                key={bk.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
                  <img
                    src={bk.cover_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80"}
                    alt={bk.title}
                    style={{ width: '56px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                        <i className={badge.icon}></i> {badge.label}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                        {bk.pages_count} {bk.file_type === 'ppt' ? 'Slides' : 'Pages'} &bull; {bk.language}
                      </span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary-dark)', fontWeight: 700 }}>{bk.title}</h3>
                    <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Author: {bk.author}
                    </p>
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
                    href={bk.document_url}
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
      {previewDoc && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isFullscreen ? '0' : '1rem'
          }}
          onClick={() => setPreviewDoc(null)}
        >
          <div
            style={{
              width: isFullscreen ? '100vw' : '100%',
              maxWidth: isFullscreen ? '100vw' : '1150px',
              height: isFullscreen ? '100vh' : '92vh',
              background: '#ffffff',
              borderRadius: isFullscreen ? '0' : '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '0.85rem 1.5rem',
                background: 'var(--primary-dark)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid var(--accent-gold)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', overflow: 'hidden' }}>
                <span
                  style={{
                    padding: '0.35rem 0.7rem',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className={getFormatBadge(previewDoc.file_type).icon}></i>
                </span>
                <div style={{ overflow: 'hidden' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {previewDoc.title}
                  </h3>
                  <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                    Author: {previewDoc.author} &bull; {previewDoc.file_type_display || previewDoc.file_type} ({previewDoc.pages_count} {previewDoc.file_type === 'ppt' ? 'Slides' : 'Pages'})
                  </p>
                </div>
              </div>

              {/* Action Toolbar Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reader"}
                >
                  <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"}></i>
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>

                <a
                  href={previewDoc.document_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="btn-play"
                  style={{ background: '#059669', borderColor: '#059669', color: '#ffffff', fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
                >
                  <i className="fas fa-download"></i> Save File
                </a>

                <button
                  onClick={() => setPreviewDoc(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px'
                  }}
                  title="Close Viewer"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Sub-Header Toolbar: Engine Switcher & External Link */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.5rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Viewer Engine:</span>
                <button
                  onClick={() => setViewerEngine('direct')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: viewerEngine === 'direct' ? '1px solid #d97706' : '1px solid #cbd5e1',
                    background: viewerEngine === 'direct' ? '#fffbeb' : '#ffffff',
                    color: viewerEngine === 'direct' ? '#d97706' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {isPdfFormat(previewDoc) ? 'Native PDF Reader' : 'Direct Embed'}
                </button>
                <button
                  onClick={() => setViewerEngine('office')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: viewerEngine === 'office' ? '1px solid #2563eb' : '1px solid #cbd5e1',
                    background: viewerEngine === 'office' ? '#eff6ff' : '#ffffff',
                    color: viewerEngine === 'office' ? '#2563eb' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Microsoft Office
                </button>
                <button
                  onClick={() => setViewerEngine('google')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: viewerEngine === 'google' ? '1px solid #16a34a' : '1px solid #cbd5e1',
                    background: viewerEngine === 'google' ? '#f0fdf4' : '#ffffff',
                    color: viewerEngine === 'google' ? '#16a34a' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Google Docs
                </button>
              </div>

              <a
                href={previewDoc.document_url}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 700, textDecoration: 'none' }}
              >
                Open File in New Tab <i className="fas fa-external-link-alt" style={{ marginLeft: '0.2rem' }}></i>
              </a>
            </div>

            {/* Modal Reader Frame Area */}
            <div style={{ flex: 1, background: '#f1f5f9', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {isLocalUrl(previewDoc.document_url) && viewerEngine !== 'direct' && (
                <div style={{ background: '#fef3c7', color: '#92400e', borderBottom: '1px solid #fde68a', padding: '0.5rem 1.5rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    <i className="fas fa-info-circle" style={{ marginRight: '0.4rem' }}></i>
                    <strong>Notice:</strong> Cloud viewers (Office/Google) cannot open private localhost URLs. Switched to <strong>Native Reader</strong> for seamless viewing.
                  </span>
                  <button
                    onClick={() => setViewerEngine('direct')}
                    style={{ background: '#d97706', color: '#fff', border: 'none', padding: '0.25rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    Switch to Native Viewer
                  </button>
                </div>
              )}

              {isPdfFormat(previewDoc) || viewerEngine === 'direct' ? (
                isPdfFormat(previewDoc) ? (
                  /* Multi-layer Native PDF Viewer */
                  <object
                    data={getEmbedViewerUrl(previewDoc)}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ flex: 1, width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
                  >
                    <embed
                      src={getEmbedViewerUrl(previewDoc)}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                    />
                    <iframe
                      src={getEmbedViewerUrl(previewDoc)}
                      title={previewDoc.title}
                      width="100%"
                      height="100%"
                      style={{ border: 'none', flex: 1, background: '#ffffff' }}
                      allowFullScreen
                    >
                      <div style={{ padding: '2.5rem', textAlign: 'center', background: '#ffffff', color: '#334155' }}>
                        <i className="fas fa-file-pdf" style={{ fontSize: '3rem', color: '#dc2626', marginBottom: '1rem' }}></i>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>PDF Document Ready</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                          Click below to view this PDF directly in your browser or save it to your computer.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                          <a href={getCleanDocumentUrl(previewDoc.document_url)} target="_blank" rel="noreferrer" className="btn-play">
                            <i className="fas fa-external-link-alt"></i> Open PDF in Browser
                          </a>
                          <a href={getCleanDocumentUrl(previewDoc.document_url)} download target="_blank" rel="noreferrer" className="btn-play" style={{ background: '#059669', borderColor: '#059669', color: '#fff' }}>
                            <i className="fas fa-download"></i> Save PDF
                          </a>
                        </div>
                      </div>
                    </iframe>
                  </object>
                ) : (
                  /* Word (DOCX/DOC) & PowerPoint (PPTX/PPT) Dedicated Interactive Reader Panel */
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem', background: '#ffffff', textAlign: 'center' }}>
                    <div style={{ width: '84px', height: '84px', borderRadius: '24px', background: previewDoc.file_type === 'doc' ? '#eff6ff' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: previewDoc.file_type === 'doc' ? '#2563eb' : '#ea580c', marginBottom: '1.25rem', boxShadow: '0 10px 25px rgba(0,0,0,0.07)', border: previewDoc.file_type === 'doc' ? '1px solid #bfdbfe' : '1px solid #fed7aa' }}>
                      <i className={previewDoc.file_type === 'doc' ? 'fas fa-file-word' : 'fas fa-file-powerpoint'}></i>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '0 0 0.5rem 0' }}>
                      {previewDoc.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '540px', lineHeight: '1.6', marginBottom: '1.75rem' }}>
                      This <strong>{previewDoc.file_type === 'doc' ? 'Microsoft Word (.docx / .doc)' : 'PowerPoint (.pptx / .ppt)'}</strong> document is ready for viewing and download. Open it directly in your browser or save it to your device.
                    </p>

                    <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <a
                        href={getCleanDocumentUrl(previewDoc.document_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-play"
                        style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', borderRadius: '25px' }}
                      >
                        <i className="fas fa-external-link-alt"></i> Open Document in Browser
                      </a>
                      <a
                        href={getCleanDocumentUrl(previewDoc.document_url)}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="btn-play"
                        style={{ background: '#059669', borderColor: '#059669', color: '#ffffff', padding: '0.75rem 1.6rem', fontSize: '0.95rem', borderRadius: '25px' }}
                      >
                        <i className="fas fa-file-download"></i> Save & Open in Office
                      </a>
                    </div>
                  </div>
                )
              ) : (
                /* Cloud Viewers (Google Docs / Microsoft Office Web Viewer for Production) */
                <iframe
                  src={getEmbedViewerUrl(previewDoc)}
                  title={previewDoc.title}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', flex: 1, background: '#ffffff' }}
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem',
                color: '#475569'
              }}
            >
              <span>
                <i className="fas fa-book" style={{ color: 'var(--accent-gold)', marginRight: '0.4rem' }}></i>
                <strong>{previewDoc.title}</strong> &bull; {previewDoc.author} ({previewDoc.language})
              </span>
              <a
                href={getCleanDocumentUrl(previewDoc.document_url)}
                download
                target="_blank"
                rel="noreferrer"
                style={{ color: '#059669', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <i className="fas fa-file-download"></i> Save to Computer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
