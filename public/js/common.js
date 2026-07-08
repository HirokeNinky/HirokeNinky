/* =========================================================
   HIROKE NINKY — CORE ENGINE (Full-stack / API version)
   Same UI behaviors as the static version, but content, stats,
   schedule, and visitor logs now come from the backend API
   instead of localStorage.
   ========================================================= */

const API = '/api';

async function apiGet(path){
  const r = await fetch(API + path);
  if(!r.ok) throw new Error('GET ' + path + ' failed: ' + r.status);
  return r.json();
}
async function apiPost(path, body){
  const r = await fetch(API + path, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body || {}),
  });
  return { ok: r.ok, status: r.status, data: await r.json().catch(()=>({})) };
}
async function apiPut(path, body){
  const r = await fetch(API + path, {
    method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body || {}),
  });
  return { ok: r.ok, status: r.status, data: await r.json().catch(()=>({})) };
}
async function apiDelete(path){
  const r = await fetch(API + path, { method:'DELETE' });
  return { ok: r.ok, status: r.status, data: await r.json().catch(()=>({})) };
}

/* ---------- STATS ---------- */
async function getStats(){
  try{ return await apiGet('/stats'); }
  catch(e){ return { youtube:0, tiktok:0, views:0, live:false }; }
}

/* ---------- CONTENT ---------- */
async function getContent(){
  try{ return await apiGet('/content'); }
  catch(e){ return {}; }
}

/* ---------- VISITOR LOGGING ---------- */
function logVisit(pageName){
  apiPost('/visitors/log', { page: pageName }).catch(()=>{});
}

/* ---------- RIFT LOADER ---------- */
function initLoader(){
  const loader = document.getElementById('rift-loader');
  if(!loader) return;
  const done = () => loader.classList.add('hidden');
  if(document.readyState === 'complete'){ setTimeout(done, 900); }
  else window.addEventListener('load', () => setTimeout(done, 900));
  setTimeout(done, 3200);
}

/* ---------- NAV ---------- */
function initNav(activePage){
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.seam-links');
  if(burger && links){
    burger.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }
  document.querySelectorAll('.seam-links a[data-page]').forEach(a=>{
    if(a.dataset.page === activePage) a.classList.add('active');
  });
}

/* ---------- CURSOR FX ---------- */
function initCursor(){
  if(window.matchMedia('(pointer:coarse)').matches) return;
  const c = document.createElement('div');
  c.className = 'cursor-fx';
  document.body.appendChild(c);
  window.addEventListener('mousemove', e => {
    c.style.left = e.clientX + 'px';
    c.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .icon-orb').forEach(el=>{
    el.addEventListener('mouseenter', () => { c.style.width='38px'; c.style.height='38px'; c.style.borderColor='var(--ember)'; });
    el.addEventListener('mouseleave', () => { c.style.width='22px'; c.style.height='22px'; c.style.borderColor='var(--circuit)'; });
  });
}

/* ---------- SCROLL REVEAL ---------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.15 });
  els.forEach(el=>io.observe(el));
}

/* ---------- INJECT CONTENT ---------- */
async function paintContent(){
  const c = await getContent();
  document.querySelectorAll('[data-field]').forEach(el=>{
    const key = el.dataset.field;
    if(c[key] !== undefined){
      if(el.tagName === 'A') el.href = c[key];
      else el.textContent = c[key];
    }
  });
  wireContactLinks(c.contactEmail);
  return c;
}

/* ---------- CONTACT (NAVBAR -> GMAIL) ---------- */
function wireContactLinks(email){
  const addr = (email || 'hello@example.com').trim();
  const subject = encodeURIComponent('Halo Hiroke Ninky');
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(addr)}&su=${subject}`;
  document.querySelectorAll('.nav-contact').forEach(a=>{
    a.href = gmailUrl;
    a.title = addr;
  });
}

/* ---------- BOOT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNav(document.body.dataset.page || '');
  initCursor();
  initReveal();
  paintContent();
  logVisit(document.body.dataset.page || location.pathname);
});
