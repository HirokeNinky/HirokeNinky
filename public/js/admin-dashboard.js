/* ===== ADMIN DASHBOARD LOGIC (API version) ===== */
(function(){
  const DAYS = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  let sessionInfo = null;

  document.addEventListener('DOMContentLoaded', async () => {
    try{
      sessionInfo = await apiGet('/auth/session');
      if(!sessionInfo.loggedIn){ window.location.href = 'admin-login.html'; return; }
    }catch(e){ window.location.href = 'admin-login.html'; return; }

    document.getElementById('side-user').textContent = `${sessionInfo.user} (${sessionInfo.role})`;

    document.getElementById('logout-btn').addEventListener('click', async () => {
      await apiPost('/auth/logout');
      window.location.href = 'admin-login.html';
    });

    document.getElementById('admin-toggle')?.addEventListener('click', () => {
      document.getElementById('admin-side').classList.toggle('open');
    });

    // hide the accounts tab for non-owners (adding/removing accounts is owner-only)
    if(sessionInfo.role !== 'owner'){
      document.querySelector('.side-link[data-tab="accounts"]')?.remove();
    }

    initTabs();
    renderOverview();
    fillContentForm();
    renderScheduleEditor();
    fillStatsForm();
    renderAccounts();
    bindButtons();
  });

  function initTabs(){
    const links = document.querySelectorAll('.side-link[data-tab]');
    links.forEach(link=>{
      link.addEventListener('click', () => {
        links.forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p=>p.hidden = true);
        const id = 'tab-' + link.dataset.tab;
        document.getElementById(id).hidden = false;
        document.getElementById('tab-title').textContent = link.textContent.replace(/^\S+\s/, '');
        document.getElementById('admin-side').classList.remove('open');
      });
    });
  }

  function toast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2600);
  }

  /* ---------- OVERVIEW ---------- */
  async function renderOverview(){
    let summary;
    try{ summary = await apiGet('/visitors/summary'); }
    catch(e){ toast('Gagal memuat data pengunjung.'); return; }

    document.getElementById('kpi-total').textContent = summary.total.toLocaleString('id-ID');
    document.getElementById('kpi-today').textContent = `+${summary.today} hari ini`;
    document.getElementById('kpi-unique').textContent = summary.unique.toLocaleString('id-ID');
    document.getElementById('kpi-top-page').textContent = summary.topPage;

    const stats = await getStats();
    document.getElementById('kpi-live').textContent = stats.live ? 'LIVE' : 'OFFLINE';

    const chart = document.getElementById('visit-chart');
    const max = Math.max(1, ...summary.last7Days.map(d=>d.count));
    chart.innerHTML = summary.last7Days.map(d => `
      <div class="bar-col">
        <div class="bar" style="height:${Math.max(4,(d.count/max)*140)}px" title="${d.count} kunjungan"></div>
        <span class="lbl">${d.label}</span>
      </div>`).join('');

    const tbody = document.getElementById('page-breakdown');
    const entries = Object.entries(summary.pageCounts).sort((a,b)=>b[1]-a[1]);
    tbody.innerHTML = entries.map(([page,count]) => `<tr><td>${page}</td><td>${count}</td></tr>`).join('')
      || '<tr><td colspan="2">Belum ada data.</td></tr>';

    const recentBody = document.getElementById('recent-log');
    recentBody.innerHTML = summary.recent.map(v => `
      <tr>
        <td>${new Date(v.ts).toLocaleString('id-ID')}</td>
        <td>${v.page}</td>
        <td>${v.ref === 'direct' ? 'direct' : v.ref}</td>
        <td>${v.ip || '-'}</td>
      </tr>`).join('') || '<tr><td colspan="4">Belum ada kunjungan tercatat.</td></tr>';
  }

  /* ---------- CONTENT ---------- */
  const fieldMap = {
    'f-name':'name','f-tagline':'tagline','f-bio':'bio','f-announcement':'announcement',
    'f-contact-email':'contactEmail',
    'f-youtube':'youtubeUrl','f-tiktok':'tiktokUrl','f-x':'xUrl','f-instagram':'instagramUrl',
    'f-discord':'discordUrl','f-github':'githubUrl','f-komisi':'komisiUrl','f-merch':'merchUrl',
    'f-donate':'donateUrl','f-videoid':'videoId',
  };

  async function fillContentForm(){
    const c = await getContent();
    Object.entries(fieldMap).forEach(([id,key])=>{
      const el = document.getElementById(id);
      if(el) el.value = c[key] || '';
    });
    customLinksCache = Array.isArray(c.customLinks) ? c.customLinks.map(l => ({...l})) : [];
    renderCustomLinks();
  }

  async function saveContentForm(){
    const body = {};
    Object.entries(fieldMap).forEach(([id,key])=>{
      const el = document.getElementById(id);
      if(el) body[key] = el.value;
    });
    body.customLinks = collectCustomLinks();
    const res = await apiPut('/content', body);
    toast(res.ok ? 'Konten & link promosi tersimpan.' : (res.data.error || 'Gagal menyimpan.'));
  }

  /* ---------- CUSTOM LINKS ("Gerbang Tambahan") ---------- */
  let customLinksCache = [];

  function renderCustomLinks(){
    const body = document.getElementById('custom-links-body');
    if(!body) return;
    body.innerHTML = customLinksCache.map((l, i) => `
      <tr>
        <td><input data-i="${i}" data-k="icon" value="${(l.icon||'').replace(/"/g,'&quot;')}" maxlength="4" placeholder="🔗" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.15);color:var(--ash);padding:6px 8px;text-align:center;"></td>
        <td><input data-i="${i}" data-k="title" value="${(l.title||'').replace(/"/g,'&quot;')}" placeholder="Judul" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.15);color:var(--ash);padding:6px 8px;"></td>
        <td><input data-i="${i}" data-k="desc" value="${(l.desc||'').replace(/"/g,'&quot;')}" placeholder="Deskripsi singkat" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.15);color:var(--ash);padding:6px 8px;"></td>
        <td><input data-i="${i}" data-k="url" value="${(l.url||'').replace(/"/g,'&quot;')}" placeholder="https://..." style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.15);color:var(--ash);padding:6px 8px;"></td>
        <td><button type="button" class="danger-btn" data-remove="${i}">Hapus</button></td>
      </tr>`).join('') || '<tr><td colspan="5">Belum ada gerbang tambahan. Klik "+ Tambah Gerbang Baru".</td></tr>';

    body.querySelectorAll('input[data-i]').forEach(input => {
      input.addEventListener('input', () => {
        const i = Number(input.dataset.i), k = input.dataset.k;
        if(customLinksCache[i]) customLinksCache[i][k] = input.value;
      });
    });
    body.querySelectorAll('button[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        customLinksCache.splice(Number(btn.dataset.remove), 1);
        renderCustomLinks();
      });
    });
  }

  function collectCustomLinks(){
    return customLinksCache.filter(l => l && (l.title || l.url));
  }

  function addCustomLink(){
    customLinksCache.push({ id: 'cl-' + Date.now().toString(36), icon:'🔗', title:'', desc:'', url:'' });
    renderCustomLinks();
  }

  /* ---------- SCHEDULE ---------- */
  let scheduleCache = [];

  async function renderScheduleEditor(){
    scheduleCache = await apiGet('/schedule');
    const body = document.getElementById('schedule-body');
    body.innerHTML = scheduleCache.map((item, i) => `
      <tr>
        <td>${DAYS[item.day]}</td>
        <td><input data-i="${i}" data-k="title" value="${(item.title||'').replace(/"/g,'&quot;')}" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.15);color:var(--ash);padding:6px 8px;"></td>
        <td><input data-i="${i}" data-k="time" value="${item.time||''}" placeholder="20:00" style="width:90px;background:transparent;border:1px solid rgba(255,255,255,.15);color:var(--ash);padding:6px 8px;"></td>
        <td><input type="checkbox" data-i="${i}" data-k="on" ${item.on?'checked':''}></td>
      </tr>`).join('');
  }

  async function saveScheduleForm(){
    document.querySelectorAll('#schedule-body input').forEach(input=>{
      const i = Number(input.dataset.i), k = input.dataset.k;
      if(k === 'on') scheduleCache[i][k] = input.checked;
      else scheduleCache[i][k] = input.value;
    });
    const res = await apiPut('/schedule', scheduleCache);
    toast(res.ok ? 'Jadwal streaming tersimpan.' : (res.data.error || 'Gagal menyimpan.'));
  }

  /* ---------- STATS ---------- */
  async function fillStatsForm(){
    const s = await getStats();
    document.getElementById('f-yt-base').value = s.youtube || 0;
    document.getElementById('f-tt-base').value = s.tiktok || 0;
    document.getElementById('f-views-base').value = s.views || 0;
    document.getElementById('f-live-status').value = String(!!s.live);
  }

  async function saveStatsForm(){
    const body = {
      youtube: Number(document.getElementById('f-yt-base').value) || 0,
      tiktok: Number(document.getElementById('f-tt-base').value) || 0,
      views: Number(document.getElementById('f-views-base').value) || 0,
      live: document.getElementById('f-live-status').value === 'true',
    };
    const res = await apiPut('/stats', body);
    toast(res.ok ? 'Statistik dasar tersimpan.' : (res.data.error || 'Gagal menyimpan.'));
    renderOverview();
  }

  async function refreshLiveStats(){
    const statusEl = document.getElementById('refresh-status');
    statusEl.textContent = 'Menarik data dari YouTube/TikTok...';
    const res = await apiPost('/stats/refresh');
    if(res.ok){
      fillStatsForm();
      const warnings = res.data.warnings || [];
      statusEl.textContent = warnings.length
        ? 'Selesai dengan catatan: ' + warnings.join(' | ')
        : 'Berhasil menarik data live.';
      toast('Data live diperbarui.');
    }else{
      statusEl.textContent = res.data.error || 'Gagal menarik data live.';
    }
  }

  /* ---------- ACCOUNTS ---------- */
  async function renderAccounts(){
    const box = document.getElementById('accounts-list');
    if(!box) return;
    let list;
    try{ list = await apiGet('/accounts'); }
    catch(e){ box.innerHTML = '<p class="panel-sub">Gagal memuat daftar akun.</p>'; return; }

    box.innerHTML = list.map(a => `
      <div class="account-row">
        <div><strong>${a.user}</strong><div class="r-role">${a.role}</div></div>
        ${list.length > 1 ? `<button class="danger-btn" data-user="${a.user}">Hapus</button>` : '<span style="font-size:.7rem;color:var(--ash-faint);">akun terakhir</span>'}
      </div>`).join('');

    box.querySelectorAll('.danger-btn').forEach(btn=>{
      btn.addEventListener('click', async () => {
        const res = await apiDelete('/accounts/' + encodeURIComponent(btn.dataset.user));
        if(res.ok){ toast('Akun dihapus.'); renderAccounts(); }
        else toast(res.data.error || 'Gagal menghapus akun.');
      });
    });
  }

  async function addAccount(){
    const user = document.getElementById('new-acc-user').value.trim();
    const pass = document.getElementById('new-acc-pass').value;
    const role = document.getElementById('new-acc-role').value;
    if(!user || !pass){ toast('Isi username dan password dulu.'); return; }
    const res = await apiPost('/accounts', { user, pass, role });
    if(res.ok){
      document.getElementById('new-acc-user').value = '';
      document.getElementById('new-acc-pass').value = '';
      toast('Akun baru ditambahkan.');
      renderAccounts();
    }else{
      toast(res.data.error || 'Gagal menambah akun.');
    }
  }

  function bindButtons(){
    document.getElementById('save-content-btn').addEventListener('click', saveContentForm);
    document.getElementById('save-schedule-btn').addEventListener('click', saveScheduleForm);
    document.getElementById('save-stats-btn').addEventListener('click', saveStatsForm);
    document.getElementById('refresh-stats-btn')?.addEventListener('click', refreshLiveStats);
    document.getElementById('add-account-btn')?.addEventListener('click', addAccount);
    document.getElementById('add-custom-link-btn')?.addEventListener('click', addCustomLink);
  }
})();
