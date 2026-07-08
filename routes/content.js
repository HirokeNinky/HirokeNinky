const express = require('express');
const { readJSON, writeJSON } = require('../store');
const { requireAuth } = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(readJSON('content.json') || {});
});

router.put('/', requireAuth, (req, res) => {
  const current = readJSON('content.json') || {};
  const updated = { ...current, ...req.body };
  writeJSON('content.json', updated);
  res.json({ ok: true, content: updated });
});

module.exports = router;
