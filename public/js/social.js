/* ===== SOCIAL FEED PAGE LOGIC (API version) ===== */
(function(){
  function fmt(n){ return Number(n||0).toLocaleString('id-ID'); }

  async function renderStats(){
    const s = await getStats();
    const yt = document.getElementById('yt-count');
    const tt = document.getElementById('tt-count');
    if(yt) yt.textContent = fmt(s.youtube);
    if(tt) tt.textContent = fmt(s.tiktok);
  }

  function pollLoop(){
    setInterval(renderStats, 15000);
  }

  async function renderEmbed(){
    const c = await getContent();
    const frame = document.getElementById('embed-frame');
    if(!frame) return;
    if(c.videoId){
      frame.innerHTML = `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(c.videoId)}" title="Video terbaru Hiroke Ninky" loading="lazy" allowfullscreen></iframe>`;
    }
  }

  function escapeHtml(str){
    return String(str || '').replace(/[&<>"']/g, m => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[m]));
  }

  async function renderCustomLinks(){
    const c = await getContent();
    const grid = document.getElementById('custom-links-grid');
    const eyebrow = document.getElementById('custom-links-eyebrow');
    if(!grid) return;
    const links = Array.isArray(c.customLinks) ? c.customLinks.filter(l => l && l.url) : [];
    if(!links.length){
      grid.innerHTML = '';
      if(eyebrow) eyebrow.hidden = true;
      return;
    }
    if(eyebrow) eyebrow.hidden = false;
    grid.innerHTML = links.map(l => `
      <a class="other-card" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">
        <span class="icon-orb">${l.icon ? escapeHtml(l.icon) : '🔗'}</span>
        <div><h4>${escapeHtml(l.title || 'Link')}</h4><p>${escapeHtml(l.desc || '')}</p></div>
      </a>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderStats();
    pollLoop();
    renderEmbed();
    renderCustomLinks();
  });
})();
