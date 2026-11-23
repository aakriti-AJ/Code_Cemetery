// Local, offline syntax check. Does not validate a key with Google servers.
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(file)) { console.error('Missing .env.local. Copy .env.example, then paste your Firebase web app configuration.'); process.exit(1); }
const entries = Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/)
  .filter(line => line.trim() && !line.trim().startsWith('#'))
  .map(line => { const n = line.indexOf('='); return [line.slice(0,n).trim(),line.slice(n+1).trim().replace(/^['"]|['"]$/g,'')]; }));
const keys = ['API_KEY','AUTH_DOMAIN','PROJECT_ID','STORAGE_BUCKET','MESSAGING_SENDER_ID','APP_ID'];
let good = true;
for (const key of keys) {
  const value = entries[`VITE_FIREBASE_${key}`];
  if (!value || /^(your_|replace_|demo_|placeholder)/i.test(value)) { console.error(`Missing or placeholder VITE_FIREBASE_${key}`); good = false; }
}
const project = entries.VITE_FIREBASE_PROJECT_ID;
if (project && entries.VITE_FIREBASE_AUTH_DOMAIN !== `${project}.firebaseapp.com`) {
  console.error('Auth domain does not match the project ID. Copy the exact authDomain from Firebase.'); good = false;
}
if (entries.VITE_FIREBASE_API_KEY && !/^AIza[0-9A-Za-z_-]{30,}$/.test(entries.VITE_FIREBASE_API_KEY)) {
  console.error('The API key has an unexpected format. Recopy it from Project Settings → Web App.'); good = false;
}
if (good) console.log('Local Firebase config has all 6 fields and consistent formatting. Live OAuth/provider validation requires a browser sign-in test.');
process.exit(good ? 0 : 1);
