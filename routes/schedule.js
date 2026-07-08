const express = require('express');
const { readJSON, writeJSON } = require('../store');
const { requireAuth } = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(readJSON('schedule.json') || []);
});

router.put('/', requireAuth, (req, res) => {
  if(!Array.isArray(req.body)) return res.status(400).json({ error: 'Jadwal harus berupa array.' });
  writeJSON('schedule.json', req.body);
  res.json({ ok: true, schedule: req.body });
});

module.exports = router;
