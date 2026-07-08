/* Tiny file-based JSON store.
   Good enough for a small creator site with a handful of admins.
   For heavier traffic, swap this for a real database (SQLite/Postgres)
   without changing the route files much — just change these two functions. */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function readJSON(name){
  const file = path.join(DATA_DIR, name);
  if(!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJSON(name, data){
  const file = path.join(DATA_DIR, name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { readJSON, writeJSON };
