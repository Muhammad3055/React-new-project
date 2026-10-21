import React from 'react';

export default function ChatFormattedText({ text }) {
  const parts = String(text || '').split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return <span style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const safe = /^https?:\/\//i.test(link[2]) || /^\/(?!\/)/.test(link[2]);
      return safe ? <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a> : <span key={index}>{link[1]}</span>;
    }
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return part;
  })}</span>;
}
