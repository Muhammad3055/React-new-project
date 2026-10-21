import { useSyncExternalStore } from 'react';

const listeners = new Set();
let messages;
const empty = [];
const key = 'quran_portal_chat_history';
function snapshot() {
  if (messages) return messages;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    messages = Array.isArray(saved) ? saved.filter(message => message && ['user', 'ai'].includes(message.sender) && typeof message.text === 'string').slice(-50) : [];
  } catch { messages = []; }
  return messages;
}
function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
function update(value) {
  messages = (typeof value === 'function' ? value(snapshot()) : value).slice(-50);
  try {
    localStorage.setItem(key, JSON.stringify(messages.map(message => ({ ...message, file: message.file ? { name: message.file.name, type: message.file.type } : null }))));
  } catch { /* Chat remains usable when browser storage is full or disabled. */ }
  listeners.forEach(listener => listener());
}
export default function useAssistantMessages() {
  return [useSyncExternalStore(subscribe, snapshot, () => empty), update];
}
