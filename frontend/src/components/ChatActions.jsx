import React from 'react';

export default function ChatActions({ actions = [] }) {
  if (!Array.isArray(actions)) return null;
  const links = actions.filter(action => typeof action?.label === 'string' && typeof action?.url === 'string' && (/^\/(?!\/)/.test(action.url) || /^https?:\/\//i.test(action.url)));
  if (!links.length) return null;
  return <nav className="chat-page-links" aria-label="Open website pages">{links.map((link, index) => <a key={`${link.url}-${index}`} href={link.url}>{link.label}<span aria-hidden="true"> ↗</span></a>)}</nav>;
}
