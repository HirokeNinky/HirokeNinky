const express = require('express');
const { readJSON, writeJSON } = require('../store');
const { requireAuth } = require('./auth');

const router = express.Router();

/* called by the frontend on every page load (see public/js/common.js) */
router.post('/log', (req, res) => {
  const log = readJSON('visitors.json') || [];
  log.push({
    page: req.body?.page || 'unknown',
    ts: Date.now(),
    ref: req.get('referer') || 'direct',
    ua: (req.get('user-agent') || '').slice(0, 80),
    ip: req.ip,
  });
  if(log.length > 20000) log.splice(0, log.length - 20000);
  writeJSON('visitors.json', log);
  res.json({ ok: true });
});

/* authenticated: aggregated analytics for the dashboard */
router.get('/summary', requireAuth, (req, res) => {
  const log = readJSON('visitors.json') || [];

  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const todayCount = log.filter(v => v.ts >= todayStart.getTime()).length;

  const uniq = new Set(log.map(v => v.ip + '_' + v.ua));

  const pageCounts = {};
  log.forEach(v => { pageCounts[v.page] = (pageCounts[v.page] || 0) + 1; });
  const topPage = Object.entries(pageCounts).sort((a,b)=>b[1]-a[1])[0];

  const days = [];
  for(let i=6;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i); d.setHours(0,0,0,0);
    const next = new Date(d); next.setDate(d.getDate()+1);
    const count = log.filter(v => v.ts >= d.getTime() && v.ts < next.getTime()).length;
    days.push({ label: d.toLocaleDateString('id-ID', { weekday:'short' }), count });
  }

  res.json({
    total: log.length,
    today: todayCount,
    unique: uniq.size,
    topPage: topPage ? topPage[0] : '-',
    pageCounts,
    last7Days: days,
    recent: log.slice(-25).reverse(),
  });
});

module.exports = router;
