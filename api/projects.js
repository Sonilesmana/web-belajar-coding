// Vercel Serverless API: /api/projects
// GET -> daftar projek | POST -> tambah | DELETE /api/projects?id=xxx -> hapus
// Catatan: filesystem Vercel bersifat ephemeral, simpan di /tmp (bertahan selama instance hangat).
// Untuk permanen, sambungkan ke Vercel KV / Postgres / Supabase nanti.
const fs = require('fs');
const path = require('path');

const SEED = [
  { id: 1, judul: 'Web Portofolio Pribadi', siswa: 'Andi Siswa', tech: 'HTML • CSS • JS', desc: 'Web portofolio responsif dengan dark mode.', demo: 'https://example.com', kode: 'https://github.com', date: '12/10/2026' },
  { id: 2, judul: 'Kalkulator JavaScript', siswa: 'Sinta', tech: 'JavaScript', desc: 'Kalkulator + riwayat hitung, keyboard support.', demo: 'https://example.com', kode: '', date: '11/10/2026' },
  { id: 3, judul: 'Landing PPDB Sekolah', siswa: 'Rizky', tech: 'HTML • CSS', desc: 'Landing page PPDB dengan form daftar.', demo: 'https://example.com', kode: '', date: '10/10/2026' }
];

const TMP = '/tmp/cb_projects.json';
let mem = null;

function load() {
  if (mem) return mem;
  try { mem = JSON.parse(fs.readFileSync(TMP, 'utf8')); return mem; } catch {}
  try {
    const bundled = path.join(process.cwd(), 'data', 'projects.json');
    mem = JSON.parse(fs.readFileSync(bundled, 'utf8'));
    return mem;
  } catch {}
  mem = [...SEED];
  return mem;
}
function save(list) {
  mem = list;
  try { fs.writeFileSync(TMP, JSON.stringify(list)); } catch {}
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') return res.status(200).json(load());

  if (req.method === 'POST') {
    const b = req.body || {};
    if (!b.judul || !b.demo) return res.status(400).json({ error: 'judul & demo wajib' });
    const list = load();
    const item = { id: Date.now(), judul: b.judul, tech: b.tech || 'Web', demo: b.demo, kode: b.kode || '', desc: b.desc || '', siswa: b.siswa || 'Siswa', date: new Date().toLocaleDateString('id-ID') };
    list.unshift(item); save(list);
    return res.status(201).json(item);
  }

  if (req.method === 'DELETE') {
    const id = Number(req.query.id || (req.url.split('id=')[1] || ''));
    save(load().filter(p => p.id !== id));
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'method' });
};
