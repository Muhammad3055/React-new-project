import React, { useState, useEffect } from 'react';

export default function BooksView({ openReportModal }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/books/?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.results || []);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, selectedCategory, page]);

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-book" style={{ color: 'var(--accent-gold)' }}></i> PDF Islamic Books Library</h1>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-search"></i> Search:</span>
          <input
            type="text"
            className="filter-input"
            placeholder="Search book title, author..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
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
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading Islamic PDF Books...</p>
        </div>
      ) : (
        <div className="grid-3">
          {books.map((bk) => (
            <div key={bk.id} className="card">
              <div className="media-cover-wrapper" style={{ height: '220px' }}>
                <img src={bk.cover_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80"} alt={bk.title} className="media-cover-img" />
              </div>

              <div className="card-body">
                <h3 className="card-title" style={{ fontSize: '1.15rem' }}>{bk.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                  <i className="fas fa-pen-nib"></i> {bk.author}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {bk.pages_count} Pages &bull; {bk.language}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{bk.description}</p>
              </div>

              <div className="card-footer">
                <a href={bk.document_url} target="_blank" rel="noreferrer" className="btn-play">
                  <i className="fas fa-file-pdf"></i> Read PDF Book
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
          ))}
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
    </div>
  );
}
