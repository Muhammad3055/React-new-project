import React from 'react';

export default function VideoModal({ videoData, onClose }) {
  if (!videoData) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{videoData.title}</h3>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '10px', background: '#000' }}>
            <iframe
              src={videoData.url}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={videoData.title}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
