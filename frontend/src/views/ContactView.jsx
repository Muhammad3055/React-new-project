import React, { useState } from 'react';

export default function ContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState({ type: '', text: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResponseMsg({ type: '', text: '' });

    fetch('/api/contact/submit/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.status === 'success') {
          setResponseMsg({ type: 'success', text: data.message });
          setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
          setResponseMsg({ type: 'error', text: data.error || 'Failed to send message.' });
        }
      })
      .catch(() => {
        setSubmitting(false);
        setResponseMsg({ type: 'error', text: 'Network error submitting contact form.' });
      });
  };

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-envelope-open-text" style={{ color: 'var(--accent-gold)' }}></i> Contact Us & Feedback</h1>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
        {/* Left Side: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', color: '#fff', border: '2px solid var(--accent-gold)', borderRadius: '20px' }}>
            <h2 className="arabic-font" style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>وَقُل رَّبِّ زِدْنِي عِلْمًا</h2>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>Get in Touch with Portal Admins</h3>
            <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.6' }}>
              Have questions, feedback, content suggestions, or partnership inquiries? Fill out the contact form or reach out through our official support channels.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)' }}>Email Support</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>support@quranportal.org</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                <i className="fas fa-clock"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)' }}>Support Hours</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monday &ndash; Saturday (9:00 AM &ndash; 6:00 PM EST)</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                <i className="fas fa-globe"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)' }}>Global Community</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Serving millions of Quran learners worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
            <i className="fas fa-paper-plane" style={{ color: 'var(--accent-gold)' }}></i> Send Us a Message
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-input"
                placeholder="Feedback / Question / Inquiry..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                className="form-textarea"
                rows="5"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            {responseMsg.text && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  background: responseMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: responseMsg.type === 'success' ? '#15803d' : '#b91c1c',
                }}
              >
                {responseMsg.text}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={submitting}>
              <i className="fas fa-paper-plane"></i> {submitting ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
