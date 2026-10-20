import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = await readFile(new URL('../../backend/static/js/upload-client.js', import.meta.url), 'utf8');
const { uploadFileInChunks, postMediaForm } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

function server({ failAfterSave = false, chunkError = 0, saveError = false } = {}) {
  const sessions = new Map(), uploads = new Map();
  const state = { requests: 0, saved: null };
  globalThis.sessionStorage = {
    getItem: key => sessions.get(key), setItem: (key, value) => sessions.set(key, value),
    removeItem: key => sessions.delete(key),
  };
  const json = (data, status = 200) => new Response(JSON.stringify(data), { status });
  globalThis.fetch = async (url, options) => {
    if (options.method === 'POST') {
      state.saved = options.body;
      return saveError ? json({ error: 'Disk save failed' }, 500) : json({ status: 'success', id: 1 });
    }
    const token = new URL(url, 'https://test.local').searchParams.get('upload_id');
    const meta = uploads.get(token);
    if (token && !meta) return json({ error: 'Upload expired' }, 400);
    return json({ chunk_size: 8 * 1024 * 1024, max_file_size: 10 * 1024 ** 3,
      csrf_token: 'csrf-test', ...(meta ? { next_index: meta.next, fingerprint: meta.fingerprint } : {}) });
  };
  globalThis.XMLHttpRequest = class {
    upload = {};
    open() {}
    setRequestHeader(name, value) { assert.equal(name, 'X-CSRFToken'); assert.equal(value, 'csrf-test'); }
    abort() { this.onabort?.(); }
    send(form) {
      state.requests++;
      queueMicrotask(async () => {
        if (chunkError) {
          this.status = chunkError; this.responseText = JSON.stringify({ error: 'Chunk rejected' }); this.onload(); return;
        }
        const token = form.get('upload_id');
        const index = Number(form.get('chunk_index'));
        const payload = Buffer.from(await form.get('chunk').arrayBuffer());
        assert.equal(createHash('sha256').update(payload).digest('hex'), form.get('sha256'));
        let meta = uploads.get(token);
        if (!meta) { meta = { next: 0, fingerprint: form.get('fingerprint'), parts: [] }; uploads.set(token, meta); }
        if (index === meta.next) { meta.parts.push(payload); meta.next++; }
        this.upload.onprogress?.({ lengthComputable: true, loaded: payload.length, total: payload.length });
        if (failAfterSave) { failAfterSave = false; this.onerror(); return; }
        this.status = 200;
        this.responseText = JSON.stringify({ next_index: index + 1,
          assembled_filename: index + 1 === Number(form.get('total_chunks')) ? token : null });
        this.onload();
      });
    }
  };
  return { state, uploads };
}

test('first chunk retries safely after a lost response, and retry resumes a completed file', async () => {
  const { state, uploads } = server({ failAfterSave: true });
  const file = new File([new Uint8Array(8 * 1024 * 1024 + 3)], 'long.mp3', { lastModified: 10 });
  const token = await uploadFileInChunks(file);
  assert.equal(state.requests, 3);
  assert.equal(Buffer.concat(uploads.get(token).parts).length, file.size);
  assert.equal(await uploadFileInChunks(file), token);
  assert.equal(state.requests, 3);
});

test('a permanent first-chunk error fails instead of reporting success', async () => {
  const { state } = server({ chunkError: 413 });
  await assert.rejects(uploadFileInChunks(new File(['content'], 'test.mp3')), /Chunk rejected/);
  assert.equal(state.requests, 1);
});

test('large files are replaced by references in the final save request', async () => {
  const { state } = server();
  const form = new FormData();
  form.append('title', 'Long lecture');
  form.append('audio_file', new File([new Uint8Array(8 * 1024 * 1024 + 1)], 'long.mp3'));
  await postMediaForm('/api/taqreer/', form);
  assert.equal(state.requests, 2);
  assert.equal(state.saved.has('audio_file'), false);
  assert.match(state.saved.get('audio_file_upload'), /^[a-f0-9]{32}$/);
});

test('final server errors are surfaced instead of becoming false success', async () => {
  server({ saveError: true });
  await assert.rejects(postMediaForm('/api/taqreer/', new FormData()), /Disk save failed/);
});
