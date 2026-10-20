// Shared by React and Django admin; no framework or build step is required.
const CHUNK_SIZE = 8 * 1024 * 1024;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const storage = {
  get(key) { try { return sessionStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { sessionStorage.setItem(key, value); } catch { /* optional */ } },
  remove(key) { try { sessionStorage.removeItem(key); } catch { /* optional */ } },
};

async function checksum(blob) {
  if (!globalThis.crypto?.subtle) throw new Error('Secure uploads require HTTPS (or localhost).');
  const hash = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
}

async function responseData(response) {
  let data;
  try { data = await response.json(); } catch {
    throw new Error(`Invalid server response (HTTP ${response.status}). Check the server logs before retrying.`);
  }
  if (!response.ok || data.error || data.status === 'error') {
    const error = new Error(data.error || data.message || `Upload failed (HTTP ${response.status}).`);
    error.status = response.status; throw error;
  }
  return data;
}

async function getConfig(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try { return await responseData(await fetch(url, { credentials: 'include', cache: 'no-store', signal: controller.signal })); }
  finally { clearTimeout(timer); }
}

function sendChunk(url, body, csrf, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let timer;
    const fail = (message, status = 0) => {
      clearTimeout(timer);
      const error = new Error(message); error.status = status; reject(error);
    };
    const watch = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { fail('Upload stalled. Retrying this part…'); xhr.abort(); }, 120000);
    };
    xhr.open('POST', url);
    xhr.withCredentials = true;
    xhr.setRequestHeader('X-CSRFToken', csrf);
    xhr.upload.onprogress = event => { watch(); if (event.lengthComputable) onProgress(event.loaded, event.total); };
    xhr.upload.onload = watch;
    xhr.onerror = () => fail('Network interrupted. Select the same file and retry to resume.');
    xhr.onabort = () => fail('Upload interrupted. Select the same file and retry to resume.');
    xhr.onload = () => {
      clearTimeout(timer);
      let data;
      try { data = JSON.parse(xhr.responseText); }
      catch { fail(`Invalid server response (HTTP ${xhr.status}).`, xhr.status); return; }
      if (xhr.status < 200 || xhr.status >= 300 || data.error) {
        fail(data.error || `Upload failed (HTTP ${xhr.status}).`, xhr.status); return;
      }
      resolve(data);
    };
    watch(); xhr.send(body);
  });
}

export async function uploadFileInChunks(file, onProgress, resolveUrl = url => url, field = 'file') {
  const endpoint = resolveUrl('/api/upload/chunk/');
  const sample = new Blob([file.slice(0, 65536), file.slice(Math.max(0, file.size - 65536))]);
  const fingerprint = `${field}:${file.name}:${file.size}:${file.lastModified}:${await checksum(sample)}`;
  const key = `maktab-upload:${fingerprint}`;
  let uploadId = storage.get(key);
  let config;
  if (uploadId) {
    try { config = await getConfig(`${endpoint}?upload_id=${encodeURIComponent(uploadId)}`); }
    catch (error) {
      if (error.status !== 400 || /already been saved|another administrator/.test(error.message)) throw error;
      storage.remove(key); uploadId = null;
    }
  }
  if (!config) config = await getConfig(endpoint);
  if (file.size <= 0 || file.size > config.max_file_size) {
    throw new Error(`Select a nonempty file up to ${(config.max_file_size / 1024 ** 3).toFixed(0)} GB.`);
  }
  if (!uploadId) {
    uploadId = crypto.randomUUID().replaceAll('-', ''); storage.set(key, uploadId);
  }
  const chunkSize = config.chunk_size;
  const total = Math.ceil(file.size / chunkSize);
  const next = config.next_index || 0;
  if (next && config.fingerprint !== fingerprint) throw new Error('Resume metadata does not match this file.');
  const started = Date.now();
  const resumedBytes = Math.min(next * chunkSize, file.size);
  for (let index = next; index < total; index++) {
    const start = index * chunkSize;
    const part = file.slice(start, Math.min(start + chunkSize, file.size));
    const sha256 = await checksum(part);
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const body = new FormData();
        Object.entries({ upload_id: uploadId, chunk_index: index, total_chunks: total,
          filename: file.name, file_size: file.size, fingerprint, sha256 }).forEach(([name, value]) => body.append(name, String(value)));
        body.append('chunk', part, 'part.bin');
        const data = await sendChunk(endpoint, body, config.csrf_token, (loaded, requestTotal) => {
          const bytes = start + part.size * Math.min(1, loaded / requestTotal);
          const seconds = Math.max(1, (Date.now() - started) / 1000);
          const speed = Math.max(0, bytes - resumedBytes) / seconds / 1048576;
          onProgress?.(Math.min(99, Math.floor(bytes / file.size * 100)),
            `${file.name}: part ${index + 1}/${total}, ${(bytes / 1048576).toFixed(1)} / ${(file.size / 1048576).toFixed(1)} MB (${speed.toFixed(1)} MB/s)`);
        });
        if (data.next_index !== index + 1 || (index === total - 1 && data.assembled_filename !== uploadId)) {
          throw new Error('Server did not confirm this part. Retry to resume.');
        }
        break;
      } catch (error) {
        if ((error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429) || error.status === 507 || attempt === 4) throw error;
        onProgress?.(Math.floor(start / file.size * 100), `Retrying part ${index + 1} (${attempt + 1}/4)…`);
        await pause(Math.min(1000 * 2 ** attempt, 8000));
      }
    }
  }
  onProgress?.(99, 'File received. Saving content…');
  return uploadId;
}

export async function prepareFormUploads(formData, onProgress, resolveUrl = url => url) {
  const prepared = new FormData();
  for (const [name, value] of formData.entries()) {
    if (value instanceof File && value.size > CHUNK_SIZE) {
      const primary = formData.get('pdf_file') || formData.get('audio_file');
      if (name === 'file' && primary instanceof File && primary.name === value.name && primary.size === value.size) continue;
      prepared.append(`${name}_upload`, await uploadFileInChunks(value, onProgress, resolveUrl, name));
    } else prepared.append(name, value);
  }
  return prepared;
}

export async function postMediaForm(url, formData, onProgress, resolveUrl = url => url) {
  const prepared = await prepareFormUploads(formData, onProgress, resolveUrl);
  onProgress?.(99, 'Saving content…');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    const data = await responseData(await fetch(url, {
      method: 'POST', body: prepared, credentials: 'include', signal: controller.signal,
    }));
    if (data.status !== 'success') throw new Error('Server did not confirm that the content was saved.');
    onProgress?.(100, 'Saved successfully.');
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Saving timed out. Check the content list before retrying; the file may already be saved.');
    throw error;
  } finally { clearTimeout(timer); }
}
