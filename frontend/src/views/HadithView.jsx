import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiCache';
import { useLanguage } from '../context/LanguageContext';
import { deleteContentItem, filterOutDeleted } from '../utils/adminContentStore';
import Pagination from '../components/Pagination';

export default function HadithView({ openReportModal, user }) {
  const { t } = useLanguage();
  const [hadiths, setHadiths] = useState([]);
  const [booksList, setBooksList] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const syncSearch = () => {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) { setQuery(q); setPage(1); }
    };
    syncSearch();
    window.addEventListener('popstate', syncSearch);
    return () => window.removeEventListener('popstate', syncSearch);
  }, []);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    fetch(getApiUrl(`/api/hadith/?q=${encodeURIComponent(debouncedQuery)}&book=${encodeURIComponent(selectedBook)}&grade=${encodeURIComponent(selectedGrade)}&page=${page}`))
      .then(res => { if (!res.ok) throw new Error('Hadith request failed'); return res.json(); })
      .then(data => {
        if (!active) return;
        setHadiths(filterOutDeleted(data.results || []));
        setBooksList(data.books_list || []);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setHadiths([]);
        setBooksList([]);
        setTotalPages(1);
        setLoadError(true);
        setLoading(false);
      });
    return () => { active = false; };
  }, [debouncedQuery, selectedBook, selectedGrade, page]);

  const formatHadithForShare = (hadith) => [
    hadith.arabic_text,
    hadith.translation,
    [hadith.collection_name || hadith.book_name || hadith.collection, hadith.book_title || hadith.book, hadith.hadith_number && `#${hadith.hadith_number}`].filter(Boolean).join(' · '),
    hadith.grade && `Grade: ${hadith.grade}`,
    hadith.reference || hadith.source
  ].filter(Boolean).join('\n\n');

  const copyHadith = (hadith) => {
    const fullText = `${formatHadithForShare(hadith)}\n\nShared via Maktaba Tul Muslim (https://maktabatulmuslim.com)`;
    navigator.clipboard.writeText(fullText);
    alert("Hadith copied to clipboard!");
  };

  const shareHadith = (hadith) => {
    const fullText = `${formatHadithForShare(hadith)}\n\nVia Maktaba Tul Muslim: https://maktabatulmuslim.com`;
    const collection = hadith.collection_name || hadith.book_name || hadith.collection || 'Hadith';
    if (navigator.share) {
      navigator.share({
        title: `${collection}${hadith.hadith_number ? ` #${hadith.hadith_number}` : ''}`,
        text: fullText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(fullText);
      alert("Hadith link copied to clipboard!");
    }
  };

  const renderGradeBadge = (grade = '') => {
    return <span className="hadith-grade-badge">{grade}</span>;
  };

  const gradesOptions = [
    { value: '', label: t('allGrades', 'All Grades'), icon: 'fas fa-layer-group' },
    { value: 'Sahih', label: t('sahihAuthentic', 'Sahih (Authentic)'), icon: 'fas fa-check-circle', color: '#15803d' },
    { value: 'Hasan', label: t('hasanGood', 'Hasan (Good)'), icon: 'fas fa-star', color: '#0369a1' },
  ];

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">
          <i className="fas fa-scroll" style={{ color: 'var(--accent-gold)' }}></i> {t('hadithCollectionsTitle', 'Hadith Collections & Authenticity Grades')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '650px', marginInline: 'auto' }} dangerouslySetInnerHTML={{ __html: t('exploreHadithsPart1', 'Explore sayings and traditions of Prophet Muhammad (ﷺ), verified with scholars’ authenticity ratings:') + ` <strong>Sahih</strong> (${t('authentic', 'Authentic')}) ${t('and', 'and')} <strong>Hasan</strong> (${t('good', 'Good')}).` }}>
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
              background: selectedGrade === g.value ? 'rgba(245, 158, 11, 0.2)' : 'var(--surface-paper)',
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
          <span className="filter-label"><i className="fas fa-search"></i> {t('searchLabel', 'Search:')}</span>
          <input
            type="text"
            className="filter-input"
            placeholder={t('searchHadithPlaceholder', 'Search translation, chapter, narrator...')}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label"><i className="fas fa-book"></i> {t('hadithBook', 'Hadith Book:')}</span>
          <select
            className="filter-select"
            value={selectedBook}
            onChange={(e) => { setSelectedBook(e.target.value); setPage(1); }}
          >
            <option value="">{t('allCollections', 'All Collections')}</option>
            {booksList.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-gold)' }}></i>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{t('loadingHadiths', 'Loading Hadiths...')}</p>
        </div>
      ) : loadError ? (
        <div className="hadith-empty-state" role="alert"><i className="fas fa-exclamation-circle" aria-hidden="true"></i><h3>Hadith collections could not be loaded</h3><p>Please check your connection and try again.</p></div>
      ) : hadiths.length === 0 ? (
        <div className="hadith-empty-state"><i className="fas fa-search" aria-hidden="true"></i><h3>{debouncedQuery || selectedBook || selectedGrade ? 'No search results' : t('hadithComingSoon', 'No Hadith records are available yet.')}</h3><p>{debouncedQuery || selectedBook || selectedGrade ? 'Try adjusting your search or filters.' : ''}</p></div>
      ) : (
        <div className="hadith-record-grid">
          {hadiths.map((h) => {
            const collection = h.collection_name || h.book_name || h.collection;
            const bookTitle = h.book_title || h.book;
            const reference = h.reference || h.source;
            const recordLabel = [collection, bookTitle, h.hadith_number && `#${h.hadith_number}`].filter(Boolean).join(' · ');
            return <article key={h.id} className="hadith-record-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                {recordLabel && <span className="hadith-record-reference">{recordLabel}</span>}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {h.grade && renderGradeBadge(h.grade)}
                  <button
                    title={t('copyHadith', 'Copy Hadith')}
                    onClick={() => copyHadith(h)}
                    className="verse-btn hadith-action-btn"
                  >
                    <i className="far fa-copy"></i>
                  </button>
                  <button
                    title={t('shareHadith', 'Share Hadith')}
                    onClick={() => shareHadith(h)}
                    className="verse-btn hadith-action-btn"
                  >
                    <i className="fas fa-share-alt"></i>
                  </button>
                  <button
                    title="Report Issue"
                    onClick={() => openReportModal('hadith', [collection, h.hadith_number && `#${h.hadith_number}`].filter(Boolean).join(' '))}
                    className="verse-btn hadith-action-btn"
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
                  <i className="fas fa-bookmark" style={{ marginRight: '0.4rem' }}></i> {t('chapter', 'Chapter:')} {h.chapter}
                </p>
              )}

              {h.arabic_text && <><h3 className="hadith-field-label">Arabic</h3><p className="arabic-font hadith-arabic-text" lang="ar" dir="rtl">{h.arabic_text}</p></>}
              
              {h.narrated_by && (
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                  <i className="fas fa-user"></i> {t('narratedBy', 'Narrated by:')} {h.narrated_by}
                </p>
              )}
              
              {h.translation && <><h3 className="hadith-field-label">Translation</h3><p className="hadith-translation">{h.translation}</p></>}
              {reference && <p className="hadith-source">Source: {reference}</p>}
            </article>;
          })}
        </div>
      )}

      {!loading && !loadError && hadiths.length > 0 && <Pagination
        currentPage={page}
        totalItems={hadiths.length}
        itemsPerPage={9}
        totalPagesOverride={totalPages}
        onPageChange={(p) => setPage(p)}
      />}
    </div>
  );
}
