import React, { useState, useEffect } from 'react';

export default function HadithView({ openReportModal }) {
  const [hadiths, setHadiths] = useState([]);
  const [booksList, setBooksList] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/hadith/?q=${encodeURIComponent(query)}&book=${encodeURIComponent(selectedBook)}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setHadiths(data.results || []);
        setBooksList(data.books_list || []);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, selectedBook, page]);

  const copyHadith = (text, book, num) => {
    navigator.clipboard.writeText(`"${text}" [${book} #${num}]`);
    alert("Hadith copied to clipboard!");
  };

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-scroll" style={{ color: 'var(--accent-gold)' }}></i> Authentic Hadith Collections</h1>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-search"></i> Search:</span>
          <input
            type="text"
            className="filter-input"
            placeholder="Search translation, chapter, narrator..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-book"></i> Hadith Book:</span>
          <select
            className="filter-select"
            value={selectedBook}
            onChange={(e) => { setSelectedBook(e.target.value); setPage(1); }}
          >
            <option value="">All Collections</option>
            {booksList.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading Hadiths...</p>
        </div>
      ) : (
        <div className="grid-2">
          {hadiths.map((h) => (
            <div key={h.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)', background: 'var(--accent-gold-light)', padding: '4px 12px', borderRadius: '15px' }}>
                  {h.book_name} #{h.hadith_number}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>{h.grade}</span>
                  <button
                    className="verse-btn"
                    title="Copy Hadith"
                    onClick={() => copyHadith(h.translation, h.book_name, h.hadith_number)}
                  >
                    <i className="far fa-copy"></i>
                  </button>
                  <button
                    className="verse-btn"
                    title="Report Issue"
                    onClick={() => openReportModal('hadith', `${h.book_name} #${h.hadith_number}`)}
                  >
                    <i className="far fa-flag"></i>
                  </button>
                </div>
              </div>

              {h.chapter && (
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Chapter: {h.chapter}
                </p>
              )}

              <p className="arabic-font" style={{ fontSize: '1.4rem', color: 'var(--primary-emerald)', lineHeight: '1.8', marginBottom: '1rem' }}>{h.arabic_text}</p>
              
              {h.narrated_by && (
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Narrated by: {h.narrated_by}
                </p>
              )}
              
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.6' }}>"{h.translation}"</p>
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
