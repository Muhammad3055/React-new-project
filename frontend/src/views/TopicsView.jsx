import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../utils/apiCache';

const mediaSections = [
  { key: 'quran_audios', label: 'Quran recitations', icon: 'fa-headphones' },
  { key: 'lectures', label: 'Audio lectures', icon: 'fa-microphone' },
  { key: 'books', label: 'Books & documents', icon: 'fa-book-open' },
  { key: 'videos', label: 'Videos', icon: 'fa-video' },
];

const emptySelection = () => Object.fromEntries(mediaSections.map(section => [section.key, []]));

async function getJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
}

function canUseMediaUrl(url) {
  return typeof url === 'string' && (
    /^https?:\/\//i.test(url) || (url.startsWith('/') && !url.startsWith('//'))
  );
}

function TopicCard({ topic, onClick }) {
  const count = Object.values(topic.counts || {}).reduce((total, value) => total + value, 0);
  return <a href={`/topics?topic=${encodeURIComponent(topic.slug)}`} className="topic-card" onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) { event.preventDefault(); onClick(); } }}>
    <span className="topic-card-icon"><i className="fas fa-mosque" aria-hidden="true" /></span>
    <span className="topic-card-body"><strong>{topic.title}</strong><small>{topic.description}</small><span>{count} {count === 1 ? 'resource' : 'resources'} <i className="fas fa-arrow-right" aria-hidden="true" /></span></span>
  </a>;
}

function ResourceCard({ item, kind, playTrack }) {
  const canOpen = canUseMediaUrl(item.url);
  const isAudio = kind === 'quran_audios' || kind === 'lectures';
  const action = isAudio ? 'Listen now' : kind === 'videos' ? 'Watch video' : 'Open document';
  return <article className="topic-resource">
    {item.cover_url ? <img className="topic-resource-cover" src={item.cover_url} alt="" loading="lazy" /> : <span className="topic-resource-cover topic-resource-placeholder"><i className={`fas ${mediaSections.find(s => s.key === kind)?.icon}`} aria-hidden="true" /></span>}
    <div className="topic-resource-content"><h3>{item.title}</h3><p>{item.subtitle}</p>{item.duration && item.duration !== '00:00' && <small>{item.duration}</small>}</div>
    {canOpen ? (isAudio
      ? <button type="button" className="topic-resource-action" onClick={() => playTrack(item.url, item.title, item.subtitle)}><i className="fas fa-play" aria-hidden="true" /> {action}</button>
      : <a className="topic-resource-action" href={item.url} target="_blank" rel="noopener noreferrer">{action} <i className="fas fa-arrow-up" aria-hidden="true" /></a>) : <span className="topic-resource-unavailable">Media currently unavailable</span>}
  </article>;
}

export default function TopicsView({ user, playTrack }) {
  const isAdmin = Boolean(user?.is_staff || user?.is_superuser);
  const [topics, setTopics] = useState([]);
  const [activeSlug, setActiveSlug] = useState(() => new URLSearchParams(window.location.search).get('topic') || '');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminTopics, setAdminTopics] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [editor, setEditor] = useState(null);
  const [selected, setSelected] = useState(emptySelection);
  const [pickerKind, setPickerKind] = useState('quran_audios');
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editorError, setEditorError] = useState('');
  const [editorNotice, setEditorNotice] = useState('');

  const loadTopics = async () => {
    const data = await getJson(await fetch(getApiUrl('/api/topics/')));
    setTopics(data.results || []);
  };
  const loadAdminTopics = async () => {
    const data = await getJson(await fetch(getApiUrl('/api/admin/topics/'), { credentials: 'include' }));
    setAdminTopics(data.results || []);
    setCsrfToken(data.csrf_token || '');
  };

  useEffect(() => {
    loadTopics().catch(err => setEditorNotice(`Topic navigation unavailable: ${err.message}`));
  }, []);

  useEffect(() => {
    const onPopState = () => setActiveSlug(new URLSearchParams(window.location.search).get('topic') || '');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.title = `${activeSlug && detail ? detail.title : 'Explore Topics'} | Maktaba tul Muslim`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://maktabatulmuslim.com/topics${activeSlug ? `?topic=${encodeURIComponent(activeSlug)}` : ''}`);
  }, [activeSlug, detail]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    if (activeSlug) setDetail(null);
    const url = activeSlug ? `/api/topics/${encodeURIComponent(activeSlug)}/` : '/api/topics/';
    fetch(getApiUrl(url), { credentials: 'include' })
      .then(getJson)
      .then(data => {
        if (cancelled) return;
        if (activeSlug) setDetail(data);
        else { setTopics(data.results || []); setDetail(null); }
      })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeSlug]);

  useEffect(() => {
    if (!isAdmin) return;
    loadAdminTopics().catch(err => setEditorNotice(`Topic editing is unavailable: ${err.message}`));
  }, [isAdmin]);

  useEffect(() => {
    if (!editor) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = event => { if (event.key === 'Escape') setEditor(null); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [Boolean(editor)]);

  useEffect(() => {
    if (!editor) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ kind: pickerKind, q: search.trim() });
      fetch(getApiUrl(`/api/admin/topics/options/?${params}`), { credentials: 'include' })
        .then(getJson)
        .then(data => { if (!cancelled) setOptions(data.results || []); })
        .catch(err => { if (!cancelled) setEditorError(err.message); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [editor ? (editor.id || 'new') : null, pickerKind, search]);

  const navigate = (slug) => {
    const path = slug ? `/topics?topic=${encodeURIComponent(slug)}` : '/topics';
    window.history.pushState({}, '', path);
    setActiveSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditor = async (topic = null) => {
    setEditorError('');
    setEditorNotice('');
    setOptions([]);
    setSearch('');
    setPickerKind('quran_audios');
    if (!topic) {
      setSelected(emptySelection());
      setEditor({ title: '', slug: '', description: '', is_published: false });
      return;
    }
    try {
      const data = await getJson(await fetch(getApiUrl(`/api/topics/${encodeURIComponent(topic.slug)}/`), { credentials: 'include' }));
      setSelected(Object.fromEntries(mediaSections.map(section => [section.key, data.sections?.[section.key] || []])));
      setEditor({ id: data.id, slug: data.slug, title: data.title, description: data.description, is_published: data.is_published });
    } catch (err) { setEditorNotice(err.message); }
  };

  const toggleItem = (kind, item) => {
    setSelected(prev => {
      const exists = prev[kind].some(entry => entry.id === item.id);
      return { ...prev, [kind]: exists ? prev[kind].filter(entry => entry.id !== item.id) : [...prev[kind], item] };
    });
  };

  const saveTopic = async (event) => {
    event.preventDefault();
    setSaving(true);
    setEditorError('');
    try {
      const payload = {
        ...editor,
        ...Object.fromEntries(mediaSections.map(section => [section.key, selected[section.key].map(item => item.id)])),
      };
      const data = await getJson(await fetch(getApiUrl('/api/admin/topics/'), {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify(payload),
      }));
      setEditor(null);
      setEditorNotice('Topic saved. Existing media links were updated.');
      if (data.topic.is_published) {
        navigate(data.topic.slug);
      } else navigate('');
      await Promise.allSettled([
        loadTopics(),
        loadAdminTopics(),
        data.topic.is_published && fetch(getApiUrl(`/api/topics/${encodeURIComponent(data.topic.slug)}/`), { credentials: 'include' })
          .then(getJson).then(setDetail),
      ].filter(Boolean));
    } catch (err) { setEditorError(err.message); }
    finally { setSaving(false); }
  };

  return <div className="topics-page">
    <div className="topics-hero"><div className="topics-hero-inner"><span className="topics-eyebrow">MAKTABA TUL MUSLIM · EXPLORE</span><h1>{activeSlug && detail ? detail.title : 'Explore by topic'}</h1><p>{activeSlug && detail ? detail.description : 'Find connected Quran recitations, lectures, books, and videos in one place.'}</p></div></div>
    <div className="topics-container">
      <div className="topics-toolbar">
        {activeSlug ? <button type="button" className="topics-back" onClick={() => navigate('')}><i className="fas fa-arrow-left" aria-hidden="true" /> All topics</button> : <span className="topics-section-label">CURATED LIBRARY</span>}
        {isAdmin && <button type="button" className="topics-admin-button" onClick={() => openEditor(activeSlug ? detail : null)} disabled={Boolean(activeSlug && !detail)}><i className="fas fa-pen" aria-hidden="true" /> {activeSlug ? 'Edit this topic' : 'Create topic'}</button>}
      </div>
      {topics.length > 0 && <nav className="topic-navigation" aria-label="Browse topics"><span>Browse topics</span><div>{topics.map(topic => <a key={topic.id} href={`/topics?topic=${encodeURIComponent(topic.slug)}`} aria-current={activeSlug === topic.slug ? 'page' : undefined} onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) { event.preventDefault(); navigate(topic.slug); } }}>{topic.title}</a>)}</div></nav>}
      {editorNotice && <div className="topics-notice" role="status">{editorNotice}</div>}
      {loading && <div className="topics-state" role="status">Loading topics…</div>}
      {!loading && error && <div className="topics-state topics-error" role="alert">{error}<button type="button" onClick={() => navigate('')}>View all topics</button></div>}
      {!loading && !error && !activeSlug && <>
        {topics.length ? <div className="topics-grid">{topics.map(topic => <TopicCard key={topic.id} topic={topic} onClick={() => navigate(topic.slug)} />)}</div> : <div className="topics-state">Topics will appear here when published.</div>}
        {isAdmin && adminTopics.some(topic => !topic.is_published) && <section className="topics-drafts"><h2>Draft topics</h2><p>Only staff can see these until you publish them.</p><div>{adminTopics.filter(topic => !topic.is_published).map(topic => <button type="button" key={topic.id} onClick={() => openEditor(topic)}>{topic.title} <i className="fas fa-pen" /></button>)}</div></section>}
      </>}
      {!loading && !error && activeSlug && detail && <>
        <div className="topics-detail-summary"><span className="topics-detail-symbol"><i className="fas fa-mosque" aria-hidden="true" /></span><div><strong>A curated collection</strong><p>Explore recitations, lectures, books, and videos selected for this topic.</p></div></div>
        {mediaSections.map(section => {
          const items = detail.sections?.[section.key] || [];
          return items.length ? <section className="topics-resource-section" key={section.key}><div className="topics-resource-heading"><span><i className={`fas ${section.icon}`} aria-hidden="true" /> {section.label}</span><small>{items.length} {items.length === 1 ? 'item' : 'items'}</small></div><div className="topics-resource-list">{items.map(item => <ResourceCard key={item.id} item={item} kind={section.key} playTrack={playTrack} />)}</div></section> : null;
        })}
        {!mediaSections.some(section => detail.sections?.[section.key]?.length) && <div className="topics-state">Resources for this topic are being curated. Please check back soon.</div>}
      </>}
    </div>
    {editor && <div className="topics-editor-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setEditor(null); }}>
      <div className="topics-editor" role="dialog" aria-modal="true" aria-label="Edit topic"><div className="topics-editor-header"><div><span>ADMIN · TOPIC EDITOR</span><h2>{editor.id ? 'Edit topic' : 'Create topic'}</h2></div><button type="button" aria-label="Close editor" onClick={() => setEditor(null)}><i className="fas fa-times" /></button></div>
        <form onSubmit={saveTopic}>
          {editorError && <div className="topics-editor-error" role="alert">{editorError}</div>}
          <div className="topics-editor-fields"><label>Topic title<input required maxLength={120} value={editor.title} onChange={event => setEditor({ ...editor, title: event.target.value })} placeholder="For example, Salah (Prayer)" /></label>{!editor.id && <label>URL slug <small>Optional for English titles; required for titles in other scripts.</small><input maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={editor.slug} onChange={event => setEditor({ ...editor, slug: event.target.value.toLowerCase() })} placeholder="for-example-salah" /></label>}<label>Description<textarea maxLength={2000} rows={3} value={editor.description} onChange={event => setEditor({ ...editor, description: event.target.value })} placeholder="What will visitors find here?" /></label><label className="topics-publish"><input type="checkbox" checked={editor.is_published} onChange={event => setEditor({ ...editor, is_published: event.target.checked })} /> Publish this topic</label></div>
          <div className="topics-editor-media"><h3>Link existing library items</h3><p>Search and select records. Their original files and pages remain unchanged.</p><div className="topics-editor-tabs">{mediaSections.map(section => <button type="button" key={section.key} className={pickerKind === section.key ? 'active' : ''} onClick={() => { setPickerKind(section.key); setSearch(''); }}>{section.label} ({selected[section.key].length})</button>)}</div><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={`Search ${mediaSections.find(section => section.key === pickerKind)?.label.toLowerCase()}…`} aria-label="Search existing media" /><div className="topics-picker-list">{options.map(item => { const picked = selected[pickerKind].some(entry => entry.id === item.id); return <button type="button" key={item.id} className={picked ? 'picked' : ''} onClick={() => toggleItem(pickerKind, item)}><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><i className={`fas ${picked ? 'fa-check-circle' : 'fa-plus-circle'}`} aria-hidden="true" /></button>; })}{!options.length && <p>No matching items found.</p>}</div>{selected[pickerKind].length > 0 && <div className="topics-selected"><strong>Selected</strong>{selected[pickerKind].map(item => <button type="button" key={item.id} onClick={() => toggleItem(pickerKind, item)} title="Remove from topic">{item.title} <i className="fas fa-times" aria-hidden="true" /></button>)}</div>}</div>
          <div className="topics-editor-footer"><button type="button" onClick={() => setEditor(null)}>Cancel</button><button type="submit" disabled={saving || !csrfToken}>{saving ? 'Saving…' : 'Save topic'}</button></div>
        </form>
      </div>
    </div>}
  </div>;
}
