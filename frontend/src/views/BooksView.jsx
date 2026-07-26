import React, { useState, useEffect } from 'react';

export default function BooksView({ openReportModal }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFileType, setSelectedFileType] = useState(''); // '' | 'pdf' | 'doc' | 'ppt' | 'book'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null); // Document selected for modal viewing
  const [viewerEngine, setViewerEngine] = useState('office'); // 'office' | 'google' | 'direct'

  const fileTypeOptions = [
    { id: '', label: 'All Formats', icon: 'fas fa-layer-group', color: 'var(--primary-dark)' },
    { id: 'book', label: 'Books (100+ Pages)', icon: 'fas fa-book', color: '#d97706' },
    { id: 'pdf', label: 'PDF Docs (< 100 Pages)', icon: 'fas fa-file-pdf', color: '#dc2626' },
    { id: 'doc', label: 'Word Documents', icon: 'fas fa-file-word', color: '#2563eb' },
    { id: 'ppt', label: 'PPT Presentations', icon: 'fas fa-file-powerpoint', color: '#ea580c' },
  ];

  useEffect(() => {
    fetch('/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/books/?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}&file_type=${encodeURIComponent(selectedFileType)}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.results || []);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, selectedCategory, selectedFileType, page]);

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
        return { label: 'PDF (< 100 Pages)', icon: 'fas fa-file-pdf', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
    }
  };

  const isLocalUrl = (url) => {
    if (!url) return true;
    return url.startsWith('/') || url.includes('127.0.0.1') || url.includes('localhost');
  };

  const getEmbedViewerUrl = (doc) => {
    if (!doc || !doc.document_url) return '';
    
    // Construct full URL if relative
    let fullUrl = doc.document_url;
    if (fullUrl.startsWith('/')) {
      fullUrl = `${window.location.origin}${fullUrl}`;
    }

    if (viewerEngine === 'google') {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
    }
    if (viewerEngine === 'direct') {
      return fullUrl;
    }

    // Default Office Web Viewer
    if (doc.file_type === 'doc' || doc.file_type === 'ppt') {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
  };

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title">
          <i className="fas fa-book-reader" style={{ color: 'var(--accent-gold)' }}></i> Islamic Library & Resource Center
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Read online or download Islamic Books, PDF Documents, Word Files (.docx), and Presentation Slides (.pptx).
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
                padding: '0.65rem 1.2rem',
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

      {/* Filters Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-search"></i> Search:</span>
          <input
            type="text"
            className="filter-input"
            placeholder="Search book title, author, topics..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-file-alt"></i> Format:</span>
          <select
            className="filter-select"
            value={selectedFileType}
            onChange={(e) => { setSelectedFileType(e.target.value); setPage(1); }}
          >
            <option value="">All Formats (PDF, Word, PPT, Books)</option>
            <option value="pdf">PDF Documents (.pdf)</option>
            <option value="doc">Word Documents (.docx)</option>
            <option value="ppt">PowerPoint Presentations (.pptx)</option>
            <option value="book">Books & E-Books</option>
          </select>
        </div>

        <div className="filter-group">
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
      ) : (
        <div className="grid-3">
          {books.map((bk) => {
            const badge = getFormatBadge(bk.file_type);
            return (
              <div key={bk.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="media-cover-wrapper" style={{ height: '210px', position: 'relative' }}>
                  <img
                    src={bk.cover_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80"}
                    alt={bk.title}
                    className="media-cover-img"
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
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                    }}
                  >
                    <i className={badge.icon}></i> {badge.label}
                  </span>
                </div>

                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.3rem' }}>{bk.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0.5rem 0' }}>
                    <i className="fas fa-pen-nib" style={{ color: 'var(--accent-gold)' }}></i> {bk.author}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <i className={bk.file_type === 'ppt' ? 'fas fa-file-powerpoint' : 'fas fa-file-alt'} style={{ marginRight: '0.3rem' }}></i>
                    {bk.file_type === 'ppt' ? `${bk.pages_count} Slides` : `${bk.pages_count} Pages`} &bull; {bk.language}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5', flex: 1 }}>{bk.description}</p>
                </div>

                {/* Card Action Buttons */}
                <div className="card-footer" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { setPreviewDoc(bk); setViewerEngine('office'); }}
                    className="btn-play"
                    style={{ flex: 1, minWidth: '120px', justifyContent: 'center', background: 'var(--primary-dark)', borderColor: 'var(--primary-dark)' }}
                  >
                    <i className="fas fa-eye"></i> Read Online
                  </button>

                  <a
                    href={bk.document_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="btn-play"
                    style={{ background: '#059669', borderColor: '#059669', color: '#fff', padding: '0.5rem 0.85rem' }}
                    title="Download File"
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

      {/* Online Document & Media Viewer Modal Overlay */}
      {previewDoc && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
          }}
          onClick={() => setPreviewDoc(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1050px',
              height: '90vh',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1rem 1.5rem',
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
                    padding: '0.3rem 0.6rem',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className={getFormatBadge(previewDoc.file_type).icon}></i>
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {previewDoc.title}
                  </h3>
                  <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                    Author: {previewDoc.author} &bull; {previewDoc.file_type_display || previewDoc.file_type}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a
                  href={previewDoc.document_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="btn-play"
                  style={{ background: '#059669', borderColor: '#059669', color: '#ffffff', fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
                >
                  <i className="fas fa-download"></i> Download File
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

            {/* Sub-Header Toolbar for Localhost / Public URL Switcher */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.5rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Viewer Mode:</span>
                <button
                  onClick={() => setViewerEngine('office')}
                  style={{
                    padding: '0.25rem 0.6rem',
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
                    padding: '0.25rem 0.6rem',
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
                <button
                  onClick={() => setViewerEngine('direct')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: viewerEngine === 'direct' ? '1px solid #d97706' : '1px solid #cbd5e1',
                    background: viewerEngine === 'direct' ? '#fffbeb' : '#ffffff',
                    color: viewerEngine === 'direct' ? '#d97706' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Direct Embed
                </button>
              </div>

              <a
                href={previewDoc.document_url}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 700, textDecoration: 'none' }}
              >
                Open Original File <i className="fas fa-external-link-alt"></i>
              </a>
            </div>

            {/* Modal Body: Local File Notice & iFrame Embedded Viewer */}
            <div style={{ flex: 1, background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
              {isLocalUrl(previewDoc.document_url) && (
                <div style={{ background: '#fef3c7', color: '#92400e', borderBottom: '1px solid #fde68a', padding: '0.65rem 1.5rem', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.4rem' }}></i>
                    <strong>Local File Notice:</strong> Microsoft/Google cloud viewers cannot access files stored on private <code>127.0.0.1</code> localhost URLs. Once deployed to a public server, full online preview will render automatically.
                  </span>
                  <a href={previewDoc.document_url} download className="btn-play" style={{ background: '#d97706', borderColor: '#d97706', color: '#fff', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                    <i className="fas fa-download"></i> Download & Open Local File
                  </a>
                </div>
              )}

              <iframe
                src={getEmbedViewerUrl(previewDoc)}
                title={previewDoc.title}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                allowFullScreen
              ></iframe>
            </div>

            {/* Modal Footer */}
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
                <i className="fas fa-file-alt" style={{ color: 'var(--accent-gold)' }}></i> {previewDoc.title} ({previewDoc.pages_count} Pages &bull; {previewDoc.language})
              </span>
              <a
                href={previewDoc.document_url}
                download
                target="_blank"
                rel="noreferrer"
                style={{ color: '#059669', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <i className="fas fa-file-download"></i> Save File to Computer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
