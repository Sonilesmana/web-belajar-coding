// Server mini tanpa dependensi: static files + API projek bersama.
// GET  /api/projects       -> daftar projek (dari data/projects.json)
// POST /api/projects       -> tambah {judul,tech,demo,kode,desc,siswa} -> langsung tampil di landing
// DELETE /api/projects/:id -> hapus
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const DATA = path.join(ROOT, 'data', 'projects.json');
const PORT = 8080;

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

function readProjects() {
  try { return JSON.parse(fs.readFileSync(DATA, 'utf8')); } catch { return []; }
}
function writeProjects(p) { fs.writeFileSync(DATA, JSON.stringify(p, null, 2)); }

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // --- API ---
  if (req.url === '/api/projects' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(readProjects()));
  }
  if (req.url === '/api/projects' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const b = JSON.parse(body || '{}');
        if (!b.judul || !b.demo) { res.writeHead(400); return res.end('{"error":"judul & demo wajib"}'); }
        const list = readProjects();
        const item = { id: Date.now(), judul: b.judul, tech: b.tech || 'Web', demo: b.demo, kode: b.kode || '', desc: b.desc || '', siswa: b.siswa || 'Siswa', date: new Date().toLocaleDateString('id-ID') };
        list.unshift(item); writeProjects(list);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(item));
      } catch (e) { res.writeHead(400); return res.end('{"error":"bad json"}'); }
    });
    return;
  }
  if (req.url.startsWith('/api/projects') && req.method === 'DELETE') {
    const m = req.url.match(/(\d+)\s*$/);
    const q = req.url.match(/[?&]id=(\d+)/);
    const id = Number((q && q[1]) || (m && m[1]) || '');
    writeProjects(readProjects().filter(p => p.id !== id));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end('{"ok":true}');
  }

  // --- STATIC ---
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); return res.end('Not found');
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => console.log('CodeBelajar jalan di http://127.0.0.1:' + PORT));
