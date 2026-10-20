import { getApiUrl } from './apiCache';

/**
 * Uploads large files in 25MB slices to bypass Cloudflare's 100MB limit.
 * Completely immune to 413 Payload Too Large errors!
 * 
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback(percent, statsString)
 * @returns {Promise<string>} - Resolves with assembled_filename on server
 */
export async function uploadFileInChunks(file, onProgress) {
  const CHUNK_SIZE = 25 * 1024 * 1024; // 25 MB per chunk
  const totalSize = file.size;
  const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
  const uploadId = 'chunk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  const startTime = Date.now();

  let finalAssembledName = `${uploadId}_${file.name}`;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, totalSize);
    const chunkBlob = file.slice(start, end);

    const formData = new FormData();
    formData.append('upload_id', uploadId);
    formData.append('chunk_index', i.toString());
    formData.append('total_chunks', totalChunks.toString());
    formData.append('filename', file.name);
    formData.append('chunk', chunkBlob);

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', getApiUrl('/api/upload/chunk/'));

      if (xhr.upload) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const overallUploaded = start + e.loaded;
            const percent = Math.min(99, Math.round((overallUploaded / totalSize) * 100));
            const elapsed = (Date.now() - startTime) / 1000;
            const speedMB = elapsed > 0.3 ? ((overallUploaded / 1048576) / elapsed).toFixed(1) : '1.0';
            const loadedMB = (overallUploaded / 1048576).toFixed(1);
            const totalMB = (totalSize / 1048576).toFixed(1);
            if (onProgress) {
              onProgress(percent, `Bypassing Cloudflare Limit: Part ${i + 1}/${totalChunks} (${loadedMB} MB / ${totalMB} MB @ ${speedMB} MB/s)`);
            }
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.assembled_filename) {
              finalAssembledName = data.assembled_filename;
            }
            resolve(data);
          } catch (err) {
            resolve({ status: 'chunk_saved' });
          }
        } else {
          reject(new Error(`Chunk ${i + 1} failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error(`Network error during chunk ${i + 1} upload`));
      xhr.send(formData);
    });
  }

  if (onProgress) {
    onProgress(100, 'All parts uploaded! Assembling media file on server...');
  }

  return finalAssembledName;
}
