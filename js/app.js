// APP: dashboard, video, zoom, chat, materi, projek
const $=id=>document.getElementById(id);
const LS_S='cb_session',LS_U='cb_users',LS_V='cb_videos',LS_Z='cb_zooms',LS_C='cb_chats',LS_M='cb_materi',LS_P='cb_projects';
let cur=null;
function load(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

// --- session ---
(function init(){
  const email=localStorage.getItem(LS_S);
  const users=load(LS_U,[]);
  cur=users.find(u=>u.email===email);
  if(!email||!cur){location.href='index.html';return}
  $('uName').textContent=cur.name; $('uRole').textContent=cur.role.toUpperCase();
  $('uAvatar').textContent=cur.name[0].toUpperCase();
  const isGuru=cur.role==='guru';
  ['addVideoBtn','addZoomBtn','addMateriBtn'].forEach(id=>{$(id).style.display=isGuru?'block':'none'});
  seedData(); renderVideos(); renderZooms(); renderChat(); renderMateri(); renderProjek(); clock();
  setInterval(renderChat,2000); // live refresh
  try{new BroadcastChannel('cb_chat').onmessage=()=>renderChat()}catch{}
})();
function logout(){localStorage.removeItem(LS_S);location.href='index.html'}
function clock(){const f=()=>{$('clock').textContent=new Date().toLocaleString('id-ID')};f();setInterval(f,1000)}
function showPage(p,btn){
  ['video','zoom','chat','materi','projek'].forEach(x=>{$('page-'+x).style.display=x===p?'block':'none'});
  document.querySelectorAll('.menu').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  $('pageTitle').textContent=btn.textContent.trim();
  if(p==='chat'){$('chatBadge').style.display='none'}
}
function openModal(id){$(id).classList.add('open')}
function closeModal(id){$(id).classList.remove('open')}
function ytId(url){const m=String(url).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/);return m?m[1]:null}
function ytThumb(url){const id=ytId(url);return id?`https://i.ytimg.com/vi/${id}/hqdefault.jpg`:''}
function ytEmbed(url){const id=ytId(url);return id?`https://www.youtube.com/embed/${id}`:url}

// --- seed ---
function seedData(){
  if(!localStorage.getItem(LS_V))save(LS_V,[
    {id:1,title:'HTML Dasar untuk Pemula',url:'https://www.youtube.com/watch?v=UB1O30fR-EE',kat:'HTML',desc:'Struktur HTML, tag, heading, link & gambar.',by:'Bu Guru'},
    {id:2,title:'CSS Dasar: Styling Web',url:'https://www.youtube.com/watch?v=yfoY53QXEnI',kat:'CSS',desc:'Warna, box model, flexbox & layout responsif.',by:'Bu Guru'},
    {id:3,title:'JavaScript Dasar',url:'https://www.youtube.com/watch?v=hdI2bqOjy3c',kat:'JavaScript',desc:'Variabel, fungsi, DOM & event handling.',by:'Bu Guru'}
  ]);
  if(!localStorage.getItem(LS_Z))save(LS_Z,[
    {id:1,title:'Live: Tanya Jawab HTML & CSS',time:'2026-10-15T10:00',link:'https://zoom.us/j/123456789',desc:'Password: coding123. Siapkan pertanyaan!',by:'Bu Guru'}
  ]);
  if(!localStorage.getItem(LS_C))save(LS_C,[
    {name:'Bu Guru',role:'guru',text:'Selamat datang di kelas coding! Absen dulu ya 👇',time:Date.now()-3600e3},
    {name:'Andi Siswa',role:'siswa',text:'Hadir Bu! Videonya keren 🙌',time:Date.now()-1800e3}
  ]);
  if(!localStorage.getItem(LS_M))save(LS_M,[
    {id:1,title:'Modul HTML + CSS (PDF)',desc:'Ringkasan materi + latihan. Link contoh: drive.google.com',file:null,by:'Bu Guru',date:new Date().toLocaleDateString('id-ID')}
  ]);
  if(!localStorage.getItem(LS_P))save(LS_P,[
    {id:1,judul:'Web Portofolio Pribadi',siswa:'Andi Siswa',tech:'HTML • CSS • JS',desc:'Web portofolio responsif dengan dark mode.',demo:'https://example.com',kode:'https://github.com',date:'12/10/2026'},
    {id:2,judul:'Kalkulator JavaScript',siswa:'Sinta',tech:'JavaScript',desc:'Kalkulator + riwayat hitung, keyboard support.',demo:'https://example.com',kode:'',date:'11/10/2026'}
  ]);
}

// --- VIDEO ---
function renderVideos(){
  const q=($('videoSearch').value||'').toLowerCase();
  const list=load(LS_V,[]).filter(v=>(v.title+v.kat+v.desc).toLowerCase().includes(q));
  $('videoList').innerHTML=list.map(v=>`
    <div class="vcard">
      <img src="${ytThumb(v.url)||'https://via.placeholder.com/400x225?text=Video'}" onerror="this.src='https://via.placeholder.com/400x225?text=Video'">
      <div class="vbody"><h4>${esc(v.title)}</h4><span class="tag">${esc(v.kat)}</span>
      <p class="muted small">${esc(v.desc||'')} • oleh ${esc(v.by||'')}</p>
      <div class="row"><button class="btn small" onclick="watchVideo(${v.id})">▶ Tonton</button>
      ${cur.role==='guru'?`<button class="btn outline small" onclick="delVideo(${v.id})">Hapus</button>`:''}</div></div>
    </div>`).join('')||'<p class="muted">Belum ada video. Guru bisa tambah via tombol di atas.</p>';
}
function addVideo(){
  const t=$('v_title').value.trim(),u=$('v_url').value.trim(),k=$('v_kat').value,d=$('v_desc').value.trim();
  if(!t||!u)return alert('Isi judul & link video!');
  const list=load(LS_V,[]); list.unshift({id:Date.now(),title:t,url:u,kat:k,desc:d,by:cur.name});
  save(LS_V,list); closeModal('videoModal'); renderVideos();
}
function delVideo(id){if(confirm('Hapus video?')){save(LS_V,load(LS_V,[]).filter(v=>v.id!==id));renderVideos()}}
function watchVideo(id){
  const v=load(LS_V,[]).find(x=>x.id===id); if(!v)return;
  $('watchBox').style.display='block'; $('watchTitle').textContent='▶ '+v.title;
  $('watchFrame').src=ytEmbed(v.url); $('watchDesc').textContent=v.desc+' • oleh '+v.by;
  $('watchBox').scrollIntoView({behavior:'smooth'});
}
function closeWatch(){$('watchBox').style.display='none';$('watchFrame').src=''}

// --- ZOOM ---
function renderZooms(){
  const list=load(LS_Z,[]);
  $('zoomList').innerHTML=list.map(z=>`
    <div class="zcard"><h4>🔵 ${esc(z.title)}</h4>
    <p class="muted small">🕒 ${esc((z.time||'').replace('T',' '))} • oleh ${esc(z.by||'')}</p>
    <p class="small">${esc(z.desc||'')}</p>
    <div class="row" style="margin-top:8px">
      <a href="${esc(z.link)}" target="_blank"><button class="btn small">Gabung Zoom</button></a>
      ${cur.role==='guru'?`<button class="btn outline small" onclick="delZoom(${z.id})">Hapus</button>`:''}
    </div></div>`).join('')||'<p class="muted">Belum ada jadwal. Guru bisa buat jadwal baru.</p>';
}
function addZoom(){
  const t=$('z_title').value.trim(),ti=$('z_time').value,l=$('z_link').value.trim(),d=$('z_desc').value.trim();
  if(!t||!l)return alert('Isi judul & link Zoom!');
  const list=load(LS_Z,[]); list.unshift({id:Date.now(),title:t,time:ti,link:l,desc:d,by:cur.name});
  save(LS_Z,list); closeModal('zoomModal'); renderZooms();
}
function delZoom(id){if(confirm('Hapus jadwal?')){save(LS_Z,load(LS_Z,[]).filter(z=>z.id!==id));renderZooms()}}
function startJitsi(){$('jitsiBox').style.display='block';embedJitsi()}
function embedJitsi(){
  const room=($('jitsiRoom').value||'kelas-coding').replace(/[^a-zA-Z0-9-]/g,'-');
  $('jitsiFrame').src='https://meet.jit.si/'+room+'#config.prejoinPageEnabled=false';
}

// --- CHAT (live) ---
function renderChat(){
  const list=load(LS_C,[]);
  const box=$('chatList');
  const nearBottom=box.scrollHeight-box.scrollTop-box.clientHeight<120;
  box.innerHTML=list.map(m=>`
    <div class="bubble ${m.email===cur.email?'me':''}">
      <small>${esc(m.name)} • ${esc(m.role)} • ${new Date(m.time).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</small>
      ${esc(m.text)}</div>`).join('');
  if(nearBottom||!box.dataset.init){box.scrollTop=box.scrollHeight;box.dataset.init=1}
  $('onlineCount').textContent=1+Math.floor(Math.random()*4);
}
function sendChat(){
  const t=$('chatText').value.trim(); if(!t)return;
  const list=load(LS_C,[]); list.push({name:cur.name,role:cur.role,email:cur.email,text:t,time:Date.now()});
  save(LS_C,list.slice(-200)); $('chatText').value='';
  try{new BroadcastChannel('cb_chat').postMessage('x')}catch{}
  renderChat();
}
function clearChat(){
  if(cur.role!=='guru')return alert('Hanya guru yang bisa hapus chat!');
  if(confirm('Hapus semua chat?')){save(LS_C,[]);renderChat()}
}

// --- MATERI ---
function renderMateri(){
  const q=($('materiSearch').value||'').toLowerCase();
  const list=load(LS_M,[]).filter(m=>(m.title+m.desc).toLowerCase().includes(q));
  $('materiList').innerHTML=list.map(m=>`
    <div class="mcard"><h4>📄 ${esc(m.title)}</h4>
    <p class="muted small">oleh ${esc(m.by||'')} • ${esc(m.date||'')}</p>
    <p class="small">${esc(m.desc||'')}</p>
    <div class="row" style="margin-top:8px">
      ${m.file?`<a href="${m.file}" download="${esc(m.fname||'materi')}"><button class="btn small">⬇ Download</button></a>`:'<span class="muted small">Link/file lihat di deskripsi</span>'}
      ${cur.role==='guru'?`<button class="btn outline small" onclick="delMateri(${m.id})">Hapus</button>`:''}
    </div></div>`).join('')||'<p class="muted">Belum ada materi.</p>';
}
function addMateri(){
  const t=$('m_title').value.trim(),d=$('m_desc').value.trim(),f=$('m_file').files[0];
  if(!t)return alert('Isi judul materi!');
  const done=(file,fname)=>{const list=load(LS_M,[]);
    list.unshift({id:Date.now(),title:t,desc:d,file,fname,by:cur.name,date:new Date().toLocaleDateString('id-ID')});
    save(LS_M,list); closeModal('materiModal'); renderMateri(); $('m_file').value=''};
  if(!f)return done(null,null);
  if(f.size>2*1024*1024)return alert('File >2MB! Upload ke Google Drive & tempel link di deskripsi.');
  const r=new FileReader(); r.onload=()=>done(r.result,f.name); r.readAsDataURL(f);
}
function delMateri(id){if(confirm('Hapus materi?')){save(LS_M,load(LS_M,[]).filter(m=>m.id!==id));renderMateri()}}

// --- PROJEK SISWA (tersimpan di SERVER -> langsung tampil di landing semua pengunjung) ---
async function apiGetProjek(){try{const r=await fetch('/api/projects',{cache:'no-store'});if(r.ok)return await r.json()}catch{}return load(LS_P,[])}
async function renderProjek(){
  const q=($('projekSearch').value||'').toLowerCase();
  const list=(await apiGetProjek()).filter(p=>((p.judul||'')+(p.siswa||'')+(p.tech||'')+(p.desc||'')).toLowerCase().includes(q));
  try{save(LS_P,list)}catch{}
  $('projekList').innerHTML=list.map(p=>`
    <div class="pcard light"><div class="ptech">${esc(p.tech||'Web')}</div>
    <h3>${esc(p.judul)}</h3><p class="muted small">👨‍💻 ${esc(p.siswa)} • ${esc(p.date||'')}</p>
    <p class="small">${esc(p.desc||'')}</p>
    <div class="row" style="margin-top:8px">
      ${p.demo?`<a href="${esc(p.demo)}" target="_blank"><button class="btn small">🌐 Demo</button></a>`:''}
      ${p.kode?`<a href="${esc(p.kode)}" target="_blank"><button class="btn outline small">💻 Kode</button></a>`:''}
      <button class="btn outline small" onclick="delProjek(${p.id})">Hapus</button>
    </div></div>`).join('')||'<p class="muted">Belum ada projek. Klik + Tambah Projek.</p>';
}
async function addProjek(){
  const j=$('p_judul').value.trim(),t=$('p_tech').value.trim(),d=$('p_demo').value.trim(),k=$('p_kode').value.trim(),desc=$('p_desc').value.trim();
  if(!j||!d)return alert('Isi judul & link demo!');
  const payload={judul:j,tech:t||'Web',demo:d,kode:k,desc,siswa:cur.name};
  try{
    const r=await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(!r.ok)throw 0;
  }catch{
    const list=load(LS_P,[]); // fallback offline: simpan lokal
    list.unshift({id:Date.now(),...payload,date:new Date().toLocaleDateString('id-ID')});
    save(LS_P,list);
  }
  closeModal('projekModal'); renderProjek();
  $('p_judul').value=$('p_tech').value=$('p_demo').value=$('p_kode').value=$('p_desc').value='';
  alert('Projek terbit! Cek halaman depan — sudah tampil 🚀');
}
async function delProjek(id){
  if(!confirm('Hapus projek?'))return;
  try{await fetch('/api/projects?id='+id,{method:'DELETE'})}catch{}
  try{await fetch('/api/projects/'+id,{method:'DELETE'})}catch{}
  save(LS_P,load(LS_P,[]).filter(p=>p.id!==id)); renderProjek();
}
