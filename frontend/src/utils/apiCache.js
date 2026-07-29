// High-performance In-Memory & SessionStorage API Caching Layer
const memoryCache = new Map();

/**
 * Fetch URL with automatic caching in-memory and sessionStorage
 * @param {string} url - Target fetch URL
 * @param {object} options - Fetch options
 * @param {number} ttlMs - Time-to-live in milliseconds (default 10 mins = 600000ms)
 * @returns {Promise<any>}
 */
export async function fetchWithCache(url, options = {}, ttlMs = 600000) {
  // Only cache GET requests
  if (options.method && options.method.toUpperCase() !== 'GET') {
    const res = await fetch(url, options);
    return res.json();
  }

  const now = Date.now();

  // 1. Check In-Memory JS Map Cache (0ms response)
  if (memoryCache.has(url)) {
    const entry = memoryCache.get(url);
    if (now - entry.timestamp < ttlMs) {
      return entry.data;
    }
    memoryCache.delete(url);
  }

  // 2. Check SessionStorage Cache
  try {
    const sessionKey = `api_cache_${url}`;
    const cachedItem = sessionStorage.getItem(sessionKey);
    if (cachedItem) {
      const parsed = JSON.parse(cachedItem);
      if (now - parsed.timestamp < ttlMs) {
        memoryCache.set(url, { data: parsed.data, timestamp: parsed.timestamp });
        return parsed.data;
      }
      sessionStorage.removeItem(sessionKey);
    }
  } catch (e) {
    // SessionStorage unavailable fallback
  }

  // 3. Network Fetch if not cached
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  // Save to caches
  memoryCache.set(url, { data, timestamp: now });
  try {
    sessionStorage.setItem(`api_cache_${url}`, JSON.stringify({ data, timestamp: now }));
  } catch (e) {
    // Storage quota fallback
  }

  return data;
}

/**
 * Clear specific cache key or all caches
 */
export function clearApiCache(url = null) {
  if (url) {
    memoryCache.delete(url);
    try { sessionStorage.removeItem(`api_cache_${url}`); } catch (e) {}
  } else {
    memoryCache.clear();
    try {
      Object.keys(sessionStorage).forEach(k => {
        if (k.startsWith('api_cache_')) sessionStorage.removeItem(k);
      });
    } catch (e) {}
  }
}
