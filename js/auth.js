// AUTH: login/register sederhana (localStorage)
const LS_USERS='cb_users', LS_SESSION='cb_session';
function getUsers(){try{return JSON.parse(localStorage.getItem(LS_USERS))||[]}catch{return[]}}
function saveUsers(u){localStorage.setItem(LS_USERS,JSON.stringify(u))}
function seed(){
  if(!localStorage.getItem(LS_USERS)){
    saveUsers([
      {name:'Bu Guru',email:'guru@sekolah.id',password:'guru123',role:'guru'},
      {name:'Andi Siswa',email:'siswa@sekolah.id',password:'siswa123',role:'siswa'}
    ]);
  }
}
seed();
function switchTab(t){
  document.getElementById('formLogin').style.display=t==='login'?'block':'none';
  document.getElementById('formReg').style.display=t==='reg'?'block':'none';
  document.getElementById('tabLogin').classList.toggle('active',t==='login');
  document.getElementById('tabReg').classList.toggle('active',t==='reg');
}
function msg(t){document.getElementById('authMsg').textContent=t}
function register(){
  const name=rg_name.value.trim(),email=rg_email.value.trim().toLowerCase(),pass=rg_pass.value,role=rg_role.value;
  if(!name||!email||!pass)return msg('Lengkapi semua field!');
  if(pass.length<4)return msg('Password minimal 4 karakter!');
  const u=getUsers(); if(u.find(x=>x.email===email))return msg('Email sudah terdaftar, silakan Masuk.');
  u.push({name,email,password:pass,role}); saveUsers(u);
  localStorage.setItem(LS_SESSION,email); location.href='dashboard.html';
}
function login(){
  const email=li_email.value.trim().toLowerCase(),pass=li_pass.value;
  const u=getUsers().find(x=>x.email===email&&x.password===pass);
  if(!u)return msg('Email / password salah! Coba demo atau daftar dulu.');
  localStorage.setItem(LS_SESSION,email); location.href='dashboard.html';
}
function demoLogin(){localStorage.setItem(LS_SESSION,'siswa@sekolah.id');location.href='dashboard.html'}
function demoGuru(){localStorage.setItem(LS_SESSION,'guru@sekolah.id');location.href='dashboard.html'}
