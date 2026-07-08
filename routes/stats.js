const express = require('express');
const fetch = require('node-fetch');
const { readJSON, writeJSON } = require('../store');
const { requireAuth } = require('./auth');

const router = express.Router();

/* ---------- public: current cached stats ---------- */
router.get('/', (req, res) => {
  res.json(readJSON('stats.json') || {});
});

/* ---------- authenticated: manual override from the control panel ---------- */
router.put('/', requireAuth, (req, res) => {
  const current = readJSON('stats.json') || {};
  const updated = { ...current, ...req.body, source: 'manual', lastRefreshed: Date.now() };
  writeJSON('stats.json', updated);
  res.json({ ok: true, stats: updated });
});

/* ---------- authenticated: pull real numbers from YouTube (and best-effort TikTok) ----------
   Requires YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID in .env.
   TikTok has no official public follower-count API, so this attempts a
   best-effort scrape of the public profile page. It can fail or be blocked —
   that's expected; the endpoint still returns whatever it could fetch. */
router.post('/refresh', requireAuth, async (req, res) => {
  const current = readJSON('stats.json') || {};
  const result = { ...current };
  const errors = [];

  // --- YouTube ---
  const ytKey = process.env.YOUTUBE_API_KEY;
  const ytChannelId = process.env.YOUTUBE_CHANNEL_ID;
  if(ytKey && ytChannelId){
    try{
      const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${ytChannelId}&key=${ytKey}`;
      const r = await fetch(url);
      const data = await r.json();
      const stats = data?.items?.[0]?.statistics;
      if(stats){
        result.youtube = Number(stats.subscriberCount) || result.youtube;
        result.views = Number(stats.viewCount) || result.views;
      }else{
        errors.push('YouTube: tidak ada data channel, cek YOUTUBE_CHANNEL_ID.');
      }
    }catch(e){
      errors.push('YouTube: gagal fetch — ' + e.message);
    }
  }else{
    errors.push('YouTube: YOUTUBE_API_KEY / YOUTUBE_CHANNEL_ID belum diatur di .env.');
  }

  // --- TikTok (best-effort, unofficial) ---
  const ttUser = process.env.TIKTOK_USERNAME;
  if(ttUser){
    try{
      const r = await fetch(`https://www.tiktok.com/@${ttUser}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HirokeNinkyBot/1.0)' },
      });
      const html = await r.text();
      const match = html.match(/"followerCount":(\d+)/);
      if(match){
        result.tiktok = Number(match[1]);
      }else{
        errors.push('TikTok: tidak menemukan followerCount di HTML (struktur halaman mungkin berubah).');
      }
    }catch(e){
      errors.push('TikTok: gagal fetch — ' + e.message);
    }
  }else{
    errors.push('TikTok: TIKTOK_USERNAME belum diatur di .env.');
  }

  result.source = 'live-refresh';
  result.lastRefreshed = Date.now();
  writeJSON('stats.json', result);
  res.json({ ok: true, stats: result, warnings: errors });
});

module.exports = router;
