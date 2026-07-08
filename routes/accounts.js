const express = require('express');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../store');
const { requireAuth, requireOwner } = require('./auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const accounts = (readJSON('accounts.json') || []).map(a => ({ user: a.user, role: a.role, created: a.created }));
  res.json(accounts);
});

router.post('/', requireOwner, (req, res) => {
  const { user, pass, role } = req.body || {};
  if(!user || !pass) return res.status(400).json({ error: 'Username dan password wajib diisi.' });
  const accounts = readJSON('accounts.json') || [];
  if(accounts.some(a => a.user === user)) return res.status(409).json({ error: 'Username sudah dipakai.' });

  accounts.push({
    user,
    passHash: bcrypt.hashSync(pass, 10),
    role: role === 'owner' ? 'owner' : 'editor',
    created: Date.now(),
  });
  writeJSON('accounts.json', accounts);
  res.json({ ok: true });
});

router.delete('/:user', requireOwner, (req, res) => {
  const targetUser = req.params.user;
  if(targetUser === req.session.user) return res.status(400).json({ error: 'Tidak bisa menghapus akun yang sedang login.' });

  let accounts = readJSON('accounts.json') || [];
  if(accounts.length <= 1) return res.status(400).json({ error: 'Minimal harus ada satu akun.' });

  accounts = accounts.filter(a => a.user !== targetUser);
  writeJSON('accounts.json', accounts);
  res.json({ ok: true });
});

module.exports = router;
