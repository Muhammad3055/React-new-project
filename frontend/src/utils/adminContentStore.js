// Store for Admin Uploaded Custom Content, Books, Audios, Folders, and Buttons
const LOCAL_STORAGE_KEY = 'quran_portal_admin_items';
const FOLDERS_KEY = 'quran_portal_admin_folders';

export const defaultFolders = [
  { id: 'books', name: 'Books & PDF Library', icon: 'fas fa-book', color: '#f59e0b' },
  { id: 'taqreer', name: 'MP3 Audios & Taqreers', icon: 'fas fa-headphones', color: '#10b981' },
  { id: 'hadith', name: 'Hadith Collections', icon: 'fas fa-scroll', color: '#6366f1' },
  { id: 'tafseer', name: 'Tafseer Quran', icon: 'fas fa-bookmark', color: '#ec4899' },
  { id: 'duas', name: 'Du\'as & Azkar', icon: 'fas fa-hands', color: '#8b5cf6' },
  { id: 'fazail', name: 'Fazail & Virtues', icon: 'fas fa-star', color: '#eab308' },
  { id: 'namesOfAllah', name: '99 Names of Allah', icon: 'fas fa-moon', color: '#14b8a6' },
];

export function getAdminCustomFolders() {
  try {
    const saved = localStorage.getItem(FOLDERS_KEY);
    if (!saved) return defaultFolders;
    const parsed = JSON.parse(saved);
    return [...defaultFolders, ...parsed.filter(f => !defaultFolders.some(df => df.id === f.id))];
  } catch (e) {
    return defaultFolders;
  }
}

export function saveCustomFolder(folderName, icon = 'fas fa-folder', color = '#3b82f6') {
  try {
    const existing = getAdminCustomFolders();
    const id = folderName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (existing.some(f => f.id === id)) return id;

    const newFolder = { id, name: folderName, icon, color };
    const customOnly = existing.filter(f => !defaultFolders.some(df => df.id === f.id));
    customOnly.push(newFolder);
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(customOnly));
    window.dispatchEvent(new CustomEvent('admin_content_updated'));
    return id;
  } catch (e) {
    return 'books';
  }
}

export function getAdminItems(destination = null) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    if (!destination) return items;
    return items.filter(item => item.destination === destination);
  } catch (e) {
    return [];
  }
}

export function addAdminItem(item) {
  try {
    const existing = getAdminItems();
    const newItem = {
      id: 'admin_item_' + Date.now(),
      created_at: new Date().toISOString(),
      ...item
    };
    existing.unshift(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('admin_content_updated'));
    return newItem;
  } catch (e) {
    console.error('Error adding admin item:', e);
    return null;
  }
}

export function removeAdminItem(itemId) {
  try {
    const existing = getAdminItems();
    const filtered = existing.filter(item => item.id !== itemId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('admin_content_updated'));
  } catch (e) {
    console.error('Error removing admin item:', e);
  }
}
