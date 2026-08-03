import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiCache';
import { getAdminItems, deleteContentItem } from '../utils/adminContentStore';

export default function HadithView({ openReportModal, user }) {
  const [hadiths, setHadiths] = useState([]);
  const [booksList, setBooksList] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    fetch(getApiUrl(`/api/hadith/?q=${encodeURIComponent(debouncedQuery)}&book=${encodeURIComponent(selectedBook)}&grade=${encodeURIComponent(selectedGrade)}&page=${page}`))
      .then(res => res.json())
      .then(data => {
        const apiHadiths = data.results || [];
        const adminHadiths = getAdminItems('hadith').map(item => ({
          id: item.id,
          book_name: 'Admin Post',
          hadith_number: 'Post',
          grade: 'Authentic',
          chapter: item.title || 'Admin Article',
          arabic_text: item.description || '',
          translation: item.description || item.title,
          narrated_by: item.author || item.speaker || 'Admin',
          addedByAdmin: true
        }));
        setHadiths([...adminHadiths, ...apiHadiths]);
        setBooksList(data.books_list || []);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      })
      .catch(() => {
        const adminHadiths = getAdminItems('hadith').map(item => ({
          id: item.id,
          book_name: 'Admin Post',
          hadith_number: 'Post',
          grade: 'Authentic',
          chapter: item.title || 'Admin Article',
          arabic_text: item.description || '',
          translation: item.description || item.title,
          narrated_by: item.author || item.speaker || 'Admin',
          addedByAdmin: true
        }));
        setHadiths(adminHadiths);
        setLoading(false);
      });
  }, [debouncedQuery, selectedBook, selectedGrade, page]);

  useEffect(() => {
    const handleUpdate = () => {
      const adminHadiths = getAdminItems('hadith').map(item => ({
        id: item.id,
        book_name: 'Admin Post',
        hadith_number: 'Post',
        grade: 'Authentic',
        chapter: item.title || 'Admin Article',
        arabic_text: item.description || '',
        translation: item.description || item.title,
        narrated_by: item.author || item.speaker || 'Admin',
        addedByAdmin: true
      }));
      setHadiths(prev => [...adminHadiths, ...prev.filter(x => !x.addedByAdmin)]);
    };
    window.addEventListener('admin_content_updated', handleUpdate);
    return () => window.removeEventListener('admin_content_updated', handleUpdate);
  }, []);

  const copyHadith = (text, book, num, grade) => {
    navigator.clipboard.writeText(`"${text}" [${book} #${num} - Grade: ${grade}]`);
    alert("Hadith copied to clipboard!");
  };

  const renderGradeBadge = (grade = '') => {
    const g = grade.toLowerCase();
    if (g.includes('sahih') || g.includes('authentic')) {
      return (
        <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700, background: '#dcfce7', border: '1px solid #86efac', padding: '3px 10px', borderRadius: '15px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <i className="fas fa-check-circle"></i> Sahih (Authentic)
        </span>
      );
    }
    if (g.includes('hasan') || g.includes('good')) {
      return (
        <span style={{ fontSize: '0.78rem', color: '#0369a1', fontWeight: 700, background: '#e0f2fe', border: '1px solid #7dd3fc', padding: '3px 10px', borderRadius: '15px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <i className="fas fa-star"></i> Hasan (Good)
        </span>
      );
    }
    if (g.includes('da') || g.includes('weak')) {
      return (
        <span style={{ fontSize: '0.78rem', color: '#b91c1c', fontWeight: 700, background: '#fee2e2', border: '1px solid #fca5a5', padding: '3px 10px', borderRadius: '15px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <i className="fas fa-exclamation-triangle"></i> Da'if (Weak)
        </span>
      );
    }
    return (
      <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', padding: '3px 10px', borderRadius: '15px' }}>
        {grade}
      </span>
    );
  };

  const gradesOptions = [
    { value: '', label: 'All Grades', icon: 'fas fa-layer-group' },
    { value: 'Sahih', label: 'Sahih (Authentic)', icon: 'fas fa-check-circle', color: '#15803d' },
    { value: 'Hasan', label: 'Hasan (Good)', icon: 'fas fa-star', color: '#0369a1' },
    { value: 'Da\'if', label: 'Da\'if (Weak)', icon: 'fas fa-exclamation-triangle', color: '#b91c1c' },
  ];

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">
          <i className="fas fa-scroll" style={{ color: 'var(--accent-gold)' }}></i> Hadith Collections & Authenticity Grades
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '650px', marginInline: 'auto' }}>
          Explore sayings and traditions of Prophet Muhammad (ﷺ), verified with scholars’ authenticity ratings: <strong>Sahih</strong> (Authentic), <strong>Hasan</strong> (Good), and <strong>Da'if</strong> (Weak).
        </p>
      </div>

      {/* Grade Authenticity Filter Toggle Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {gradesOptions.map((g) => (
          <button
            key={g.value}
            onClick={() => { setSelectedGrade(g.value); setPage(1); }}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '25px',
              border: selectedGrade === g.value ? '2px solid var(--accent-gold)' : '1.5px solid #cbd5e1',
              background: selectedGrade === g.value ? 'rgba(245, 158, 11, 0.2)' : '#ffffff',
              color: selectedGrade === g.value ? '#b45309' : '#000000',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.25s ease',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
            }}
          >
            <i className={g.icon} style={{ color: g.color || 'var(--accent-gold)', fontSize: '1rem' }}></i>
            <span style={{ color: selectedGrade === g.value ? '#b45309' : '#000000' }}>{g.label}</span>
          </button>
        ))}
      </div>

      <div className="filter-bar" style={{ marginBottom: '2rem' }}>
        <div className="filter-group" style={{ flex: 1 }}>
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
            <div key={h.id} className="card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', background: 'linear-gradient(145deg, rgba(3, 45, 35, 0.9), rgba(2, 30, 24, 0.95))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#022c22', background: 'var(--accent-gold)', padding: '4px 12px', borderRadius: '15px' }}>
                  {h.book_name} #{h.hadith_number}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {renderGradeBadge(h.grade)}
                  <button
                    className="verse-btn"
                    title="Copy Hadith"
                    onClick={() => copyHadith(h.translation, h.book_name, h.hadith_number, h.grade)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <i className="far fa-copy"></i>
                  </button>
                  <button
                    className="verse-btn"
                    title="Report Issue"
                    onClick={() => openReportModal('hadith', `${h.book_name} #${h.hadith_number}`)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <i className="far fa-flag"></i>
                  </button>

                  {(user?.is_staff || user?.is_superuser || h.addedByAdmin) && (
                    <button
                      onClick={() => deleteContentItem(h.id, 'hadith')}
                      style={{ background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      title="Delete Hadith as Admin"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  )}
                </div>
              </div>

              {h.chapter && (
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.75rem' }}>
                  <i className="fas fa-bookmark" style={{ marginRight: '0.4rem' }}></i> Chapter: {h.chapter}
                </p>
              )}

              <p className="arabic-font" style={{ fontSize: '1.4rem', color: '#6ee7b7', lineHeight: '1.9', marginBottom: '1rem', textAlign: 'right' }}>{h.arabic_text}</p>
              
              {h.narrated_by && (
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                  <i className="fas fa-user"></i> Narrated by: {h.narrated_by}
                </p>
              )}
              
              <p style={{ fontSize: '0.95rem', color: '#f8fafc', fontStyle: 'italic', lineHeight: '1.6' }}>"{h.translation}"</p>
            </div>
          ))}

          {hadiths.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <i className="fas fa-info-circle fa-2x" style={{ color: 'var(--accent-gold)', marginBottom: '0.75rem' }}></i>
              <p>No Hadiths found matching your selected criteria.</p>
            </div>
          )}
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
