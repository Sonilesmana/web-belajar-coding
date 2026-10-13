# 💻 CodeBelajar — Web Belajar Coding

Platform belajar coding sederhana tanpa server. Buka langsung di browser.

## Fitur
- 🔐 Login & Register (Guru / Siswa) + akun demo
- 🎥 Video materi dari guru (YouTube / MP4)
- 🔵 Jadwal Zoom + Kelas Live Instan (Jitsi, gratis)
- 💬 Live chat kelas (realtime antar tab)
- 📄 Sharing materi / dokumen (upload & download)

## Cara Jalankan
1. Buka folder `web-belajar-coding`
2. Double-klik `index.html` (atau klik kanan → Open with Chrome)
3. Klik **Demo Siswa** / **Demo Guru**, atau Daftar akun baru

Akun demo:
- Guru: `guru@sekolah.id` / `guru123`
- Siswa: `siswa@sekolah.id` / `siswa123`

## Catatan
- Data tersimpan di `localStorage` browser (cocok untuk demo / tugas sekolah).
- Untuk produksi (banyak user + chat realtime asli), sambungkan ke Firebase / backend Node.js.
- Kelas Live memakai Jitsi (`meet.jit.si`) — gratis, tanpa API key. Untuk Zoom asli, guru menempel link meeting Zoom.
