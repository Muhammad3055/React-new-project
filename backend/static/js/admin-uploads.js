(function () {
  const moduleUrl = new URL('upload-client.js', document.currentScript.src);
  function install() {
  const form = document.querySelector('#content-main form[method="post"]');
  if (!form) return;
  const status = document.createElement('p');
  status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  form.prepend(status);
  let busy = false, ready = false;
  form.addEventListener('submit', async event => {
    if (ready) return;
    event.preventDefault();
    if (busy) return;
    busy = true;
    const submitter = event.submitter;
    const buttons = [...form.querySelectorAll('[type="submit"]')];
    buttons.forEach(button => { button.disabled = true; });
    const beforeUnload = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', beforeUnload);
    try {
      const { prepareFormUploads } = await import(moduleUrl);
      const prepared = await prepareFormUploads(new FormData(form), (percent, text) => {
        status.textContent = `${percent}% — ${text}`;
      });
      for (const [name, token] of prepared) {
        if (!name.endsWith('_upload')) continue;
        let hidden = form.querySelector(`input[type="hidden"][name="${name}"]`);
        if (!hidden) {
          hidden = document.createElement('input'); hidden.type = 'hidden'; hidden.name = name; form.append(hidden);
        }
        hidden.value = token;
        const input = form.elements.namedItem(name.slice(0, -7));
        if (input?.type === 'file') input.value = '';
        const clear = form.elements.namedItem(`${name.slice(0, -7)}-clear`);
        if (clear) clear.checked = false;
      }
      status.textContent = 'Files received. Saving…';
      ready = true;
      buttons.forEach(button => { button.disabled = false; });
      if (submitter) form.requestSubmit(submitter); else form.requestSubmit();
    } catch (error) {
      status.textContent = `Upload failed: ${error.message}`;
      buttons.forEach(button => { button.disabled = false; }); busy = false;
    } finally { window.removeEventListener('beforeunload', beforeUnload); }
  });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
