import {readFile, writeFile, readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../public/', import.meta.url));
const pages = ['index.html','materiales.html','sobre-mi.html','figuras-femeninas.html','ritmogramas.html','bingo/index.html','simon/index.html','looper/index.html','criba/index.html','palabras-que-suenan/index.html'];
const urls = new Set();
for (const page of pages) {
  const html = await readFile(root + page, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canonical) throw new Error(`Falta URL canónica: ${page}`);
  urls.add(canonical[1]);
}
// Include only PDFs linked in the public catalogue, avoiding obsolete files.
const catalog = await readFile(root + 'catalog.js', 'utf8');
for (const [,path] of catalog.matchAll(/"url":\s*"(pdfs\/[^"\s]+\.pdf)"/g)) {
  await readFile(root + path);
  urls.add(new URL(path, 'https://divergencia.org/').href);
}
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
await writeFile(root+'sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...urls].map(url=>'  <url><loc>'+escape(url)+'</loc></url>').join('\n')+'\n</urlset>\n');
console.log(`Mapa del sitio: ${urls.size} direcciones públicas.`);
