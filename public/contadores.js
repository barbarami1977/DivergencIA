(() => {
  const endpoint = "/api/contadores";
  const counts = new Map();
  const number = new Intl.NumberFormat("es");
  const visitLabel = document.querySelector("[data-visit-count]");
  const featured = document.querySelectorAll(".featured-list");
  const grid = document.querySelector("#resource-grid");
  let ready = false;

  function count(resource, action) {
    return counts.get(resource)?.get(action) ?? 0;
  }

  function setCount(resource, action, total) {
    if (!counts.has(resource)) counts.set(resource, new Map());
    counts.get(resource).set(action, Math.max(count(resource, action), total));
  }

  function refresh() {
    if (!ready) return;
    if (visitLabel) {
      visitLabel.textContent = `Visitas a DivergencIA: ${number.format(count("site", "visit"))}`;
      visitLabel.hidden = false;
    }

    for (const item of document.querySelectorAll(".featured-list a, .resource-card")) {
      const link = item.matches("a") ? item : item.querySelector(".resource-actions a");
      if (!link) continue;
      const resource = link.getAttribute("href");
      let label = item.querySelector(".resource-counts");
      if (!label) {
        label = document.createElement(item === link ? "span" : "p");
        label.className = "resource-counts";
        item.append(label);
      }

      const opened = number.format(count(resource, "open"));
      const canDownload = item.querySelector("a[download]") || resource.startsWith("pdfs/");
      const downloaded = number.format(count(resource, "download"));
      label.textContent = canDownload
        ? `Aperturas: ${opened} · Descargas: ${downloaded}`
        : `Aperturas: ${opened}`;
    }
  }

  async function increment(resource, action) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource, action }),
        keepalive: true
      });
      if (!response.ok) return;
      const { total } = await response.json();
      setCount(resource, action, total);
      refresh();
    } catch {
      // A counter failure must not interrupt navigation or downloads.
    }
  }

  function recordClick(event) {
    if (event.type === "auxclick" && event.button !== 1) return;
    const link = event.target.closest(".featured-list a, .resource-actions a");
    if (link) increment(link.getAttribute("href"), link.hasAttribute("download") ? "download" : "open");
  }

  for (const container of [...featured, grid]) {
    container?.addEventListener("click", recordClick);
    container?.addEventListener("auxclick", recordClick);
  }
  if (grid) new MutationObserver(refresh).observe(grid, { childList: true });

  fetch(endpoint, { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("Contadores no disponibles");
      return response.json();
    })
    .then(rows => {
      for (const row of rows) setCount(row.resource, row.action, row.total);
      ready = true;
      refresh();
    })
    .catch(() => {});

  if (visitLabel) increment("site", "visit");
})();
