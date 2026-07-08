/* =========================================================
   HIROKE // NINKY — Full-stack server
   Serves the frontend (public/) and a small JSON-file-backed
   API for content, schedule, stats, visitor analytics, and
   admin accounts.

   Run:
     npm install
     cp .env.example .env   (then fill in real values)
     npm start
   ========================================================= */
try{ require('dotenv').config(); }catch(e){ /* dotenv optional — install it or set env vars via your host/shell */ }

const path = require('path');
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 }, // 8 hour session
}));

/* ---------- API routes ---------- */
const { router: authRouter } = require('./routes/auth');
app.use('/api/auth', authRouter);
app.use('/api/content', require('./routes/content'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/accounts', require('./routes/accounts'));

/* ---------- static frontend ---------- */
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Hiroke Ninky full-stack server running at http://localhost:${PORT}`);
});
