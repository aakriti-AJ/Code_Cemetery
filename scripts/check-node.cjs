// Fail with an actionable message if Node.js is too old for Firebase 13.
const [major, minor, patch] = process.versions.node.split('.').map(Number);
const supported = major > 24 || (major === 24 && (minor > 12 || (minor === 12 && patch >= 0)));
if (!supported) {
  console.error('\nCode Cemetery — Pre Alpha requires Node.js 24.12.0 or newer.');
  console.error(`Current Node.js: ${process.version}`);
  console.error('Install Node 24: nvm install 24 && nvm use 24');
  console.error('Then run: npm install && npm run dev\n');
  process.exit(1);
}
