const express = require('express');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../store');

const router = express.Router();

/* Seed a default owner account on first boot if none exist yet. */
function ensureSeedAccount(){
  const accounts = readJSON('accounts.json') || [];
  if(accounts.length === 0){
    const hash = bcrypt.hashSync('demonKing777', 10);
    accounts.push({ user: 'hiroke', passHash: hash, role: 'owner', created: Date.now() });
    writeJSON('accounts.json', accounts);
    console.log('[auth] Seeded default account -> user: hiroke / pass: demonKing777 (change this immediately)');
  }
}
ensureSeedAccount();

/* ---------- middleware ---------- */
function requireAuth(req, res, next){
  if(req.session && req.session.user) return next();
  return res.status(401).json({ error: 'Belum login. Silakan login dulu.' });
}
function requireOwner(req, res, next){
  if(req.session && req.session.user && req.session.role === 'owner') return next();
  return res.status(403).json({ error: 'Hanya akun Owner yang boleh melakukan ini.' });
}

/* ---------- routes ---------- */
router.post('/login', (req, res) => {
  const { user, pass } = req.body || {};
  if(!user || !pass) return res.status(400).json({ error: 'Username dan password wajib diisi.' });

  const accounts = readJSON('accounts.json') || [];
  const match = accounts.find(a => a.user === user);
  if(!match || !bcrypt.compareSync(pass, match.passHash)){
    return res.status(401).json({ error: 'Username atau password salah. Rift menolak masuk.' });
  }

  req.session.user = match.user;
  req.session.role = match.role;
  res.json({ ok: true, user: match.user, role: match.role });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/session', (req, res) => {
  if(req.session && req.session.user){
    res.json({ loggedIn: true, user: req.session.user, role: req.session.role });
  }else{
    res.json({ loggedIn: false });
  }
});

module.exports = { router, requireAuth, requireOwner };
