/* ===== HOME PAGE LOGIC (API version) ===== */
(function(){
  function fmt(n){ return Number(n||0).toLocaleString('id-ID'); }

  function animateCounter(el, target, duration){
    const start = 0;
    const startTime = performance.now();
    function tick(now){
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.floor(start + (target - start) * eased));
      if(p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(tick);
  }

  async function renderStats(){
    const s = await getStats();
    const yt = document.getElementById('stat-yt');
    const tt = document.getElementById('stat-tt');
    const vw = document.getElementById('stat-views');
    if(yt) animateCounter(yt, s.youtube || 0, 1400);
    if(tt) animateCounter(tt, s.tiktok || 0, 1400);
    if(vw) animateCounter(vw, s.views || 0, 1600);

    const liveState = document.getElementById('live-state');
    if(liveState){
      liveState.textContent = s.live ? 'LIVE NOW' : 'OFFLINE';
      liveState.classList.toggle('on', !!s.live);
    }
  }

  // poll the backend periodically — this is where truly live numbers
  // arrive once the admin panel (or a cron job) calls POST /api/stats/refresh
  function startPolling(){
    setInterval(async ()=>{
      const s = await getStats();
      const yt = document.getElementById('stat-yt');
      const tt = document.getElementById('stat-tt');
      const vw = document.getElementById('stat-views');
      if(yt) yt.textContent = fmt(s.youtube);
      if(tt) tt.textContent = fmt(s.tiktok);
      if(vw) vw.textContent = fmt(s.views);
    }, 15000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderStats();
    startPolling();
  });
})();
