/* ===== SCHEDULE PAGE LOGIC (API version) ===== */
(function(){
  const DAYS = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

  async function getSchedule(){
    try{ return await apiGet('/schedule'); }
    catch(e){ return []; }
  }

  async function renderWeek(){
    const grid = document.getElementById('week-grid');
    if(!grid) return;
    const sched = await getSchedule();
    const todayIdx = new Date().getDay();
    grid.innerHTML = sched
      .slice()
      .sort((a,b)=> (a.day===0?7:a.day) - (b.day===0?7:b.day))
      .map(item=>{
        const isToday = item.day === todayIdx;
        return `<div class="day-card ${isToday?'today':''} ${item.on?'':'off'}">
          <span class="dname">${DAYS[item.day]}${isToday?' • Hari Ini':''}</span>
          <span class="dtitle">${item.title}</span>
          ${item.on ? `<span class="dtime">${item.time} WIB</span>` : ''}
        </div>`;
      }).join('');
    return sched;
  }

  function findNext(sched){
    const active = sched.filter(s=>s.on);
    const now = new Date();
    for(let offset=0; offset<8; offset++){
      const d = new Date(now); d.setDate(now.getDate()+offset);
      const match = active.find(s=>s.day === d.getDay());
      if(match){
        const [h,m] = match.time.split(':').map(Number);
        const target = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0);
        if(target > now) return { target, title: match.title };
      }
    }
    return null;
  }

  async function startCountdown(sched){
    const titleEl = document.getElementById('next-stream-title');
    const dEl = document.getElementById('cd-d'), hEl = document.getElementById('cd-h'),
          mEl = document.getElementById('cd-m'), sEl = document.getElementById('cd-s');
    const next = findNext(sched);
    if(!next){ if(titleEl) titleEl.textContent = 'Jadwal belum diatur'; return; }
    if(titleEl) titleEl.textContent = next.title;

    function pad(n){ return String(n).padStart(2,'0'); }
    function tick(){
      const diff = next.target - new Date();
      if(diff <= 0){ clearInterval(timer); if(titleEl) titleEl.textContent = 'Stream dimulai!'; return; }
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff/3600000)%24);
      const m = Math.floor((diff/60000)%60);
      const s = Math.floor((diff/1000)%60);
      if(dEl) dEl.textContent = pad(d);
      if(hEl) hEl.textContent = pad(h);
      if(mEl) mEl.textContent = pad(m);
      if(sEl) sEl.textContent = pad(s);
    }
    tick();
    const timer = setInterval(tick, 1000);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const sched = await renderWeek();
    startCountdown(sched || []);
  });
})();
