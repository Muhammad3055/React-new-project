import React from 'react';

/**
 * Reusable Pagination component for content lists across Maktab Tul Muslim
 * 
 * Props:
 * - currentPage: number (1-indexed)
 * - totalItems: number
 * - itemsPerPage: number
 * - onPageChange: (newPage: number) => void
 * - scrollToTopId: string (optional element ID to scroll into view upon page change)
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 9,
  onPageChange,
  scrollToTopId = null
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    if (scrollToTopId) {
      const el = document.getElementById(scrollToTopId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array with ellipsis if many pages
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className="pagination-container"
      style={{
        marginTop: '2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.85rem'
      }}
    >
      {/* Page summary info */}
      <div style={{ fontSize: '0.85rem', color: '#78716c', fontWeight: 600 }}>
        Showing <strong style={{ color: 'var(--accent-gold)' }}>{startItem}–{endItem}</strong> of{' '}
        <strong style={{ color: '#1c1917' }}>{totalItems}</strong> items (Page {currentPage} of {totalPages})
      </div>

      {/* Pagination control buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: '12px',
            border: '1.5px solid #e7e5e4',
            background: currentPage === 1 ? '#f5f5f4' : '#ffffff',
            color: currentPage === 1 ? '#a8a29e' : '#1c1917',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all 0.2s ease',
            boxShadow: currentPage === 1 ? 'none' : '0 2px 6px rgba(0,0,0,0.04)'
          }}
        >
          <i className="fas fa-chevron-left" style={{ fontSize: '0.75rem' }}></i> Previous
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((num, idx) => {
          if (num === '...') {
            return (
              <span
                key={`dots-${idx}`}
                style={{
                  padding: '0.45rem 0.6rem',
                  color: '#a8a29e',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                ...
              </span>
            );
          }

          const isActive = num === currentPage;
          return (
            <button
              key={`page-${num}`}
              onClick={() => handlePageClick(num)}
              style={{
                minWidth: '36px',
                height: '36px',
                padding: '0 0.5rem',
                borderRadius: '10px',
                border: isActive ? '2px solid var(--accent-gold)' : '1.5px solid #e7e5e4',
                background: isActive ? 'var(--accent-gold)' : '#ffffff',
                color: isActive ? '#022c22' : '#1c1917',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(180,83,9,0.25)' : '0 2px 5px rgba(0,0,0,0.03)'
              }}
            >
              {num}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: '12px',
            border: '1.5px solid #e7e5e4',
            background: currentPage === totalPages ? '#f5f5f4' : '#ffffff',
            color: currentPage === totalPages ? '#a8a29e' : '#1c1917',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all 0.2s ease',
            boxShadow: currentPage === totalPages ? 'none' : '0 2px 6px rgba(0,0,0,0.04)'
          }}
        >
          Next <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem' }}></i>
        </button>
      </div>
    </div>
  );
}
