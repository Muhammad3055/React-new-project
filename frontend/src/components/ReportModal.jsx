import React, { useState, useEffect } from 'react';

export default function ReportModal({ reportData, onClose }) {
  const [description, setDescription] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDescription('');
    setStatusMsg({ type: '', text: '' });
  }, [reportData]);

  if (!reportData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    fetch('/api/report/submit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content_type: reportData.contentType,
        content_id: reportData.contentId,
        description: description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false);
        if (data.status === 'success') {
          setStatusMsg({ type: 'success', text: data.message });
          setTimeout(() => {
            onClose();
          }, 1800);
        } else {
          setStatusMsg({ type: 'error', text: data.error || 'Failed to submit report.' });
        }
      })
      .catch((err) => {
        setSubmitting(false);
        setStatusMsg({ type: 'error', text: 'Network error submitting report.' });
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '550px' }}>
        <div className="modal-header">
          <h3><i className="fas fa-exclamation-triangle" style={{ color: 'var(--accent-gold)' }}></i> Report Content Error</h3>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Content Type</label>
              <input type="text" className="form-input" value={reportData.contentType} readOnly style={{ background: '#f1f5f9' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Content Identifier</label>
              <input type="text" className="form-input" value={reportData.contentId} readOnly style={{ background: '#f1f5f9' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Description of Issue / Error</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Please describe the typo, translation issue, or audio mistake..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {statusMsg.text && (
              <div
                style={{
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: statusMsg.type === 'success' ? '#15803d' : '#b91c1c',
                }}
              >
                {statusMsg.text}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={submitting}>
              <i className="fas fa-paper-plane"></i> {submitting ? 'Submitting...' : 'Submit Error Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
