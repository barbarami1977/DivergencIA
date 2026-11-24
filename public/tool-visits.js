(() => {
  const endpoint = '/api/contadores';
  const totals = new Map();
  const format = new Intl.NumberFormat('es');
  const app = document.querySelector('[data-app-visits]');
  const links = [...document.querySelectorAll('a[href*="gemini.google.com/gem/"], a[data-tool-visit]')];
  const key = link => link.dataset.toolVisit || 'gem:' + new URL(link.getAttribute('href'), location.href).pathname.split('/').pop();
  const labels = new Map();
  for (const link of links) {
    // SVG map regions share their total with the accessible text links below.
    if (link.namespaceURI !== 'http://www.w3.org/1999/xhtml' || !link.closest('.sem-links, .teacher-tool')) continue;
    const label = document.createElement('small');
    label.className = 'tool-visit-count';
    label.style.cssText = 'display:block;font-size:.8rem;line-height:1.5;margin-top:.5rem;opacity:.8';
    label.hidden = true;
    link.after(label);
    labels.set(label, key(link));
  }
  const sem = document.querySelector('[data-dua-tool="sem"]');
  const semLabel = sem ? document.createElement('small') : null;
  if (semLabel) { semLabel.style.cssText = 'display:block;font-size:.8rem;margin-top:.5rem'; sem.after(semLabel); }
  function render() {
    if (semLabel) {
      let total = 0;
      for (const [id, value] of totals) if (id.startsWith('gem:') && id !== 'gem:1Nse4MPiRWWtEjfV0JMWj1QrLvTDeeSiW') total += value;
      semLabel.textContent = `Aperturas: ${format.format(total)}`;
    }
    for (const [label, id] of labels) {
      label.textContent = `Aperturas: ${format.format(totals.get(id) || 0)}`;
      label.hidden = false;
    }
    if (app && totals.has(app.dataset.appVisits)) {
      app.textContent = `Visitas: ${format.format(totals.get(app.dataset.appVisits))}`;
      app.hidden = false;
    }
  }
  async function increment(resource) {
    try {
      const response = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({resource, action:'visit'}), keepalive:true});
      if (!response.ok) return;
      const {total} = await response.json();
      totals.set(resource, Math.max(totals.get(resource) || 0, total));
      render();
    } catch {} // Navigation and games remain available if counters fail.
  }
  for (const type of ['click', 'auxclick']) document.addEventListener(type, event => {
    if (type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest('a[href*="gemini.google.com/gem/"], a[data-tool-visit]');
    if (link) increment(key(link));
  });
  function refreshCounts() { return fetch(endpoint, {cache:'no-store'}).then(r => r.ok ? r.json() : Promise.reject()).then(rows => {
    for (const row of rows) if (row.action === 'visit') totals.set(row.resource, Math.max(totals.get(row.resource) || 0, row.total));
    render();
  }).catch(() => {}); }
  refreshCounts();
  window.addEventListener('pageshow', event => { if (event.persisted) refreshCounts(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refreshCounts(); });
  if (app) increment(app.dataset.appVisits);
})();
